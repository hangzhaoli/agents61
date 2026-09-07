'use client';

import { useMemo, useState, type FormEvent, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Bitcoin, RefreshCw } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CheckoutShell from '@/components/checkout/CheckoutShell';
import { persistDeskSession, readDeskSession } from '@/lib/demo-session';
import { PLANS, type PaidPlanId } from '@/lib/tiers';
import { USDT_FOUNDING_YEARLY, USDT_YEARLY } from '@/lib/usdt-catalog';

type Sku = PaidPlanId | 'founding';
type Interval = 'monthly' | 'yearly';

function parseSku(raw: string | null): Sku {
  if (raw === 'founding') return 'founding';
  if (raw === 'associate' || raw === 'principal' || raw === 'committee' || raw === 'partners') {
    return raw;
  }
  return 'analyst';
}

function skuToPlan(sku: Sku): PaidPlanId {
  return sku === 'founding' ? 'committee' : sku;
}

export default function NowPaymentsCheckoutPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="section-container py-16 text-sm text-slate-500">Loading checkout…</div>}>
        <NowCheckoutForm />
      </Suspense>
      <Footer />
    </>
  );
}

function NowCheckoutForm() {
  const params = useSearchParams();
  const returned = params.get('paid') === '1' || Boolean(params.get('NP_id') || params.get('paymentId'));
  const paymentId = params.get('NP_id') || params.get('paymentId') || params.get('payment_id') || '';
  const [sku, setSku] = useState<Sku>(parseSku(params.get('plan')));
  const [interval, setInterval] = useState<Interval>(
    params.get('interval') === 'yearly' || parseSku(params.get('plan')) === 'founding'
      ? 'yearly'
      : 'monthly'
  );
  const [email, setEmail] = useState(() => readDeskSession()?.email ?? '');
  const [busy, setBusy] = useState<'pay' | 'confirm' | ''>('');
  const [error, setError] = useState('');

  const planId = skuToPlan(sku);
  const payInterval: Interval = sku === 'founding' ? 'yearly' : interval;

  const title = useMemo(() => {
    if (sku === 'founding') return 'Founding Committee · $1,190 / year in crypto';
    const plan = PLANS[planId];
    return payInterval === 'yearly'
      ? `${plan.name} · ${plan.yearly ?? 'annual'} in crypto`
      : `${plan.name} · ${plan.price}${plan.period} in crypto`;
  }, [planId, sku, payInterval]);

  async function pay(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy('pay');
    try {
      const res = await fetch('/api/billing/nowpayments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku, interval: payInterval, email }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? 'NOWPayments is not live yet. Set NOWPAYMENTS_API_KEY.');
        return;
      }
      window.location.href = data.url;
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
      const res = await fetch('/api/billing/nowpayments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          sku,
          interval: payInterval,
          paymentId: paymentId || undefined,
        }),
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
      kicker="Crypto · NOWPayments"
      title="Crypto subscription, then unlock"
      subtitle={
        <>
          Pay in USDT-TRC20 or other coins NOWPayments lists. After the payment finishes, come back
          and confirm the same email. Research simulation only — there is no buy button on the desk.
        </>
      }
    >
      {returned && (
        <p className="mb-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
          If the invoice is finished, confirm below. Network confirmation can take a few minutes.
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
                {PLANS[id].name} · {PLANS[id].price}/mo · ${USDT_YEARLY[id]}/yr
              </option>
            ))}
            <option value="founding">Founding Committee · ${USDT_FOUNDING_YEARLY}/year</option>
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

        <p className="text-sm text-slate-500">{title}</p>
        {error && busy !== 'confirm' && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={Boolean(busy)} className="btn-primary w-full justify-center">
          <Bitcoin className="h-4 w-4" strokeWidth={2} />
          Continue to NOWPayments
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </form>

      <form onSubmit={confirm} className="checkout-panel space-y-3 mt-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <RefreshCw className="h-4 w-4 text-[#0052d9]" strokeWidth={2} />
          Already paid? Confirm this email
        </div>
        <p className="text-sm text-slate-500">
          Use the same address you entered on the invoice. We look up a finished payment, then unlock
          the matching desk.
        </p>
        {error && (busy === 'confirm' || returned) && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={Boolean(busy)} className="btn-secondary w-full justify-center">
          Unlock this desk
        </button>
      </form>

      <p className="mt-5 text-sm text-slate-500 text-center">
        Prefer a card?{' '}
        <Link href={`/checkout/waffo?plan=${sku}`} className="font-semibold text-[#0052d9] hover:underline">
          Waffo Pancake (Merchant of Record)
        </Link>
        {' · '}
        <Link href={`/checkout/usdt?plan=${sku}`} className="font-semibold text-[#0052d9] hover:underline">
          Annual USDT backup
        </Link>
      </p>
    </CheckoutShell>
  );
}
