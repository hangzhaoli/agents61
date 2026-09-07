/**
 * Waffo billing ledger on Supabase (service role, server-only).
 * Webhook route appends events; confirm route derives entitlements.
 * Fail-open design: when Supabase is not configured the webhook still
 * answers 200 and confirm falls back to the GraphQL lookup.
 */

import { supabaseAdmin } from '@/lib/supabase/admin';
import { parseWaffoSku, skuToPlan, type WaffoInterval, type WaffoSku } from '@/lib/waffo';
import type { PaidPlanId } from '@/lib/tiers';

export type WaffoLedgerEvent = {
  deliveryId: string;
  mode: string;
  eventType: string;
  buyerEmail: string;
  sku: WaffoSku | string | null;
  interval: WaffoInterval | 'once' | null;
  orderId: string | null;
  orderStatus: string | null;
  amount: string | null;
  currency: string | null;
  payload: unknown;
};

export function waffoLedgerReady(): boolean {
  return Boolean(supabaseAdmin());
}

/** Append a verified webhook event. Duplicate deliveries are ignored. */
export async function recordWaffoEvent(evt: WaffoLedgerEvent): Promise<'recorded' | 'duplicate' | 'skipped'> {
  const db = supabaseAdmin();
  if (!db) return 'skipped';
  const { error } = await db.from('desk_billing_waffo').insert({
    delivery_id: evt.deliveryId,
    mode: evt.mode,
    event_type: evt.eventType,
    buyer_email: evt.buyerEmail,
    sku: evt.sku,
    interval: evt.interval,
    order_id: evt.orderId,
    order_status: evt.orderStatus,
    amount: evt.amount,
    currency: evt.currency,
    payload: (evt.payload ?? {}) as Record<string, unknown>,
  });
  if (error) {
    if (error.code === '23505') return 'duplicate'; // unique violation on delivery_id
    throw new Error(error.message);
  }
  return 'recorded';
}

type LedgerRow = {
  event_type: string;
  sku: string | null;
  interval: string | null;
  mode: string;
  created_at: string;
};

/** Events that keep a desk unlocked (canceling/past_due stay live until period end, matching Lemon). */
const GRANT_EVENTS = new Set([
  'order.completed',
  'subscription.activated',
  'subscription.payment_succeeded',
  'subscription.canceling',
  'subscription.uncanceled',
  'subscription.updated',
  'subscription.plan_changed',
  'subscription.past_due',
]);
const REVOKE_EVENTS = new Set(['subscription.canceled', 'refund.succeeded']);

/**
 * Latest-event-wins entitlement from the ledger.
 * Test-mode events only count when allowTest is true (WAFFO_TEST_UNLOCK).
 */
export async function findPaidWaffoSeatLedger(opts: {
  email: string;
  sku?: WaffoSku | null;
  allowTest: boolean;
}): Promise<{ sku: WaffoSku; plan: PaidPlanId; email: string } | null> {
  const db = supabaseAdmin();
  const email = opts.email.trim().toLowerCase();
  if (!db || !email.includes('@')) return null;

  const { data, error } = await db
    .from('desk_billing_waffo')
    .select('event_type, sku, interval, mode, created_at')
    .eq('buyer_email', email)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error || !data) return null;

  const entitled = new Map<WaffoSku, boolean>();
  for (const row of data as LedgerRow[]) {
    const sku = parseWaffoSku(row.sku);
    if (!sku || entitled.has(sku)) continue; // first row per sku = latest
    if (row.mode === 'test' && !opts.allowTest) {
      entitled.set(sku, false);
      continue;
    }
    if (GRANT_EVENTS.has(row.event_type)) entitled.set(sku, true);
    else if (REVOKE_EVENTS.has(row.event_type)) entitled.set(sku, false);
  }

  if (opts.sku) {
    return entitled.get(opts.sku)
      ? { sku: opts.sku, plan: skuToPlan(opts.sku), email }
      : null;
  }
  for (const [sku, ok] of entitled) {
    if (ok) return { sku, plan: skuToPlan(sku), email };
  }
  return null;
}
