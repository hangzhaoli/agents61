/**
 * Prediction Markets analyze entitlement.
 * Separate from equity-desk trial so each product gets one unpaid taste.
 */

import {
  EMAIL_COOKIE,
  PLAN_COOKIE,
  isDemoEmail,
  readClientCookie,
  writeClientCookie,
} from '@/lib/demo-session';
import { isPaidPlan } from '@/lib/tiers';

export const PRED_TRIAL_COOKIE = 'agents61_pred_trial_used';
export const PRED_TRIAL_STORAGE_KEY = 'agents61_pred_trial_used';
export const PRED_TRIAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const PRED_TRIAL_FORBIDDEN = {
  error: 'Free prediction analyze used — choose a desk to keep hunting gaps.',
  code: 'pred_trial_used' as const,
};

export type PredictionEntitlement = {
  skipPaywall: boolean;
  trialUsed: boolean;
  canAnalyze: boolean;
  /** Paid / demo desks get news + Pro clerk when keys exist. */
  useClerk: boolean;
};

export function evaluatePredictionEntitlement(input: {
  planRaw?: string | null;
  emailRaw?: string | null;
  trialRaw?: string | null;
}): PredictionEntitlement {
  const email = input.emailRaw ? decodeURIComponent(input.emailRaw) : '';
  const demo = Boolean(email) && isDemoEmail(email);
  const paid = isPaidPlan(input.planRaw);
  const skipPaywall = paid || demo;
  const trialUsed = input.trialRaw === '1';
  return {
    skipPaywall,
    trialUsed,
    canAnalyze: skipPaywall || !trialUsed,
    useClerk: skipPaywall,
  };
}

export function predictionEntitlementFromJar(
  get: (name: string) => string | undefined
): PredictionEntitlement {
  return evaluatePredictionEntitlement({
    planRaw: get(PLAN_COOKIE),
    emailRaw: get(EMAIL_COOKIE),
    trialRaw: get(PRED_TRIAL_COOKIE),
  });
}

export function readPredTrialUsed(): boolean {
  if (readClientCookie(PRED_TRIAL_COOKIE) === '1') return true;
  try {
    return localStorage.getItem(PRED_TRIAL_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function persistPredTrialUsed(): void {
  writeClientCookie(PRED_TRIAL_COOKIE, '1', PRED_TRIAL_COOKIE_MAX_AGE);
  try {
    localStorage.setItem(PRED_TRIAL_STORAGE_KEY, '1');
  } catch {
    /* private mode */
  }
}

export function clearPredTrialUsed(): void {
  writeClientCookie(PRED_TRIAL_COOKIE, '', 0);
  try {
    localStorage.removeItem(PRED_TRIAL_STORAGE_KEY);
  } catch {
    /* private mode */
  }
}

export const PRED_TRIAL_COOKIE_SET = {
  name: PRED_TRIAL_COOKIE,
  value: '1',
  options: {
    path: '/',
    maxAge: PRED_TRIAL_COOKIE_MAX_AGE,
    sameSite: 'lax' as const,
  },
};
