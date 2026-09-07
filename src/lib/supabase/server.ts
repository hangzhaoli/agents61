import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabasePublishableKey, supabaseUrl } from '@/lib/supabase/env';

export async function supabaseServer() {
  const url = supabaseUrl();
  const key = supabasePublishableKey();
  if (!url || !key) return null;

  const jar = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return jar.getAll();
      },
      setAll(cookiesToSet, _headers) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            jar.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies; proxy refreshes the session.
        }
      },
    },
  });
}
