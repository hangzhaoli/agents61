'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import type { PredictionWatchItem } from '@/lib/prediction/types';
import { formatGap } from '@/lib/prediction/types';
import { readWatchlist, removeFromWatchlist } from '@/lib/prediction/watchlist';
import PredictionsSubnav from '@/components/prediction/PredictionsSubnav';
import PredictionDisclaimer from '@/components/prediction/PredictionDisclaimer';

export default function WatchlistClient() {
  const [items, setItems] = useState<PredictionWatchItem[]>([]);

  useEffect(() => {
    setItems(readWatchlist());
    const sync = () => setItems(readWatchlist());
    window.addEventListener('agents61-prediction-watchlist', sync);
    return () => window.removeEventListener('agents61-prediction-watchlist', sync);
  }, []);

  function remove(marketId: string) {
    setItems(removeFromWatchlist(marketId));
  }

  return (
    <div>
      <PredictionsSubnav active="/predictions/watchlist" />
      <header className="max-w-3xl mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Watchlist</h1>
        <p className="mt-3 text-slate-600">
          Track markets and whether the tape is moving toward or away from Agents61&apos;s estimate.
          Snapshots at add time are preserved for comparison.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-slate-600 mb-4">No markets watched yet.</p>
          <Link href="/predictions/scanner" className="btn-primary text-sm">
            Browse scanner
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500">
                <th className="p-3 font-bold">Market</th>
                <th className="p-3 font-bold">Market %</th>
                <th className="p-3 font-bold">vs add</th>
                <th className="p-3 font-bold">Agents61</th>
                <th className="p-3 font-bold">vs add</th>
                <th className="p-3 font-bold">Gap</th>
                <th className="p-3 font-bold">Updated</th>
                <th className="p-3 font-bold" />
              </tr>
            </thead>
            <tbody>
              {items.map((w) => {
                const mDelta = w.marketProbability - w.marketProbAtAdd;
                const aDelta =
                  w.agents61Probability != null && w.agents61AtAdd != null
                    ? w.agents61Probability - w.agents61AtAdd
                    : null;
                return (
                  <tr key={w.id} className="border-t border-slate-200">
                    <td className="p-3 max-w-xs">
                      <Link
                        href={`/predictions/${encodeURIComponent(w.marketId)}`}
                        className="font-semibold text-slate-900 hover:text-[#0052d9] line-clamp-2"
                      >
                        {w.question}
                      </Link>
                      <div className="text-[10px] text-slate-400 capitalize mt-0.5">{w.provider}</div>
                    </td>
                    <td className="p-3 tabular-nums">{w.marketProbability}%</td>
                    <td className="p-3 tabular-nums text-slate-500">
                      {mDelta === 0 ? '—' : `${mDelta > 0 ? '+' : ''}${mDelta.toFixed(0)}`}
                    </td>
                    <td className="p-3 tabular-nums">
                      {w.agents61Probability != null ? `${w.agents61Probability}%` : '—'}
                    </td>
                    <td className="p-3 tabular-nums text-slate-500">
                      {aDelta == null || aDelta === 0
                        ? '—'
                        : `${aDelta > 0 ? '+' : ''}${aDelta.toFixed(0)}`}
                    </td>
                    <td className="p-3 tabular-nums font-medium text-[#0052d9]">
                      {w.gap != null ? formatGap(w.gap) : '—'}
                    </td>
                    <td className="p-3 text-xs text-slate-500">
                      {new Date(w.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-600"
                        onClick={() => remove(w.marketId)}
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <PredictionDisclaimer />
    </div>
  );
}
