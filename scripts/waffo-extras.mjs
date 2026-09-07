#!/usr/bin/env node
/**
 * Create + publish one-time Waffo SKUs for token-extra packs.
 *
 *   WAFFO_MERCHANT_ID=... WAFFO_PRIVATE_KEY_BASE64=... WAFFO_STORE_ID=... \
 *     node scripts/waffo-extras.mjs
 *
 * Re-running creates NEW products. Save the printed IDs into Vercel.
 */

import { WaffoPancake } from '@waffo/pancake-ts';

const merchantId = process.env.WAFFO_MERCHANT_ID?.trim();
const privateKey = process.env.WAFFO_PRIVATE_KEY_BASE64?.trim()
  ? Buffer.from(process.env.WAFFO_PRIVATE_KEY_BASE64.trim(), 'base64').toString('utf-8')
  : process.env.WAFFO_PRIVATE_KEY?.trim();
const storeId = process.env.WAFFO_STORE_ID?.trim();

if (!merchantId || !privateKey || !storeId) {
  console.error('Set WAFFO_MERCHANT_ID, WAFFO_STORE_ID, and WAFFO_PRIVATE_KEY (or _BASE64).');
  process.exit(1);
}

const SITE = process.env.WAFFO_SITE_URL?.trim() || 'https://agents61.com';

const PACKS = [
  {
    sku: 'pack-25',
    env: 'WAFFO_PRODUCT_PACK_25',
    name: 'Agents61 Token extras — 25 runs',
    amount: '9.00',
    runs: 25,
  },
  {
    sku: 'pack-80',
    env: 'WAFFO_PRODUCT_PACK_80',
    name: 'Agents61 Token extras — 80 runs',
    amount: '24.00',
    runs: 80,
  },
];

const client = new WaffoPancake({ merchantId, privateKey });

console.log(`Creating one-time extra packs in store ${storeId}…`);
const env = {};

for (const pack of PACKS) {
  const { product } = await client.onetimeProducts.create({
    storeId,
    name: pack.name,
    description:
      `${pack.runs} DeepSeek V4 Flash extras (filing extract or trigger/invalidation). Research simulation — not advice, not an order.`,
    prices: { USD: { amount: pack.amount, taxIncluded: true, taxCategory: 'saas' } },
    successUrl: `${SITE}/checkout/waffo?paid=1&sku=${pack.sku}`,
    metadata: { a61_sku: pack.sku, a61_interval: 'once', a61_runs: String(pack.runs) },
  });
  try {
    await client.onetimeProducts.publish({ id: product.id });
    console.log(`  ${pack.name}: ${product.id} (published)`);
  } catch (err) {
    console.log(`  ${pack.name}: ${product.id} (created; publish later: ${err.message})`);
  }
  env[pack.env] = product.id;
}

console.log('\n--- Paste into Vercel → Settings → Environment Variables ---');
for (const [k, v] of Object.entries(env)) console.log(`${k}=${v}`);
console.log('------------------------------------------------------------');
