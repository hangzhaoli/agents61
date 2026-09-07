'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Plus, Trash2, TrendingUp } from 'lucide-react';
import { PLANS, type PlanId } from '@/lib/tiers';
import {
  hydrateWatchlist,
  pushWatchlist,
  type CloudSyncState,
} from '@/lib/sync/cloud-client';
import {
  addWatchlistItem,
  readWatchlist,
  watchlistLimit,
  writeWatchlist,
  type WatchlistItem,
  type WatchlistKind,
} from '@/lib/watchlist';
import { POPULAR_TICKERS } from '@/lib/popular-tickers';
import { PRIVATE_COMPANIES } from '@/lib/private-universe';

export default function WatchlistPanel({ plan }: { plan: PlanId }) {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [symbol, setSymbol] = useState('');
  const [kind, setKind] = useState<WatchlistKind>('equity');
  const [error, setError] = useState<string | null>(null);
  const [syncState, setSyncState] = useState<CloudSyncState>('idle');
  const limit = watchlistLimit(plan);

  const syncLocal = useCallback(() => setItems(readWatchlist()), []);

  const commit = useCallback((next: WatchlistItem[]) => {
    writeWatchlist(next);
    setItems(next);
    setSyncState('syncing');
    void pushWatchlist(next).then((ok) => setSyncState(ok ? 'synced' : 'local-only'));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setSyncState('syncing');
      const local = readWatchlist();
      setItems(local);
      const state = await hydrateWatchlist(local, writeWatchlist);
      if (cancelled) return;
      setItems(readWatchlist());
      setSyncState(state);
    })();
    window.addEventListener('agents61-watchlist', syncLocal);
    return () => {
      cancelled = true;
      window.removeEventListener('agents61-watchlist', syncLocal);
    };
  }, [syncLocal]);

  const syncLabel =
    syncState === 'syncing'
      ? 'syncing…'
      : syncState === 'synced'
        ? 'synced to cloud'
        : syncState === 'error'
          ? 'sync error — saved on device'
          : 'this device only';

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const sym = symbol.trim().toUpperCase();
    if (!sym) return;
    const name =
      POPULAR_TICKERS.find((t) => t.symbol === sym)?.name ??
      PRIVATE_COMPANIES.find((p) => p.slug === sym.toLowerCase())?.name ??
      sym;
    const res = addWatchlistItem(plan, {
      symbol: sym,
      name,
      kind,
      note: '',
      alerts: { stanceChange: true, filingRefresh: true, movePct: 5 },
    });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    commit(res.items);
    setSymbol('');
  }

  function toggleAlert(id: string, key: keyof WatchlistItem['alerts'], value: boolean | number) {
    const item = items.find((w) => w.id === id);
    if (!item) return;
    const next = items.map((w) =>
      w.id === id ? { ...w, alerts: { ...w.alerts, [key]: value } } : w
    );
    commit(next);
  }

  return (
    <div className="watchlist-panel">
      <div className="watchlist-panel-head">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#0052d9]" strokeWidth={2} />
          <div>
            <h2 className="text-lg font-bold text-slate-900">Watchlist & alerts</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {items.length} / {limit} slots · {PLANS[plan].name} plan · {syncLabel}
            </p>
          </div>
        </div>
        <Link href="/pricing" className="text-xs font-semibold text-[#0052d9] hover:underline shrink-0">
          Upgrade slots →
        </Link>
      </div>

      <form onSubmit={handleAdd} className="watchlist-add-form">
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as WatchlistKind)}
          className="watchlist-select"
          aria-label="Asset kind"
        >
          <option value="equity">US equity / ETF</option>
          <option value="private">Private desk</option>
          <option value="crypto">Crypto</option>
        </select>
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder={kind === 'private' ? 'anduril, stripe, openai…' : 'AAPL, SPCX, BTC…'}
          className="watchlist-input"
          aria-label="Symbol"
        />
        <button type="submit" className="btn-primary text-sm !py-2.5 !px-4 shrink-0" disabled={items.length >= limit}>
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add
        </button>
      </form>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <p className="text-[11px] text-slate-400 mb-4">
        Alerts fire on stance changes, filing refreshes, and cached move thresholds when you re-convene
        the desk. Not live market data. Not a buy button.
      </p>

      {items.length === 0 ? (
        <div className="watchlist-empty">
          <TrendingUp className="h-8 w-8 text-slate-300 mx-auto mb-2" strokeWidth={1.5} />
          <p className="text-sm text-slate-500 text-center">
            Add AAPL, NVDA, SPACEX, or BTC. Sign in to sync alerts across devices.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((w) => (
            <li key={w.id} className="watchlist-row">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{w.symbol}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{w.kind}</span>
                </div>
                <div className="text-xs text-slate-500 truncate">{w.name}</div>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <label className="watchlist-toggle">
                  <input
                    type="checkbox"
                    checked={w.alerts.stanceChange}
                    onChange={(e) => toggleAlert(w.id, 'stanceChange', e.target.checked)}
                  />
                  Stance
                </label>
                <label className="watchlist-toggle">
                  <input
                    type="checkbox"
                    checked={w.alerts.filingRefresh}
                    onChange={(e) => toggleAlert(w.id, 'filingRefresh', e.target.checked)}
                  />
                  Filing
                </label>
                <select
                  value={w.alerts.movePct}
                  onChange={(e) => toggleAlert(w.id, 'movePct', Number(e.target.value))}
                  className="watchlist-select-sm"
                  aria-label="Move threshold"
                >
                  <option value={0}>Move off</option>
                  <option value={3}>±3%</option>
                  <option value={5}>±5%</option>
                  <option value={10}>±10%</option>
                </select>
                <button
                  type="button"
                  onClick={() => commit(items.filter((row) => row.id !== w.id))}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  aria-label={`Remove ${w.symbol}`}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
