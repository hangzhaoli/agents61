/**
 * Waffo Pancake (Merchant of Record) — card / Apple Pay / Google Pay rail.
 * Server-side only. Signup + keys: https://pancake.waffo.ai → API & Development.
 *
 * Confirm flow anchor: every checkout session carries
 *   orderMerchantExternalId = a61:{sku}:{interval}:{email}
 * which is inherited by the order and all renewal payments, and is queryable
 * via GraphQL — so "did this email pay for this desk?" is one exact lookup.
 */

import { TaxCategory, WaffoPancake } from '@waffo/pancake-ts';
import { flashAmountForSku } from '@/lib/flash-offer';
import { isPaidPlan, MARKETING_PLAN_IDS, type PaidPlanId } from '@/lib/tiers';

export type WaffoSku = PaidPlanId | 'founding';
export type WaffoInterval = 'monthly' | 'yearly';

const ALL_SKUS: WaffoSku[] = [...MARKETING_PLAN_IDS, 'founding'];

const PRODUCT_ENV: Record<WaffoSku, { monthly?: string; yearly: string }> = {
  analyst: { monthly: 'WAFFO_PRODUCT_ANALYST_MONTHLY', yearly: 'WAFFO_PRODUCT_ANALYST_YEARLY' },
  associate: { monthly: 'WAFFO_PRODUCT_ASSOCIATE_MONTHLY', yearly: 'WAFFO_PRODUCT_ASSOCIATE_YEARLY' },
  principal: { monthly: 'WAFFO_PRODUCT_PRINCIPAL_MONTHLY', yearly: 'WAFFO_PRODUCT_PRINCIPAL_YEARLY' },
  committee: { monthly: 'WAFFO_PRODUCT_COMMITTEE_MONTHLY', yearly: 'WAFFO_PRODUCT_COMMITTEE_YEARLY' },
  partners: { monthly: 'WAFFO_PRODUCT_PARTNERS_MONTHLY', yearly: 'WAFFO_PRODUCT_PARTNERS_YEARLY' },
  founding: { yearly: 'WAFFO_PRODUCT_FOUNDING' },
};

export function parseWaffoSku(raw: string | null | undefined): WaffoSku | null {
  if (raw === 'founding') return 'founding';
  if (isPaidPlan(raw)) return raw;
  return null;
}

export function skuToPlan(sku: WaffoSku): PaidPlanId {
  return sku === 'founding' ? 'committee' : sku;
}

export function parseWaffoInterval(raw: string | null | undefined): WaffoInterval {
  return raw === 'yearly' ? 'yearly' : 'monthly';
}

function envId(name: string | undefined): string | null {
  const v = name ? process.env[name]?.trim() : '';
  return v || null;
}

export function waffoProductId(sku: WaffoSku, interval: WaffoInterval): string | null {
  const keys = PRODUCT_ENV[sku];
  if (sku === 'founding' || interval === 'yearly') return envId(keys.yearly);
  return envId(keys.monthly) ?? envId(keys.yearly);
}

export function waffoStoreId(): string | null {
  return process.env.WAFFO_STORE_ID?.trim() || null;
}

function waffoMerchantId(): string | null {
  return process.env.WAFFO_MERCHANT_ID?.trim() || null;
}

function waffoPrivateKey(): string | null {
  const b64 = process.env.WAFFO_PRIVATE_KEY_BASE64?.trim();
  if (b64) {
    try {
      return Buffer.from(b64, 'base64').toString('utf-8');
    } catch {
      return null;
    }
  }
  const pem = process.env.WAFFO_PRIVATE_KEY?.trim();
  return pem || null;
}

let client: WaffoPancake | null = null;

export function waffoClient(): WaffoPancake | null {
  const merchantId = waffoMerchantId();
  const privateKey = waffoPrivateKey();
  if (!merchantId || !privateKey) return null;
  if (!client) {
    try {
      client = new WaffoPancake({ merchantId, privateKey });
    } catch {
      return null;
    }
  }
  return client;
}

export function waffoConfigured(): boolean {
  return Boolean(waffoClient() && waffoProductId('analyst', 'monthly'));
}

/** Test-mode webhook events only unlock the desk when explicitly allowed. */
export function waffoTestUnlock(): boolean {
  return process.env.WAFFO_TEST_UNLOCK?.trim() === 'true';
}

export function waffoSuccessUrl(sku: WaffoSku, interval: WaffoInterval): string {
  const base = process.env.WAFFO_SUCCESS_URL?.trim() || 'https://agents61.com/checkout/waffo';
  return `${base}?paid=1&plan=${sku}&interval=${interval}`;
}

/** Business reference written at checkout; inherited by orders/payments/refunds. Max 128 chars. */
export function waffoExternalRef(email: string, sku: WaffoSku, interval: WaffoInterval): string {
  return `a61:${sku}:${sku === 'founding' ? 'yearly' : interval}:${email.trim().toLowerCase()}`.slice(0, 128);
}

