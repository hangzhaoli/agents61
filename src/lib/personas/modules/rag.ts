import { getSourcePack } from '@/lib/personas/source-pack';
import type { PackExcerpt, RankedExcerpt } from '@/lib/personas/source-pack/types';

/** Stem / phrase aliases so “moats” hits “moat”, “margin of safety” hits tag fragments, etc. */
const ALIASES: Record<string, string[]> = {
  moat: ['moats', 'moaty', 'advantage', 'durable'],
  moats: ['moat'],
  margin: ['safety', 'mos'],
  safety: ['margin'],
  peg: ['garp', 'growth'],
  garp: ['peg'],
  invert: ['inversion', 'kill-shot', 'killshot'],
  inversion: ['invert'],
  cycle: ['pendulum', 'regime', 'credit'],
  pendulum: ['cycle'],
  cash: ['fcf', 'owner'],
  roic: ['roe', 'return', 'roc'],
  roc: ['roic', 'return'],
  classify: ['category', 'stalwart', 'ten-bagger', 'tenbagger'],
  // Phase 3 packs
  innovation: ['disruption', 'platform', 's-curve', 'tam'],
  disruption: ['innovation', 'platform'],
  platform: ['innovation', 'tam', 'stack'],
  tam: ['addressable', 'market', 'adoption'],
  adoption: ['s-curve', 'tam'],
  canslim: ['breakout', 'earnings', 'timing', 'ibd'],
  breakout: ['canslim', 'base', 'volume'],
  magic: ['formula', 'earnings', 'yield', 'roic'],
  formula: ['magic', 'roic', 'yield'],
  forensic: ['accounting', 'footnote', 'earnings', 'quality'],
  accounting: ['forensic', 'footnote'],
  kelly: ['sizing', 'bankroll', 'fractional', 'edge'],
  bankroll: ['kelly', 'ruin'],
  ruin: ['kelly', 'bankroll'],
  pessimism: ['templeton', 'contrarian', 'bargain'],
  bargain: ['pessimism', 'value'],
  inflection: ['commercialization', 'stack', 'growth'],
  // Phase 5 packs
  scuttlebutt: ['fisher', 'fifteen', 'growth', 'research'],
  reflexivity: ['soros', 'feedback', 'boom', 'bust'],
  liquidity: ['druckenmiller', 'macro', 'flow'],
  activist: ['ackman', 'catalyst', 'pershing'],
  cloning: ['pabrai', 'buffett', 'clone'],
  stop: ['livermore', 'tape', 'pivot'],
  signal: ['simons', 'stat', 'renaissance'],
};

function tokenize(s: string): Set<string> {
  const raw = s
    .toLowerCase()
    .split(/[^a-z0-9_+/-]+/)
    .filter((t) => t.length > 2);

  const out = new Set<string>(raw);
  const lower = s.toLowerCase();
  if (lower.includes('margin of safety')) {
    out.add('margin');
    out.add('safety');
    out.add('mos');
  }
  if (lower.includes('know what you own')) {
    out.add('know');
    out.add('homework');
  }
  if (lower.includes('second-level') || lower.includes('second level')) {
    out.add('second-level');
    out.add('consensus');
  }
  if (lower.includes('magic formula')) {
    out.add('magic');
    out.add('formula');
    out.add('roic');
    out.add('earnings');
    out.add('yield');
  }
  if (lower.includes('canslim') || lower.includes('can slim')) {
    out.add('canslim');
    out.add('breakout');
    out.add('earnings');
  }
  if (lower.includes('kelly') || lower.includes('fractional kelly')) {
    out.add('kelly');
    out.add('sizing');
    out.add('bankroll');
  }
  if (lower.includes('s-curve') || lower.includes('s curve')) {
    out.add('adoption');
    out.add('tam');
    out.add('innovation');
  }
  if (lower.includes('scuttlebutt')) {
    out.add('scuttlebutt');
    out.add('fisher');
    out.add('research');
  }
  if (lower.includes('reflexivity')) {
    out.add('reflexivity');
    out.add('soros');
    out.add('feedback');
  }

  for (const t of [...out]) {
    const al = ALIASES[t];
    if (al) for (const a of al) out.add(a);
    if (t.endsWith('s') && t.length > 4) out.add(t.slice(0, -1));
  }
  return out;
}

