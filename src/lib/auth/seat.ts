import { findPaidWaffoSeatLedger } from '@/lib/billing/waffo-ledger';
import { DEMO_PLAN, isDemoEmail, normalizeEmail } from '@/lib/demo-session';
import { isPaidPlan, type PlanId } from '@/lib/tiers';
import { waffoTestUnlock } from '@/lib/waffo';

export async function resolveDeskPlan(email: string): Promise<PlanId> {
  const normalized = normalizeEmail(email);
  if (!normalized.includes('@')) return 'observer';
  if (isDemoEmail(normalized)) return DEMO_PLAN;
  try {
    const seat = await findPaidWaffoSeatLedger({
      email: normalized,
      allowTest: waffoTestUnlock(),
    });
    if (seat) return seat.plan;
  } catch {
    /* ledger down — unpaid until confirm */
  }
  return 'observer';
}

export function checkoutAfterRegister(planRaw?: string | null): string {
  if (planRaw === 'founding') return '/checkout/waffo?plan=founding&interval=yearly';
  if (isPaidPlan(planRaw)) return `/checkout/waffo?plan=${planRaw}`;
  return '/dashboard?entry=analyze';
}
