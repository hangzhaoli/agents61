import {
  deleteVaultItemForUser,
  getVaultForUser,
  parseVaultItems,
  replaceVaultForUser,
  requireVaultUser,
} from '@/lib/sync/vault-server';

function mapError(err: unknown): Response {
  const msg = err instanceof Error ? err.message : 'Sync failed';
  if (msg === 'UNAUTHORIZED') {
    return Response.json({ error: 'Sign in to sync vault.' }, { status: 401 });
  }
  if (msg === 'SUPABASE_UNAVAILABLE') {
    return Response.json({ error: 'Cloud sync unavailable.' }, { status: 503 });
  }
  if (msg.startsWith('VAULT_LIMIT:')) {
    const limit = msg.split(':')[1];
    return Response.json({ error: `Vault limit (${limit}) exceeded.` }, { status: 400 });
  }
  console.error('[sync/vault]', err);
  return Response.json({ error: 'Vault sync failed.' }, { status: 500 });
}

export async function GET() {
  try {
    const email = await requireVaultUser();
    const items = await getVaultForUser(email);
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
    const email = await requireVaultUser();
    const items = parseVaultItems(body.items);
    const saved = await replaceVaultForUser(email, items);
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
    const email = await requireVaultUser();
    const items = await deleteVaultItemForUser(email, id);
    return Response.json({ items });
  } catch (err) {
    return mapError(err);
  }
}
