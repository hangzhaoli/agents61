import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { EMAIL_COOKIE, normalizeEmail, PLAN_COOKIE, PLAN_COOKIE_MAX_AGE } from '@/lib/demo-session';
import { TRIAL_COOKIE } from '@/lib/desk-trial';
import { findPaidLemonSeat, lemonConfigured, parseLemonSku } from '@/lib/lemon-squeezy';

export async function POST(request: Request) {
  if (!lemonConfigured()) {
    return NextResponse.json(
      { error: 'Lemon Squeezy is not live until API credentials are set.' },
      { status: 503 }
    );
  }

  let body: { email?: string; sku?: string } = {};
  try {
    body = (await request.json()) as { email?: string; sku?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = normalizeEmail(body.email ?? '');
  const sku = parseLemonSku(body.sku);
  let seat;
  try {
    seat = await findPaidLemonSeat({ email, sku });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not read Lemon Squeezy.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
  if (!seat) {
    return NextResponse.json(
      { error: 'No paid Lemon Squeezy seat for that email yet. Wait a few seconds after checkout and try again.' },
      { status: 404 }
    );
  }

  const jar = await cookies();
  jar.set(PLAN_COOKIE, seat.plan, { path: '/', maxAge: PLAN_COOKIE_MAX_AGE, sameSite: 'lax' });
  jar.set(EMAIL_COOKIE, encodeURIComponent(seat.email), {
    path: '/',
    maxAge: PLAN_COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
  jar.set(TRIAL_COOKIE, '', { path: '/', maxAge: 0, sameSite: 'lax' });

  return NextResponse.json({ ok: true, plan: seat.plan, email: seat.email, sku: seat.sku });
}
