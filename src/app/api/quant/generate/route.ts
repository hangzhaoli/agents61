import { cookies } from 'next/headers';
import { generateQuantStrategy } from '@/lib/llm/write-quant-strategy';
import { QUANT_MASTERS } from '@/lib/quant-lab/masters';
import { normalizeQuantTicker } from '@/lib/quant-lab/crypto-tickers';
import type { QuantMasterSlug } from '@/lib/quant-lab/types';
import { entitlementFromJar, TRIAL_FORBIDDEN } from '@/lib/desk-trial';
import { isUnlocked, parsePlan } from '@/lib/tiers';
import { PLAN_COOKIE } from '@/lib/demo-session';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const SLUGS = new Set(QUANT_MASTERS.map((m) => m.slug));

export async function POST(request: Request) {
  let body: { masterSlug?: string; ticker?: string; notes?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const masterSlug = (body.masterSlug ?? '').trim() as QuantMasterSlug;
  const ticker = normalizeQuantTicker(body.ticker ?? 'SPY');
  if (!SLUGS.has(masterSlug)) {
    return Response.json({ error: 'Pick a Quant Lab master.' }, { status: 400 });
  }
  if (!ticker || ticker.length > 16) {
    return Response.json({ error: 'Ticker required (max 16 chars).' }, { status: 400 });
  }

  const jar = await cookies();
  const ent = entitlementFromJar((name) => jar.get(name)?.value);
  if (!ent.canGenerate) {
    return Response.json(TRIAL_FORBIDDEN, { status: 403 });
  }

  const plan = parsePlan(jar.get(PLAN_COOKIE)?.value ?? ent.runPlan);
  if (!isUnlocked(plan, masterSlug)) {
    return Response.json(
      { error: `${masterSlug} is locked on ${plan}. Upgrade seating to compile this master.` },
      { status: 403 }
    );
  }

  const result = await generateQuantStrategy({
    masterSlug,
    ticker,
    notes: body.notes?.trim(),
  });

  return Response.json(result);
}
