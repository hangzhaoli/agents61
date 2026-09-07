'use client';

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Send, Wrench } from 'lucide-react';
import MasterAvatar from '@/components/masters/MasterAvatar';
import { getMasterBySlug } from '@/lib/masters';
import type { ClerkRoute, ClerkTool, StaffedIdentity } from '@/lib/clerk-router';
import {
  extraById,
  parseTokenExtra,
  recordExtraUsage,
  EXTRA_CREDITS_FORBIDDEN,
  TOKEN_PACKS,
  type TokenExtraId,
} from '@/lib/token-extras';
import PaywallModal from '@/components/workspace/PaywallModal';
import { persistTrialUsed, TRIAL_FORBIDDEN } from '@/lib/desk-trial';

type ChatRow = {
  role: 'user' | 'clerk';
  text: string;
  tools?: ClerkTool[];
  staffed?: StaffedIdentity[];
};

const CLERK_TIPS = [
  { label: 'Screen like Lynch', prompt: 'Screen like Lynch' },
  { label: 'Invert MSFT', prompt: 'Invert MSFT' },
  { label: 'Paste a 10-K', prompt: 'Paste a 10-K' },
  { label: 'Staff Burry + Buffett', prompt: 'Staff Burry and Buffett on NVDA' },
] as const;

