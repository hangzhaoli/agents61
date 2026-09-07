import { createHmac, timingSafeEqual } from 'crypto';
import { parseUsdtSku, yearlyUsdt, type UsdtSku } from '@/lib/usdt-catalog';

export type { UsdtSku } from '@/lib/usdt-catalog';
export { parseUsdtSku, skuToPlan, yearlyUsdt, USDT_YEARLY, USDT_FOUNDING_YEARLY } from '@/lib/usdt-catalog';

export type UsdtChain = 'trc20' | 'erc20';

const TRC20_USDT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

export function usdtChain(): UsdtChain {
  return process.env.USDT_CHAIN === 'erc20' ? 'erc20' : 'trc20';
}

export function usdtReceiveAddress(): string {
  return (process.env.USDT_ADDRESS ?? '').trim();
}

export function usdtConfigured(): boolean {
  const addr = usdtReceiveAddress();
  if (!addr) return false;
  if (usdtChain() === 'trc20') return addr.startsWith('T') && addr.length >= 30;
  return addr.startsWith('0x') && addr.length === 42;
}

function signingSecret(): string {
  return (process.env.USDT_SIGNING_SECRET ?? process.env.USDT_ADDRESS ?? '').trim();
}

export type UsdtIntent = {
  sku: UsdtSku;
  email: string;
  amount: string;
  exp: number;
  nonce: string;
};

export function signIntent(payload: UsdtIntent): string {
  const body = JSON.stringify(payload);
  const sig = createHmac('sha256', signingSecret() || 'agents61-usdt-dev').update(body).digest('hex');
  return Buffer.from(`${body}.${sig}`, 'utf8').toString('base64url');
}

export function readIntent(token: string): UsdtIntent | null {
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf8');
    const idx = raw.lastIndexOf('.');
    if (idx < 0) return null;
    const body = raw.slice(0, idx);
    const sig = raw.slice(idx + 1);
    const expected = createHmac('sha256', signingSecret() || 'agents61-usdt-dev').update(body).digest('hex');
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const parsed = JSON.parse(body) as UsdtIntent;
    if (!parsed.email || !parsed.amount || !parseUsdtSku(parsed.sku)) return null;
    if (parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Unique cents so two open invoices are distinguishable on a static address. */
export function uniqueAmount(base: number, salt: string): string {
  let n = 0;
  for (let i = 0; i < salt.length; i += 1) n = (n + salt.charCodeAt(i) * (i + 1)) % 90;
  const cents = (n + 10) / 100;
  return (base + cents).toFixed(2);
}

export async function verifyIncomingUsdt(input: {
  txid: string;
  expectedAmount: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const chain = usdtChain();
  const to = usdtReceiveAddress();
  if (!to) return { ok: false, error: 'USDT address is not configured.' };
  const txid = input.txid.trim();
  if (txid.length < 16) return { ok: false, error: 'Paste the full transaction hash.' };
  if (chain === 'trc20') return verifyTrc20(txid, to, input.expectedAmount);
  return {
    ok: false,
    error: 'ERC-20 auto-check needs a gateway. Send TRC-20 USDT, or wait for a card desk.',
  };
}

async function verifyTrc20(
  txid: string,
  to: string,
  expected: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const key = process.env.TRONGRID_API_KEY?.trim();
  if (key) headers['TRON-PRO-API-KEY'] = key;

  const url = `https://api.trongrid.io/v1/accounts/${encodeURIComponent(to)}/transactions/trc20?limit=80&only_to=true`;
  const res = await fetch(url, { headers, cache: 'no-store' });
  if (!res.ok) {
    return { ok: false, error: 'Could not read the TRON network. Wait a minute and try again.' };
  }
  const json = (await res.json()) as {
    data?: Array<{
      transaction_id?: string;
      to?: string;
      type?: string;
      value?: string;
      token_info?: { symbol?: string; address?: string; decimals?: number };
    }>;
  };
  const rows = json.data ?? [];
  const needle = txid.replace(/^0x/i, '').toLowerCase();
  const hit = rows.find((r) => (r.transaction_id ?? '').toLowerCase() === needle);
  if (!hit) {
    return {
      ok: false,
      error: 'That hash is not a confirmed USDT transfer to this address yet. Wait for 1 confirmation.',
    };
  }
  const symbol = (hit.token_info?.symbol ?? '').toUpperCase();
  const contract = hit.token_info?.address ?? '';
  if (symbol !== 'USDT' && contract !== TRC20_USDT) {
    return { ok: false, error: 'That transfer is not USDT-TRC20.' };
  }
  const decimals = hit.token_info?.decimals ?? 6;
  const paid = Number(hit.value ?? '0') / 10 ** decimals;
  const want = Number(expected);
  if (!Number.isFinite(paid) || Math.abs(paid - want) > 0.000001) {
    return { ok: false, error: `Amount mismatch. Send exactly ${expected} USDT.` };
  }
  return { ok: true };
}
