/**
 * Client-side watchlist + filing/stance alerts. Stored in localStorage per browser.
 * Not a live quote product. Alert limits follow plan tier.
 */

import type { PlanId } from '@/lib/tiers';
import { alertLimitForPlan } from '@/lib/tiers';

export type WatchlistKind = 'equity' | 'crypto' | 'private';

export type WatchlistItem = {
  id: string;
  symbol: string;
  name: string;
  kind: WatchlistKind;
  addedAt: string;
  /** User note — e.g. "watch after earnings" */
  note: string;
  alerts: {
    stanceChange: boolean;
    filingRefresh: boolean;
    /** Cached price move threshold (percent). 0 = off */
    movePct: number;
  };
};

const STORAGE_KEY = 'agents61_watchlist';

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function readWatchlist(): WatchlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WatchlistItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeWatchlist(items: WatchlistItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('agents61-watchlist'));
  } catch {
    /* private mode */
  }
}

export function watchlistLimit(plan: PlanId): number {
  return alertLimitForPlan(plan);
}

export function canAddWatchlist(plan: PlanId, current: WatchlistItem[]): boolean {
  return current.length < watchlistLimit(plan);
}

export function addWatchlistItem(
  plan: PlanId,
  item: Omit<WatchlistItem, 'id' | 'addedAt'>
): { ok: true; items: WatchlistItem[] } | { ok: false; error: string } {
  const current = readWatchlist();
  if (!canAddWatchlist(plan, current)) {
    return { ok: false, error: `Watchlist full for ${plan} — upgrade for more alerts.` };
  }
  const dup = current.find(
    (w) => w.symbol === item.symbol.toUpperCase() && w.kind === item.kind
  );
  if (dup) return { ok: false, error: `${item.symbol} is already on the watchlist.` };
  const next: WatchlistItem = {
    ...item,
    id: uid(),
    addedAt: new Date().toISOString(),
    symbol: item.symbol.toUpperCase(),
  };
  const items = [...current, next];
  writeWatchlist(items);
  return { ok: true, items };
}

export function removeWatchlistItem(id: string): WatchlistItem[] {
  const items = readWatchlist().filter((w) => w.id !== id);
  writeWatchlist(items);
  return items;
}

export function updateWatchlistItem(id: string, patch: Partial<WatchlistItem>): WatchlistItem[] {
  const items = readWatchlist().map((w) => (w.id === id ? { ...w, ...patch } : w));
  writeWatchlist(items);
  return items;
}
