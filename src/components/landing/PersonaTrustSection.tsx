import Link from 'next/link';
import { BookOpen, FileText, Mic, Library, Ban, ArrowRight, ShieldCheck } from 'lucide-react';

const SOURCES = [
  {
    rank: '01',
    title: 'Their books',
    extract: 'Hard rules: margin of safety, CANSLIM, Kelly criterion, inversion.',
    examples: 'Graham’s Security Analysis · O’Neil’s How to Make Money in Stocks · Thorp’s Beat the Dealer',
    Icon: BookOpen,
  },
  {
    rank: '02',
    title: 'Shareholder letters',
    extract: 'The language of real decisions — not hindsight.',
    examples: 'Buffett’s annual letters · Marks’s Oaktree memos · Greenlight letters',
    Icon: FileText,
  },
  {
    rank: '03',
    title: 'Interviews & talks',
    extract: 'Spoken style, catchphrases, and what they refuse.',
    examples: 'Dalio on Principles · Lynch interviews · ARK public research',
    Icon: Mic,
  },
  {
    rank: '04',
    title: 'Wikipedia extract',
    extract: 'Biography and verifiable quotes as a seed only — never the main argument.',
    examples: 'Each master has an archived extract; books and letters take priority',
    Icon: Library,
  },
];

export default function PersonaTrustSection() {
  return (
    <section id="methodology" className="py-20 md:py-28 bg-slate-50/70">
      <div className="section-container">
        <div className="text-center mb-12">
          <div className="badge badge-primary mb-4 mx-auto">
            <ShieldCheck className="h-3.5 w-3.5" />
            How Personas Are Built
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Where personas come from: verifiable, not invented
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Each legend agent is not “AI cosplay” in a chat room. We extract public, checkable
            methodology in priority order —{' '}
            <strong className="text-slate-800 font-semibold">
              only rules that can be verified, never gossip personas.
            </strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {SOURCES.map((s) => (
            <div key={s.rank} className="card p-6 md:p-7 text-left">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0052d9]/10 text-[#0052d9]">
                  <s.Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold tracking-widest text-[#0052d9]">
                      Priority {s.rank}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{s.extract}</p>
                  <p className="mt-3 text-xs text-slate-400 leading-relaxed">{s.examples}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-6 flex items-start gap-3">
            <Ban className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">What we never use</h3>
              <p className="mt-1 text-sm text-slate-600">
                Second-hand social media takes, tip groups, unverified quote graphics, and
                personality sketches from gossip biographies. Those become hallucinated personas.
                They do not go into the model.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-bold text-slate-900">What you can check</h3>
            <p className="mt-1 text-sm text-slate-600">
              Each legend page lists methodology, key works, and quote sources. Simulated
              personas, unaffiliated with the people — but the rules come from public books
              and letters, not random role-play.
            </p>
            <Link
              href="/masters"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0052d9] hover:underline"
            >
              Browse all 61 legends
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
