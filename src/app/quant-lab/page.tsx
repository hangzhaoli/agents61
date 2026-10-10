import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { QUANT_MASTERS, QUANT_LAB_DISCLAIMER } from '@/lib/quant-lab/masters';
import { pageMeta } from '@/lib/seo/meta';
import JsonLd from '@/components/seo/JsonLd';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMeta({
  title: 'Quant Lab — AI master paper backtests & $100k book',
  description:
    'Agents61 Quant Lab: timing masters → Python paper backtest, trade-selection odds, full pool pipeline, book into a virtual $100k account. Not live trading.',
  path: '/quant-lab',
  keywords: [
    'AI quant lab',
    'paper backtest AI',
    'CANSLIM paper backtest',
    'virtual paper trading account',
    'Turtle trading paper backtest',
    'crypto paper backtest BTC',
  ],
});

const FAQS = [
  {
    question: 'Is Quant Lab live trading?',
    answer: 'No. Paper research only — compile, pipeline, and the $100k book never route broker orders.',
  },
  {
    question: 'What is the virtual $100k account?',
    answer:
      'A multi-name paper portfolio on the desk. Masters screen a pool, book fills at research marks, then Sync market updates equity. See /paper-trading-account.',
  },
  {
    question: 'Single ticker or full pipeline?',
    answer:
      'Compile one symbol to Python + Thorp review. Full pipeline screens a liquid universe and can book into the $100k account.',
  },
];

export default function QuantLabPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQS.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }}
      />
      <Navbar />
      <div className="section-container py-16">
        <div className="max-w-3xl mb-10">
          <div className="badge badge-primary mb-4">Quant Lab</div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Masters → paper backtests → optional $100k book
          </h1>
          <p className="text-lg text-slate-600">
            Compile timing masters into paper backtests. Equity/ETF (SPY…) or crypto USD pairs
            (BTC-USD, ETH-USD). After compile you get a <strong>trade-selection odds</strong> card
            for whether to paper-try the setup. Run the <strong>full pipeline</strong> to screen a
            pool, then book into the virtual $100k account and sync marks. Thorp reviews Kelly. Not
            live contracts.
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
          <li>
            <strong>1.</strong> Select master + asset class (Equity / Crypto)
          </li>
          <li>
            <strong>2.</strong> Compile one ticker — or run full pipeline on a liquid pool
          </li>
          <li>
            <strong>3.</strong> Thorp quant pass: Kelly band, overfitting, sample-size warnings
          </li>
          <li>
            <strong>4.</strong> Book signals into Paper $100k · Sync market for marks
          </li>
        </ol>

        <div className="max-w-2xl mb-10 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Related guides</h2>
          <ul className="text-sm text-slate-700 space-y-2">
            <li>
              <Link href="/ai-quant-lab" className="font-semibold text-[#0052d9] hover:underline">
                AI Quant Lab product hub
              </Link>
            </li>
            <li>
              <Link
                href="/paper-trading-account"
                className="font-semibold text-[#0052d9] hover:underline"
              >
                Virtual $100k paper trading account
              </Link>
            </li>
            <li>
              <Link
                href="/use-cases/paper-book-a-master-strategy"
                className="font-semibold text-[#0052d9] hover:underline"
              >
                Use case: paper-book a master strategy
              </Link>
            </li>
            <li>
              <Link
                href="/learn/run-paper-100k-desk"
                className="font-semibold text-[#0052d9] hover:underline"
              >
                Learn: run the $100k desk
              </Link>
            </li>
            <li>
              <Link
                href="/blog/virtual-paper-trading-100k"
                className="font-semibold text-[#0052d9] hover:underline"
              >
                Blog: virtual $100k paper trading
              </Link>
            </li>
          </ul>
        </div>

        <div className="max-w-2xl mb-10 space-y-3">
          <h2 className="text-xl font-bold text-slate-900">FAQ</h2>
          {FAQS.map((f) => (
            <div key={f.question}>
              <h3 className="text-sm font-bold text-slate-900">{f.question}</h3>
              <p className="text-sm text-slate-600 mt-1">{f.answer}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 max-w-2xl">
          {QUANT_LAB_DISCLAIMER}
        </p>

        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard?entry=quant" className="btn-primary">
            Open Quant Lab on the desk
          </Link>
          <Link href="/dashboard?entry=paper" className="btn-secondary">
            Virtual $100k paper account
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
