/**
 * One-time Waffo SKUs for DeepSeek V4 token extras.
 * Seat subscriptions stay on WaffoSku. These packs never unlock a desk.
 */

import { TOKEN_PACKS, type TokenPackId } from '@/lib/token-extras';
import { waffoClient, waffoStoreId } from '@/lib/waffo';

export type WaffoExtraSku = TokenPackId;

const PRODUCT_ENV: Record<WaffoExtraSku, string> = {
  'pack-25': 'WAFFO_PRODUCT_PACK_25',
  'pack-80': 'WAFFO_PRODUCT_PACK_80',
};

export function parseWaffoExtraSku(raw: string | null | undefined): WaffoExtraSku | null {
  if (raw === 'pack-25' || raw === 'pack-80') return raw;
  return null;
}

export function extraPackBySku(sku: WaffoExtraSku) {
  return TOKEN_PACKS.find((p) => p.id === sku) ?? TOKEN_PACKS[0];
}

export function waffoExtraProductId(sku: WaffoExtraSku): string | null {
  return process.env[PRODUCT_ENV[sku]]?.trim() || null;
}

export function waffoExtrasConfigured(): boolean {
  return Boolean(waffoClient() && waffoExtraProductId('pack-25') && waffoExtraProductId('pack-80'));
}

export function waffoExtraExternalRef(email: string, sku: WaffoExtraSku): string {
  return `a61:${sku}:once:${email.trim().toLowerCase()}`.slice(0, 128);
}

export function parseWaffoExtraRef(
  ref: string | null | undefined
): { sku: WaffoExtraSku; email: string } | null {
  if (!ref || !ref.startsWith('a61:')) return null;
  const parts = ref.split(':');
  if (parts.length < 4) return null;
  const sku = parseWaffoExtraSku(parts[1]);
  if (!sku || parts[2] !== 'once') return null;
  const email = parts.slice(3).join(':').trim().toLowerCase();
  if (!email.includes('@')) return null;
  return { sku, email };
}

export function waffoExtraSuccessUrl(sku: WaffoExtraSku): string {
  const base = process.env.WAFFO_SUCCESS_URL?.trim() || 'https://agents61.com/checkout/waffo';
  return `${base}?paid=1&sku=${sku}`;
}

export async function createWaffoExtraCheckout(opts: {
  sku: WaffoExtraSku;
  email?: string;
}): Promise<string> {
  const waffo = waffoClient();
  const productId = waffoExtraProductId(opts.sku);
  if (!waffo || !productId) {
    throw new Error('This extra pack is not mapped to a Waffo product yet.');
  }
  const email = opts.email?.trim().toLowerCase();
  const session = await waffo.checkout.createSession({
    productId,
    currency: 'USD',
    ...(email ? { buyerEmail: email } : {}),
    orderMerchantExternalId: waffoExtraExternalRef(email || 'guest', opts.sku),
    metadata: { a61_sku: opts.sku, a61_interval: 'once' },
    successUrl: waffoExtraSuccessUrl(opts.sku),
  });
  if (!session.checkoutUrl) throw new Error('Waffo did not return a checkout URL.');
  return session.checkoutUrl;
}

type OneTimeRow = {
  id: string;
  buyerEmail?: string;
  status?: string;
};

export async function findPaidWaffoExtraGraphQL(opts: {
  email: string;
  sku?: WaffoExtraSku | null;
}): Promise<{ sku: WaffoExtraSku; runs: number; email: string } | null> {
  const waffo = waffoClient();
  const storeId = waffoStoreId();
  const email = opts.email.trim().toLowerCase();
  if (!waffo || !storeId || !email.includes('@')) return null;

  const skus: WaffoExtraSku[] = opts.sku ? [opts.sku] : ['pack-25', 'pack-80'];
  let total = 0;
  let hit: WaffoExtraSku | null = null;

  for (const sku of skus) {
    try {
      const once = await waffo.graphql.query<{ onetimeOrders: OneTimeRow[] }>({
        query: `query($storeId: String!, $ref: String!) {
          onetimeOrders(storeId: $storeId, filter: { orderMerchantExternalId: { eq: $ref } }) {
            id buyerEmail status
          }
        }`,
        variables: { storeId, ref: waffoExtraExternalRef(email, sku) },
      });
      const done = (once.data?.onetimeOrders ?? []).filter(
        (row) =>
          String(row.status ?? '') === 'completed' &&
          (row.buyerEmail ?? '').trim().toLowerCase() === email
      );
      if (done.length) {
        total += extraPackBySku(sku).runs * done.length;
        hit = sku;
      }
    } catch {
      /* schema drift — caller uses the webhook ledger */
    }
  }

  return hit ? { sku: hit, runs: total, email } : null;
}
