import { cookies } from 'next/headers';
import { QUANT_MASTERS } from '@/lib/quant-lab/masters';
import { getQuantPool, type QuantPoolId } from '@/lib/quant-lab/equity-universe';
import { runQuantPipeline } from '@/lib/quant-lab/pipeline';
import type { QuantMasterSlug } from '@/lib/quant-lab/types';
import type { StrategyBookIntent } from '@/lib/paper-account/engine';
import { getDeskQuotes } from '@/lib/data/desk-quotes';
import { fetchDailyBars } from '@/lib/quant-lab/yahoo-bars';
import { entitlementFromJar, TRIAL_FORBIDDEN } from '@/lib/desk-trial';
import { isUnlocked, parsePlan } from '@/lib/tiers';
import { PLAN_COOKIE } from '@/lib/demo-session';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SLUGS = new Set(QUANT_MASTERS.map((m) => m.slug));

async function livePrice(symbol: string, fallback: number): Promise<{ price: number; source: string }> {
  const quotes = await getDeskQuotes([symbol]);
  const q = quotes.get(symbol);
  if (q?.price != null && q.price > 0) return { price: q.price, source: q.source };
  const { bars, source } = await fetchDailyBars(symbol);
  const last = bars[bars.length - 1];
  if (last?.close > 0) return { price: last.close, source };
  if (fallback > 0) return { price: fallback, source: 'pipeline' };
  return { price: 0, source: 'none' };
}

/**
 * Run master universe screen → multi-name signals, then attach live marks
 * so the client can book them into the $100k paper account.
 */
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
      { error: `${masterSlug} is locked on ${plan}. Upgrade seating to run this strategy.` },
      { status: 403 }
    );
  }

  const maxPositions = Math.max(1, Math.min(8, body.maxPositions ?? 4));
  try {
    const pipeline = await runQuantPipeline({
      masterSlug,
      poolId,
      maxPositions,
      topN: body.topN,
    });

    const intents: StrategyBookIntent[] = [];
    for (const sig of pipeline.signals) {
      let action: 'buy' | 'sell' | null = null;
      if (sig.action === 'sell') action = 'sell';
      else if (sig.action === 'buy' || sig.action === 'hold') action = 'buy';
      if (!action) continue;
      const live = await livePrice(sig.ticker, sig.price);
      if (!(live.price > 0)) continue;
      const openLot = pipeline.positions.find((p) => p.ticker === sig.ticker && p.status === 'open');
      intents.push({
        ticker: sig.ticker,
        action,
        price: live.price,
        reason: `${pipeline.masterLabel}: ${sig.reason}`,
        masterSlug,
        stopPrice: openLot?.stopPrice,
      });
    }

    // Prefer open pipeline positions as buys when signals are flat
    if (intents.filter((i) => i.action === 'buy').length === 0) {
      for (const p of pipeline.positions.filter((x) => x.status === 'open')) {
        const live = await livePrice(p.ticker, p.lastPrice);
        if (!(live.price > 0)) continue;
        intents.push({
          ticker: p.ticker,
          action: 'buy',
          price: live.price,
          reason: `${pipeline.masterLabel}: pipeline open`,
          masterSlug,
          stopPrice: p.stopPrice,
        });
      }
    }

    const buyIntents = intents.filter((i) => i.action === 'buy').slice(0, maxPositions);
    const sellIntents = intents.filter((i) => i.action === 'sell');

    return Response.json({
      masterSlug,
      masterLabel: pipeline.masterLabel,
      poolId: pipeline.poolId,
      poolLabel: pipeline.poolLabel,
      summary: pipeline.summary,
      screened: pipeline.screened.slice(0, 10),
      intents: [...sellIntents, ...buyIntents],
      dataNote: pipeline.dataNote,
      disclaimer: pipeline.disclaimer,
      ranAt: new Date().toISOString(),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Strategy run failed';
    return Response.json({ error: msg }, { status: 500 });
  }
}
