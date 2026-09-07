/**
 * Fake local desk session. Preview does not store passwords on a server.
 * Canonical test pair: demo@agents61.com / agents61 → Analyst seating.
 */

import { isPaidPlan, parsePlan, type PlanId } from '@/lib/tiers';

export const DEMO_EMAIL = 'demo@agents61.com';
export const DEMO_PASSWORD = 'agents61';
export const DEMO_PLAN: PlanId = 'analyst';
export const DEMO_TICKER = 'AAPL';

export const PLAN_COOKIE = 'agents61_plan';
export const EMAIL_COOKIE = 'agents61_email';
export const SESSION_KEY = 'agents61_session';
export const SESSION_EVENT = 'agents61-session';
export const PLAN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export type DeskSession = {
  email: string;
  plan: PlanId;
  ticker: string;
};

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isDemoEmail(email: string): boolean {
  return normalizeEmail(email) === DEMO_EMAIL;
}

export function isDemoCredentials(email: string, password: string): boolean {
  return isDemoEmail(email) && password === DEMO_PASSWORD;
}

export function sessionFromLogin(email: string, planRaw?: string): DeskSession {
  const founding = planRaw === 'founding';
  return {
    email: normalizeEmail(email),
    plan: founding ? 'committee' : isPaidPlan(planRaw) ? parsePlan(planRaw) : DEMO_PLAN,
    ticker: DEMO_TICKER,
  };
}

export function writeClientCookie(name: string, value: string, maxAge = PLAN_COOKIE_MAX_AGE): void {
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function readClientCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const parts = document.cookie.split(';');
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed.startsWith(`${name}=`)) continue;
    return decodeURIComponent(trimmed.slice(name.length + 1));
  }
  return null;
}

export function notifySessionChange(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function persistDeskSession(session: DeskSession): void {
  writeClientCookie(PLAN_COOKIE, session.plan);
  writeClientCookie(EMAIL_COOKIE, encodeURIComponent(session.email));
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* private mode */
  }
  notifySessionChange();
}

export function persistPlanCookie(plan: PlanId): void {
  writeClientCookie(PLAN_COOKIE, plan);
  try {
    const existing = readDeskSession();
    if (existing) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...existing, plan }));
    }
  } catch {
    /* private mode */
  }
  notifySessionChange();
}

export function clearDeskSession(): void {
  writeClientCookie(PLAN_COOKIE, '', 0);
  writeClientCookie(EMAIL_COOKIE, '', 0);
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* private mode */
  }
  notifySessionChange();
}

export function readDeskSession(): DeskSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DeskSession>;
    if (typeof parsed.email !== 'string' || !parsed.email) return null;
    return {
      email: normalizeEmail(parsed.email),
      plan: parsePlan(parsed.plan),
      ticker: typeof parsed.ticker === 'string' && parsed.ticker ? parsed.ticker.toUpperCase() : DEMO_TICKER,
    };
  } catch {
    return null;
  }
}
