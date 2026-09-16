import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { pageMeta } from '@/lib/seo/meta';
import { getPredictionMarket } from '@/lib/prediction/polymarket';
import { getCachedReport } from '@/lib/prediction/cache';
import { formatGap, gapOf } from '@/lib/prediction/types';
import AnalyzeButton from '@/components/prediction/AnalyzeButton';
import StrategyReportView from '@/components/prediction/StrategyReportView';
import AuthGateLink from '@/components/auth/AuthGateLink';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const market = await getPredictionMarket(decodeURIComponent(id));
  return pageMeta({
    title: market ? `${market.question.slice(0, 60)} — Prediction research` : 'Prediction market',
    description:
      'Polymarket probability vs Agents61 multi-agent research. Strategy report with gaps, catalysts, and resolution risk. Not betting advice.',
    path: `/prediction-markets/${id}`,
  });
}

export default async function PredictionMarketDetailPage({ params }: Props) {
  const { id: raw } = await params;
  const id = decodeURIComponent(raw);
  const market = await getPredictionMarket(id);
  if (!market) notFound();

  const report = getCachedReport(market.id);
  const agents61 = report?.agents61Probability ?? null;
  const gap = agents61 != null ? gapOf(agents61, market.marketProbability) : null;

  return (
    <>
      <Navbar />
      <div className="section-container py-12 md:py-16">
        <p className="text-sm text-slate-500 mb-4">
          <Link href="/prediction-markets" className="hover:text-[#0052d9]">
            ← Prediction Markets
          </Link>
        </p>

        <header className="max-w-3xl mb-8">
          <div className="badge badge-primary mb-3">Polymarket · research only</div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight">{market.question}</h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">{market.description}</p>
          <p className="mt-2 text-xs text-slate-400">
            Volume {market.volumeLabel} · Closes {market.endDateLabel} ·{' '}
            <Link href={market.url} target="_blank" rel="noopener noreferrer" className="text-[#0052d9] hover:underline">
              Open on Polymarket
            </Link>
          </p>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {(
            [
              ['Market Probability', `${market.marketProbability}%`],
              ['Agents61 Probability', agents61 != null ? `${agents61}%` : '—'],
              ['Probability Gap', gap != null ? formatGap(gap) : '—'],
              ['Confidence', report?.confidence ?? '—'],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center">
              <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{label}</div>
              <div className="text-3xl font-extrabold text-slate-900 tabular-nums mt-2">{value}</div>
            </div>
          ))}
        </section>

        <div className="mb-10 flex flex-wrap items-center gap-4">
          <AnalyzeButton marketId={market.id} />
          <p className="text-xs text-slate-500 max-w-md">
            Runs News, Data, Base Rate, Domain, Market, Bayesian, Contrarian, Red Team, Resolution, and
            Risk agents — then Prediction Clerk. No trading.
          </p>
        </div>

        {report ? (
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Strategy Report</h2>
            <StrategyReportView report={report} />
          </section>
        ) : (
          <section className="card p-8 text-center text-slate-600">
            <p className="text-sm">No Agents61 report yet. Click Analyze to research this market’s odds.</p>
          </section>
        )}

        <section className="mt-12 rounded-2xl bg-slate-900 text-white p-8">
          <h2 className="text-xl font-bold mb-2">Keep researching on the desk</h2>
          <p className="text-slate-300 text-sm mb-5 max-w-xl">
            Prediction Markets is odds research. The equity desk staffs legends on tickers the same way —
            isolated briefs, then a clerk. Register to enter.
          </p>
          <AuthGateLink
            href="/dashboard"
            guestHref="/register"
            className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-5 py-2.5 rounded-xl"
          >
            Register / sign in
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </AuthGateLink>
        </section>
      </div>
      <Footer />
    </>
  );
}
