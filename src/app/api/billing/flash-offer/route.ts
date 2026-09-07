import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  encodeFlashCookie,
  FLASH_OFFER_COOKIE,
  FLASH_OFFER_ID,
  FLASH_OFFER_PERCENT,
  FLASH_OFFER_TTL_MS,
  parseFlashCookie,
} from '@/lib/flash-offer';
import { isPaidPlan } from '@/lib/tiers';
import { PLAN_COOKIE } from '@/lib/demo-session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const jar = await cookies();
  const plan = jar.get(PLAN_COOKIE)?.value;
  if (isPaidPlan(plan)) {
    return NextResponse.json({ active: false, eligible: false, reason: 'already_paid' });
  }
  const state = parseFlashCookie(jar.get(FLASH_OFFER_COOKIE)?.value);
  if (!state) {
    return NextResponse.json({
      active: false,
      eligible: true,
      percentOff: FLASH_OFFER_PERCENT,
      ttlMs: FLASH_OFFER_TTL_MS,
    });
  }
  return NextResponse.json({
    active: true,
    eligible: true,
    id: state.id,
    percentOff: state.percentOff,
    expiresAt: state.expiresAt,
    remainingMs: Math.max(0, state.expiresAt - Date.now()),
  });
}

/** Claim the 30-minute 15% window. Idempotent while still active. */
export async function POST() {
  const jar = await cookies();
  const plan = jar.get(PLAN_COOKIE)?.value;
  if (isPaidPlan(plan)) {
    return NextResponse.json({ error: 'Paid desks already unlock full seating.' }, { status: 400 });
  }

  const existing = parseFlashCookie(jar.get(FLASH_OFFER_COOKIE)?.value);
  if (existing) {
    return NextResponse.json({
      ok: true,
      id: existing.id,
      percentOff: existing.percentOff,
      expiresAt: existing.expiresAt,
      remainingMs: Math.max(0, existing.expiresAt - Date.now()),
    });
  }

  const expiresAt = Date.now() + FLASH_OFFER_TTL_MS;
  jar.set(FLASH_OFFER_COOKIE, encodeFlashCookie(expiresAt), {
    path: '/',
    maxAge: Math.ceil(FLASH_OFFER_TTL_MS / 1000),
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return NextResponse.json({
    ok: true,
    id: FLASH_OFFER_ID,
    percentOff: FLASH_OFFER_PERCENT,
    expiresAt,
    remainingMs: FLASH_OFFER_TTL_MS,
  });
}
