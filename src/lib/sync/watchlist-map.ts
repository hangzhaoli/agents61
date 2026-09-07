import type { WatchlistItem } from '@/lib/watchlist';

type WatchlistRow = {
  client_id: string;
  symbol: string;
  name: string;
  kind: WatchlistItem['kind'];
  note: string;
  alerts: WatchlistItem['alerts'];
  added_at: string;
  updated_at: string;
};

export function watchlistRowToItem(row: WatchlistRow): WatchlistItem {
  return {
    id: row.client_id,
    symbol: row.symbol,
    name: row.name,
    kind: row.kind,
    note: row.note ?? '',
    alerts: row.alerts ?? { stanceChange: true, filingRefresh: true, movePct: 5 },
    addedAt: row.added_at,
  };
}

export function watchlistItemToRow(email: string, item: WatchlistItem): WatchlistRow & { user_email: string } {
  const now = new Date().toISOString();
  return {
    user_email: email,
    client_id: item.id,
    symbol: item.symbol.toUpperCase(),
    name: item.name,
    kind: item.kind,
    note: item.note ?? '',
    alerts: item.alerts,
    added_at: item.addedAt || now,
    updated_at: now,
  };
}
