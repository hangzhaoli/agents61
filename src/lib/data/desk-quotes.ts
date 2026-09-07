/**
 * Cached model-input quotes for desk boards. Not a live quote product.
 * Finnhub (free 60/min real-time, email-only signup) → Alpaca (free IEX,
 * needs US entity) → FMP (if keyed) → Yahoo chart fallback → null
 * (spark only in UI).
 */

import { unstable_cache } from 'next/cache';
import { hasFmpKey, loadFmpInternal } from '@/lib/data/fmp';

export type DeskQuote = {
  symbol: string;
  price: number | null;
  changePct: number | null;
  source: 'finnhub' | 'alpaca' | 'fmp' | 'yahoo' | 'none';
};

/** Finnhub free tier: real-time US quotes, 60 calls/min, instant email signup. */
async function finnhubQuote(symbol: string): Promise<DeskQuote | null> {
  const key = process.env.FINNHUB_API_KEY?.trim();
  const sym = symbol.trim().toUpperCase();
  if (!key) return null;
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(sym)}&token=${encodeURIComponent(key)}`,
      { next: { revalidate: 900 } }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { c?: number; pc?: number };
    const price = typeof json.c === 'number' && json.c > 0 ? json.c : null;
    if (price == null) return null;
    const prev = typeof json.pc === 'number' && json.pc > 0 ? json.pc : null;
    const changePct = prev != null ? (price - prev) / prev : null;
    return { symbol: sym, price, changePct, source: 'finnhub' };
  } catch {
    return null;
  }
}

function alpacaKeys(): { keyId: string; secret: string } | null {
  const keyId = process.env.ALPACA_API_KEY_ID?.trim();
  const secret = process.env.ALPACA_API_SECRET_KEY?.trim();
  return keyId && secret ? { keyId, secret } : null;
}

/** Free tier = IEX real-time. Snapshot gives latest trade + previous close. */
async function alpacaQuote(symbol: string): Promise<DeskQuote | null> {
  const keys = alpacaKeys();
  const sym = symbol.trim().toUpperCase();
  if (!keys) return null;
  try {
    const res = await fetch(
      `https://data.alpaca.markets/v2/stocks/${encodeURIComponent(sym)}/snapshot?feed=iex`,
      {
        headers: {
          'APCA-API-KEY-ID': keys.keyId,
          'APCA-API-SECRET-KEY': keys.secret,
        },
        next: { revalidate: 900 },
      }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as {
      latestTrade?: { p?: number };
      prevDailyBar?: { c?: number };
      dailyBar?: { c?: number };
    };
    const price = json.latestTrade?.p ?? json.dailyBar?.c ?? null;
    const prev = json.prevDailyBar?.c ?? null;
    const changePct = price != null && prev != null && prev !== 0 ? (price - prev) / prev : null;
    if (price == null) return null;
    return { symbol: sym, price, changePct, source: 'alpaca' };
  } catch {
    return null;
  }
}

async function yahooQuote(symbol: string): Promise<DeskQuote | null> {
  const sym = symbol.trim().toUpperCase();
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=5d`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Agents61/1.0 (research board; cached)' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      chart?: {
        result?: Array<{
          meta?: { regularMarketPrice?: number; previousClose?: number; chartPreviousClose?: number };
        }>;
      };
    };
    const meta = json.chart?.result?.[0]?.meta;
    if (!meta) return null;
    const price = meta.regularMarketPrice ?? null;
    const prev = meta.previousClose ?? meta.chartPreviousClose ?? null;
    const changePct =
      price != null && prev != null && prev !== 0 ? (price - prev) / prev : null;
    return { symbol: sym, price, changePct, source: 'yahoo' };
  } catch {
    return null;
  }
}

async function quoteOne(symbol: string): Promise<DeskQuote> {
  const sym = symbol.trim().toUpperCase();
  const fh = await finnhubQuote(sym);
  if (fh) return fh;
  const alp = await alpacaQuote(sym);
  if (alp) return alp;
  if (hasFmpKey()) {
    const fmp = await loadFmpInternal(sym);
    if (fmp?.price != null) {
      return { symbol: sym, price: fmp.price, changePct: null, source: 'fmp' };
    }
  }
  const y = await yahooQuote(sym);
  if (y) return y;
  return { symbol: sym, price: null, changePct: null, source: 'none' };
}

export async function getDeskQuotes(symbols: string[]): Promise<Map<string, DeskQuote>> {
  const sorted = [...new Set(symbols.map((s) => s.trim().toUpperCase()).filter(Boolean))].sort();
  const cacheKey = sorted.join(',') || 'empty';
  const rows = await unstable_cache(
    async () => Promise.all(sorted.map((s) => quoteOne(s))),
    ['desk-quotes-v1', cacheKey],
    { revalidate: 3600 }
  )();
  return new Map(rows.map((r) => [r.symbol, r]));
}

export function formatPrice(n: number | null): string {
  if (n == null || Number.isNaN(n)) return '—';
  if (n >= 1000) return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  if (n >= 100) return `$${n.toFixed(1)}`;
  return `$${n.toFixed(2)}`;
}

export function formatChangePct(n: number | null): string {
  if (n == null || Number.isNaN(n)) return '—';
  const pct = n * 100;
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}

export function changeTone(n: number | null): 'up' | 'down' | 'flat' {
  if (n == null || Number.isNaN(n)) return 'flat';
  if (n > 0.002) return 'up';
  if (n < -0.002) return 'down';
  return 'flat';
}
