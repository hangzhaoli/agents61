/**
 * Clerk coordinator: route a chat line into desk tools.
 * Does not write a master brief. Staffs digital identities, then hands off.
 * Optional research-prep path returns fundamentals/sentiment/valuation blocks — never a buy score.
 */

import { MASTERS, getMasterBySlug } from '@/lib/masters';
import { WORK_KITS } from '@/lib/work-kits';
import { parseTokenExtra, type TokenExtraId } from '@/lib/token-extras';
import type { ResearchPrep } from '@/lib/desk/research-pipeline';

export type ClerkTool = {
  id: 'convene' | 'screen' | 'kit' | 'extra' | 'cycle' | 'quant' | 'prep';
  label: string;
  href: string;
  extra?: TokenExtraId;
};

export type StaffedIdentity = {
  slug: string;
  nameEn: string;
  role: string;
  methodology: string;
  signature: string;
  unaffiliated: true;
};

export type ClerkRoute = {
  reply: string;
  tools: ClerkTool[];
  staffed: StaffedIdentity[];
  /** When set, clerk should run research-prep for this ticker (no averaging). */
  prepTicker?: string;
  /** Filled by /api/desk/clerk after runResearchPrep — shared FACTS only. */
  researchPrep?: ResearchPrep;
};

const TICKER_RE = /\b([A-Z]{1,5})(?:-(B|USD))?\b/g;
const KNOWN = new Set([
  'AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'META', 'TSLA', 'BRK', 'KO', 'JPM',
  'XOM', 'UNH', 'V', 'MA', 'AVGO', 'LLY', 'WMT', 'SPCX', 'QQQ', 'SPY',
  'BTC', 'ETH', 'SOL', 'MSFT',
]);

function staffOf(slugs: string[]): StaffedIdentity[] {
  const out: StaffedIdentity[] = [];
  const seen = new Set<string>();
  for (const slug of slugs) {
    if (seen.has(slug)) continue;
    const m = getMasterBySlug(slug);
    if (!m) continue;
    seen.add(slug);
    out.push({
      slug: m.slug,
      nameEn: m.nameEn,
      role: m.role,
      methodology: m.methodology,
      signature: m.signature,
      unaffiliated: true,
    });
  }
  return out;
}

function mentionedMasters(text: string): string[] {
  const lower = text.toLowerCase();
  return MASTERS.filter((m) => {
    if (lower.includes(m.slug.replace(/-/g, ' '))) return true;
    if (lower.includes(m.nameEn.toLowerCase())) return true;
    const last = m.nameEn.split(' ').pop()?.toLowerCase() ?? '';
    return last.length > 3 && new RegExp(`\\b${last}\\b`, 'i').test(text);
  }).map((m) => m.slug);
}

function mentionedTickers(text: string): string[] {
  const upper = text.toUpperCase();
  const found: string[] = [];
  let m: RegExpExecArray | null;
  const re = new RegExp(TICKER_RE.source, 'g');
  while ((m = re.exec(upper))) {
    const sym = m[1] === 'BRK' && m[2] === 'B' ? 'BRK-B' : m[2] === 'USD' ? `${m[1]}-USD` : m[1];
    if (KNOWN.has(m[1]) || KNOWN.has(sym)) found.push(sym);
  }
  return [...new Set(found)];
}

/** “prep AAPL”, “research prep MSFT”, “screen fundamentals for KO”, etc. */
export function detectPrepIntent(text: string): string | null {
  const prepVerb = /\b(prep|prepare|research[\s-]?prep|screen\s+(fundamentals?|facts)|fundamentals?\s+for)\b/i.test(
    text
  );
  if (!prepVerb) return null;
  const tickers = mentionedTickers(text);
  if (tickers[0]) return tickers[0];
  // “prep AAPL” when ticker was lowercase in original — re-scan raw tokens
  const loose = text.toUpperCase().match(/\b([A-Z]{1,5})\b/g);
  if (!loose) return null;
  for (const t of loose) {
    if (KNOWN.has(t) && t !== 'PREP') return t;
  }
  return null;
}

export function formatPrepClerkReply(
  ticker: string,
  prep: ResearchPrep,
  opts?: { forCommittee?: boolean }
): string {
  const conveneHint = opts?.forCommittee
    ? `Prep for ${ticker} is ready as shared FACTS. Next: convene isolated seats — I will not average them into a committee buy score.`
    : 'Seats still write isolated briefs. I will not average this into a rating. Pick convene when ready.';
  const lines = [
    `Research-prep for ${ticker} (shared FACTS/CONTEXT only — not a committee buy score).`,
    '',
    `Fundamentals: ${prep.fundamentals.summary}`,
    ...prep.fundamentals.highlights.slice(0, 8).map((h) => `· ${h}`),
    '',
    `Sentiment: ${prep.sentiment.summary}`,
    ...prep.sentiment.highlights.slice(0, 4).map((h) => `· ${h}`),
    '',
    `Valuation: ${prep.valuation.summary}`,
    ...prep.valuation.highlights.slice(0, 6).map((h) => `· ${h}`),
    '',
    conveneHint,
  ];
  return lines.join('\n');
}

/** True when user wants prep then committee handoff (still no auto-average). */
export function detectPrepForCommittee(text: string): boolean {
  return /\b(for\s+(the\s+)?committee|then\s+convene|prep\s+then\s+convene|ready\s+to\s+convene)\b/i.test(
    text
  );
}