export default function ClerkPane({
  skipPaywall = false,
  trialUsed = false,
}: {
  skipPaywall?: boolean;
  trialUsed?: boolean;
}) {
  const params = useSearchParams();
  const extraHint = parseTokenExtra(params.get('extra'));
  const [draft, setDraft] = useState('');
  const [rows, setRows] = useState<ChatRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [paywall, setPaywall] = useState(false);
  const [extraId, setExtraId] = useState<TokenExtraId | null>(extraHint);
  const [extraText, setExtraText] = useState('');
  const [extraOut, setExtraOut] = useState('');
  const [extraBusy, setExtraBusy] = useState(false);
  const [needPack, setNeedPack] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setExtraId(extraHint);
  }, [extraHint]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: 'end' });
  }, [rows, extraOut]);

  async function sendMessage(raw: string) {
    const message = raw.trim();
    if (!message || busy) return;
    setDraft('');
    setRows((prev) => [...prev, { role: 'user', text: message }]);
    setBusy(true);
    try {
      const res = await fetch('/api/desk/clerk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, extra: extraId }),
      });
      const data = (await res.json()) as ClerkRoute & { error?: string };
      setRows((prev) => [
        ...prev,
        {
          role: 'clerk',
          text: data.reply ?? data.error ?? 'Clerk did not answer.',
          tools: data.tools,
          staffed: data.staffed,
        },
      ]);
    } catch {
      setRows((prev) => [...prev, { role: 'clerk', text: 'Network error.' }]);
    } finally {
      setBusy(false);
    }
  }

  function send(e: FormEvent) {
    e.preventDefault();
    void sendMessage(draft);
  }

  function onComposeKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(draft);
    }
  }

  async function runExtra(e: FormEvent) {
    e.preventDefault();
    if (!extraId || extraBusy) return;
    setExtraBusy(true);
    setExtraOut('');
    setNeedPack(false);
    try {
      const res = await fetch('/api/desk/extra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extra: extraId, text: extraText }),
      });
      const data = (await res.json()) as { content?: string; error?: string; code?: string };
      if (res.status === 402 && data.code === EXTRA_CREDITS_FORBIDDEN.code) {
        setNeedPack(true);
        setExtraOut(data.error ?? EXTRA_CREDITS_FORBIDDEN.error);
        return;
      }
      if (res.status === 403 && data.code === TRIAL_FORBIDDEN.code) {
        persistTrialUsed();
        setPaywall(true);
        return;
      }
      if (!res.ok) {
        setExtraOut(data.error ?? 'Could not run extra.');
        return;
      }
      recordExtraUsage(extraId);
      setExtraOut(data.content ?? '');
    } catch {
      setExtraOut('Network error.');
    } finally {
      setExtraBusy(false);
    }
  }

  const extraMeta = extraId ? extraById(extraId) : null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
        <div className="badge badge-primary mb-2">Clerk · coordinator</div>
        <h2 className="text-xl font-extrabold text-slate-900">Talk to the desk, not past it</h2>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl">
          This chat staffs digital identities and calls tools — convene, screen, filing extract.
          Masters still write alone. The clerk does not impersonate Buffett and does not issue a
          ticket. Token extras (DeepSeek V4 Flash) are billed per run on top of seating.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="desk-console-thread-empty space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Try</p>
          <div className="flex flex-wrap gap-2">
            {CLERK_TIPS.map((tip) => (
              <button
                key={tip.label}
                type="button"
                disabled={busy}
                onClick={() => setDraft(tip.prompt)}
                className="desk-console-chip px-2.5 py-1 text-xs font-semibold text-[#0052d9] border border-[#0052d9]/30 bg-white hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                {tip.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="desk-console-thread p-4 space-y-3">
          {rows.map((row, i) => (
            <article key={`${row.role}-${i}`} className={row.role === 'user' ? 'text-right' : ''}>
              <p
                className={`inline-block max-w-[40rem] text-left text-sm leading-relaxed rounded-2xl px-3.5 py-2.5 ${
                  row.role === 'user' ? 'bg-[#0052d9] text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                {row.text}
              </p>
              {row.staffed && row.staffed.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {row.staffed.map((s) => {
                    const master = getMasterBySlug(s.slug);
                    if (!master) return null;
                    return (
                      <li key={s.slug} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5">
                        <MasterAvatar master={master} size="xxs" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{s.nameEn}</div>
                          <div className="text-[10px] text-slate-400">
                            Unaffiliated identity · {s.role}
                          </div>
                          <div className="text-[10px] text-slate-400 max-w-[14rem] truncate">{s.methodology}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              {row.tools && row.tools.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {row.tools.map((tool) => (
                    <Link
                      key={`${tool.id}-${tool.href}`}
                      href={tool.href}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-[#0052d9]/40 hover:text-[#0052d9]"
                      onClick={() => {
                        if (tool.extra) setExtraId(tool.extra);
                      }}
                    >
                      <Wrench className="h-3 w-3" strokeWidth={2} />
                      {tool.label}
                      <ArrowRight className="h-3 w-3" strokeWidth={2} />
                    </Link>
                  ))}
                </div>
              )}
            </article>
          ))}
          <div ref={bottom} />
        </div>
      )}

      <form onSubmit={send} className="desk-console-compose">
        <label htmlFor="clerk-compose" className="sr-only">
          Message the clerk
        </label>
        <textarea
          id="clerk-compose"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onComposeKeyDown}
          className="desk-console-compose-field"
          placeholder="Staff seats, name a ticker, or ask for a kit…"
          disabled={busy}
          rows={4}
          aria-label="Message the clerk"
        />
        <div className="desk-console-compose-actions">
          <p className="desk-console-compose-hint">Enter to send · Shift+Enter for a new line</p>
          <button
            type="submit"
            disabled={busy || !draft.trim()}
            className="btn-primary desk-console-compose-btn"
          >
            <Send className="h-4 w-4" strokeWidth={2} />
            {busy ? 'Routing…' : 'Send'}
          </button>
        </div>
      </form>

      {extraMeta && (
        <form onSubmit={runExtra} className="card-flat p-5 space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="text-sm font-bold text-slate-900">{extraMeta.name}</div>
              <p className="text-xs text-slate-500 mt-1">{extraMeta.job}</p>
            </div>
            <div className="text-sm font-extrabold text-[#0052d9]">${extraMeta.priceUsd.toFixed(2)}</div>
          </div>
          <textarea
            value={extraText}
            onChange={(e) => setExtraText(e.target.value)}
            rows={6}
            className="checkout-field w-full min-h-[8rem]"
            placeholder={
              extraId === 'filing_extract'
                ? 'Paste 10-K / 10-Q / transcript excerpt…'
                : 'Ticker or leftover belief — watch conditions only, not an order…'
            }
          />
          <button type="submit" disabled={extraBusy} className="btn-secondary">
            {extraBusy ? 'Running DeepSeek V4…' : `Run extra · $${extraMeta.priceUsd.toFixed(2)}`}
          </button>
          {needPack && (
            <div className="flex flex-wrap gap-2">
              {TOKEN_PACKS.map((p) => (
                <Link key={p.id} href={`/checkout/waffo?sku=${p.id}`} className="btn-primary text-xs">
                  Buy {p.name} · ${p.priceUsd}
                </Link>
              ))}
            </div>
          )}
          {extraOut && (
            <pre className="whitespace-pre-wrap text-sm text-slate-700 bg-white border border-slate-100 rounded-xl p-3">
              {extraOut}
            </pre>
          )}
        </form>
      )}

      <PaywallModal open={paywall} remainingCount={0} onClose={() => setPaywall(false)} />
    </div>
  );
}
