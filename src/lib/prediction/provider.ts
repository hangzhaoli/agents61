/**
 * Multi-provider market access — Polymarket live, Kalshi stub.
 */

import {
  getPredictionMarket,
  listPredictionMarkets,
  normalizeGammaMarket,
} from './polymarket';
import type { PredictionMarket, PredictionProvider } from './types';
import { parsePolymarketUrl } from './url-import';

const GAMMA = 'https://gamma-api.polymarket.com';

export type ListMarketsResult = {
  markets: PredictionMarket[];
  live: boolean;
  provider: PredictionProvider;
};

export interface PredictionMarketProvider {
  readonly id: PredictionProvider;
  getMarkets(limit?: number): Promise<ListMarketsResult>;
  getMarket(id: string): Promise<PredictionMarket | null>;
  getMarketByUrl(url: string): Promise<PredictionMarket | null>;
}

async function fetchGammaBySlug(slug: string): Promise<PredictionMarket | null> {
  const url = new URL(`${GAMMA}/markets`);
  url.searchParams.set('slug', slug);
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
    const rows = Array.isArray(json) ? json : (json as { markets?: unknown[] }).markets;
    if (!Array.isArray(rows) || !rows[0]) return null;
    return normalizeGammaMarket(rows[0] as Parameters<typeof normalizeGammaMarket>[0]);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchGammaByEventSlug(eventSlug: string): Promise<PredictionMarket | null> {
  const url = new URL(`${GAMMA}/events`);
  url.searchParams.set('slug', eventSlug);
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
    const rows = Array.isArray(json) ? json : [];
    const event = rows[0] as { markets?: unknown[]; slug?: string } | undefined;
    const marketRow = event?.markets?.[0];
    if (!marketRow) return null;
    const normalized = normalizeGammaMarket(marketRow as Parameters<typeof normalizeGammaMarket>[0]);
    if (normalized && event?.slug) {
      return {
        ...normalized,
        url: `https://polymarket.com/event/${event.slug}`,
      };
    }
    return normalized;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export const polymarketProvider: PredictionMarketProvider = {
  id: 'polymarket',
  async getMarkets() {
    const { markets, live } = await listPredictionMarkets();
    return { markets, live, provider: 'polymarket' };
  },
  async getMarket(id: string) {
    return getPredictionMarket(id);
  },
  async getMarketByUrl(url: string) {
    const parsed = parsePolymarketUrl(url);
    if (!parsed) return null;
    if (parsed.slug) {
      const bySlug = await fetchGammaBySlug(parsed.slug);
      if (bySlug) return bySlug;
      const listed = await getPredictionMarket(parsed.slug);
      if (listed) return listed;
    }
    if (parsed.eventSlug) {
      const byEvent = await fetchGammaByEventSlug(parsed.eventSlug);
      if (byEvent) return byEvent;
      const listed = await getPredictionMarket(parsed.eventSlug);
      if (listed) return listed;
    }
    return null;
  },
};

export const kalshiProvider: PredictionMarketProvider = {
  id: 'kalshi',
  async getMarkets() {
    return { markets: [], live: false, provider: 'kalshi' };
  },
  async getMarket() {
    return null;
  },
  async getMarketByUrl() {
    return null;
  },
};

const PROVIDERS: Record<PredictionProvider, PredictionMarketProvider> = {
  polymarket: polymarketProvider,
  kalshi: kalshiProvider,
};

export function resolveProvider(id?: PredictionProvider | string | null): PredictionMarketProvider {
  if (id === 'kalshi') return kalshiProvider;
  return polymarketProvider;
}

export async function listMarkets(opts?: {
  provider?: PredictionProvider;
  limit?: number;
}): Promise<ListMarketsResult> {
  const provider = resolveProvider(opts?.provider);
  return provider.getMarkets(opts?.limit);
}

export async function getMarketById(
  id: string,
  provider?: PredictionProvider
): Promise<PredictionMarket | null> {
  return resolveProvider(provider).getMarket(id);
}

export async function resolveMarketFromUrl(url: string): Promise<PredictionMarket | null> {
  const lower = url.toLowerCase();
  if (lower.includes('kalshi.com')) {
    return kalshiProvider.getMarketByUrl(url);
  }
  return polymarketProvider.getMarketByUrl(url);
}

export function listProviders(): PredictionMarketProvider[] {
  return Object.values(PROVIDERS);
}
