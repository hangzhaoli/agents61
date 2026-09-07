import { cookies } from 'next/headers';
import { buildDeskPlan } from '@/lib/desk-plan';
import { entitlementFromJar, TRIAL_FORBIDDEN } from '@/lib/desk-trial';

export async function POST(request: Request) {
  let body: { message?: string; plan?: string } = {};
  try {
    body = (await request.json()) as { message?: string; plan?: string };
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const message = (body.message ?? '').trim();
  if (!message || message.length > 2000) {
    return Response.json({ error: 'Ask the desk in 1–2000 characters.' }, { status: 400 });
  }

  const jar = await cookies();
  const ent = entitlementFromJar((name) => jar.get(name)?.value);
  if (!ent.canGenerate) {
    return Response.json(TRIAL_FORBIDDEN, { status: 403 });
  }

  const plan = ent.skipPaywall ? ent.runPlan : 'analyst';
  return Response.json(buildDeskPlan(message, plan));
}
