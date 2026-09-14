'use client';

import { useEffect, useMemo, useState, type FormEvent, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CreditCard, RefreshCw, Timer } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CheckoutShell from '@/components/checkout/CheckoutShell';
import { EMAIL_COOKIE, persistDeskSession, readDeskSession, writeClientCookie } from '@/lib/demo-session';
import {
  FLASH_OFFER_ID,
  FLASH_OFFER_PERCENT,
  flashAmountForSku,
  formatFlashCountdown,
  listAmountForSku,
} from '@/lib/flash-offer';
import { PLANS, type PaidPlanId } from '@/lib/tiers';
import { TOKEN_PACKS, type TokenPackId } from '@/lib/token-extras';
import type { WaffoInterval, WaffoSku } from '@/lib/waffo';

type Sku = PaidPlanId | 'founding';
type Interval = 'monthly' | 'yearly';

function parseSku(raw: string | null): Sku {
  if (raw === 'founding') return 'founding';
  if (raw === 'associate' || raw === 'principal' || raw === 'committee' || raw === 'partners') {
    return raw;
  }
  return 'analyst';
}

function parseExtraSku(raw: string | null): TokenPackId | null {
  if (raw === 'pack-25' || raw === 'pack-80') return raw;
  return null;
}

function skuToPlan(sku: Sku): PaidPlanId {
  return sku === 'founding' ? 'committee' : sku;
}

export default function WaffoCheckoutPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="section-container py-16 text-sm text-slate-500">Loading checkout…</div>}>
        <WaffoCheckoutForm />
      </Suspense>
      <Footer />
    </>
  );
}

function WaffoCheckoutForm() {
  const params = useSearchParams();
  const extraSku = parseExtraSku(params.get('sku') ?? params.get('plan'));
  if (extraSku) return <WaffoExtraCheckoutForm sku={extraSku} />;
  return <WaffoSeatCheckoutForm />;
}

