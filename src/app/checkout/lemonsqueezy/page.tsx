import { redirect } from 'next/navigation';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Lemon Squeezy rail retired — Waffo Pancake is the card pay path. */
export default async function LemonCheckoutRedirect({ searchParams }: Props) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  for (const [key, raw] of Object.entries(sp)) {
    if (typeof raw === 'string') q.set(key, raw);
    else if (Array.isArray(raw) && raw[0]) q.set(key, raw[0]);
  }
  const qs = q.toString();
  redirect(`/checkout/waffo${qs ? `?${qs}` : ''}`);
}