function excerptBag(ex: PackExcerpt): string {
  return [ex.quote, ex.work, ex.locator, ...ex.tags].join(' ');
}

function rankByKeyword(excerpts: PackExcerpt[], query: string, k: number): RankedExcerpt[] {
  const q = tokenize(query);
  const ranked: RankedExcerpt[] = excerpts.map((ex) => {
    const bag = tokenize(excerptBag(ex));
    let score = 0;
    for (const t of q) {
      if (bag.has(t)) score += 1;
      if (ex.tags.some((tag) => tag.toLowerCase().includes(t) || t.includes(tag.toLowerCase()))) {
        score += 2;
      }
    }
    if (
      ex.tags.some((tag) =>
        [
          'moat',
          'risk',
          'inversion',
          'PEG',
          'margin of safety',
          'margin',
          'CANSLIM',
          'magic formula',
          'Kelly',
          'forensic',
          'TAM',
          'S-curve',
          'scuttlebutt',
          'reflexivity',
          'liquidity',
          'activist',
          'stop',
        ].includes(tag)
      )
    ) {
      score += 0.25;
    }
    return { ...ex, score };
  });

  ranked.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  const top = ranked.filter((r) => r.score > 0).slice(0, k);
  if (top.length >= Math.min(k, excerpts.length)) return top;
  return ranked.slice(0, k);
}

// ── Embeddings-lite (optional) ──────────────────────────────────────────────

type EmbedCacheEntry = { vector: number[]; text: string };

/** In-memory per-process cache: `${slug}::${excerptId}` → embedding. */
const EMBED_CACHE = new Map<string, EmbedCacheEntry>();
const WARM_INFLIGHT = new Map<string, Promise<void>>();

function embeddingApiConfig(): {
  key: string;
  base: string;
  model: string;
} | null {
  const key =
    process.env.OPENAI_API_KEY?.trim() ||
    process.env.AGENTS61_EMBEDDING_API_KEY?.trim() ||
    '';
  if (!key) return null;
  const base = (
    process.env.AGENTS61_EMBEDDING_BASE_URL?.trim() ||
    process.env.OPENAI_BASE_URL?.trim() ||
    'https://api.openai.com/v1'
  ).replace(/\/$/, '');
  const model =
    process.env.AGENTS61_EMBEDDING_MODEL?.trim() || 'text-embedding-3-small';
  return { key, base, model };
}

/** True when an embeddings-capable API key is configured (not whether cache is warm). */
export function canUseEmbeddingsLite(): boolean {
  return embeddingApiConfig() != null;
}

