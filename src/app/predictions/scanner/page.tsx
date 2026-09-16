import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { pageMeta } from '@/lib/seo/meta';
import { listMarkets } from '@/lib/prediction/provider';
import { buildGapRows } from '@/lib/prediction/build-rows';
import { gapOf } from '@/lib/prediction/types';
import type { GapRow } from '@/lib/prediction/gaps';
import PredictionsSubnav from '@/components/prediction/PredictionsSubnav';
import ScannerClient from '@/components/prediction/ScannerClient';
import PredictionDisclaimer from '@/components/prediction/PredictionDisclaimer';
import { listCachedReports } from '@/lib/prediction/cache';
import { seedTemplateReport } from '@/lib/prediction/analyze';

export const revalidate = 300;

export const metadata = pageMeta({
  title: 'Market Scanner — Prediction Markets',
  description:
    'Scan Polymarket markets by volume, category, and probability gap. Filter research candidates before running the full Agents61 committee.',
  path: '/predictions/scanner',
});

export default async function PredictionsScannerPage() {
  const { markets, live } = await listMarkets({ provider: 'polymarket' });

  // Seed lightly so scanner shows Agents61 columns for hot markets
  if (listCachedReports().length < 6) {
    for (const m of markets.slice(0, 12)) seedTemplateReport(m);
  }

  const byId = new Map(listCachedReports().map((r) => [r.marketId, r]));
  const rows: GapRow[] = markets.map((market) => {
    const report = byId.get(market.id);
    const agents61 = report?.agents61Probability ?? market.marketProbability;
    const gap = gapOf(agents61, market.marketProbability);
    return {
      market,
      agents61Probability: agents61,
      gap: report ? gap : 0,
      confidence: report?.confidence ?? 'Low',
      volumeUsd: market.volumeUsd,
      endDate: market.endDate,
    };
  });

  // Prefer true gap rows when available for sort fidelity
  const researched = buildGapRows(markets);
  const merged = researched.length >= 4 ? researched : rows;

  return (
    <>
      <Navbar />
      <div className="section-container py-12 md:py-16">
        <PredictionsSubnav active="/predictions/scanner" />
        <header className="max-w-3xl mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Market Scanner</h1>
          <p className="mt-3 text-slate-600">
            Filter active prediction markets. Stage-1 scan is cheap; full committee runs only when you
            Analyze. Feed: {live ? 'live Polymarket' : 'fallback'}.
          </p>
        </header>
        <ScannerClient rows={merged} />
        <PredictionDisclaimer />
      </div>
      <Footer />
    </>
  );
}
