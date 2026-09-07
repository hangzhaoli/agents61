/**
 * Desk flash offer: real 15% off for 30 minutes after claim.
 * Applied at Waffo checkout via priceSnapshot — not a fake badge.
 */

import type { PaidPlanId } from '@/lib/tiers';
import type { WaffoInterval, WaffoSku } from '@/lib/waffo';

export const FLASH_OFFER_ID = 'flash15';
export const FLASH_OFFER_PERCENT = 15;
export const FLASH_OFFER_TTL_MS = 30 * 60 * 1000;
/** Show the activate popup within this window after landing, if they scrolled without searching. */
export const FLASH_PROMPT_WITHIN_MS = 30 * 1000;
export const FLASH_OFFER_COOKIE = 'agents61_flash15';
export const FLASH_PROMPT_KEY = 'agents61_flash15_prompted';

/** List prices matching Waffo catalog (USD display strings). */
export const LIST_PRICE_USD: Record<
  Exclude<WaffoSku, 'founding'> | 'founding',
  { monthly?: string; yearly: string }
> = {
  analyst: { monthly: '19.00', yearly: '169.00' },
  associate: { monthly: '49.00', yearly: '429.00' },
  principal: { monthly: '79.00', yearly: '699.00' },
  committee: { monthly: '149.00', yearly: '1290.00' },
  partners: { monthly: '349.00', yearly: '2990.00' },
  founding: { yearly: '1190.00' },
};

export type FlashOfferState = {
  id: typeof FLASH_OFFER_ID;
  percentOff: typeof FLASH_OFFER_PERCENT;
  expiresAt: number;
};

export function flashDiscountAmount(list: string): string {
  const n = Number.parseFloat(list);
  if (!Number.isFinite(n) || n <= 0) return list;
  return (Math.round(n * (100 - FLASH_OFFER_PERCENT)) / 100).toFixed(2);
}

export function listAmountForSku(sku: WaffoSku, interval: WaffoInterval): string | null {
  const row = LIST_PRICE_USD[sku];
  if (!row) return null;
  if (sku === 'founding' || interval === 'yearly') return row.yearly;
  return row.monthly ?? row.yearly;
}

export function flashAmountForSku(sku: WaffoSku, interval: WaffoInterval): string | null {
  const list = listAmountForSku(sku, interval);
  return list ? flashDiscountAmount(list) : null;
}

export function encodeFlashCookie(expiresAt: number): string {
  return `${FLASH_OFFER_ID}.${expiresAt}`;
}

export function parseFlashCookie(raw: string | null | undefined): FlashOfferState | null {
  if (!raw) return null;
  const [id, expRaw] = raw.split('.');
  if (id !== FLASH_OFFER_ID) return null;
  const expiresAt = Number(expRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null;
  return { id: FLASH_OFFER_ID, percentOff: FLASH_OFFER_PERCENT, expiresAt };
}

export function flashCheckoutHref(plan: PaidPlanId = 'analyst'): string {
  return `/checkout/waffo?plan=${plan}&promo=${FLASH_OFFER_ID}`;
}

export function remainingFlashMs(state: FlashOfferState | null): number {
  if (!state) return 0;
  return Math.max(0, state.expiresAt - Date.now());
}

export function formatFlashCountdown(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
