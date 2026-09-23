import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { QUANT_MASTERS, QUANT_LAB_DISCLAIMER } from '@/lib/quant-lab/masters';
import { pageMeta } from '@/lib/seo/meta';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMeta({
  title: 'Quant Lab — equity & crypto paper backtests',
  description:
    'Agents61 Quant Lab: master rules → Python backtest for SPY or BTC-USD/ETH-USD. Ed Thorp Kelly review. Paper research only — not live trading.',
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
            Masters → Python · equity or crypto
          </h1>
          <p className="text-lg text-slate-600">
            Compile timing masters into paper backtests. Equity/ETF (SPY…) or crypto USD pairs
            (BTC-USD, ETH-USD) via yfinance. Thorp reviews Kelly and overfitting. Strategy Vault
            saves the script — not live orders.
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
          <li><strong>1.</strong> Select master + asset class (Equity / Crypto)</li>
          <li><strong>2.</strong> Pick SPY… or BTC-USD / ETH-USD — LLM writes spec + Python</li>
          <li><strong>3.</strong> Thorp quant pass: Kelly band, overfitting, sample-size warnings</li>
          <li><strong>4.</strong> Save to Strategy Vault · crypto stays price/volume only (no fake P/E)</li>
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
