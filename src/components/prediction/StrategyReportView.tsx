import Link from 'next/link';
import type { StrategyReport } from '@/lib/prediction/types';
import { formatConfidencePlain, formatGap, gapPlain } from '@/lib/prediction/types';

function List({ items, tone }: { items: string[]; tone?: 'emerald' | 'red' | 'slate' }) {
  const border =
    tone === 'emerald' ? 'border-emerald-200' : tone === 'red' ? 'border-red-200' : 'border-slate-200';
  return (
    <ul className="space-y-2">
      {items.map((line) => (
        <li key={line} className={`text-sm text-slate-700 leading-relaxed pl-3 border-l-2 ${border}`}>
          {line}
        </li>
      ))}
    </ul>
  );
}

export default function StrategyReportView({ report }: { report: StrategyReport }) {
  const whyWrong = report.whyMarketMayBeWrong?.length ? report.whyMarketMayBeWrong : report.whyDisagree;
  const whyRight = report.whyMarketMayBeRight?.length ? report.whyMarketMayBeRight : report.bearEvidence;
  const invalidation = report.invalidationConditions?.length
    ? report.invalidationConditions
    : report.whatCouldMakeUsWrong;
  const risks = report.risks;
  const scenarios = report.scenarios;
  const resolution = report.resolutionCheck;

  const conf = formatConfidencePlain(report.confidence);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(
          [
            ['市场胜算', `${report.marketProbability}%`, 'Polymarket 认为 YES'],
            ['我们的胜算', `${report.agents61Probability}%`, 'Agents61 认为 YES'],
            ['差了多少', formatGap(report.probabilityGap), gapPlain(report.probabilityGap)],
            ['确信度', conf.short, conf.detail],
          ] as const
        ).map(([k, v, hint]) => (
          <div key={k} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
            <div className="text-[10px] font-bold tracking-wide text-slate-400">{k}</div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">{v}</div>
            <p className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-2">{hint}</p>
          </div>
        ))}
      </section>

      <p className="text-sm text-slate-600">
        胜算合理区间{' '}
        <strong>
          {report.probabilityRange[0]}%–{report.probabilityRange[1]}%
        </strong>
        {' · '}
        结算规则风险 <strong>{report.resolutionRisk === 'High' ? '偏高' : report.resolutionRisk === 'Low' ? '偏低' : '中等'}</strong>
        {' · '}
        引擎 <strong>{report.engine === 'deepseek' ? 'Clerk 精炼' : '模板草稿'}</strong>
      </p>

      {report.executiveSummary && (
        <section className="card p-5 md:p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Executive summary</h3>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{report.executiveSummary}</p>
        </section>
      )}

      {report.newsBullets && report.newsBullets.length > 0 && (
        <section className="card p-5 md:p-6 border-cyan-100 bg-cyan-50/40">
          <h3 className="text-sm font-bold text-slate-900 mb-3">News layer (unverified)</h3>
          <List items={report.newsBullets} />
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="card p-5">
          <h3 className="text-sm font-bold text-amber-900 mb-3">Why the market may be wrong</h3>
          <List items={whyWrong} tone="red" />
        </section>
        <section className="card p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Why the market may be right</h3>
          <List items={whyRight} tone="emerald" />
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="card p-5">
          <h3 className="text-sm font-bold text-emerald-800 mb-3">Bull / YES evidence</h3>
          <List items={report.bullEvidence} tone="emerald" />
        </section>
        <section className="card p-5">
          <h3 className="text-sm font-bold text-red-800 mb-3">Bear / NO evidence</h3>
          <List items={report.bearEvidence} tone="red" />
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
        <h3 className="text-sm font-bold text-slate-900 mb-3">Invalidation conditions</h3>
        <List items={invalidation} />
      </section>

      {scenarios && (
        <section className="card p-5 md:p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Scenario analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(
              [
                ['YES', scenarios.yes, 'emerald'],
                ['Base', scenarios.base, 'slate'],
                ['NO', scenarios.no, 'red'],
              ] as const
            ).map(([label, branch, tone]) => (
              <div
                key={label}
                className={`rounded-xl border p-4 ${
                  tone === 'emerald'
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : tone === 'red'
                      ? 'border-red-200 bg-red-50/40'
                      : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
                <div className="text-2xl font-extrabold tabular-nums mt-1">{branch.probability}%</div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{branch.reason}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {risks && (
        <section className="card p-5 md:p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Risk assessment</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
            {(
              [
                ['Resolution', risks.resolution],
                ['Liquidity', risks.liquidity],
                ['Information', risks.information],
                ['Event', risks.event],
                ['Overall', risks.overall],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="rounded-lg border border-slate-200 px-2 py-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{k}</div>
                <div className="text-sm font-bold text-slate-900 mt-1">{v}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {resolution && (
        <section className="card p-5 md:p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Resolution check</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Source</dt>
              <dd className="text-slate-800 mt-0.5">{resolution.source}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Deadline</dt>
              <dd className="text-slate-800 mt-0.5">{resolution.deadline}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ambiguity</dt>
              <dd className="text-slate-800 mt-0.5">{resolution.ambiguity}</dd>
            </div>
          </dl>
          <p className="text-sm text-slate-700 mt-3 leading-relaxed">{resolution.summary}</p>
          {resolution.edgeCases?.length > 0 && (
            <ul className="mt-3 space-y-1">
              {resolution.edgeCases.map((e) => (
                <li key={e} className="text-xs text-slate-600">
                  · {e}
                </li>
              ))}
            </ul>
          )}
          {resolution.ambiguity === 'High' && (
            <p className="mt-4 text-sm font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              This market contains potentially ambiguous settlement conditions. Probability analysis
              may not fully reflect settlement risk.
            </p>
          )}
        </section>
      )}

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
