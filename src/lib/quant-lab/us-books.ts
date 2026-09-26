/**
 * Paper US books besides the equity contract.
 * Shares: long-only stock. Wheel: cash-secured put, then covered calls.
 * Option prices are Black-Scholes marks on the stock's own volatility, not an exchange chain.
 */

import {
  runPerpBacktest,
  type PerpBacktest,
  type PerpCandle,
  type PerpEquityPoint,
  type PerpTrade,
} from '@/lib/quant-lab/perp-strategy';

const START = 10_000;
const STOCK_FEE = 0.0001;
const HOLD_DAYS = 21;
const RATE = 0.04;

export type UsBookStyle = 'contract' | 'shares' | 'wheel';

export function parseUsBookStyle(raw: string | null | undefined, equity: boolean): UsBookStyle {
  if (!equity) return 'contract';
  if (raw === 'shares' || raw === 'wheel' || raw === 'contract') return raw;
  return 'contract';
}

const SHARE_RULES = [
  'Normal shares: long only. The book buys the stock itself. No short and no contract financing.',
  'Enter when the close breaks the prior 20-day high and the 50-day EMA is rising.',
  'Skip the bar when daily ATR is under 0.5% or over 12% of price.',
  'Sell on the 10-day channel or a 2.2 ATR stop. A stop blocks the next buy for 3 bars.',
  'Use available cash. Commission is 1 bp a side.',
];

const WHEEL_RULES = [
  'Options wheel: sell a 21-day cash-secured put about 30 delta, then covered calls if assigned.',
  'Puts are sold only while the close is above a rising 50-day EMA.',
  'Assignment buys the shares at the strike. The next call is sold against those shares.',
  'A call that finishes in the money sells the shares at the strike. An out-of-the-money call expires and another is sold.',
  'An ATR stop can sell the shares and buy the call back early.',
  'Premiums are Black-Scholes marks from the stock’s own 20-day volatility. Not an options-chain quote.',
];

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function normCdf(x: number) {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const t = 1 / (1 + p * Math.abs(x));
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1 + sign * y);
}

