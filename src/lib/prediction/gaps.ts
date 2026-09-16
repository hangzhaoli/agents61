/**
 * Scanner gap rows — filter / sort helpers for Top Gaps.
 */

import type { Confidence, PredictionMarket, PredictionProvider } from './types';

export type GapSort = 'abs_gap' | 'confidence' | 'volume' | 'newest' | 'closing';

export type GapRow = {
  market: PredictionMarket;
  agents61Probability: number;
  gap: number;
  confidence: Confidence;
  volumeUsd: number;
  endDate: string | null;
};

const CONFIDENCE_RANK: Record<Confidence, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

export function sortGapRows(rows: GapRow[], sort: GapSort): GapRow[] {
  const copy = [...rows];
  switch (sort) {
    case 'abs_gap':
      return copy.sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));
    case 'confidence':
      return copy.sort(
        (a, b) =>
          CONFIDENCE_RANK[b.confidence] - CONFIDENCE_RANK[a.confidence] ||
          Math.abs(b.gap) - Math.abs(a.gap)
      );
    case 'volume':
      return copy.sort((a, b) => b.volumeUsd - a.volumeUsd);
    case 'newest':
      // Prefer markets without end date last; otherwise later endDate ≈ fresher listing proxy
      return copy.sort((a, b) => {
        const at = a.endDate ? Date.parse(a.endDate) : 0;
        const bt = b.endDate ? Date.parse(b.endDate) : 0;
        return bt - at;
      });
    case 'closing':
      return copy.sort((a, b) => {
        const at = a.endDate ? Date.parse(a.endDate) : Number.POSITIVE_INFINITY;
        const bt = b.endDate ? Date.parse(b.endDate) : Number.POSITIVE_INFINITY;
        return at - bt;
      });
    default:
      return copy;
  }
}

export function filterGapRowsByCategory(rows: GapRow[], category?: string | null): GapRow[] {
  if (!category || category === 'all') return rows;
  const c = category.toLowerCase();
  return rows.filter((r) => r.market.category.toLowerCase() === c);
}

export function filterGapRowsByProvider(
  rows: GapRow[],
  provider?: PredictionProvider | 'all' | null
): GapRow[] {
  if (!provider || provider === 'all') return rows;
  return rows.filter((r) => r.market.provider === provider);
}

export function filterGapRowsByMinVolume(rows: GapRow[], minVolume?: number | null): GapRow[] {
  if (minVolume == null || !Number.isFinite(minVolume) || minVolume <= 0) return rows;
  return rows.filter((r) => r.volumeUsd >= minVolume);
}

export function filterGapRowsByMinAbsGap(rows: GapRow[], minAbsGap?: number | null): GapRow[] {
  if (minAbsGap == null || !Number.isFinite(minAbsGap) || minAbsGap <= 0) return rows;
  return rows.filter((r) => Math.abs(r.gap) >= minAbsGap);
}

export type GapFilterOpts = {
  category?: string | null;
  provider?: PredictionProvider | 'all' | null;
  minVolume?: number | null;
  minAbsGap?: number | null;
};

export function filterGapRows(rows: GapRow[], opts: GapFilterOpts = {}): GapRow[] {
  let out = rows;
  out = filterGapRowsByCategory(out, opts.category);
  out = filterGapRowsByProvider(out, opts.provider);
  out = filterGapRowsByMinVolume(out, opts.minVolume);
  out = filterGapRowsByMinAbsGap(out, opts.minAbsGap);
  return out;
}
