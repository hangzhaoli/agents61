import { cookies } from 'next/headers';
import { isPaidPlan, type PaidPlanId } from '@/lib/tiers';
import { PLAN_COOKIE, PLAN_COOKIE_MAX_AGE } from '@/lib/demo-session';
import { TRIAL_COOKIE } from '@/lib/desk-trial';
import { PRED_TRIAL_COOKIE } from '@/lib/prediction/entitlement';

export async function POST(request: Request) {
  let body: { plan?: string } = {};
  try {
    body = (await request.json()) as { plan?: string };
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!isPaidPlan(body.plan)) {
    return Response.json({ error: 'Pick a paid desk.' }, { status: 400 });
  }

  const plan = body.plan as PaidPlanId;
  const jar = await cookies();
  jar.set(PLAN_COOKIE, plan, {
    path: '/',
    maxAge: PLAN_COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
  jar.set(TRIAL_COOKIE, '', { path: '/', maxAge: 0, sameSite: 'lax' });
  jar.set(PRED_TRIAL_COOKIE, '', { path: '/', maxAge: 0, sameSite: 'lax' });

  return Response.json({ ok: true, plan });
}