function invNorm(p: number) {
  const a = [
    -39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716,
    2.506628277459239,
  ];
  const b = [
    -54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572,
  ];
  const c = [
    -0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968,
    2.938163982698783,
  ];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const plow = 0.02425;
  const phigh = 1 - plow;
  let q: number;
  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
    );
  }
  if (p > phigh) {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(
      (((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
    );
  }
  q = p - 0.5;
  const r = q * q;
  return (
    ((((((a[0]! * r + a[1]!) * r + a[2]!) * r + a[3]!) * r + a[4]!) * r + a[5]!) * q) /
    (((((b[0]! * r + b[1]!) * r + b[2]!) * r + b[3]!) * r + b[4]!) * r + 1)
  );
}

function bsPrice(right: 'call' | 'put', spot: number, strike: number, days: number, vol: number) {
  const T = Math.max(days, 0) / 365;
  if (T <= 1 / 3650) {
    return right === 'call' ? Math.max(spot - strike, 0) : Math.max(strike - spot, 0);
  }
  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(spot / strike) + (RATE + (vol * vol) / 2) * T) / (vol * sqrtT);
  const d2 = d1 - vol * sqrtT;
  if (right === 'call') {
    return spot * normCdf(d1) - strike * Math.exp(-RATE * T) * normCdf(d2);
  }
  return strike * Math.exp(-RATE * T) * normCdf(-d2) - spot * normCdf(-d1);
}

function strikeForDelta(right: 'call' | 'put', spot: number, vol: number) {
  const T = HOLD_DAYS / 365;
  const d1 = invNorm(right === 'call' ? 0.3 : 0.7);
  const strike = spot * Math.exp((RATE + (vol * vol) / 2) * T - d1 * vol * Math.sqrt(T));
  return Math.max(0.01, round2(strike));
}

function realizedVol(closes: number[], index: number) {
  const n = 20;
  if (index < n) return 0.25;
  const rets: number[] = [];
  for (let j = index - n + 1; j <= index; j++) {
    const prev = closes[j - 1]!;
    if (prev > 0) rets.push(Math.log(closes[j]! / prev));
  }
  if (rets.length < 5) return 0.25;
  const mean = rets.reduce((s, x) => s + x, 0) / rets.length;
  const variance = rets.reduce((s, x) => s + (x - mean) ** 2, 0) / rets.length;
  return Math.min(0.8, Math.max(0.12, Math.sqrt(variance) * Math.sqrt(252)));
}

function emaSeries(closes: number[], n: number) {
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

function atrAt(candles: PerpCandle[], index: number) {
  const n = 14;
  if (index < n) return Number.NaN;
  let prev = 0;
  for (let i = 1; i <= n; i++) {
    const bar = candles[i]!;
    const prevClose = candles[i - 1]!.close;
    prev += Math.max(bar.high - bar.low, Math.abs(bar.high - prevClose), Math.abs(bar.low - prevClose));
  }
  prev /= n;
  for (let i = n + 1; i <= index; i++) {
    const bar = candles[i]!;
    const prevClose = candles[i - 1]!.close;
    const tr = Math.max(bar.high - bar.low, Math.abs(bar.high - prevClose), Math.abs(bar.low - prevClose));
    prev = (prev * (n - 1) + tr) / n;
  }
  return prev;
}

function highest(candles: PerpCandle[], index: number, n: number) {
  if (index < n) return null;
  let value = -Infinity;
  for (let j = index - n; j < index; j++) value = Math.max(value, candles[j]!.high);
  return value;
}

function lowest(candles: PerpCandle[], index: number, n: number) {
  if (index < n) return null;
  let value = Infinity;
  for (let j = index - n; j < index; j++) value = Math.min(value, candles[j]!.low);
  return value;
}

function pack(
  meta: {
    symbol: string;
    pair: string;
    source: PerpBacktest['source'];
    dataNote: string;
  },
  rules: string[],
  trades: PerpTrade[],
  curve: PerpEquityPoint[]
): PerpBacktest {
  const closed = trades.filter((t) => t.status === 'closed');
  const wins = closed.filter((t) => t.pnlUsd > 0);
  const losses = closed.filter((t) => t.pnlUsd < 0);
  const grossWin = wins.reduce((s, t) => s + t.pnlUsd, 0);
  const grossLoss = Math.abs(losses.reduce((s, t) => s + t.pnlUsd, 0));
  const endEquity = curve.length ? curve[curve.length - 1]!.equity : START;
  let peak = curve[0]?.equity ?? START;
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
  const variance = rets.length ? rets.reduce((s, r) => s + (r - mean) ** 2, 0) / rets.length : 0;
  const std = Math.sqrt(variance);
  const open = trades.find((t) => t.status === 'open');
  const step = curve.length <= 120 ? 1 : (curve.length - 1) / 119;
  const equity: PerpEquityPoint[] = [];
  if (step === 1) equity.push(...curve);
  else for (let i = 0; i < 120; i++) equity.push(curve[Math.round(i * step)]!);

  return {
    symbol: meta.symbol,
    pair: meta.pair,
    kind: 'equity',
    source: meta.source,
    dataNote: meta.dataNote,
    window: {
      from: curve[0]?.date ?? '',
      to: curve[curve.length - 1]?.date ?? '',
      bars: curve.length,
    },
    rules,
    summary: {
      startEquity: START,
      endEquity: round2(endEquity),
      totalReturnPct: round2(((endEquity - START) / START) * 100),
      maxDrawdownPct: round2(maxDd * 100),
      winRatePct: closed.length ? round2((wins.length / closed.length) * 100) : 0,
      closedTrades: closed.length,
      profitFactor: grossLoss > 0 ? round2(grossWin / grossLoss) : grossWin > 0 ? 99 : 0,
      sharpe: std > 0 ? round2((mean / std) * Math.sqrt(365)) : 0,
      feesUsd: round2(trades.reduce((s, t) => s + t.feesUsd, 0)),
      fundingUsd: round2(trades.reduce((s, t) => s + t.fundingUsd, 0)),
      longs: trades.filter((t) => t.instrument === 'Shares' || t.side === 'long').length,
      shorts: trades.filter((t) => t.instrument === 'Call' || t.instrument === 'Put').length,
      openSide: open?.side ?? 'flat',
      openPnlUsd: open?.pnlUsd ?? 0,
    },
    equity,
    trades,
    disclaimer:
      'Paper US book. Signals fill on the daily bar. Option prices are a volatility model, not a listed chain. Not live trading and not investment advice.',
  };
}

export function runShareBook(
  candles: PerpCandle[],
  meta: { symbol: string; pair: string; source: PerpBacktest['source']; dataNote: string }
): PerpBacktest {
  const closes = candles.map((c) => c.close);
  const ema = emaSeries(closes, 50);
  let cash = START;
  let shares = 0;
  let entry = 0;
  let entryIdx = 0;
  let entryDate = '';
  let entryFee = 0;
  let stop = 0;
  let nextId = 1;
  let cooldownUntil = -1;
  const trades: PerpTrade[] = [];
  const curve: PerpEquityPoint[] = [];

  const closeShares = (index: number, exitPrice: number, reason: 'stop' | 'channel') => {
    const fee = shares * exitPrice * STOCK_FEE;
    const pnl = (exitPrice - entry) * shares - fee - entryFee;
    cash += shares * exitPrice - fee;
    trades.push({
      id: nextId++,
      side: 'long',
      instrument: 'Shares',
      status: 'closed',
      entryDate,
      exitDate: candles[index]!.date,
      entryPrice: entry,
      exitPrice,
      pnlPct: entry > 0 ? round2(((exitPrice - entry) / entry) * 100) : 0,
      pnlUsd: round2(pnl),
      bars: index - entryIdx,
      exitReason: reason,
      feesUsd: round2(entryFee + fee),
      fundingUsd: 0,
    });
    shares = 0;
    if (reason === 'stop') cooldownUntil = index + 3;
  };

  for (let i = 0; i < candles.length; i++) {
    const bar = candles[i]!;
    if (i >= 51 && shares > 0) {
      const channelLow = lowest(candles, i, 10);
      if (bar.low <= stop) closeShares(i, bar.open < stop ? bar.open : stop, 'stop');
      else if (channelLow != null && bar.close < channelLow) closeShares(i, bar.close, 'channel');
    }
    if (i >= 51 && shares === 0 && i < candles.length - 1 && cash > 100 && i >= cooldownUntil) {
      const entryHigh = highest(candles, i, 20);
      const emaNow = ema[i];
      const atr = atrAt(candles, i);
      const slope = i >= 5 && Number.isFinite(ema[i - 5]!) ? emaNow! - ema[i - 5]! : 0;
      const atrPct = atr / bar.close;
      if (
        entryHigh != null &&
        emaNow != null &&
        Number.isFinite(emaNow) &&
        Number.isFinite(atr) &&
        atrPct >= 0.005 &&
        atrPct <= 0.12 &&
        bar.close > entryHigh &&
        bar.close > emaNow &&
        slope > 0
      ) {
        const qty = cash / (bar.close * (1 + STOCK_FEE));
        const fee = qty * bar.close * STOCK_FEE;
        shares = qty;
        entry = bar.close;
        entryIdx = i;
        entryDate = bar.date;
        entryFee = fee;
        stop = bar.close - atr * 2.2;
        cash -= qty * bar.close + fee;
      }
    }
    curve.push({ date: bar.date, equity: round2(Math.max(0, cash + shares * bar.close)) });
  }

  if (shares > 0) {
    const last = candles[candles.length - 1]!;
    const fee = shares * last.close * STOCK_FEE;
    trades.push({
      id: nextId++,
      side: 'long',
      instrument: 'Shares',
      status: 'open',
      entryDate,
      exitDate: null,
      entryPrice: entry,
      exitPrice: last.close,
      pnlPct: entry > 0 ? round2(((last.close - entry) / entry) * 100) : 0,
      pnlUsd: round2((last.close - entry) * shares - fee - entryFee),
      bars: candles.length - 1 - entryIdx,
      exitReason: 'open',
      feesUsd: round2(entryFee + fee),
      fundingUsd: 0,
    });
  }

  return pack(meta, SHARE_RULES, trades, curve);
}

type ShortOpt = {
  right: 'call' | 'put';
  strike: number;
  qty: number;
  expiry: number;
  premium: number;
  entryIdx: number;
  entryDate: string;
  vol: number;
};

export function runWheelBook(
  candles: PerpCandle[],
  meta: { symbol: string; pair: string; source: PerpBacktest['source']; dataNote: string }
): PerpBacktest {
  const closes = candles.map((c) => c.close);
  const ema = emaSeries(closes, 50);
  let cash = START;
  let shares = 0;
  let shareEntry = 0;
  let shareIdx = 0;
  let shareDate = '';
  let shareFee = 0;
  let shareStop = 0;
  let opt: ShortOpt | null = null;
  let nextId = 1;
  const trades: PerpTrade[] = [];
  const curve: PerpEquityPoint[] = [];

  const pushOpt = (index: number, exitPrice: number, reason: PerpTrade['exitReason'], pnl: number) => {
    if (!opt) return;
    trades.push({
      id: nextId++,
      side: 'short',
      instrument: opt.right === 'call' ? 'Call' : 'Put',
      status: reason === 'open' ? 'open' : 'closed',
      entryDate: opt.entryDate,
      exitDate: reason === 'open' ? null : candles[index]!.date,
      entryPrice: opt.premium,
      exitPrice,
      pnlPct: opt.strike > 0 ? round2((pnl / (opt.strike * opt.qty)) * 100) : 0,
      pnlUsd: round2(pnl),
      bars: index - opt.entryIdx,
      exitReason: reason,
      feesUsd: round2(opt.qty * candles[opt.entryIdx]!.close * STOCK_FEE),
      fundingUsd: 0,
    });
  };

  const sellOption = (right: 'call' | 'put', index: number, qty: number) => {
    const bar = candles[index]!;
    const vol = realizedVol(closes, index);
    const strike = strikeForDelta(right, bar.close, vol);
    const premium = bsPrice(right, bar.close, strike, HOLD_DAYS, vol);
    if (!Number.isFinite(premium) || premium <= 0 || qty <= 0) return false;
    const fee = qty * bar.close * STOCK_FEE;
    cash += premium * qty - fee;
    opt = {
      right,
      strike,
      qty,
      expiry: index + HOLD_DAYS,
      premium,
      entryIdx: index,
      entryDate: bar.date,
      vol,
    };
    return true;
  };

  for (let i = 0; i < candles.length; i++) {
    const bar = candles[i]!;
    if (opt && i >= opt.expiry) {
      const intrinsic =
        opt.right === 'call' ? Math.max(bar.close - opt.strike, 0) : Math.max(opt.strike - bar.close, 0);
      const pnl = opt.premium * opt.qty - intrinsic * opt.qty;
      if (opt.right === 'put' && bar.close < opt.strike) {
        cash -= opt.strike * opt.qty;
        shares = opt.qty;
        shareEntry = opt.strike;
        shareIdx = i;
        shareDate = bar.date;
        shareFee = 0;
        const atr = atrAt(candles, i);
        shareStop = opt.strike - (Number.isFinite(atr) ? atr : opt.strike * 0.03) * 2.2;
        pushOpt(i, intrinsic, 'assigned', pnl);
      } else if (opt.right === 'call' && bar.close > opt.strike) {
        cash += opt.strike * shares;
        shares = 0;
        pushOpt(i, intrinsic, 'called', pnl);
      } else {
        pushOpt(i, 0, 'expiry', pnl);
      }
      opt = null;
    } else if (opt && shares > 0 && bar.low <= shareStop) {
      const exitPx = bar.open < shareStop ? bar.open : shareStop;
      const daysLeft = Math.max(opt.expiry - i, 0);
      const mark = bsPrice('call', exitPx, opt.strike, daysLeft, opt.vol);
      const optPnl = opt.premium * opt.qty - mark * opt.qty;
      cash -= mark * opt.qty;
      pushOpt(i, mark, 'stop', optPnl);
      opt = null;
      const fee = shares * exitPx * STOCK_FEE;
      const sharePnl = (exitPx - shareEntry) * shares - fee - shareFee;
      cash += shares * exitPx - fee;
      trades.push({
        id: nextId++,
        side: 'long',
        instrument: 'Shares',
        status: 'closed',
        entryDate: shareDate,
        exitDate: bar.date,
        entryPrice: shareEntry,
        exitPrice: exitPx,
        pnlPct: shareEntry > 0 ? round2(((exitPx - shareEntry) / shareEntry) * 100) : 0,
        pnlUsd: round2(sharePnl),
        bars: i - shareIdx,
        exitReason: 'stop',
        feesUsd: round2(fee + shareFee),
        fundingUsd: 0,
      });
      shares = 0;
    }

    if (i >= 51 && i < candles.length - HOLD_DAYS && !opt) {
      const emaNow = ema[i];
      const slope = i >= 5 && Number.isFinite(ema[i - 5]!) && emaNow != null ? emaNow - ema[i - 5]! : 0;
      const bullish = emaNow != null && Number.isFinite(emaNow) && bar.close > emaNow && slope > 0;
      if (shares > 0) sellOption('call', i, shares);
      else if (bullish) {
        const vol = realizedVol(closes, i);
        const strike = strikeForDelta('put', bar.close, vol);
        const qty = (cash * 0.95) / strike;
        if (qty > 0) sellOption('put', i, qty);
      }
    }

    let liability = 0;
    if (opt) {
      const daysLeft = Math.max(opt.expiry - i, 0);
      liability = bsPrice(opt.right, bar.close, opt.strike, daysLeft, opt.vol) * opt.qty;
    }
    curve.push({
      date: bar.date,
      equity: round2(Math.max(0, cash + shares * bar.close - liability)),
    });
  }

  const last = candles[candles.length - 1];
  if (last && opt) {
    const daysLeft = Math.max(opt.expiry - (candles.length - 1), 0);
    const mark = bsPrice(opt.right, last.close, opt.strike, daysLeft, opt.vol);
    pushOpt(candles.length - 1, mark, 'open', opt.premium * opt.qty - mark * opt.qty);
  }
  if (last && shares > 0) {
    trades.push({
      id: nextId++,
      side: 'long',
      instrument: 'Shares',
      status: 'open',
      entryDate: shareDate,
      exitDate: null,
      entryPrice: shareEntry,
      exitPrice: last.close,
      pnlPct: shareEntry > 0 ? round2(((last.close - shareEntry) / shareEntry) * 100) : 0,
      pnlUsd: round2((last.close - shareEntry) * shares),
      bars: candles.length - 1 - shareIdx,
      exitReason: 'open',
      feesUsd: round2(shareFee),
      fundingUsd: 0,
    });
  }

  return pack(meta, WHEEL_RULES, trades, curve);
}

export function runUsBook(
  style: UsBookStyle,
  candles: PerpCandle[],
  meta: { symbol: string; pair: string; source: PerpBacktest['source']; dataNote: string; kind?: 'crypto' | 'equity' }
): PerpBacktest {
  if (style === 'shares') return runShareBook(candles, meta);
  if (style === 'wheel') return runWheelBook(candles, meta);
  return runPerpBacktest(candles, meta);
}
