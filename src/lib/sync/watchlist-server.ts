import { supabaseAdmin, supabaseConfigured } from '@/lib/supabase/admin';
import { syncUserEmail, syncUserPlan } from '@/lib/sync/auth';
import { watchlistItemToRow, watchlistRowToItem } from '@/lib/sync/watchlist-map';
import { alertLimitForPlan } from '@/lib/tiers';
import type { WatchlistItem } from '@/lib/watchlist';

export async function getWatchlistForUser(email: string): Promise<WatchlistItem[]> {
  const db = supabaseAdmin();
  if (!db) throw new Error('SUPABASE_UNAVAILABLE');
  const { data, error } = await db
    .from('desk_watchlist_items')
    .select('client_id, symbol, name, kind, note, alerts, added_at, updated_at')
    .eq('user_email', email)
    .order('added_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => watchlistRowToItem(row));
}

export async function replaceWatchlistForUser(email: string, items: WatchlistItem[]): Promise<WatchlistItem[]> {
  const db = supabaseAdmin();
  if (!db) throw new Error('SUPABASE_UNAVAILABLE');

  const plan = await syncUserPlan();
  const limit = alertLimitForPlan(plan);
  if (items.length > limit) {
    throw new Error(`WATCHLIST_LIMIT:${limit}`);
  }

  const rows = items.map((item) => watchlistItemToRow(email, item));

  const { error: delErr } = await db.from('desk_watchlist_items').delete().eq('user_email', email);
  if (delErr) throw delErr;

  if (rows.length === 0) return [];

  const { error: insErr } = await db.from('desk_watchlist_items').insert(rows);
  if (insErr) throw insErr;

  return getWatchlistForUser(email);
}

export async function requireWatchlistUser(): Promise<string> {
  const email = await syncUserEmail();
  if (!email) throw new Error('UNAUTHORIZED');
  if (!supabaseConfigured()) throw new Error('SUPABASE_UNAVAILABLE');
  return email;
}
