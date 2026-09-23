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
    title: 'Trade Desk — Prediction Markets',
    description:
      'Paper mid fills or live Polymarket CLOB orders on Polygon. Agents61 gap suggestions with wallet signing — research desk, not custody.',
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
          <div className="badge badge-primary mb-3">Trade desk · V2 · 1–3d focus</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Trade desk</h1>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Structure: prediction agents → Gap → 区块链交易指导 →{' '}
            <strong>规则批量纸面</strong> / Live. Default horizon <strong>1–3 days</strong>. Quant
            Lab handles BTC/ETH paper backtests separately. Feed:{' '}
            {live ? 'live Polymarket' : 'fallback'}.
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
