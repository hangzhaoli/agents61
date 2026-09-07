import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { EMAIL_COOKIE, normalizeEmail, PLAN_COOKIE } from '@/lib/demo-session';
import { TRIAL_COOKIE } from '@/lib/desk-trial';
import {
  cookieMaxAge,
  findNowPayment,
  getNowPayment,
  nowConfigured,
  paidStatus,
  parseNowInterval,
  parseNowSku,
  parseOrder,
  skuToPlan,
} from '@/lib/nowpayments';

export async function POST(request: Request) {
  if (!nowConfigured()) {
    return NextResponse.json(
      { error: 'NOWPayments is not live until NOWPAYMENTS_API_KEY is set.' },
      { status: 503 }
    );
  }

  let body: { email?: string; sku?: string; interval?: string; paymentId?: string } = {};
  try {
    body = (await request.json()) as {
      email?: string;
      sku?: string;
      interval?: string;
      paymentId?: string;
    };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = normalizeEmail(body.email ?? '');
  const sku = parseNowSku(body.sku);
  if (!sku || !email.includes('@')) {
    return NextResponse.json({ error: 'Need the same email and desk you paid for.' }, { status: 400 });
  }
  const interval = sku === 'founding' ? 'yearly' : parseNowInterval(body.interval);

  try {
    const payment = body.paymentId?.trim()
      ? await getNowPayment(body.paymentId.trim())
      : await findNowPayment({ sku, interval, email });
    if (!payment || !paidStatus(payment.payment_status)) {
      return NextResponse.json(
        { error: 'No finished NOWPayments invoice for that email yet. Wait a minute after paying, then confirm.' },
        { status: 404 }
      );
    }
    const order = parseOrder(payment.order_id, payment.order_description) ?? { sku, interval, email };
    if (normalizeEmail(order.email) !== email) {
      return NextResponse.json({ error: 'That payment belongs to a different email.' }, { status: 403 });
    }
    const plan = skuToPlan(order.sku);
    const maxAge = cookieMaxAge(order.interval);
    const jar = await cookies();
    jar.set(PLAN_COOKIE, plan, { path: '/', maxAge, sameSite: 'lax' });
    jar.set(EMAIL_COOKIE, encodeURIComponent(email), { path: '/', maxAge, sameSite: 'lax' });
    jar.set(TRIAL_COOKIE, '', { path: '/', maxAge: 0, sameSite: 'lax' });
    return NextResponse.json({ ok: true, plan, email, sku: order.sku, interval: order.interval });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not read NOWPayments.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
