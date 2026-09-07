'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import ClerkPane from '@/components/workspace/ClerkPane';
import { GROUP_META, GROUP_ORDER, getMasterBySlug, MASTERS } from '@/lib/masters';
import DeskThread from '@/components/workspace/DeskThread';
import WatchlistPanel from '@/components/workspace/WatchlistPanel';
import QuantLabPanel from '@/components/quant/QuantLabPanel';
import LineupPane from '@/components/workspace/LineupPane';
import CryptoDeskPane from '@/components/workspace/CryptoDeskPane';
import {
  CANDIDATES,
  CYCLE_SNAPSHOT,
  HOW_TO_BUY,
  TREND_THEMES,
} from '@/lib/opportunities';
import {
  GROWTH_SCREENS,
  VALUE_SCREENS,
  WEEKLY_AGENDA,
} from '@/lib/pipeline';
import MasterAvatar from '@/components/masters/MasterAvatar';
import { isUnlocked, MARKETING_PLAN_IDS, parsePlan, PLANS, type PlanId } from '@/lib/tiers';
import { parseDeskMode } from '@/lib/desk-mode';
import { parseWorkspaceEntry, type WorkspaceEntry } from '@/lib/desk-nav';
import {
  DEMO_TICKER,
  persistDeskSession,
  readDeskSession,
  type DeskSession,
} from '@/lib/demo-session';
import { PRIVATE_COMPANIES } from '@/lib/private-universe';

export type { WorkspaceEntry };

