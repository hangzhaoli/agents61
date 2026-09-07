import { NextResponse } from 'next/server';
import { normalizeEmail } from '@/lib/demo-session';
import {
  createLemonCheckout,
  lemonConfigured,
  parseInterval,
  parseLemonSku,
} from '@/lib/lemon-squeezy';

export async function POST(request: Request) {
  if (!lemonConfigured()) {
    return NextResponse.json(
      {
        error:
          'Lemon Squeezy is wired but not live. Set API key, store ID, and variant IDs after the store is approved — or while you wait in Test mode.',
      },
      { status: 503 }
    );
  }

  let body: { sku?: string; interval?: string; email?: string } = {};
  try {
    body = (await request.json()) as { sku?: string; interval?: string; email?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const sku = parseLemonSku(body.sku);
  if (!sku) {
    return NextResponse.json({ error: 'Pick a paid desk.' }, { status: 400 });
  }
  const email = normalizeEmail(body.email ?? '');
  if (!email.includes('@')) {
    return NextResponse.json({ error: 'Need a valid email for checkout.' }, { status: 400 });
  }

  try {
    const url = await createLemonCheckout({
      sku,
      interval: sku === 'founding' ? 'yearly' : parseInterval(body.interval),
      email,
    });
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not create checkout.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
