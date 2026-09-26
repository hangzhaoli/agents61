/**
 * Paper perpetual-contract backtest for the blockchain desk.
 * Long and short, trend filter, ATR stop, fee and funding drag.
 * Not live orders and not a venue connection.
 */

export type PerpCandle = {
  time: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type PerpSide = 'long' | 'short';

export type PerpTrade = {
  id: number;
  side: PerpSide;
  status: 'closed' | 'open';
  entryDate: string;
  exitDate: string | null;
  entryPrice: number;
  exitPrice: number | null;
  pnlPct: number;
  pnlUsd: number;
  bars: number;
  /** Shares, Call, or Put when the row is not a perpetual contract. */
  instrument?: string;
  exitReason: 'channel' | 'stop' | 'open' | 'called' | 'assigned' | 'expiry';
  feesUsd: number;
  fundingUsd: number;
};

export type PerpEquityPoint = { date: string; equity: number };

export type PerpBacktestSummary = {
  startEquity: number;
  endEquity: number;
  totalReturnPct: number;
  maxDrawdownPct: number;
  winRatePct: number;
  closedTrades: number;
  profitFactor: number;
  sharpe: number;
  feesUsd: number;
  fundingUsd: number;
  longs: number;
  shorts: number;
  openSide: PerpSide | 'flat';
  openPnlUsd: number;
};

export type PerpBacktest = {
  symbol: string;
  pair: string;
  kind: 'crypto' | 'equity';
  source: 'binance' | 'coingecko' | 'sina' | 'sample';
  dataNote: string;
  window: { from: string; to: string; bars: number };
  rules: string[];
  summary: PerpBacktestSummary;
  equity: PerpEquityPoint[];
  trades: PerpTrade[];
  disclaimer: string;
};

export const PERP_DISCLAIMER =
  'Paper perpetual simulation. Signals fill at the daily close. Fees and funding are approximations. Not live trading and not investment advice.';

const SHARED_RULES = [
  'Enter only with the 50-day trend: close through the prior 20-day high above the EMA, or the prior 20-day low below it.',
  'Skip the bar when daily ATR is under 0.5% or over 12% of price.',
  'Exit on the 10-day opposite channel, or a 2.2 ATR stop. Stops fill through gaps.',
  'Size risks 1% of paper equity per trade, capped at 2× notional. 4 bps fee each side.',
  'After a stop, the same side stays flat for 3 bars. The EMA must still be sloping with the trade.',
];

export function perpRules(kind: 'crypto' | 'equity'): string[] {
  if (kind === 'equity') {
    return [
      'US equity contract: one name at a time, marked on that stock’s daily bars. Long and short are both allowed.',
      ...SHARED_RULES,
      'Carry is flat paper financing: about 5% a year on longs and 1% borrow on shorts. Crypto funding is not applied.',
    ];
  }
  return [
    'Crypto perpetual: one pair at a time. Long and short are both allowed.',
    ...SHARED_RULES,
    'Funding follows the close-versus-EMA premium, clipped to ±1.2 bps per day.',
  ];
}

export const PERP_RULES = perpRules('crypto');

const START_EQUITY = 10_000;
const FEE = 0.0004;
const RISK = 0.01;
const MAX_LEV = 2;
const EMA_N = 50;
const ENTRY_N = 20;
const EXIT_N = 10;
const ATR_N = 14;
const ATR_MULT = 2.2;

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function emaSeries(closes: number[], n: number): number[] {
  const out = new Array<number>(closes.length).fill(Number.NaN);
  if (closes.length < n) return out;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += closes[i]!;
  let prev = sum / n;
  out[n - 1] = prev;
  const k = 2 / (n + 1);
  for (let i = n; i < closes.length; i++) {
    prev = closes[i]! * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}

function atrSeries(candles: PerpCandle[], n: number): number[] {
  const out = new Array<number>(candles.length).fill(Number.NaN);
  const tr: number[] = [];
  for (let i = 0; i < candles.length; i++) {
    const bar = candles[i]!;
    const prevClose = i > 0 ? candles[i - 1]!.close : bar.close;
    tr.push(
      Math.max(bar.high - bar.low, Math.abs(bar.high - prevClose), Math.abs(bar.low - prevClose))
    );
  }
  if (tr.length < n) return out;
  let prev = 0;
  for (let i = 0; i < n; i++) prev += tr[i]!;
  prev /= n;
  out[n - 1] = prev;
  for (let i = n; i < tr.length; i++) {
    prev = (prev * (n - 1) + tr[i]!) / n;
    out[i] = prev;
  }
  return out;
}

function windowExtreme(candles: PerpCandle[], index: number, n: number, field: 'high' | 'low') {
  if (index < n) return null;
  let value = field === 'high' ? -Infinity : Infinity;
  for (let j = index - n; j < index; j++) {
    const px = candles[j]![field];
    value = field === 'high' ? Math.max(value, px) : Math.min(value, px);
  }
  return Number.isFinite(value) ? value : null;
}

type OpenPos = {
  id: number;
  side: PerpSide;
  entry: number;
  entryIdx: number;
  entryDate: string;
  stop: number;
  notional: number;
  entryFee: number;
  funding: number;
};

function rawReturn(side: PerpSide, entry: number, mark: number) {
  return side === 'long' ? (mark - entry) / entry : (entry - mark) / entry;
}

function downsample(points: PerpEquityPoint[], maxPoints: number): PerpEquityPoint[] {
  if (points.length <= maxPoints) return points;
  const out: PerpEquityPoint[] = [];
  const step = (points.length - 1) / (maxPoints - 1);
  for (let i = 0; i < maxPoints; i++) {
    out.push(points[Math.round(i * step)]!);
  }
  return out;
}

export function runPerpBacktest(
  candles: PerpCandle[],
  meta: {
    symbol: string;
    pair: string;
    source: PerpBacktest['source'];
    dataNote: string;
    kind?: 'crypto' | 'equity';
  }
): PerpBacktest {
  const kind = meta.kind ?? 'crypto';
  const closes = candles.map((c) => c.close);
  const ema = emaSeries(closes, EMA_N);
  const atr = atrSeries(candles, ATR_N);
  let equity = START_EQUITY;
  let nextId = 1;
  let pos: OpenPos | null = null;
  let cooldownUntil = -1;
  let cooldownSide: PerpSide | null = null;
  const trades: PerpTrade[] = [];
  const curve: PerpEquityPoint[] = [];
  const warmup = Math.max(EMA_N, ENTRY_N, ATR_N) + 1;

  const pushTrade = (trade: PerpTrade) => {
    trades.push(trade);
  };

  for (let i = 0; i < candles.length; i++) {
    const bar = candles[i]!;
    if (i >= warmup && pos) {
      if (kind === 'equity') {
        const rate = pos.side === 'long' ? 0.05 / 365 : 0.01 / 365;
        const cost = pos.notional * rate;
        equity -= cost;
        pos.funding += cost;
      } else {
        const emaPrev = ema[i - 1];
        if (emaPrev != null && Number.isFinite(emaPrev) && emaPrev > 0) {
          const premium = (candles[i - 1]!.close - emaPrev) / emaPrev;
          const rate = clamp(premium * 0.003, -0.00012, 0.00012);
          const cost = pos.notional * rate * (pos.side === 'long' ? 1 : -1);
          equity -= cost;
          pos.funding += cost;
        }
      }

      const channelLow = windowExtreme(candles, i, EXIT_N, 'low');
      const channelHigh = windowExtreme(candles, i, EXIT_N, 'high');
      let exitPrice: number | null = null;
      let reason: 'stop' | 'channel' | null = null;
      if (pos.side === 'long' && bar.low <= pos.stop) {
        exitPrice = bar.open < pos.stop ? bar.open : pos.stop;
        reason = 'stop';
      } else if (pos.side === 'short' && bar.high >= pos.stop) {
        exitPrice = bar.open > pos.stop ? bar.open : pos.stop;
        reason = 'stop';
      } else if (pos.side === 'long' && channelLow != null && bar.close < channelLow) {
        exitPrice = bar.close;
        reason = 'channel';
      } else if (pos.side === 'short' && channelHigh != null && bar.close > channelHigh) {
        exitPrice = bar.close;
        reason = 'channel';
      }

      if (exitPrice != null && reason) {
        const gross = pos.notional * rawReturn(pos.side, pos.entry, exitPrice);
        const exitFee = pos.notional * FEE;
        equity = Math.max(0, equity + gross - exitFee);
        const pnlUsd = gross - exitFee - pos.entryFee - pos.funding;
        pushTrade({
          id: pos.id,
          side: pos.side,
          status: 'closed',
          entryDate: pos.entryDate,
          exitDate: bar.date,
          entryPrice: pos.entry,
          exitPrice,
          pnlPct: round2((pnlUsd / pos.notional) * 100),
          pnlUsd: round2(pnlUsd),
          bars: i - pos.entryIdx,
          exitReason: reason,
          feesUsd: round2(pos.entryFee + exitFee),
          fundingUsd: round2(pos.funding),
        });
        if (reason === 'stop') {
          cooldownUntil = i + 3;
          cooldownSide = pos.side;
        }
        pos = null;
      }
    }

    if (!pos && i >= warmup && i < candles.length - 1 && equity > 100) {
      const entryHigh = windowExtreme(candles, i, ENTRY_N, 'high');
      const entryLow = windowExtreme(candles, i, ENTRY_N, 'low');
      const emaNow = ema[i];
      const atrNow = atr[i];
      if (
        entryHigh != null &&
        entryLow != null &&
        emaNow != null &&
        atrNow != null &&
        Number.isFinite(emaNow) &&
        Number.isFinite(atrNow) &&
        atrNow > 0 &&
        bar.close > 0
      ) {
        const atrPct = atrNow / bar.close;
        const tradable = atrPct >= 0.005 && atrPct <= 0.12;
        const emaSlope = i >= 5 && Number.isFinite(ema[i - 5]!) ? emaNow - ema[i - 5]! : 0;
        const longSig =
          tradable &&
          bar.close > entryHigh &&
          bar.close > emaNow &&
          emaSlope > 0 &&
          !(cooldownSide === 'long' && i < cooldownUntil);
        const shortSig =
          tradable &&
          bar.close < entryLow &&
          bar.close < emaNow &&
          emaSlope < 0 &&
          !(cooldownSide === 'short' && i < cooldownUntil);
        if (longSig || shortSig) {
          const side: PerpSide = longSig ? 'long' : 'short';
          const stopDist = atrNow * ATR_MULT;
          const notional = Math.min((equity * RISK) / (stopDist / bar.close), equity * MAX_LEV);
          if (notional > 0 && Number.isFinite(notional)) {
            const entryFee = notional * FEE;
            equity = Math.max(0, equity - entryFee);
            pos = {
              id: nextId++,
              side,
              entry: bar.close,
              entryIdx: i,
              entryDate: bar.date,
              stop: side === 'long' ? bar.close - stopDist : bar.close + stopDist,
              notional,
              entryFee,
              funding: 0,
            };
          }
        }
      }
    }

    let unrealized = 0;
    if (pos) {
      const gross = pos.notional * rawReturn(pos.side, pos.entry, bar.close);
      unrealized = gross - pos.notional * FEE;
    }
    curve.push({ date: bar.date, equity: round2(Math.max(0, equity + unrealized)) });
  }

  if (pos) {
    const last = candles[candles.length - 1]!;
    const gross = pos.notional * rawReturn(pos.side, pos.entry, last.close);
    const exitFee = pos.notional * FEE;
    const pnlUsd = gross - exitFee - pos.entryFee - pos.funding;
    pushTrade({
      id: pos.id,
      side: pos.side,
      status: 'open',
      entryDate: pos.entryDate,
      exitDate: null,
      entryPrice: pos.entry,
      exitPrice: last.close,
      pnlPct: round2((pnlUsd / pos.notional) * 100),
      pnlUsd: round2(pnlUsd),
      bars: candles.length - 1 - pos.entryIdx,
      exitReason: 'open',
      feesUsd: round2(pos.entryFee + exitFee),
      fundingUsd: round2(pos.funding),
    });
  }

  const closed = trades.filter((t) => t.status === 'closed');
  const wins = closed.filter((t) => t.pnlUsd > 0);
  const losses = closed.filter((t) => t.pnlUsd < 0);
  const grossWin = wins.reduce((s, t) => s + t.pnlUsd, 0);
  const grossLoss = Math.abs(losses.reduce((s, t) => s + t.pnlUsd, 0));
  const endEquity = curve.length ? curve[curve.length - 1]!.equity : START_EQUITY;
  let peak = curve[0]?.equity ?? START_EQUITY;
  let maxDd = 0;
  for (const point of curve) {
    peak = Math.max(peak, point.equity);
    if (peak > 0) maxDd = Math.min(maxDd, (point.equity - peak) / peak);
  }
  const rets: number[] = [];
  for (let i = 1; i < curve.length; i++) {
    const prev = curve[i - 1]!.equity;
    if (prev > 0) rets.push(curve[i]!.equity / prev - 1);
  }
  const mean = rets.length ? rets.reduce((s, r) => s + r, 0) / rets.length : 0;
  const variance = rets.length
    ? rets.reduce((s, r) => s + (r - mean) ** 2, 0) / rets.length
    : 0;
  const std = Math.sqrt(variance);
  const open = trades.find((t) => t.status === 'open');

  return {
    symbol: meta.symbol,
    pair: meta.pair,
    kind,
    source: meta.source,
    dataNote: meta.dataNote,
    window: {
      from: candles[0]?.date ?? '',
      to: candles[candles.length - 1]?.date ?? '',
      bars: candles.length,
    },
    rules: perpRules(kind),
    summary: {
      startEquity: START_EQUITY,
      endEquity: round2(endEquity),
      totalReturnPct: round2(((endEquity - START_EQUITY) / START_EQUITY) * 100),
      maxDrawdownPct: round2(maxDd * 100),
      winRatePct: closed.length ? round2((wins.length / closed.length) * 100) : 0,
      closedTrades: closed.length,
      profitFactor: grossLoss > 0 ? round2(grossWin / grossLoss) : grossWin > 0 ? 99 : 0,
      sharpe: std > 0 ? round2((mean / std) * Math.sqrt(365)) : 0,
      feesUsd: round2(trades.reduce((s, t) => s + t.feesUsd, 0)),
      fundingUsd: round2(trades.reduce((s, t) => s + t.fundingUsd, 0)),
      longs: trades.filter((t) => t.side === 'long').length,
      shorts: trades.filter((t) => t.side === 'short').length,
      openSide: open?.side ?? 'flat',
      openPnlUsd: open?.pnlUsd ?? 0,
    },
    equity: downsample(curve, 120),
    trades,
    disclaimer: PERP_DISCLAIMER,
  };
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic daily path used when public candles are unavailable. */
export function samplePerpCandles(bars = 420, seed = 61): PerpCandle[] {
  const rand = mulberry32(seed);
  const out: PerpCandle[] = [];
  let price = 40_000;
  const start = Date.UTC(2024, 0, 1);
  for (let i = 0; i < bars; i++) {
    const drift = Math.sin(i / 48) * 0.004;
    const shock = (rand() - 0.48) * 0.045;
    const open = price;
    const close = Math.max(100, open * (1 + drift + shock));
    const high = Math.max(open, close) * (1 + rand() * 0.012);
    const low = Math.min(open, close) * (1 - rand() * 0.012);
    const time = start + i * 86_400_000;
    out.push({
      time,
      date: new Date(time).toISOString().slice(0, 10),
      open,
      high,
      low,
      close,
    });
    price = close;
  }
  return out;
}