function cosine(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (n === 0) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < n; i++) {
    dot += a[i]! * b[i]!;
    na += a[i]! * a[i]!;
    nb += b[i]! * b[i]!;
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

async function embedTexts(texts: string[]): Promise<(number[] | null)[]> {
  const cfg = embeddingApiConfig();
  if (!cfg || texts.length === 0) return texts.map(() => null);

  try {
    const res = await fetch(`${cfg.base}/embeddings`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: cfg.model, input: texts }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return texts.map(() => null);
    const json = (await res.json()) as {
      data?: Array<{ embedding?: number[]; index?: number }>;
    };
    const out: (number[] | null)[] = texts.map(() => null);
    for (const row of json.data ?? []) {
      const i = row.index ?? 0;
      if (Array.isArray(row.embedding) && row.embedding.length) {
        out[i] = row.embedding;
      }
    }
    return out;
  } catch {
    return texts.map(() => null);
  }
}

function cacheKey(slug: string, excerptId: string): string {
  return `${slug}::${excerptId}`;
}

function packEmbeddingsReady(slug: string, excerpts: PackExcerpt[]): boolean {
  return excerpts.every((ex) => EMBED_CACHE.has(cacheKey(slug, ex.id)));
}

/**
 * Warm in-memory embeddings for a pack's excerpts (no-op without API key).
 * Safe to call repeatedly; concurrent warms coalesce.
 */
export async function warmPackEmbeddings(slug: string): Promise<boolean> {
  if (!canUseEmbeddingsLite()) return false;
  const pack = getSourcePack(slug);
  if (!pack || pack.excerpts.length === 0) return false;
  if (packEmbeddingsReady(slug, pack.excerpts)) return true;

  const existing = WARM_INFLIGHT.get(slug);
  if (existing) {
    await existing;
    return packEmbeddingsReady(slug, pack.excerpts);
  }

  const job = (async () => {
    const missing = pack.excerpts.filter((ex) => !EMBED_CACHE.has(cacheKey(slug, ex.id)));
    if (!missing.length) return;
    const vectors = await embedTexts(missing.map((ex) => excerptBag(ex)));
    for (let i = 0; i < missing.length; i++) {
      const v = vectors[i];
      const ex = missing[i]!;
      if (v?.length) {
        EMBED_CACHE.set(cacheKey(slug, ex.id), { vector: v, text: excerptBag(ex) });
      }
    }
  })();

  WARM_INFLIGHT.set(slug, job);
  try {
    await job;
  } finally {
    WARM_INFLIGHT.delete(slug);
  }
  return packEmbeddingsReady(slug, pack.excerpts);
}

function rankByEmbedding(
  slug: string,
  excerpts: PackExcerpt[],
  queryVec: number[],
  k: number
): RankedExcerpt[] {
  const ranked: RankedExcerpt[] = [];
  for (const ex of excerpts) {
    const cached = EMBED_CACHE.get(cacheKey(slug, ex.id));
    if (!cached) continue;
    ranked.push({ ...ex, score: cosine(queryVec, cached.vector) });
  }
  ranked.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return ranked.slice(0, k);
}

/**
 * Keyword/tag overlap retrieval — default path, no network.
 */
export function retrieveExcerptsKeyword(slug: string, query: string, k = 3): RankedExcerpt[] {
  const pack = getSourcePack(slug);
  if (!pack || pack.excerpts.length === 0) return [];
  return rankByKeyword(pack.excerpts, query, k);
}

/**
 * Sync retrieve: uses embeddings-lite when pack vectors are already cached;
 * otherwise keyword/tag path. Schedules a background warm when an API key exists.
 */
export function retrieveExcerpts(slug: string, query: string, k = 3): RankedExcerpt[] {
  const pack = getSourcePack(slug);
  if (!pack || pack.excerpts.length === 0) return [];

  if (canUseEmbeddingsLite() && packEmbeddingsReady(slug, pack.excerpts)) {
    const qCached = EMBED_CACHE.get(`__query__::${slug}::${query}`);
    // Query vectors are not cached long-term; keyword fallback if we can't embed sync.
    // Prefer keyword here; callers needing cosine should use retrieveExcerptsAsync.
    void warmPackEmbeddings(slug);
    // If we somehow have a query embedding cached (tests), use cosine
    if (qCached) {
      return rankByEmbedding(slug, pack.excerpts, qCached.vector, k);
    }
  } else if (canUseEmbeddingsLite()) {
    void warmPackEmbeddings(slug);
  }

  return rankByKeyword(pack.excerpts, query, k);
}

/**
 * Best available method: warm pack embeddings when configured, embed the query,
 * cosine-rank; fall back to keyword on any failure.
 */
export async function retrieveExcerptsAsync(
  slug: string,
  query: string,
  k = 3
): Promise<RankedExcerpt[]> {
  const pack = getSourcePack(slug);
  if (!pack || pack.excerpts.length === 0) return [];

  if (!canUseEmbeddingsLite()) {
    return rankByKeyword(pack.excerpts, query, k);
  }

  const warmed = await warmPackEmbeddings(slug);
  if (!warmed) return rankByKeyword(pack.excerpts, query, k);

  const [qVec] = await embedTexts([query]);
  if (!qVec?.length) return rankByKeyword(pack.excerpts, query, k);

  const ranked = rankByEmbedding(slug, pack.excerpts, qVec, k);
  if (!ranked.length) return rankByKeyword(pack.excerpts, query, k);
  return ranked;
}

export function formatRetrievedExcerpts(excerpts: RankedExcerpt[]): string {
  if (!excerpts.length) return '';
  const body = excerpts
    .map(
      (e, i) =>
        `${i + 1}. [${e.work} · ${e.locator}] ${e.quote} (tags: ${e.tags.join(', ')})`
    )
    .join('\n');
  return `RETRIEVED EXCERPTS (short fair-use / paraphrase — cite themes, do not invent quotes):\n${body}`;
}

/** Test helper — clear process-local embedding cache. */
export function __clearEmbedCacheForTests(): void {
  EMBED_CACHE.clear();
  WARM_INFLIGHT.clear();
}
