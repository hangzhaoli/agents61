import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthGateLink from '@/components/auth/AuthGateLink';
import MasterAvatar from '@/components/masters/MasterAvatar';
import PackEvidenceBlock from '@/components/report/PackEvidenceBlock';
import SeatContrastPanel from '@/components/report/SeatContrastPanel';
import { getMasterBySlug } from '@/lib/masters';
import { pageMeta } from '@/lib/seo/meta';
import { buildKernelDemoReport } from '@/lib/demo-kernel-report';
import type { BriefStance, IndependentBrief } from '@/lib/research';
import { ArrowRight } from 'lucide-react';

export const revalidate = 3600;

export const metadata = pageMeta({
  title: 'Kernel demo — full pipeline NVDA committee report',
  description:
    'Six-step Agents61 sample: trend through exit plus quant, method checks with numeric bars, agree/oppose tally, and clerk entry/hold/exit conditions. Research simulation — not advice.',
  path: '/demo',
  keywords: [
    'Agents61 demo',
    'AI investment committee sample report',
    'isolated stock research brief',
    'NVDA research simulation',
  ],
});

const STANCE_STYLE: Record<BriefStance, string> = {
  constructive: 'bg-emerald-50 text-emerald-700',
  cautious: 'bg-amber-50 text-amber-800',
  skeptical: 'bg-red-50 text-red-700',
  inconclusive: 'bg-slate-100 text-slate-600',
};

function BriefArticle({ brief }: { brief: IndependentBrief }) {
  const m = getMasterBySlug(brief.slug);
  return (
    <article className="rounded-2xl border border-slate-100 p-5 md:p-6 bg-white">
      <div className="flex items-start gap-3 mb-3">
        {m && <MasterAvatar master={m} size="sm" />}
        <div className="min-w-0 flex-1">
          <div className="text-base font-bold text-slate-900">{brief.nameEn}</div>
          <div className="text-xs text-slate-400 leading-snug">{brief.role}</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">Isolated article</div>
        </div>
        <span className={`inline-flex badge capitalize ${STANCE_STYLE[brief.stance]}`}>{brief.stance}</span>
      </div>
      <h3 className="text-sm font-bold text-slate-900 mb-1">Judgment</h3>
      <p className="text-sm text-slate-800 leading-relaxed mb-3">{brief.thesis}</p>
      <h3 className="text-sm font-bold text-slate-900 mb-1">Method + numbers</h3>
      <p className="text-sm text-slate-700 leading-relaxed mb-3">{brief.why}</p>
      <h3 className="text-sm font-bold text-slate-900 mb-1">Full analysis</h3>
      <div className="text-sm text-slate-600 leading-relaxed mb-3 whitespace-pre-line">{brief.finding}</div>
      {brief.risks && (
        <>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Risks</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">{brief.risks}</p>
        </>
      )}
      <p className="text-xs font-medium text-slate-500 mb-1">Looks at</p>
      <p className="text-sm text-slate-700 mb-2">{brief.looksAt}</p>
      {brief.packEvidence && <PackEvidenceBlock evidence={brief.packEvidence} />}
      <p className="text-xs text-slate-500 mt-2">{brief.wouldChangeMind}</p>
      <p className="text-xs text-slate-400 mt-1">{brief.sourceLine}</p>
    </article>
  );
}

