import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { EMAIL_COOKIE, PLAN_COOKIE, PLAN_COOKIE_MAX_AGE } from '@/lib/demo-session';
import { TRIAL_COOKIE } from '@/lib/desk-trial';
import { readIntent, skuToPlan, usdtChain, verifyIncomingUsdt } from '@/lib/usdt-billing';

export async function POST(request: Request) {
  let body: { token?: string; txid?: string } = {};
  try {
    body = (await request.json()) as { token?: string; txid?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const intent = body.token ? readIntent(body.token) : null;
  if (!intent) {
    return NextResponse.json({ error: 'Invoice expired. Generate a new QR.' }, { status: 400 });
  }

  if (usdtChain() !== 'trc20') {
    return NextResponse.json(
      { error: 'Auto-unlock is wired for USDT-TRC20 only. Switch USDT_CHAIN=trc20.' },
      { status: 400 }
    );
  }

  const check = await verifyIncomingUsdt({ txid: body.txid ?? '', expectedAmount: intent.amount });
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  const plan = skuToPlan(intent.sku);
  const jar = await cookies();
  jar.set(PLAN_COOKIE, plan, { path: '/', maxAge: PLAN_COOKIE_MAX_AGE, sameSite: 'lax' });
  jar.set(EMAIL_COOKIE, encodeURIComponent(intent.email), {
    path: '/',
    maxAge: PLAN_COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
  jar.set(TRIAL_COOKIE, '', { path: '/', maxAge: 0, sameSite: 'lax' });

  return NextResponse.json({
    ok: true,
    plan,
    email: intent.email,
    sku: intent.sku,
  });
}
