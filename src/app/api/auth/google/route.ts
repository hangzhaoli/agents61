import { NextResponse } from 'next/server';
import { checkoutAfterRegister } from '@/lib/auth/seat';
import { safeNext } from '@/lib/safe-next';
import { supabaseBrowserConfigured } from '@/lib/supabase/env';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function publicOrigin(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL
    ?.replace(/\\n/g, '')
    .trim()
    .replace(/\/$/, '');
  if (configured?.startsWith('https://')) return configured;
  const forwarded = request.headers.get('x-forwarded-host');
  if (forwarded) {
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    return `${proto}://${forwarded.split(',')[0].trim()}`;
  }
  return new URL(request.url).origin;
}

async function startGoogleOAuth(request: Request, nextRaw?: string | null, planRaw?: string | null) {
  if (!supabaseBrowserConfigured()) {
    return { error: 'Google sign-in is not configured.', url: null as string | null };
  }
  const supabase = await supabaseServer();
  if (!supabase) {
    return { error: 'Google sign-in is not configured.', url: null as string | null };
  }

  const next = safeNext(nextRaw) ?? checkoutAfterRegister(planRaw);
  const callback = new URL('/auth/callback', publicOrigin(request));
  callback.searchParams.set('next', next);
  if (planRaw) callback.searchParams.set('plan', planRaw);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callback.toString(),
      skipBrowserRedirect: true,
      queryParams: { prompt: 'select_account' },
    },
  });

  if (error || !data.url) {
    return {
      error: error?.message ?? 'Google sign-in is not enabled on this project yet.',
      url: null as string | null,
    };
  }
  return { error: null as string | null, url: data.url };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const started = await startGoogleOAuth(request, searchParams.get('next'), searchParams.get('plan'));
  if (!started.url) {
    const login = new URL('/login', publicOrigin(request));
    login.searchParams.set('error', started.error ?? 'Google sign-in is not available.');
    return NextResponse.redirect(login);
  }
  return NextResponse.redirect(started.url);
}

export async function POST(request: Request) {
  let raw: { next?: unknown; plan?: unknown } = {};
  try {
    raw = (await request.json()) as typeof raw;
  } catch {
    raw = {};
  }
  const started = await startGoogleOAuth(
    request,
    typeof raw.next === 'string' ? raw.next : null,
    typeof raw.plan === 'string' ? raw.plan : null
  );
  if (!started.url) {
    return NextResponse.json({ error: started.error ?? 'Google sign-in is not available.' }, { status: 400 });
  }
  return NextResponse.json({ url: started.url });
}
