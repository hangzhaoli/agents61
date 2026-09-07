import { NextResponse } from 'next/server';
import { writeDeskAuthCookies } from '@/lib/auth/desk-cookies';
import { checkoutAfterRegister, resolveDeskPlan } from '@/lib/auth/seat';
import { normalizeEmail } from '@/lib/demo-session';
import { safeNext } from '@/lib/safe-next';
import { isPaidPlan } from '@/lib/tiers';
import { supabaseServer } from '@/lib/supabase/server';

function siteOrigin(request: Request, fallback: string) {
  const forwardedHost = request.headers.get('x-forwarded-host');
  if (process.env.NODE_ENV !== 'development' && forwardedHost) {
    return `https://${forwardedHost}`;
  }
  return fallback;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const oauthError = searchParams.get('error_description') ?? searchParams.get('error');
  const next = safeNext(searchParams.get('next')) ?? '/dashboard?entry=analyze';
  const intentPlan = searchParams.get('plan');
  const base = siteOrigin(request, origin);

  if (oauthError) {
    return NextResponse.redirect(`${base}/login?error=${encodeURIComponent(oauthError)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${base}/login?error=${encodeURIComponent('Google sign-in was cancelled.')}`);
  }

  const supabase = await supabaseServer();
  if (!supabase) {
    return NextResponse.redirect(`${base}/login?error=${encodeURIComponent('Auth is not configured.')}`);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${base}/login?error=${encodeURIComponent('Google sign-in failed. Try again.')}`);
  }

  const { data } = await supabase.auth.getUser();
  const email = data.user?.email ? normalizeEmail(data.user.email) : '';
  if (!email.includes('@')) {
    return NextResponse.redirect(`${base}/login?error=${encodeURIComponent('Google did not return an email.')}`);
  }

  const plan = await resolveDeskPlan(email);
  await writeDeskAuthCookies(email, plan);

  const dest = isPaidPlan(plan)
    ? next.startsWith('/checkout')
      ? `/dashboard?entry=analyze&plan=${plan}`
      : next
    : intentPlan
      ? checkoutAfterRegister(intentPlan)
      : next;

  return NextResponse.redirect(`${base}${dest.startsWith('/') ? dest : `/${dest}`}`);
}
