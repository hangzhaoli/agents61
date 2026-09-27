'use client';

import { useEffect, useState } from 'react';
import { Loader2, Layers } from 'lucide-react';
import {
  QUANT_POOLS,
  defaultPoolForAsset,
  type QuantPoolId,
} from '@/lib/quant-lab/equity-universe';
import type { QuantPipelineResult } from '@/lib/quant-lab/pipeline';
import type { QuantMasterSlug } from '@/lib/quant-lab/types';
import type { QuantAssetClass } from '@/lib/quant-lab/crypto-tickers';

export default function QuantPipelinePanel({
  masterSlug,
  assetClass,
  unlocked,
}: {
  masterSlug: QuantMasterSlug;
  assetClass: QuantAssetClass;
  unlocked: boolean;
}) {
  const pools = QUANT_POOLS.filter((p) => p.assetClass === assetClass);
  const [poolId, setPoolId] = useState<QuantPoolId>(() => defaultPoolForAsset(assetClass));
  const [maxPos, setMaxPos] = useState(4);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<QuantPipelineResult | null>(null);

  useEffect(() => {
    setPoolId(defaultPoolForAsset(assetClass));
    setResult(null);
  }, [assetClass]);

  const activePool =
    pools.find((p) => p.id === poolId) ?? pools[0] ?? QUANT_POOLS[0]!;

  async function run() {
    if (!unlocked) return;
    setBusy(true);
    setError('');
    setResult(null);
    const ac = new AbortController();
    const kill = window.setTimeout(() => ac.abort(), 55_000);
    try {
      const res = await fetch('/api/quant/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterSlug,
          poolId: activePool.id,
          maxPositions: maxPos,
          topN: Math.max(maxPos + 2, 8),
        }),
        signal: ac.signal,
      });
      const data = (await res.json()) as QuantPipelineResult & { error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Pipeline failed');
        return;
      }
      setResult(data);
    } catch (e) {
      const aborted = e instanceof DOMException && e.name === 'AbortError';
      setError(aborted ? 'Pipeline timed out after 55s — retry.' : 'Network error — retry.');
    } finally {
      window.clearTimeout(kill);
      setBusy(false);
    }
  }

  const openPos = result?.positions.filter((p) => p.status === 'open') ?? [];
  const closedPos = result?.positions.filter((p) => p.status === 'closed') ?? [];

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-2 mb-3">
        <Layers className="h-4 w-4 text-[#0052d9] mt-0.5 shrink-0" strokeWidth={2.5} />
        <div>
          <h3 className="text-sm font-bold text-slate-900">Full pipeline (paper)</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Stock pool → master screen → multi-name signals → portfolio paper book. Not live
            trading.
          </p>
        </div>
      </div>

      <label className="quant-label">Universe pool</label>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {pools.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPoolId(p.id)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
              activePool.id === p.id
                ? 'border-[#0052d9] bg-blue-50 text-[#0052d9]'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-slate-500 mb-3">
        {activePool.description} · {activePool.tickers.length} names · bench {activePool.benchmark}
      </p>

      <label className="quant-label">Max open positions</label>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {[2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setMaxPos(n)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
              maxPos === n
                ? 'border-[#0052d9] bg-blue-50 text-[#0052d9]'
                : 'border-slate-200 text-slate-600'
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={run}
        disabled={busy || !unlocked}
        className="btn-primary w-full justify-center sm:w-auto"
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
            Screening &amp; paper book…
          </>
        ) : (
          <>Run full pipeline</>
        )}
      </button>

      {error ? <p className="text-sm text-red-600 mt-3">{error}</p> : null}

      {result ? (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              ['Return', `${result.summary.totalReturnPct}%`],
              ['Equity', `$${result.summary.endEquity.toLocaleString()}`],
              ['Win rate', `${result.summary.winRatePct}%`],
              ['Closed', String(result.summary.closedTrades)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">{k}</div>
                <div className="text-sm font-bold text-slate-900">{v}</div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500">{result.dataNote}</p>
          <ul className="text-[11px] text-slate-500 list-disc pl-4 space-y-0.5">
            {result.rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Screen (top)
            </h4>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-2 py-1.5 font-semibold">Ticker</th>
                    <th className="px-2 py-1.5 font-semibold">Score</th>
                    <th className="px-2 py-1.5 font-semibold">RS%</th>
                    <th className="px-2 py-1.5 font-semibold">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {result.screened.slice(0, 10).map((s) => (
                    <tr key={s.ticker} className="border-t border-slate-100">
                      <td className="px-2 py-1.5 font-semibold text-slate-900">{s.ticker}</td>
                      <td className="px-2 py-1.5">{s.score}</td>
                      <td className="px-2 py-1.5">
                        {s.rsVsBenchmarkPct != null ? s.rsVsBenchmarkPct : '—'}
                      </td>
                      <td className="px-2 py-1.5 text-slate-600">{s.reasons.slice(0, 2).join(' · ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Latest signals
            </h4>
            <ul className="space-y-1.5">
              {result.signals.map((sig) => (
                <li
                  key={`${sig.ticker}-${sig.action}`}
                  className="flex flex-wrap items-center gap-2 text-xs rounded-lg border border-slate-100 px-2.5 py-1.5"
                >
                  <span className="font-bold text-slate-900">{sig.ticker}</span>
                  <span
                    className={`uppercase font-semibold ${
                      sig.action === 'buy'
                        ? 'text-emerald-700'
                        : sig.action === 'sell'
                          ? 'text-red-600'
                          : sig.action === 'hold'
                            ? 'text-[#0052d9]'
                            : 'text-slate-400'
                    }`}
                  >
                    {sig.action}
                  </span>
                  <span className="text-slate-500">{sig.reason}</span>
                  <span className="ml-auto text-slate-400">score {sig.score}</span>
                </li>
              ))}
            </ul>
          </div>

          {openPos.length > 0 ? (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Open paper positions
              </h4>
              <ul className="space-y-1.5 text-xs">
                {openPos.map((p) => (
                  <li key={p.ticker} className="flex flex-wrap gap-2 border-b border-slate-50 py-1">
                    <span className="font-bold">{p.ticker}</span>
                    <span>
                      {p.shares} sh @ {p.entryPrice}
                    </span>
                    <span className={p.unrealizedPct >= 0 ? 'text-emerald-700' : 'text-red-600'}>
                      {p.unrealizedPct}%
                    </span>
                    <span className="text-slate-400">stop {p.stopPrice}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {closedPos.length > 0 ? (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Closed paper trades (sample)
              </h4>
              <ul className="space-y-1 text-xs text-slate-600 max-h-40 overflow-y-auto">
                {closedPos.slice(-12).map((p, i) => (
                  <li key={`${p.ticker}-${p.exitDate}-${i}`}>
                    {p.ticker}: {p.entryDate} → {p.exitDate} · {p.realizedPct}% · {p.exitReason}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1.5">
            {result.disclaimer}
          </p>
        </div>
      ) : null}
    </div>
  );
}
