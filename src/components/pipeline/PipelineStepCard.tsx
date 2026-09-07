import Link from 'next/link';
import {
  Activity,
  Clock,
  LogOut,
  Scale,
  Target,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { GROUP_META, getMastersByGroup, type PipelineGroup } from '@/lib/masters';

const STEP_ICON: Record<number, LucideIcon> = {
  1: TrendingUp,
  2: Activity,
  3: Target,
  4: Scale,
  5: Clock,
  6: LogOut,
};

export default function PipelineStepCard({
  step,
  label,
  question,
  outputDetail,
  output,
  groups,
  seatCount,
}: {
  step: number;
  label: string;
  question: string;
  outputDetail: string;
  output: string;
  groups: readonly PipelineGroup[];
  seatCount: number;
}) {
  const lead = GROUP_META[groups[0]!];
  const Icon = STEP_ICON[step] ?? TrendingUp;
  const color = lead?.color ?? '#0052d9';

  return (
    <div className="pipeline-step-card" style={{ ['--step-color' as string]: color }}>
      <div className="pipeline-step-accent" />
      <div className="flex items-start gap-4">
        <div className="pipeline-step-badge">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Step {step}
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">{label}</h2>
          <p className="text-sm font-medium text-slate-700 mt-1">{question}</p>
          <p className="text-sm text-slate-600 mt-2">{outputDetail}</p>
          <p className="text-xs text-slate-400 mt-3">
            {seatCount} seats in the full roster · output: {output}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {groups.map((g) => (
              <Link
                key={g}
                href={`/masters#${g}`}
                className="text-xs font-semibold text-[#0052d9] hover:underline"
              >
                {GROUP_META[g].label} →
              </Link>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {groups.flatMap((g) => getMastersByGroup(g).slice(0, 4)).map((m) => (
              <span
                key={m.slug}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-slate-600"
              >
                {m.nameEn.split(' ').slice(-1)[0]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
