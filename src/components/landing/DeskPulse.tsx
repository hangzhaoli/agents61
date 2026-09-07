import MiniSpark from '@/components/landing/MiniSpark';
import { PULSE_CELLS, type PulseCell } from '@/lib/landing-pulse';

export default function DeskPulse({ cells }: { cells?: PulseCell[] }) {
  const row = cells?.length ? cells : PULSE_CELLS;
  return (
    <div className="desk-pulse" aria-label="Committee board readings. Cached snapshots. Not live prices.">
      {row.map((cell) => (
        <div key={cell.label} className="desk-pulse-cell">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-[10px] font-bold tracking-widest text-slate-400">{cell.label}</div>
              <div className="text-lg font-extrabold text-slate-900 tabular-nums leading-tight">{cell.value}</div>
            </div>
            <MiniSpark seed={cell.seed} tone={cell.tone} />
          </div>
          <div className="text-[11px] text-slate-500 mt-1 truncate">{cell.hint}</div>
        </div>
      ))}
    </div>
  );
}
