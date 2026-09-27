/**
 * Quant Lab full pipeline (paper only):
 * universe → master-style screen → multi-ticker signals → portfolio paper book.
 */

import { getQuantMaster } from '@/lib/quant-lab/masters';
import { getQuantPool, type QuantPoolId } from '@/lib/quant-lab/equity-universe';
import { fetchBarsMap, type DailyBar } from '@/lib/quant-lab/yahoo-bars';
import type { QuantMasterSlug } from '@/lib/quant-lab/types';

export type ScreenHit = {
  ticker: string;
  score: number;
  reasons: string[];
  lastClose: number;
  rsVsBenchmarkPct: number | null;
  nearHighPct: number | null;
  volSurge: number | null;
};

export type PipelineSignal = {
  ticker: string;
  side: 'long';
  action: 'buy' | 'hold' | 'sell' | 'flat';
  date: string;
  price: number;
  reason: string;
  score: number;
};

export type PaperPosition = {
  ticker: string;
  shares: number;
  entryDate: string;
  entryPrice: number;
  lastPrice: number;
  stopPrice: number;
  unrealizedPct: number;
  status: 'open' | 'closed';
  exitDate?: string;
  exitPrice?: number;
  realizedPct?: number;
  exitReason?: string;
};

export type PaperFill = {
  date: string;
  ticker: string;
  side: 'buy' | 'sell';
  price: number;
  shares: number;
  reason: string;
};

export type PipelineBookSummary = {
  startCash: number;
  endEquity: number;
  cash: number;
  totalReturnPct: number;
  openPositions: number;
  closedTrades: number;
  winRatePct: number;
  maxPositions: number;
};

export type QuantPipelineResult = {
  masterSlug: QuantMasterSlug;
  masterLabel: string;
  poolId: QuantPoolId;
  poolLabel: string;
  benchmark: string;
  assetClass: 'equity' | 'crypto';
  screened: ScreenHit[];
  signals: PipelineSignal[];
  fills: PaperFill[];
  positions: PaperPosition[];
  summary: PipelineBookSummary;
  rules: string[];
  dataNote: string;
  disclaimer: string;
  ranAt: string;
};

const START_CASH = 100_000;
const FEE = 0.0001;
const LOOKBACK = 120;

function sma(arr: number[], n: number, i: number): number | null {
  if (i + 1 < n) return null;
  let s = 0;
  for (let k = i - n + 1; k <= i; k++) s += arr[k]!;
  return s / n;
}

function highest(arr: number[], n: number, i: number): number | null {
  if (i + 1 < n) return null;
  let m = -Infinity;
  for (let k = i - n + 1; k <= i; k++) m = Math.max(m, arr[k]!);
  return m;
}

function lowest(arr: number[], n: number, i: number): number | null {
  if (i + 1 < n) return null;
  let m = Infinity;
  for (let k = i - n + 1; k <= i; k++) m = Math.min(m, arr[k]!);
  return m;
}

function ret(closes: number[], i: number, days: number): number | null {
  if (i < days) return null;
  const a = closes[i - days]!;
  if (a <= 0) return null;
  return (closes[i]! - a) / a;
}

