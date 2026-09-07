'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { persistDeskSession, type DeskSession } from '@/lib/demo-session';
import { safeNext } from '@/lib/safe-next';
import { isPaidPlan, parsePlan } from '@/lib/tiers';

type AuthOk = DeskSession & { next?: string; needsConfirm?: boolean; demo?: boolean };

function GoogleMark() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.4c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.7z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1C3.3 21.3 7.4 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.3 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.3C.5 8.3 0 10.1 0 12s.5 3.7 1.3 5.4l4-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C18 1.1 15.2 0 12 0 7.4 0 3.3 2.7 1.3 6.6l4 3.1C6.2 6.9 8.9 4.8 12 4.8z"
      />
    </svg>
  );
}

export default function AuthForm({
  mode,
  plan,
  next,
  oauthError,
}: {
  mode: 'login' | 'register';
  plan?: string;
  next?: string;
  oauthError?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState<'form' | 'preview' | ''>('');
  const [error, setError] = useState(oauthError ?? '');
  const [confirmNote, setConfirmNote] = useState('');

  const founding = plan === 'founding';
  const title = mode === 'login' ? 'Log in' : founding ? 'Claim Founding Committee' : 'Create your desk';
  const cta = mode === 'login' ? 'Enter desk' : founding ? 'Create account' : 'Create desk';

  function land(data: AuthOk) {
    persistDeskSession({
      email: data.email,
      plan: parsePlan(data.plan),
      ticker: data.ticker || 'AAPL',
    });
    const dest =
      safeNext(next) ??
      (isPaidPlan(data.plan) ? `/dashboard?entry=analyze&plan=${data.plan}` : data.next) ??
      `/dashboard?entry=analyze&plan=${data.plan}`;
    router.push(dest);
    router.refresh();
  }

  async function go(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setConfirmNote('');
    setBusy('form');
    try {
      const res = await fetch(mode === 'login' ? '/api/auth/login' : '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, plan }),
      });
      const data = (await res.json()) as AuthOk & { error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Could not sign in.');
        return;
      }
      if (data.needsConfirm) {
        setConfirmNote(`Check ${data.email ?? email} to confirm the account, then log in.`);
        return;
      }
      land(data);
    } catch {
      setError('Network error. Try again.');
    } finally {
      setBusy('');
    }
  }

  const googleHref = (() => {
    const q = new URLSearchParams();
    if (next) q.set('next', next);
    if (plan) q.set('plan', plan);
    const qs = q.toString();
    return qs ? `/api/auth/google?${qs}` : '/api/auth/google';
  })();

  function goGoogle() {
    setError('');
    setBusy('preview');
    window.location.href = googleHref;
  }

  async function previewDesk() {
    setError('');
    setBusy('preview');
    try {
      const res = await fetch('/api/auth/preview', { method: 'POST' });
      const data = (await res.json()) as AuthOk & { error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Preview desk is unavailable.');
        return;
      }
      land(data);
    } catch {
      setError('Network error. Try again.');
    } finally {
      setBusy('');
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="badge badge-primary mb-4">{mode === 'login' ? 'Desk login' : 'New account'}</div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{title}</h1>
      <p className="text-sm text-slate-600 mb-6">
        {mode === 'login'
          ? 'Sign in with Google or email. Paid seating unlocks after card or crypto checkout on that same email.'
          : founding
            ? 'Create the account first. Founding Committee ($1,190/year) is charged on the next screen — registering does not unlock seats.'
            : 'New desks start on Observer until that email pays. Google is the fastest path if you already used it here.'}
      </p>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <button type="button" onClick={goGoogle} disabled={Boolean(busy)} className="btn-secondary w-full justify-center mb-4">
        <GoogleMark />
        {busy === 'preview' ? 'Opening Google…' : 'Continue with Google'}
      </button>
      <p className="mb-4 text-center text-xs text-slate-400">
        If Google does not open, the network is blocking accounts.google.com — use email below.
      </p>

      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200" />
        </div>
        <p className="relative flex justify-center">
          <span className="bg-[var(--color-bg,#fff)] px-3 text-xs font-medium uppercase tracking-wider text-slate-400">
            or email
          </span>
        </p>
      </div>

      <form onSubmit={go} className="card p-6 md:p-8 space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="username"
            className="mt-1.5 w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0052d9]/30 focus:border-[#0052d9]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            className="mt-1.5 w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0052d9]/30 focus:border-[#0052d9]"
          />
        </div>
        {confirmNote && <p className="text-sm text-slate-600">{confirmNote}</p>}
        <button type="submit" disabled={Boolean(busy)} className="btn-primary w-full justify-center">
          {busy === 'form' ? 'Working…' : cta}
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </form>
      {mode === 'login' && (
        <p className="mt-3 text-center text-xs text-slate-400">
          <button
            type="button"
            onClick={previewDesk}
            disabled={Boolean(busy)}
            className="font-medium text-slate-500 hover:text-[#0052d9] underline-offset-2 hover:underline disabled:opacity-50"
          >
            {busy === 'preview' ? 'Opening preview…' : 'Open preview desk'}
          </button>
        </p>
      )}
      <p className="mt-4 text-center text-sm text-slate-500">
        {mode === 'login' ? (
          <>
            No account?{' '}
            <Link href="/register" className="font-semibold text-[#0052d9] hover:underline">
              Register
            </Link>
          </>
        ) : (
          <>
            Already here?{' '}
            <Link href="/login" className="font-semibold text-[#0052d9] hover:underline">
              Log in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
