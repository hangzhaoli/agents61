/**
 * Import prediction markets from venue URLs (Polymarket first).
 */

import type { PredictionMarket } from './types';

export type ParsedPolymarketUrl = {
  slug?: string;
  eventSlug?: string;
};

/**
 * Parse Polymarket market / event URLs.
 * Examples:
 * - https://polymarket.com/event/fed-decision-in-october
 * - https://polymarket.com/market/will-bitcoin-hit-100k
 * - https://polymarket.com/event/foo/will-bar-happen (event + market slug)
 */
export function parsePolymarketUrl(url: string): ParsedPolymarketUrl | null {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, '').toLowerCase();
    if (!host.endsWith('polymarket.com')) return null;
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length === 0) return null;

    const kind = parts[0]?.toLowerCase();
    if (kind === 'event' && parts[1]) {
      const eventSlug = decodeURIComponent(parts[1]);
      const marketSlug = parts[2] ? decodeURIComponent(parts[2]) : undefined;
      return marketSlug ? { eventSlug, slug: marketSlug } : { eventSlug };
    }
    if ((kind === 'market' || kind === 'markets') && parts[1]) {
      return { slug: decodeURIComponent(parts[1]) };
    }
    if (parts.length >= 1) {
      return { slug: decodeURIComponent(parts[parts.length - 1]!) };
    }
    return null;
  } catch {
    return null;
  }
}

/** Resolve a venue URL via the provider layer (dynamic import avoids cycle). */
export async function resolveImportedMarket(url: string): Promise<PredictionMarket | null> {
  const { resolveMarketFromUrl } = await import('./provider');
  return resolveMarketFromUrl(url);
}
