import {
  formatConfidencePlain,
  formatGap,
  gapPlain,
  type Confidence,
} from '@/lib/prediction/types';

export default function ProbabilityCompare({
  marketProbability,
  agents61Probability,
  gap,
  range,
  confidence,
}: {
  marketProbability: number;
  agents61Probability: number | null;
  gap: number | null;
  range?: [number, number] | null;
  confidence?: Confidence | null;
}) {
  const m = Math.max(0, Math.min(100, marketProbability));
  const a = agents61Probability != null ? Math.max(0, Math.min(100, agents61Probability)) : null;
  const conf = confidence ? formatConfidencePlain(confidence) : null;

  return (
    <section className="card p-5 md:p-6 space-y-5">
      <p className="text-xs text-slate-500 leading-relaxed">
        数字都是「YES 会成立」的胜算估计，不是「今天能赚多少」。确信度 = 我们对这个估计有多有把握。
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-2 py-3">
          <div className="text-[10px] font-bold tracking-wide text-slate-400">市场胜算</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Polymarket YES</div>
          <div className="text-2xl md:text-3xl font-extrabold text-slate-900 tabular-nums mt-1">{m}%</div>
        </div>
        <div className="rounded-xl border border-blue-50 bg-blue-50/40 px-2 py-3">
          <div className="text-[10px] font-bold tracking-wide text-[#0052d9]">我们的胜算</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Agents61 YES</div>
          <div className="text-2xl md:text-3xl font-extrabold text-[#0052d9] tabular-nums mt-1">
            {a != null ? `${a}%` : '—'}
          </div>
        </div>
        <div className="rounded-xl border border-cyan-50 bg-cyan-50/30 px-2 py-3">
          <div className="text-[10px] font-bold tracking-wide text-cyan-800">差了多少</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Gap</div>
          <div className="text-2xl md:text-3xl font-extrabold text-cyan-700 tabular-nums mt-1">
            {gap != null ? formatGap(gap) : '—'}
          </div>
        </div>
        <div className="rounded-xl border border-amber-50 bg-amber-50/40 px-2 py-3">
          <div className="text-[10px] font-bold tracking-wide text-amber-800">确信度</div>
          <div className="text-[11px] text-slate-400 mt-0.5">有多有把握</div>
          <div className="text-2xl md:text-3xl font-extrabold text-amber-900 tabular-nums mt-1">
            {conf ? conf.short : '—'}
          </div>
        </div>
      </div>

      {gap != null ? (
        <p className="text-sm text-slate-700 font-medium text-center">{gapPlain(gap)}</p>
      ) : null}
      {conf ? <p className="text-xs text-slate-500 text-center -mt-2">{conf.detail}</p> : null}

      <div className="relative pt-6 pb-2">
        <div className="h-2 rounded-full bg-slate-100 border border-slate-200" />
        <div
          className="absolute top-5 h-4 w-0.5 bg-slate-500"
          style={{ left: `calc(${m}% - 1px)` }}
          title={`市场 ${m}%`}
        />
        <div
          className="absolute top-3 text-[10px] font-bold text-slate-500 -translate-x-1/2"
          style={{ left: `${m}%` }}
        >
          市场
        </div>
        {a != null && (
          <>
            <div
              className="absolute top-5 h-4 w-0.5 bg-[#0052d9]"
              style={{ left: `calc(${a}% - 1px)` }}
              title={`我们 ${a}%`}
            />
            <div
              className="absolute top-3 text-[10px] font-bold text-[#0052d9] -translate-x-1/2"
              style={{ left: `${a}%` }}
            >
              我们
            </div>
          </>
        )}
        <div className="flex justify-between text-[10px] text-slate-400 mt-3 font-semibold tabular-nums">
          <span>0% 几乎不会</span>
          <span>50% 对半</span>
          <span>100% 几乎一定</span>
        </div>
      </div>

      {range && (
        <p className="text-sm text-slate-600">
          合理区间大概在{' '}
          <strong className="tabular-nums">
            {range[0]}%–{range[1]}%
          </strong>
          （不是下单建议）
        </p>
      )}
    </section>
  );
}
