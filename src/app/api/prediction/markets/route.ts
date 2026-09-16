import { NextResponse } from 'next/server';
import { listCachedReports } from '@/lib/prediction/cache';
import { listPredictionMarkets } from '@/lib/prediction/polymarket';
import { gapOf } from '@/lib/prediction/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { markets, live } = await listPredictionMarkets();
  const cached = listCachedReports();
  const byId = new Map(cached.map((r) => [r.marketId, r]));

  const rows = markets.map((m) => {
    const report = byId.get(m.id);
    const agents61 = report?.agents61Probability ?? null;
    const gap = agents61 != null ? gapOf(agents61, m.marketProbability) : null;
    return {
      ...m,
      agents61Probability: agents61,
      probabilityGap: gap,
      confidence: report?.confidence ?? null,
      analyzed: Boolean(report),
    };
  });

  const gaps = rows
    .filter((r) => r.probabilityGap != null)
    .sort((a, b) => Math.abs(b.probabilityGap!) - Math.abs(a.probabilityGap!))
    .slice(0, 8);

  return NextResponse.json({ live, markets: rows, topGaps: gaps });
}
