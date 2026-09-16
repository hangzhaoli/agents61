import {
  deletePredictionSaveForUser,
  getPredictionSavesForUser,
  parsePredictionSaves,
  replacePredictionSavesForUser,
  requirePredictionUser,
} from '@/lib/prediction/saves-server';

function mapError(err: unknown): Response {
  const msg = err instanceof Error ? err.message : 'Sync failed';
  if (msg === 'UNAUTHORIZED') {
    return Response.json({ error: 'Sign in to sync prediction saves.' }, { status: 401 });
  }
  if (msg === 'SUPABASE_UNAVAILABLE') {
    return Response.json({ error: 'Cloud sync unavailable.' }, { status: 503 });
  }
  if (msg.startsWith('PRED_SAVE_LIMIT:')) {
    const limit = msg.split(':')[1];
    return Response.json({ error: `Save limit (${limit}) exceeded.` }, { status: 400 });
  }
  console.error('[sync/prediction]', err);
  return Response.json({ error: 'Prediction sync failed.' }, { status: 500 });
}

export async function GET() {
  try {
    const email = await requirePredictionUser();
    const items = await getPredictionSavesForUser(email);
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
    const email = await requirePredictionUser();
    const items = parsePredictionSaves(body.items);
    const saved = await replacePredictionSavesForUser(email, items);
    return Response.json({ items: saved });
  } catch (err) {
    return mapError(err);
  }
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get('id')?.trim();
  if (!id) {
    return Response.json({ error: 'Missing id.' }, { status: 400 });
  }

  try {
    const email = await requirePredictionUser();
    const items = await deletePredictionSaveForUser(email, id);
    return Response.json({ items });
  } catch (err) {
    return mapError(err);
  }
}
