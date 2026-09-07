/**
 * Quant Lab — timing/exit masters compilable to rule-based backtest scripts.
 */

import type { QuantMasterSlug } from '@/lib/quant-lab/types';

export type QuantMasterProfile = {
  slug: QuantMasterSlug;
  label: string;
  system: string;
  defaultParams: Record<string, number | string>;
  compileHint: string;
};

export const QUANT_MASTERS: QuantMasterProfile[] = [
  {
    slug: 'jesse-livermore',
    label: 'Jesse Livermore · tape + iron stop',
    system: 'Pyramiding winners, cutting losers fast, never averaging down. Trend line breaks and pivot points.',
    defaultParams: { stop_pct: 0.1, pyramid_max: 3, min_trend_days: 20 },
    compileHint: 'Long-only breakout with trailing stop from pivot; exit on trend break.',
  },
  {
    slug: 'william-oneil',
    label: "William O'Neil · CANSLIM breakout",
    system: 'CANSLIM cup-with-handle style breakout on volume; ~7-8% stop discipline; market follow-through filter.',
    defaultParams: { stop_pct: 0.08, base_weeks: 7, volume_multiple: 1.4, rs_min: 80 },
    compileHint: 'Buy new high on volume surge; sell on stop_pct loss from entry.',
  },
  {
    slug: 'richard-dennis',
    label: 'Richard Dennis · Turtle breakout',
    system: 'Dual Donchian: 20-day entry, 10-day exit (short system omitted for long-only research default).',
    defaultParams: { entry_days: 20, exit_days: 10, atr_stop_mult: 2 },
    compileHint: 'Donchian channel breakout entry; opposite channel or ATR stop exit.',
  },
  {
    slug: 'ed-seykota',
    label: 'Ed Seykota · trend momentum',
    system: 'Trend-following with volatility-scaled position; ride until MA cross or trailing stop.',
    defaultParams: { fast_ma: 50, slow_ma: 200, trail_atr: 3 },
    compileHint: 'Enter when fast MA > slow MA and price makes 20d high; exit on MA cross or ATR trail.',
  },
  {
    slug: 'mark-minervini',
    label: 'Mark Minervini · SEPA stage-2',
    system: 'Stage-2 uptrend: price above rising 150/200 MA, RS high, tight pivot breakout.',
    defaultParams: { stop_pct: 0.07, rs_lookback: 90, ma_filter: 200 },
    compileHint: 'Long when above rising 200MA with RS rank proxy; 7% stop.',
  },
];

export function getQuantMaster(slug: string): QuantMasterProfile | undefined {
  return QUANT_MASTERS.find((m) => m.slug === slug);
}

export const QUANT_LAB_DISCLAIMER =
  'Paper backtest research only. Not live trading. Not investment advice. Slippage, fees, and survivorship bias are not fully modeled.';
