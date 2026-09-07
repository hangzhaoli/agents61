/**
 * Metered desk extras on DeepSeek V4 Flash.
 * Seat briefs stay in the plan quota. These jobs are à-la-carte margin.
 * Never a buy/sell ticket.
 */

export const TOKEN_EXTRAS = [
  {
    id: 'filing_extract',
    name: 'Filing extract',
    priceUsd: 0.49,
    estCostUsd: 0.04,
    model: 'deepseek-v4-flash',
    job: 'Paste a 10-K / 10-Q / transcript. Get facts, contradictions, and questions for unlocked seats.',
  },
  {
    id: 'trigger_pack',
    name: 'Trigger / invalidation pack',
    priceUsd: 0.79,
    estCostUsd: 0.06,
    model: 'deepseek-v4-flash',
    job: 'Named levels and conditions a timing or exit seat would watch. Research simulation — not an order.',
  },
] as const;

export type TokenExtraId = (typeof TOKEN_EXTRAS)[number]['id'];

export const TOKEN_PACKS = [
  { id: 'pack-25', name: '25 extras', priceUsd: 9, runs: 25 },
  { id: 'pack-80', name: '80 extras', priceUsd: 24, runs: 80 },
] as const;

export type TokenPackId = (typeof TOKEN_PACKS)[number]['id'];

export const EXTRA_CREDITS_FORBIDDEN = {
  error: 'Buy a token-extra pack to run this. Filing extract and trigger packs are à-la-carte.',
  code: 'extra_credits' as const,
};

export function parseTokenExtra(raw: string | null | undefined): TokenExtraId | null {
  if (raw === 'filing_extract' || raw === 'trigger_pack') return raw;
  return null;
}

export function extraById(id: TokenExtraId) {
  return TOKEN_EXTRAS.find((e) => e.id === id) ?? TOKEN_EXTRAS[0];
}

export const EXTRA_USAGE_KEY = 'agents61_extra_usage';

export type ExtraUsage = {
  runs: number;
  lastId: string;
  lastAt: string;
};

export function readExtraUsage(): ExtraUsage {
  if (typeof window === 'undefined') return { runs: 0, lastId: '', lastAt: '' };
  try {
    const raw = localStorage.getItem(EXTRA_USAGE_KEY);
    if (!raw) return { runs: 0, lastId: '', lastAt: '' };
    const parsed = JSON.parse(raw) as Partial<ExtraUsage>;
    return {
      runs: typeof parsed.runs === 'number' ? parsed.runs : 0,
      lastId: typeof parsed.lastId === 'string' ? parsed.lastId : '',
      lastAt: typeof parsed.lastAt === 'string' ? parsed.lastAt : '',
    };
  } catch {
    return { runs: 0, lastId: '', lastAt: '' };
  }
}

export function recordExtraUsage(id: TokenExtraId): ExtraUsage {
  const next: ExtraUsage = {
    runs: readExtraUsage().runs + 1,
    lastId: id,
    lastAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(EXTRA_USAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }
  return next;
}
