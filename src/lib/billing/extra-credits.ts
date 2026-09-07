/**
 * Token-extra balance: Waffo pack purchases minus consumed runs.
 * Grants come from the Waffo webhook ledger (or GraphQL fallback).
 * Consumes go to desk_extra_usage when Supabase is up.
 */

import { EMAIL_COOKIE, isDemoEmail, normalizeEmail } from '@/lib/demo-session';
import { supabaseAdmin } from '@/lib/supabase/admin';
import {
  extraPackBySku,
  findPaidWaffoExtraGraphQL,
  parseWaffoExtraSku,
} from '@/lib/waffo-extras';
import { waffoTestUnlock } from '@/lib/waffo';
import { EXTRA_CREDITS_FORBIDDEN, type TokenExtraId, type TokenPackId } from '@/lib/token-extras';

export { EXTRA_CREDITS_FORBIDDEN };

export type ExtraBalance = {
  email: string;
  granted: number;
  used: number;
  remaining: number;
};

type BillingRow = {
  event_type: string;
  sku: string | null;
  mode: string;
  order_id: string | null;
};

const GRANT = new Set(['order.completed']);
const REVOKE = new Set(['refund.succeeded']);

function runsForSku(sku: string | null): number {
  const extra = parseWaffoExtraSku(sku);
  return extra ? extraPackBySku(extra).runs : 0;
}

async function grantedFromLedger(email: string, allowTest: boolean): Promise<number> {
  const db = supabaseAdmin();
  if (!db) return 0;
  const { data, error } = await db
    .from('desk_billing_waffo')
    .select('event_type, sku, mode, order_id')
    .eq('buyer_email', email)
    .order('created_at', { ascending: false })
    .limit(200);
  if (error || !data) return 0;

  const latest = new Map<string, BillingRow>();
  for (const row of data as BillingRow[]) {
    const extra = parseWaffoExtraSku(row.sku);
    if (!extra) continue;
    const key = row.order_id || `${row.sku}:${row.event_type}`;
    if (latest.has(key)) continue;
    latest.set(key, row);
  }

  let runs = 0;
  for (const row of latest.values()) {
    if (row.mode === 'test' && !allowTest) continue;
    const n = runsForSku(row.sku);
    if (!n) continue;
    if (GRANT.has(row.event_type)) runs += n;
    else if (REVOKE.has(row.event_type)) runs -= n;
  }
  return Math.max(0, runs);
}

async function usedFromLedger(email: string): Promise<number> {
  const db = supabaseAdmin();
  if (!db) return 0;
  const { count, error } = await db
    .from('desk_extra_usage')
    .select('id', { count: 'exact', head: true })
    .eq('buyer_email', email);
  if (error || typeof count !== 'number') return 0;
  return count;
}

export async function extraCreditBalance(emailRaw: string): Promise<ExtraBalance> {
  const email = normalizeEmail(emailRaw);
  if (isDemoEmail(email)) {
    return { email, granted: 99, used: 0, remaining: 99 };
  }

  let granted = 0;
  try {
    granted = await grantedFromLedger(email, waffoTestUnlock());
  } catch {
    granted = 0;
  }

  if (granted === 0) {
    try {
      const gql = await findPaidWaffoExtraGraphQL({ email });
      if (gql) granted = gql.runs;
    } catch {
      /* keep 0 */
    }
  }

  let used = 0;
  try {
    used = await usedFromLedger(email);
  } catch {
    used = 0;
  }

  return {
    email,
    granted,
    used,
    remaining: Math.max(0, granted - used),
  };
}

export async function consumeExtraCredit(
  emailRaw: string,
  extra: TokenExtraId
): Promise<ExtraBalance | null> {
  const email = normalizeEmail(emailRaw);
  const before = await extraCreditBalance(email);
  if (before.remaining <= 0) return null;

  const db = supabaseAdmin();
  if (db && !isDemoEmail(email)) {
    const { error } = await db.from('desk_extra_usage').insert({
      buyer_email: email,
      extra_id: extra,
    });
    if (error) console.error('[extra-credits] consume failed', error.message);
  }

  return {
    ...before,
    used: before.used + 1,
    remaining: Math.max(0, before.remaining - 1),
  };
}

export function extraEmailFromJar(get: (name: string) => string | undefined): string {
  const raw = get(EMAIL_COOKIE);
  return raw ? decodeURIComponent(raw) : '';
}

export function extraCheckoutPath(sku: TokenPackId): string {
  return `/checkout/waffo?sku=${sku}`;
}
