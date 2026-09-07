import Link from 'next/link';
import MasterAvatar from '@/components/masters/MasterAvatar';
import { getMasterBySlug } from '@/lib/masters';
import { WORK_KITS } from '@/lib/work-kits';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work kits — Agents61',
  robots: { index: false, follow: false },
};

export default function DashboardKitsPage() {
  return (
    <div className="section-container py-8 md:py-10">
      <div className="max-w-3xl mb-8">
        <div className="badge badge-primary mb-2">Investor jobs</div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
          Common work, staffed with digital identities
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          These are how investors actually spend a week: screen, invert, watch a regime, paste a
          filing. Each kit lights named seats (unaffiliated simulations). Nothing here is a buy
          list. Trigger and filing kits are token extras on DeepSeek V4.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {WORK_KITS.map((kit) => (
          <Link key={kit.id} href={kit.href} className="card p-5 hover:border-[#0052d9]/30 transition-colors">
            <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-2">
              {kit.extra ? `Token extra · ${kit.extra}` : kit.entry}
            </div>
            <h2 className="text-base font-bold text-slate-900">{kit.title}</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{kit.job}</p>
            {kit.staff.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {kit.staff.map((slug) => {
                  const master = getMasterBySlug(slug);
                  if (!master) return null;
                  return (
                    <span key={slug} className="inline-flex items-center gap-1.5 text-xs text-slate-600">
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
  );
}
