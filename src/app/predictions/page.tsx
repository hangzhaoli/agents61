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
import JsonLd from '@/components/seo/JsonLd';

export const revalidate = 300;

const FAQS = [
  {
    question: 'What is a Probability Gap?',
    answer:
      'Probability Gap = Agents61 Estimated Probability − Market Implied Probability (Polymarket YES%). A positive gap means Agents61 estimates YES higher than the crowd mid; negative means lower. It is probability disagreement — not a guaranteed return.',
  },
  {
    question: 'Is Agents61 a Polymarket trading bot?',
    answer:
      'No. Polymarket is the exchange. Agents61 is a prediction-market research desk: multi-agent odds analysis, Strategy Reports, resolution checks, and watchlists. No wallet and no Buy YES/NO.',
  },
  {
    question: 'How do I analyze a Polymarket market?',
    answer:
      'Paste a Polymarket event or market URL on this page, or open the Market Scanner. Click Analyze to run the prediction committee. Free accounts get one analyze; paid desks unlock news layer and Pro Prediction Clerk.',
  },
  {
    question: 'Do you support Kalshi?',
    answer:
      'The provider layer is multi-venue. Polymarket is live first. Kalshi integration follows after Polymarket validation.',
  },
] as const;

export const metadata = pageMeta({
  title: 'Prediction Markets — Polymarket odds vs Agents61 probability research',
  description:
    'Polymarket research tool: compare crowd YES% with Agents61 multi-agent probability. Hunt probability gaps, read Strategy Reports — research simulation, not betting.',
  path: '/predictions',
  keywords: [
    'Polymarket research',
    'Polymarket research tool',
    'prediction market research',
    'prediction market probability',
    'probability gap analysis',
    'AI prediction market analysis',
    'mispriced prediction markets',
    'Polymarket odds vs AI',
  ],
});

export default async function PredictionsDashboardPage() {
  const { markets, live } = await listMarkets({ provider: 'polymarket' });
  const gapRows = buildGapRows(markets, { seed: true, seedCount: 8 });

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQS.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Agents61 Prediction Markets',
          url: 'https://agents61.com/predictions',
          applicationCategory: 'FinanceApplication',
          description:
            'AI prediction market research: Polymarket odds vs Agents61 multi-agent probability gaps.',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
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
            Polymarket research for investors who want prediction market probability analysis without a
            wallet. Compare crowd YES% with Agents61 multi-agent estimates — Probability Gaps and
            Strategy Reports, not betting tickets.
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
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-bold text-[#0052d9]">
              <Link href="/predictions/scanner" className="hover:underline">
                Open scanner →
              </Link>
              <Link href="/use-cases/hunt-probability-gaps" className="hover:underline">
                Use case
              </Link>
              <Link href="/compare/polymarket" className="hover:underline">
                vs Polymarket
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <TopGapsTable rows={gapRows} />
        </div>

        <PredictionHistoryPanel />

        <section className="mt-10 card p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Prediction market research guides</h2>
          <p className="text-sm text-slate-600 mb-5">
            Same SEO architecture that already ranks for masters and compare hubs — applied to
            Polymarket odds research.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <li>
              <Link href="/prediction-market-research" className="font-semibold text-[#0052d9] hover:underline">
                Prediction market research hub
              </Link>
            </li>
            <li>
              <Link href="/learn/probability-gap-research" className="font-semibold text-[#0052d9] hover:underline">
                Learn: research a probability gap
              </Link>
            </li>
            <li>
              <Link href="/blog/polymarket-odds-vs-ai-research" className="font-semibold text-[#0052d9] hover:underline">
                Blog: Polymarket odds vs AI research
              </Link>
            </li>
            <li>
              <Link href="/compare/polymarket" className="font-semibold text-[#0052d9] hover:underline">
                Agents61 vs Polymarket
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900 mb-4">FAQ</h2>
          <dl className="space-y-5">
            {FAQS.map((f) => (
              <div key={f.question}>
                <dt className="text-sm font-bold text-slate-900">{f.question}</dt>
                <dd className="mt-1.5 text-sm text-slate-600 leading-relaxed">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

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
