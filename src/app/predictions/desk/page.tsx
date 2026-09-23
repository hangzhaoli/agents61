import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo/meta';
import { listMarkets } from '@/lib/prediction/provider';
import { buildGapRows } from '@/lib/prediction/build-rows';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PredictionsSubnav from '@/components/prediction/PredictionsSubnav';
import PaperTradeDesk from '@/components/prediction/PaperTradeDesk';
import PredictionDisclaimer from '@/components/prediction/PredictionDisclaimer';

export const revalidate = 300;

export const metadata: Metadata = {
  ...pageMeta({
    title: 'Paper Trade Desk — Prediction Markets',
    description:
      'Paper-trade Agents61 probability-gap suggestions at Polymarket mid. Virtual fills only — no wallet, no live order routing.',
    path: '/predictions/desk',
  }),
  robots: { index: false, follow: false },
};

export default async function PredictionsDeskPage() {
  const { markets, live } = await listMarkets({ provider: 'polymarket' });
  const rows = buildGapRows(markets, { seed: true, seedCount: 10 });

  return (
    <>
      <Navbar />
      <div className="section-container py-12 md:py-16">
        <PredictionsSubnav active="/predictions/desk" />
        <header className="max-w-3xl mb-8">
          <div className="badge badge-primary mb-3">Paper desk · V1</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Trade desk</h1>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Left: gap suggestions. Right: paper book. Fills at YES mid, zero fees, stored in this
            browser only. Feed: {live ? 'live Polymarket' : 'fallback'}. Not a wallet — not live
            Polymarket execution.
          </p>
        </header>
        <PaperTradeDesk rows={rows} />
        <div className="mt-10">
          <PredictionDisclaimer />
        </div>
      </div>
      <Footer />
    </>
  );
}
