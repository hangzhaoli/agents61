import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import MasterAvatar from '@/components/masters/MasterAvatar';
import { getMasterBySlug } from '@/lib/masters';
import { WORK_KITS } from '@/lib/work-kits';

const FEATURED = [
  'lynch-screen',
  'graham-filter',
  'canslim',
  'greenblatt-formula',
  'earnings-tray',
  'trigger-pack',
] as const;

export default function WorkKitsStrip() {
  const kits = FEATURED.map((id) => WORK_KITS.find((k) => k.id === id)).filter(
    (k): k is (typeof WORK_KITS)[number] => Boolean(k)
  );

  return (
    <section className="py-16 md:py-20 border-y border-slate-100">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <div className="badge badge-primary mb-3">Work kits</div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Come in with a job, not a blank box
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              Lynch screen, Graham filter, a 10-K tray. Each kit staffs named digital identities.
              The clerk coordinates. Seats still write alone. Nothing here is a buy list.
            </p>
          </div>
          <Link href="/dashboard/kits" className="btn-secondary shrink-0">
            All investor jobs
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {kits.map((kit) => (
            <Link key={kit.id} href={kit.href} className="card p-4 hover:border-[#0052d9]/30">
              <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                {kit.extra ? 'Token extra' : kit.entry}
              </div>
              <div className="mt-1 font-bold text-slate-900">{kit.title}</div>
              <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">{kit.job}</p>
              {kit.staff.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {kit.staff.slice(0, 3).map((slug) => {
                    const master = getMasterBySlug(slug);
                    if (!master) return null;
                    return (
                      <span key={slug} className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                        <MasterAvatar master={master} size="xxs" />
                        {master.nameEn}
                      </span>
                    );
                  })}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