function WaffoExtraCheckoutForm({ sku }: { sku: TokenPackId }) {
  const params = useSearchParams();
  const returned = params.get('paid') === '1';
  const [picked, setPicked] = useState<TokenPackId>(sku);
  const [email, setEmail] = useState(() => readDeskSession()?.email ?? '');
  const [busy, setBusy] = useState<'pay' | 'confirm' | ''>('');
  const [error, setError] = useState('');
  const pack = TOKEN_PACKS.find((p) => p.id === picked) ?? TOKEN_PACKS[0];

  async function pay(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy('pay');
    try {
      const res = await fetch('/api/billing/waffo/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku: picked, email }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Could not start card checkout. Try again in a moment.');
        return;
      }
      window.open(data.url, '_blank', 'noopener,noreferrer');
    } catch {
      setError('Network error.');
    } finally {
      setBusy('');
    }
  }

  async function confirm(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy('confirm');
    try {
      const res = await fetch('/api/billing/waffo/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sku: picked }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        kind?: string;
        email?: string;
        remaining?: number;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.email) {
        setError(data.error ?? 'Payment not found yet.');
        return;
      }
      writeClientCookie(EMAIL_COOKIE, encodeURIComponent(data.email));
      const session = readDeskSession();
      if (session) persistDeskSession({ ...session, email: data.email });
      window.location.href = '/dashboard?entry=clerk&extra=filing_extract';
    } catch {
      setError('Network error.');
    } finally {
      setBusy('');
    }
  }

  return (
    <CheckoutShell
      kicker="Cards · Apple Pay · Google Pay — Waffo Pancake"
      title="Pay for token extras, then run them on the desk"
      subtitle={
        <>
          One-time pack. Filing extract and trigger / invalidation runs debit one extra each.
          Seat briefs stay on the monthly desk. Research simulation — not a buy or sell ticket.
        </>
      }
    >
      {returned && (
        <p className="mb-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
          Payment window finished? Confirm below with the same email — approval can take a few
          seconds.
        </p>
      )}

      <form onSubmit={pay} className="checkout-panel space-y-4">
        <div>
          <label className="checkout-label" htmlFor="extra-sku">
            Extra pack
          </label>
          <select
            id="extra-sku"
            value={picked}
            onChange={(e) => setPicked(e.target.value as TokenPackId)}
            className="checkout-field"
          >
            {TOKEN_PACKS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · ${p.priceUsd} · {p.runs} DeepSeek V4 runs
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="checkout-label" htmlFor="extra-email">
            Email
          </label>
          <input
            id="extra-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="checkout-field"
            placeholder="you@example.com"
          />
        </div>
        <p className="text-sm text-slate-500">
          {pack.name} · ${pack.priceUsd} one-time · {pack.runs} extras
        </p>
        {error && busy !== 'confirm' && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={Boolean(busy)} className="btn-primary w-full justify-center">
          <CreditCard className="h-4 w-4" strokeWidth={2} />
          Continue to secure card checkout
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <p className="text-xs text-slate-400 text-center">
          Processed by Waffo Pancake, our Merchant of Record. Opens in a new tab.
        </p>
      </form>

      <form onSubmit={confirm} className="checkout-panel space-y-3 mt-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <RefreshCw className="h-4 w-4 text-[#0052d9]" strokeWidth={2} />
          Already paid? Confirm this email
        </div>
        <p className="text-sm text-slate-500">
          Use the same address you entered at checkout. We credit the pack, then open the clerk
          extra tray.
        </p>
        {error && (busy === 'confirm' || returned) && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={Boolean(busy)} className="btn-secondary w-full justify-center">
          Credit this pack
        </button>
      </form>

      <p className="mt-5 text-sm text-slate-500 text-center">
        Need seating too?{' '}
        <Link href="/checkout/waffo" className="font-semibold text-[#0052d9] hover:underline">
          Desk by card
        </Link>
      </p>
    </CheckoutShell>
  );
}

function WaffoSeatCheckoutForm() {
  const params = useSearchParams();
  const returned = params.get('paid') === '1';
  const promoParam = params.get('promo');
  const [sku, setSku] = useState<Sku>(parseSku(params.get('plan')));
  const [interval, setInterval] = useState<Interval>(
    params.get('interval') === 'yearly' || parseSku(params.get('plan')) === 'founding'
      ? 'yearly'
      : 'monthly'
  );
  const [email, setEmail] = useState(() => readDeskSession()?.email ?? '');
  const [busy, setBusy] = useState<'pay' | 'confirm' | ''>('');
  const [error, setError] = useState('');
  const [flash, setFlash] = useState<{
    active: boolean;
    expiresAt?: number;
  }>({ active: false });
  const [, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/billing/flash-offer', { cache: 'no-store' });
        const data = (await res.json()) as {
          active?: boolean;
          expiresAt?: number;
        };
        if (cancelled) return;
        setFlash({
          active: Boolean(data.active),
          expiresAt: data.expiresAt,
        });
      } catch {
        if (!cancelled) setFlash({ active: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!flash.active || !flash.expiresAt) return;
    const id = window.setInterval(() => {
      if (Date.now() >= (flash.expiresAt ?? 0)) {
        setFlash({ active: false });
      } else {
        setTick((n) => n + 1);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [flash.active, flash.expiresAt]);

  const planId = skuToPlan(sku);
  const payInterval: Interval = sku === 'founding' ? 'yearly' : interval;
  const flashLive = flash.active && Boolean(flash.expiresAt && flash.expiresAt > Date.now());
  const applyPromo = flashLive || promoParam === FLASH_OFFER_ID;
  const showFlashPrice = flashLive;
  const list = listAmountForSku(sku as WaffoSku, payInterval as WaffoInterval);
  const flashAmt = flashAmountForSku(sku as WaffoSku, payInterval as WaffoInterval);
  const remainingMs = flash.expiresAt ? Math.max(0, flash.expiresAt - Date.now()) : 0;

  const title = useMemo(() => {
    if (sku === 'founding') {
      if (showFlashPrice && list && flashAmt) {
        return `Founding Committee · $${flashAmt} / year (was $${list})`;
      }
      return 'Founding Committee · $1,190 / year by card';
    }
    const plan = PLANS[planId];
    if (showFlashPrice && list && flashAmt) {
      return payInterval === 'yearly'
        ? `${plan.name} · $${flashAmt} / year (was $${list}) · −${FLASH_OFFER_PERCENT}%`
        : `${plan.name} · $${flashAmt}/mo (was $${list}) · −${FLASH_OFFER_PERCENT}%`;
    }
    return payInterval === 'yearly'
      ? `${plan.name} · ${plan.yearly ?? 'annual'} by card`
      : `${plan.name} · ${plan.price}${plan.period} by card`;
  }, [planId, sku, payInterval, showFlashPrice, list, flashAmt]);

  async function pay(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy('pay');
    try {
      const res = await fetch('/api/billing/waffo/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku,
          interval: payInterval,
          email,
          ...(applyPromo || flashLive ? { promo: FLASH_OFFER_ID } : {}),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string; flashOffer?: boolean };
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Could not start card checkout. Try again in a moment.');
        return;
      }
      window.open(data.url, '_blank', 'noopener,noreferrer');
    } catch {
      setError('Network error.');
    } finally {
      setBusy('');
    }
  }

  async function confirm(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy('confirm');
    try {
      const res = await fetch('/api/billing/waffo/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sku }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        plan?: PaidPlanId;
        email?: string;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.plan || !data.email) {
        setError(data.error ?? 'Payment not found yet.');
        return;
      }
      persistDeskSession({ email: data.email, plan: data.plan, ticker: 'AAPL' });
      window.location.href = `/dashboard?entry=analyze&plan=${data.plan}`;
    } catch {
      setError('Network error.');
    } finally {
      setBusy('');
    }
  }

  return (
    <CheckoutShell
      kicker="Cards · Apple Pay · Google Pay — Waffo Pancake"
      title="Pay by card, then unlock the desk"
      subtitle={
        <>
          Visa, Mastercard, Apple Pay, and Google Pay in 170+ countries. Waffo Pancake is the
          Merchant of Record — tax and compliance handled. After paying, come back to this tab and
          confirm the same email. Research simulation only — there is no buy button on the desk.
        </>
      }
    >
      {returned && (
        <p className="mb-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
          Payment window finished? Confirm below with the same email — approval can take a few
          seconds.
        </p>
      )}

      {showFlashPrice && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#0052d9]/20 bg-blue-50 px-4 py-3">
          <Timer className="mt-0.5 h-4 w-4 shrink-0 text-[#0052d9]" strokeWidth={2} />
          <div className="min-w-0 text-sm">
            <p className="font-bold text-slate-900">
              {FLASH_OFFER_PERCENT}% flash offer active · {formatFlashCountdown(remainingMs)} left
            </p>
            <p className="mt-0.5 text-xs text-slate-600">
              Checkout charges the discounted price. List price returns when the timer ends.
            </p>
          </div>
        </div>
      )}

      {promoParam === FLASH_OFFER_ID && !showFlashPrice && (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Offer window expired or not activated — checkout uses list price. Return to the desk to
          claim again if still eligible.
        </p>
      )}

      <form onSubmit={pay} className="checkout-panel space-y-4">
        <div>
          <label className="checkout-label" htmlFor="sku">
            Desk
          </label>
          <select
            id="sku"
            value={sku}
            onChange={(e) => {
              const next = parseSku(e.target.value);
              setSku(next);
              if (next === 'founding') setInterval('yearly');
            }}
            className="checkout-field"
          >
            {(['analyst', 'associate', 'principal', 'committee', 'partners'] as const).map((id) => (
              <option key={id} value={id}>
                {PLANS[id].name} · {PLANS[id].price}/mo · {PLANS[id].yearly ?? 'annual'}
              </option>
            ))}
            <option value="founding">Founding Committee · $1,190/year</option>
          </select>
        </div>

        {sku !== 'founding' && (
          <fieldset>
            <legend className="checkout-label">Billing</legend>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {(['monthly', 'yearly'] as const).map((id) => (
                <label
                  key={id}
                  className={`checkout-toggle ${interval === id ? 'checkout-toggle-active' : ''}`}
                >
                  <input
                    type="radio"
                    name="interval"
                    className="sr-only"
                    checked={interval === id}
                    onChange={() => setInterval(id)}
                  />
                  {id === 'monthly' ? 'Monthly' : 'Yearly'}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <div>
          <label className="checkout-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="checkout-field"
            placeholder="you@example.com"
          />
        </div>

        <div className="text-sm text-slate-500">
          <p>{title}</p>
          {showFlashPrice && list && flashAmt && (
            <p className="mt-1 text-xs text-slate-400">
              Was ${list} → Now ${flashAmt}
            </p>
          )}
        </div>
        {error && busy !== 'confirm' && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={Boolean(busy)} className="btn-primary w-full justify-center">
          <CreditCard className="h-4 w-4" strokeWidth={2} />
          Continue to secure card checkout
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <p className="text-xs text-slate-400 text-center">
          Processed by Waffo Pancake, our Merchant of Record. Opens in a new tab.
        </p>
      </form>

      <form onSubmit={confirm} className="checkout-panel space-y-3 mt-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <RefreshCw className="h-4 w-4 text-[#0052d9]" strokeWidth={2} />
          Already paid? Confirm this email
        </div>
        <p className="text-sm text-slate-500">
          Use the same address you entered at checkout. We verify the payment, then unlock the
          matching desk on this device.
        </p>
        {error && (busy === 'confirm' || returned) && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={Boolean(busy)} className="btn-secondary w-full justify-center">
          Unlock this desk
        </button>
      </form>

      <p className="mt-5 text-sm text-slate-500 text-center">
        Prefer crypto?{' '}
        <Link href={`/checkout/nowpayments?plan=${sku}`} className="font-semibold text-[#0052d9] hover:underline">
          NOWPayments invoice
        </Link>
        {' · '}
        <Link href={`/checkout/usdt?plan=${sku}`} className="font-semibold text-[#0052d9] hover:underline">
          Annual USDT backup
        </Link>
      </p>
    </CheckoutShell>
  );
}
