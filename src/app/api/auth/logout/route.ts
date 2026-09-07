import { NextResponse } from 'next/server';
import { clearDeskAuthCookies } from '@/lib/auth/desk-cookies';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST() {
  const supabase = await supabaseServer();
  if (supabase) {
    await supabase.auth.signOut();
  }
  await clearDeskAuthCookies();
  return NextResponse.json({ ok: true });
}
