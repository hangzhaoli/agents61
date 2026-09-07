import type { ReactNode } from 'react';
import Link from 'next/link';

const LINKS = [
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/ai-disclosure', label: 'AI Disclosure' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms of Use' },
];

export default function LegalShell({
  title,
  updated,
  children,
  active,
}: {
  title: string;
  updated: string;
  children: ReactNode;
  active?: string;
}) {
  return (
    <div className="section-container py-16 max-w-3xl">
      <nav className="flex flex-wrap gap-2 mb-8" aria-label="Legal">
        {LINKS.map((l) => {
          const on = active === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={on ? 'page' : undefined}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                on
                  ? 'bg-[#0052d9] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-[#0052d9]/10 hover:text-[#0052d9]'
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
      <p className="text-sm text-slate-400 mb-8">Last updated: {updated}</p>
      <div className="prose-legal">{children}</div>
    </div>
  );
}
