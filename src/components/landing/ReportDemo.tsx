'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { RotateCcw, Send } from 'lucide-react';
import { getMasterBySlug } from '@/lib/masters';
import MasterAvatar from '@/components/masters/MasterAvatar';
import { MasterChipRow } from '@/components/masters/MasterChip';
import AuthGateLink from '@/components/auth/AuthGateLink';
import { readDeskSession } from '@/lib/demo-session';
import {
  DEMO_ASSEMBLY,
  DEMO_BRIEFS,
  DEMO_NAME,
  DEMO_PLAN,
  DEMO_SUGGESTIONS,
  DEMO_TICKER,
  DEMO_USER_PROMPT,
  looksLikeTicker,
  type DemoStance,
} from '@/lib/demo-report';

const STANCE_STYLE = {
  constructive: 'bg-emerald-50 text-emerald-700',
  cautious: 'bg-amber-50 text-amber-800',
  skeptical: 'bg-red-50 text-red-700',
} as const;

const AGENT_GAP_MS = 1050;

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden>
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </span>
  );
}

export default function ReportDemo() {
  const router = useRouter();
  const [draft, setDraft] = useState('');
  const [userLine, setUserLine] = useState('');
  const [briefsVisible, setBriefsVisible] = useState(0);
  const [clerkOn, setClerkOn] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [typingSlug, setTypingSlug] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  const playRef = useRef<(prompt?: string) => void>(() => {});
  const threadRef = useRef<HTMLDivElement>(null);

  function clearTimers() {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }

  function later(ms: number, fn: () => void) {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }

  function play(prompt = DEMO_USER_PROMPT) {
    clearTimers();
    setPlaying(true);
    setClerkOn(false);
    setBriefsVisible(0);
    setTypingSlug(null);
    setDraft(prompt);
    setUserLine('');

    later(450, () => {
      setUserLine(prompt);
      setDraft('');
    });

    let t = 450;
    DEMO_BRIEFS.forEach((b, i) => {
      t += i === 0 ? 380 : AGENT_GAP_MS;
      later(t, () => setTypingSlug(b.slug));
      t += 720;
      later(t, () => {
        setTypingSlug(null);
        setBriefsVisible(i + 1);
      });
    });

    t += AGENT_GAP_MS;
    later(t, () => setTypingSlug('clerk'));
    t += 700;
    later(t, () => {
      setTypingSlug(null);
      setClerkOn(true);
      setPlaying(false);
    });
  }

  playRef.current = play;

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [userLine, briefsVisible, clerkOn, typingSlug]);

  useEffect(() => {
    const el = document.getElementById('demo');
    if (!el) return;
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (started) return;
        if (entries.some((e) => e.isIntersecting)) {
          started = true;
          playRef.current();
        }
      },
      { threshold: 0.28 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  function reset() {
    clearTimers();
    setPlaying(false);
    setClerkOn(false);
    setBriefsVisible(0);
    setTypingSlug(null);
    setUserLine('');
    setDraft('');
  }

  function send(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    if (looksLikeTicker(text)) {
      const dest = `/stocks/${encodeURIComponent(text.toLowerCase())}`;
      if (readDeskSession()) {
        router.push(dest);
        return;
      }
      router.push(`/register?next=${encodeURIComponent(dest)}`);
      return;
    }
    play(text);
  }

  const typingMaster = typingSlug && typingSlug !== 'clerk' ? getMasterBySlug(typingSlug) : undefined;

  return (
    <div id="demo" className="chrome-frame max-w-5xl mx-auto scroll-mt-24">
      <div className="chrome-frame-inner p-5 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 text-[11px] font-medium tracking-wide text-slate-400 uppercase">
              Observer thread · {DEMO_TICKER} · {DEMO_PLAN}
            </span>
          </div>
          {playing && (
            <span className="text-[11px] font-semibold text-[#0052d9] demo-live">Seats writing…</span>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Desk chat
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
              You send one question. Frontier models run the legend twins.
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {DEMO_NAME} sample — not a live quote, not a recommendation. Clerk stacks the split.
            </p>
          </div>
          {(userLine || playing) && (
            <button type="button" onClick={reset} className="btn-secondary text-sm">
              <RotateCcw className="h-4 w-4" strokeWidth={2.5} />
              Clear thread
            </button>
          )}
        </div>

        <div
          ref={threadRef}
          className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:p-5 mb-4 max-h-[28rem] overflow-y-auto space-y-4"
        >
          {!userLine && !playing && (
            <p className="text-sm text-slate-400 text-center py-8">
              Type below, or pick a prompt. Observer seats write in isolation — they cannot see each other.
            </p>
          )}

          {userLine && (
            <div className="flex justify-end animate-fade-in">
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[#0052d9] text-white px-4 py-2.5 text-sm leading-relaxed">
                {userLine}
              </div>
            </div>
          )}

          {DEMO_BRIEFS.slice(0, briefsVisible).map((b) => {
            const master = getMasterBySlug(b.slug);
            if (!master) return null;
            return (
              <AgentBubble key={b.slug} slug={b.slug} stance={b.stance} looksAt={b.looksAt} finding={b.finding} falsifier={b.falsifier} />
            );
          })}

          {typingMaster && (
            <div className="flex items-start gap-2.5 animate-fade-in">
              <MasterAvatar master={typingMaster} size="xs" />
              <div className="rounded-2xl rounded-bl-md bg-white border border-slate-100 px-4 py-3">
                <div className="text-xs font-semibold text-slate-700 mb-1">{typingMaster.nameEn}</div>
                <p className="text-xs text-slate-400">
                  Writing alone · cannot see the other drafts <TypingDots />
                </p>
              </div>
            </div>
          )}

          {typingSlug === 'clerk' && (
            <div className="flex items-start gap-2.5 animate-fade-in">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0052d9] text-[10px] font-bold text-white">
                61
              </span>
              <div className="rounded-2xl rounded-bl-md bg-white border border-slate-100 px-4 py-3">
                <div className="text-xs font-semibold text-slate-700 mb-1">Clerk</div>
                <p className="text-xs text-slate-400">
                  Assembling — not averaging <TypingDots />
                </p>
              </div>
            </div>
          )}

          {clerkOn && (
            <div className="flex items-start gap-2.5 animate-fade-in">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0052d9] text-[10px] font-bold text-white">
                61
              </span>
              <div className="flex-1 rounded-2xl rounded-bl-md border border-[#0052d9]/20 bg-white p-4">
                <div className="text-[11px] font-bold tracking-widest text-[#0052d9] mb-1">CLERK</div>
                <p className="text-sm font-extrabold text-slate-900 mb-3">
                  Stacked. Not averaged. Not a buy rating.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {Object.entries(DEMO_ASSEMBLY.counts).map(([k, v]) => (
                    <span key={k} className="rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-1 text-xs">
                      <span className="capitalize text-slate-500">{k}</span>{' '}
                      <span className="font-bold text-slate-900">{v}</span>
                    </span>
                  ))}
                </div>
                <p className="text-xs font-semibold text-slate-500 mb-2">Where they agree</p>
                <ul className="space-y-3 mb-4">
                  {DEMO_ASSEMBLY.agreements.map((row) => (
                    <li key={row.text} className="flex flex-col gap-1.5">
                      <MasterChipRow slugs={row.slugs} />
                      <p className="text-sm text-slate-700 leading-relaxed">{row.text}</p>
                    </li>
                  ))}
                </ul>
                <p className="text-xs font-semibold text-slate-500 mb-2">The split that stays</p>
                <ul className="space-y-3 mb-3">
                  {DEMO_ASSEMBLY.splits.map((row) => (
                    <li key={row.text} className="flex flex-col gap-1.5">
                      <MasterChipRow slugs={row.slugs} />
                      <p className="text-sm text-slate-700 leading-relaxed">{row.text}</p>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-slate-500">{DEMO_ASSEMBLY.clerkNote}</p>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={send} className="relative">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask the desk — or type a ticker to convene for real"
            className="w-full h-14 pl-4 pr-32 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0052d9]/30 focus:border-[#0052d9]"
            aria-label="Ask the Observer desk"
            disabled={playing}
          />
          <button
            type="submit"
            disabled={playing || !draft.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !py-2.5 !px-4 text-sm"
          >
            Send
            <Send className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-xs text-slate-400">Try</span>
          {DEMO_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              disabled={playing}
              onClick={() => play(s)}
              className="px-2.5 py-1 rounded-md text-xs font-semibold text-[#0052d9] bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>

        <p className="mt-3 text-xs text-slate-400">
          Canned Observer replies on this page. A ticker in the box asks you to register, then runs a real desk.{' '}
          <AuthGateLink href="/dashboard?entry=analyze" className="font-semibold text-[#0052d9] hover:underline">
            Open the desk →
          </AuthGateLink>
        </p>
      </div>
    </div>
  );
}

function AgentBubble({
  slug,
  stance,
  looksAt,
  finding,
  falsifier,
}: {
  slug: string;
  stance: DemoStance;
  looksAt: string;
  finding: string;
  falsifier: string;
}) {
  const master = getMasterBySlug(slug);
  if (!master) return null;
  return (
    <div className="flex items-start gap-2.5 animate-fade-in">
      <MasterAvatar master={master} size="xs" />
      <div className="flex-1 min-w-0 rounded-2xl rounded-bl-md bg-white border border-slate-100 p-3.5">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="text-sm font-bold text-slate-900 truncate">{master.nameEn}</div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Isolated</span>
          <span className={`ml-auto badge ${STANCE_STYLE[stance]} capitalize`}>{stance}</span>
        </div>
        <p className="text-[11px] font-semibold text-slate-400 mb-1">{looksAt}</p>
        <p className="text-sm text-slate-700 leading-relaxed">{finding}</p>
        <p className="text-[11px] text-slate-500 mt-2">
          <span className="font-semibold text-slate-600">Would change mind: </span>
          {falsifier}
        </p>
      </div>
    </div>
  );
}
