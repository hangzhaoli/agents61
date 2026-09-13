'use client';

import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { readDeskSession, SESSION_EVENT } from '@/lib/demo-session';

/** Path only for SSR/crawlers — avoid leaking /register?next=… into indexable HTML. */
function authPathOnly(href: string): string {
  const path = href.split('?')[0]?.split('#')[0];
  return path && path.startsWith('/') ? path : '/register';
}

export default function AuthGateLink({
  href,
  guestHref = '/register',
  className,
  children,
}: {
  href: string;
  guestHref?: string;
  className?: string;
  children: ReactNode;
}) {
  // SSR + first paint: clean /register|/login. After hydrate, restore ?next= for guests.
  const [to, setTo] = useState(() => authPathOnly(guestHref));

  useEffect(() => {
    const sync = () => setTo(readDeskSession() ? href : guestHref);
    sync();
    window.addEventListener(SESSION_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(SESSION_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [href, guestHref]);

  return (
    <Link href={to} className={className}>
      {children}
    </Link>
  );
}
