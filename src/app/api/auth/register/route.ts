import { NextResponse } from 'next/server';
import { parseAuthBody } from '@/lib/auth/credentials';
import { writeDeskAuthCookies } from '@/lib/auth/desk-cookies';
import { checkoutAfterRegister, resolveDeskPlan } from '@/lib/auth/seat';
import { DEMO_TICKER, isDemoEmail } from '@/lib/demo-session';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { supabaseBrowserConfigured } from '@/lib/supabase/env';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(request: Request) {
  let raw: { email?: unknown; password?: unknown; plan?: unknown } = {};
  try {
    raw = (await request.json()) as typeof raw;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const parsed = parseAuthBody(raw);
  if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { email, password } = parsed;
  if (isDemoEmail(email)) {
    return NextResponse.json(
      { error: 'That address is reserved. Use your own email, or continue with Google.' },
      { status: 400 }
    );
  }

  if (!supabaseBrowserConfigured()) {
    return NextResponse.json({ error: 'Registration is not live yet.' }, { status: 503 });
  }

  const admin = supabaseAdmin();
  if (admin) {
    const created = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (created.error) {
      const msg = created.error.message.toLowerCase();
      if (msg.includes('already') || msg.includes('registered') || created.error.status === 422) {
        return NextResponse.json(
          { error: 'That email is already registered. Log in, or continue with Google.' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: created.error.message }, { status: 400 });
    }
  }

  const supabase = await supabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: 'Registration is not live yet.' }, { status: 503 });
  }

  if (!admin) {
    const signedUp = await supabase.auth.signUp({ email, password });
    if (signedUp.error) {
      const msg = signedUp.error.message.toLowerCase();
      if (msg.includes('already') || msg.includes('registered')) {
        return NextResponse.json(
          { error: 'That email is already registered. Log in, or continue with Google.' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: signedUp.error.message }, { status: 400 });
    }
    if (!signedUp.data.session) {
      return NextResponse.json({
        needsConfirm: true,
        email,
        next: checkoutAfterRegister(typeof raw.plan === 'string' ? raw.plan : null),
      });
    }
  } else {
    const signedIn = await supabase.auth.signInWithPassword({ email, password });
    if (signedIn.error || !signedIn.data.user?.email) {
      return NextResponse.json({ error: 'Account created, but sign-in failed. Try logging in.' }, { status: 400 });
    }
  }

  const plan = await resolveDeskPlan(email);
  await writeDeskAuthCookies(email, plan);
  return NextResponse.json({
    email,
    plan,
    ticker: DEMO_TICKER,
    next: checkoutAfterRegister(typeof raw.plan === 'string' ? raw.plan : null),
  });
}
