import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { normalizeEmail } from '@/lib/demo-session';
import { FLASH_OFFER_COOKIE, FLASH_OFFER_ID, parseFlashCookie } from '@/lib/flash-offer';
import {
  createWaffoCheckout,
  parseWaffoInterval,
  parseWaffoSku,
  waffoClient,
  waffoConfigured,
} from '@/lib/waffo';
import {
  createWaffoExtraCheckout,
  parseWaffoExtraSku,
  waffoExtraProductId,
} from '@/lib/waffo-extras';

export async function POST(request: Request) {
  let body: { sku?: string; interval?: string; email?: string; promo?: string } = {};
  try {
    body = (await request.json()) as {
      sku?: string;
      interval?: string;
      email?: string;
      promo?: string;
    };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const extraSku = parseWaffoExtraSku(body.sku);
  const seatSku = parseWaffoSku(body.sku);
  if (!extraSku && !seatSku) {
    return NextResponse.json({ error: 'Pick a paid desk or extra pack.' }, { status: 400 });
  }
  if (extraSku && (!waffoClient() || !waffoExtraProductId(extraSku))) {
    return NextResponse.json(
      { error: 'Extra packs are missing Waffo product IDs on this server.' },
      { status: 503 }
    );
  }
  if (seatSku && !waffoConfigured()) {
    return NextResponse.json(
      {
        error:
          'Card checkout is missing Waffo merchant credentials or product IDs on this server.',
      },
      { status: 503 }
    );
  }

  const email = normalizeEmail(body.email ?? '');
  if (!email.includes('@')) {
    return NextResponse.json({ error: 'Need a valid email for checkout.' }, { status: 400 });
  }

  // Real discount only when the httpOnly flash cookie is still valid — never trust promo alone.
  const jar = await cookies();
  const flashState = parseFlashCookie(jar.get(FLASH_OFFER_COOKIE)?.value);
  const wantsFlash = body.promo === FLASH_OFFER_ID || Boolean(flashState);
  const flashOffer = Boolean(wantsFlash && flashState);

  try {
    const url = extraSku
      ? await createWaffoExtraCheckout({ sku: extraSku, email })
      : await createWaffoCheckout({
          sku: seatSku!,
          interval: seatSku === 'founding' ? 'yearly' : parseWaffoInterval(body.interval),
          email,
          flashOffer,
        });
    return NextResponse.json({ url, flashOffer: flashOffer || undefined });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not create checkout.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
