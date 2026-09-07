import { cookies } from 'next/headers';
import { extraCreditBalance, extraEmailFromJar } from '@/lib/billing/extra-credits';

export const dynamic = 'force-dynamic';

export async function GET() {
  const jar = await cookies();
  const email = extraEmailFromJar((name) => jar.get(name)?.value);
  if (!email.includes('@')) {
    return Response.json({ email: '', granted: 0, used: 0, remaining: 0 });
  }
  const balance = await extraCreditBalance(email);
  return Response.json(balance);
}
