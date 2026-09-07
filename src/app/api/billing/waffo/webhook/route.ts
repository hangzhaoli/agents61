import { NextResponse } from 'next/server';
import { verifyWebhook, type WebhookEventData } from '@waffo/pancake-ts';
import { parseWaffoExternalRef, parseWaffoSku, parseWaffoInterval, waffoClient } from '@/lib/waffo';
import { parseWaffoExtraRef, parseWaffoExtraSku } from '@/lib/waffo-extras';
import { recordWaffoEvent } from '@/lib/billing/waffo-ledger';

/**
 * Waffo webhook. Raw body is mandatory — parsed JSON breaks RSA-SHA256
 * signature verification. Register in the Waffo dashboard (or via SDK):
 *   URL:    https://agents61.com/api/billing/waffo/webhook
 *   Events: order.completed, subscription.activated, subscription.payment_succeeded,
 *           subscription.canceling, subscription.uncanceled, subscription.updated,
 *           subscription.canceled, subscription.past_due, refund.succeeded
 */
export async function POST(request: Request) {
  if (!waffoClient()) {
    return new NextResponse('waffo not configured', { status: 503 });
  }

  const raw = await request.text();
  const signature = request.headers.get('x-waffo-signature');

  let event;
  try {
    event = verifyWebhook<WebhookEventData>(raw, signature);
  } catch {
    return new NextResponse('invalid signature', { status: 401 });
  }

  const data = event.data ?? ({} as WebhookEventData);
  const fromSeat = parseWaffoExternalRef(data.orderMerchantExternalId);
  const fromExtra = parseWaffoExtraRef(data.orderMerchantExternalId);
  const extraSku =
    parseWaffoExtraSku(data.orderMetadata?.a61_sku) ?? fromExtra?.sku ?? null;
  const sku =
    extraSku ?? parseWaffoSku(data.orderMetadata?.a61_sku) ?? fromSeat?.sku ?? null;
  const interval = extraSku
    ? 'once'
    : parseWaffoInterval(data.orderMetadata?.a61_interval ?? data.billingPeriod) ??
      fromSeat?.interval ??
      null;
  const email = (data.buyerEmail ?? fromExtra?.email ?? fromSeat?.email ?? '').trim().toLowerCase();

  try {
    await recordWaffoEvent({
      deliveryId: event.id,
      mode: event.mode ?? 'prod',
      eventType: event.eventType,
      buyerEmail: email,
      sku,
      interval,
      orderId: data.orderId ?? null,
      orderStatus: data.orderStatus ?? data.paymentStatus ?? null,
      amount: data.amount ?? null,
      currency: data.currency ?? null,
      payload: event,
    });
  } catch (err) {
    console.error('[waffo webhook] ledger write failed', err);
  }

  console.info('[waffo webhook]', {
    event: event.eventType,
    mode: event.mode,
    sku,
    interval,
    status: data.orderStatus ?? data.paymentStatus,
    hasEmail: Boolean(email),
  });

  return new NextResponse(null, { status: 200 });
}
