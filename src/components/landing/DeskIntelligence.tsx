import Link from 'next/link';
import { ArrowRight, EyeOff, Scale, Split } from 'lucide-react';
import { getMasterBySlug } from '@/lib/masters';
import MasterAvatar from '@/components/masters/MasterAvatar';
import AuthGateLink from '@/components/auth/AuthGateLink';

const SEATS = [
  {
    slug: 'warren-buffett',
    lane: 'Isolated · quality',
    stance: 'Constructive on the business',
    stanceClass: 'bg-emerald-50 text-emerald-700',
    finding:
      'Ask whether owner earnings survive the next unit cycle. Fame is not a margin of safety. Price still has to clear a hurdle.',
  },
  {
    slug: 'cathie-wood',
    lane: 'Isolated · duration',
    stance: 'Constructive on the theme',
    stanceClass: 'bg-emerald-50 text-emerald-700',
    finding:
      'Ask whether inference demand still has years of duration. A crowded winner can be a real S-curve and still be a bad hold at this print.',
  },
  {
    slug: 'michael-burry',
    lane: 'Invert · debate',
    stance: 'Skeptical until proven',
    stanceClass: 'bg-red-50 text-red-700',
    finding:
      'Write the kill-condition first: customer capex pauses, tokens do not need this silicon, or the multiple only works if duration is infinite.',
  },
] as const;

export default function DeskIntelligence() {
  return (
    <section id="how-the-desk-thinks" className="py-12 md:py-16 bg-slate-50">
      <span id="cycle-meter" className="sr-only">
        Cycle meter moved to /cycle. This block is the committee split.
      </span>
      <div className="section-container">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <div className="badge badge-primary mb-4 mx-auto">Committee intelligence</div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Same ticker. Three methods. No average.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            A chatbot writes one fluent memo. This desk staffs seats that cannot see each other,
            then a clerk publishes the split. That is the intelligence — not a 0–100 cycle score.
          </p>
        </div>

        <ol className="flex flex-wrap items-center justify-center gap-2 mb-6 text-xs font-semibold text-slate-500">
          <li className="rounded-full bg-white border border-slate-200 px-3 py-1">1 · Isolated write</li>
          <li className="text-slate-300" aria-hidden>
            →
          </li>
          <li className="rounded-full bg-white border border-slate-200 px-3 py-1">2 · Invert</li>
          <li className="text-slate-300" aria-hidden>
            →
          </li>
          <li className="rounded-full bg-white border border-slate-200 px-3 py-1">3 · Clerk stacks the split</li>
        </ol>
        <p className="text-center text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">
          Sample · NVDA · not a live quote · not a recommendation
        </p>

        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {SEATS.map((seat) => {
            const master = getMasterBySlug(seat.slug);
            if (!master) return null;
            return (
              <article key={seat.slug} className="card p-5 md:p-6">
                <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-3">
                  {seat.lane}
                </p>
                <div className="flex items-center gap-2.5 mb-3">
                  <MasterAvatar master={master} size="sm" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">{master.nameEn}</div>
                    <span className={`badge text-[10px] ${seat.stanceClass}`}>{seat.stance}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{seat.finding}</p>
              </article>
            );
          })}
        </div>

        <div className="card-flat max-w-5xl mx-auto mt-4 p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Split className="h-4 w-4 text-[#0052d9]" strokeWidth={2} />
            <span className="text-sm font-bold text-slate-900">Clerk stack</span>
            <span className="text-[11px] text-slate-400">assembled after isolation · never a vote</span>
          </div>
          <ul className="grid sm:grid-cols-3 gap-3 text-sm text-slate-700">
            <li className="rounded-xl bg-white border border-slate-100 p-3">
              <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-1">
                Agrees
              </div>
              Demand is real enough to research. Fame is not the file.
            </li>
            <li className="rounded-xl bg-white border border-slate-100 p-3">
              <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-1">
                Splits
              </div>
              Quality hold vs theme duration. The clerk will not blend that into one rating.
            </li>
            <li className="rounded-xl bg-white border border-slate-100 p-3">
              <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-1">
                Invert
              </div>
              A named kill-condition. If you cannot write one, you have a mood, not a thesis.
            </li>
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            Empty seats stay empty. Isolated briefs never say you should buy. Research simulation.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <AuthGateLink href="/dashboard" className="btn-primary">
            Run this on a ticker you already like
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </AuthGateLink>
          <Link href="/how-it-works" className="btn-secondary">
            How isolation works
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 mt-6 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <EyeOff className="h-3.5 w-3.5" strokeWidth={2} />
            Seats cannot peek
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Scale className="h-3.5 w-3.5" strokeWidth={2} />
            Debate is a step, not a vibe
          </span>
          <Link href="/cycle" className="hover:text-[#0052d9]">
            Prefer a regime note? Cycle meter →
          </Link>
        </div>
      </div>
    </section>
  );
}
