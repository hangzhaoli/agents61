import { listCachedReports } from '@/lib/prediction/cache';
import { seedTemplateReport } from '@/lib/prediction/analyze';
import type { GapRow } from '@/lib/prediction/gaps';
import type { PredictionMarket } from '@/lib/prediction/types';
import { gapOf } from '@/lib/prediction/types';

/** Build gap rows; optionally seed templates so Top Gaps is not empty. */
export function buildGapRows(
  markets: PredictionMarket[],
  opts?: { seed?: boolean; seedCount?: number }
): GapRow[] {
  if (opts?.seed && listCachedReports().length < 3) {
    for (const m of markets.slice(0, opts.seedCount ?? 8)) seedTemplateReport(m);
  }
  const byId = new Map(listCachedReports().map((r) => [r.marketId, r]));
  const rows: GapRow[] = [];
  for (const market of markets) {
    const report = byId.get(market.id);
    if (!report) continue;
    rows.push({
      market,
      agents61Probability: report.agents61Probability,
      gap: gapOf(report.agents61Probability, market.marketProbability),
      confidence: report.confidence,
      volumeUsd: market.volumeUsd,
      endDate: market.endDate,
    });
  }
  return rows;
}
