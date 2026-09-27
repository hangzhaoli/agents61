import { cookies } from 'next/headers';
import { QUANT_MASTERS } from '@/lib/quant-lab/masters';
import { getQuantPool, type QuantPoolId } from '@/lib/quant-lab/equity-universe';
import { runQuantPipeline } from '@/lib/quant-lab/pipeline';
import type { QuantMasterSlug } from '@/lib/quant-lab/types';
import { entitlementFromJar, TRIAL_FORBIDDEN } from '@/lib/desk-trial';
import { isUnlocked, parsePlan } from '@/lib/tiers';
import { PLAN_COOKIE } from '@/lib/demo-session';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SLUGS = new Set(QUANT_MASTERS.map((m) => m.slug));

export async function POST(request: Request) {
  let body: {
    masterSlug?: string;
    poolId?: string;
    maxPositions?: number;
    topN?: number;
  } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const masterSlug = (body.masterSlug ?? '').trim() as QuantMasterSlug;
  const poolId = (body.poolId ?? 'liquid-mega').trim() as QuantPoolId;
  if (!SLUGS.has(masterSlug)) {
    return Response.json({ error: 'Pick a Quant Lab master.' }, { status: 400 });
  }
  if (!getQuantPool(poolId)) {
    return Response.json({ error: 'Pick a stock / crypto pool.' }, { status: 400 });
  }

  const jar = await cookies();
  const ent = entitlementFromJar((name) => jar.get(name)?.value);
  if (!ent.canGenerate) {
    return Response.json(TRIAL_FORBIDDEN, { status: 403 });
  }

  const plan = parsePlan(jar.get(PLAN_COOKIE)?.value ?? ent.runPlan);
  if (!isUnlocked(plan, masterSlug)) {
    return Response.json(
      { error: `${masterSlug} is locked on ${plan}. Upgrade seating to run this pipeline.` },
      { status: 403 }
    );
  }

  try {
    const result = await runQuantPipeline({
      masterSlug,
      poolId,
      maxPositions: body.maxPositions,
      topN: body.topN,
    });
    return Response.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Pipeline failed';
    return Response.json({ error: msg }, { status: 500 });
  }
}
