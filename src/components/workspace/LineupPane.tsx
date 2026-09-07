'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Lock, Users } from 'lucide-react';
import MasterAvatar from '@/components/masters/MasterAvatar';
import { GROUP_META, GROUP_ORDER, MASTERS } from '@/lib/masters';
import {
  marketLabel,
  namesForMarket,
  parseScreenMarket,
  type LineupAssembly,
  type LineupSeatResult,
  type ScreenMarket,
} from '@/lib/lineup-screen';
import { isUnlocked, type PlanId } from '@/lib/tiers';
import { persistTrialUsed, TRIAL_FORBIDDEN } from '@/lib/desk-trial';
import PaywallModal from '@/components/workspace/PaywallModal';
import type { DeskMode } from '@/lib/desk-mode';

const STANCE: Record<string, string> = {
  constructive: 'bg-emerald-50 text-emerald-700',
  cautious: 'bg-amber-50 text-amber-800',
  skeptical: 'bg-red-50 text-red-700',
  inconclusive: 'bg-slate-100 text-slate-600',
};

const MARKETS: { id: ScreenMarket; title: string; hint: string }[] = [
  { id: 'us', title: 'US listed', hint: 'Dual-track pool' },
  { id: 'crypto', title: 'Crypto / on-chain', hint: 'Settlement, L1, DeFi' },
  { id: 'emerging', title: 'Emerging markets', hint: 'US-listed ADRs' },
];

