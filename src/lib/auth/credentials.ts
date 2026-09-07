import { normalizeEmail } from '@/lib/demo-session';

export function parseAuthBody(raw: unknown): { email: string; password: string } | { error: string } {
  const body = raw && typeof raw === 'object' ? (raw as { email?: unknown; password?: unknown }) : {};
  const email = normalizeEmail(typeof body.email === 'string' ? body.email : '');
  const password = typeof body.password === 'string' ? body.password : '';
  if (!email.includes('@')) return { error: 'Need a valid email.' };
  if (password.length < 6) return { error: 'Password must be at least 6 characters.' };
  if (password.length > 72) return { error: 'Password is too long.' };
  return { email, password };
}
