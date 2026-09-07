import { Suspense } from 'react';
import { cookies } from 'next/headers';
import WorkspaceDesk from '@/components/workspace/WorkspaceDesk';
import { EMAIL_COOKIE, PLAN_COOKIE } from '@/lib/demo-session';
import { evaluateEntitlement, TRIAL_COOKIE } from '@/lib/desk-trial';
import { syncUserEmail } from '@/lib/sync/session';
import { parsePlan } from '@/lib/tiers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Committee Desk — Agents61',
  description:
    'Committee desk: pick Isolated or Division of labor, then ask a question, scan a board, research crypto, or line up masters. Isolated briefs or pipeline handoff. Clerk stacks. 16 / 29 / 48 / 61 seats.',
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const jar = await cookies();
  const planCookie = jar.get(PLAN_COOKIE)?.value;
  const emailCookie = jar.get(EMAIL_COOKIE)?.value;
  const trialCookie = jar.get(TRIAL_COOKIE)?.value;
  const authEmail = await syncUserEmail();
  const entitlement = evaluateEntitlement({
    planRaw: planCookie,
    emailRaw: authEmail ?? emailCookie,
    trialRaw: trialCookie,
  });
  const initialPlan = parsePlan(planCookie ?? 'observer');
  const initialEmail = authEmail ?? (emailCookie ? decodeURIComponent(emailCookie) : '');

  return (
    <Suspense fallback={<div className="py-20 text-sm text-slate-500">Loading desk…</div>}>
      <WorkspaceDesk
        initialPlan={initialPlan}
        initialEmail={initialEmail}
        skipPaywall={entitlement.skipPaywall}
        trialUsed={entitlement.trialUsed}
      />
    </Suspense>
  );
}
