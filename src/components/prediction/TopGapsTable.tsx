'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { GapRow, GapSort } from '@/lib/prediction/gaps';
import { sortGapRows } from '@/lib/prediction/gaps';
import { formatConfidencePlain, formatGap } from '@/lib/prediction/types';

const SORTS: { id: GapSort; label: string }[] = [
  { id: 'abs_gap', label: '差得最多' },
  { id: 'confidence', label: '确信度最高' },
  { id: 'volume', label: '成交量最大' },
  { id: 'newest', label: '较新' },
  { id: 'closing', label: '快到期' },
];

export default function TopGapsTable({
  rows,
  title = '胜算差最大的盘',
  subtitle = '市场胜算 vs 我们的胜算：差得越多，越值得点进去看确信度。',
}: {
  rows: GapRow[];
  title?: string;
  subtitle?: string;
}) {
  const [sort, setSort] = useState<GapSort>('abs_gap');
  const sorted = useMemo(() => sortGapRows(rows, sort).slice(0, 12), [rows, sort]);

  return (
    <section id="gaps" className="card p-6 md:p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-1">{title}</h2>
      <p className="text-sm text-slate-600 mb-4">{subtitle}</p>

      <div className="flex flex-wrap gap-2 mb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 self-center mr-1">
          排序
        </span>
        {SORTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSort(s.id)}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
              sort === s.id
                ? 'border-[#0052d9] bg-[#0052d9]/10 text-[#0052d9]'
                : 'border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-slate-500">No researched gaps yet — open a market and run Analyze.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-200">
                <th className="py-2 pr-3 font-bold">问题</th>
                <th className="py-2 pr-3 font-bold">市场胜算</th>
                <th className="py-2 pr-3 font-bold">我们的胜算</th>
                <th className="py-2 pr-3 font-bold">差了多少</th>
                <th className="py-2 pr-3 font-bold">确信度</th>
                <th className="py-2 font-bold">成交量</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr key={row.market.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                  <td className="py-3 pr-3 max-w-xs">
                    <Link
                      href={`/predictions/${encodeURIComponent(row.market.id)}`}
                      className="font-semibold text-slate-900 hover:text-[#0052d9] line-clamp-2"
                    >
                      {row.market.question}
                    </Link>
                  </td>
                  <td className="py-3 pr-3 tabular-nums">{row.market.marketProbability}%</td>
                  <td className="py-3 pr-3 tabular-nums">{row.agents61Probability}%</td>
                  <td className="py-3 pr-3 tabular-nums font-semibold text-[#0052d9]">
                    {formatGap(row.gap)}
                  </td>
                  <td className="py-3 pr-3">{formatConfidencePlain(row.confidence).short}</td>
                  <td className="py-3 tabular-nums text-slate-600">{row.market.volumeLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
