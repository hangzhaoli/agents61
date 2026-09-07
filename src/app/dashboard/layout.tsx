import { Suspense } from 'react';
import { cookies } from 'next/headers';
import Navbar from '@/components/layout/Navbar';
import DeskAppShell from '@/components/workspace/DeskAppShell';
import FlashOfferGate from '@/components/workspace/FlashOfferGate';
import { EMAIL_COOKIE, PLAN_COOKIE } from '@/lib/demo-session';
import { syncUserEmail } from '@/lib/sync/session';
import { isPaidPlan, parsePlan } from '@/lib/tiers';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const authEmail = await syncUserEmail();
  const emailCookie = jar.get(EMAIL_COOKIE)?.value;
  const email = authEmail ?? (emailCookie ? decodeURIComponent(emailCookie) : '');
  const plan = parsePlan(jar.get(PLAN_COOKIE)?.value ?? 'observer');
  const flashEligible = !isPaidPlan(plan);

  return (
    <>
      <Navbar />
      <div className="desk-app">
        <Suspense fallback={null}>
          <DeskAppShell email={email} plan={plan} />
        </Suspense>
        <div className="desk-app-main">{children}</div>
      </div>
      <FlashOfferGate eligible={flashEligible} />
    </>
  );
}
