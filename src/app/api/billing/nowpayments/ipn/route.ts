import { NextResponse } from 'next/server';
import { parseOrder, paidStatus, verifyNowIpn, type NowPayment } from '@/lib/nowpayments';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const raw = await request.text();
  const sig = request.headers.get('x-nowpayments-sig');
  if (!verifyNowIpn(raw, sig)) {
    return NextResponse.json({ error: 'Invalid IPN signature.' }, { status: 401 });
  }

  let body: NowPayment = {};
  try {
    body = JSON.parse(raw) as NowPayment;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const order = parseOrder(body.order_id, body.order_description);
  if (!order) {
    return NextResponse.json({ ok: true, ignored: 'unparsed order' });
  }

  return NextResponse.json({
    ok: true,
    paid: paidStatus(body.payment_status),
    sku: order.sku,
    interval: order.interval,
  });
}