export default function LineupPane({
  plan,
  skipPaywall,
  trialUsed,
  initialMarket = 'us',
  initialMasters = '',
  mode = 'isolated',
}: {
  plan: PlanId;
  skipPaywall: boolean;
  trialUsed: boolean;
  initialMarket?: string;
  initialMasters?: string;
  mode?: DeskMode;
}) {
  const unlocked = useMemo(() => MASTERS.filter((m) => isUnlocked(plan, m.slug)), [plan]);
  const requested = useMemo(
    () =>
      initialMasters
        .split(',')
        .map((s) => s.trim())
        .filter((slug) => MASTERS.some((m) => m.slug === slug)),
    [initialMasters]
  );
  const kitLocked = requested.filter((slug) => !unlocked.some((m) => m.slug === slug));
  const seeded = requested.filter((slug) => unlocked.some((m) => m.slug === slug));
  const defaultSlugs =
    requested.length > 0
      ? seeded
      : unlocked.slice(0, Math.min(8, unlocked.length)).map((m) => m.slug);
  const [market, setMarket] = useState<ScreenMarket>(parseScreenMarket(initialMarket));
  const [picked, setPicked] = useState<Set<string>>(() => new Set(defaultSlugs));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [briefs, setBriefs] = useState<LineupSeatResult[]>([]);
  const [assembly, setAssembly] = useState<LineupAssembly | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);

  const board = namesForMarket(market);

  function toggle(slug: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  async function run() {
    setError('');
    setBusy(true);
    setBriefs([]);
    setAssembly(null);
    try {
      const res = await fetch('/api/desk/screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugs: [...picked], market, mode }),
      });
      const data = (await res.json()) as {
        error?: string;
        code?: string;
        briefs?: LineupSeatResult[];
        assembly?: LineupAssembly;
      };
      if (res.status === 403 || data.code === 'trial_used') {
        persistTrialUsed();
        setPaywallOpen(true);
        setError(data.error || TRIAL_FORBIDDEN.error);
        return;
      }
      if (!res.ok || !data.briefs || !data.assembly) {
        setError(data.error ?? 'Screen failed.');
        return;
      }
      setBriefs(data.briefs);
      setAssembly(data.assembly);
    } catch {
      setError('Network error.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="badge badge-primary mb-2">Lineup</div>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
          Select masters, then screen a market
        </h2>
        {kitLocked.length > 0 && (
          <p className="mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            This kit also staffs{' '}
            {kitLocked
              .map((slug) => MASTERS.find((m) => m.slug === slug)?.nameEn)
              .filter(Boolean)
              .join(', ')}{' '}
            — locked on this seating. Upgrade to light those digital identities.
          </p>
        )}
        <p className="text-sm text-slate-600 mt-2 max-w-2xl">
          Lined-up seats{' '}
          {mode === 'handoff'
            ? 'run in pipeline order — later groups may read earlier constructive marks. Peers in the same group stay silent.'
            : 'write alone against the same board. The clerk only counts overlap after the facts exist.'}{' '}
          Homework, not an order. No buy button.
        </p>
      </div>

      <fieldset>
        <legend className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Market
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {MARKETS.map((m) => (
            <label
              key={m.id}
              className={`rounded-xl border px-4 py-3 cursor-pointer ${
                market === m.id
                  ? 'border-[#0052d9] bg-blue-50/60'
                  : 'border-slate-200 hover:border-[#0052d9]/30'
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                name="market"
                checked={market === m.id}
                onChange={() => setMarket(m.id)}
              />
              <div className="text-sm font-bold text-slate-900">{m.title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{m.hint}</div>
            </label>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {board.length} names on {marketLabel(market)}.
          {market === 'crypto' && (
            <>
              {' '}
              <Link href="/research/crypto" className="text-[#0052d9] font-semibold hover:underline">
                Open the crypto board
              </Link>
            </>
          )}
          {market === 'emerging' && (
            <>
              {' '}
              <Link href="/research/emerging" className="text-[#0052d9] font-semibold hover:underline">
                Open the EM board
              </Link>
            </>
          )}
        </p>
      </fieldset>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Lineup · {picked.size} seated
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="text-xs font-semibold text-[#0052d9] hover:underline"
              onClick={() => setPicked(new Set(unlocked.map((m) => m.slug)))}
            >
              All unlocked
            </button>
            <button
              type="button"
              className="text-xs font-semibold text-slate-500 hover:underline"
              onClick={() => setPicked(new Set())}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="space-y-4 max-h-[28rem] overflow-y-auto pr-1">
          {GROUP_ORDER.map((g) => {
            const rows = MASTERS.filter((m) => m.group === g);
            if (!rows.length) return null;
            return (
              <div key={g}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="h-1 w-5 rounded-full" style={{ backgroundColor: GROUP_META[g].color }} />
                  <span className="text-[11px] font-semibold text-slate-500">{GROUP_META[g].label}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {rows.map((m) => {
                    const on = isUnlocked(plan, m.slug);
                    const selected = picked.has(m.slug);
                    return (
                      <button
                        key={m.slug}
                        type="button"
                        disabled={!on}
                        onClick={() => on && toggle(m.slug)}
                        title={on ? m.role : `${m.nameEn} · locked`}
                        className={`inline-flex items-center gap-1 pr-2 pl-0.5 py-0.5 rounded-full text-[11px] font-medium border transition-colors ${
                          !on
                            ? 'bg-slate-50 text-slate-400 border-dashed border-slate-200 cursor-not-allowed'
                            : selected
                              ? 'bg-[#0052d9] text-white border-[#0052d9]'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-[#0052d9]/40'
                        }`}
                      >
                        {on ? (
                          <MasterAvatar master={m} size="xxs" />
                        ) : (
                          <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-slate-100">
                            <Lock className="h-3 w-3" strokeWidth={2} />
                          </span>
                        )}
                        {m.nameEn}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="button"
        disabled={busy || picked.size === 0}
        onClick={() => void run()}
        className="btn-primary"
      >
        <Users className="h-4 w-4" strokeWidth={2} />
        {busy ? 'Screening…' : mode === 'handoff' ? `Run division-of-labor screen · ${picked.size} seats` : `Run isolated screen · ${picked.size} seats`}
        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
      </button>

      {assembly && (
        <section className="rounded-2xl border border-[#0052d9]/20 bg-white p-5">
          <div className="text-xs font-bold tracking-widest text-[#0052d9] mb-2">CLERK STACK</div>
          <h3 className="text-base font-extrabold text-slate-900 mb-1">
            {assembly.marketLabel} · {assembly.seatCount} seats · {mode === 'handoff' ? 'handoff' : 'isolated'}
          </h3>
          <p className="text-xs text-slate-500 mb-4">{assembly.clerkNote}</p>
          {assembly.constructive.length > 0 && (
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2">Constructive seats</th>
                  </tr>
                </thead>
                <tbody>
                  {assembly.constructive.map((row) => (
                    <tr key={row.symbol} className="border-b border-slate-50">
                      <td className="py-2 pr-3 font-semibold text-slate-900">
                        {row.symbol}{' '}
                        <span className="text-xs font-normal text-slate-500">{row.name}</span>
                      </td>
                      <td className="py-2 tabular-nums">{row.votes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <ul className="text-sm text-slate-600 space-y-1">
            {assembly.splits.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      )}

      {briefs.map((b) => (
        <article key={b.slug} className="rounded-2xl border border-slate-100 p-5">
          <div className="flex items-start gap-3 mb-3">
            {(() => {
              const m = MASTERS.find((x) => x.slug === b.slug);
              return m ? <MasterAvatar master={m} size="sm" /> : null;
            })()}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-slate-900">{b.nameEn}</div>
              <div className="text-xs text-slate-400">{b.role}</div>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              {b.isolated === false ? 'Handoff' : 'Isolated'}
            </span>
          </div>
          <p className="text-sm text-slate-800 mb-1">{b.thesis}</p>
          <p className="text-xs text-slate-500 mb-3">Looks at: {b.looksAt}</p>
          <div className="space-y-2">
            {b.hits
              .filter((h) => h.stance !== 'inconclusive')
              .slice(0, 8)
              .map((h) => (
                <div key={h.symbol} className="rounded-xl bg-slate-50 px-3 py-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold text-slate-900">{h.symbol}</span>
                    <span className={`badge text-[10px] capitalize ${STANCE[h.stance]}`}>{h.stance}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{h.why}</p>
                </div>
              ))}
          </div>
        </article>
      ))}

      <PaywallModal
        open={paywallOpen}
        remainingCount={0}
        onClose={() => setPaywallOpen(false)}
      />
    </div>
  );
}
