/**
 * Daily OHLC for paper pipeline: Yahoo → Sina (US) → Binance (crypto) → sample.
 */

export type DailyBar = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type YahooChart = {
  chart?: {
    result?: Array<{
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          open?: (number | null)[];
          high?: (number | null)[];
          low?: (number | null)[];
          close?: (number | null)[];
          volume?: (number | null)[];
        }>;
      };
    }>;
  };
};

const CRYPTO_YF_TO_BINANCE: Record<string, string> = {
  'BTC-USD': 'BTCUSDT',
  'ETH-USD': 'ETHUSDT',
  'SOL-USD': 'SOLUSDT',
  'BNB-USD': 'BNBUSDT',
  'XRP-USD': 'XRPUSDT',
  'ADA-USD': 'ADAUSDT',
  'DOGE-USD': 'DOGEUSDT',
  'AVAX-USD': 'AVAXUSDT',
};

function utcDate(ms: number) {
  return new Date(ms).toISOString().slice(0, 10);
}

async function fetchYahoo(symbol: string): Promise<DailyBar[]> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1y`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Agents61Research/1.0; +https://agents61.com)',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(10_000),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as YahooChart;
    const result = json.chart?.result?.[0];
    const ts = result?.timestamp ?? [];
    const q = result?.indicators?.quote?.[0];
    if (!ts.length || !q) return [];
    const bars: DailyBar[] = [];
    for (let i = 0; i < ts.length; i++) {
      const close = q.close?.[i];
      const open = q.open?.[i];
      const high = q.high?.[i];
      const low = q.low?.[i];
      const volume = q.volume?.[i];
      if (close == null || open == null || high == null || low == null || close <= 0) continue;
      bars.push({
        date: utcDate(ts[i]! * 1000),
        open,
        high,
        low,
        close,
        volume: typeof volume === 'number' && volume > 0 ? volume : 0,
      });
    }
    return bars;
  } catch {
    return [];
  }
}

/** Sina US daily K — same source as Quant Lab equity contract books. */
async function fetchSina(symbol: string): Promise<DailyBar[]> {
  const sym = symbol.replace('.', '-').toLowerCase();
  const url = `https://stock.finance.sina.com.cn/usstock/api/json.php/US_MinKService.getDailyK?symbol=${encodeURIComponent(sym)}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
    if (!res.ok) return [];
    const rows = (await res.json()) as {
      d?: string;
      o?: string;
      h?: string;
      l?: string;
      c?: string;
      v?: string;
    }[];
    if (!Array.isArray(rows)) return [];
    const bars: DailyBar[] = [];
    for (const row of rows) {
      if (!row.d) continue;
      const open = Number(row.o);
      const high = Number(row.h);
      const low = Number(row.l);
      const close = Number(row.c);
      if (![open, high, low, close].every((n) => Number.isFinite(n) && n > 0)) continue;
      bars.push({
        date: row.d,
        open,
        high,
        low,
        close,
        volume: Number(row.v) || 0,
      });
    }
    return bars.slice(-280);
  } catch {
    return [];
  }
}

async function fetchBinance(pair: string): Promise<DailyBar[]> {
  const path = `/api/v3/klines?symbol=${pair}&interval=1d&limit=280`;
  for (const host of ['https://data-api.binance.vision', 'https://api.binance.com']) {
    try {
      const res = await fetch(`${host}${path}`, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) continue;
      const rows = (await res.json()) as unknown[];
      if (!Array.isArray(rows)) continue;
      const bars: DailyBar[] = [];
      for (const row of rows) {
        if (!Array.isArray(row)) continue;
        const open = Number(row[1]);
        const high = Number(row[2]);
        const low = Number(row[3]);
        const close = Number(row[4]);
        const volume = Number(row[5]);
        const t = Number(row[0]);
        if (![open, high, low, close].every((n) => Number.isFinite(n) && n > 0)) continue;
        bars.push({ date: utcDate(t), open, high, low, close, volume: volume || 0 });
      }
      if (bars.length >= 60) return bars;
    } catch {
      /* try next host */
    }
  }
  return [];
}

/** Deterministic synthetic series so the pipeline never returns empty. */
export function sampleDailyBars(symbol: string, n = 260): DailyBar[] {
  const seed = symbol.split('').reduce((a, ch) => a + ch.charCodeAt(0), 61);
  let price = 80 + (seed % 120);
  const bars: DailyBar[] = [];
  const start = Date.UTC(2024, 0, 2);
  for (let i = 0; i < n; i++) {
    const day = start + i * 86_400_000;
    // skip weekends roughly
    const wd = new Date(day).getUTCDay();
    if (wd === 0 || wd === 6) continue;
    const wave = Math.sin((i + seed) / 18) * 0.012;
    const drift = 0.0004 + ((seed % 7) - 3) * 0.00005;
    const shock = (((i * 17 + seed * 3) % 100) - 50) / 10000;
    const ret = drift + wave + shock;
    const open = price;
    const close = Math.max(1, price * (1 + ret));
    const high = Math.max(open, close) * (1 + 0.004);
    const low = Math.min(open, close) * (1 - 0.004);
    const volume = 1_000_000 + ((i * seed) % 5_000_000);
    bars.push({
      date: utcDate(day),
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume,
    });
    price = close;
  }
  return bars;
}

export async function fetchDailyBars(symbol: string): Promise<{ bars: DailyBar[]; source: string }> {
  const sym = symbol.trim().toUpperCase();
  const y = await fetchYahoo(sym);
  if (y.length >= 60) return { bars: y, source: 'yahoo' };

  const binance = CRYPTO_YF_TO_BINANCE[sym];
  if (binance) {
    const b = await fetchBinance(binance);
    if (b.length >= 60) return { bars: b, source: 'binance' };
  } else {
    const s = await fetchSina(sym);
    if (s.length >= 60) return { bars: s, source: 'sina' };
  }

  return { bars: sampleDailyBars(sym), source: 'sample' };
}

/** Fetch many symbols with limited concurrency. */
export async function fetchBarsMap(
  symbols: string[],
  concurrency = 4
): Promise<{ map: Map<string, DailyBar[]>; sources: Record<string, string> }> {
  const uniq = [...new Set(symbols.map((s) => s.trim().toUpperCase()).filter(Boolean))];
  const map = new Map<string, DailyBar[]>();
  const sources: Record<string, string> = {};
  let i = 0;
  async function worker() {
    while (i < uniq.length) {
      const idx = i++;
      const sym = uniq[idx]!;
      const { bars, source } = await fetchDailyBars(sym);
      map.set(sym, bars);
      sources[sym] = source;
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, uniq.length || 1) }, () => worker()));
  return { map, sources };
}

/** @deprecated use fetchDailyBars */
export async function fetchYahooDailyBars(symbol: string): Promise<DailyBar[]> {
  return (await fetchDailyBars(symbol)).bars;
}
