'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { MARKETING_PLAN_IDS, PLANS, type PaidPlanId } from '@/lib/tiers';

const CTA: Record<PaidPlanId, string> = {
  analyst: 'Start 7-day trial',
  associate: 'Staff Associate',
  principal: 'Staff Principal',
  committee: 'Go Committee',
  partners: 'Go Partners',
};

export default function PaidPlanGrid({ highlight = 'principal' }: { highlight?: PaidPlanId }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 pt-5">
      {MARKETING_PLAN_IDS.map((id) => {
        const plan = PLANS[id];
        const featured = id === highlight;
        return (
          <div
            key={id}
            className={`card p-6 flex flex-col relative overflow-visible ${
              featured ? 'border-[#0052d9] border-2 pt-8 shadow-lg shadow-[#0052d9]/10' : ''
            }`}
          >
            {featured && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="badge bg-[#0052d9] text-white shadow-md px-3 whitespace-nowrap">
                  Most popular
                </div>
              </div>
            )}
            <div
              className={`text-sm font-semibold uppercase tracking-wider mb-1 ${
                featured ? 'text-[#0052d9]' : 'text-slate-500'
              }`}
            >
              {plan.name}
            </div>
            <div className="text-xs font-semibold text-slate-400 mb-3">{plan.style}</div>
            <div className="text-sm font-bold text-slate-900 mb-2">{plan.seats} seats</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl xl:text-4xl font-extrabold text-slate-900">{plan.price}</span>
              <span className="text-slate-500">{plan.period}</span>
            </div>
            {plan.yearly && <div className="text-sm text-slate-500 mb-3">{plan.yearly}</div>}
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">{plan.tagline}</p>
            <ul className="space-y-2.5 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={`/checkout/waffo?plan=${id}`}
              className={`mt-7 justify-center ${featured ? 'btn-primary' : 'btn-secondary'}`}
            >
              {CTA[id]}
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
