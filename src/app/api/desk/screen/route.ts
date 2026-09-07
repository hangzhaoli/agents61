import { cookies } from 'next/headers';
import { parseDeskMode } from '@/lib/desk-mode';
import { entitlementFromJar, TRIAL_COOKIE, TRIAL_COOKIE_SET, TRIAL_FORBIDDEN } from '@/lib/desk-trial';
import { parseScreenMarket, runLineupScreen, type ScreenMarket } from '@/lib/lineup-screen';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: { slugs?: string[]; market?: string; mode?: string } = {};
  try {
    body = (await request.json()) as { slugs?: string[]; market?: string; mode?: string };
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const slugs = Array.isArray(body.slugs) ? body.slugs.slice(0, 61) : [];
  if (!slugs.length) {
    return Response.json({ error: 'Line up at least one unlocked master.' }, { status: 400 });
  }

  const jar = await cookies();
  const ent = entitlementFromJar((name) => jar.get(name)?.value);
  if (!ent.canGenerate) {
    return Response.json(TRIAL_FORBIDDEN, { status: 403 });
  }

  const plan = ent.skipPaywall ? ent.runPlan : 'analyst';
  if (!ent.skipPaywall) {
    jar.set(TRIAL_COOKIE, TRIAL_COOKIE_SET.value, TRIAL_COOKIE_SET.options);
  }

  const market: ScreenMarket = parseScreenMarket(body.market);
  const mode = parseDeskMode(body.mode);
  const result = runLineupScreen({ plan, slugs, market, mode });
  if (!result.briefs.length) {
    return Response.json(
      { error: 'Those seats are locked on this desk. Empty seats stay empty.' },
      { status: 400 }
    );
  }

  return Response.json({ plan, ...result });
}
