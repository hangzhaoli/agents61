import { formatGap } from '@/lib/prediction/types';

export default function ProbabilityCompare({
  marketProbability,
  agents61Probability,
  gap,
  range,
}: {
  marketProbability: number;
  agents61Probability: number | null;
  gap: number | null;
  range?: [number, number] | null;
}) {
  const m = Math.max(0, Math.min(100, marketProbability));
  const a = agents61Probability != null ? Math.max(0, Math.min(100, agents61Probability)) : null;

  return (
    <section className="card p-5 md:p-6 space-y-5">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Market</div>
          <div className="text-2xl md:text-3xl font-extrabold text-slate-900 tabular-nums mt-1">{m}%</div>
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Agents61</div>
          <div className="text-2xl md:text-3xl font-extrabold text-[#0052d9] tabular-nums mt-1">
            {a != null ? `${a}%` : '—'}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Gap</div>
          <div className="text-2xl md:text-3xl font-extrabold text-cyan-700 tabular-nums mt-1">
            {gap != null ? formatGap(gap) : '—'}
          </div>
        </div>
      </div>

      <div className="relative pt-6 pb-2">
        <div className="h-2 rounded-full bg-slate-100 border border-slate-200" />
        <div
          className="absolute top-5 h-4 w-0.5 bg-slate-500"
          style={{ left: `calc(${m}% - 1px)` }}
          title={`Market ${m}%`}
        />
        <div
          className="absolute top-3 text-[10px] font-bold text-slate-500 -translate-x-1/2"
          style={{ left: `${m}%` }}
        >
          M
        </div>
        {a != null && (
          <>
            <div
              className="absolute top-5 h-4 w-0.5 bg-[#0052d9]"
              style={{ left: `calc(${a}% - 1px)` }}
              title={`Agents61 ${a}%`}
            />
            <div
              className="absolute top-3 text-[10px] font-bold text-[#0052d9] -translate-x-1/2"
              style={{ left: `${a}%` }}
            >
              A61
            </div>
          </>
        )}
        <div className="flex justify-between text-[10px] text-slate-400 mt-3 font-semibold tabular-nums">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {range && (
        <p className="text-sm text-slate-600">
          Committee range{' '}
          <strong className="tabular-nums">
            {range[0]}%–{range[1]}%
          </strong>{' '}
          (uncertainty band, not a bet ticket)
        </p>
      )}
    </section>
  );
}
