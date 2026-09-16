import { NextResponse } from 'next/server';
import { resolveImportedMarket } from '@/lib/prediction/url-import';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: { url?: string } = {};
  try {
    body = (await request.json()) as { url?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const url = body.url?.trim();
  if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

  if (/kalshi\.com/i.test(url)) {
    return NextResponse.json(
      { error: 'Kalshi import is stubbed — Polymarket URLs only for now.' },
      { status: 501 }
    );
  }

  const market = await resolveImportedMarket(url);
  if (!market) {
    return NextResponse.json(
      { error: 'Could not resolve that Polymarket URL. Try an /event/… or /market/… link.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ id: market.id, market });
}
