import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import {
  ArrowRight,
  TrendingUp,
  Globe,
  Search,
  Scale,
  Crosshair,
  LogOut,
  ShieldCheck,
  Users,
  Zap,
  Lock,
  CheckCircle,
  Star,
  Bitcoin,
} from 'lucide-react';
import { GROUP_META, GROUP_ORDER, getMastersByGroup } from '@/lib/masters';
import { CRYPTO_ASSETS } from '@/lib/crypto-universe';
import { PIPELINE_STEPS, QUANT_LAYER } from '@/lib/pipeline';
import { POSITIONING } from '@/lib/positioning';
import MasterAvatar from '@/components/masters/MasterAvatar';
import { MasterSeatLine } from '@/components/masters/MasterChip';
import PersonaTrustSection from '@/components/landing/PersonaTrustSection';
import KernelUpgradeSection from '@/components/landing/KernelUpgradeSection';
import ResearchMethodSection from '@/components/landing/ResearchMethodSection';
import DeskIntelligence from '@/components/landing/DeskIntelligence';
import ReportDemo from '@/components/landing/ReportDemo';
import PainSection from '@/components/landing/PainSection';
import WhyUsSection from '@/components/landing/WhyUsSection';
import HeroBanner from '@/components/landing/HeroBanner';
import AuthGateLink from '@/components/auth/AuthGateLink';
import MarketTape from '@/components/landing/MarketTape';
import DeskPulse from '@/components/landing/DeskPulse';
import HallOfLegends from '@/components/landing/HallOfLegends';
import WorkKitsStrip from '@/components/landing/WorkKitsStrip';
import MiniSpark from '@/components/landing/MiniSpark';
import PrivateDeskHooks from '@/components/landing/PrivateDeskHooks';
import PredictionMarketsTeaser from '@/components/landing/PredictionMarketsTeaser';
import { getLivePulse } from '@/lib/landing-pulse';
import NewcomerGuide from '@/components/landing/NewcomerGuide';

/** Hourly refresh so homepage tape shows new listings / cached prices. */
export const revalidate = 3600;

const STEP_ICONS = [TrendingUp, Globe, Search, Scale, Crosshair, LogOut];

