'use client';

import Link from 'next/link';
import { useEffect, useState, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { readDeskSession, SESSION_EVENT } from '@/lib/demo-session';

export default function MasterAuthCta({ name, slug }: { name: string; slug: string }) {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const nextDest = `/masters/${slug}`;

  useEffect(() => {
    const sync = () => setLoggedIn(Boolean(readDeskSession()));
    sync();
    window.addEventListener(SESSION_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(SESSION_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  function goAuth(e: MouseEvent<HTMLAnchorElement>, mode: 'register' | 'login') {
    e.preventDefault();
    router.push(`/${mode}?next=${encodeURIComponent(nextDest)}`);
  }

  return (
    <section className="mt-12 rounded-2xl border border-[#0052d9]/20 bg-gradient-to-br from-blue-50/80 to-white p-8 md:p-10">
      <h2 className="text-2xl font-extrabold text-slate-900">Staff {name} on your desk</h2>
      <p className="mt-2 text-slate-600 max-w-2xl">
        Register or log in to run this isolated seat on a US ticker. {name} still writes alone —
        no copy of the other drafts, no buy button, no advice.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        {loggedIn ? (
          <Link href="/dashboard" className="btn-primary">
            Enter desk
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </Link>
        ) : (
          <>
            {/* href without ?next= so crawlers never discover parameterized auth URLs from masters pages */}
            <Link href="/register" className="btn-primary" onClick={(e) => goAuth(e, 'register')}>
              <UserPlus className="h-4 w-4" strokeWidth={2.5} />
              Register
            </Link>
            <Link href="/login" className="btn-secondary" onClick={(e) => goAuth(e, 'login')}>
              <LogIn className="h-4 w-4" strokeWidth={2.5} />
              Log in
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
