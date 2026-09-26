import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const STEPS = [
  {
    n: '1',
    title: 'Convene one ticker',
    body: 'Open the desk, leave the method on Isolated, and run one US name you already understand. Read the split. Write the fact that would make you sell.',
    href: '/dashboard?entry=analyze',
    label: 'Open Analyze',
  },
  {
    n: '2',
    title: 'Match a paper book',
    body: 'Shares is long-only stock. Contract is a financed long-short simulation. The wheel uses model premiums, not a live options chain. None of them send orders.',
    href: '/research/us-quant',
    label: 'US quant',
  },
  {
    n: '3',
    title: 'Keep crypto on its own desk',
    body: 'Bitcoin and the other pairs live on the blockchain board as a paper perpetual. Do not force a stock multiple onto them.',
    href: '/research/crypto',
    label: 'Blockchain desk',
  },
] as const;

export default function NewcomerGuide({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? '' : 'py-12 md:py-16 border-b border-slate-100 bg-white'}>
      <div className={compact ? '' : 'section-container'}>
        <div className="card p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <div className="badge badge-primary mb-3">New here</div>
              <h2 className={`font-extrabold text-slate-900 ${compact ? 'text-xl' : 'text-2xl md:text-3xl'}`}>
                First sitting on the desk
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
                Agents61 helps you refuse weak ideas and rehearse a rule on paper. It does not pay you and it does not place trades. The full walkthrough is the tutorial.
              </p>
            </div>
            <Link
              href="/blog/how-to-use-agents61-to-make-money"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0052d9] hover:underline shrink-0"
            >
              Read the tutorial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ol className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.n} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="text-xs font-bold text-[#0052d9]">Step {step.n}</p>
                <h3 className="mt-1 font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{step.body}</p>
                <Link href={step.href} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#0052d9] hover:underline">
                  {step.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
