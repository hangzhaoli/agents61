/**
 * NOWPayments crypto checkout (ChangeNOW). Custody by default.
 * Invoice covers monthly or yearly seating. Optional subscription plan IDs
 * enable wallet re-bill; without them each cycle is a new invoice.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import { normalizeEmail } from '@/lib/demo-session';
import { isPaidPlan, type PaidPlanId } from '@/lib/tiers';
import { USDT_FOUNDING_YEARLY, USDT_YEARLY } from '@/lib/usdt-catalog';

export type NowSku = PaidPlanId | 'founding';
export type NowInterval = 'monthly' | 'yearly';

const MONTHLY_USD: Record<PaidPlanId, number> = {
  analyst: 19,
  associate: 49,
  principal: 79,
  committee: 149,
  partners: 349,
};

const PLAN_ENV: Record<NowSku, { monthly?: string; yearly: string }> = {
  analyst: { monthly: 'NOWPAYMENTS_PLAN_ANALYST_MONTHLY', yearly: 'NOWPAYMENTS_PLAN_ANALYST_YEARLY' },
  associate: { monthly: 'NOWPAYMENTS_PLAN_ASSOCIATE_MONTHLY', yearly: 'NOWPAYMENTS_PLAN_ASSOCIATE_YEARLY' },
  principal: { monthly: 'NOWPAYMENTS_PLAN_PRINCIPAL_MONTHLY', yearly: 'NOWPAYMENTS_PLAN_PRINCIPAL_YEARLY' },
  committee: { monthly: 'NOWPAYMENTS_PLAN_COMMITTEE_MONTHLY', yearly: 'NOWPAYMENTS_PLAN_COMMITTEE_YEARLY' },
  partners: { monthly: 'NOWPAYMENTS_PLAN_PARTNERS_MONTHLY', yearly: 'NOWPAYMENTS_PLAN_PARTNERS_YEARLY' },
  founding: { yearly: 'NOWPAYMENTS_PLAN_FOUNDING' },
};

export type NowOrder = {
  sku: NowSku;
  interval: NowInterval;
  email: string;
};

export function parseNowSku(raw: string | null | undefined): NowSku | null {
  if (raw === 'founding') return 'founding';
  if (isPaidPlan(raw)) return raw;
  return null;
}

export function skuToPlan(sku: NowSku): PaidPlanId {
  return sku === 'founding' ? 'committee' : sku;
}

export function parseNowInterval(raw: string | null | undefined): NowInterval {
  return raw === 'yearly' ? 'yearly' : 'monthly';
}

export function nowApiKey(): string | null {
  return process.env.NOWPAYMENTS_API_KEY?.trim() || null;
}

export function nowIpnSecret(): string | null {
  return process.env.NOWPAYMENTS_IPN_SECRET?.trim() || null;
}

export function nowConfigured(): boolean {
  return Boolean(nowApiKey());
}

export function nowPayCurrency(): string {
  return (process.env.NOWPAYMENTS_PAY_CURRENCY?.trim() || 'usdttrc20').toLowerCase();
}

export function nowApiBase(): string {
  return process.env.NOWPAYMENTS_API_URL?.trim() || 'https://api.nowpayments.io/v1';
}

export function nowIpnCallbackUrl(): string {
  return (
    process.env.NOWPAYMENTS_IPN_CALLBACK_URL?.trim() ||
    'https://agents61.com/api/billing/nowpayments/ipn'
  );
}

export function nowSuccessUrl(): string {
  return (
    process.env.NOWPAYMENTS_SUCCESS_URL?.trim() || 'https://agents61.com/checkout/nowpayments'
  );
}

export function nowCancelUrl(): string {
  return process.env.NOWPAYMENTS_CANCEL_URL?.trim() || 'https://agents61.com/pricing';
}

export function usdAmount(sku: NowSku, interval: NowInterval): number {
  if (sku === 'founding' || interval === 'yearly') {
    return sku === 'founding' ? USDT_FOUNDING_YEARLY : USDT_YEARLY[sku];
  }
  return MONTHLY_USD[sku];
}

export function cookieMaxAge(interval: NowInterval): number {
  return interval === 'yearly' ? 60 * 60 * 24 * 400 : 60 * 60 * 24 * 32;
}

export function nowPlanId(sku: NowSku, interval: NowInterval): string | null {
  const keys = PLAN_ENV[sku];
  if (sku === 'founding' || interval === 'yearly') {
    return process.env[keys.yearly]?.trim() || null;
  }
  const monthly = keys.monthly ? process.env[keys.monthly]?.trim() : '';
  return monthly || process.env[keys.yearly]?.trim() || null;
}

export function encodeOrder(order: NowOrder): { orderId: string; description: string } {
  const email = normalizeEmail(order.email);
  const orderId = `a61:${order.sku}:${order.interval}:${email}`.slice(0, 120);
  const description = `Agents61 ${order.sku} ${order.interval} research simulation for ${email}`;
  return { orderId, description };
}

export function parseOrder(orderId?: string | null, description?: string | null): NowOrder | null {
  const fromId = orderId?.match(/^a61:([^:]+):([^:]+):(.+)$/);
  if (fromId) {
    const sku = parseNowSku(fromId[1]);
    if (sku) {
      return {
        sku,
        interval: parseNowInterval(fromId[2]),
        email: normalizeEmail(fromId[3]),
      };
    }
  }
  const fromDesc = description?.match(
    /Agents61\s+(\w+)\s+(monthly|yearly)\s+research simulation for\s+(\S+@\S+)/i
  );
  if (!fromDesc) return null;
  const sku = parseNowSku(fromDesc[1]);
  if (!sku) return null;
  return {
    sku,
    interval: parseNowInterval(fromDesc[2]),
    email: normalizeEmail(fromDesc[3]),
  };
}

export function paidStatus(status: string | null | undefined): boolean {
  const s = (status ?? '').toLowerCase();
  return s === 'finished' || s === 'confirmed' || s === 'sending';
}

type Json = Record<string, unknown>;

async function npFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const key = nowApiKey();
  if (!key) throw new Error('NOWPayments API key is not set.');
  const res = await fetch(`${nowApiBase()}${path}`, {
    ...init,
    headers: {
      'x-api-key': key,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  const data = (await res.json().catch(() => ({}))) as T & { message?: string; error?: string };
  if (!res.ok) {
    const msg = data.message || data.error || `NOWPayments ${res.status}`;
    throw new Error(typeof msg === 'string' ? msg : 'NOWPayments request failed.');
  }
  return data;
}

export async function createNowInvoice(order: NowOrder): Promise<{ url: string; invoiceId: string }> {
  const interval: NowInterval = order.sku === 'founding' ? 'yearly' : order.interval;
  const { orderId, description } = encodeOrder({ ...order, interval });
  const payload: Json = {
    price_amount: usdAmount(order.sku, interval),
    price_currency: 'usd',
    order_id: orderId,
    order_description: description,
    ipn_callback_url: nowIpnCallbackUrl(),
    success_url: `${nowSuccessUrl()}?paid=1`,
    cancel_url: nowCancelUrl(),
  };
  const pay = nowPayCurrency();
  if (pay) payload.pay_currency = pay;

  const data = await npFetch<{ id?: string | number; invoice_url?: string }>('/invoice', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!data.invoice_url) throw new Error('NOWPayments did not return an invoice URL.');
  return { url: data.invoice_url, invoiceId: String(data.id ?? '') };
}

export async function createNowSubscription(order: NowOrder): Promise<{ url: string } | null> {
  const interval: NowInterval = order.sku === 'founding' ? 'yearly' : order.interval;
  const planId = nowPlanId(order.sku, interval);
  if (!planId) return null;
  const { orderId, description } = encodeOrder({ ...order, interval });
  const data = await npFetch<{
    result?: { invoice_url?: string; payment_url?: string };
    invoice_url?: string;
    payment_url?: string;
  }>('/subscriptions', {
    method: 'POST',
    body: JSON.stringify({
      subscription_plan_id: planId,
      email: normalizeEmail(order.email),
      order_id: orderId,
      order_description: description,
    }),
  });
  const url =
    data.result?.invoice_url ||
    data.result?.payment_url ||
    data.invoice_url ||
    data.payment_url;
  if (!url) throw new Error('NOWPayments subscription did not return a payment URL.');
  return { url };
}

export type NowPayment = {
  payment_id?: string | number;
  payment_status?: string;
  order_id?: string;
  order_description?: string;
  invoice_id?: string | number;
  actually_paid?: number;
  pay_amount?: number;
};

export async function getNowPayment(paymentId: string): Promise<NowPayment> {
  return npFetch<NowPayment>(`/payment/${encodeURIComponent(paymentId)}`);
}

export async function findNowPayment(order: NowOrder): Promise<NowPayment | null> {
  const { orderId } = encodeOrder(order);
  const data = await npFetch<{ data?: NowPayment[]; result?: NowPayment[] }>(
    `/payment/?limit=20&order_id=${encodeURIComponent(orderId)}`
  );
  const rows = data.data ?? data.result ?? [];
  const paid = rows.find((row) => paidStatus(row.payment_status));
  return paid ?? rows[0] ?? null;
}

function sortObject(value: unknown): unknown {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return value;
  const rec = value as Record<string, unknown>;
  return Object.keys(rec)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = sortObject(rec[key]);
      return acc;
    }, {});
}

export function verifyNowIpn(rawBody: string, signature: string | null): boolean {
  const secret = nowIpnSecret();
  if (!secret || !signature) return false;
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return false;
  }
  const expected = createHmac('sha512', secret)
    .update(JSON.stringify(sortObject(parsed)))
    .digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signature.trim(), 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
