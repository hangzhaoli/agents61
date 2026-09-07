import { ArrowRight, Hourglass, Scale, ShieldCheck, Sparkles } from 'lucide-react';
import AuthGateLink from '@/components/auth/AuthGateLink';
import MarketTape from '@/components/landing/MarketTape';

const REASONS = [
  {
    Icon: Scale,
    title: 'Because isolation is the product',
    body: 'Everyone else runs a group chat. We do not. Each unlocked legend sees filings and their own rules — not Buffett’s draft, not the internet’s take. Then a clerk stacks the split. That is the only way 61 seats stay honest.',
  },
  {
    Icon: Hourglass,
    title: 'Because your time is capital',
    body: 'A serious name is a week of reading if you are thorough — and you still only have your bias. Analyst is sixteen isolated passes plus assembly. Associate is twenty-nine. Principal is forty-eight. Committee and Partners are sixty-one. The expensive hour is the one you spend after you already sized.',
  },
  {
    Icon: Sparkles,
    title: 'Because one clean decision dwarfs the fee',
    body: 'A junior analyst is a salary. A real legend team is a payroll. This committee is a small line item — isolated seats, not a chat. One avoided value trap, one refused story stock, one size that was half-Kelly instead of “all in” — that is the P&L. We do not promise returns. We staff the work that returns are made of.',
  },
  {
    Icon: ShieldCheck,
    title: 'Because we will not fake a buy button',
    body: 'Empty seats stay empty. The clerk does not average a consensus. Isolated briefs never say “you should buy.” If you want a signal group, we are the wrong desk. If you want to keep more of what you already earn, we are the committee you could not hire.',
  },
];

export default function WhyUsSection() {
  return (
    <section id="why-us">
      <MarketTape />
      <div className="section-container py-16 md:py-20">
        <div className="max-w-3xl mb-12">
          <div className="badge badge-primary mb-4">Why Agents61</div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Why us — and why this is a real allocation,
            <span className="text-gradient"> not a toy subscription</span>
          </h2>
          <p className="mt-5 text-lg text-slate-600">
            You are deciding whether to underwrite a research process before you underwrite a
            stock. That is the same muscle as investing. Treat the desk that way.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {REASONS.map((r) => (
            <div key={r.title} className="card p-6 md:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0052d9]/10 text-[#0052d9] mb-4">
                <r.Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{r.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-[#0052d9]/20 bg-[#0052d9]/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="text-xs font-bold tracking-widest text-[#0052d9] mb-2">THE ARITHMETIC</div>
            <p className="text-lg font-bold text-slate-900">
              A committee of legends vs. a weekend you will never get back vs. one thesis that was never inverted.
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Passive income is what compounders pay you after the work is done. This desk is the
              work: so you are not the last person to notice the story died.
            </p>
          </div>
          <AuthGateLink href="/dashboard" className="btn-primary shrink-0">
            Put the committee on payroll
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </AuthGateLink>
        </div>
      </div>
    </section>
  );
}
