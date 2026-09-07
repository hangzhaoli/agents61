import { cookies } from 'next/headers';
import { EMAIL_COOKIE, normalizeEmail } from '@/lib/demo-session';
import { supabaseServer } from '@/lib/supabase/server';

/** Logged-in desk email — Supabase Auth first, then the desk cookie (demo / paid confirm). */
export async function syncUserEmail(): Promise<string | null> {
  const supabase = await supabaseServer();
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    const fromAuth = data.user?.email ? normalizeEmail(data.user.email) : null;
    if (fromAuth?.includes('@')) return fromAuth;
  }

  const jar = await cookies();
  const raw = jar.get(EMAIL_COOKIE)?.value;
  if (!raw) return null;
  try {
    const email = normalizeEmail(decodeURIComponent(raw));
    return email.includes('@') ? email : null;
  } catch {
    return null;
  }
}
