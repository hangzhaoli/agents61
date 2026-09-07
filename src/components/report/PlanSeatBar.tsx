import Link from 'next/link';
import { PLAN_ORDER, PLANS, type PlanId } from '@/lib/tiers';

export default function PlanSeatBar({
  plan,
  ticker,
  pathPrefix = '/stocks',
}: {
  plan: PlanId;
  ticker?: string;
  pathPrefix?: string;
}) {
  const hrefFor = (id: PlanId) =>
    ticker
      ? `${pathPrefix}/${ticker.toLowerCase()}?plan=${id}`
      : `/dashboard?plan=${id}`;

  return (
    <div className="flex flex-col gap-3 mb-8">
      <p className="text-sm text-slate-500">
        Preview seating. Paid desks are 16 / 29 / 48 / 61. $49 is Associate (29), not 61. Partners is the same 61 with more compute.
      </p>
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 p-1 rounded-xl bg-slate-100"
        role="tablist"
        aria-label="Committee seating"
      >
        {PLAN_ORDER.map((id) => {
          const p = PLANS[id];
          const active = plan === id;
          return (
            <Link
              key={id}
              href={hrefFor(id)}
              role="tab"
              aria-selected={active}
              className={`px-2 py-2 rounded-lg text-center transition-colors duration-200 ease-out ${
                active
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="block text-xs font-bold">{p.name}</span>
              <span className="block text-[11px] mt-0.5">
                {p.seats} · {p.price}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
