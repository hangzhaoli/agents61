import Link from 'next/link';
import { Star } from 'lucide-react';
import { GROUP_META, GROUP_ORDER, MASTERS, getMasterBySlug, getMastersByGroup } from '@/lib/masters';
import { CORE_PERSONA_SLUGS } from '@/lib/personas';
import MasterAvatar from '@/components/masters/MasterAvatar';
import MarketTape from '@/components/landing/MarketTape';

export default function HallOfLegends() {
  const headliners = CORE_PERSONA_SLUGS.map((slug) => getMasterBySlug(slug)).filter(
    (m): m is NonNullable<typeof m> => Boolean(m),
  );
  const marquee = [...MASTERS, ...MASTERS];

  return (
    <section id="legends" className="bg-slate-950 text-white">
      <MarketTape dark />
      <div className="section-container py-14 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase text-amber-300 mb-3">
              <Star className="h-3.5 w-3.5" fill="currentColor" />
              Hall of legends
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[0.95]">
              61 legends.
              <span className="block text-slate-400">Investment rock stars.</span>
            </h2>
            <p className="mt-4 text-slate-400 max-w-xl">
              Buffett, Lynch, Burry, Wood — simulated seats from public books and letters. Each
              writes alone. Unaffiliated. Not a fan club. The wall is the product.
            </p>
          </div>
          <Link href="/masters" className="btn-primary shrink-0">
            Enter the wall
          </Link>
        </div>

        <div className="legend-marquee mb-10" aria-hidden>
          <div className="legend-marquee-track">
            {marquee.map((m, i) => (
              <span key={`${m.slug}-${i}`} className="legend-marquee-name">
                {m.nameEn}
              </span>
            ))}
          </div>
        </div>

        <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-amber-300/80 mb-4">
          16 headliners · always on Analyst
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-12">
          {headliners.map((m) => (
            <Link
              key={m.slug}
              href={`/masters/${m.slug}`}
              className="group border border-white/10 bg-white/[0.04] p-3 hover:border-amber-300/50 hover:bg-white/[0.08] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <MasterAvatar master={m} size="sm" />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold tracking-widest text-amber-300">LEGEND</div>
                  <div className="text-sm font-bold truncate group-hover:text-amber-200">{m.nameEn}</div>
                  <div className="text-[11px] text-slate-400 truncate">{m.role}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="space-y-5">
          {GROUP_ORDER.map((groupKey) => {
            const meta = GROUP_META[groupKey];
            const masters = getMastersByGroup(groupKey);
            return (
              <div key={groupKey}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-0.5 w-6" style={{ backgroundColor: meta.color }} />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">{meta.label}</h3>
                  <span className="text-[11px] text-slate-500">{masters.length}</span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-1.5">
                  {masters.map((m) => (
                    <Link
                      key={m.slug}
                      href={`/masters/${m.slug}`}
                      className="flex items-center gap-2 border border-white/10 px-2 py-1.5 hover:border-white/30 hover:bg-white/5 transition-colors"
                    >
                      <MasterAvatar master={m} size="xxs" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">{m.nameEn}</div>
                        <div className="text-[10px] text-slate-500 truncate">{m.role}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
