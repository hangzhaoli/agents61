'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Activity } from 'lucide-react';
import { formatGap } from '@/lib/prediction/types';

export type GapTeaserRow = {
  id: string;
  question: string;
  marketProbability: number;
  agents61Probability: number;
  gap: number;
  volumeLabel: string;
  category: string;
};

export default function PredictionGapArena({ rows }: { rows: GapTeaserRow[] }) {
  const [active, setActive] = useState(0);
  const safe = rows.length > 0 ? rows : [];

  useEffect(() => {
    if (safe.length < 2) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % safe.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, [safe.length]);

  if (safe.length === 0) return null;

  const row = safe[active]!;
  const marketW = Math.max(4, Math.min(100, row.marketProbability));
  const agentsW = Math.max(4, Math.min(100, row.agents61Probability));
  const gapAbs = Math.abs(row.gap);
  const gapHot = gapAbs >= 8;

  return (
    <div className="pm-arena" aria-live="polite">
      <div className="pm-arena-stage">
        <div className="pm-arena-meta">
          <span className="pm-live-dot" aria-hidden />
          <span className="pm-arena-live">Gap radar</span>
          <span className="pm-arena-cat">{row.category}</span>
          <span className="pm-arena-vol">{row.volumeLabel} vol</span>
        </div>

        <Link
          href={`/prediction-markets/${encodeURIComponent(row.id)}`}
          className="pm-arena-question"
        >
          {row.question}
        </Link>

        <div className="pm-arena-bars">
          <div className="pm-bar-row">
            <div className="pm-bar-label">
              <span>Polymarket YES</span>
              <strong className="tabular-nums">{row.marketProbability.toFixed(1)}%</strong>
            </div>
            <div className="pm-bar-track">
              <div
                className="pm-bar-fill pm-bar-market"
                style={{ width: `${marketW}%` }}
              />
            </div>
          </div>
          <div className="pm-bar-row">
            <div className="pm-bar-label">
              <span>Agents61 research</span>
              <strong className="tabular-nums">{row.agents61Probability.toFixed(1)}%</strong>
            </div>
            <div className="pm-bar-track">
              <div
                className="pm-bar-fill pm-bar-agents"
                style={{ width: `${agentsW}%` }}
              />
            </div>
          </div>
        </div>

        <div className={`pm-gap-chip ${gapHot ? 'pm-gap-chip-hot' : ''}`}>
          <Activity className="h-4 w-4" strokeWidth={2.5} />
          <span>Probability Gap</span>
          <strong className="tabular-nums">{formatGap(row.gap)}</strong>
        </div>

        <Link
          href={`/prediction-markets/${encodeURIComponent(row.id)}`}
          className="pm-arena-cta"
        >
          Analyze this misprice
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
      </div>

      <div className="pm-arena-dots" role="tablist" aria-label="Featured probability gaps">
        {safe.map((r, i) => (
          <button
            key={r.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`pm-arena-dot ${i === active ? 'is-active' : ''}`}
            onClick={() => setActive(i)}
            title={r.question.slice(0, 80)}
          />
        ))}
      </div>
    </div>
  );
}
