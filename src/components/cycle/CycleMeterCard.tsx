import Link from 'next/link';
import { CYCLE_SNAPSHOT } from '@/lib/opportunities';

const PHASE_LABELS = ['Deep Recession', 'Early Recovery', 'Mid Expansion', 'Late Expansion', 'Euphoria'];

const SCENARIO_COLOR: Record<string, string> = {
  boom: 'bg-red-100 text-red-700',
  recession: 'bg-blue-100 text-blue-700',
  stagflation: 'bg-amber-100 text-amber-700',
  recovery: 'bg-emerald-100 text-emerald-700',
};

export default function CycleMeterCard() {
  const temp = CYCLE_SNAPSHOT.temperature;
  return (
    <div className="card p-8 md:p-12 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl md:text-7xl font-extrabold text-[#0052d9] mb-2">{temp}</div>
        <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
          Current Cycle Temperature
        </div>
        <div className="badge badge-warning mt-3">{CYCLE_SNAPSHOT.phase}</div>
        <p className="text-xs text-slate-400 mt-2">{CYCLE_SNAPSHOT.updated}</p>
      </div>

      <div className="thermometer-track mb-4">
        <div className="thermometer-fill" style={{ left: `${temp}%` }} />
      </div>

      <div className="flex justify-between text-xs text-slate-400 mb-8">
        {PHASE_LABELS.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {CYCLE_SNAPSHOT.scenarios.map((s) => (
          <div key={s.id} className={`rounded-xl p-3 text-center ${SCENARIO_COLOR[s.id] ?? 'bg-slate-100'}`}>
            <div className="text-xs font-medium opacity-75">{s.label}</div>
            <div className="text-lg font-bold">{s.probability}%</div>
          </div>
        ))}
      </div>

      <ul className="text-sm text-slate-600 space-y-2 mb-8">
        <li>Dalio: {CYCLE_SNAPSHOT.dalio}</li>
        <li>Marks: {CYCLE_SNAPSHOT.marks}</li>
        <li>Templeton: {CYCLE_SNAPSHOT.templeton}</li>
      </ul>

      <p className="text-sm text-slate-500 text-center mb-4">
        Analyst unlocks the cycle desk briefs. Principal and Committee add specialist macro seats.
        Research simulation, not a forecast.
      </p>
      <div className="text-center">
        <Link href="/pricing" className="btn-secondary text-sm">
          Compare seating
        </Link>
      </div>
    </div>
  );
}
