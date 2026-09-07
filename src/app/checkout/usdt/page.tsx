'use client';

import { useMemo, useState, type FormEvent, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Copy, Wallet } from 'lucide-react';
import CheckoutShell from '@/components/checkout/CheckoutShell';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { persistDeskSession } from '@/lib/demo-session';
import { PLANS, type PaidPlanId } from '@/lib/tiers';
import { parseUsdtSku, skuToPlan, USDT_FOUNDING_YEARLY, USDT_YEARLY, type UsdtSku } from '@/lib/usdt-catalog';

type Invoice = {
  token: string;
  email: string;
  sku: UsdtSku;
  amount: string;
  address: string;
  chain: 'trc20' | 'erc20';
  qrDataUrl: string;
};

export default function UsdtCheckoutPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="section-container py-16 text-sm text-slate-500">Loading USDT checkout…</div>}>
        <UsdtCheckoutForm />
      </Suspense>
      <Footer />
    </>
  );
}

function UsdtCheckoutForm() {
  const params = useSearchParams();
  const initial = parseUsdtSku(params.get('plan')) ?? 'analyst';
  const [sku, setSku] = useState<UsdtSku>(initial);
  const [email, setEmail] = useState('');
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [txid, setTxid] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const planId: PaidPlanId = skuToPlan(sku);
  const listPrice = sku === 'founding' ? USDT_FOUNDING_YEARLY : USDT_YEARLY[sku];

  const title = useMemo(() => {
    if (sku === 'founding') return 'Founding Committee · one year';
    return `${PLANS[planId].name} · one year`;
  }, [planId, sku]);

  async function makeInvoice(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/billing/usdt/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku, email }),
      });
      const data = (await res.json()) as Invoice & { error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Could not create the invoice.');
        return;
      }
      setInvoice(data);
    } catch {
      setError('Network error.');
    } finally {
      setBusy(false);
    }
  }

  async function confirm(e: FormEvent) {
    e.preventDefault();
    if (!invoice) return;
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/billing/usdt/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: invoice.token, txid }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        plan?: PaidPlanId;
        email?: string;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.plan || !data.email) {
        setError(data.error ?? 'Not confirmed on-chain yet.');
        return;
      }
      persistDeskSession({ email: data.email, plan: data.plan, ticker: 'AAPL' });
      window.location.href = `/dashboard?entry=analyze&plan=${data.plan}`;
    } catch {
      setError('Network error.');
    } finally {
      setBusy(false);
    }
  }

  async function copy(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(''), 1500);
  }

  return (
    <CheckoutShell
      kicker="Backup rail · annual USDT"
      title="Pay one year in USDT."
      subtitle={
        <>
          Static wallet QR on TRON (TRC-20). Send the <strong>exact</strong> amount, then paste the
          transaction hash to unlock. Cards go through Waffo Pancake; NOWPayments is the crypto
          invoice path. This QR is the annual USDT backup.
        </>
      }
    >
        {!invoice ? (
          <form onSubmit={makeInvoice} className="checkout-panel space-y-4">
            <div>
              <label className="checkout-label" htmlFor="sku">
                Desk
              </label>
              <select
                id="sku"
                value={sku}
                onChange={(e) => setSku(parseUsdtSku(e.target.value) ?? 'analyst')}
                className="checkout-field"
              >
                {(['analyst', 'associate', 'principal', 'committee', 'partners'] as const).map((id) => (
                  <option key={id} value={id}>
                    {PLANS[id].name} · {USDT_YEARLY[id]} USDT / year
                  </option>
                ))}
                <option value="founding">Founding Committee · {USDT_FOUNDING_YEARLY} USDT / year</option>
              </select>
            </div>
            <p className="text-sm text-slate-500">{title}. List {listPrice} USDT before unique cents.</p>
            <div>
              <label className="checkout-label" htmlFor="email">
                Email for this desk
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
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={busy} className="btn-primary w-full justify-center">
              Generate receive QR
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </form>
        ) : (
          <div className="checkout-panel space-y-5">
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={invoice.qrDataUrl} alt="USDT receive QR" className="mx-auto rounded-xl border border-slate-100" width={220} height={220} />
              <p className="mt-2 text-xs text-slate-400 uppercase tracking-wider">
                USDT · {invoice.chain.toUpperCase()}
              </p>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Send exactly</div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-2xl font-extrabold text-slate-900">{invoice.amount} USDT</span>
                <button type="button" className="btn-secondary !py-2 text-sm" onClick={() => copy('amount', invoice.amount)}>
                  <Copy className="h-4 w-4" />
                  {copied === 'amount' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">Cents are unique to this invoice. Do not round.</p>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Address</div>
              <div className="flex items-start gap-2">
                <code className="text-xs break-all text-slate-700 flex-1">{invoice.address}</code>
                <button type="button" className="btn-secondary !py-2 text-sm shrink-0" onClick={() => copy('addr', invoice.address)}>
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <form onSubmit={confirm} className="space-y-3 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider" htmlFor="txid">
                Transaction hash
              </label>
              <input
                id="txid"
                required
                value={txid}
                onChange={(e) => setTxid(e.target.value)}
                placeholder="Paste the TRON tx id after it confirms"
                className="checkout-field"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={busy} className="btn-primary w-full justify-center">
                <Wallet className="h-4 w-4" strokeWidth={2} />
                Confirm on-chain and unlock
              </button>
            </form>
          </div>
        )}

        <p className="mt-5 text-sm text-slate-500 text-center">
          Prefer a card?{' '}
          <Link href={`/checkout/waffo?plan=${sku}`} className="font-semibold text-[#0052d9] hover:underline">
            Waffo Pancake (Merchant of Record)
          </Link>
          {' · '}
          <Link href="/checkout/nowpayments" className="font-semibold text-[#0052d9] hover:underline">
            NOWPayments invoice
          </Link>
        </p>
    </CheckoutShell>
  );
}