export default function WorkspaceDesk({
  initialPlan = 'analyst',
  initialEmail = '',
  skipPaywall = false,
  trialUsed = false,
}: {
  initialPlan?: PlanId;
  initialEmail?: string;
  skipPaywall?: boolean;
  trialUsed?: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const fromUrl = params.get('entry');
  const entry = parseWorkspaceEntry(fromUrl);
  const deskMode = parseDeskMode(params.get('mode'));
  const urlPlan = parsePlan(params.get('plan') ?? initialPlan);
  const urlMarket = params.get('market');
  const [session, setSession] = useState<DeskSession | null>(() =>
    initialEmail
      ? { email: initialEmail, plan: urlPlan, ticker: DEMO_TICKER }
      : null
  );

  useEffect(() => {
    const stored = readDeskSession();
    if (stored) {
      setSession(stored);
      return;
    }
    if (initialEmail) {
      const seeded: DeskSession = { email: initialEmail, plan: urlPlan, ticker: DEMO_TICKER };
      persistDeskSession(seeded);
      setSession(seeded);
    }
  }, [initialEmail, urlPlan]);

  const plan: PlanId = params.get('plan') ? urlPlan : session?.plan ?? urlPlan;
  const planMeta = PLANS[plan];
  const unlocked = MASTERS.filter((m) => isUnlocked(plan, m.slug)).length;
  const locked = MASTERS.length - unlocked;
  const sampleTicker = (session?.ticker || DEMO_TICKER).toLowerCase();

  const valueNames = useMemo(
    () => CANDIDATES.filter((c) => c.track === 'value'),
    []
  );
  const growthNames = useMemo(
    () => CANDIDATES.filter((c) => c.track === 'growth'),
    []
  );

  function switchEntry(next: WorkspaceEntry, extra?: Record<string, string | null>) {
    const q = new URLSearchParams(params.toString());
    q.set('entry', next);
    if (next === 'lineup' && extra?.market == null && (entry === 'crypto' || q.get('market') === 'crypto')) {
      if (!q.get('market')) q.set('market', 'crypto');
    }
    if (extra) {
      for (const [key, value] of Object.entries(extra)) {
        if (!value) q.delete(key);
        else q.set(key, value);
      }
    }
    const qs = q.toString();
    router.replace(qs ? `/dashboard?${qs}` : '/dashboard', { scroll: false });
  }

  return (
    <div className="section-container py-8 md:py-12">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="badge badge-primary mb-2">Committee Desk</div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            {entry === 'clerk' ? 'Clerk coordinates. Seats still write alone.' : 'Ask first. Staffing is below.'}
          </h1>
          {session && (
            <p className="mt-1.5 text-sm text-slate-500">
              {session.email}
              {' · '}
              {planMeta.name} · {unlocked} unlocked · {locked} empty
            </p>
          )}
        </div>
        <Link
          href={`/stocks/${sampleTicker}?plan=${plan}`}
          className="text-sm font-semibold text-[#0052d9] hover:underline shrink-0"
        >
          Sample report ({sampleTicker.toUpperCase()}) →
        </Link>
      </div>

      {entry === 'clerk' && <ClerkPane skipPaywall={skipPaywall} trialUsed={trialUsed} />}
          {entry === 'analyze' && (
            <DeskThread
              key={params.get('q') ?? params.get('private') ?? 'analyze'}
              plan={plan}
              skipPaywall={skipPaywall}
              trialUsed={trialUsed}
              mode={deskMode}
            />
          )}
          {entry === 'discover' && (
            <DiscoverPane
              valueNames={valueNames}
              growthNames={growthNames}
              trialLocked={trialUsed && !skipPaywall}
              onActivateScan={() => switchEntry('analyze', { scan: 'opportunity' })}
            />
          )}
          {entry === 'crypto' && (
            <CryptoDeskPane onLineup={() => switchEntry('lineup', { market: 'crypto' })} />
          )}
          {entry === 'lineup' && (
            <LineupPane
              key={`${urlMarket ?? 'us'}-${deskMode}-${params.get('masters') ?? ''}`}
              plan={plan}
              skipPaywall={skipPaywall}
              trialUsed={trialUsed}
              initialMarket={urlMarket ?? undefined}
              initialMasters={params.get('masters') ?? ''}
              mode={deskMode}
            />
          )}
          {entry === 'watchlist' && <WatchlistPanel plan={plan} />}
          {entry === 'quant' && <QuantLabPanel plan={plan} />}
          {entry === 'private' && <PrivateDeskPane onConvene={() => switchEntry('analyze')} />}

          <div className="mt-14 pt-10 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Seating and price
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              {planMeta.name} · {unlocked} lit · {locked} stay empty
            </h2>
            <p className="text-sm text-slate-500 mb-5 max-w-2xl">
              You pay for how many seats run. Locked seats stay dark. Isolated or division-of-labor
              is a method toggle — not extra seats.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 max-w-5xl mb-8">
              {MARKETING_PLAN_IDS.map((id) => (
                <Link
                  key={id}
                  href="/pricing"
                  className={`rounded-xl border px-4 py-3 hover:border-[#0052d9]/30 hover:bg-blue-50/40 transition-colors ${
                    id === plan ? 'border-[#0052d9] bg-blue-50/50' : 'border-slate-100'
                  }`}
                >
                  <div className="text-sm font-bold text-slate-900">{PLANS[id].name}</div>
                  <div className="text-xs text-[#0052d9] font-semibold mt-0.5">
                    {PLANS[id].seats} seats · {PLANS[id].price}
                    {PLANS[id].period}
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">{PLANS[id].style}</p>
                </Link>
              ))}
            </div>

            <div className="card p-5">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                This desk — locked seats stay empty
              </div>
              <div className="space-y-4">
                {GROUP_ORDER.map((groupKey) => {
                  const meta = GROUP_META[groupKey];
                  const masters = MASTERS.filter((m) => m.group === groupKey);
                  return (
                    <div key={groupKey}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-6 rounded-full" style={{ backgroundColor: meta.color }} />
                        <span className="text-xs font-semibold text-slate-600">{meta.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {masters.map((m) => {
                          const on = isUnlocked(plan, m.slug);
                          return (
                            <span
                              key={m.slug}
                              title={on ? m.nameEn : `${m.nameEn} · locked`}
                              className={`inline-flex items-center gap-1 pr-2 pl-0.5 py-0.5 rounded-full text-[11px] font-medium border ${
                                on
                                  ? 'bg-white text-slate-700 border-slate-200'
                                  : 'bg-slate-50 text-slate-400 border-dashed border-slate-200'
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
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
    </div>
  );
}

function DiscoverPane({
  valueNames,
  growthNames,
  trialLocked,
  onActivateScan,
}: {
  valueNames: typeof CANDIDATES;
  growthNames: typeof CANDIDATES;
  trialLocked: boolean;
  onActivateScan: () => void;
}) {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-[#0052d9]/20 bg-[#0052d9]/5 p-6 md:p-8">
        <div className="text-xs font-bold tracking-widest text-[#0052d9] mb-2">NO TICKER YET</div>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
          Activate Trend → Cycle → Value / Growth
        </h2>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl">
          You have not bought anything. The committee does not need a symbol first. Unlocked seats in
          era-trend, cycle, quality selection, and growth selection write alone. Debate, timing, and
          exit stay dark until you pick a name. Not a recommendation.
        </p>
        <ol className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
          <li><span className="font-bold text-[#0052d9]">1.</span> Trend Research — where capital may flow</li>
          <li><span className="font-bold text-[#0052d9]">2.</span> Cycle Research — thermometer, not a trade</li>
          <li><span className="font-bold text-[#0052d9]">3A.</span> Value / Quality — business test</li>
          <li><span className="font-bold text-[#0052d9]">3B.</span> Growth / Opportunity — classify first</li>
        </ol>
        {trialLocked ? (
          <div className="mt-5">
            <p className="text-sm text-slate-600 mb-3">
              Trial used — choose a desk to run the scan.
            </p>
            <Link href="/pricing" className="btn-primary">
              Unlock Analyst · $19
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </div>
        ) : (
          <button type="button" onClick={onActivateScan} className="btn-primary mt-5">
            Run the opportunity scan
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-flat p-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Step 2 · Cycle
          </div>
          <div className="flex items-end gap-3 mb-1">
            <span className="text-5xl font-extrabold text-[#0052d9] leading-none">
              {CYCLE_SNAPSHOT.temperature}
            </span>
            <span className="badge badge-warning mb-1">{CYCLE_SNAPSHOT.phase}</span>
          </div>
          <p className="text-sm text-slate-500 mb-4">Dalio thermometer + four scenarios · research simulation</p>
          <p className="text-xs text-slate-600 mb-3">{CYCLE_SNAPSHOT.dalio}</p>
          <div className="grid grid-cols-2 gap-2">
            {CYCLE_SNAPSHOT.scenarios.map((s) => (
              <div key={s.id} className="rounded-lg bg-slate-50 px-3 py-2">
                <div className="text-xs text-slate-500">{s.label}</div>
                <div className="text-sm font-bold text-slate-900">{s.probability}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 card-flat p-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Step 1 · Era Trend List
          </div>
          <div className="space-y-3">
            {TREND_THEMES.map((theme) => {
              const master = getMasterBySlug(theme.sponsor);
              return (
                <div
                  key={theme.id}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 p-3"
                >
                  {master && <MasterAvatar master={master} size="sm" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{theme.title}</div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {theme.industries.map((ind) => (
                        <span key={ind} className="badge badge-neutral text-[10px]">
                          {ind}
                        </span>
                      ))}
                      <span className="text-xs text-slate-400">Strength {theme.strength}/10</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Step 3 · What to buy
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Candidate pool (10 value + 10 growth)
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-xs text-right hidden md:block">
            Open a name and each unlocked master researches it in isolation. Not a recommendation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CandidateColumn title="3A Value / Quality track" items={valueNames} screens={VALUE_SCREENS} />
          <CandidateColumn title="3B Growth / Opportunity track" items={growthNames} screens={GROWTH_SCREENS} />
        </div>
      </div>

      <div className="card-flat p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Weekly committee agenda</h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {WEEKLY_AGENDA.map((d) => (
            <div key={d.day} className="rounded-xl bg-slate-50 p-3">
              <div className="text-xs font-semibold text-[#0052d9]">{d.day}</div>
              <div className="text-sm font-bold text-slate-900 mt-1">{d.focus}</div>
              <div className="text-xs text-slate-500 mt-1">{d.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-flat p-6 border-l-4 border-l-[#0052d9]">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-5 w-5 text-[#0052d9]" strokeWidth={1.75} />
          <h3 className="text-base font-bold text-slate-900">{HOW_TO_BUY.headline}</h3>
        </div>
        <ul className="space-y-2">
          {HOW_TO_BUY.rules.map((rule) => (
            <li key={rule} className="text-sm text-slate-600 leading-relaxed pl-1">
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CandidateColumn({
  title,
  items,
  screens,
}: {
  title: string;
  items: typeof CANDIDATES;
  screens: Record<string, string>;
}) {
  return (
    <div className="card-flat p-5">
      <h3 className="text-sm font-bold text-slate-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((c) => {
          const master = getMasterBySlug(c.sponsor);
          return (
            <Link
              key={c.ticker}
              href={`/stocks/${c.ticker.toLowerCase()}`}
              className="block rounded-xl border border-slate-100 p-3 hover:border-[#0052d9]/30 hover:bg-blue-50/40 transition-colors duration-200 ease-out"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div>
                  <span className="text-sm font-bold text-slate-900">{c.ticker}</span>
                  <span className="ml-2 text-xs text-slate-500">{c.name}</span>
                </div>
                {master && <MasterAvatar master={master} size="xs" />}
              </div>
              <p className="text-[11px] text-slate-400 mb-1">{screens[c.sponsor]}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{c.reason}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#0052d9]">
                Convene committee
                <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function PrivateDeskPane({ onConvene }: { onConvene: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#0052d9]/20 bg-blue-50/40 p-6">
        <div className="text-xs font-bold tracking-widest text-[#0052d9] mb-2">PRIVATE DESK</div>
        <h2 className="text-xl font-extrabold text-slate-900">Pre-IPO · secondary marks only</h2>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl">
          No SEC EDGAR. The committee uses cached secondary valuations, revenue estimates, and listed
          comparables. Isolated briefs — not a secondary-market ticket.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={onConvene} className="btn-primary text-sm">
            Ask the committee
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <Link href="/research/private" className="btn-secondary text-sm">
            Full private board →
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRIVATE_COMPANIES.slice(0, 4).map((c) => (
          <Link key={c.slug} href={`/private/${c.slug}`} className="private-desk-card">
            <div className="text-sm font-bold text-slate-900">{c.name}</div>
            <div className="text-xs text-slate-500 mt-0.5">{c.lastValuationLabel}</div>
            <p className="text-xs text-slate-600 mt-2 line-clamp-2">{c.tagline}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

