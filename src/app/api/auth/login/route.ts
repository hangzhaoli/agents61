import { NextResponse } from 'next/server';
import { parseAuthBody } from '@/lib/auth/credentials';
import { writeDeskAuthCookies } from '@/lib/auth/desk-cookies';
import { resolveDeskPlan } from '@/lib/auth/seat';
import { DEMO_TICKER, isDemoCredentials } from '@/lib/demo-session';
import { supabaseServer } from '@/lib/supabase/server';
import { supabaseBrowserConfigured } from '@/lib/supabase/env';

export async function POST(request: Request) {
  let raw: unknown = {};
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const parsed = parseAuthBody(raw);
  if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { email, password } = parsed;

  if (isDemoCredentials(email, password)) {
    const plan = await resolveDeskPlan(email);
    await writeDeskAuthCookies(email, plan);
    return NextResponse.json({ email, plan, ticker: DEMO_TICKER, demo: true });
  }

  if (!supabaseBrowserConfigured()) {
    return NextResponse.json(
      { error: 'Account login is not live yet. Use the preview desk, or try again after Auth is configured.' },
      { status: 503 }
    );
  }

  const supabase = await supabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: 'Account login is not live yet.' }, { status: 503 });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user?.email) {
    return NextResponse.json({ error: 'Email or password is wrong.' }, { status: 401 });
  }

  const signed = data.user.email.toLowerCase();
  const plan = await resolveDeskPlan(signed);
  await writeDeskAuthCookies(signed, plan);
  return NextResponse.json({ email: signed, plan, ticker: DEMO_TICKER });
}
