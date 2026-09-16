'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Trash2 } from 'lucide-react';
import type { PredictionSave } from '@/lib/prediction/types';
import { formatGap } from '@/lib/prediction/types';
import {
  readPredictionSaves,
  removePredictionSave,
  togglePredictionFavorite,
  writePredictionSaves,
} from '@/lib/prediction/saves';
import { hydratePredictionSaves, pushPredictionSaves } from '@/lib/sync/cloud-client';
import { readDeskSession } from '@/lib/demo-session';
import AuthGateLink from '@/components/auth/AuthGateLink';

export default function PredictionHistoryPanel() {
  const [items, setItems] = useState<PredictionSave[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [syncNote, setSyncNote] = useState('');

  useEffect(() => {
    const session = readDeskSession();
    setLoggedIn(Boolean(session?.email));
    const local = readPredictionSaves();
    setItems(local);
    void hydratePredictionSaves(local, (next) => {
      writePredictionSaves(next);
      setItems(next);
    }).then((state) => {
      if (state === 'synced') setSyncNote('Synced to cloud');
      else if (state === 'local-only') setSyncNote(session?.email ? 'Local only (cloud unavailable)' : '');
    });

    const onChange = () => setItems(readPredictionSaves());
    window.addEventListener('agents61-prediction-saves', onChange);
    return () => window.removeEventListener('agents61-prediction-saves', onChange);
  }, []);

  async function favorite(marketId: string) {
    const next = togglePredictionFavorite(marketId);
    setItems(next);
    await pushPredictionSaves(next);
  }

  async function remove(id: string) {
    const next = removePredictionSave(id);
    setItems(next);
    await pushPredictionSaves(next);
  }

  if (!loggedIn) {
    return (
      <section className="card p-6 md:p-8 mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Your prediction history</h2>
        <p className="text-sm text-slate-600 mb-4">
          Sign in to save analyzes, star favorites, and sync across devices (plan slot limits apply).
        </p>
        <AuthGateLink href="/predictions" guestHref="/register?next=%2Fpredictions" className="btn-primary text-sm">
          Sign in to unlock history
        </AuthGateLink>
      </section>
    );
  }

  const favorites = items.filter((i) => i.favorited);
  const recent = items.slice(0, 12);

  return (
    <section id="history" className="card p-6 md:p-8 mb-10">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Your prediction history</h2>
          <p className="text-sm text-slate-600 mt-1">
            {items.length} saved · {favorites.length} favorited
            {syncNote ? ` · ${syncNote}` : ''}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No saves yet. Run Analyze on a market, then hit Save / Favorite on the report.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-200">
                <th className="py-2 pr-3">Market</th>
                <th className="py-2 pr-3">Market %</th>
                <th className="py-2 pr-3">Agents61</th>
                <th className="py-2 pr-3">Gap</th>
                <th className="py-2 pr-3">Engine</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="py-3 pr-3 max-w-xs">
                    <Link
                      href={`/predictions/${encodeURIComponent(row.marketId)}`}
                      className="font-semibold text-slate-900 hover:text-[#0052d9] line-clamp-2"
                    >
                      {row.question}
                    </Link>
                  </td>
                  <td className="py-3 pr-3 tabular-nums">{row.marketProbability}%</td>
                  <td className="py-3 pr-3 tabular-nums">{row.agents61Probability}%</td>
                  <td className="py-3 pr-3 tabular-nums font-semibold">{formatGap(row.probabilityGap)}</td>
                  <td className="py-3 pr-3 text-slate-500">{row.engine}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="p-1.5 rounded-lg hover:bg-slate-100"
                        onClick={() => void favorite(row.marketId)}
                        aria-label="Toggle favorite"
                      >
                        <Star
                          className={`h-4 w-4 ${row.favorited ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`}
                          strokeWidth={2}
                        />
                      </button>
                      <button
                        type="button"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-600"
                        onClick={() => void remove(row.id)}
                        aria-label="Remove save"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
