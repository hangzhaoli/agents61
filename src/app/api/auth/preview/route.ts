import { NextResponse } from 'next/server';
import { writeDeskAuthCookies } from '@/lib/auth/desk-cookies';
import { resolveDeskPlan } from '@/lib/auth/seat';
import { DEMO_EMAIL, DEMO_TICKER } from '@/lib/demo-session';

/** Preview desk without exposing the demo password in the page. */
export async function POST() {
  const plan = await resolveDeskPlan(DEMO_EMAIL);
  await writeDeskAuthCookies(DEMO_EMAIL, plan);
  return NextResponse.json({ email: DEMO_EMAIL, plan, ticker: DEMO_TICKER, demo: true });
}