function scoreTicker(
  masterSlug: QuantMasterSlug,
  bars: DailyBar[],
  benchCloses: number[] | null
): ScreenHit | null {
  if (bars.length < 60) return null;
  const i = bars.length - 1;
  const closes = bars.map((b) => b.close);
  const highs = bars.map((b) => b.high);
  const vols = bars.map((b) => b.volume);
  const c = closes[i]!;
  const high52 = highest(highs, Math.min(252, bars.length - 1), i);
  const volMa = sma(vols, 50, i);
  const volSurge = volMa && volMa > 0 ? vols[i]! / volMa : null;
  const nearHighPct = high52 && high52 > 0 ? (c / high52 - 1) * 100 : null;
  let rs: number | null = null;
  if (benchCloses && benchCloses.length > 63 && closes.length > 63) {
    const r63 = ret(closes, i, 63);
    const b63 = ret(benchCloses, Math.min(i, benchCloses.length - 1), 63);
    if (r63 != null && b63 != null) rs = (r63 - b63) * 100;
  }

  const reasons: string[] = [];
  let score = 40;

  const ma50 = sma(closes, 50, i);
  const ma150 = sma(closes, Math.min(150, i), i);
  const ma200 = sma(closes, Math.min(200, i), i);
  const high20 = highest(highs, 20, i - 1);
  const low10 = lowest(closes, 10, i - 1);

  switch (masterSlug) {
    case 'william-oneil': {
      if (nearHighPct != null && nearHighPct > -5) {
        score += 18;
        reasons.push('Within 5% of 52w high');
      }
      if (volSurge != null && volSurge >= 1.4) {
        score += 14;
        reasons.push(`Volume surge ${volSurge.toFixed(1)}×`);
      }
      if (rs != null && rs > 0) {
        score += 12;
        reasons.push(`RS vs bench +${rs.toFixed(1)}% (63d)`);
      }
      if (ma50 && c > ma50) {
        score += 8;
        reasons.push('Above 50d MA');
      }
      break;
    }
    case 'mark-minervini': {
      if (ma150 && ma200 && c > ma150 && c > ma200) {
        score += 16;
        reasons.push('Above rising long MAs (proxy)');
      }
      if (ma50 && ma150 && ma50 > ma150) {
        score += 10;
        reasons.push('50d > 150d');
      }
      if (rs != null && rs > 5) {
        score += 14;
        reasons.push(`Strong RS +${rs.toFixed(1)}%`);
      }
      if (nearHighPct != null && nearHighPct > -8) {
        score += 10;
        reasons.push('Near highs');
      }
      break;
    }
    case 'richard-dennis': {
      if (high20 && c > high20) {
        score += 22;
        reasons.push('20d Donchian breakout');
      } else if (high20 && c > high20 * 0.98) {
        score += 10;
        reasons.push('Near 20d high');
      }
      if (ma50 && c > ma50) {
        score += 10;
        reasons.push('Trend filter OK');
      }
      break;
    }
    case 'ed-seykota': {
      const maFast = sma(closes, 50, i);
      const maSlow = sma(closes, Math.min(200, i), i);
      if (maFast && maSlow && maFast > maSlow) {
        score += 18;
        reasons.push('50/200 trend up');
      }
      if (high20 && c >= high20 * 0.995) {
        score += 12;
        reasons.push('Momentum high');
      }
      if (ret(closes, i, 20) != null && ret(closes, i, 20)! > 0) {
        score += 8;
        reasons.push('20d positive');
      }
      break;
    }
    case 'jesse-livermore':
    default: {
      if (high20 && c > high20) {
        score += 16;
        reasons.push('Pivot / new high');
      }
      if (ma50 && c > ma50) {
        score += 12;
        reasons.push('Tape above 50d');
      }
      if (volSurge != null && volSurge > 1.2) {
        score += 8;
        reasons.push('Volume confirmation');
      }
      if (low10 && c > low10) {
        score += 6;
        reasons.push('Not breaking down');
      }
      break;
    }
  }

  if (reasons.length === 0) {
    reasons.push('No strong screen hit');
    score = Math.min(score, 45);
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  return {
    ticker: '',
    score,
    reasons,
    lastClose: Math.round(c * 100) / 100,
    rsVsBenchmarkPct: rs != null ? Math.round(rs * 10) / 10 : null,
    nearHighPct: nearHighPct != null ? Math.round(nearHighPct * 10) / 10 : null,
    volSurge: volSurge != null ? Math.round(volSurge * 100) / 100 : null,
  };
}

function fixTicker(hit: ScreenHit, ticker: string): ScreenHit {
  return { ...hit, ticker };
}

function stopPctFor(masterSlug: QuantMasterSlug): number {
  const m = getQuantMaster(masterSlug);
  const p = m?.defaultParams.stop_pct;
  return typeof p === 'number' ? p : 0.08;
}

function entrySignal(
  masterSlug: QuantMasterSlug,
  bars: DailyBar[],
  i: number
): { enter: boolean; reason: string } {
  const closes = bars.map((b) => b.close);
  const highs = bars.map((b) => b.high);
  const vols = bars.map((b) => b.volume);
  const c = closes[i]!;
  const high20 = highest(highs, 20, i - 1);
  const ma50 = sma(closes, 50, i);
  const volMa = sma(vols, 50, i);
  const volOk = volMa ? vols[i]! >= volMa * 1.2 : true;

  switch (masterSlug) {
    case 'william-oneil':
    case 'mark-minervini':
      if (high20 && c > high20 && volOk && (!ma50 || c > ma50)) {
        return { enter: true, reason: 'Breakout on volume (paper)' };
      }
      return { enter: false, reason: '' };
    case 'richard-dennis':
      if (high20 && c > high20 && (!ma50 || c > ma50)) {
        return { enter: true, reason: 'Donchian 20d entry' };
      }
      return { enter: false, reason: '' };
    case 'ed-seykota': {
      const fast = sma(closes, 50, i);
      const slow = sma(closes, Math.min(200, i), i);
      if (fast && slow && fast > slow && high20 && c >= high20) {
        return { enter: true, reason: 'Trend + momentum entry' };
      }
      return { enter: false, reason: '' };
    }
    default:
      if (high20 && c > high20 && (!ma50 || c > ma50)) {
        return { enter: true, reason: 'Pivot break entry' };
      }
      return { enter: false, reason: '' };
  }
}

function shouldExit(
  masterSlug: QuantMasterSlug,
  bars: DailyBar[],
  i: number,
  entryPrice: number,
  stopPct: number
): { exit: boolean; reason: string } {
  const closes = bars.map((b) => b.close);
  const c = closes[i]!;
  if (c <= entryPrice * (1 - stopPct)) {
    return { exit: true, reason: `Stop −${(stopPct * 100).toFixed(0)}%` };
  }
  const low10 = lowest(closes, 10, i - 1);
  const ma50 = sma(closes, 50, i);
  if (masterSlug === 'richard-dennis' && low10 && c < low10) {
    return { exit: true, reason: '10d channel exit' };
  }
  if ((masterSlug === 'ed-seykota' || masterSlug === 'jesse-livermore') && ma50 && c < ma50) {
    return { exit: true, reason: 'Trend break / MA exit' };
  }
  if (
    (masterSlug === 'william-oneil' || masterSlug === 'mark-minervini') &&
    low10 &&
    c < low10 * 0.98
  ) {
    return { exit: true, reason: 'Failed breakout / swing low' };
  }
  return { exit: false, reason: '' };
}

function simulateBook(opts: {
  masterSlug: QuantMasterSlug;
  picks: string[];
  barsMap: Map<string, DailyBar[]>;
  maxPositions: number;
}): {
  fills: PaperFill[];
  positions: PaperPosition[];
  summary: PipelineBookSummary;
  signals: PipelineSignal[];
} {
  const { masterSlug, picks, barsMap, maxPositions } = opts;
  const stopPct = stopPctFor(masterSlug);
  const dates = new Set<string>();
  for (const t of picks) {
    const b = barsMap.get(t);
    if (!b) continue;
    for (const bar of b.slice(-LOOKBACK)) dates.add(bar.date);
  }
  const timeline = [...dates].sort();
  let cash = START_CASH;
  const open = new Map<string, PaperPosition>();
  const closed: PaperPosition[] = [];
  const fills: PaperFill[] = [];
  const signals: PipelineSignal[] = [];
  const lastSignals = new Map<string, PipelineSignal>();

  for (const date of timeline) {
    // Exits first
    for (const [ticker, pos] of [...open.entries()]) {
      const bars = barsMap.get(ticker);
      if (!bars) continue;
      const i = bars.findIndex((b) => b.date === date);
      if (i < 50) continue;
      const bar = bars[i]!;
      const ex = shouldExit(masterSlug, bars, i, pos.entryPrice, stopPct);
      if (ex.exit) {
        const proceeds = pos.shares * bar.close * (1 - FEE);
        cash += proceeds;
        const realizedPct = (bar.close / pos.entryPrice - 1) * 100;
        closed.push({
          ...pos,
          lastPrice: bar.close,
          status: 'closed',
          exitDate: date,
          exitPrice: bar.close,
          realizedPct: Math.round(realizedPct * 100) / 100,
          unrealizedPct: Math.round(realizedPct * 100) / 100,
          exitReason: ex.reason,
        });
        fills.push({
          date,
          ticker,
          side: 'sell',
          price: bar.close,
          shares: pos.shares,
          reason: ex.reason,
        });
        const sellSig: PipelineSignal = {
          ticker,
          side: 'long',
          action: 'sell',
          date,
          price: bar.close,
          reason: ex.reason,
          score: 0,
        };
        signals.push(sellSig);
        lastSignals.set(ticker, sellSig);
        open.delete(ticker);
      } else {
        pos.lastPrice = bar.close;
        pos.unrealizedPct = Math.round((bar.close / pos.entryPrice - 1) * 10000) / 100;
      }
    }

    // Entries
    if (open.size >= maxPositions) continue;
    for (const ticker of picks) {
      if (open.has(ticker)) continue;
      if (open.size >= maxPositions) break;
      const bars = barsMap.get(ticker);
      if (!bars) continue;
      const i = bars.findIndex((b) => b.date === date);
      if (i < 50) continue;
      const bar = bars[i]!;
      const en = entrySignal(masterSlug, bars, i);
      if (!en.enter) continue;
      const slotCash = cash / (maxPositions - open.size);
      if (slotCash < 500 || bar.close <= 0) continue;
      const shares = Math.floor((slotCash * (1 - FEE)) / bar.close);
      if (shares < 1) continue;
      const cost = shares * bar.close * (1 + FEE);
      cash -= cost;
      const pos: PaperPosition = {
        ticker,
        shares,
        entryDate: date,
        entryPrice: bar.close,
        lastPrice: bar.close,
        stopPrice: Math.round(bar.close * (1 - stopPct) * 100) / 100,
        unrealizedPct: 0,
        status: 'open',
      };
      open.set(ticker, pos);
      fills.push({
        date,
        ticker,
        side: 'buy',
        price: bar.close,
        shares,
        reason: en.reason,
      });
      const sig: PipelineSignal = {
        ticker,
        side: 'long',
        action: 'buy',
        date,
        price: bar.close,
        reason: en.reason,
        score: 0,
      };
      signals.push(sig);
      lastSignals.set(ticker, sig);
    }
  }

  // Mark open + latest action signals
  const positions = [...closed, ...open.values()];
  let equity = cash;
  for (const p of open.values()) {
    equity += p.shares * p.lastPrice;
    lastSignals.set(p.ticker, {
      ticker: p.ticker,
      side: 'long',
      action: 'hold',
      date: timeline[timeline.length - 1] ?? p.entryDate,
      price: p.lastPrice,
      reason: `Open · stop ${p.stopPrice}`,
      score: 0,
    });
  }

  const closedWins = closed.filter((p) => (p.realizedPct ?? 0) > 0);
  const latestSignals = picks.map((t) => {
    if (open.has(t)) {
      const p = open.get(t)!;
      return {
        ticker: t,
        side: 'long' as const,
        action: 'hold' as const,
        date: timeline[timeline.length - 1] ?? p.entryDate,
        price: p.lastPrice,
        reason: `Open · stop ${p.stopPrice}`,
        score: 0,
      };
    }
    const existing = lastSignals.get(t);
    const bars = barsMap.get(t);
    const last = bars?.[bars.length - 1];
    if (existing?.action === 'sell') {
      return {
        ...existing,
        action: 'flat' as const,
        date: last?.date ?? existing.date,
        price: last?.close ?? existing.price,
        reason: `Flat after exit · ${existing.reason}`,
      };
    }
    return {
      ticker: t,
      side: 'long' as const,
      action: 'flat' as const,
      date: last?.date ?? '',
      price: last?.close ?? 0,
      reason: 'No open position',
      score: 0,
    };
  });

  return {
    fills: fills.slice(-80),
    positions,
    signals: latestSignals,
    summary: {
      startCash: START_CASH,
      endEquity: Math.round(equity * 100) / 100,
      cash: Math.round(cash * 100) / 100,
      totalReturnPct: Math.round(((equity / START_CASH - 1) * 10000)) / 100,
      openPositions: open.size,
      closedTrades: closed.length,
      winRatePct:
        closed.length === 0
          ? 0
          : Math.round((closedWins.length / closed.length) * 1000) / 10,
      maxPositions,
    },
  };
}

export async function runQuantPipeline(opts: {
  masterSlug: QuantMasterSlug;
  poolId: QuantPoolId;
  maxPositions?: number;
  topN?: number;
}): Promise<QuantPipelineResult> {
  const pool = getQuantPool(opts.poolId);
  if (!pool) throw new Error('Unknown pool');
  const master = getQuantMaster(opts.masterSlug);
  if (!master) throw new Error('Unknown master');

  const maxPositions = Math.max(1, Math.min(8, opts.maxPositions ?? 4));
  const topN = Math.max(maxPositions, Math.min(12, opts.topN ?? 8));

  const symbols = [...new Set([pool.benchmark, ...pool.tickers])];
  const { map: barsMap, sources } = await fetchBarsMap(symbols, 5);
  const benchBars = barsMap.get(pool.benchmark.toUpperCase()) ?? [];
  const benchCloses = benchBars.map((b) => b.close);
  const sourceCounts = Object.values(sources).reduce(
    (acc, s) => {
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const screened: ScreenHit[] = [];
  for (const raw of pool.tickers) {
    const t = raw.toUpperCase();
    const bars = barsMap.get(t);
    if (!bars || bars.length < 60) continue;
    const hit = scoreTicker(opts.masterSlug, bars, benchCloses.length ? benchCloses : null);
    if (!hit) continue;
    screened.push(fixTicker(hit, t));
  }
  screened.sort((a, b) => b.score - a.score);
  const picks = screened.filter((s) => s.score >= 55).slice(0, topN).map((s) => s.ticker);
  // Always take topN by score if filter too strict
  const finalPicks =
    picks.length >= Math.min(3, topN)
      ? picks
      : screened.slice(0, topN).map((s) => s.ticker);

  const book = simulateBook({
    masterSlug: opts.masterSlug,
    picks: finalPicks,
    barsMap,
    maxPositions,
  });

  // Attach screen scores onto latest signals
  const scoreMap = new Map(screened.map((s) => [s.ticker, s.score]));
  for (const sig of book.signals) {
    sig.score = scoreMap.get(sig.ticker) ?? 0;
  }

  const loaded = [...barsMap.values()].filter((b) => b.length >= 60).length;
  const srcNote = Object.entries(sourceCounts)
    .map(([k, v]) => `${k}:${v}`)
    .join(' · ');

  return {
    masterSlug: opts.masterSlug,
    masterLabel: master.label,
    poolId: pool.id,
    poolLabel: pool.label,
    benchmark: pool.benchmark,
    assetClass: pool.assetClass,
    screened: screened.slice(0, 20),
    signals: book.signals,
    fills: book.fills,
    positions: book.positions,
    summary: book.summary,
    rules: [
      `Universe: ${pool.label} (${pool.tickers.length} names) → screen by ${master.label} proxies`,
      `Keep top ${topN} by screen score; paper book max ${maxPositions} concurrent longs`,
      'Entry/exit follow master timing rules on daily closes',
      `Equal-weight cash slots · ${(FEE * 10000).toFixed(0)} bp fee/side · stop ~${(stopPctFor(opts.masterSlug) * 100).toFixed(0)}%`,
      'No live orders. No broker. Survivorship bias and slippage not fully modeled.',
    ],
    dataNote: `Loaded ${loaded}/${symbols.length} daily series (${srcNote}). Research marks only.`,
    disclaimer:
      'Paper portfolio pipeline only. Not live trading. Not investment advice. Screen uses price/volume proxies — not full fundamental CANSLIM.',
    ranAt: new Date().toISOString(),
  };
}
