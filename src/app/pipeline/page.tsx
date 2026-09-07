import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import PipelineStepCard from '@/components/pipeline/PipelineStepCard';
import { PIPELINE_STEPS, QUANT_LAYER } from '@/lib/pipeline';
import { getMastersByGroup } from '@/lib/masters';
import { PLANS } from '@/lib/tiers';
import { pageMeta, PAGE_DESCRIPTIONS } from '@/lib/seo/meta';
import type { Metadata } from 'next';
import { Shield } from 'lucide-react';

export const metadata: Metadata = pageMeta({
  title: 'Six-step investment research pipeline',
  description: PAGE_DESCRIPTIONS.pipeline,
  path: '/pipeline',
});

export default function PipelinePage() {
  return (
    <>
      <Navbar />
      <div className="section-container py-16">
        <div className="max-w-3xl mb-12">
          <div className="badge badge-primary mb-4">Pipeline</div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Six steps. Isolated seats.</h1>
          <p className="text-lg text-slate-600">
            Architecture is always 61. Your plan only lights some seats. Empty layers stay empty.
          </p>
        </div>

        <div className="space-y-4 mb-10">
          {PIPELINE_STEPS.map((step) => {
            const n = step.groups.reduce((acc, g) => acc + getMastersByGroup(g).length, 0);
            return (
              <PipelineStepCard
                key={step.step}
                step={step.step}
                label={step.label}
                question={step.question}
                outputDetail={step.outputDetail}
                output={step.output}
                groups={step.groups}
                seatCount={n}
              />
            );
          })}
          <div className="pipeline-step-card border-teal-200/60" style={{ ['--step-color' as string]: '#0d9488' }}>
            <div className="pipeline-step-accent" />
            <div className="flex items-start gap-4">
              <div className="pipeline-step-badge bg-teal-50 text-teal-700">
                <Shield className="h-5 w-5" strokeWidth={2} />
              </div>
              <div>
                <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Always on</div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{QUANT_LAYER.label}</h2>
                <p className="text-sm text-slate-600 mt-1">
                  {QUANT_LAYER.question}. {QUANT_LAYER.output}.
                </p>
                <p className="text-xs text-slate-400 mt-3">
                  Unlocks from Analyst (Thorp) through Committee (seven seats).
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {(['analyst', 'associate', 'principal', 'committee', 'partners'] as const).map((id) => (
            <Link key={id} href="/pricing" className="rounded-xl border border-slate-200 px-4 py-3 text-sm hover:border-[#0052d9]/30 hover:bg-blue-50/30 transition-colors">
              <span className="font-bold text-slate-900">{PLANS[id].name}</span>
              <span className="text-slate-500 ml-2">{PLANS[id].seats} masters</span>
            </Link>
          ))}
          <Link href="/methodology" className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0052d9] hover:bg-blue-50/30 transition-colors">
            How personas are built →
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
