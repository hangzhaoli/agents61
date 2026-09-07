import { createHmac, timingSafeEqual } from 'node:crypto';
import { isPaidPlan, MARKETING_PLAN_IDS, type PaidPlanId } from '@/lib/tiers';

export type LemonSku = PaidPlanId | 'founding';
export type LemonInterval = 'monthly' | 'yearly';

const ALL_SKUS: LemonSku[] = [...MARKETING_PLAN_IDS, 'founding'];

const VARIANT_ENV: Record<LemonSku, { monthly?: string; yearly: string }> = {
  analyst: { monthly: 'LEMON_SQUEEZY_VARIANT_ANALYST_MONTHLY', yearly: 'LEMON_SQUEEZY_VARIANT_ANALYST_YEARLY' },
  associate: { monthly: 'LEMON_SQUEEZY_VARIANT_ASSOCIATE_MONTHLY', yearly: 'LEMON_SQUEEZY_VARIANT_ASSOCIATE_YEARLY' },
  principal: { monthly: 'LEMON_SQUEEZY_VARIANT_PRINCIPAL_MONTHLY', yearly: 'LEMON_SQUEEZY_VARIANT_PRINCIPAL_YEARLY' },
  committee: { monthly: 'LEMON_SQUEEZY_VARIANT_COMMITTEE_MONTHLY', yearly: 'LEMON_SQUEEZY_VARIANT_COMMITTEE_YEARLY' },
  partners: { monthly: 'LEMON_SQUEEZY_VARIANT_PARTNERS_MONTHLY', yearly: 'LEMON_SQUEEZY_VARIANT_PARTNERS_YEARLY' },
  founding: { yearly: 'LEMON_SQUEEZY_VARIANT_FOUNDING' },
};

export function parseLemonSku(raw: string | null | undefined): LemonSku | null {
  if (raw === 'founding') return 'founding';
  if (isPaidPlan(raw)) return raw;
  return null;
}

export function skuToPlan(sku: LemonSku): PaidPlanId {
  return sku === 'founding' ? 'committee' : sku;
}

export function parseInterval(raw: string | null | undefined): LemonInterval {
  return raw === 'yearly' ? 'yearly' : 'monthly';
}

function envId(name: string | undefined): string | null {
  const v = name ? process.env[name]?.trim() : '';
  return v || null;
}

export function lemonVariantId(sku: LemonSku, interval: LemonInterval): string | null {
  const keys = VARIANT_ENV[sku];
  if (sku === 'founding' || interval === 'yearly') return envId(keys.yearly);
  return envId(keys.monthly) ?? envId(keys.yearly);
}

export function lemonStoreId(): string | null {
  return process.env.LEMON_SQUEEZY_STORE_ID?.trim() || null;
}

export function lemonApiKey(): string | null {
  return process.env.LEMON_SQUEEZY_API_KEY?.trim() || null;
}

export function lemonConfigured(): boolean {
  return Boolean(lemonApiKey() && lemonStoreId() && lemonVariantId('analyst', 'monthly'));
}

export function lemonTestMode(): boolean {
  return process.env.LEMON_SQUEEZY_TEST_MODE === 'true';
}

export function lemonRedirectUrl(): string {
  return (
    process.env.LEMON_SQUEEZY_REDIRECT_URL?.trim() || 'https://agents61.com/checkout/lemonsqueezy'
  );
}

export function variantToSku(variantId: string | number | null | undefined): LemonSku | null {
  const needle = String(variantId ?? '').trim();
  if (!needle) return null;
  for (const sku of ALL_SKUS) {
    for (const interval of ['monthly', 'yearly'] as const) {
      const id = lemonVariantId(sku, interval);
      if (id && id === needle) return sku;
    }
  }
  return null;
}

type JsonApi<T> = {
  data?: T;
  errors?: Array<{ detail?: string; title?: string }>;
};

async function lemonFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const key = lemonApiKey();
  if (!key) throw new Error('Lemon Squeezy API key missing.');
  const res = await fetch(`https://api.lemonsqueezy.com/v1${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${key}`,
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });
  const json = (await res.json()) as JsonApi<T> & T;
  if (!res.ok) {
    const msg = json.errors?.[0]?.detail || json.errors?.[0]?.title || `Lemon Squeezy ${res.status}`;
    throw new Error(msg);
  }
  return json as T;
}

