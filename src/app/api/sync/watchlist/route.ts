import {
  getWatchlistForUser,
  replaceWatchlistForUser,
  requireWatchlistUser,
} from '@/lib/sync/watchlist-server';
import type { WatchlistItem } from '@/lib/watchlist';

function mapError(err: unknown): Response {
  const msg = err instanceof Error ? err.message : 'Sync failed';
  if (msg === 'UNAUTHORIZED') {
    return Response.json({ error: 'Sign in to sync watchlist.' }, { status: 401 });
  }
  if (msg === 'SUPABASE_UNAVAILABLE') {
    return Response.json({ error: 'Cloud sync unavailable.' }, { status: 503 });
  }
  if (msg.startsWith('WATCHLIST_LIMIT:')) {
    const limit = msg.split(':')[1];
    return Response.json({ error: `Watchlist limit (${limit}) exceeded.` }, { status: 400 });
  }
  console.error('[sync/watchlist]', err);
  return Response.json({ error: 'Watchlist sync failed.' }, { status: 500 });
}

function parseItems(raw: unknown): WatchlistItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (w): w is WatchlistItem =>
      w != null &&
      typeof w === 'object' &&
      typeof (w as WatchlistItem).id === 'string' &&
      typeof (w as WatchlistItem).symbol === 'string' &&
      typeof (w as WatchlistItem).kind === 'string'
  );
}

export async function GET() {
  try {
    const email = await requireWatchlistUser();
    const items = await getWatchlistForUser(email);
    return Response.json({ items });
  } catch (err) {
    return mapError(err);
  }
}

export async function PUT(request: Request) {
  let body: { items?: unknown } = {};
  try {
    body = (await request.json()) as { items?: unknown };
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    const email = await requireWatchlistUser();
    const items = parseItems(body.items);
    const saved = await replaceWatchlistForUser(email, items);
    return Response.json({ items: saved });
  } catch (err) {
    return mapError(err);
  }
}
