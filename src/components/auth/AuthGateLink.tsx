'use client';

import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { readDeskSession, SESSION_EVENT } from '@/lib/demo-session';

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
  const [to, setTo] = useState(guestHref);

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
