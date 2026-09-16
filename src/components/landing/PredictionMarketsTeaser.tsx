import Link from 'next/link';
import { ArrowRight, Crosshair, Radar, Sparkles, Target } from 'lucide-react';
import { listPredictionMarkets } from '@/lib/prediction/polymarket';
import { seedTemplateReport } from '@/lib/prediction/analyze';
import { listCachedReports } from '@/lib/prediction/cache';
import { gapOf } from '@/lib/prediction/types';
import PredictionGapArena, { type GapTeaserRow } from '@/components/landing/PredictionGapArena';

const HOOKS = [
  {
    Icon: Radar,
    title: 'Crowd odds vs research probability',
    body: 'Polymarket prices YES. Agents61 runs a multi-agent odds desk. The product is the gap — not a bet ticket.',
  },
  {
    Icon: Target,
    title: 'Hunt mispriced prediction markets',
    body: 'Scan Fed, crypto, geopolitics, and tech event markets. Spot where implied probability diverges from the brief.',
  },
  {
    Icon: Crosshair,
    title: 'Strategy report, zero wallet',
    body: 'Bull / bear evidence, catalysts, resolution risk. Research simulation only — no buy YES/NO, no order routing.',
  },
] as const;

export default async function PredictionMarketsTeaser() {
  const { markets, live } = await listPredictionMarkets();

  if (listCachedReports().length < 3) {
    for (const m of markets.slice(0, 8)) seedTemplateReport(m);
  }

  const cached = listCachedReports();
  const byId = new Map(cached.map((r) => [r.marketId, r]));

  const gapRows: GapTeaserRow[] = markets
    .map((m) => {
      const report = byId.get(m.id);
      if (!report) return null;
      const gap = gapOf(report.agents61Probability, m.marketProbability);
      return {
        id: m.id,
        question: m.question,
        marketProbability: m.marketProbability,
        agents61Probability: report.agents61Probability,
        gap,
        volumeLabel: m.volumeLabel,
        category: m.category,
      };
    })
    .filter((r): r is GapTeaserRow => r != null)
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))
    .slice(0, 6);

  const ticker = markets.slice(0, 12);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Agents61 Prediction Markets',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: 'https://agents61.com/predictions',
    description:
      'Compare Polymarket YES probability with Agents61 multi-agent prediction market research. Probability gap analysis — not betting or trading.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    keywords:
      'Polymarket research, prediction market probability, AI odds analysis, probability gap, mispriced prediction markets',
  };

  return (
    <section
      id="prediction-markets"
      className="pm-teaser-section"
      aria-labelledby="pm-teaser-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pm-teaser-aurora" aria-hidden />
      <div className="pm-teaser-grid" aria-hidden />

      <div className="section-container relative z-10 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10">
          <div className="max-w-2xl">
            <div className="pm-teaser-kicker mb-4">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
              Prediction Markets · Polymarket odds desk
              {live ? (
                <span className="pm-teaser-live-pill">
                  <span className="pm-live-dot" />
                  Live Gamma
                </span>
              ) : (
                <span className="pm-teaser-live-pill pm-teaser-live-pill-muted">Curated feed</span>
              )}
            </div>
            <h2
              id="pm-teaser-heading"
              className="text-3xl md:text-5xl font-extrabold text-white leading-[1.08] tracking-tight"
            >
              Markets price the future.
              <span className="pm-teaser-accent"> Agents61 hunts the gap.</span>
            </h2>
            <p className="mt-5 text-lg text-slate-300 leading-relaxed">
              Polymarket odds research without a wallet. Multi-agent AI prediction market analysis
              stacks news, base rates, and red-team notes into a research probability — then
              surfaces the probability gap vs crowd YES%. Research simulation, not a betting desk.
            </p>
            <p className="mt-3 text-sm text-cyan-300/90 font-semibold">
              Built for Polymarket research, mispriced prediction markets, and AI odds vs crowd
              probability — Fed, crypto, geopolitics, and tech event markets.
            </p>
            <p className="mt-3 text-xs text-slate-400">
              SEO paths:{' '}
              <Link href="/compare/polymarket" className="text-cyan-300/90 hover:underline">
                vs Polymarket
              </Link>
              {' · '}
              <Link href="/prediction-market-research" className="text-cyan-300/90 hover:underline">
                research hub
              </Link>
              {' · '}
              <Link href="/learn/probability-gap-research" className="text-cyan-300/90 hover:underline">
                learn gaps
              </Link>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/predictions" className="pm-teaser-cta">
              Find mispriced markets
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
            <Link href="/predictions#gaps" className="pm-teaser-ghost">
              Top probability gaps
            </Link>
          </div>
        </div>

        {ticker.length > 0 && (
          <div className="pm-ticker mb-10" aria-label="Hot Polymarket questions">
            <div className="pm-ticker-track">
              {[...ticker, ...ticker].map((m, i) => (
                <Link
                  key={`${m.id}-${i}`}
                  href={`/predictions/${encodeURIComponent(m.id)}`}
                  className="pm-ticker-chip"
                >
                  <span className="pm-ticker-prob tabular-nums">{m.marketProbability.toFixed(0)}%</span>
                  <span className="pm-ticker-q">{m.question}</span>
                  <span className="pm-ticker-vol">{m.volumeLabel}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 lg:gap-8 items-stretch mb-10">
          <PredictionGapArena rows={gapRows} />

          <div className="grid grid-cols-1 gap-0 border border-white/15 rounded-2xl overflow-hidden bg-white/[0.03]">
            {HOOKS.map((h, i) => (
              <div
                key={h.title}
                className={`p-5 md:p-6 ${i < HOOKS.length - 1 ? 'border-b border-white/10' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <span className="pm-hook-icon" aria-hidden>
                    <h.Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{h.title}</h3>
                    <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{h.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pm-seo-strip">
          <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
            <strong className="text-slate-200">Agents61 Prediction Markets</strong> is built for
            investors who want Polymarket probability research, prediction market due diligence, and
            AI multi-agent odds analysis — without trading YES/NO tokens. Compare crowd-implied
            probability to an isolated research stack. Educational research simulation only; not
            investment advice and not a wager.
          </p>
          <Link
            href="/predictions"
            className="text-sm font-bold text-cyan-300 hover:text-cyan-200 whitespace-nowrap"
          >
            Open prediction desk →
          </Link>
        </div>
      </div>
    </section>
  );
}
