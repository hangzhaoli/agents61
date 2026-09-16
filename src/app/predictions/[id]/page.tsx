import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { pageMeta } from '@/lib/seo/meta';
import { getMarketById } from '@/lib/prediction/provider';
import { getCachedReport } from '@/lib/prediction/cache';
import { formatGap, gapOf } from '@/lib/prediction/types';
import AnalyzeButton from '@/components/prediction/AnalyzeButton';
import StrategyReportView from '@/components/prediction/StrategyReportView';
import SaveReportButton from '@/components/prediction/SaveReportButton';
import WatchlistButton from '@/components/prediction/WatchlistButton';
import ProbabilityCompare from '@/components/prediction/ProbabilityCompare';
import ProbabilityHistoryChart from '@/components/prediction/ProbabilityHistoryChart';
import PredictionsSubnav from '@/components/prediction/PredictionsSubnav';
import PredictionDisclaimer from '@/components/prediction/PredictionDisclaimer';
import AuthGateLink from '@/components/auth/AuthGateLink';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const market = await getMarketById(decodeURIComponent(id));
  return pageMeta({
    title: market ? `${market.question.slice(0, 60)} — Prediction research` : 'Prediction market',
    description:
      'Polymarket probability vs Agents61 multi-agent research. Strategy report with gaps, catalysts, and resolution risk. Not betting advice.',
    path: `/predictions/${id}`,
  });
}

export default async function PredictionDetailPage({ params }: Props) {
  const { id: raw } = await params;
  const id = decodeURIComponent(raw);
  const market = await getMarketById(id);
  if (!market) notFound();

  const report = getCachedReport(market.id);
  const agents61 = report?.agents61Probability ?? null;
  const gap = agents61 != null ? gapOf(agents61, market.marketProbability) : null;

  return (
    <>
      <Navbar />
      <div className="section-container py-12 md:py-16">
        <PredictionsSubnav />
        <p className="text-sm text-slate-500 mb-4">
          <Link href="/predictions" className="hover:text-[#0052d9]">
            ← Prediction Markets
          </Link>
        </p>

        <header className="max-w-3xl mb-8">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="badge badge-primary capitalize">{market.provider}</span>
            <span className="badge bg-slate-100 text-slate-600">Open</span>
            <span className="badge bg-slate-100 text-slate-600">{market.category}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            {market.question}
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">{market.description}</p>
          <p className="mt-2 text-xs text-slate-400">
            Volume {market.volumeLabel} · Closes {market.endDateLabel}
            {report ? ` · Last analyzed ${new Date(report.analyzedAt).toLocaleString()}` : ''}
            {' · '}
            <Link href={market.url} target="_blank" rel="noopener noreferrer" className="text-[#0052d9] hover:underline">
              View source market
            </Link>
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 mb-8">
          <ProbabilityCompare
            marketProbability={market.marketProbability}
            agents61Probability={agents61}
            gap={gap}
            range={report?.probabilityRange}
          />
          <ProbabilityHistoryChart marketId={market.id} />
        </div>

        <div className="mb-10 flex flex-wrap items-start gap-3">
          <AnalyzeButton marketId={market.id} />
          <WatchlistButton market={market} agents61Probability={agents61} />
          <p className="text-xs text-slate-500 max-w-md pt-2">
            What does the market think? What does Agents61 think? How large is the disagreement? Why —
            and what would make Agents61 wrong?
          </p>
        </div>

        {report ? (
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold text-slate-900">Strategy Report</h2>
              <SaveReportButton
                marketId={market.id}
                marketSlug={market.slug}
                question={market.question}
                report={report}
              />
            </div>
            <StrategyReportView report={report} />
          </section>
        ) : (
          <section className="card p-8 text-center text-slate-600">
            <p className="text-sm">
              No Agents61 report yet. Click Analyze to research this market&apos;s odds.
            </p>
            {gap != null && (
              <p className="text-xs text-slate-400 mt-2">
                Current gap preview {formatGap(gap)} — run analysis for a full committee report.
              </p>
            )}
          </section>
        )}

        <section className="mt-12 rounded-2xl bg-slate-900 text-white p-8">
          <h2 className="text-xl font-bold mb-2">Keep researching on the desk</h2>
          <p className="text-slate-300 text-sm mb-5 max-w-xl">
            Prediction Markets is odds research. The equity desk staffs legends on tickers the same
            way — isolated briefs, then a clerk.
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

        <PredictionDisclaimer />
      </div>
      <Footer />
    </>
  );
}
