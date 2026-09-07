import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabasePublishableKey, supabaseUrl } from '@/lib/supabase/env';

/** Refresh the Auth token on every matched request (Next.js 16 proxy). */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = supabaseUrl();
  const key = supabasePublishableKey();
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        if (headers) {
          Object.entries(headers).forEach(([header, value]) => {
            if (value) response.headers.set(header, String(value));
          });
        }
      },
    },
  });

  await supabase.auth.getClaims();
  return response;
}
