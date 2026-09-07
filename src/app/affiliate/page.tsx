import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate — Agents61',
  description: 'Agents61 affiliate program: share isolated-committee research with US investors.',
};

export default function AffiliatePage() {
  return (
    <>
      <Navbar />
      <div className="section-container py-16">
        <div className="max-w-3xl">
          <div className="badge badge-primary mb-4">Affiliate</div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Share the committee. Keep it honest.
          </h1>
          <p className="text-lg text-slate-600 mb-10">
            For newsletters, educators, and research writers whose audience already looks at
            10-Ks. Not for signal groups. Commission is on paid seating — Analyst through Partners —
            not on fake “hot tickers.”
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {[
            { t: 'Rate', d: '20% of first-year paid subscription, paid monthly after a 30-day clawback.' },
            { t: 'Cookie', d: '60 days. Preview signups that later upgrade still attribute if they stay in-window.' },
            { t: 'What you may say', d: 'Research simulation. Isolated briefs. Not advice. No “this is a buy.”' },
          ].map((c) => (
            <div key={c.t} className="card p-6">
              <h2 className="text-sm font-bold text-slate-900">{c.t}</h2>
              <p className="text-sm text-slate-600 mt-2">{c.d}</p>
            </div>
          ))}
        </div>

        <div className="card-flat p-6 md:p-8 max-w-3xl">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Apply</h2>
          <p className="text-sm text-slate-600 mb-4">
            Tracking links are not self-serve in this preview. Send audience, channel, and
            sample posts. We review monthly. No paid-signal Discords.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact affiliates
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
