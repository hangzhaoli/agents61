'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, Lock, Pencil, Send } from 'lucide-react';
import MasterAvatar from '@/components/masters/MasterAvatar';
import PaywallModal from '@/components/workspace/PaywallModal';
import { getMasterBySlug } from '@/lib/masters';
import { OPPORTUNITY_PROMPT, type DeskPlan } from '@/lib/desk-plan';
import type { Assembly, BriefStance, IndependentBrief } from '@/lib/research';
import { readSse } from '@/lib/sse';
import {
  persistTrialUsed,
  TEASER_BRIEF_COUNT,
  TRIAL_FORBIDDEN,
} from '@/lib/desk-trial';
import { PLANS, type PlanId } from '@/lib/tiers';
import type { DeskMode } from '@/lib/desk-mode';
import ReportDownloadButton from '@/components/report/ReportDownloadButton';
import DataWorkbook from '@/components/report/DataWorkbook';
import PackEvidenceBlock from '@/components/report/PackEvidenceBlock';
import SeatContrastPanel from '@/components/report/SeatContrastPanel';
import { PRIVATE_HOOKS } from '@/lib/private-hooks';
import { privateDeskPrompt } from '@/lib/private-universe';

const STANCE_STYLE: Record<BriefStance, string> = {
  constructive: 'bg-emerald-50 text-emerald-700',
  cautious: 'bg-amber-50 text-amber-800',
  skeptical: 'bg-red-50 text-red-700',
  inconclusive: 'bg-slate-100 text-slate-600',
};

const SUGGESTIONS: { label: string; prompt: string }[] = [
  { label: 'No ticker — scan opportunities', prompt: OPPORTUNITY_PROMPT },
  { label: 'Research AAPL (10-year hold)', prompt: 'Research AAPL as a ten-year hold' },
  { label: 'Invert MSFT', prompt: 'Invert MSFT before anyone cheers it' },
  { label: 'Bitcoin on-chain', prompt: 'Research BTC as a crypto settlement asset — not a cash-flow equity' },
  { label: 'Research SPCX (SpaceX)', prompt: 'Research SPCX (SpaceX) as a listed US equity — Starlink, launch, Starship. EDGAR when available.' },
  {
    label: 'OpenAI — toll road or race to zero?',
    prompt:
      PRIVATE_HOOKS.find((h) => h.slug === 'openai')?.prompt ??
      'Research OpenAI as a private company — compute moat vs open-weight commoditization. No EDGAR.',
  },
  {
    label: 'Anthropic — trust premium?',
    prompt:
      PRIVATE_HOOKS.find((h) => h.slug === 'anthropic')?.prompt ??
      'Research Anthropic as a private company — enterprise trust vs compute bill. No EDGAR.',
  },
  { label: 'Research Anduril (private)', prompt: 'Research Anduril as a private company — secondary valuation and defense contracts. No EDGAR.' },
  { label: 'Emerging-market board', prompt: 'What emerging-market opportunities fit a US-listed ADR window?' },
];

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden>
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </span>
  );
}

