/**
 * Daily candles for the paper contract backtest.
 * Crypto: Binance public klines. US equity contracts: Sina daily bars.
 * No order routing.
 */

import { unstable_cache } from 'next/cache';
import { findContract, type ContractSpec } from '@/lib/quant-lab/perp-universe';
import { samplePerpCandles, type PerpBacktest, type PerpCandle } from '@/lib/quant-lab/perp-strategy';
import { parseUsBookStyle, runUsBook, type UsBookStyle } from '@/lib/quant-lab/us-books';

function utcDate(ms: number) {
  return new Date(ms).toISOString().slice(0, 10);
}

function asCandle(time: number, open: number, high: number, low: number, close: number): PerpCandle | null {
  if (![open, high, low, close].every((n) => Number.isFinite(n) && n > 0)) return null;
  return {
    time,
    date: utcDate(time),
    open,
    high: Math.max(high, open, close),
    low: Math.min(low, open, close),
    close,
  };
}

async function fetchBinance(spec: ContractSpec): Promise<PerpCandle[]> {
  const pair = spec.binance;
  if (!pair) throw new Error('No Binance pair');
  const path = `/api/v3/klines?symbol=${pair}&interval=1d&limit=1000`;
  const hosts = ['https://data-api.binance.vision', 'https://api.binance.com'];
  let lastError = 'Binance unavailable';
  for (const host of hosts) {
    try {
      const res = await fetch(`${host}${path}`, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) {
        lastError = `Binance ${res.status}`;
        continue;
      }
      return parseBinanceKlines(await res.json());
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Binance unavailable';
    }
  }
  throw new Error(lastError);
}

function parseBinanceKlines(payload: unknown): PerpCandle[] {
  const rows = payload as unknown[];
  if (!Array.isArray(rows)) throw new Error('Binance payload');
  const candles: PerpCandle[] = [];
  for (const row of rows) {
    if (!Array.isArray(row)) continue;
    const candle = asCandle(Number(row[0]), Number(row[1]), Number(row[2]), Number(row[3]), Number(row[4]));
    if (candle) candles.push(candle);
  }
  if (candles.length < 80) throw new Error('Binance history too short');
  return candles;
}

async function fetchCoinGecko(spec: ContractSpec): Promise<PerpCandle[]> {
  if (!spec.gecko) throw new Error('No CoinGecko id');
  const url = `https://api.coingecko.com/api/v3/coins/${spec.gecko}/ohlc?vs_currency=usd&days=365`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
  const rows = (await res.json()) as unknown[];
  if (!Array.isArray(rows)) throw new Error('CoinGecko payload');
  const candles: PerpCandle[] = [];
  for (const row of rows) {
    if (!Array.isArray(row)) continue;
    const candle = asCandle(Number(row[0]), Number(row[1]), Number(row[2]), Number(row[3]), Number(row[4]));
    if (candle) candles.push(candle);
  }
  if (candles.length < 40) throw new Error('CoinGecko history too short');
  return candles;
}

async function fetchSina(spec: ContractSpec): Promise<PerpCandle[]> {
  const url = `https://stock.finance.sina.com.cn/usstock/api/json.php/US_MinKService.getDailyK?symbol=${spec.symbol.toLowerCase()}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`Sina ${res.status}`);
  const rows = (await res.json()) as { d?: string; o?: string; h?: string; l?: string; c?: string }[];
  if (!Array.isArray(rows)) throw new Error('Sina payload');
  const candles: PerpCandle[] = [];
  for (const row of rows) {
    if (!row.d) continue;
    const time = Date.parse(`${row.d}T00:00:00Z`);
    const candle = asCandle(time, Number(row.o), Number(row.h), Number(row.l), Number(row.c));
    if (candle) candles.push(candle);
  }
  const sliced = candles.slice(-1000);
  if (sliced.length < 80) throw new Error('Sina history too short');
  return sliced;
}

function sampleFor(spec: ContractSpec, style: UsBookStyle): PerpBacktest {
  const seed = spec.symbol.split('').reduce((n, ch) => n + ch.charCodeAt(0), 61);
  const candles = samplePerpCandles(420, seed);
  return runUsBook(style, candles, {
    symbol: spec.symbol,
    pair: spec.pair,
    kind: spec.kind,
    source: 'sample',
    dataNote: 'Public candles were unavailable. This path is a deterministic sample, not a market history.',
  });
}

function equityNote(symbol: string, style: UsBookStyle) {
  if (style === 'shares') {
    return `Daily ${symbol} bars, long-only shares. Not a contract and not a broker order.`;
  }
  if (style === 'wheel') {
    return `Daily ${symbol} bars. Option prices are a Black-Scholes model, not an exchange chain. No orders are sent.`;
  }
  return `Daily ${symbol} bars, run as a paper US equity contract. Not a listed future. The last bar may still be forming.`;
}

async function loadBacktest(symbol: string, style: UsBookStyle = 'contract'): Promise<PerpBacktest> {
  const spec = findContract(symbol);
  const book = parseUsBookStyle(style, spec.kind === 'equity');
  if (spec.kind === 'equity') {
    try {
      const candles = await fetchSina(spec);
      return runUsBook(book, candles, {
        symbol: spec.symbol,
        pair: spec.pair,
        kind: 'equity',
        source: 'sina',
        dataNote: equityNote(spec.symbol, book),
      });
    } catch {
      return sampleFor(spec, book);
    }
  }

  try {
    const candles = await fetchBinance(spec);
    return runUsBook('contract', candles, {
      symbol: spec.symbol,
      pair: spec.pair,
      kind: 'crypto',
      source: 'binance',
      dataNote: `Daily ${spec.pair} candles from Binance public market data. The last bar may still be forming.`,
    });
  } catch {
    try {
      const candles = await fetchCoinGecko(spec);
      return runUsBook('contract', candles, {
        symbol: spec.symbol,
        pair: spec.pair,
        kind: 'crypto',
        source: 'coingecko',
        dataNote: `CoinGecko OHLC fallback for ${spec.symbol}. Granularity is coarser than a daily venue candle.`,
      });
    } catch {
      return sampleFor(spec, 'contract');
    }
  }
}

export function parsePerpSymbol(raw: string | null | undefined): string {
  return findContract(raw).symbol;
}

export const getPerpBacktest = unstable_cache(
  async (symbol: string, style: UsBookStyle) => loadBacktest(symbol, style),
  ['perp-backtest-v5'],
  { revalidate: 3600 }
);
