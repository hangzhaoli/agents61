'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { readDeskSession, SESSION_EVENT } from '@/lib/demo-session';

export default function MasterAuthCta({ name, slug }: { name: string; slug: string }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const next = encodeURIComponent(`/masters/${slug}`);

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
            <Link href={`/register?next=${next}`} className="btn-primary">
              <UserPlus className="h-4 w-4" strokeWidth={2.5} />
              Register
            </Link>
            <Link href={`/login?next=${next}`} className="btn-secondary">
              <LogIn className="h-4 w-4" strokeWidth={2.5} />
              Log in
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
