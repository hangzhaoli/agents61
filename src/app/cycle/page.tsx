import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CycleMeterCard from '@/components/cycle/CycleMeterCard';
import { pageMeta, PAGE_DESCRIPTIONS } from '@/lib/seo/meta';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMeta({
  title: 'Market cycle meter — Dalio, Marks, Templeton',
  description: PAGE_DESCRIPTIONS.cycle,
  path: '/cycle',
});

export default function CyclePage() {
  return (
    <>
      <Navbar />
      <div className="section-container py-16">
        <div className="text-center mb-12">
          <div className="badge badge-primary mb-4 mx-auto">Cycle Meter</div>
          <h1 className="text-4xl font-extrabold text-slate-900">Where are we in the cycle?</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Dalio’s debt cycle, Marks’s pendulum, Templeton’s sentiment — isolated notes, then one
            0–100 reading. Not a timing service.
          </p>
        </div>
        <CycleMeterCard />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto mt-12">
          <div className="rounded-2xl border border-slate-100 p-5">
            <div className="text-sm font-bold text-slate-900">Analyst</div>
            <p className="text-sm text-slate-600 mt-2">
              Unlocks Dalio, Marks, and Templeton as isolated notes, then the same clerk pass.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 p-5">
            <div className="text-sm font-bold text-slate-900">Associate</div>
            <p className="text-sm text-slate-600 mt-2">
              29 seats: extra cycle and red-team voices. $49 is not a 61-seat run.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 p-5">
            <div className="text-sm font-bold text-slate-900">Principal</div>
            <p className="text-sm text-slate-600 mt-2">
              48 seats. Expanded specialists. Exit desk still stays dark.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 p-5">
            <div className="text-sm font-bold text-slate-900">Committee · Partners</div>
            <p className="text-sm text-slate-600 mt-2">
              Full cycle specialists. Same 61; Partners is more runs, not a louder chat.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
