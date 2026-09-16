import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { pageMeta } from '@/lib/seo/meta';
import { listPredictionMarkets } from '@/lib/prediction/polymarket';
import { seedTemplateReport } from '@/lib/prediction/analyze';
import { listCachedReports } from '@/lib/prediction/cache';
import { formatGap, gapOf } from '@/lib/prediction/types';
import AuthGateLink from '@/components/auth/AuthGateLink';

export const revalidate = 300;

export const metadata = pageMeta({
  title: 'Prediction Markets — Polymarket odds vs Agents61',
  description:
    'Markets price the future. Agents61 researches the odds. Compare Polymarket YES probability with multi-agent research — probability gaps, not betting tickets.',
  path: '/prediction-markets',
  keywords: [
    'Polymarket research',
    'prediction market probability',
    'AI probability research',
    'Agents61 prediction markets',
  ],
});

export default async function PredictionMarketsPage() {
  const { markets, live } = await listPredictionMarkets();

  // Seed template analyses so Top Gaps has content on first visit
  if (listCachedReports().length < 3) {
    for (const m of markets.slice(0, 6)) seedTemplateReport(m);
  }

  const cached = listCachedReports();
  const byId = new Map(cached.map((r) => [r.marketId, r]));

  const rows = markets.map((m) => {
    const report = byId.get(m.id);
    const agents61 = report?.agents61Probability ?? null;
    const gap = agents61 != null ? gapOf(agents61, m.marketProbability) : null;
    return { market: m, agents61, gap, confidence: report?.confidence ?? null };
  });

  const topGaps = [...rows]
    .filter((r) => r.gap != null)
    .sort((a, b) => Math.abs(b.gap!) - Math.abs(a.gap!))
    .slice(0, 8);

  return (
    <>
      <Navbar />
      <div className="section-container py-12 md:py-16">
        <header className="max-w-3xl mb-10">
          <div className="badge badge-primary mb-4">Prediction Markets · Polymarket</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Markets price the future.
            <span className="text-gradient"> Agents61 researches the odds.</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Compare Polymarket YES probability with Agents61 multi-agent research. The product is the
            Probability Gap — research simulation, not a trading desk. No wallet. No buy YES/NO.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Feed: {live ? 'live Polymarket Gamma' : 'curated fallback (Polymarket unreachable from this region/host)'}
          </p>
          <div className="mt-6">
            <a href="#gaps" className="btn-primary">
              Find Mispriced Markets
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </a>
          </div>
        </header>

        <section id="gaps" className="card p-6 md:p-8 mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Top Probability Gaps</h2>
          <p className="text-sm text-slate-600 mb-5">
            Largest |Agents61 − Market| among researched markets. Click through to run a deeper Analyze.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-200">
                  <th className="py-2 pr-3 font-bold">Market</th>
                  <th className="py-2 pr-3 font-bold">Market</th>
                  <th className="py-2 pr-3 font-bold">Agents61</th>
                  <th className="py-2 font-bold">Gap</th>
                </tr>
              </thead>
              <tbody>
                {topGaps.map((row) => (
                  <tr key={row.market.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="py-3 pr-3">
                      <Link
                        href={`/prediction-markets/${encodeURIComponent(row.market.id)}`}
                        className="font-semibold text-slate-900 hover:text-[#0052d9]"
                      >
                        {row.market.question}
                      </Link>
                    </td>
                    <td className="py-3 pr-3 tabular-nums text-slate-700">{row.market.marketProbability}%</td>
                    <td className="py-3 pr-3 tabular-nums text-slate-700">{row.agents61}%</td>
                    <td className="py-3 tabular-nums font-semibold text-[#0052d9]">{formatGap(row.gap!)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Hot markets</h2>
          <div className="overflow-x-auto border border-slate-900">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="p-3 font-bold">Question</th>
                  <th className="p-3 font-bold">YES</th>
                  <th className="p-3 font-bold">Volume</th>
                  <th className="p-3 font-bold">Closes</th>
                  <th className="p-3 font-bold">Agents61</th>
                  <th className="p-3 font-bold">Gap</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ market: m, agents61, gap }) => (
                  <tr key={m.id} className="border-t border-slate-200 hover:bg-slate-50/60">
                    <td className="p-3">
                      <Link
                        href={`/prediction-markets/${encodeURIComponent(m.id)}`}
                        className="font-semibold text-slate-900 hover:text-[#0052d9]"
                      >
                        {m.question}
                      </Link>
                    </td>
                    <td className="p-3 tabular-nums">{m.marketProbability}%</td>
                    <td className="p-3 tabular-nums text-slate-600">{m.volumeLabel}</td>
                    <td className="p-3 text-slate-600">{m.endDateLabel}</td>
                    <td className="p-3 tabular-nums">{agents61 != null ? `${agents61}%` : '—'}</td>
                    <td className="p-3 tabular-nums font-medium text-[#0052d9]">
                      {gap != null ? formatGap(gap) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12 rounded-2xl bg-[#0052d9] text-white p-8 md:p-10">
          <h2 className="text-2xl font-extrabold mb-3">Research the odds on your desk</h2>
          <p className="text-blue-100 max-w-2xl mb-6">
            Open a market, run Analyze with Agents61, read the Strategy Report. Register to keep using
            the full equity desk alongside prediction research.
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
      </div>
      <Footer />
    </>
  );
}
