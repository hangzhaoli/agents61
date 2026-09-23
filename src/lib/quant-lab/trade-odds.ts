/**
 * Quant Lab — composite trade-selection odds (paper estimate).
 * Not a live signal; shrinks historical win rate toward 50% by sample size + Thorp edge.
 */

import type { QuantMasterSlug, ThorpReview } from './types';
import { isCryptoTicker } from './crypto-tickers';

export type TradeOddsVerdict = 'lean_long' | 'watch' | 'skip';

export type TradeOdds = {
  /** Rough historical win rate from rule backtest / master prior (%) */
  historicalWinRatePct: number;
  /** Approximate closed-trade count in the research window */
  sampleTrades: number;
  /** Shrunk next-trade win probability (%) — primary selection odds */
  nextTradeWinProbPct: number;
  /** How sure we are about the odds themselves (%) */
  confidencePct: number;
  /** 0–100 selection score for ranking compiles */
  selectScore: number;
  verdict: TradeOddsVerdict;
  plainHeadline: string;
  plainDetail: string;
  assetClass: 'equity' | 'crypto';
};

/** Master priors when no live backtest numbers are available (educational defaults). */
const MASTER_PRIOR: Record<
  QuantMasterSlug,
  { winRate: number; sample: number; note: string }
> = {
  'jesse-livermore': {
    winRate: 42,
    sample: 35,
    note: 'Trend pyramid: win rate often modest; payoff ratio carries the edge',
  },
  'william-oneil': {
    winRate: 48,
    sample: 40,
    note: 'Breakout filters → mid win rate; stop discipline matters',
  },
  'richard-dennis': {
    winRate: 40,
    sample: 55,
    note: 'Turtle breakouts: lower win rate, fat trend winners',
  },
  'ed-seykota': {
    winRate: 45,
    sample: 50,
    note: 'Trend following: mid-low win rate, longer holds',
  },
  'mark-minervini': {
    winRate: 50,
    sample: 38,
    note: 'SEPA filters are strict: slightly higher win rate, fewer samples',
  },
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function shrinkToCoinFlip(winRate: number, sample: number): number {
  // Pseudo-Bayes: pull toward 50% when sample is thin (strength ≈ 20 pseudo-trades).
  const priorStrength = 20;
  const w = (winRate / 100) * sample + 0.5 * priorStrength;
  const n = sample + priorStrength;
  return clamp((w / n) * 100, 35, 65);
}

function edgeHaircut(edge: ThorpReview['edgeClaim']): number {
  if (edge === 'yes') return 2;
  if (edge === 'no') return -4;
  return -1;
}

export function estimateTradeOdds(opts: {
  masterSlug: QuantMasterSlug;
  ticker: string;
  thorp: ThorpReview;
  /** Optional override from LLM / parsed backtest */
  historicalWinRatePct?: number | null;
  sampleTrades?: number | null;
}): TradeOdds {
  const prior = MASTER_PRIOR[opts.masterSlug] ?? {
    winRate: 45,
    sample: 30,
    note: 'Generic trend-rule prior',
  };
  const crypto = isCryptoTicker(opts.ticker);
  let hist = opts.historicalWinRatePct ?? prior.winRate;
  let sample = opts.sampleTrades ?? prior.sample;

  // Crypto daily rules are noisier — haircut win rate and confidence.
  if (crypto) {
    hist = hist - 3;
    sample = Math.max(15, Math.round(sample * 0.85));
  }

  hist = clamp(hist, 25, 70);
  sample = Math.max(5, Math.min(200, sample));

  let next = shrinkToCoinFlip(hist, sample) + edgeHaircut(opts.thorp.edgeClaim);
  if (crypto) next -= 1;
  next = clamp(next, 35, 62);

  const conf = clamp(
    25 + sample * 0.6 + (opts.thorp.edgeClaim === 'yes' ? 8 : 0) - (crypto ? 6 : 0),
    25,
    75
  );

  // Selection score: prefer edge + confidence, not raw win rate alone.
  const selectScore = clamp(
    next * 0.55 +
      conf * 0.25 +
      (opts.thorp.edgeClaim === 'yes' ? 12 : opts.thorp.edgeClaim === 'no' ? -8 : 0) +
      Math.min(10, sample / 8),
    20,
    85
  );

  let verdict: TradeOddsVerdict = 'watch';
  if (selectScore < 42 || next < 45 || opts.thorp.edgeClaim === 'no') verdict = 'skip';
  else if (selectScore >= 55 && next >= 50 && conf >= 45) verdict = 'lean_long';

  const verdictEn =
    verdict === 'lean_long'
      ? 'Paper long probe is reasonable'
      : verdict === 'skip'
        ? 'Skip this selection'
        : 'Watch — do not rush an entry';

  return {
    historicalWinRatePct: hist,
    sampleTrades: sample,
    nextTradeWinProbPct: next,
    confidencePct: conf,
    selectScore,
    verdict,
    plainHeadline: `Trade-selection win odds ~${next}% (confidence ~${conf}%)`,
    plainDetail: `${opts.ticker} · ${prior.note}. Historical rule win rate ~${hist}% (~${sample} sample trades, shrunk toward 50%). Thorp edge: ${opts.thorp.edgeClaim}. ${verdictEn}. Paper estimate — not a live guarantee.`,
    assetClass: crypto ? 'crypto' : 'equity',
  };
}

export function parseOddsFromSpec(parameters: Record<string, number | string | boolean> | undefined): {
  historicalWinRatePct?: number;
  sampleTrades?: number;
} {
  if (!parameters) return {};
  const wr = Number(parameters.historical_win_rate_pct ?? parameters.winRatePct ?? parameters.win_rate);
  const n = Number(parameters.sample_trades ?? parameters.n_trades ?? parameters.trades);
  return {
    historicalWinRatePct: Number.isFinite(wr) ? wr : undefined,
    sampleTrades: Number.isFinite(n) ? n : undefined,
  };
}
