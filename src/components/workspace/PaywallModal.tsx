'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lock, X } from 'lucide-react';
import { flashCheckoutHref } from '@/lib/flash-offer';
import { MARKETING_PLAN_IDS, PLANS, type PaidPlanId } from '@/lib/tiers';

function checkoutHref(plan: PaidPlanId, flashActive: boolean) {
  return flashActive ? flashCheckoutHref(plan) : `/checkout/waffo?plan=${plan}`;
}

export default function PaywallModal({
  open,
  remainingCount,
  onClose,
}: {
  open: boolean;
  remainingCount: number;
  onClose: () => void;
}) {
  const [flashActive, setFlashActive] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/billing/flash-offer', { cache: 'no-store' });
        const data = (await res.json()) as { active?: boolean };
        if (!cancelled) setFlashActive(Boolean(data.active));
      } catch {
        if (!cancelled) setFlashActive(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  if (!open) return null;

  const analyst = PLANS.analyst;
  const rest = MARKETING_PLAN_IDS.filter((id) => id !== 'analyst');

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close paywall"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="paywall-title"
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,82,217,0.12)] border border-slate-100 p-6 md:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 h-9 w-9 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-[#0052d9] px-3 py-1 text-xs font-semibold mb-3">
          <Lock className="h-3.5 w-3.5" strokeWidth={2} />
          Remaining committee locked
        </div>
        <h2 id="paywall-title" className="text-xl md:text-2xl font-extrabold text-slate-900 pr-8">
          Unlock the rest of the committee
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          The first isolated briefs are a sample. Remaining briefs
          {remainingCount > 0 ? ` (${remainingCount})` : ''}, the clerk stack, and download stay
          dark until a paid desk is on. Analyst is the working 16 — each seat writes alone.
        </p>
        {flashActive && (
          <p className="mt-3 rounded-xl border border-[#0052d9]/15 bg-blue-50 px-3 py-2 text-xs font-semibold text-[#0052d9]">
            15% flash offer active — checkout charges the discounted price.
          </p>
        )}
        <Link
          href={checkoutHref('analyst', flashActive)}
          className="btn-primary w-full justify-center mt-5"
        >
          Unlock Analyst · {analyst.price}
          {analyst.period} · {analyst.seats} seats
          {flashActive ? ' · −15%' : ''}
        </Link>
        <p className="mt-2 text-center text-xs text-slate-400">
          Cards, Apple Pay, Google Pay via Waffo Pancake (Merchant of Record). Then confirm the
          same email. No buy button on the desk.
        </p>
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Other paid desks
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
            {rest.map((id) => (
              <Link
                key={id}
                href={checkoutHref(id, flashActive)}
                className="text-[#0052d9] hover:underline font-medium"
              >
                {PLANS[id].name} {PLANS[id].price} · {PLANS[id].seats} seats
              </Link>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Associate $49 is 29 seats, not 61. Full 61 starts at Committee.
          </p>
          <Link href="/pricing" className="mt-3 inline-block text-sm font-semibold text-slate-500 hover:text-[#0052d9]">
            Compare seating →
          </Link>
          <Link
            href="/checkout/nowpayments?plan=analyst"
            className="mt-2 block text-sm font-semibold text-[#0052d9] hover:underline"
          >
            Prefer crypto? NOWPayments invoice →
          </Link>
          <Link
            href="/checkout/usdt?plan=analyst"
            className="mt-2 block text-sm font-semibold text-[#0052d9] hover:underline"
          >
            Annual USDT backup →
          </Link>
        </div>
      </div>
    </div>
  );
}
