'use client';

import { buildSeatContrasts } from '@/lib/desk/seat-contrast';
import type { IndependentBrief } from '@/lib/research';

const STANCE_DOT: Record<string, string> = {
  constructive: 'bg-emerald-500',
  cautious: 'bg-amber-500',
  skeptical: 'bg-red-500',
  inconclusive: 'bg-slate-400',
};

/**
 * Compact “Where they disagree” panel — textual stance/falsifier contrast only.
 * Explicitly not a vote and not advice. Never averages confidence.
 */
export default function SeatContrastPanel({ briefs }: { briefs: IndependentBrief[] }) {
  const rows = buildSeatContrasts(briefs, 4);
  if (rows.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-900">Where they disagree</h3>
        <p className="text-[10px] text-slate-400">
          Isolated views — not a vote and not advice
        </p>
      </div>
      <ul className="space-y-2">
        {rows.map((row) => (
          <li key={row.id} className="text-sm text-slate-700 leading-snug">
            <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800">
                <span className={`h-1.5 w-1.5 rounded-full ${STANCE_DOT[row.left.stance] ?? 'bg-slate-400'}`} />
                {row.left.nameEn}
              </span>
              <span className="text-[10px] text-slate-400">vs</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800">
                <span className={`h-1.5 w-1.5 rounded-full ${STANCE_DOT[row.right.stance] ?? 'bg-slate-400'}`} />
                {row.right.nameEn}
              </span>
            </div>
            <p className="text-xs text-slate-600">{row.note}</p>
          </li>
        ))}
      </ul>
      <p className="text-[10px] text-slate-400">
        Clerk stacks the split. Confidence is never averaged into a recommendation.
      </p>
    </div>
  );
}
