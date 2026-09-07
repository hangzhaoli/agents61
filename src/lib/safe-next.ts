/** Only same-origin relative paths. */
export function safeNext(raw?: string | string[] | null): string | null {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (!v || !v.startsWith('/') || v.startsWith('//') || v.includes('\\')) return null;
  return v;
}
