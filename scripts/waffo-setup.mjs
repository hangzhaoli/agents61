#!/usr/bin/env node
/**
 * Waffo Pancake bootstrap for Agents61.
 *
 * Usage:
 *   WAFFO_MERCHANT_ID=... WAFFO_PRIVATE_KEY_BASE64=... node scripts/waffo-setup.mjs
 *   (WAFFO_PRIVATE_KEY with \n-escaped PEM works too)
 *
 * What it does:
 *   1. Reuses your single store, or creates "Agents61" if you have none.
 *   2. Creates the 11 desk subscription products (5 plans × monthly/yearly + Founding yearly).
 *   3. Publishes every product to production (one-way).
 *   4. Registers the webhook for test + prod.
 *   5. Prints the env block to paste into Vercel.
 *
 * Re-running is safe-ish: it always creates NEW products, so run once and save the output.
 */

import { WaffoPancake } from '@waffo/pancake-ts';

const merchantId = process.env.WAFFO_MERCHANT_ID?.trim();
const privateKey = process.env.WAFFO_PRIVATE_KEY_BASE64?.trim()
  ? Buffer.from(process.env.WAFFO_PRIVATE_KEY_BASE64.trim(), 'base64').toString('utf-8')
  : process.env.WAFFO_PRIVATE_KEY?.trim();

if (!merchantId || !privateKey) {
  console.error('Set WAFFO_MERCHANT_ID and WAFFO_PRIVATE_KEY (or WAFFO_PRIVATE_KEY_BASE64).');
  process.exit(1);
}

const SITE = process.env.WAFFO_SITE_URL?.trim() || 'https://agents61.com';
const WEBHOOK_URL = `${SITE}/api/billing/waffo/webhook`;
const WEBHOOK_EVENTS = [
  'order.completed',
  'subscription.activated',
  'subscription.payment_succeeded',
  'subscription.canceling',
  'subscription.uncanceled',
  'subscription.updated',
  'subscription.canceled',
  'subscription.past_due',
  'refund.succeeded',
];

/** sku → [monthly USD, yearly USD]. Founding is yearly-only. */
const CATALOG = [
  ['analyst', '19.00', '169.00'],
  ['associate', '49.00', '429.00'],
  ['principal', '79.00', '699.00'],
  ['committee', '149.00', '1290.00'],
  ['partners', '349.00', '2990.00'],
  ['founding', null, '1190.00'],
];

const client = new WaffoPancake({ merchantId, privateKey });

async function resolveStore() {
  const pinned = process.env.WAFFO_STORE_ID?.trim();
  const result = await client.graphql.query({
    query: 'query { stores { id name status } }',
  });
  const stores = result.data?.stores ?? [];
  if (pinned) {
    const hit = stores.find((s) => s.id === pinned);
    if (hit) {
      console.log(`Using pinned store: ${hit.name} (${hit.id})`);
      return hit;
    }
    console.error(`WAFFO_STORE_ID=${pinned} is not on this merchant.`);
    for (const s of stores) console.error(`  ${s.id}  ${s.name}  (${s.status})`);
    process.exit(1);
  }
  if (stores.length === 1) {
    console.log(`Using existing store: ${stores[0].name} (${stores[0].id})`);
    return stores[0];
  }
  if (stores.length > 1) {
    console.error('Multiple stores exist. Pick one and set WAFFO_STORE_ID, then re-run with it:');
    for (const s of stores) console.error(`  ${s.id}  ${s.name}  (${s.status})`);
    process.exit(1);
  }
  const { store } = await client.stores.create({
    name: 'Agents61',
    supportEmail: 'research@agents61.com',
    website: SITE,
  });
  console.log(`Created store: ${store.name} (${store.id})`);
  return store;
}

async function createProduct(storeId, sku, period, amount) {
  const name =
    sku === 'founding'
      ? 'Agents61 Founding Committee — Yearly'
      : `Agents61 ${sku[0].toUpperCase()}${sku.slice(1)} — ${period === 'monthly' ? 'Monthly' : 'Yearly'}`;
  const { product } = await client.subscriptionProducts.create({
    storeId,
    name,
    description:
      'Research simulation desk seating. Educational publication, not investment advice.',
    billingPeriod: period,
    prices: { USD: { amount, taxIncluded: true, taxCategory: 'saas' } },
    successUrl: `${SITE}/checkout/waffo?paid=1&plan=${sku}&interval=${period}`,
    metadata: {
      a61_sku: sku,
      a61_interval: period,
      // Analyst monthly keeps the "Start 7-day trial" pricing promise.
      ...(sku === 'analyst' && period === 'monthly' ? { trialDays: 7 } : {}),
    },
  });
  try {
    await client.subscriptionProducts.publish({ id: product.id });
    console.log(`  ${name}: ${product.id} (published)`);
  } catch (err) {
    console.log(`  ${name}: ${product.id} (created; publish later if KYB blocks it: ${err.message})`);
  }
  return product.id;
}

const store = await resolveStore();
console.log(`\nCreating products in store ${store.id}…`);

const env = { WAFFO_STORE_ID: store.id };
for (const [sku, monthly, yearly] of CATALOG) {
  const key = `WAFFO_PRODUCT_${sku.toUpperCase()}`;
  if (monthly) env[`${key}_MONTHLY`] = await createProduct(store.id, sku, 'monthly', monthly);
  env[sku === 'founding' ? key : `${key}_YEARLY`] = await createProduct(store.id, sku, 'yearly', yearly);
}

for (const testMode of [true, false]) {
  try {
    await client.webhooks.add({
      storeId: store.id,
      channel: 'http',
      url: WEBHOOK_URL,
      events: WEBHOOK_EVENTS,
      testMode,
    });
    console.log(`Webhook registered (${testMode ? 'test' : 'prod'}): ${WEBHOOK_URL}`);
  } catch (err) {
    console.log(`Webhook registration (${testMode ? 'test' : 'prod'}) failed: ${err.message}`);
  }
}

console.log('\n--- Paste into Vercel → Settings → Environment Variables ---');
for (const [k, v] of Object.entries(env)) console.log(`${k}=${v}`);
console.log('WAFFO_SUCCESS_URL=https://agents61.com/checkout/waffo');
console.log('# WAFFO_TEST_UNLOCK=false  # keep unset in production');
console.log('------------------------------------------------------------');
