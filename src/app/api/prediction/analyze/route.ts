import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { analyzePredictionMarket } from '@/lib/prediction/analyze';
import { getCachedReport } from '@/lib/prediction/cache';
import {
  PRED_TRIAL_COOKIE,
  PRED_TRIAL_COOKIE_SET,
  PRED_TRIAL_FORBIDDEN,
  predictionEntitlementFromJar,
} from '@/lib/prediction/entitlement';
import { getPredictionMarket } from '@/lib/prediction/polymarket';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const market = await getPredictionMarket(id);
  if (!market) return NextResponse.json({ error: 'Market not found' }, { status: 404 });
  const report = getCachedReport(market.id);
  return NextResponse.json({ market, report });
}

export async function POST(request: Request) {
  let body: { id?: string } = {};
  try {
    body = (await request.json()) as { id?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const id = body.id?.trim();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const jar = await cookies();
  const ent = predictionEntitlementFromJar((name) => jar.get(name)?.value);
  if (!ent.canAnalyze) {
    return NextResponse.json(PRED_TRIAL_FORBIDDEN, { status: 403 });
  }

  const market = await getPredictionMarket(id);
  if (!market) return NextResponse.json({ error: 'Market not found' }, { status: 404 });

  const report = await analyzePredictionMarket(market, { useClerk: ent.useClerk });

  if (!ent.skipPaywall) {
    jar.set(PRED_TRIAL_COOKIE, PRED_TRIAL_COOKIE_SET.value, PRED_TRIAL_COOKIE_SET.options);
  }

  return NextResponse.json({
    market,
    report,
    entitlement: {
      skipPaywall: ent.skipPaywall,
      useClerk: ent.useClerk,
      trialBurned: !ent.skipPaywall,
    },
  });
}
