import { cookies } from 'next/headers';
import { EMAIL_COOKIE, isDemoEmail, PLAN_COOKIE, PLAN_COOKIE_MAX_AGE } from '@/lib/demo-session';
import { TRIAL_COOKIE } from '@/lib/desk-trial';
import { isPaidPlan, type PlanId } from '@/lib/tiers';

export async function writeDeskAuthCookies(email: string, plan: PlanId) {
  const jar = await cookies();
  jar.set(PLAN_COOKIE, plan, { path: '/', maxAge: PLAN_COOKIE_MAX_AGE, sameSite: 'lax' });
  jar.set(EMAIL_COOKIE, encodeURIComponent(email), {
    path: '/',
    maxAge: PLAN_COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
  if (isPaidPlan(plan) || isDemoEmail(email)) {
    jar.set(TRIAL_COOKIE, '', { path: '/', maxAge: 0, sameSite: 'lax' });
  }
}

export async function clearDeskAuthCookies() {
  const jar = await cookies();
  jar.set(PLAN_COOKIE, '', { path: '/', maxAge: 0, sameSite: 'lax' });
  jar.set(EMAIL_COOKIE, '', { path: '/', maxAge: 0, sameSite: 'lax' });
}
