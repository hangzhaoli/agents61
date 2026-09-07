/** Public Supabase credentials. Anon / publishable keys are interchangeable here. */

export function supabaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\\n$/, '') || null;
}

export function supabasePublishableKey(): string | null {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    null
  );
}

export function supabaseBrowserConfigured(): boolean {
  return Boolean(supabaseUrl() && supabasePublishableKey());
}
