'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Loader2,
  RefreshCw,
  RotateCcw,
  Wallet,
} from 'lucide-react';
import {
  QUANT_POOLS,
  defaultPoolForAsset,
  type QuantPoolId,
} from '@/lib/quant-lab/equity-universe';
import { QUANT_MASTERS } from '@/lib/quant-lab/masters';
import type { QuantMasterSlug } from '@/lib/quant-lab/types';
import type { QuantAssetClass } from '@/lib/quant-lab/crypto-tickers';
import {
  applyStrategyIntents,
  markAccount,
  resetPaperAccount,
  snapshot,
  type StrategyBookIntent,
} from '@/lib/paper-account/engine';
import { PAPER_ACCOUNT_EVENT, readPaperAccount, writePaperAccount } from '@/lib/paper-account/store';
import { PAPER_START_CASH, type PaperAccount } from '@/lib/paper-account/types';
import { isUnlocked, type PlanId } from '@/lib/tiers';

function money(n: number) {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

export default function PaperAccountPanel({ plan }: { plan: PlanId }) {
  const [account, setAccount] = useState<PaperAccount | null>(null);
  const [masterSlug, setMasterSlug] = useState<QuantMasterSlug>('william-oneil');
  const [assetClass, setAssetClass] = useState<QuantAssetClass>('equity');
  const [poolId, setPoolId] = useState<QuantPoolId>(() => defaultPoolForAsset('equity'));
  const [maxPos, setMaxPos] = useState(4);
  const [busy, setBusy] = useState<'sync' | 'run' | ''>('');
  const [error, setError] = useState('');
  const [note, setNote] = useState('');

  const reload = useCallback(() => setAccount(readPaperAccount()), []);

  useEffect(() => {
    reload();
    window.addEventListener(PAPER_ACCOUNT_EVENT, reload);
    window.addEventListener('storage', reload);
    return () => {
      window.removeEventListener(PAPER_ACCOUNT_EVENT, reload);
      window.removeEventListener('storage', reload);
    };
  }, [reload]);

  useEffect(() => {
    setPoolId(defaultPoolForAsset(assetClass));
  }, [assetClass]);

  const pools = QUANT_POOLS.filter((p) => p.assetClass === assetClass);
  const unlocked = isUnlocked(plan, masterSlug);
  const snap = account ? snapshot(account) : null;

  function commit(next: PaperAccount, msg?: string) {
    writePaperAccount(next);
    setAccount(next);
    if (msg) setNote(msg);
  }

  async function syncMarket() {
    if (!account) return;
    setBusy('sync');
    setError('');
    setNote('');
    try {
      const symbols = account.positions.map((p) => p.ticker);
      if (symbols.length === 0) {
        setNote('No open lots — nothing to mark. Run a master strategy first.');
        return;
      }
      const res = await fetch('/api/paper-account/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols }),
      });
      const data = (await res.json()) as {
        prices?: Record<string, number>;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? 'Quote sync failed');
        return;
      }
      const next = markAccount(account, data.prices ?? {});
      const before = snapshot(account).equity;
      const after = snapshot(next).equity;
      commit(
        next,
        `Marked to market · equity ${money(after)} (${after >= before ? '+' : ''}${money(after - before)} vs last mark)`
      );
    } catch {
      setError('Network error while syncing marks');
    } finally {
      setBusy('');
    }
  }

  async function runStrategy() {
    if (!unlocked) return;
    setBusy('run');
    setError('');
    setNote('');
    const ac = new AbortController();
    const kill = window.setTimeout(() => ac.abort(), 55_000);
    try {
      const res = await fetch('/api/paper-account/run-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterSlug,
          poolId,
          maxPositions: maxPos,
          topN: Math.max(maxPos + 2, 8),
        }),
        signal: ac.signal,
      });
      const data = (await res.json()) as {
        error?: string;
        intents?: StrategyBookIntent[];
        masterLabel?: string;
      };
      if (!res.ok) {
        setError(data.error ?? 'Strategy run failed');
        return;
      }
      const base = readPaperAccount();
      const { account: booked, applied, skipped } = applyStrategyIntents(
        base,
        data.intents ?? [],
        { maxPositions: maxPos, source: 'quant-pipeline' }
      );
      const symbols = booked.positions.map((p) => p.ticker);
      let marked = booked;
      if (symbols.length > 0) {
        const qRes = await fetch('/api/paper-account/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbols }),
        });
        const qData = (await qRes.json()) as { prices?: Record<string, number> };
        if (qRes.ok) marked = markAccount(booked, qData.prices ?? {});
      }
      const s = snapshot(marked);
      commit(
        marked,
        `${data.masterLabel ?? masterSlug}: booked ${applied} fill(s) · equity ${money(s.equity)}${
          skipped.length ? ` · skipped ${skipped.length}` : ''
        }`
      );
    } catch (e) {
      const aborted = e instanceof DOMException && e.name === 'AbortError';
      setError(aborted ? 'Strategy timed out after 55s — retry.' : 'Network error — retry.');
    } finally {
      window.clearTimeout(kill);
      setBusy('');
    }
  }

  function onReset() {
    if (!window.confirm(`Reset paper account to ${money(PAPER_START_CASH)} cash? Open lots will clear.`)) {
      return;
    }
    commit(resetPaperAccount(), `Reset to ${money(PAPER_START_CASH)} virtual cash`);
  }

  if (!account || !snap) {
    return <div className="text-sm text-slate-500 py-8">Loading paper account…</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="badge badge-primary mb-2">
            <Wallet className="h-3.5 w-3.5" strokeWidth={2.5} />
            Virtual $100k desk
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Paper account</h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Masters / Quant Lab screen a pool, book longs into this virtual account, then sync
            latest market marks. Not live trading. Not investment advice.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={syncMarket}
            disabled={Boolean(busy)}
            className="btn-secondary text-sm !py-2 !px-3"
          >
            {busy === 'sync' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" strokeWidth={2.5} />
            )}
            Sync market
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={Boolean(busy)}
            className="btn-secondary text-sm !py-2 !px-3"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2.5} />
            Reset $100k
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          ['Equity', money(snap.equity)],
          ['Cash', money(account.cash)],
          ['Return', `${snap.totalReturnPct}%`],
          ['Open lots', String(snap.openCount)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">{k}</div>
            <div
              className={`text-sm font-bold ${
                k === 'Return'
                  ? snap.totalReturnPct >= 0
                    ? 'text-emerald-700'
                    : 'text-red-600'
                  : 'text-slate-900'
              }`}
            >
              {v}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-slate-500">
        Unrealized {snap.unrealizedPnl >= 0 ? '+' : ''}
        {money(snap.unrealizedPnl)} ({snap.unrealizedPnlPct}%)
        {account.lastMarkedAt
          ? ` · last mark ${new Date(account.lastMarkedAt).toLocaleString()}`
          : ' · not marked yet'}
      </p>

      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Run master strategy into account</h3>
        <label className="quant-label">Timing / exit master</label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {QUANT_MASTERS.map((qm) => {
            const on = isUnlocked(plan, qm.slug);
            const active = masterSlug === qm.slug;
            return (
              <button
                key={qm.slug}
                type="button"
                disabled={!on}
                onClick={() => setMasterSlug(qm.slug)}
                className={`quant-master-pick w-full text-left ${active ? 'quant-master-pick-active' : ''} ${
                  !on ? 'opacity-50' : ''
                }`}
              >
                <span className="text-sm font-semibold text-slate-900">{qm.label}</span>
              </button>
            );
          })}
        </div>

        <label className="quant-label">Asset class</label>
        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
          {(['equity', 'crypto'] as QuantAssetClass[]).map((ac) => (
            <button
              key={ac}
              type="button"
              onClick={() => setAssetClass(ac)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md ${
                assetClass === ac ? 'bg-white text-[#0052d9] shadow-sm' : 'text-slate-500'
              }`}
            >
              {ac === 'equity' ? 'Equity / ETF' : 'Crypto / chain'}
            </button>
          ))}
        </div>

        <label className="quant-label">Universe pool</label>
        <div className="flex flex-wrap gap-1.5">
          {pools.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPoolId(p.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                poolId === p.id
                  ? 'border-[#0052d9] bg-blue-50 text-[#0052d9]'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <label className="quant-label">Max open positions</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
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
          onClick={runStrategy}
          disabled={Boolean(busy) || !unlocked}
          className="btn-primary w-full sm:w-auto justify-center"
        >
          {busy === 'run' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
              Screening &amp; booking…
            </>
          ) : (
            <>Run strategy → book to $100k</>
          )}
        </button>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {note ? <p className="text-sm text-slate-600">{note}</p> : null}

      {account.positions.length > 0 ? (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Open positions
          </h3>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-2 py-1.5 font-semibold">Ticker</th>
                  <th className="px-2 py-1.5 font-semibold">Shares</th>
                  <th className="px-2 py-1.5 font-semibold">Avg</th>
                  <th className="px-2 py-1.5 font-semibold">Mark</th>
                  <th className="px-2 py-1.5 font-semibold">P&amp;L</th>
                  <th className="px-2 py-1.5 font-semibold">Master</th>
                </tr>
              </thead>
              <tbody>
                {account.positions.map((p) => {
                  const pnl = (p.lastPrice / p.avgCost - 1) * 100;
                  return (
                    <tr key={p.id} className="border-t border-slate-100">
                      <td className="px-2 py-1.5 font-semibold text-slate-900">{p.ticker}</td>
                      <td className="px-2 py-1.5">{p.shares}</td>
                      <td className="px-2 py-1.5">{p.avgCost.toFixed(2)}</td>
                      <td className="px-2 py-1.5">{p.lastPrice.toFixed(2)}</td>
                      <td
                        className={`px-2 py-1.5 font-semibold ${
                          pnl >= 0 ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {pnl.toFixed(1)}%
                      </td>
                      <td className="px-2 py-1.5 text-slate-500">{p.masterSlug ?? '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          No open lots. Pick a master + pool, then <strong>Run strategy → book to $100k</strong>.
        </p>
      )}

      {account.fills.length > 0 ? (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Recent fills
          </h3>
          <ul className="space-y-1 text-xs text-slate-600 max-h-40 overflow-y-auto">
            {[...account.fills].reverse().slice(0, 20).map((f) => (
              <li key={f.id}>
                <span className={f.side === 'buy' ? 'text-emerald-700 font-semibold' : 'text-red-600 font-semibold'}>
                  {f.side.toUpperCase()}
                </span>{' '}
                {f.ticker} × {f.shares} @ {f.price.toFixed(2)} · {f.reason}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1.5">
        Paper only. Marks use cached desk quotes / daily closes. Slippage and shorting are not
        modeled. Starting virtual cash is {money(PAPER_START_CASH)}.
      </p>
    </div>
  );
}
