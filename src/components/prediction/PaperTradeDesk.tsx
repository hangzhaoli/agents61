'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, X } from 'lucide-react';
import type { GapRow } from '@/lib/prediction/gaps';
import { formatGap } from '@/lib/prediction/types';
import {
  emptyDeskBook,
  modelEv,
  openDeployed,
  paperPnl,
  readDeskBook,
  realizedTotal,
  writeDeskBook,
  type DeskBook,
  type DeskSide,
} from '@/lib/prediction/paper-desk';

const DEFAULT_STAKE = 100;
const MIN_GAP = 3;

function fmtUsd(n: number) {
  const sign = n > 0 ? '+' : '';
  return `${sign}$${n.toFixed(2)}`;
}

export default function PaperTradeDesk({ rows }: { rows: GapRow[] }) {
  const [book, setBook] = useState<DeskBook>(() => emptyDeskBook());
  const [hydrated, setHydrated] = useState(false);
  const [stake, setStake] = useState(DEFAULT_STAKE);
  const [flash, setFlash] = useState<string | null>(null);

  const sync = useCallback(() => {
    setBook(readDeskBook());
  }, []);

  useEffect(() => {
    sync();
    setHydrated(true);
    window.addEventListener('agents61-paper-desk', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('agents61-paper-desk', sync);
      window.removeEventListener('storage', sync);
    };
  }, [sync]);

  const suggestions = useMemo(() => {
    return [...rows]
      .filter((r) => Math.abs(r.gap) >= MIN_GAP)
      .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))
      .slice(0, 12);
  }, [rows]);

  const open = book.positions.filter((p) => p.status === 'open');
  const settled = book.positions.filter((p) => p.status === 'settled').slice().reverse();
  const deployed = openDeployed(book);
  const realized = realizedTotal(book);
  const openIds = useMemo(() => new Set(open.map((p) => p.marketId)), [open]);

  const midById = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rows) m.set(r.market.id, r.market.marketProbability);
    return m;
  }, [rows]);

  function toast(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2800);
  }

  function execute(row: GapRow, side: DeskSide) {
    const next = readDeskBook();
    if (next.positions.some((p) => p.status === 'open' && p.marketId === row.market.id)) {
      toast('Already open on this market');
      return;
    }
    const deployedNow = openDeployed(next);
    if (deployedNow + stake > next.bankrollUsd) {
      toast('Bankroll full — settle or raise bankroll');
      return;
    }
    const entry = row.market.marketProbability;
    next.positions.push({
      id: `desk-${row.market.id}-${Date.now()}`,
      marketId: row.market.id,
      question: row.market.question,
      url: row.market.url,
      side,
      entryMid: entry,
      agents61: row.agents61Probability,
      gap: row.gap,
      stake,
      openedAt: new Date().toISOString(),
      status: 'open',
      realizedPnL: null,
      markMid: entry,
    });
    writeDeskBook(next);
    setBook(next);
    toast(`Paper ${side} @ ${entry}% · $${stake}`);
  }

  function settleOne(id: string, finalMid: number) {
    const next = readDeskBook();
    const pos = next.positions.find((p) => p.id === id);
    if (!pos || pos.status === 'settled') return;
    const { won, realizedPnL } = paperPnl(pos.side, pos.entryMid, pos.stake, finalMid);
    pos.status = 'settled';
    pos.won = won;
    pos.realizedPnL = realizedPnL;
    pos.finalYesPct = finalMid;
    pos.settledAt = new Date().toISOString();
    pos.markMid = finalMid;
    writeDeskBook(next);
    setBook(next);
    toast(`${won ? 'WIN' : 'LOSS'} ${fmtUsd(realizedPnL)}`);
  }

  function settleOpenWithMarks() {
    const next = readDeskBook();
    let n = 0;
    for (const pos of next.positions) {
      if (pos.status !== 'open') continue;
      const mid = midById.get(pos.marketId) ?? pos.markMid;
      if (mid == null) continue;
      // V1 manual settle: only extreme mids OR user force via button — auto-pass onesided
      if (mid > 5 && mid < 95) {
        pos.markMid = mid;
        continue;
      }
      const { won, realizedPnL } = paperPnl(pos.side, pos.entryMid, pos.stake, mid);
      pos.status = 'settled';
      pos.won = won;
      pos.realizedPnL = realizedPnL;
      pos.finalYesPct = mid;
      pos.settledAt = new Date().toISOString();
      pos.markMid = mid;
      n += 1;
    }
    writeDeskBook(next);
    setBook(next);
    toast(n ? `Settled ${n} extreme mid(s)` : 'No extreme mids to auto-settle — use Force on a row');
  }

  function resetBook() {
    if (!window.confirm('Clear this browser paper desk?')) return;
    const next = emptyDeskBook(book.bankrollUsd);
    writeDeskBook(next);
    setBook(next);
    toast('Desk cleared');
  }

  if (!hydrated) {
    return <div className="card p-8 text-sm text-slate-500">Loading paper desk…</div>;
  }

  return (
    <div className="space-y-4">
      {flash ? (
        <div className="rounded-xl bg-[#0052d9] text-white text-sm font-medium px-4 py-2">{flash}</div>
      ) : null}

      <div className="grid sm:grid-cols-4 gap-3">
        <div className="card-flat p-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-400">Bankroll</p>
          <p className="text-xl font-bold text-slate-900">${book.bankrollUsd}</p>
        </div>
        <div className="card-flat p-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-400">Deployed</p>
          <p className="text-xl font-bold text-slate-900">${deployed}</p>
        </div>
        <div className="card-flat p-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-400">Realized</p>
          <p className={`text-xl font-bold ${realized >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {fmtUsd(realized)}
          </p>
        </div>
        <div className="card-flat p-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-400">Open / Settled</p>
          <p className="text-xl font-bold text-slate-900">
            {open.length} / {settled.length}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-slate-600 flex items-center gap-2">
          Stake $
          <input
            type="number"
            min={10}
            max={book.bankrollUsd}
            step={10}
            value={stake}
            onChange={(e) => setStake(Math.max(10, Number(e.target.value) || 10))}
            className="w-24 rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
          />
        </label>
        <button type="button" onClick={settleOpenWithMarks} className="btn-secondary text-sm">
          Auto-settle extreme mids
        </button>
        <button type="button" onClick={resetBook} className="text-xs text-slate-400 hover:text-rose-600">
          Reset desk
        </button>
        <p className="text-xs text-slate-400">Paper only · mid fill · 0 fees · this browser</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* LEFT: suggestions */}
        <section className="card p-5 md:p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Suggestions</h2>
          <p className="text-sm text-slate-600 mb-4">
            Gap ≥ {MIN_GAP}pp from Top Gaps. Execute opens a paper fill at the live YES mid.
          </p>
          {suggestions.length === 0 ? (
            <p className="text-sm text-slate-500">
              No gaps ≥ {MIN_GAP}pp yet. Run Analyze on markets or open the{' '}
              <Link href="/predictions/scanner" className="text-[#0052d9]">
                scanner
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-3">
              {suggestions.map((r) => {
                const side: DeskSide = r.gap > 0 ? 'YES' : 'NO';
                const ev = modelEv(side, r.market.marketProbability, r.agents61Probability, stake);
                const already = openIds.has(r.market.id);
                return (
                  <li key={r.market.id} className="rounded-xl border border-slate-100 p-4">
                    <Link
                      href={`/predictions/${encodeURIComponent(r.market.id)}`}
                      className="text-sm font-semibold text-slate-900 hover:text-[#0052d9] line-clamp-2"
                    >
                      {r.market.question}
                    </Link>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>Mid {r.market.marketProbability}%</span>
                      <span>A61 {r.agents61Probability}%</span>
                      <span className="font-semibold text-slate-800">{formatGap(r.gap)}</span>
                      <span>{r.confidence}</span>
                      <span>Model EV {fmtUsd(ev)}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={already}
                        onClick={() => execute(r, side)}
                        className="btn-primary text-xs disabled:opacity-40"
                      >
                        Paper {side}
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </button>
                      <button
                        type="button"
                        disabled={already}
                        onClick={() => execute(r, side === 'YES' ? 'NO' : 'YES')}
                        className="btn-secondary text-xs disabled:opacity-40"
                      >
                        Flip {side === 'YES' ? 'NO' : 'YES'}
                      </button>
                      {already ? <span className="text-xs text-slate-400 self-center">Open</span> : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* RIGHT: book */}
        <section className="space-y-6">
          <div className="card p-5 md:p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Open positions</h2>
            {open.length === 0 ? (
              <p className="text-sm text-slate-500">No open paper positions.</p>
            ) : (
              <ul className="space-y-3">
                {open.map((p) => {
                  const mark = midById.get(p.marketId) ?? p.markMid ?? p.entryMid;
                  return (
                    <li key={p.id} className="rounded-xl border border-slate-100 p-4 text-sm">
                      <p className="font-semibold text-slate-900 line-clamp-2">{p.question}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {p.side} @ {p.entryMid}% · stake ${p.stake} · mark {mark}% · gap{' '}
                        {formatGap(p.gap)}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="btn-secondary text-xs"
                          onClick={() => settleOne(p.id, mark)}
                        >
                          Force settle @ mark
                        </button>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-[#0052d9] self-center"
                        >
                          Polymarket
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="card p-5 md:p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Settled</h2>
            {settled.length === 0 ? (
              <p className="text-sm text-slate-500">Nothing settled yet.</p>
            ) : (
              <ul className="space-y-2">
                {settled.slice(0, 20).map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center gap-2 text-sm border-b border-slate-50 pb-2 last:border-0"
                  >
                    {p.won ? (
                      <Check className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
                    ) : (
                      <X className="h-4 w-4 text-rose-600" strokeWidth={2.5} />
                    )}
                    <span className="font-semibold">{p.won ? 'WIN' : 'LOSS'}</span>
                    <span className="text-slate-600 line-clamp-1 flex-1">{p.question}</span>
                    <span className={p.realizedPnL && p.realizedPnL >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                      {fmtUsd(p.realizedPnL ?? 0)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
