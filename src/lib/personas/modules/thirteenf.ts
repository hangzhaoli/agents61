import type { SourcePack, ThirteenFFact } from '@/lib/personas/source-pack/types';

const DEFAULT_LAG =
  '13F FACTS ONLY — quarterly reporting lag (~45 days after quarter-end), incomplete picture (no shorts / timing nuance), not a follow signal, not advice.';

const ILLUSTRATIVE =
  'ILLUSTRATIVE / LAGGED PUBLIC RECORD — sample holdings below are for methodology context only. Do not treat as “this master owns X so you should.” Verify on SEC EDGAR before citing as current.';

export type ThirteenFFetchResult = {
  source: 'edgar' | 'pack-static';
  cik?: string;
  holdings: ThirteenFFact[];
  note: string;
  /** Always true — UI must surface lag. */
  lagAlwaysShown: true;
};

/**
 * Short UI string — always shown when a pack carries thirteenF context.
 */
export function thirteenFLagUiNote(pack: SourcePack): string {
  const custom = pack.thirteenF?.lagDisclaimer?.trim();
  if (custom && custom.length <= 160) {
    return custom;
  }
  return '13F sample is illustrative / lagged (~45 days) — not a follow signal. Verify on EDGAR.';
}

/**
 * Optional EDGAR-ish 13F JSON fetch — env-gated so builds/CI never depend on network.
 * Set AGENTS61_FETCH_13F=1 to attempt; on any failure, callers should use pack-static.
 *
 * Expects a pre-normalized JSON URL in AGENTS61_13F_JSON_URL (array of {symbol, approxWeightNote?, note?})
 * or falls back immediately. We do not scrape EDGAR HTML in-process.
 * Timeout defaults to 4s (AbortSignal.timeout).
 */
export async function fetchThirteenFHoldings(
  pack: SourcePack,
  opts?: { signal?: AbortSignal; timeoutMs?: number }
): Promise<ThirteenFFetchResult | null> {
  if (process.env.AGENTS61_FETCH_13F !== '1') return null;
  const url = process.env.AGENTS61_13F_JSON_URL?.trim();
  const cik = pack.thirteenF?.cik;
  if (!url || !cik) return null;

  const timeoutMs = opts?.timeoutMs ?? 4_000;

  try {
    const res = await fetch(url, {
      signal: opts?.signal ?? AbortSignal.timeout(timeoutMs),
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as unknown;
    const rows = Array.isArray(data)
      ? data
      : data && typeof data === 'object' && Array.isArray((data as { holdings?: unknown }).holdings)
        ? (data as { holdings: unknown[] }).holdings
        : null;
    if (!rows?.length) return null;

    const holdings: ThirteenFFact[] = [];
    for (const row of rows.slice(0, 12)) {
      const r = row as Record<string, unknown>;
      const symbol = String(r.symbol ?? r.ticker ?? '').toUpperCase().trim();
      if (!symbol) continue;
      holdings.push({
        symbol,
        ...(r.approxWeightNote != null ? { approxWeightNote: String(r.approxWeightNote) } : {}),
        note: r.note != null ? String(r.note) : 'from AGENTS61_13F_JSON_URL — verify EDGAR',
      });
    }

    if (!holdings.length) return null;
    return {
      source: 'edgar',
      cik,
      holdings,
      note: ILLUSTRATIVE,
      lagAlwaysShown: true,
    };
  } catch {
    return null;
  }
}

function staticFromPack(pack: SourcePack): ThirteenFFetchResult | null {
  const t = pack.thirteenF;
  if (!t?.holdingsSample?.length) return null;
  return {
    source: 'pack-static',
    cik: t.cik,
    holdings: t.holdingsSample,
    note: ILLUSTRATIVE,
    lagAlwaysShown: true,
  };
}

/**
 * Format optional 13F context. Always prepends lag disclaimer + illustrative label.
 * Prefer pack-static sample; pass `fetched` when an env-gated fetch succeeded.
 */
export function formatThirteenFContext(
  pack: SourcePack,
  fetched?: ThirteenFFetchResult | null
): string {
  const t = pack.thirteenF;
  if (!t) return '';

  const sample = fetched?.holdings?.length ? fetched : staticFromPack(pack);
  const lines = [
    t.lagDisclaimer || DEFAULT_LAG,
    ILLUSTRATIVE,
    'UI NOTE: lag disclaimer is always shown with pack evidence — never omit.',
    t.cik ? `CIK: ${t.cik} (verify on SEC EDGAR)` : null,
    sample
      ? `Sample source: ${sample.source}${sample.source === 'pack-static' ? ' (illustrative, may lag)' : ' (env fetch — still lagged public record; timeout-bounded)'}`
      : 'No holdings sample on this pack.',
    ...(sample?.holdings ?? []).map((h) => {
      const bits = [h.symbol, h.approxWeightNote, h.note].filter(Boolean);
      return `- ${bits.join(' · ')}`;
    }),
  ].filter(Boolean);

  return `13F CONTEXT:\n${lines.join('\n')}`;
}

/**
 * Resolve 13F sample for a pack: try env fetch (timeout), else pack-static. Never throws.
 */
export async function resolveThirteenFSample(pack: SourcePack): Promise<ThirteenFFetchResult | null> {
  try {
    const live = await fetchThirteenFHoldings(pack);
    if (live) return live;
  } catch {
    /* fall through */
  }
  return staticFromPack(pack);
}
