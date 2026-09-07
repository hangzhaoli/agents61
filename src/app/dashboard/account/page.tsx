import { cookies } from 'next/headers';
import { Suspense } from 'react';
import AccountDesk from '@/components/workspace/AccountDesk';
import { EMAIL_COOKIE, PLAN_COOKIE } from '@/lib/demo-session';
import { syncUserEmail } from '@/lib/sync/session';
import { parsePlan } from '@/lib/tiers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Desk account — Agents61',
  robots: { index: false, follow: false },
};

export default async function DashboardAccountPage() {
  const jar = await cookies();
  const authEmail = await syncUserEmail();
  const emailCookie = jar.get(EMAIL_COOKIE)?.value;
  const email = authEmail ?? (emailCookie ? decodeURIComponent(emailCookie) : '');
  const plan = parsePlan(jar.get(PLAN_COOKIE)?.value ?? 'observer');

  return (
    <Suspense fallback={<div className="py-16 text-sm text-slate-500">Loading account…</div>}>
      <AccountDesk email={email} plan={plan} />
    </Suspense>
  );
}
