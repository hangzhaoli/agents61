import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { pageMeta } from '@/lib/seo/meta';
import { listMarkets } from '@/lib/prediction/provider';
import { buildGapRows } from '@/lib/prediction/build-rows';
import AuthGateLink from '@/components/auth/AuthGateLink';
import PredictionHistoryPanel from '@/components/prediction/PredictionHistoryPanel';
import PredictionsSubnav from '@/components/prediction/PredictionsSubnav';
import TopGapsTable from '@/components/prediction/TopGapsTable';
import UrlImportBox from '@/components/prediction/UrlImportBox';
import PredictionDisclaimer from '@/components/prediction/PredictionDisclaimer';

export const revalidate = 300;

export const metadata = pageMeta({
  title: 'Prediction Markets — Polymarket odds vs Agents61 research',
  description:
    'Find where market prices and AI research disagree. Polymarket probability gaps, multi-agent Strategy Reports — research simulation, not betting.',
  path: '/predictions',
  keywords: [
    'Polymarket research',
    'prediction market probability',
    'probability gap analysis',
    'AI prediction market analysis',
    'mispriced prediction markets',
    'Agents61 prediction markets',
  ],
});

export default async function PredictionsDashboardPage() {
  const { markets, live } = await listMarkets({ provider: 'polymarket' });
  const gapRows = buildGapRows(markets, { seed: true, seedCount: 8 });

  return (
    <>
      <Navbar />
      <div className="section-container py-12 md:py-16">
        <PredictionsSubnav active="overview" />

        <header className="max-w-3xl mb-10">
          <div className="badge badge-primary mb-4">Prediction Markets · Polymarket</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Markets price the future.
            <span className="text-gradient"> Agents61 researches the odds.</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Find where market prices and AI research disagree. Compare Polymarket YES probability with
            Agents61 multi-agent estimates — Probability Gaps, not betting tickets.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Feed: {live ? 'live Polymarket Gamma' : 'curated fallback'} · Free: 1 analyze · Paid: news +
            Pro Clerk
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#gaps" className="btn-primary">
              Top Probability Gaps
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </a>
            <Link href="/predictions/scanner" className="btn-secondary">
              Market Scanner
            </Link>
            <Link href="/predictions/watchlist" className="btn-secondary">
              Watchlist
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <UrlImportBox />
          <div className="card p-5 md:p-6 flex flex-col justify-center">
            <h2 className="text-sm font-bold text-slate-900 mb-2">Find Opportunities</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Scan active markets, rank probability disagreements, then run full committee research
              only on top candidates — not every ticker on the tape.
            </p>
            <Link href="/predictions/scanner" className="text-sm font-bold text-[#0052d9] hover:underline">
              Open scanner →
            </Link>
          </div>
        </div>

        <div className="mb-10">
          <TopGapsTable rows={gapRows} />
        </div>

        <PredictionHistoryPanel />

        <section className="mt-10 rounded-2xl bg-[#0052d9] text-white p-8 md:p-10">
          <h2 className="text-2xl font-extrabold mb-3">Research the odds on your desk</h2>
          <p className="text-blue-100 max-w-2xl mb-6">
            Open a market, run Analyze, read the Strategy Report, add to Watchlist. Register to keep
            using the full equity desk alongside prediction research.
          </p>
          <AuthGateLink
            href="/dashboard"
            guestHref="/register"
            className="inline-flex items-center gap-2 bg-white text-[#0052d9] font-semibold px-6 py-3 rounded-xl"
          >
            Register / open desk
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </AuthGateLink>
        </section>

        <PredictionDisclaimer />
      </div>
      <Footer />
    </>
  );
}
