import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { QUANT_MASTERS, QUANT_LAB_DISCLAIMER } from '@/lib/quant-lab/masters';
import { pageMeta } from '@/lib/seo/meta';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMeta({
  title: 'Quant Lab — compile master strategies to Python backtests',
  description:
    'Agents61 Quant Lab: Jesse Livermore, CANSLIM, Turtle rules → strategy spec + yfinance backtest script. Ed Thorp Kelly and overfitting review. Paper research only.',
  path: '/quant-lab',
});

export default function QuantLabPage() {
  return (
    <>
      <Navbar />
      <div className="section-container py-16">
        <div className="max-w-3xl mb-10">
          <div className="badge badge-primary mb-4">Quant Lab</div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Short-term masters → rule-based Python
          </h1>
          <p className="text-lg text-slate-600">
            Pick a timing or exit master. DeepSeek compiles a strategy spec and a paper backtest
            script. Ed Thorp&apos;s quant layer reviews Kelly sizing, significance, and overfitting.
            Save to your Strategy Vault. Not live trading.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {QUANT_MASTERS.map((m) => (
            <div key={m.slug} className="card p-4">
              <div className="text-sm font-bold text-slate-900">{m.label}</div>
              <p className="text-xs text-slate-600 mt-2">{m.system}</p>
            </div>
          ))}
        </div>

        <ol className="space-y-3 mb-10 max-w-2xl text-sm text-slate-700">
          <li><strong>1.</strong> Select master (O&apos;Neil on Analyst; Turtle/Livermore on higher seats)</li>
          <li><strong>2.</strong> LLM writes strategy spec + Python (yfinance daily backtest)</li>
          <li><strong>3.</strong> Thorp quant pass: Kelly band, overfitting, sample-size warnings</li>
          <li><strong>4.</strong> Save to Strategy Vault on your device</li>
        </ol>

        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 max-w-2xl">
          {QUANT_LAB_DISCLAIMER}
        </p>

        <Link href="/dashboard?entry=quant" className="btn-primary">
          Open Quant Lab on the desk
        </Link>
      </div>
      <Footer />
    </>
  );
}
