import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { EMAIL_COOKIE, normalizeEmail, PLAN_COOKIE, PLAN_COOKIE_MAX_AGE } from '@/lib/demo-session';
import { TRIAL_COOKIE } from '@/lib/desk-trial';
import {
  findPaidWaffoSeatGraphQL,
  parseWaffoSku,
  skuToPlan,
  waffoClient,
  waffoConfigured,
  waffoTestUnlock,
} from '@/lib/waffo';
import { findPaidWaffoSeatLedger } from '@/lib/billing/waffo-ledger';
import { extraCreditBalance } from '@/lib/billing/extra-credits';
import { findPaidWaffoExtraGraphQL, parseWaffoExtraSku } from '@/lib/waffo-extras';

export async function POST(request: Request) {
  if (!waffoClient()) {
    return NextResponse.json(
      { error: 'Waffo credentials are missing on this server.' },
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
  if (!email.includes('@')) {
    return NextResponse.json({ error: 'Need the email you used at checkout.' }, { status: 400 });
  }
  const extraSku = parseWaffoExtraSku(body.sku);
  if (extraSku) {
    let balance = await extraCreditBalance(email);
    if (balance.granted <= 0) {
      try {
        const gql = await findPaidWaffoExtraGraphQL({ email, sku: extraSku });
        if (gql) balance = { ...balance, granted: gql.runs, remaining: Math.max(0, gql.runs - balance.used) };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Could not read Waffo.';
        return NextResponse.json({ error: message }, { status: 400 });
      }
    }
    if (balance.granted <= 0) {
      return NextResponse.json(
        {
          error:
            'No paid extra pack for that email yet. Card approval can take a few seconds — wait, then try again.',
        },
        { status: 404 }
      );
    }
    const jar = await cookies();
    jar.set(EMAIL_COOKIE, encodeURIComponent(balance.email), {
      path: '/',
      maxAge: PLAN_COOKIE_MAX_AGE,
      sameSite: 'lax',
    });
    return NextResponse.json({
      ok: true,
      kind: 'extra',
      sku: extraSku,
      email: balance.email,
      remaining: balance.remaining,
      granted: balance.granted,
    });
  }

  if (!waffoConfigured()) {
    return NextResponse.json(
      { error: 'Waffo product IDs are missing on this server.' },
      { status: 503 }
    );
  }

  const sku = parseWaffoSku(body.sku);

  // 1) Webhook ledger (Supabase) — authoritative once events land.
  let seat = null;
  try {
    seat = await findPaidWaffoSeatLedger({ email, sku, allowTest: waffoTestUnlock() });
  } catch {
    seat = null;
  }

  // 2) GraphQL fallback — exact external-ref proof of payment.
  if (!seat && sku) {
    try {
      seat = await findPaidWaffoSeatGraphQL({ email, sku });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not read Waffo.';
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  if (!seat) {
    return NextResponse.json(
      {
        error:
          'No paid Waffo seat for that email yet. Card approval can take a few seconds — wait, then try again.',
      },
      { status: 404 }
    );
  }

  const plan = skuToPlan(seat.sku);
  const jar = await cookies();
  jar.set(PLAN_COOKIE, plan, { path: '/', maxAge: PLAN_COOKIE_MAX_AGE, sameSite: 'lax' });
  jar.set(EMAIL_COOKIE, encodeURIComponent(seat.email), {
    path: '/',
    maxAge: PLAN_COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
  jar.set(TRIAL_COOKIE, '', { path: '/', maxAge: 0, sameSite: 'lax' });

  return NextResponse.json({ ok: true, plan, email: seat.email, sku: seat.sku });
}
