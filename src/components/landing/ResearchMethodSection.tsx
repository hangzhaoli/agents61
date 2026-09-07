import Link from 'next/link';
import { GitMerge, Lock, Users } from 'lucide-react';
import { RESEARCH_PROTOCOL, PLANS } from '@/lib/tiers';
import DeskPulse from '@/components/landing/DeskPulse';

export default function ResearchMethodSection() {
  return (
    <section id="research-method" className="py-14 md:py-20 bg-white">
      <div className="section-container">
        <div className="text-center mb-12">
          <div className="badge badge-primary mb-4 mx-auto">
            <GitMerge className="h-3.5 w-3.5" />
            How a name is researched
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            {RESEARCH_PROTOCOL.headline}
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            {RESEARCH_PROTOCOL.why}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-5xl mx-auto mb-8 border border-slate-900">
          {RESEARCH_PROTOCOL.steps.map((s, i) => (
            <div
              key={s.n}
              className={`p-6 bg-white ${i < 2 ? 'md:border-r border-b md:border-b-0 border-slate-200' : ''}`}
            >
              <div className="text-3xl font-extrabold text-[#0052d9]/20 leading-none mb-2">0{s.n}</div>
              <div className="text-xs font-bold tracking-widest text-[#0052d9] mb-2">
                Step {s.n}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto mb-8">
          <DeskPulse />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-5xl mx-auto border border-slate-900">
          {(['observer', 'analyst', 'committee'] as const).map((id, i) => {
            const p = PLANS[id];
            return (
              <div
                key={id}
                className={`p-5 text-center bg-white ${i < 2 ? 'md:border-r border-b md:border-b-0 border-slate-200' : ''}`}
              >
                <Users className="h-5 w-5 text-[#0052d9] mx-auto mb-2" />
                <div className="text-sm font-bold text-slate-900">{p.name}</div>
                <div className="text-3xl font-extrabold text-[#0052d9] my-1 tabular-nums">{p.seats}</div>
                <div className="text-xs text-slate-500">{p.computeNote}</div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500 max-w-2xl mx-auto flex items-center justify-center gap-2">
          <Lock className="h-4 w-4 text-slate-400" />
          Locked seats are not silently filled in. Upgrade adds isolated prompts — not a louder group chat.
        </p>
        <div className="mt-6 text-center">
          <Link href="/pricing" className="btn-secondary text-sm">
            Compare 16 / 29 / 48 / 61
          </Link>
        </div>
      </div>
    </section>
  );
}
