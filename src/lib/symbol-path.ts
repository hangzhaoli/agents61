import { resolveCryptoSymbol } from '@/lib/crypto-universe';

/** Public report URL. Guests can read this without registering. */
export function publicSymbolPath(raw: string): string {
  const crypto = resolveCryptoSymbol(raw);
  if (crypto) return `/crypto/${crypto.toLowerCase()}`;
  return `/stocks/${encodeURIComponent(raw.trim().toLowerCase())}`;
}
