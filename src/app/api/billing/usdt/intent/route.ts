import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { normalizeEmail } from '@/lib/demo-session';
import {
  parseUsdtSku,
  signIntent,
  uniqueAmount,
  usdtChain,
  usdtConfigured,
  usdtReceiveAddress,
  yearlyUsdt,
  type UsdtIntent,
} from '@/lib/usdt-billing';

export async function POST(request: Request) {
  if (!usdtConfigured()) {
    return NextResponse.json(
      { error: 'USDT backup is not live until USDT_ADDRESS is set on the server.' },
      { status: 503 }
    );
  }

  let body: { sku?: string; email?: string } = {};
  try {
    body = (await request.json()) as { sku?: string; email?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const sku = parseUsdtSku(body.sku);
  const email = normalizeEmail(body.email ?? '');
  if (!sku || !email || !email.includes('@')) {
    return NextResponse.json({ error: 'Need a paid desk and a valid email.' }, { status: 400 });
  }

  const nonce = crypto.randomUUID();
  const amount = uniqueAmount(yearlyUsdt(sku), `${email}:${nonce}`);
  const payload: UsdtIntent = {
    sku,
    email,
    amount,
    exp: Date.now() + 1000 * 60 * 90,
    nonce,
  };
  const token = signIntent(payload);
  const address = usdtReceiveAddress();
  const chain = usdtChain();
  const qrPayload = chain === 'trc20' ? address : address;
  const qrDataUrl = await QRCode.toDataURL(qrPayload, {
    margin: 1,
    width: 280,
    color: { dark: '#0f172a', light: '#ffffff' },
  });

  return NextResponse.json({
    token,
    email,
    sku,
    amount,
    address,
    chain,
    qrDataUrl,
    expiresAt: payload.exp,
  });
}
