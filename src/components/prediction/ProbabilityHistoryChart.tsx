'use client';

import { useEffect, useState } from 'react';
import type { ProbabilityHistoryPoint } from '@/lib/prediction/types';
import { listHistory } from '@/lib/prediction/history';

export default function ProbabilityHistoryChart({ marketId }: { marketId: string }) {
  const [points, setPoints] = useState<ProbabilityHistoryPoint[]>([]);

  useEffect(() => {
    setPoints(listHistory(marketId));
    const sync = () => setPoints(listHistory(marketId));
    window.addEventListener('agents61-prediction-history', sync);
    return () => window.removeEventListener('agents61-prediction-history', sync);
  }, [marketId]);

  if (points.length < 1) {
    return (
      <section className="card p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-2">Probability history</h3>
        <p className="text-sm text-slate-500">
          Run Analyze to start an append-only history of Market vs Agents61 estimates.
        </p>
      </section>
    );
  }

  const maxN = Math.max(...points.flatMap((p) => [p.marketProbability, p.agents61Probability]), 1);
  const w = 320;
  const h = 120;
  const pad = 8;

  function x(i: number) {
    return pad + (i / Math.max(1, points.length - 1)) * (w - pad * 2);
  }
  function y(v: number) {
    return h - pad - (v / maxN) * (h - pad * 2);
  }

  const marketPath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.marketProbability).toFixed(1)}`)
    .join(' ');
  const a61Path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.agents61Probability).toFixed(1)}`)
    .join(' ');

  return (
    <section className="card p-5">
      <h3 className="text-sm font-bold text-slate-900 mb-2">Probability history</h3>
      <p className="text-xs text-slate-500 mb-3">
        Append-only · Market (slate) vs Agents61 (blue) · {points.length} point
        {points.length === 1 ? '' : 's'}
      </p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label="Probability history chart">
        <path d={marketPath} fill="none" stroke="#64748b" strokeWidth="2" />
        <path d={a61Path} fill="none" stroke="#0052d9" strokeWidth="2.5" />
      </svg>
      <ul className="mt-3 space-y-1 max-h-28 overflow-y-auto">
        {[...points].reverse().slice(0, 6).map((p) => (
          <li key={p.at} className="text-[11px] text-slate-500 tabular-nums flex justify-between gap-2">
            <span>{new Date(p.at).toLocaleString()}</span>
            <span>
              M {p.marketProbability}% · A61 {p.agents61Probability}% · Gap {p.gap > 0 ? '+' : ''}
              {p.gap.toFixed(0)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
