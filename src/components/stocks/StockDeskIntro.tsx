import Link from 'next/link';
import { getMasterBySlug } from '@/lib/masters';
import type { TickerProfile } from '@/lib/popular-tickers';

export default function StockDeskIntro({ profile }: { profile: TickerProfile }) {
  return (
    <section className="card p-6 md:p-8 mb-8">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="badge badge-primary">{profile.kind === 'etf' ? 'ETF / trust' : 'US equity'}</span>
        <span className="badge badge-neutral">{profile.sector}</span>
        <span className="text-xs text-slate-400">{profile.exchange}</span>
      </div>
      <h2 className="text-xl font-bold text-slate-900">
        {profile.name} on the committee board
      </h2>
      <p className="mt-3 text-slate-700 leading-relaxed">{profile.whyOnDesk}</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
            What isolated seats argue
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">{profile.committeeAngle}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Filing &amp; structure checks
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">{profile.risksToWatch}</p>
        </div>
      </div>
      {profile.relatedMasters.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-100">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Seats that usually speak first
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.relatedMasters.map((slug) => {
              const m = getMasterBySlug(slug);
              if (!m) return null;
              return (
                <Link
                  key={slug}
                  href={`/masters/${slug}`}
                  className="badge badge-neutral hover:border-[#0052d9]/40"
                >
                  {m.nameEn}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
