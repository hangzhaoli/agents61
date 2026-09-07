import { parsePlan, type PlanId } from '@/lib/tiers';
import { PLAN_COOKIE } from '@/lib/demo-session';
import { cookies } from 'next/headers';

export { syncUserEmail } from '@/lib/sync/session';

export async function syncUserPlan(): Promise<PlanId> {
  const jar = await cookies();
  return parsePlan(jar.get(PLAN_COOKIE)?.value);
}
