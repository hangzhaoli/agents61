/**
 * One unpaid plan+convene run, then a hard lock until a paid desk cookie exists.
 * Entitlement is the plan cookie — not ?plan= on the URL.
 */

import {
  EMAIL_COOKIE,
  PLAN_COOKIE,
  isDemoEmail,
  persistPlanCookie,
  readClientCookie,
  writeClientCookie,
} from '@/lib/demo-session';
import { isPaidPlan, parsePlan, type PaidPlanId, type PlanId } from '@/lib/tiers';

export const TRIAL_COOKIE = 'agents61_trial_used';
export const TRIAL_STORAGE_KEY = 'agents61_trial_used';
export const TRIAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
export const TEASER_BRIEF_COUNT = 3;

export const TRIAL_FORBIDDEN = {
  error: 'Trial used — choose a desk to continue.',
  code: 'trial_used' as const,
};

export type DeskEntitlement = {
  skipPaywall: boolean;
  trialUsed: boolean;
  canGenerate: boolean;
  /** Seating for this run. Unpaid trial uses Analyst 16 so there is something to lock. */
  runPlan: PlanId;
};

export function evaluateEntitlement(input: {
  planRaw?: string | null;
  emailRaw?: string | null;
  trialRaw?: string | null;
}): DeskEntitlement {
  const email = input.emailRaw ? decodeURIComponent(input.emailRaw) : '';
  const demo = Boolean(email) && isDemoEmail(email);
  const paid = isPaidPlan(input.planRaw);
  const skipPaywall = paid || demo;
  const trialUsed = input.trialRaw === '1';
  return {
    skipPaywall,
    trialUsed,
    canGenerate: skipPaywall || !trialUsed,
    runPlan: paid ? parsePlan(input.planRaw) : 'analyst',
  };
}

export function entitlementFromJar(get: (name: string) => string | undefined): DeskEntitlement {
  return evaluateEntitlement({
    planRaw: get(PLAN_COOKIE),
    emailRaw: get(EMAIL_COOKIE),
    trialRaw: get(TRIAL_COOKIE),
  });
}

export function readTrialUsed(): boolean {
  if (readClientCookie(TRIAL_COOKIE) === '1') return true;
  try {
    return localStorage.getItem(TRIAL_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function persistTrialUsed(): void {
  writeClientCookie(TRIAL_COOKIE, '1', TRIAL_COOKIE_MAX_AGE);
  try {
    localStorage.setItem(TRIAL_STORAGE_KEY, '1');
  } catch {
    /* private mode */
  }
}

export function clearTrialUsed(): void {
  writeClientCookie(TRIAL_COOKIE, '', 0);
  try {
    localStorage.removeItem(TRIAL_STORAGE_KEY);
  } catch {
    /* private mode */
  }
}

export function unlockPaidDesk(plan: PaidPlanId): void {
  persistPlanCookie(plan);
  clearTrialUsed();
}

export const TRIAL_COOKIE_SET = {
  name: TRIAL_COOKIE,
  value: '1',
  options: {
    path: '/',
    maxAge: TRIAL_COOKIE_MAX_AGE,
    sameSite: 'lax' as const,
  },
};
