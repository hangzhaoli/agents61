'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { GapRow, GapSort } from '@/lib/prediction/gaps';
import { filterGapRows, sortGapRows } from '@/lib/prediction/gaps';
import type { PredictionProvider } from '@/lib/prediction/types';
import { formatGap } from '@/lib/prediction/types';

const CATEGORIES = [
  'all',
  'politics',
  'crypto',
  'macro',
  'tech',
  'geopolitics',
  'general',
] as const;

export default function ScannerClient({ rows }: { rows: GapRow[] }) {
  const [provider, setProvider] = useState<PredictionProvider | 'all'>('all');
  const [category, setCategory] = useState<string>('all');
  const [sort, setSort] = useState<GapSort>('volume');
  const [minAbsGap, setMinAbsGap] = useState(0);

  const filtered = useMemo(() => {
    const base = filterGapRows(rows, {
      provider,
      category,
      minAbsGap: minAbsGap > 0 ? minAbsGap : null,
    });
    return sortGapRows(base, sort);
  }, [rows, provider, category, sort, minAbsGap]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-end">
        <label className="text-xs font-semibold text-slate-600">
          Provider
          <select
            className="mt-1 block rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            value={provider}
            onChange={(e) => setProvider(e.target.value as PredictionProvider | 'all')}
          >
            <option value="all">All</option>
            <option value="polymarket">Polymarket</option>
            <option value="kalshi">Kalshi (soon)</option>
          </select>
        </label>
        <label className="text-xs font-semibold text-slate-600">
          Category
          <select
            className="mt-1 block rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All' : c}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold text-slate-600">
          Sort
          <select
            className="mt-1 block rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value as GapSort)}
          >
            <option value="volume">Volume</option>
            <option value="abs_gap">|Gap|</option>
            <option value="confidence">Confidence</option>
            <option value="closing">Closing soon</option>
            <option value="newest">Newest</option>
          </select>
        </label>
        <label className="text-xs font-semibold text-slate-600">
          Min |Gap|
          <select
            className="mt-1 block rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            value={minAbsGap}
            onChange={(e) => setMinAbsGap(Number(e.target.value))}
          >
            <option value={0}>Any</option>
            <option value={5}>5+</option>
            <option value={10}>10+</option>
            <option value={15}>15+</option>
          </select>
        </label>
      </div>

      <p className="text-xs text-slate-400">{filtered.length} markets</p>

      <div className="overflow-x-auto border border-slate-900">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500">
              <th className="p-3 font-bold">Question</th>
              <th className="p-3 font-bold">Provider</th>
              <th className="p-3 font-bold">Market</th>
              <th className="p-3 font-bold">Agents61</th>
              <th className="p-3 font-bold">Gap</th>
              <th className="p-3 font-bold">Conf.</th>
              <th className="p-3 font-bold">Volume</th>
              <th className="p-3 font-bold">Closes</th>
              <th className="p-3 font-bold" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.market.id} className="border-t border-slate-200 hover:bg-slate-50/60">
                <td className="p-3 max-w-sm">
                  <Link
                    href={`/predictions/${encodeURIComponent(row.market.id)}`}
                    className="font-semibold text-slate-900 hover:text-[#0052d9] line-clamp-2"
                  >
                    {row.market.question}
                  </Link>
                </td>
                <td className="p-3 text-slate-500 capitalize">{row.market.provider}</td>
                <td className="p-3 tabular-nums">{row.market.marketProbability}%</td>
                <td className="p-3 tabular-nums">{row.agents61Probability}%</td>
                <td className="p-3 tabular-nums font-medium text-[#0052d9]">{formatGap(row.gap)}</td>
                <td className="p-3">{row.confidence}</td>
                <td className="p-3 tabular-nums text-slate-600">{row.market.volumeLabel}</td>
                <td className="p-3 text-slate-600">{row.market.endDateLabel}</td>
                <td className="p-3">
                  <Link
                    href={`/predictions/${encodeURIComponent(row.market.id)}`}
                    className="text-xs font-bold text-[#0052d9] hover:underline"
                  >
                    Analyze
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
