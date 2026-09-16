/**
 * Client-side cloud sync for watchlist + strategy vault.
 * Falls back silently when not logged in or Supabase is unavailable.
 */

import type { VaultStrategy } from '@/lib/quant-lab/types';
import type { WatchlistItem } from '@/lib/watchlist';
import type { PredictionSave } from '@/lib/prediction/types';
import { EMAIL_COOKIE, readClientCookie } from '@/lib/demo-session';

export type CloudSyncState = 'idle' | 'syncing' | 'synced' | 'local-only' | 'error';

function loggedIn(): boolean {
  return Boolean(readClientCookie(EMAIL_COOKIE));
}

async function parseJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function pullWatchlist(): Promise<WatchlistItem[] | null> {
  if (!loggedIn()) return null;
  try {
    const res = await fetch('/api/sync/watchlist', { cache: 'no-store' });
    if (res.status === 401 || res.status === 503) return null;
    const data = await parseJson<{ items?: WatchlistItem[]; error?: string }>(res);
    if (!res.ok || !data?.items) return null;
    return data.items;
  } catch {
    return null;
  }
}

export async function pushWatchlist(items: WatchlistItem[]): Promise<boolean> {
  if (!loggedIn()) return false;
  try {
    const res = await fetch('/api/sync/watchlist', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function pullVault(): Promise<VaultStrategy[] | null> {
  if (!loggedIn()) return null;
  try {
    const res = await fetch('/api/sync/vault', { cache: 'no-store' });
    if (res.status === 401 || res.status === 503) return null;
    const data = await parseJson<{ items?: VaultStrategy[] }>(res);
    if (!res.ok || !data?.items) return null;
    return data.items;
  } catch {
    return null;
  }
}

export async function pushVault(items: VaultStrategy[]): Promise<boolean> {
  if (!loggedIn()) return false;
  try {
    const res = await fetch('/api/sync/vault', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteVaultItem(id: string): Promise<boolean> {
  if (!loggedIn()) return false;
  try {
    const res = await fetch(`/api/sync/vault?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

/** Pull cloud → local, or push local → cloud when cloud is empty. */
export async function hydrateWatchlist(
  local: WatchlistItem[],
  writeLocal: (items: WatchlistItem[]) => void
): Promise<CloudSyncState> {
  if (!loggedIn()) return 'local-only';
  const cloud = await pullWatchlist();
  if (cloud === null) return 'local-only';
  if (cloud.length > 0) {
    writeLocal(cloud);
    return 'synced';
  }
  if (local.length > 0) {
    const ok = await pushWatchlist(local);
    return ok ? 'synced' : 'error';
  }
  return 'synced';
}

export async function hydrateVault(
  local: VaultStrategy[],
  writeLocal: (items: VaultStrategy[]) => void
): Promise<CloudSyncState> {
  if (!loggedIn()) return 'local-only';
  const cloud = await pullVault();
  if (cloud === null) return 'local-only';
  if (cloud.length > 0) {
    writeLocal(cloud);
    return 'synced';
  }
  if (local.length > 0) {
    const ok = await pushVault(local);
    return ok ? 'synced' : 'error';
  }
  return 'synced';
}

export async function pullPredictionSaves(): Promise<PredictionSave[] | null> {
  if (!loggedIn()) return null;
  try {
    const res = await fetch('/api/sync/prediction', { cache: 'no-store' });
    if (res.status === 401 || res.status === 503) return null;
    const data = await parseJson<{ items?: PredictionSave[] }>(res);
    if (!res.ok || !data?.items) return null;
    return data.items;
  } catch {
    return null;
  }
}

export async function pushPredictionSaves(items: PredictionSave[]): Promise<boolean> {
  if (!loggedIn()) return false;
  try {
    const res = await fetch('/api/sync/prediction', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function hydratePredictionSaves(
  local: PredictionSave[],
  writeLocal: (items: PredictionSave[]) => void
): Promise<CloudSyncState> {
  if (!loggedIn()) return 'local-only';
  const cloud = await pullPredictionSaves();
  if (cloud === null) return 'local-only';
  if (cloud.length > 0) {
    writeLocal(cloud);
    return 'synced';
  }
  if (local.length > 0) {
    const ok = await pushPredictionSaves(local);
    return ok ? 'synced' : 'error';
  }
  return 'synced';
}
