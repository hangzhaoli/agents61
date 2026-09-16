import Link from 'next/link';
import type { StrategyReport } from '@/lib/prediction/types';
import { formatGap } from '@/lib/prediction/types';

export default function StrategyReportView({ report }: { report: StrategyReport }) {
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(
          [
            ['Market', `${report.marketProbability}%`],
            ['Agents61', `${report.agents61Probability}%`],
            ['Gap', formatGap(report.probabilityGap)],
            ['Confidence', report.confidence],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
            <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{k}</div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">{v}</div>
          </div>
        ))}
      </section>

      <p className="text-sm text-slate-600">
        Probability range <strong>{report.probabilityRange[0]}%–{report.probabilityRange[1]}%</strong>
        {' · '}
        Resolution risk <strong>{report.resolutionRisk}</strong>
        {' · '}
        Engine <strong>{report.engine}</strong>
      </p>

      <section className="card p-5 md:p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Why Agents61 disagrees</h3>
        <ol className="space-y-2 list-decimal pl-5">
          {report.whyDisagree.map((line) => (
            <li key={line} className="text-sm text-slate-700 leading-relaxed">
              {line}
            </li>
          ))}
        </ol>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="card p-5">
          <h3 className="text-sm font-bold text-emerald-800 mb-3">Bull / YES evidence</h3>
          <ul className="space-y-2">
            {report.bullEvidence.map((line) => (
              <li key={line} className="text-sm text-slate-700 leading-relaxed pl-3 border-l-2 border-emerald-200">
                {line}
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-5">
          <h3 className="text-sm font-bold text-red-800 mb-3">Bear / NO evidence</h3>
          <ul className="space-y-2">
            {report.bearEvidence.map((line) => (
              <li key={line} className="text-sm text-slate-700 leading-relaxed pl-3 border-l-2 border-red-200">
                {line}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card p-5 md:p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Key catalysts</h3>
        <ul className="space-y-2">
          {report.keyCatalysts.map((line) => (
            <li key={line} className="text-sm text-slate-700 leading-relaxed">
              · {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-5 md:p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3">What could make us wrong</h3>
        <ul className="space-y-2">
          {report.whatCouldMakeUsWrong.map((line) => (
            <li key={line} className="text-sm text-slate-700 leading-relaxed">
              · {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-5 md:p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Agent stack</h3>
        <div className="space-y-3">
          {report.agentNotes.map((a) => (
            <div key={a.id} className="rounded-xl border border-slate-100 px-3 py-2.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="text-sm font-bold text-slate-900">{a.name}</div>
                {a.impliedProbability != null && (
                  <div className="text-xs font-semibold text-[#0052d9] tabular-nums">
                    Implied ~{a.impliedProbability}%
                  </div>
                )}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">{a.role}</div>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{a.summary}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4">{report.clerkNote}</p>
      </section>

      <section className="card p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Sources</h3>
        <ul className="space-y-1.5">
          {report.sources.map((s) => (
            <li key={`${s.url}-${s.title}`}>
              <Link href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#0052d9] hover:underline">
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
