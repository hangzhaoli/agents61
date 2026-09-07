'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { initialsFrom, persistDeskProfile, readDeskProfile } from '@/lib/desk-profile';
import { readExtraUsage, TOKEN_EXTRAS, TOKEN_PACKS } from '@/lib/token-extras';
import { MARKETING_PLAN_IDS, PLANS, type PlanId } from '@/lib/tiers';

export default function AccountDesk({
  email,
  plan,
}: {
  email: string;
  plan: PlanId;
}) {
  const params = useSearchParams();
  const tab = params.get('tab') === 'profile' ? 'profile' : 'subscription';
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saved, setSaved] = useState(false);
  const [usage, setUsage] = useState({ runs: 0, lastId: '', lastAt: '' });
  const [credits, setCredits] = useState({ remaining: 0, granted: 0 });

  useEffect(() => {
    const p = readDeskProfile();
    setDisplayName(p.displayName);
    setAvatar(p.avatarDataUrl);
    setUsage(readExtraUsage());
    void fetch('/api/desk/extra-credits')
      .then((r) => r.json())
      .then((d: { remaining?: number; granted?: number }) => {
        setCredits({ remaining: d.remaining ?? 0, granted: d.granted ?? 0 });
      })
      .catch(() => undefined);
    const sync = () => setUsage(readExtraUsage());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const planMeta = PLANS[plan];
  const initials = initialsFrom(email, displayName);

  function onAvatar(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 200_000) {
      window.alert('Keep the avatar under 200 KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === 'string' ? reader.result : '';
      setAvatar(url);
    };
    reader.readAsDataURL(file);
  }

  function saveProfile(e: FormEvent) {
    e.preventDefault();
    persistDeskProfile({ displayName: displayName.trim(), avatarDataUrl: avatar });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  }

  return (
    <div className="section-container py-8 md:py-10 max-w-3xl">
      <div className="flex gap-2 mb-6">
        <Link
          href="/dashboard/account?tab=subscription"
          className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
            tab === 'subscription' ? 'bg-[#0052d9] text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Subscription
        </Link>
        <Link
          href="/dashboard/account?tab=profile"
          className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
            tab === 'profile' ? 'bg-[#0052d9] text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Settings
        </Link>
      </div>

      {tab === 'subscription' ? (
        <div className="space-y-6">
          <div>
            <div className="badge badge-primary mb-2">Subscription</div>
            <h1 className="text-2xl font-extrabold text-slate-900">Seats on this desk</h1>
            <p className="mt-2 text-sm text-slate-600">
              {email || 'No email on this device'} · {planMeta.name} · {planMeta.seats} seats ·{' '}
              {planMeta.price}
              {planMeta.period}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {MARKETING_PLAN_IDS.map((id) => (
              <Link
                key={id}
                href={`/checkout/waffo?plan=${id}`}
                className={`rounded-2xl border px-4 py-3 ${
                  id === plan ? 'border-[#0052d9] bg-blue-50/50' : 'border-slate-200 hover:border-[#0052d9]/30'
                }`}
              >
                <div className="text-sm font-bold text-slate-900">{PLANS[id].name}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {PLANS[id].seats} seats · {PLANS[id].price}/mo
                </div>
              </Link>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Cards via Waffo.{' '}
            <Link href="/checkout/nowpayments" className="text-[#0052d9] font-semibold hover:underline">
              Crypto
            </Link>
            {' · '}
            <Link href="/pricing" className="text-[#0052d9] font-semibold hover:underline">
              Compare seating
            </Link>
          </p>

          <div className="card-flat p-5">
            <h2 className="text-sm font-bold text-slate-900 mb-1">Token extras · DeepSeek V4 Flash</h2>
            <p className="text-xs text-slate-500 mb-3">
              Seat briefs stay in the plan. Filing extract and trigger packs are Waffo one-time
              SKUs — {credits.remaining} remaining
              {credits.granted ? ` of ${credits.granted} bought` : ''}. Device log: {usage.runs}
              {usage.lastId ? ` · last ${usage.lastId}` : ''}.
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              {TOKEN_EXTRAS.map((e) => (
                <li key={e.id} className="flex justify-between gap-3">
                  <span>
                    <span className="font-semibold">{e.name}</span>
                    <span className="block text-xs text-slate-500">{e.job}</span>
                  </span>
                  <span className="font-bold text-[#0052d9] shrink-0">${e.priceUsd.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {TOKEN_PACKS.map((p) => (
                <Link key={p.id} href={`/checkout/waffo?sku=${p.id}`} className="btn-secondary text-xs">
                  {p.name} · ${p.priceUsd}
                </Link>
              ))}
              <Link href="/dashboard?entry=clerk&extra=filing_extract" className="btn-primary text-xs">
                Open filing extra
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={saveProfile} className="space-y-5 max-w-md">
          <div>
            <div className="badge badge-primary mb-2">Settings</div>
            <h1 className="text-2xl font-extrabold text-slate-900">Avatar and name</h1>
            <p className="mt-2 text-sm text-slate-600">
              This is your desk face — not a master identity. Masters stay unaffiliated simulations.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="desk-app-avatar desk-app-avatar-lg" aria-hidden>
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="" />
              ) : (
                initials
              )}
            </span>
            <label className="btn-secondary cursor-pointer">
              Change photo
              <input type="file" accept="image/*" className="sr-only" onChange={onAvatar} />
            </label>
          </div>
          <div>
            <label className="checkout-label" htmlFor="displayName">
              Display name
            </label>
            <input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="checkout-field"
              placeholder="How the desk addresses you"
              maxLength={40}
            />
          </div>
          <div>
            <div className="checkout-label">Email</div>
            <p className="text-sm text-slate-700">{email || 'Not signed in on this device'}</p>
          </div>
          <button type="submit" className="btn-primary">
            {saved ? 'Saved' : 'Save settings'}
          </button>
        </form>
      )}
    </div>
  );
}
