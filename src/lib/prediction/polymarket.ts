/**
 * Polymarket Gamma API client (public, no auth).
 * Falls back to curated markets when the API is unreachable.
 */

import { unstable_cache } from 'next/cache';
import { FALLBACK_MARKETS } from './fallback-markets';
import type { PredictionMarket } from './types';
import { formatEndDate, formatVolume } from './types';

const GAMMA = 'https://gamma-api.polymarket.com';

type GammaMarket = {
  id?: string | number;
  conditionId?: string;
  question?: string;
  title?: string;
  slug?: string;
  description?: string;
  outcomePrices?: string | number[];
  outcomes?: string | string[];
  volume?: string | number;
  volumeNum?: number;
  volume24hr?: number;
  endDate?: string;
  endDateIso?: string;
  closed?: boolean;
  active?: boolean;
  events?: Array<{ slug?: string; title?: string }>;
};

function parsePrices(raw: string | number[] | undefined): number[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(Number).filter((n) => Number.isFinite(n));
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return parsed.map(Number).filter((n) => Number.isFinite(n));
  } catch {
    /* ignore */
  }
  return [];
}

function yesProbability(m: GammaMarket): number | null {
  const prices = parsePrices(m.outcomePrices);
  if (prices.length >= 1 && Number.isFinite(prices[0])) {
    const p = prices[0]!;
    // Gamma usually returns 0–1; sometimes 0–100
    const pct = p <= 1.0001 ? p * 100 : p;
    return Math.max(0, Math.min(100, Math.round(pct * 10) / 10));
  }
  return null;
}

function volumeOf(m: GammaMarket): number {
  if (typeof m.volumeNum === 'number' && Number.isFinite(m.volumeNum)) return m.volumeNum;
  if (typeof m.volume24hr === 'number' && Number.isFinite(m.volume24hr)) return m.volume24hr;
  const v = Number(m.volume);
  return Number.isFinite(v) ? v : 0;
}

function categoryOf(question: string): string {
  const q = question.toLowerCase();
  if (/\b(btc|bitcoin|eth|crypto|solana)\b/.test(q)) return 'crypto';
  if (/\b(fed|rate|recession|gdp|cpi|oil|brent)\b/.test(q)) return 'macro';
  if (/\b(election|president|senate|house|trump|democrat|republican)\b/.test(q)) return 'politics';
  if (/\b(ai|openai|ipo|spacex|nvidia|apple)\b/.test(q)) return 'tech';
  if (/\b(war|ukraine|china|taiwan|nato|sanction)\b/.test(q)) return 'geopolitics';
  return 'general';
}

export function normalizeGammaMarket(raw: GammaMarket): PredictionMarket | null {
  const question = (raw.question || raw.title || '').trim();
  if (!question) return null;
  const prob = yesProbability(raw);
  if (prob == null) return null;
  const id = String(raw.id ?? raw.conditionId ?? raw.slug ?? '');
  if (!id) return null;
  const slug = (raw.slug || id).toString();
  const endDate = raw.endDateIso || raw.endDate || null;
  const vol = volumeOf(raw);
  const eventSlug = raw.events?.[0]?.slug;
  return {
    id,
    slug,
    question,
    marketProbability: prob,
    volumeUsd: vol,
    volumeLabel: formatVolume(vol),
    endDate,
    endDateLabel: formatEndDate(endDate),
    description: (raw.description || '').trim() || question,
    url: eventSlug
      ? `https://polymarket.com/event/${eventSlug}`
      : `https://polymarket.com/market/${slug}`,
    source: 'polymarket',
    provider: 'polymarket',
    category: categoryOf(question),
  };
}

async function fetchGammaMarkets(limit = 24): Promise<PredictionMarket[]> {
  const url = new URL(`${GAMMA}/markets`);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('active', 'true');
  url.searchParams.set('closed', 'false');
  url.searchParams.set('order', 'volume24hr');
  url.searchParams.set('ascending', 'false');

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 12_000);
  try {
    const res = await fetch(url.toString(), {
      signal: ac.signal,
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`Gamma HTTP ${res.status}`);
    const json = (await res.json()) as unknown;
    const rows = Array.isArray(json) ? json : (json as { markets?: GammaMarket[] }).markets;
    if (!Array.isArray(rows)) throw new Error('Unexpected Gamma shape');
    const out: PredictionMarket[] = [];
    for (const row of rows) {
      const n = normalizeGammaMarket(row as GammaMarket);
      if (n && !n.question.toLowerCase().includes('test')) out.push(n);
    }
    return out;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchGammaById(id: string): Promise<PredictionMarket | null> {
  const url = new URL(`${GAMMA}/markets`);
  url.searchParams.set('id', id);
  url.searchParams.set('limit', '1');
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 10_000);
  try {
    const res = await fetch(url.toString(), {
      signal: ac.signal,
      headers: { Accept: 'application/json' },
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as unknown;
    const rows = Array.isArray(json) ? json : (json as { markets?: GammaMarket[] }).markets;
    if (!Array.isArray(rows) || !rows[0]) return null;
    return normalizeGammaMarket(rows[0] as GammaMarket);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export const listPredictionMarkets = unstable_cache(
  async (): Promise<{ markets: PredictionMarket[]; live: boolean }> => {
    try {
      const markets = await fetchGammaMarkets(28);
      if (markets.length >= 4) return { markets, live: true };
    } catch {
      /* fall through */
    }
    return { markets: FALLBACK_MARKETS, live: false };
  },
  ['prediction-markets-v1'],
  { revalidate: 300, tags: ['prediction-markets'] }
);

export async function getPredictionMarket(id: string): Promise<PredictionMarket | null> {
  const fromFallback = FALLBACK_MARKETS.find((m) => m.id === id || m.slug === id);
  if (id.startsWith('fallback-') || fromFallback) {
    return fromFallback ?? null;
  }
  try {
    const live = await fetchGammaById(id);
    if (live) return live;
  } catch {
    /* ignore */
  }
  // slug search via list
  const { markets } = await listPredictionMarkets();
  return markets.find((m) => m.id === id || m.slug === id) ?? fromFallback ?? null;
}