export async function createLemonCheckout(opts: {
  sku: LemonSku;
  interval: LemonInterval;
  email?: string;
}): Promise<string> {
  const storeId = lemonStoreId();
  const interval = opts.sku === 'founding' ? 'yearly' : opts.interval;
  const variantId = lemonVariantId(opts.sku, interval);
  if (!storeId || !variantId) {
    throw new Error('This desk is not mapped to a Lemon Squeezy variant yet.');
  }

  const body = {
    data: {
      type: 'checkouts',
      attributes: {
        checkout_options: {
          embed: false,
          button_color: '#0052d9',
        },
        checkout_data: {
          ...(opts.email ? { email: opts.email } : {}),
          custom: {
            a61_sku: opts.sku,
            a61_interval: interval,
          },
        },
        product_options: {
          redirect_url: lemonRedirectUrl(),
          receipt_button_text: 'Unlock the desk',
          receipt_link_url: lemonRedirectUrl(),
          enabled_variants: [Number(variantId)],
        },
        test_mode: lemonTestMode(),
      },
      relationships: {
        store: { data: { type: 'stores', id: storeId } },
        variant: { data: { type: 'variants', id: String(variantId) } },
      },
    },
  };

  const json = await lemonFetch<{ data?: { attributes?: { url?: string } } }>('/checkouts', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  const url = json.data?.attributes?.url;
  if (!url) throw new Error('Lemon Squeezy did not return a checkout URL.');
  return url;
}

type SubAttrs = {
  user_email?: string;
  variant_id?: number;
  status?: string;
  ends_at?: string | null;
};

type OrderAttrs = {
  user_email?: string;
  status?: string;
  first_order_item?: { variant_id?: number };
};

function subStillLive(status: string | undefined, endsAt: string | null | undefined): boolean {
  if (status === 'active' || status === 'on_trial' || status === 'past_due' || status === 'paused') {
    return true;
  }
  if (status === 'cancelled' && endsAt) {
    return Date.parse(endsAt) > Date.now();
  }
  return false;
}

export async function findPaidLemonSeat(opts: {
  email: string;
  sku?: LemonSku | null;
}): Promise<{ sku: LemonSku; plan: PaidPlanId; email: string } | null> {
  const email = opts.email.trim().toLowerCase();
  if (!email.includes('@')) return null;
  const storeId = lemonStoreId();
  const q = new URLSearchParams({ 'filter[user_email]': email });
  if (storeId) q.set('filter[store_id]', storeId);

  const subs = await lemonFetch<{ data?: Array<{ attributes?: SubAttrs }> }>(
    `/subscriptions?${q.toString()}`
  );
  const live = (subs.data ?? [])
    .map((row) => {
      const sku = variantToSku(row.attributes?.variant_id);
      if (!sku) return null;
      if (!subStillLive(row.attributes?.status, row.attributes?.ends_at)) return null;
      if (opts.sku && sku !== opts.sku) return null;
      return { sku, plan: skuToPlan(sku), email };
    })
    .filter((row): row is { sku: LemonSku; plan: PaidPlanId; email: string } => Boolean(row));
  if (live[0]) return live[0];

  const orders = await lemonFetch<{ data?: Array<{ attributes?: OrderAttrs }> }>(
    `/orders?${q.toString()}`
  );
  for (const row of orders.data ?? []) {
    if (row.attributes?.status !== 'paid') continue;
    const sku = variantToSku(row.attributes.first_order_item?.variant_id);
    if (!sku) continue;
    if (opts.sku && sku !== opts.sku) continue;
    return { sku, plan: skuToPlan(sku), email };
  }
  return null;
}

export function verifyLemonSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false;
  const digest = createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(digest, 'utf8');
  const b = Buffer.from(signature, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function skuFromWebhook(payload: {
  meta?: { custom_data?: Record<string, string> };
  data?: { attributes?: { variant_id?: number } };
}): LemonSku | null {
  const fromCustom = parseLemonSku(payload.meta?.custom_data?.a61_sku);
  if (fromCustom) return fromCustom;
  return variantToSku(payload.data?.attributes?.variant_id);
}