export default function DeskThread({
  plan,
  skipPaywall = false,
  trialUsed = false,
  mode = 'isolated',
}: {
  plan: PlanId;
  skipPaywall?: boolean;
  trialUsed?: boolean;
  mode?: DeskMode;
}) {
  const params = useSearchParams();
  const [draft, setDraft] = useState(() => (params.get('q') ?? '').trim().slice(0, 500));
  const [question, setQuestion] = useState('');
  const [agenda, setAgenda] = useState<DeskPlan | null>(null);
  const [briefs, setBriefs] = useState<IndependentBrief[]>([]);
  const [assembly, setAssembly] = useState<Assembly | null>(null);
  const [ticker, setTicker] = useState<string | null>(null);
  const [seatTotal, setSeatTotal] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'planning' | 'planned' | 'streaming' | 'done'>('idle');
  const [error, setError] = useState('');
  const [hardLock, setHardLock] = useState(() => trialUsed && !skipPaywall);
  const [teaserOn, setTeaserOn] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [revealed, setRevealed] = useState(skipPaywall);
  const [modelNote, setModelNote] = useState('');
  const [liveModel, setLiveModel] = useState<boolean | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const paywallShown = useRef(false);
  const meta = PLANS[plan];

  const autoScan = useRef(false);
  const busy = phase === 'planning' || phase === 'streaming';
  const blocked = hardLock && !revealed;
  const hideRemainder = teaserOn && !revealed && !skipPaywall;
  const openBriefs = hideRemainder ? briefs.slice(0, TEASER_BRIEF_COUNT) : briefs;
  const lockedBriefs = hideRemainder ? briefs.slice(TEASER_BRIEF_COUNT) : [];

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [briefs.length, assembly, agenda, phase, question]);

  useEffect(() => {
    if (phase !== 'idle' || draft) return;
    const fromClerk = params.get('q')?.trim();
    if (fromClerk) {
      setDraft(fromClerk.slice(0, 500));
      return;
    }
    const slug = params.get('private');
    if (!slug) return;
    const co = slug.toLowerCase();
    if (co === 'spacex') {
      setDraft(
        'Research SPCX (SpaceX) as a listed US equity — Starlink, launch, Starship. EDGAR when available.'
      );
      return;
    }
    const hook = PRIVATE_HOOKS.find((h) => h.slug === co);
    setDraft(hook?.prompt ?? privateDeskPrompt(co));
  }, [params, phase, draft]);

  function resetRun() {
    setAgenda(null);
    setBriefs([]);
    setAssembly(null);
    setTicker(null);
    setSeatTotal(0);
    setError('');
    setModelNote('');
    setLiveModel(null);
  }

  function lockTrial(message = TRIAL_FORBIDDEN.error) {
    persistTrialUsed();
    setHardLock(true);
    setError(message);
  }

  async function proposeFrom(message: string) {
    if (!message || blocked) return;
    resetRun();
    setPhase('planning');
    setQuestion(message);
    setDraft('');
    try {
      const res = await fetch('/api/desk/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, plan }),
      });
      const data = (await res.json()) as DeskPlan & { error?: string; code?: string };
      if (res.status === 403 || data.code === 'trial_used') {
        lockTrial(data.error || TRIAL_FORBIDDEN.error);
        setPhase('idle');
        return;
      }
      if (!res.ok || data.error) {
        setError(data.error || 'Could not draft a plan.');
        setPhase('idle');
        return;
      }
      setAgenda(data);
      setPhase('planned');
    } catch {
      setError('Network error — try again.');
      setPhase('idle');
    }
  }

  useEffect(() => {
    if (autoScan.current) return;
    if (blocked) return;
    if (params.get('scan') !== 'opportunity') return;
    autoScan.current = true;
    void proposeFrom(OPPORTUNITY_PROMPT);
  }, [params, plan, blocked]);

  async function propose(e: FormEvent, preset?: string) {
    e.preventDefault();
    const message = (preset ?? draft).trim();
    if (!message || busy || blocked) return;
    await proposeFrom(message);
  }

  const closePaywall = useCallback(() => {
    persistTrialUsed();
    setHardLock(true);
    setPaywallOpen(false);
  }, []);

  function editQuestion() {
    if (!question) return;
    setDraft(question);
    setPhase('idle');
    resetRun();
    setQuestion('');
  }

  useEffect(() => {
    if (skipPaywall || revealed || paywallShown.current) return;
    if (briefs.length < TEASER_BRIEF_COUNT) return;
    paywallShown.current = true;
    persistTrialUsed();
    setTeaserOn(true);
    setPaywallOpen(true);
  }, [briefs.length, skipPaywall, revealed]);

  async function confirm() {
    if (!agenda || busy || blocked) return;
    setPhase('streaming');
    setBriefs([]);
    setAssembly(null);
    try {
      const res = await fetch('/api/desk/convene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: agenda.question, plan, mode }),
      });
      if (!res.ok || !res.body) {
        const fail = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
        if (res.status === 403 || fail.code === 'trial_used') {
          lockTrial(fail.error || TRIAL_FORBIDDEN.error);
          setPhase('idle');
          return;
        }
        setError(fail.error || 'The desk could not convene.');
        setPhase('planned');
        return;
      }
      await readSse(res, (event, data) => {
        if (event === 'start') {
          const start = data as {
            ticker: string | null;
            seatCount: number;
            modelNote?: string;
            liveModel?: boolean;
          };
          setTicker(start.ticker);
          setSeatTotal(start.seatCount);
          if (start.modelNote) setModelNote(start.modelNote);
          if (typeof start.liveModel === 'boolean') setLiveModel(start.liveModel);
        }
        if (event === 'brief') {
          setBriefs((prev) => [...prev, data as IndependentBrief]);
        }
        if (event === 'clerk') {
          setAssembly(data as Assembly);
        }
        if (event === 'error') {
          const err = data as { error?: string };
          setError(err.error || 'Convening failed.');
        }
      });
      setPhase('done');
    } catch {
      setError('Network error — try again.');
      setPhase('planned');
    }
  }

  return (
    <>
    <div className="chrome-frame chrome-frame-fixed">
      <div className="chrome-frame-inner desk-console">
      <div className="desk-console-head">
        <div className="text-[11px] font-bold tracking-[0.14em] text-slate-500 uppercase">
          Live desk · {meta.name} · {meta.seats} seats · {mode === 'handoff' ? 'division of labor' : 'isolated'}
        </div>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
          {mode === 'handoff'
            ? 'You send one question. Later seats may read earlier notes.'
            : 'You send one question. Frontier models run the legend twins.'}
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          {mode === 'handoff'
            ? 'Trend → cycle → selection → debate. Peers in the same group still cannot see each other. The clerk stacks — never averages. Not a recommendation.'
            : 'You confirm the agenda. Each digital twin writes alone. The clerk stacks — never averages. Not a recommendation.'}
        </p>
      </div>
      <div className="desk-console-body">

        {liveModel === false && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong className="font-semibold">Methodology cards only.</strong> DeepSeek is not active on this
            server — briefs are template-generated until <code className="text-xs">DEEPSEEK_API_KEY</code> is set
            in Vercel Production with a real key value, then redeploy.
          </div>
        )}

        {blocked && (
          <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-700">
              Trial used — choose a desk to continue. Remaining briefs stay locked.
            </p>
            <button type="button" onClick={() => setPaywallOpen(true)} className="btn-primary text-sm">
              Unlock Analyst · $19
            </button>
          </div>
        )}

        <form onSubmit={(e) => propose(e)} className="mb-3">
          <div className="desk-console-input-group">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={
                blocked
                  ? 'Trial used — unlock a desk to ask again'
                  : 'Ask the committee — ticker, or no ticker to scan opportunities'
              }
              className="desk-console-input disabled:bg-slate-50 disabled:text-slate-400"
              aria-label="Ask the committee"
              disabled={busy || blocked}
            />
            <button
              type="submit"
              disabled={busy || blocked || !draft.trim()}
              className="btn-primary desk-console-btn !py-0 !px-5 text-sm disabled:opacity-50"
            >
              Plan
              <Send className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </form>

        {error && !blocked && <p className="mb-3 text-sm text-red-600">{error}</p>}
        {error && blocked && <p className="mb-3 text-sm text-slate-500">{error}</p>}

        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-xs text-slate-400">Try</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              disabled={busy || blocked}
              onClick={(e) => propose(e, s.prompt)}
              className="desk-console-chip px-2.5 py-1 text-xs font-semibold text-[#0052d9] border border-[#0052d9]/30 bg-white hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              {s.label}
            </button>
          ))}
        </div>

        <div
          ref={threadRef}
          className="desk-console-thread p-4 md:p-5 space-y-3"
        >
          {phase === 'idle' && !question && (
            <p className="text-sm text-slate-500 py-8 text-center">
              No ticker yet? Ask what is on the opportunity board, the crypto board, or emerging
              markets — or type a US ticker when you already have a name. Isolated briefs never
              say you should buy. There is no buy button.
            </p>
          )}

          {question && (
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[#0052d9] text-white px-4 py-2.5 text-sm leading-relaxed">
                {question}
              </div>
            </div>
          )}

          {phase === 'planning' && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <TypingDots />
              Drafting the agenda…
            </div>
          )}

          {agenda && (phase === 'planned' || phase === 'streaming' || phase === 'done') && (
            <PlanCard
              agenda={agenda}
              confirmable={phase === 'planned' && !blocked}
              onConfirm={confirm}
              onEdit={editQuestion}
            />
          )}

          {phase === 'streaming' && (
            <div className="text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <TypingDots />
                {openBriefs.length} / {seatTotal || agenda?.seats.length || 0} isolated briefs — seats cannot peek
              </div>
              {modelNote && <p className="text-[11px] text-slate-400 mt-1">{modelNote}</p>}
            </div>
          )}

          {openBriefs.map((b) => (
            <AgentBubble key={b.slug} brief={b} />
          ))}

          {hideRemainder && (lockedBriefs.length > 0 || assembly || phase === 'streaming' || phase === 'done') && (
            <div className="relative overflow-hidden rounded-2xl border border-dashed border-slate-200">
              <div className="pointer-events-none select-none blur-[6px] opacity-60 p-3 space-y-3 max-h-56 overflow-hidden">
                {lockedBriefs.slice(0, 4).map((b) => (
                  <AgentBubble key={`locked-${b.slug}`} brief={b} />
                ))}
                {lockedBriefs.length === 0 && (
                  <div className="h-28 rounded-xl bg-white border border-slate-100" />
                )}
                <div className="rounded-xl bg-white border border-slate-100 p-4 h-24" />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/55 px-4 text-center">
                <Lock className="h-5 w-5 text-[#0052d9] mb-2" strokeWidth={2} />
                <p className="text-sm font-bold text-slate-900">Remaining briefs, clerk stack, and download</p>
                <p className="text-xs text-slate-500 mt-1">Unlock Analyst to read the rest of this run.</p>
                <button type="button" onClick={() => setPaywallOpen(true)} className="btn-primary text-sm mt-3">
                  Unlock the rest
                </button>
              </div>
            </div>
          )}

          {assembly && !hideRemainder && (
            <div className="rounded-2xl border border-[#0052d9]/20 bg-white p-4 md:p-5 animate-fade-in">
              <div className="text-xs font-bold tracking-widest text-[#0052d9] mb-2">CLERK ASSEMBLY</div>
              {modelNote && <p className="text-[11px] text-slate-400 mb-2">{modelNote}</p>}
              <h3 className="text-base font-extrabold text-slate-900 mb-3">
                Stacked. Not averaged. Not a buy rating.
              </h3>
              {assembly.executiveSummary && (
                <div className="rounded-xl border border-[#0052d9]/15 bg-blue-50/40 p-4 mb-4">
                  <p className="text-xs font-bold tracking-widest text-[#0052d9] mb-2">EXECUTIVE SUMMARY</p>
                  <p className="text-sm text-slate-800 leading-relaxed">{assembly.executiveSummary}</p>
                  {assembly.underwriteFrame && (
                    <p className="mt-3 text-sm font-bold text-slate-900">
                      Underwrite frame:{' '}
                      <span className="text-[#0052d9]">
                        {assembly.underwriteFrame === 'worth_further_homework'
                          ? 'Worth further homework'
                          : assembly.underwriteFrame === 'pass_for_now'
                            ? 'Pass for now'
                            : assembly.underwriteFrame === 'insufficient_facts'
                              ? 'Insufficient facts'
                              : 'Split — your judgment required'}
                      </span>
                    </p>
                  )}
                  {assembly.decisionHelp && (
                    <p className="text-sm text-slate-700 mt-2 leading-relaxed">{assembly.decisionHelp}</p>
                  )}
                  {assembly.clerkEngine && assembly.clerkEngine !== 'template' && (
                    <p className="text-[10px] text-slate-400 mt-2">
                      Clerk: {assembly.clerkEngine} · research simulation, not advice, not a buy button
                    </p>
                  )}
                </div>
              )}
              {assembly.dataHighlights && assembly.dataHighlights.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Data the desk cited</p>
                  <ul className="text-sm text-slate-700 space-y-1 list-disc pl-4">
                    {assembly.dataHighlights.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                {(Object.keys(assembly.counts) as BriefStance[]).map((k) => (
                  <span key={k} className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-1.5 text-xs">
                    <span className="capitalize text-slate-500">{k}</span>{' '}
                    <span className="font-bold text-slate-900">{assembly.counts[k]}</span>
                  </span>
                ))}
              </div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Where they agree</p>
              <ul className="text-sm text-slate-700 space-y-1 mb-3">
                {assembly.agreements.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              {briefs.length >= 2 && (
                <div className="mb-4">
                  <SeatContrastPanel briefs={briefs} />
                </div>
              )}
              <p className="text-xs font-semibold text-slate-500 mb-1">The split that stays</p>
              <ul className="text-sm text-slate-700 space-y-1 mb-3">
                {assembly.splits.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="text-xs text-slate-500 mb-4">{assembly.clerkNote}</p>
              {assembly.openQuestions && assembly.openQuestions.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Open questions for your workbook</p>
                  <ul className="text-sm text-slate-700 space-y-1 list-disc pl-4">
                    {assembly.openQuestions.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
              {!hideRemainder && assembly.valuation && <DataWorkbook assembly={assembly} />}
              <div className="flex flex-wrap gap-2">
                <ReportDownloadButton
                  plan={plan}
                  question={question}
                  ticker={ticker}
                  briefs={briefs}
                  assembly={assembly}
                />
                {ticker && assembly.domain === 'crypto' && (
                  <Link
                    href={`/crypto/${ticker.toLowerCase()}?plan=${plan}`}
                    className="btn-secondary text-sm"
                  >
                    Open crypto report
                  </Link>
                )}
                {ticker &&
                  assembly.domain !== 'crypto' &&
                  !['BOARD', 'CRYPTO', 'EM'].includes(ticker.toUpperCase()) && (
                  <Link
                    href={`/stocks/${ticker.toLowerCase()}?plan=${plan}`}
                    className="btn-secondary text-sm"
                  >
                    Open full pipeline report
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
      <PaywallModal
        open={paywallOpen}
        remainingCount={Math.max(0, (seatTotal || briefs.length) - TEASER_BRIEF_COUNT)}
        onClose={closePaywall}
      />
    </>
  );
}

function PlanCard({
  agenda,
  confirmable,
  onConfirm,
  onEdit,
}: {
  agenda: DeskPlan;
  confirmable: boolean;
  onConfirm: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#0052d9]/20 bg-white p-4 md:p-5">
      <div className="text-xs font-bold tracking-widest text-[#0052d9] mb-2">AGENDA — CONFIRM BEFORE WRITE</div>
      <h3 className="text-base font-extrabold text-slate-900">
        {agenda.ticker ? `${agenda.ticker} · ${agenda.intentLabel}` : agenda.intentLabel}
      </h3>
      <p className="text-sm text-slate-500 mt-1">
        {agenda.planName}: {agenda.seats.length} write in steps 1–3
        {agenda.deferredCount > 0 ? ` · ${agenda.deferredCount} unlocked seats wait for a ticker` : ''}
        {agenda.lockedCount > 0 ? ` · ${agenda.lockedCount} locked empty` : ''}
      </p>
      <ol className="mt-3 space-y-1.5 text-sm text-slate-700">
        {agenda.steps.map((step, i) => (
          <li key={step} className="flex gap-2">
            <span className="text-xs font-bold text-[#0052d9] mt-0.5">{i + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {agenda.seats.slice(0, 12).map((s) => {
          const m = getMasterBySlug(s.slug);
          return (
            <span
              key={s.slug}
              className="inline-flex items-center gap-1 pr-2 pl-0.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-50 border border-slate-100"
            >
              {m && <MasterAvatar master={m} size="xxs" />}
              {s.nameEn}
            </span>
          );
        })}
        {agenda.seats.length > 12 && (
          <span className="text-[11px] text-slate-400 self-center">+{agenda.seats.length - 12} more</span>
        )}
      </div>
      {confirmable && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={onConfirm} className="btn-primary text-sm">
            <Check className="h-4 w-4" strokeWidth={2.5} />
            Start the meeting
          </button>
          <button type="button" onClick={onEdit} className="btn-secondary text-sm">
            <Pencil className="h-4 w-4" strokeWidth={2} />
            Edit question
          </button>
        </div>
      )}
    </div>
  );
}

function AgentBubble({ brief }: { brief: IndependentBrief }) {
  const master = getMasterBySlug(brief.slug);
  if (!master) return null;
  return (
    <div className="flex items-start gap-2.5 animate-fade-in">
      <MasterAvatar master={master} size="xs" />
      <div className="flex-1 min-w-0 rounded-2xl rounded-bl-md bg-white border border-slate-100 p-3.5">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="text-sm font-bold text-slate-900 truncate">{brief.nameEn}</div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
            {brief.isolated === false ? 'Handoff' : 'Isolated'}
          </span>
          {brief.engine === 'template' && (
            <span className="text-[10px] text-amber-700 uppercase tracking-wider">Template</span>
          )}
          {brief.engine && brief.engine !== 'template' && (
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
              {brief.engine === 'deepseek-v4-pro' ? 'V4-Pro' : 'V4-Flash'}
            </span>
          )}
          <span className={`ml-auto badge ${STANCE_STYLE[brief.stance]} capitalize`}>{brief.stance}</span>
        </div>
        <p className="text-[11px] font-semibold text-slate-400 mb-1">{brief.looksAt}</p>
        {brief.thesis && (
          <p className="text-sm font-semibold text-slate-800 leading-relaxed mb-1">{brief.thesis}</p>
        )}
        {brief.why && <p className="text-xs text-slate-500 mb-2">{brief.why}</p>}
        <p className="text-sm text-slate-700 leading-relaxed">{brief.finding}</p>
        {brief.risks && <p className="text-[11px] text-slate-500 mt-2">Risks: {brief.risks}</p>}
        {brief.referenceNote && (
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            <span className="font-semibold text-slate-600">Referenced upstream: </span>
            {brief.referenceNote}
          </p>
        )}
        <p className="text-[11px] text-slate-400 mt-2">{brief.sourceLine}</p>
        {brief.packEvidence && <PackEvidenceBlock evidence={brief.packEvidence} />}
        <p className="text-[11px] text-slate-500 mt-1">
          <span className="font-semibold text-slate-600">Would change mind: </span>
          {brief.wouldChangeMind}
        </p>
      </div>
    </div>
  );
}
