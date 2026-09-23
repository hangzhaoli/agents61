import Link from 'next/link';

const LINKS = [
  { href: '/predictions', label: 'Overview' },
  { href: '/predictions/scanner', label: 'Market Scanner' },
  { href: '/predictions#gaps', label: 'Top Gaps' },
  { href: '/predictions/watchlist', label: 'Watchlist' },
  { href: '/predictions/desk', label: 'Trade Desk' },
] as const;

export default function PredictionsSubnav({ active }: { active?: string }) {
  return (
    <nav className="flex flex-wrap gap-2 mb-8" aria-label="Prediction Markets">
      {LINKS.map((l) => {
        const isActive = active === l.href || (active === 'overview' && l.href === '/predictions');
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`text-xs font-bold tracking-wide uppercase px-3 py-1.5 rounded-lg border transition-colors ${
              isActive
                ? 'bg-[#0052d9] text-white border-[#0052d9]'
                : 'bg-white text-slate-600 border-slate-200 hover:border-[#0052d9]/40 hover:text-[#0052d9]'
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
