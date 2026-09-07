import { isPaidPlan, type PaidPlanId } from '@/lib/tiers';

export type UsdtSku = PaidPlanId | 'founding';

export const USDT_YEARLY: Record<PaidPlanId, number> = {
  analyst: 169,
  associate: 429,
  principal: 699,
  committee: 1290,
  partners: 2990,
};

export const USDT_FOUNDING_YEARLY = 1190;

export function parseUsdtSku(raw: string | null | undefined): UsdtSku | null {
  if (raw === 'founding') return 'founding';
  if (isPaidPlan(raw)) return raw;
  return null;
}

export function skuToPlan(sku: UsdtSku): PaidPlanId {
  return sku === 'founding' ? 'committee' : sku;
}

export function yearlyUsdt(sku: UsdtSku): number {
  return sku === 'founding' ? USDT_FOUNDING_YEARLY : USDT_YEARLY[sku];
}
