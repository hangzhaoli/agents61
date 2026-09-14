import Link from 'next/link';
import { Lock } from 'lucide-react';
import MasterAvatar from '@/components/masters/MasterAvatar';
import { getMasterBySlug } from '@/lib/masters';
import type { Assembly, BriefStance, IndependentBrief } from '@/lib/research';
import { PLANS, nextPlan, type PlanId } from '@/lib/tiers';
import ReportDownloadButton from '@/components/report/ReportDownloadButton';
import ReportAnalytics from '@/components/report/ReportAnalytics';
import PackEvidenceBlock from '@/components/report/PackEvidenceBlock';
import SeatContrastPanel from '@/components/report/SeatContrastPanel';

const STANCE_STYLE: Record<BriefStance, string> = {
  constructive: 'bg-emerald-50 text-emerald-700',
  cautious: 'bg-amber-50 text-amber-800',
  skeptical: 'bg-red-50 text-red-700',
  inconclusive: 'bg-slate-100 text-slate-600',
};

export default function IsolatedResearch({
  plan,
  briefs,
  assembly,
  compact,
}: {
  plan: PlanId;
  briefs: IndependentBrief[];
  assembly: Assembly;
  compact: boolean;
}) {
  const nextId = nextPlan(plan);
  const next = nextId ? PLANS[nextId] : null;

  return (
    <div className="space-y-6 mb-8">
      <section id="isolated" className="card p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className="badge badge-primary">Isolated briefs</div>
          <span className="text-xs text-slate-400">
            {assembly.seatCount} seats · no peeking
          </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">
          Each master researches {assembly.ticker} alone
        </h2>
        <p className="text-sm text-slate-600 mb-6 max-w-3xl">
          Same file, different rules. Each brief states a view and why. Briefs are written in
          isolation so one loud narrative cannot drag the room. The clerk reads them only after
          they exist. Never “you should buy.” There is no buy button.
        </p>

        {compact ? (
          <div className="space-y-2">
            {briefs.map((b) => (
              <CompactBrief key={b.slug} brief={b} />
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {briefs.map((b) => (
              <FullBrief key={b.slug} brief={b} />
            ))}
          </div>
        )}
      </section>

      {briefs.length >= 2 && (
        <section className="card p-5 md:p-6">
          <SeatContrastPanel briefs={briefs} />
        </section>
      )}

      <ReportAnalytics assembly={assembly} />

      <section id="assembly" className="card p-6 md:p-8 border-[#0052d9]/20">
        <div className="badge badge-primary mb-2">Clerk assembly</div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Then the briefs are stacked — not averaged</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {(Object.keys(assembly.counts) as BriefStance[]).map((k) => (
            <div key={k} className="rounded-xl bg-slate-50 px-3 py-3 text-center">
              <div className="text-xs text-slate-500 capitalize">{k}</div>
              <div className="text-xl font-extrabold text-slate-900">{assembly.counts[k]}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Where they agree</h3>
            <ul className="space-y-2">
              {assembly.agreements.map((line) => (
                <li key={line} className="text-sm text-slate-600 leading-relaxed">
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Where they split</h3>
            <ul className="space-y-2">
              {assembly.splits.map((line) => (
                <li key={line} className="text-sm text-slate-600 leading-relaxed">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-6 text-sm text-slate-500">{assembly.residual}</p>
        <p className="mt-2 text-xs text-slate-400">{assembly.clerkNote}</p>
        <div className="mt-4">
          <ReportDownloadButton
            plan={plan}
            question={assembly.question || `Research ${assembly.ticker}`}
            ticker={assembly.ticker}
            briefs={briefs}
            assembly={assembly}
          />
        </div>
        {next && (
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl bg-slate-50 p-4">
            <Lock className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <p className="text-sm text-slate-600 flex-1">
              {next.id === 'partners'
                ? `${next.name} keeps all 61 seats and raises volume: ${next.reports}, priority queue.`
                : `${next.name} unlocks ${next.seats} independent seats (${next.computeNote}).`}
            </p>
            <Link href="/pricing" className="btn-secondary text-sm justify-center">
              See {next.name}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function FullBrief({ brief }: { brief: IndependentBrief }) {
  const m = getMasterBySlug(brief.slug);
  return (
    <article className="rounded-2xl border border-slate-100 p-5 md:p-6">
      <div className="flex items-start gap-3 mb-3">
        {m && <MasterAvatar master={m} size="sm" />}
        <div className="min-w-0 flex-1">
          <div className="text-base font-bold text-slate-900">{brief.nameEn}</div>
          <div className="text-xs text-slate-400 leading-snug">{brief.role}</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">
            {brief.isolated === false ? 'Pipeline handoff' : 'Isolated'}
            {brief.engine && brief.engine !== 'template'
              ? ` · ${brief.engine === 'deepseek-v4-pro' ? 'DeepSeek V4-Pro' : 'DeepSeek V4-Flash'}`
              : ''}
          </div>
        </div>
        <span className={`inline-flex badge capitalize ${STANCE_STYLE[brief.stance]}`}>
          {brief.stance}
        </span>
      </div>
      <h3 className="text-sm font-bold text-slate-900 mb-1">View</h3>
      <p className="text-sm text-slate-800 leading-relaxed mb-3">{brief.thesis}</p>
      <h3 className="text-sm font-bold text-slate-900 mb-1">Why</h3>
      <p className="text-sm text-slate-700 leading-relaxed mb-3">{brief.why}</p>
      <h3 className="text-sm font-bold text-slate-900 mb-1">Analysis</h3>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">{brief.finding}</p>
      {brief.risks && (
        <>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Risks</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">{brief.risks}</p>
        </>
      )}
      <p className="text-xs font-medium text-slate-500 mb-1">Looks at</p>
      <p className="text-sm text-slate-700 mb-2">{brief.looksAt}</p>
      {brief.packEvidence && <PackEvidenceBlock evidence={brief.packEvidence} />}
      <p className="text-xs text-slate-400">{brief.sourceLine}</p>
      <p className="text-xs text-slate-500 mt-2">{brief.wouldChangeMind}</p>
    </article>
  );
}

function CompactBrief({ brief }: { brief: IndependentBrief }) {
  const m = getMasterBySlug(brief.slug);
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 px-3 py-2.5">
      {m && <MasterAvatar master={m} size="xs" />}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">{brief.nameEn}</span>
          <span className={`badge text-[10px] capitalize ${STANCE_STYLE[brief.stance]}`}>
            {brief.stance}
          </span>
        </div>
        <p className="text-xs text-slate-600 mt-0.5">{brief.thesis}</p>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-3">{brief.finding}</p>
      </div>
    </div>
  );
}
