import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Star, Zap, ShieldCheck } from 'lucide-react';
import { pageMeta, PAGE_DESCRIPTIONS } from '@/lib/seo/meta';
import type { Metadata } from 'next';
import { MARKETING_PLAN_IDS, PLANS, type PaidPlanId } from '@/lib/tiers';
import PaidPlanGrid from '@/components/pricing/PaidPlanGrid';
import { USDT_FOUNDING_YEARLY } from '@/lib/usdt-catalog';

export const metadata: Metadata = pageMeta({
  title: 'Pricing for AI stock research seats',
  description: PAGE_DESCRIPTIONS.pricing,
  path: '/pricing',
});

const COMPARISON: ({ feature: string } & Record<PaidPlanId, string>)[] = [
  { feature: 'Unlocked masters', analyst: '16', associate: '29', principal: '48', committee: '61', partners: '61' },
  { feature: 'Research method', analyst: 'Isolated + debate', associate: 'Isolated + extra red team', principal: 'Isolated + expanded debate', committee: 'Isolated + full roster', partners: 'Isolated + full roster' },
  { feature: 'Compute per report', analyst: '16 + 1', associate: '29 + 1', principal: '48 + 1', committee: '61 + 1', partners: '61 + 1 · priority' },
  { feature: 'Reports', analyst: PLANS.analyst.reports, associate: PLANS.associate.reports, principal: PLANS.principal.reports, committee: PLANS.committee.reports, partners: PLANS.partners.reports },
  { feature: 'Queue', analyst: 'Standard', associate: 'Standard', principal: 'Standard', committee: 'Standard', partners: 'Priority' },
  { feature: 'Red-team / cycle / timing', analyst: 'Working 16 set', associate: '16 + 13 extras', principal: 'Expanded specialists', committee: 'Full', partners: 'Full' },
  { feature: 'Exit discipline', analyst: '—', associate: '—', principal: '—', committee: 'Livermore → Bogle', partners: 'Livermore → Bogle' },
  { feature: 'Stock alerts', analyst: '3', associate: '6', principal: '10', committee: '20', partners: '50' },
  { feature: 'API access', analyst: '—', associate: '—', principal: '—', committee: '10K / mo', partners: '50K / mo' },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <div className="section-container py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Seats and compute, priced honestly
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Each unlocked master is an isolated model pass. You are not buying a group chat.
            Five paid desks: a working 16, a 29-seat Associate bridge ($49 is not 61), a 48-seat Principal pack, then two grades of full 61.
          </p>
        </div>

          <PaidPlanGrid highlight="principal" />

          <p className="mt-8 text-center text-sm text-slate-500">
            Cards, Apple Pay, and Google Pay via{' '}
            <Link href="/checkout/waffo" className="font-semibold text-[#0052d9] hover:underline">
              Waffo Pancake
            </Link>
            {' '}(Merchant of Record). Crypto:{' '}
            <Link href="/checkout/nowpayments" className="font-semibold text-[#0052d9] hover:underline">
              NOWPayments
            </Link>
            {' '}or{' '}
            <Link href="/checkout/usdt" className="font-semibold text-[#0052d9] hover:underline">
              annual USDT (TRC-20)
            </Link>
            . There is no buy button on the desk.
          </p>

        <div className="max-w-2xl mx-auto my-16">
          <div className="card p-8 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Star className="h-6 w-6 text-amber-500" fill="currentColor" />
              <span className="text-xl font-bold text-slate-900">Founding Committee</span>
            </div>
            <p className="text-slate-600 mb-4">
              First 90 days only: <strong className="text-2xl text-[#0052d9]">$1,190/year</strong>
              <span className="text-sm text-slate-500 ml-2">(locked Committee seating)</span>
            </p>
            <ul className="text-sm text-slate-600 space-y-1 mb-6">
              <li className="flex items-center justify-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" fill="currentColor" />
                Exclusive Discord
              </li>
              <li className="flex items-center justify-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-500" fill="currentColor" />
                Early feature previews
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/checkout/waffo?plan=founding" className="btn-primary">
                Claim Founding Committee — card
              </Link>
              <Link href="/checkout/nowpayments?plan=founding" className="btn-secondary">
                Pay in crypto
              </Link>
              <Link href="/checkout/usdt?plan=founding" className="btn-secondary">
                Pay {USDT_FOUNDING_YEARLY} USDT / year
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Full feature comparison
          </h2>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Feature</th>
                    {MARKETING_PLAN_IDS.map((id) => (
                      <th
                        key={id}
                        className={`text-center py-3 px-4 font-semibold ${
                          id === 'principal' ? 'text-[#0052d9]' : 'text-slate-700'
                        }`}
                      >
                        {PLANS[id].name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row) => (
                    <tr key={row.feature} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 px-4 font-medium text-slate-700">{row.feature}</td>
                      {MARKETING_PLAN_IDS.map((id) => (
                        <td
                          key={id}
                          className={`py-3 px-4 text-center ${
                            id === 'principal' ? 'text-slate-900 font-semibold bg-blue-50/40' : 'text-slate-500'
                          }`}
                        >
                          {row[id]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Why 16, 29, 48, and two kinds of 61?',
                a: 'Analyst is the working 16. Associate ($49) adds 13 red-team, cycle, and timing seats — 29 total, not 61. Principal is 48. Committee unlocks the remaining seats including the exit desk. Partners is the same 61 with more reports, priority routing, and API, because a 61-prompt isolated batch is expensive to run often.',
              },
              {
                q: 'Is this a group chat of 61 agents?',
                a: 'No. Each unlocked master writes alone from filings and their own rules. A clerk then stacks agreements and splits. Never 61-squared debate. Empty seats stay empty.',
              },
              {
                q: 'Is this investment advice?',
                a: 'No. Agents61 is a research simulation and educational publication. Isolated briefs never say “you should buy.” There is no buy button and no order routing. We describe the product under the publisher’s exclusion in the Investment Advisers Act of 1940 (Lowe v. SEC). That is our own positioning — it does not rewrite a card processor’s acceptable-use policy.',
              },
              {
                q: 'What markets do you cover?',
                a: 'US stocks first, US ETFs adjacent, US-listed emerging-market ADRs, and a crypto/on-chain research board. A-shares are later. Reports can show P/E and P/B as cached model input, not live quotes.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Monthly plans cancel anytime. Annual plans can be refunded within 30 days.',
              },
              {
                q: 'How do I pay?',
                a: 'Cards, Apple Pay, and Google Pay via Waffo Pancake (our Merchant of Record — they handle global tax and compliance). Crypto invoice on NOWPayments (USDT-TRC20 and other listed coins). Backup: a static annual USDT QR you withdraw yourself.',
              },
            ].map((faq) => (
              <details key={faq.q} className="card-flat p-5 group">
                <summary className="font-semibold text-slate-900 cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-slate-400 group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
