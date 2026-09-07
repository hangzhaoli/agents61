import { NextResponse } from 'next/server';
import { normalizeEmail } from '@/lib/demo-session';
import {
  createNowInvoice,
  createNowSubscription,
  nowConfigured,
  parseNowInterval,
  parseNowSku,
} from '@/lib/nowpayments';

export async function POST(request: Request) {
  if (!nowConfigured()) {
    return NextResponse.json(
      {
        error:
          'NOWPayments is wired but not live. Set NOWPAYMENTS_API_KEY (and IPN secret) in the dashboard, then redeploy.',
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

  const sku = parseNowSku(body.sku);
  if (!sku) {
    return NextResponse.json({ error: 'Pick a paid desk.' }, { status: 400 });
  }
  const email = normalizeEmail(body.email ?? '');
  if (!email.includes('@')) {
    return NextResponse.json({ error: 'Need a valid email for checkout.' }, { status: 400 });
  }
  const interval = sku === 'founding' ? 'yearly' : parseNowInterval(body.interval);

  try {
    const sub = await createNowSubscription({ sku, interval, email });
    if (sub?.url) return NextResponse.json({ url: sub.url, mode: 'subscription' });
    const invoice = await createNowInvoice({ sku, interval, email });
    return NextResponse.json({ url: invoice.url, mode: 'invoice', invoiceId: invoice.invoiceId });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not create NOWPayments invoice.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
