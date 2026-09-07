'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { GROUP_META, GROUP_ORDER, getMastersByGroup, type Master } from '@/lib/masters';
import MasterAvatar from '@/components/masters/MasterAvatar';
import { isUnlocked, PLANS, type PlanId } from '@/lib/tiers';

type SeatFilter = 'all' | PlanId;

const FILTERS: { id: SeatFilter; label: string; hint: string }[] = [
  { id: 'all', label: 'All 61', hint: 'Full roster' },
  { id: 'analyst', label: 'Analyst', hint: `${PLANS.analyst.seats} seats` },
  { id: 'associate', label: 'Associate', hint: `${PLANS.associate.seats} seats` },
  { id: 'principal', label: 'Principal', hint: `${PLANS.principal.seats} seats` },
  { id: 'committee', label: 'Committee', hint: `${PLANS.committee.seats} seats` },
];

function seatBadge(slug: string): string {
  if (isUnlocked('analyst', slug)) return 'Analyst+';
  if (isUnlocked('associate', slug)) return 'Associate+';
  if (isUnlocked('principal', slug)) return 'Principal+';
  return 'Committee · Partners';
}

function inFilter(master: Master, filter: SeatFilter): boolean {
  if (filter === 'all' || filter === 'committee') return true;
  return isUnlocked(filter, master.slug);
}

export default function MastersDirectory() {
  const [filter, setFilter] = useState<SeatFilter>('all');

  const groups = useMemo(
    () =>
      GROUP_ORDER.map((groupKey) => ({
        groupKey,
        meta: GROUP_META[groupKey],
        masters: getMastersByGroup(groupKey).filter((m) => inFilter(m, filter)),
      })).filter((g) => g.masters.length > 0),
    [filter]
  );

  const total = groups.reduce((n, g) => n + g.masters.length, 0);

  return (
    <>
      <div
        className="flex flex-wrap justify-center gap-2 mb-12"
        role="tablist"
        aria-label="Filter by seating"
      >
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ease-out ${
                active
                  ? 'bg-[#0052d9] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-[#0052d9]'
              }`}
            >
              {f.label}
              <span className={`ml-1.5 text-xs font-medium ${active ? 'text-blue-100' : 'text-slate-400'}`}>
                {f.hint}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-center text-sm text-slate-500 mb-10">
        Showing {total} {total === 1 ? 'master' : 'masters'}
        {filter !== 'all' ? ` on ${PLANS[filter].name}` : ''}. Empty seats stay empty on a report.
      </p>

      <div className="space-y-16">
        {groups.map(({ groupKey, meta, masters }) => (
          <section key={groupKey} id={groupKey}>
            <div className="flex items-center gap-3 mb-8">
              <div
                className="h-1.5 w-10 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{meta.label}</h2>
                <p className="text-sm text-slate-500">{meta.description}</p>
              </div>
              <span className="ml-auto text-sm font-medium text-slate-400">
                {masters.length} {masters.length === 1 ? 'master' : 'masters'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {masters.map((m) => (
                <Link key={m.slug} href={`/masters/${m.slug}`} className="card p-6 group">
                  <div className="flex items-start gap-4">
                    <MasterAvatar master={m} size="lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0052d9] transition-colors">
                        {m.nameEn}
                      </h3>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0052d9] mt-1">
                        {seatBadge(m.slug)}
                      </p>
                      <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
                        {m.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-4 line-clamp-2">{m.methodology}</p>
                  <blockquote className="mt-3 text-xs text-slate-400 italic border-l-2 border-slate-200 pl-3">
                    &ldquo;{m.quote}&rdquo;
                  </blockquote>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
