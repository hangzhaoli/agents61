/**
 * Rule engine for Prediction Desk batch paper opens.
 * Same filters as human desk defaults — no auto Live.
 */

import type { GapRow } from './gaps';
import { daysUntilEnd } from './types';
import type { DeskSide } from './paper-desk';

export type BatchRuleConfig = {
  minAbsGap: number;
  minMid: number;
  maxMid: number;
  /** Inclusive days-to-end window; null = any */
  minDays: number | null;
  maxDays: number | null;
  /** Skip Low confidence when true */
  requireMediumPlus: boolean;
  maxPositions: number;
  stakeUsd: number;
};

export const DEFAULT_BATCH_RULES: BatchRuleConfig = {
  minAbsGap: 3,
  minMid: 10,
  maxMid: 90,
  minDays: 1,
  maxDays: 3,
  requireMediumPlus: true,
  maxPositions: 5,
  stakeUsd: 100,
};

export type BatchCandidate = {
  row: GapRow;
  side: DeskSide;
  daysLeft: number | null;
  reason: string;
};

export function matchBatchRules(rows: GapRow[], rules: BatchRuleConfig): BatchCandidate[] {
  const out: BatchCandidate[] = [];
  const ranked = [...rows].sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));

  for (const row of ranked) {
    if (out.length >= rules.maxPositions) break;
    const mid = row.market.marketProbability;
    const absGap = Math.abs(row.gap);
    if (absGap < rules.minAbsGap) continue;
    if (mid < rules.minMid || mid > rules.maxMid) continue;
    if (rules.requireMediumPlus && row.confidence === 'Low') continue;

    const days = daysUntilEnd(row.market.endDate);
    if (rules.minDays != null || rules.maxDays != null) {
      if (days == null) continue;
      if (rules.minDays != null && days < rules.minDays) continue;
      if (rules.maxDays != null && days > rules.maxDays) continue;
    }

    const side: DeskSide = row.gap > 0 ? 'YES' : 'NO';
    out.push({
      row,
      side,
      daysLeft: days,
      reason: `gap ${row.gap > 0 ? '+' : ''}${row.gap} · conf ${row.confidence} · ${
        days == null ? 'open-ended' : `${days}d`
      }`,
    });
  }
  return out;
}
