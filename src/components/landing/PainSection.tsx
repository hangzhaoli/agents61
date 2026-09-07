import { AlertTriangle, Brain, Clock, Skull } from 'lucide-react';
import { MasterChipRow } from '@/components/masters/MasterChip';

const DESK_SLUGS = [
  'warren-buffett',
  'peter-lynch',
  'charlie-munger',
  'david-einhorn',
  'michael-burry',
];

const PAINS = [
  {
    Icon: Brain,
    kicker: 'Fear',
    title: 'Your copilot agrees with you',
    body: 'One chat, one fluent paragraph, and the room is already anchored. That is how a thesis becomes a religion — and how a year of compounding becomes tuition paid to the market.',
  },
  {
    Icon: Clock,
    kicker: 'Time',
    title: 'Forty hours in a 10-K. Still one brain.',
    body: 'You already do the work. You still cannot staff these seats on the same name before the close. Weekends do not scale. Capital does.',
    slugs: DESK_SLUGS,
  },
  {
    Icon: AlertTriangle,
    kicker: 'Greed trap',
    title: 'The ten-bagger story that never got inverted',
    body: 'Greed is not wanting a winner. Greed is sizing a narrative nobody was allowed to kill. One un-inverted story can transfer more money than a decade of research seats.',
  },
  {
    Icon: Skull,
    kicker: 'The silent leak',
    title: 'You already own it. The thesis is dead.',
    body: 'The expensive part is not the subscription. It is sitting in a name after quality broke, after the multiple became the whole thesis, after nobody on your desk said invert.',
  },
];

export default function PainSection() {
  return (
    <section id="pain" className="py-20 md:py-28 bg-slate-900 text-white scroll-mt-16">
      <div className="section-container">
        <div className="max-w-3xl mb-12">
          <div className="badge bg-red-500/20 text-red-300 mb-4">The real cost</div>
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
            The market does not charge tuition in invoices.
            <span className="block text-slate-400 mt-2">It charges it in positions.</span>
          </h2>
          <p className="mt-5 text-lg text-slate-400 max-w-2xl">
            You are not under-informed. You are under-staffed. Data terminals do not have a view.
            Newsletters have one author. Chatbots want to please you. That combination is how
            accounts quietly bleed.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PAINS.map((p) => (
            <div key={p.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-2 text-red-300 text-xs font-bold uppercase tracking-widest mb-3">
                <p.Icon className="h-4 w-4" strokeWidth={1.75} />
                {p.kicker}
              </div>
              <h3 className="text-xl font-bold mb-2">{p.title}</h3>
              {'slugs' in p && p.slugs && (
                <div className="mb-3">
                  <MasterChipRow slugs={p.slugs} tone="dark" />
                </div>
              )}
              <p className="text-sm text-slate-400 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