export default async function HomePage() {
  const { tape, cells } = await getLivePulse();

  return (
    <>
      <Navbar />
      <MarketTape items={tape} />

      {/* ============ HERO ============ */}
      <section className="hero-glow relative overflow-hidden">
        <div className="section-container relative z-10 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
          <div className="animate-fade-in-up">
            <div className="badge badge-primary mb-6 mx-auto">
              <Users className="h-3.5 w-3.5" fill="currentColor" />
              61 legends — investment rock stars, on staff
            </div>
          </div>

          <h1 className="animate-fade-in-up stagger-1 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] max-w-4xl mx-auto">
            61 masters help you research
            <br />
            <span className="text-gradient">and make better investment decisions</span>
          </h1>

          <p className="animate-fade-in-up stagger-2 mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            They are your committee, not a copilot that agrees with you. Each seat writes alone;
            a clerk stacks the split. The most expensive thing you still own is a thesis nobody inverted.
          </p>

          <div className="animate-fade-in-up stagger-3 mt-10 text-left">
            <HeroBanner />
            <div className="max-w-5xl mx-auto mt-3">
              <DeskPulse cells={cells} />
              <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                Cached board tape · hourly refresh · not live quotes · not a rating · not advice · SPCX listed Jun 2026
              </p>
            </div>
          </div>

          <p className="animate-fade-in-up stagger-4 mt-5 text-sm text-slate-500">
            Type a ticker to convene.{' '}
            <Link href="#demo" className="font-semibold text-[#0052d9] hover:underline">
              Or watch a canned Observer thread →
            </Link>
          </p>

          <div className="animate-fade-in-up stagger-4 mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" fill="currentColor" />
              US stocks first
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" fill="currentColor" />
              US ETFs
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" fill="currentColor" />
              Crypto / on-chain
            </span>
            <Link
              href="#prediction-markets"
              className="flex items-center gap-1.5 text-[#0052d9] font-semibold hover:underline"
            >
              <CheckCircle className="h-4 w-4 text-emerald-500" fill="currentColor" />
              Polymarket odds
            </Link>
            <span className="flex items-center gap-1.5 text-slate-400">
              A-shares later
            </span>
          </div>
        </div>
      </section>

      <NewcomerGuide />

      <PainSection />

      <section className="py-16 md:py-24 bg-slate-50/70">
        <div className="section-container">
          <ReportDemo />
        </div>
      </section>

      <WhyUsSection />

      <PrivateDeskHooks />

      <PredictionMarketsTeaser />

      {/* ============ BLOCKCHAIN ============ */}
      <section id="blockchain" className="py-16 md:py-24 border-y border-slate-100">
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <div className="badge badge-primary mb-4">
                <Bitcoin className="h-3.5 w-3.5" strokeWidth={2} />
                Blockchain analysis
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                On-chain names, same isolated desk
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                BTC, ETH, and SOL sit on the research board — settlement, usage, and policy, not a
                cash-flow multiple unless a business sits underneath. A paper perpetual strategy
                shows its backtest and trade tape on the same desk. No buy button.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/research/crypto" className="btn-primary text-sm">
                Crypto research
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
              <AuthGateLink
                href="/dashboard?entry=crypto"
                guestHref="/register?next=%2Fdashboard%3Fentry%3Dcrypto"
                className="btn-secondary text-sm"
              >
                Open blockchain desk
              </AuthGateLink>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-900">
            {CRYPTO_ASSETS.filter((a) => ['BTC', 'ETH', 'SOL'].includes(a.symbol)).map((a, i) => (
              <Link
                key={a.symbol}
                href={`/crypto/${a.symbol.toLowerCase()}`}
                className={`p-5 bg-white hover:bg-slate-50 transition-colors ${i < 2 ? 'md:border-r border-b md:border-b-0 border-slate-200' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-bold tracking-widest text-[#0052d9] uppercase">
                      {a.category === 'l1' ? 'Layer 1' : a.category}
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                      {a.symbol}
                      <span className="ml-2 text-sm font-semibold text-slate-500">{a.name}</span>
                    </h3>
                  </div>
                  <MiniSpark seed={a.symbol} tone={a.symbol === 'BTC' ? 'up' : a.symbol === 'SOL' ? 'down' : 'flat'} />
                </div>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{a.thesis}</p>
                <p className="mt-2 text-xs text-slate-400">{a.risks}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#0052d9]">
                  Isolated briefs
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ NICHE ============ */}
      <section className="border-b border-slate-900 bg-slate-50">
        <div className="section-container grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <div className="py-8 md:pr-8">
            <div className="text-[10px] font-bold tracking-[0.18em] text-[#0052d9] uppercase mb-2">Who</div>
            <p className="text-sm text-slate-800 leading-relaxed">{POSITIONING.segment}</p>
          </div>
          <div className="py-8 md:px-8">
            <div className="text-[10px] font-bold tracking-[0.18em] text-red-600 uppercase mb-2">Not for</div>
            <ul className="text-sm text-slate-700 space-y-1.5">
              {POSITIONING.notFor.map((n) => (
                <li key={n} className="pl-3 border-l-2 border-red-200">{n}</li>
              ))}
            </ul>
          </div>
          <div className="py-8 md:pl-8">
            <div className="text-[10px] font-bold tracking-[0.18em] text-[#0052d9] uppercase mb-2">Blank we occupy</div>
            <p className="text-sm text-slate-800 leading-relaxed">{POSITIONING.pain}</p>
          </div>
        </div>
      </section>
      <section className="border-y border-slate-900 bg-[#0f172a] py-4">
        <div className="section-container">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-slate-200">
            <span className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-300" fill="currentColor" />
              61 Legends
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-300" fill="currentColor" />
              6-Step Pipeline
            </span>
            <span className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-amber-300" fill="currentColor" />
              Red Team Debate
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-300" fill="currentColor" />
              Quant Risk Control
            </span>
          </div>
        </div>
      </section>

      <PersonaTrustSection />
      <KernelUpgradeSection />
      <ResearchMethodSection />

      {/* ============ SIX-STEP PIPELINE ============ */}
      <section id="pipeline" className="py-20 md:py-28">
        <div className="section-container">
          <div className="text-center mb-16">
            <div className="badge badge-primary mb-4 mx-auto">The Pipeline</div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Six Steps. One Committee Report.
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              {POSITIONING.wedge}
            </p>
          </div>

          <div className="space-y-6">
            {PIPELINE_STEPS.map((step, i) => {
              const Icon = STEP_ICONS[i];
              const groupMasters = step.groups.flatMap((g) => getMastersByGroup(g));

              return (
                <div key={step.step} className="card p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="flex items-center gap-4 lg:w-64 flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0052d9]/10 text-[#0052d9]">
                        <Icon className="h-6 w-6" strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Step {step.step}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{step.label}</h3>
                        <span className="text-sm text-slate-500">{step.count} agents</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800 mb-1">{step.question}</p>
                      <p className="text-sm text-slate-600 mb-4">{step.outputDetail}</p>
                      <div className="flex flex-wrap gap-2">
                        {groupMasters.slice(0, 10).map((m) => (
                          <Link
                            key={m.slug}
                            href={`/masters/${m.slug}`}
                            className="inline-flex items-center gap-1.5 pr-3 pl-1 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-[#0052d9]/10 hover:text-[#0052d9] transition-colors"
                          >
                            <MasterAvatar master={m} size="xxs" />
                            {m.nameEn}
                          </Link>
                        ))}
                        {groupMasters.length > 10 && (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium text-slate-400">
                            +{groupMasters.length - 10} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="lg:w-52 flex-shrink-0">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Output
                      </div>
                      <div className="text-sm font-medium text-slate-700">{step.output}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quant layer banner */}
          <div className="mt-8 card p-6 md:p-8 border-[#0d9488]/20 bg-gradient-to-r from-teal-50/50 to-cyan-50/50">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(17rem,1.15fr)_minmax(12rem,1fr)] gap-6 items-start">
              <div className="flex items-start gap-4 min-w-0">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#0d9488]/10 text-[#0d9488]">
                  <ShieldCheck className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {QUANT_LAYER.label}
                  </h3>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">Always On</p>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {QUANT_LAYER.question}. {QUANT_LAYER.output}. Seven seats, always on — the committee cannot fool itself.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 content-start min-w-0">
                {getMastersByGroup('quant').map((m) => (
                  <Link
                    key={m.slug}
                    href={`/masters/${m.slug}`}
                    className="inline-flex items-center gap-1.5 pr-3 pl-1 py-1 rounded-full text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:border-[#0d9488]/30 hover:text-[#0d9488] transition-colors"
                  >
                    <MasterAvatar master={m} size="xxs" />
                    {m.nameEn}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/pipeline" className="text-sm font-semibold text-[#0052d9] hover:underline">
              Open the pipeline page →
            </Link>
          </div>
        </div>
      </section>

      <MarketTape />
      <DeskIntelligence />

      <WorkKitsStrip />

      <HallOfLegends />

      {/* ============ DEBATE THEATER TEASER ============ */}
      <section className="py-20 md:py-28 bg-slate-900 text-white">
        <div className="section-container text-center">
          <div className="badge bg-red-500/20 text-red-400 mb-6 mx-auto">
            <Scale className="h-3.5 w-3.5" fill="currentColor" />
            The Soul of the Product
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Red Team vs. Blue Team
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12">
            Isolated briefs first. Then the red team tries to kill the idea. Then inversion.
            Then the ten-year hold. This is not a chatbot — it&apos;s a committee at war with itself.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-left">
              <div className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-4">
                Red Team — Short Side
              </div>
              <div className="space-y-3">
                {(
                  [
                    { slug: 'david-einhorn', caption: 'Earnings quality' },
                    { slug: 'michael-burry', caption: 'Hidden assumptions' },
                    { slug: 'carl-icahn', caption: 'Governance' },
                    { slug: 'dan-loeb', caption: 'Narrative check' },
                    { slug: 'paul-singer', caption: 'Tail risk' },
                  ] as const
                ).map((row) => (
                  <MasterSeatLine key={row.slug} slug={row.slug} caption={row.caption} tone="dark" />
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-left">
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-4">
                Pressure Test
              </div>
              <div className="space-y-3">
                {(
                  [
                    { slug: 'michael-steinhardt', caption: 'Consensus divergence' },
                    { slug: 'stanley-druckenmiller', caption: 'Conviction sizing' },
                    { slug: 'charlie-munger', caption: 'Inversion thinking' },
                  ] as const
                ).map((row) => (
                  <MasterSeatLine key={row.slug} slug={row.slug} caption={row.caption} tone="dark" />
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-left">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-4">
                Final Verdict
              </div>
              <div className="space-y-3">
                <MasterSeatLine slug="warren-buffett" caption="10-year hold test" tone="dark" />
                <MasterSeatLine caption="Clerk publishes the split — not a score" tone="dark" />
                <MasterSeatLine slug="ed-thorp" caption="Position sizing (Kelly)" tone="dark" />
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Link href="#demo" className="btn-primary text-base px-8 py-3.5">
              Watch the committee generate a report
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ COMPLIANCE ============ */}
      <section className="py-16 border-t border-slate-100">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
              <h3 className="text-lg font-semibold text-slate-900">Compliance First</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Agents61 is a research simulation and educational publication. All reports are
              AI-generated and do not constitute investment advice. Isolated briefs never say
              “you should buy.” There is no buy button, no order routing, and no personalized
              recommendation. Our content is general, impersonal, and published as a standing
              research product — that is our own publisher positioning under the Investment
              Advisers Act of 1940. It does not rewrite a payments company’s rules.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link href="/disclaimer" className="text-xs text-slate-400 hover:text-[#0052d9] transition-colors underline">
                Full Disclaimer
              </Link>
              <Link href="/ai-disclosure" className="text-xs text-slate-400 hover:text-[#0052d9] transition-colors underline">
                AI Disclosure
              </Link>
              <Link href="/privacy" className="text-xs text-slate-400 hover:text-[#0052d9] transition-colors underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-slate-400 hover:text-[#0052d9] transition-colors underline">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-[#0052d9] to-[#003da6] text-white">
        <div className="section-container text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
            Staff the committee
            <br />
            before you staff the trade.
          </h2>
          <p className="text-lg text-blue-100 max-w-xl mx-auto mb-10">
            Your next position will either compound — or become an expensive lesson. 61 isolated
            minds, then a clerk who will not average a fake buy. That is a real investment: in the
            work, before the capital.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <AuthGateLink
              href="/#demo"
              guestHref="/register"
              className="inline-flex items-center gap-2 bg-white text-[#0052d9] font-semibold px-8 py-4 rounded-xl text-base hover:bg-blue-50 transition-colors shadow-lg"
            >
              Replay the sample
              <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
            </AuthGateLink>
            <AuthGateLink
              href="/dashboard"
              guestHref="/register"
              className="inline-flex items-center gap-2 border border-white/40 text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-white/10 transition-colors"
            >
              Enter Desk
            </AuthGateLink>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
