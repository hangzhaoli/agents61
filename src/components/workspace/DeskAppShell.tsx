'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Bell,
  Bitcoin,
  Compass,
  CreditCard,
  Crosshair,
  FlaskConical,
  LayoutGrid,
  MessageSquare,
  Rocket,
  Settings2,
  Users,
} from 'lucide-react';
import { initialsFrom, PROFILE_EVENT, readDeskProfile } from '@/lib/desk-profile';
import { DESK_ENTRIES, parseWorkspaceEntry, type WorkspaceEntry } from '@/lib/desk-nav';
import { DESK_MODES, parseDeskMode, type DeskMode } from '@/lib/desk-mode';
import { flashCheckoutHref } from '@/lib/flash-offer';
import { MASTERS } from '@/lib/masters';
import { isPaidPlan, isUnlocked, PLANS, type PlanId } from '@/lib/tiers';

const ACCOUNT = [
  { href: '/dashboard?entry=clerk', match: 'clerk', label: 'Clerk', hint: 'Coordinate seats', icon: MessageSquare },
  { href: '/dashboard/kits', match: 'kits', label: 'Work kits', hint: 'Investor jobs', icon: LayoutGrid },
  { href: '/dashboard/account?tab=subscription', match: 'subscription', label: 'Subscription', hint: 'Seats and extras', icon: CreditCard },
  { href: '/dashboard/account?tab=profile', match: 'profile', label: 'Settings', hint: 'Avatar and name', icon: Settings2 },
] as const;

const ENTRY_ICONS = {
  analyze: Crosshair,
  discover: Compass,
  crypto: Bitcoin,
  private: Rocket,
  quant: FlaskConical,
  watchlist: Bell,
  lineup: Users,
} as const;

export default function DeskAppShell({
  email,
  plan,
}: {
  email: string;
  plan: PlanId;
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const [profile, setProfile] = useState({ displayName: '', avatarDataUrl: '' });
  const [flashActive, setFlashActive] = useState(false);

  useEffect(() => {
    const sync = () => setProfile(readDeskProfile());
    sync();
    window.addEventListener(PROFILE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(PROFILE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    if (isPaidPlan(plan)) {
      setFlashActive(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/billing/flash-offer', { cache: 'no-store' });
        const data = (await res.json()) as { active?: boolean };
        if (!cancelled) setFlashActive(Boolean(data.active));
      } catch {
        if (!cancelled) setFlashActive(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [plan]);

  const tab = params.get('tab');
  const entryParam = params.get('entry');
  const entry = parseWorkspaceEntry(entryParam);
  const deskMode = parseDeskMode(params.get('mode'));
  const onDesk = pathname === '/dashboard';
  const initials = initialsFrom(email, profile.displayName);
  const planMeta = PLANS[plan];
  const unlocked = MASTERS.filter((m) => isUnlocked(plan, m.slug)).length;
  const locked = MASTERS.length - unlocked;

  function accountActive(match: string) {
    if (match === 'clerk') return onDesk && entry === 'clerk';
    if (match === 'kits') return pathname.startsWith('/dashboard/kits');
    if (match === 'subscription') return pathname.startsWith('/dashboard/account') && tab !== 'profile';
    if (match === 'profile') return pathname.startsWith('/dashboard/account') && tab === 'profile';
    return false;
  }

  function deskHref(id: WorkspaceEntry) {
    const q = new URLSearchParams();
    if (onDesk) {
      const mode = params.get('mode');
      const planQ = params.get('plan');
      const market = params.get('market');
      if (mode) q.set('mode', mode);
      if (planQ) q.set('plan', planQ);
      if (id === 'lineup') {
        if (market) q.set('market', market);
        else if (entryParam === 'crypto') q.set('market', 'crypto');
      }
    }
    q.set('entry', id);
    return `/dashboard?${q.toString()}`;
  }

  function setDeskMode(next: DeskMode) {
    const q = new URLSearchParams(params.toString());
    if (next === 'isolated') q.delete('mode');
    else q.set('mode', next);
    const qs = q.toString();
    router.replace(qs ? `/dashboard?${qs}` : '/dashboard', { scroll: false });
  }

  return (
    <aside className="desk-app-rail" aria-label="Desk">
      <div className="desk-app-user">
        <span className="desk-app-avatar" aria-hidden>
          {profile.avatarDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatarDataUrl} alt="" />
          ) : (
            initials
          )}
        </span>
        <div className="min-w-0">
          <div className="text-sm font-bold text-slate-900 truncate">
            {profile.displayName || email.split('@')[0] || 'Desk'}
          </div>
          <div className="text-[11px] text-slate-500 truncate">
            {planMeta.name} · {email || 'signed out'}
          </div>
        </div>
      </div>

      <nav className="desk-app-nav" aria-label="Desk destinations">
        <div className="desk-app-kicker">Account</div>
        {ACCOUNT.map((item) => {
          const Icon = item.icon;
          const on = accountActive(item.match);
          return (
            <Link
              key={item.match}
              href={item.match === 'clerk' ? deskHref('clerk') : item.href}
              className={`desk-app-link ${on ? 'desk-app-link-on' : ''}`}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.85} />
              <span>
                <span className="block text-sm font-bold">{item.label}</span>
                <span className="block text-[11px] opacity-70">{item.hint}</span>
              </span>
            </Link>
          );
        })}

        <div className="desk-app-kicker desk-app-kicker-desk">Desk</div>
        {DESK_ENTRIES.map((item) => {
          const Icon = ENTRY_ICONS[item.id];
          const on = onDesk && entry === item.id;
          return (
            <Link
              key={item.id}
              href={deskHref(item.id)}
              className={`desk-app-link ${on ? 'desk-app-link-on' : ''}`}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.85} />
              <span>
                <span className="block text-sm font-bold">{item.title}</span>
                <span className="block text-[11px] opacity-70">{item.subtitle}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      {onDesk && (
        <div className="desk-app-modes" role="group" aria-label="How seats write">
          {DESK_MODES.map((m) => {
            const on = deskMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setDeskMode(m.id)}
                className={`desk-app-mode ${on ? 'desk-app-mode-on' : ''}`}
                title={m.hint}
              >
                {m.title}
              </button>
            );
          })}
        </div>
      )}

      <div className="desk-app-seating">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">This desk</div>
        <div className="text-sm font-bold text-slate-900 mt-0.5">
          {unlocked} lit · {locked} empty
        </div>
        <Link
          href={flashActive ? flashCheckoutHref('analyst') : '/pricing'}
          className="mt-1 inline-block text-xs font-semibold text-[#0052d9] hover:underline"
        >
          {flashActive ? 'Flash 15% checkout →' : 'Seating and price →'}
        </Link>
      </div>
    </aside>
  );
}
