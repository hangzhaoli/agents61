'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import BrandLogo from '@/components/brand/BrandLogo';
import {
  clearDeskSession,
  persistDeskSession,
  readDeskSession,
  SESSION_EVENT,
  type DeskSession,
} from '@/lib/demo-session';
import { parsePlan, PLANS } from '@/lib/tiers';

const NAV_ITEMS = [
  { label: 'Desk', href: '/dashboard' },
  { label: 'Legends', href: '/masters' },
  { label: 'Markets', href: '/markets' },
  { label: 'Compare', href: '/compare' },
  { label: 'Pipeline', href: '/pipeline' },
  { label: 'Pricing', href: '/pricing' },
];

const MORE_ITEMS = [
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Kernel demo', href: '/demo' },
      { label: 'Features', href: '/features' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Use cases', href: '/use-cases' },
  { label: 'Learn', href: '/learn' },
  { label: 'Methodology', href: '/methodology' },
  { label: 'Cycle', href: '/cycle' },
  { label: 'Blog', href: '/blog' },
  { label: 'For LLMs', href: '/for-llms' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<DeskSession | null>(null);

  useEffect(() => {
    const sync = () => setSession(readDeskSession());
    sync();
    window.addEventListener(SESSION_EVENT, sync);
    window.addEventListener('storage', sync);
    fetch('/api/auth/session')
      .then((res) => res.json() as Promise<{ email?: string | null; plan?: DeskSession['plan'] | null; ticker?: string }>)
      .then((data) => {
        if (!data.email || !data.plan) return;
        persistDeskSession({
          email: data.email,
          plan: parsePlan(data.plan),
          ticker: data.ticker || 'AAPL',
        });
      })
      .catch(() => {
        /* keep local session */
      });
    return () => {
      window.removeEventListener(SESSION_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  async function signOut() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      /* still clear local */
    }
    clearDeskSession();
    setSession(null);
    setMobileOpen(false);
  }

  function deskHref() {
    return session ? '/dashboard' : '/register';
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="section-container flex h-16 items-center gap-4">
        <Link href="/" className="relative z-10 flex items-center gap-2 shrink-0">
          <span className="chrome-mark shrink-0" aria-hidden="true">
            <BrandLogo variant="mark" priority className="h-8" />
          </span>
          <span className="text-lg font-bold text-slate-900 group-hover:text-[#0052d9] hover:text-[#0052d9] transition-colors">
            Agents61
          </span>
        </Link>

        <nav
          className="hidden lg:flex flex-1 items-center justify-end gap-0.5 min-w-0"
          aria-label="Primary"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.label === 'Desk' ? deskHref() : item.href}
              className="shrink-0 px-2.5 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-[#0052d9] hover:bg-blue-50 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2 shrink-0 pl-1">
          {session ? (
            <>
              <span className="hidden xl:inline text-sm text-slate-500 max-w-[10rem] truncate" title={session.email}>
                {PLANS[session.plan].name}
              </span>
              <button
                type="button"
                onClick={signOut}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 px-2 py-2"
              >
                Sign out
              </button>
              <Link href="/dashboard" className="btn-primary text-sm !rounded-lg !px-4 !py-2">
                Desk
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-2 py-2">
                Log in
              </Link>
              <Link href="/register" className="btn-primary text-sm !rounded-lg !px-4 !py-2">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden ml-auto flex items-center justify-center h-10 w-10 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" strokeWidth={2} /> : <Menu className="h-5 w-5" strokeWidth={2} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl">
          <nav className="section-container py-4 space-y-1">
            {[...NAV_ITEMS, ...MORE_ITEMS].map((item) => (
              <Link
                key={item.label}
                href={item.label === 'Desk' ? deskHref() : item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-slate-700 rounded-lg hover:bg-blue-50 hover:text-[#0052d9]"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 flex gap-3">
              {session ? (
                <>
                  <button type="button" onClick={signOut} className="btn-secondary text-sm flex-1 justify-center">
                    Sign out
                  </button>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="btn-primary text-sm flex-1 justify-center">
                    Desk
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary text-sm flex-1 justify-center">Log in</Link>
                  <Link href="/register" className="btn-primary text-sm flex-1 justify-center">Register</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
