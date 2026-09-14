import Link from 'next/link';
import { ArrowRight, BookMarked, GitCompare, ListChecks, Search } from 'lucide-react';
import { getMasterBySlug } from '@/lib/masters';
import { listDeepSourcePackSlugs } from '@/lib/personas/source-pack';
import AuthGateLink from '@/components/auth/AuthGateLink';

const KERNEL = [
  {
    Icon: Search,
    title: 'Facts before voice',
    body: 'Clerk can prep a ticker — fundamentals, tone, valuation notes — then seats write. Not a buy score.',
  },
  {
    Icon: BookMarked,
    title: 'Source packs, not cosplay',
    body: 'Deep seats retrieve checklists, dated cases, and letter/memo excerpts as context. The system prompt stays short.',
  },
  {
    Icon: ListChecks,
    title: 'Method checks on the brief',
    body: 'Pass / fail / unknown against that seat’s rules. Source notes cite the work, not a vibe.',
  },
  {
    Icon: GitCompare,
    title: 'Show the split',
    body: 'Where they disagree stays visible. The clerk stacks isolation. Nobody averages a committee rating.',
  },
] as const;

export default function KernelUpgradeSection() {
  const deepSlugs = listDeepSourcePackSlugs();
  const names = deepSlugs
    .map((slug) => getMasterBySlug(slug)?.nameEn)
    .filter((n): n is string => Boolean(n));

  return (
    <section id="kernel" className="py-16 md:py-24 border-y border-slate-900 bg-white">
      <div className="section-container">
        <div className="max-w-3xl mb-10">
          <div className="badge badge-primary mb-4">Desk kernel update</div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            What the homepage still gets right — and what the desk now actually does
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Isolation, empty locked seats, and no buy button are unchanged. The gap was depth:
            a legend used to be a methodology card plus a short prompt. Deep seats now run a
            research kernel — still a simulation, still unaffiliated, still not advice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-5xl border border-slate-900 mb-8">
          <div className="p-6 md:p-8 md:border-r border-b md:border-b-0 border-slate-200">
            <div className="text-[10px] font-bold tracking-[0.18em] text-slate-400 uppercase mb-2">
              Still true on this page
            </div>
            <ul className="text-sm text-slate-700 space-y-2 leading-relaxed">
              <li>61 named seats. Locked chairs stay empty.</li>
              <li>Each unlocked seat writes alone (or only reads earlier pipeline steps).</li>
              <li>The clerk publishes agreement and split — never “you should buy.”</li>
            </ul>
          </div>
          <div className="p-6 md:p-8 bg-slate-50">
            <div className="text-[10px] font-bold tracking-[0.18em] text-[#0052d9] uppercase mb-2">
              What just upgraded
            </div>
            <ul className="text-sm text-slate-700 space-y-2 leading-relaxed">
              <li>
                <strong className="text-slate-900">{deepSlugs.length} deep source packs</strong> —
                screening, risk, exits, dated cases, excerpt index.
              </li>
              <li>Remaining seats still use methodology cards. We do not pretend all 61 are equally sourced yet.</li>
              <li>Briefs can show method checks, source notes, and lagged 13F as fact — not a follow signal.</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 max-w-5xl border border-slate-900 mb-8">
          {KERNEL.map((row, i) => (
            <div
              key={row.title}
              className={`p-5 bg-white ${i < 3 ? 'lg:border-r border-b lg:border-b-0 border-slate-200' : ''}`}
            >
              <row.Icon className="h-5 w-5 text-[#0052d9] mb-3" strokeWidth={1.75} />
              <h3 className="text-sm font-bold text-slate-900">{row.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{row.body}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500 max-w-5xl leading-relaxed mb-6">
          Deep seats now:{' '}
          {names.map((n, i) => (
            <span key={n}>
              {n}
              {i < names.length - 1 ? ' · ' : ''}
            </span>
          ))}
          . Try <span className="font-semibold text-slate-700">prep AAPL</span> with the clerk, then
          convene — look for method checks under the brief.
        </p>

        <div className="flex flex-wrap gap-3">
          <AuthGateLink href="/dashboard" className="btn-primary">
            Open the upgraded desk
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </AuthGateLink>
          <Link href="/how-it-works" className="btn-secondary">
            How isolation works
          </Link>
          <Link href="/methodology" className="text-sm font-semibold text-[#0052d9] hover:underline self-center">
            How personas are built →
          </Link>
        </div>
      </div>
    </section>
  );
}
