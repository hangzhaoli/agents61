import { NextResponse } from 'next/server';
import { writeDeskAuthCookies } from '@/lib/auth/desk-cookies';
import { resolveDeskPlan } from '@/lib/auth/seat';
import { DEMO_TICKER, isDemoEmail } from '@/lib/demo-session';
import { isPaidPlan } from '@/lib/tiers';
import { syncUserEmail, syncUserPlan } from '@/lib/sync/auth';

export async function GET() {
  const email = await syncUserEmail();
  if (!email) return NextResponse.json({ email: null, plan: null });

  let plan = await syncUserPlan();
  if (!isPaidPlan(plan) && !isDemoEmail(email)) {
    const resolved = await resolveDeskPlan(email);
    if (isPaidPlan(resolved) || resolved !== plan) {
      plan = resolved;
      await writeDeskAuthCookies(email, plan);
    }
  }

  return NextResponse.json({ email, plan, ticker: DEMO_TICKER });
}