export function parseWaffoExternalRef(
  ref: string | null | undefined
): { sku: WaffoSku; interval: WaffoInterval; email: string } | null {
  if (!ref || !ref.startsWith('a61:')) return null;
  const parts = ref.split(':');
  if (parts.length < 4) return null;
  const sku = parseWaffoSku(parts[1]);
  if (!sku) return null;
  const interval = parseWaffoInterval(parts[2]);
  const email = parts.slice(3).join(':').trim().toLowerCase();
  if (!email.includes('@')) return null;
  return { sku, interval, email };
}

export async function createWaffoCheckout(opts: {
  sku: WaffoSku;
  interval: WaffoInterval;
  email?: string;
  /** Apply live 15% flash offer via Waffo priceSnapshot (server must validate cookie first). */
  flashOffer?: boolean;
}): Promise<string> {
  const waffo = waffoClient();
  const interval = opts.sku === 'founding' ? 'yearly' : opts.interval;
  const productId = waffoProductId(opts.sku, interval);
  if (!waffo || !productId) {
    throw new Error('This desk is not mapped to a Waffo product yet.');
  }
  const email = opts.email?.trim().toLowerCase();
  const flashAmount = opts.flashOffer ? flashAmountForSku(opts.sku, interval) : null;
  const session = await waffo.checkout.createSession({
    productId,
    currency: 'USD',
    ...(email ? { buyerEmail: email } : {}),
    orderMerchantExternalId: waffoExternalRef(email || 'guest', opts.sku, interval),
    metadata: {
      a61_sku: opts.sku,
      a61_interval: interval,
      ...(flashAmount ? { a61_promo: 'flash15', a61_flash_amount: flashAmount } : {}),
    },
    successUrl: waffoSuccessUrl(opts.sku, interval),
    ...(flashAmount
      ? { priceSnapshot: { amount: flashAmount, taxCategory: TaxCategory.SaaS } }
      : {}),
    // Analyst monthly keeps the "Start 7-day trial" promise when the product has a trial configured.
    // Skip trial when a flash price snapshot is applied so the discounted price is what they pay.
    ...(opts.sku === 'analyst' && interval === 'monthly' && !flashAmount ? { withTrial: true } : {}),
  });
  if (!session.checkoutUrl) throw new Error('Waffo did not return a checkout URL.');
  return session.checkoutUrl;
}

type SubOrderRow = {
  id: string;
  buyerEmail?: string;
  status?: string;
  billingPeriod?: string;
  createdAt?: string;
};

type OneTimeRow = {
  id: string;
  buyerEmail?: string;
  status?: string;
  createdAt?: string;
};

const LIVE_SUB_STATUSES = new Set(['active', 'canceling', 'past_due']);

/**
 * GraphQL fallback entitlement check: exact external-ref lookup.
 * A hit on a live subscription (or completed one-time order) under
 * `a61:{sku}:{interval}:{email}` proves that desk was paid for.
 */
export async function findPaidWaffoSeatGraphQL(opts: {
  email: string;
  sku: WaffoSku;
}): Promise<{ sku: WaffoSku; plan: PaidPlanId; email: string } | null> {
  const waffo = waffoClient();
  const storeId = waffoStoreId();
  const email = opts.email.trim().toLowerCase();
  if (!waffo || !storeId || !email.includes('@')) return null;

  const refs =
    opts.sku === 'founding'
      ? [waffoExternalRef(email, opts.sku, 'yearly')]
      : [waffoExternalRef(email, opts.sku, 'monthly'), waffoExternalRef(email, opts.sku, 'yearly')];

  for (const ref of refs) {
    try {
      const subs = await waffo.graphql.query<{ subscriptionOrders: SubOrderRow[] }>({
        query: `query($storeId: String!, $ref: String!) {
          subscriptionOrders(storeId: $storeId, filter: { orderMerchantExternalId: { eq: $ref } }) {
            id buyerEmail status billingPeriod createdAt
          }
        }`,
        variables: { storeId, ref },
      });
      const live = (subs.data?.subscriptionOrders ?? []).find(
        (row) =>
          LIVE_SUB_STATUSES.has(String(row.status ?? '')) &&
          (row.buyerEmail ?? '').trim().toLowerCase() === email
      );
      if (live) return { sku: opts.sku, plan: skuToPlan(opts.sku), email };

      const once = await waffo.graphql.query<{ onetimeOrders: OneTimeRow[] }>({
        query: `query($storeId: String!, $ref: String!) {
          onetimeOrders(storeId: $storeId, filter: { orderMerchantExternalId: { eq: $ref } }) {
            id buyerEmail status createdAt
          }
        }`,
        variables: { storeId, ref },
      });
      const done = (once.data?.onetimeOrders ?? []).find(
        (row) =>
          String(row.status ?? '') === 'completed' &&
          (row.buyerEmail ?? '').trim().toLowerCase() === email
      );
      if (done) return { sku: opts.sku, plan: skuToPlan(opts.sku), email };
    } catch {
      // GraphQL unreachable / schema drift — caller falls back to the webhook ledger.
    }
  }
  return null;
}

export { ALL_SKUS as WAFFO_SKUS };
