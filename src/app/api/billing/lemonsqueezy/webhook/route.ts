import { NextResponse } from 'next/server';
import { skuFromWebhook, verifyLemonSignature } from '@/lib/lemon-squeezy';

export async function POST(request: Request) {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return new NextResponse('webhook secret missing', { status: 503 });
  }

  const raw = await request.text();
  const signature = request.headers.get('X-Signature') ?? request.headers.get('x-signature');
  if (!verifyLemonSignature(raw, signature, secret)) {
    return new NextResponse('invalid signature', { status: 401 });
  }

  let payload: {
    meta?: { event_name?: string; custom_data?: Record<string, string> };
    data?: { id?: string; attributes?: { variant_id?: number; user_email?: string; status?: string } };
  } = {};
  try {
    payload = JSON.parse(raw) as typeof payload;
  } catch {
    return new NextResponse('invalid json', { status: 400 });
  }

  const event = payload.meta?.event_name ?? 'unknown';
  const sku = skuFromWebhook(payload);
  console.info('[lemon squeezy webhook]', {
    event,
    sku,
    status: payload.data?.attributes?.status,
    hasEmail: Boolean(payload.data?.attributes?.user_email),
  });

  return new NextResponse(null, { status: 200 });
}