export function routeClerkMessage(raw: string, extraHint?: string | null): ClerkRoute {
  const text = raw.trim();
  const extra = parseTokenExtra(extraHint) ?? (/\b(10-?k|10-?q|filing|transcript|年报|财报)\b/i.test(text)
    ? 'filing_extract'
    : /\b(buy|sell|trigger|invalidat|买入|卖出|止损)\b/i.test(text)
      ? 'trigger_pack'
      : null);
  const slugs = mentionedMasters(text);
  const tickers = mentionedTickers(text);
  const prepTicker = detectPrepIntent(text);
  const staffed = staffOf(slugs.slice(0, 6));
  const tools: ClerkTool[] = [];

  if (prepTicker) {
    const forCommittee = detectPrepForCommittee(text);
    tools.push({
      id: 'prep',
      label: `Research-prep ${prepTicker} (facts only)`,
      href: `/dashboard?entry=clerk&q=${encodeURIComponent(`prep ${prepTicker}`)}`,
    });
    tools.push({
      id: 'convene',
      label: forCommittee
        ? `Next: convene isolated seats on ${prepTicker}`
        : `Convene isolated seats on ${prepTicker}`,
      href: `/dashboard?entry=analyze&q=${encodeURIComponent(`Research ${prepTicker}`)}`,
    });
  }

  if (extra === 'filing_extract') {
    tools.push({
      id: 'extra',
      label: 'Run filing extract (token extra)',
      href: '/dashboard?entry=clerk&extra=filing_extract',
      extra: 'filing_extract',
    });
  }
  if (extra === 'trigger_pack') {
    tools.push({
      id: 'extra',
      label: 'Run trigger / invalidation pack (token extra)',
      href: '/dashboard?entry=clerk&extra=trigger_pack',
      extra: 'trigger_pack',
    });
  }

  if (tickers[0] && !prepTicker) {
    const t = tickers[0];
    const staffBit = slugs.length ? ` Staff ${staffed.map((s) => s.nameEn).join(', ')}.` : '';
    tools.push({
      id: 'convene',
      label: `Convene isolated seats on ${t}`,
      href: `/dashboard?entry=analyze&q=${encodeURIComponent(`Research ${t}.${staffBit}`)}${
        slugs.length ? `&masters=${slugs.slice(0, 6).join(',')}` : ''
      }`,
    });
    tools.push({
      id: 'prep',
      label: `Prep facts for ${t}`,
      href: `/dashboard?entry=clerk&q=${encodeURIComponent(`prep ${t}`)}`,
    });
  }

  const kit = WORK_KITS.find(
    (k) => k.staff.some((s) => slugs.includes(s)) || text.toLowerCase().includes(k.id.replace(/-/g, ' '))
  );
  if (kit) {
    tools.push({ id: 'kit', label: `Open kit: ${kit.title}`, href: kit.href });
  }

  if (/\b(screen|filter|lineup|过滤|筛选)\b/i.test(text) || (slugs.length && !tickers.length && !extra && !prepTicker)) {
    const masters = (slugs.length ? slugs : ['peter-lynch']).slice(0, 4).join(',');
    tools.push({
      id: 'screen',
      label: 'Open lineup screen with those seats',
      href: `/dashboard?entry=lineup&market=us&masters=${masters}`,
    });
  }

  if (/\b(cycle|regime|thermometer|周期)\b/i.test(text)) {
    tools.push({ id: 'cycle', label: 'Open cycle meter', href: '/cycle' });
  }
  if (/\b(backtest|kelly|quant|回测)\b/i.test(text)) {
    tools.push({ id: 'quant', label: 'Open Quant Lab', href: '/dashboard?entry=quant' });
  }

  if (tools.length === 0) {
    tools.push({
      id: 'convene',
      label: 'Ask the committee (isolated briefs)',
      href: '/dashboard?entry=analyze',
    });
    tools.push({
      id: 'kit',
      label: 'Browse investor work kits',
      href: '/dashboard/kits',
    });
  }

  const who = staffed.length
    ? `I can staff ${staffed.map((s) => s.nameEn).join(', ')} as unaffiliated digital identities — they still write alone.`
    : 'I coordinate. I do not write a master brief or average a rating.';
  const prepLine = prepTicker
    ? detectPrepForCommittee(text)
      ? ` Running research-prep on ${prepTicker}, then you can convene isolated seats — shared context only, no averaged buy score.`
      : ` Running research-prep on ${prepTicker} (fundamentals / sentiment / valuation heuristics) — shared context only, no composite buy score.`
    : '';
  const tickerLine =
    !prepTicker && tickers[0]
      ? ` ${tickers[0]} can go to research-prep then isolated seat briefs — no composite buy score.`
      : '';
  const extraLine =
    extra === 'trigger_pack'
      ? ' Trigger / invalidation is a token extra: conditions a seat would watch — not a buy or sell order.'
      : extra === 'filing_extract'
        ? ' A filing extract is a token extra: facts and questions, then seats write.'
        : '';

  return {
    reply: `${who}${prepLine}${tickerLine}${extraLine} Pick a tool. Empty seats stay empty.`,
    tools: tools.slice(0, 4),
    staffed,
    ...(prepTicker ? { prepTicker } : {}),
  };
}