export default async function KernelDemoPage() {
  const report = await buildKernelDemoReport();
  const { clerk } = report;

  return (
    <>
      <Navbar />
      <article className="section-container py-12 md:py-16">
        <header className="max-w-3xl mb-10">
          <div className="badge badge-primary mb-4">Product demo · six-step desk kernel</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Pipeline sample: {report.ticker}
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            {report.name}. Same structure as the homepage pipeline — Trend → Cycle → Selection →
            Debate → Timing → Exit, plus always-on Quant. Each seat writes an isolated article with
            numbers. Method checks show <em>why</em> a bar passed (the metric and the threshold).
            Then the clerk tallies agree/oppose and frames entry / hold / exit <em>conditions</em>.
            Research simulation — not advice — no buy button.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            FACTS:{' '}
            {report.liveFilings ? 'cached SEC/desk filings' : 'illustrative snapshot (filings thin)'} ·
            not a live quote
          </p>
        </header>

        <section className="card p-6 md:p-8 mb-8">
          <div className="badge badge-primary mb-2">Step 0 · Research prep</div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Shared FACTS before any persona speaks</h2>
          <p className="text-sm text-slate-600 mb-5">
            Fundamentals / tone / valuation for every seat. Not a committee score.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-900">
            {(
              [
                ['Fundamentals', report.prep.fundamentals.summary, report.prep.fundamentals.highlights],
                ['Tone (heuristic)', report.prep.sentiment.summary, report.prep.sentiment.highlights],
                ['Valuation (on file)', report.prep.valuation.summary, report.prep.valuation.highlights],
              ] as const
            ).map(([title, summary, highlights], i) => (
              <div
                key={title}
                className={`p-5 ${i < 2 ? 'md:border-r border-b md:border-b-0 border-slate-200' : ''}`}
              >
                <h3 className="text-sm font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">{summary}</p>
                <ul className="space-y-1.5">
                  {highlights.slice(0, 7).map((h) => (
                    <li key={h} className="text-sm text-slate-700 leading-snug pl-3 border-l-2 border-slate-200">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-10 mb-10">
          {report.steps.map((step, idx) => (
            <section key={step.key} className="card p-6 md:p-8">
              <div className="flex flex-wrap items-end justify-between gap-3 mb-2">
                <div>
                  <div className="badge badge-primary mb-2">
                    {step.key === 'quant' ? 'Always on' : `Step ${idx + 1}`} · {step.label}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{step.question}</h2>
                </div>
                <p className="text-xs text-slate-400">{step.briefs.length} isolated seat(s)</p>
              </div>
              <div className="mt-6 space-y-5">
                {step.briefs.map((b) => (
                  <BriefArticle key={b.slug} brief={b} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="card p-6 md:p-8 mb-6">
          <SeatContrastPanel briefs={report.briefs} />
        </section>

        <section className="card p-6 md:p-8 mb-6 border-[#0052d9]/25">
          <div className="badge badge-primary mb-2">Clerk · after isolation</div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Tally + underwrite synthesis</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {(
              [
                ['Constructive', clerk.agree, 'text-emerald-700'],
                ['Skeptical', clerk.oppose, 'text-red-700'],
                ['Cautious', clerk.cautious, 'text-amber-700'],
                ['Inconclusive', clerk.inconclusive, 'text-slate-600'],
              ] as const
            ).map(([label, n, color]) => (
              <div key={label} className="rounded-xl bg-slate-50 px-3 py-3 text-center">
                <div className="text-xs text-slate-500">{label}</div>
                <div className={`text-2xl font-extrabold tabular-nums ${color}`}>{n}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 mb-6">{clerk.tallyLine}</p>

          <h3 className="text-sm font-bold text-slate-900 mb-2">Clerk article</h3>
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-6">{clerk.article}</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Entry conditions (not a buy date)</h3>
              <ul className="space-y-2">
                {clerk.entryConditions.map((line) => (
                  <li key={line} className="text-sm text-slate-600 leading-relaxed pl-3 border-l-2 border-[#0052d9]/30">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Exit triggers</h3>
              <ul className="space-y-2">
                {clerk.exitTriggers.map((line) => (
                  <li key={line} className="text-sm text-slate-600 leading-relaxed pl-3 border-l-2 border-red-200">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-900 mb-2">Hold horizon (method-implied)</h3>
          <p className="text-sm text-slate-700 leading-relaxed mb-4">{clerk.holdHorizon}</p>

          <h3 className="text-sm font-bold text-slate-900 mb-2">Sizing</h3>
          <p className="text-sm text-slate-700 leading-relaxed mb-4">{clerk.sizingNote}</p>

          <p className="text-xs text-slate-400">{clerk.residual}</p>
          <p className="text-xs text-slate-400 mt-2">
            Agents61 is a research simulation. This clerk frames homework conditions after isolated
            seats — it does not place orders, promise returns, or say “you should buy.”
          </p>
        </section>

        <section className="mt-4 mb-12 rounded-2xl bg-[#0052d9] text-white p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
            Run the same pipeline on a name you care about
          </h2>
          <p className="text-blue-100 max-w-2xl mb-6 leading-relaxed">
            Register or sign in to staff your seating plan. Empty seats stay empty. Live desks use
            the same prep → pack checks → isolated articles → clerk tally pattern.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <AuthGateLink
              href="/dashboard"
              guestHref="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#0052d9] font-semibold px-6 py-3 rounded-xl hover:bg-blue-50"
            >
              Register and open the desk
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </AuthGateLink>
            <AuthGateLink
              href="/dashboard"
              guestHref="/login"
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10"
            >
              Sign in
            </AuthGateLink>
          </div>
        </section>
      </article>
      <Footer />
    </>
  );
}
