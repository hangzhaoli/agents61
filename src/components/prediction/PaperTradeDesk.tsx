'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Link2, Unplug, X } from 'lucide-react';
import type { GapRow } from '@/lib/prediction/gaps';
import { daysUntilEnd, formatConfidencePlain, formatDaysLeft, formatGap } from '@/lib/prediction/types';
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
import {
  appendLiveFill,
  emptyLiveBook,
  readLiveBook,
  type LiveBook,
} from '@/lib/prediction/live-desk';
import { placeLiveMarketBuy, tokenIdForSide, clearClobSession, fetchClobCollateral } from '@/lib/prediction/clob';
import { buildTradeGuide } from '@/lib/prediction/trade-guide';
import {
  DEFAULT_BATCH_RULES,
  matchBatchRules,
  type BatchRuleConfig,
} from '@/lib/prediction/batch-rules';
import TradeGuidePanel from '@/components/prediction/TradeGuidePanel';
import {
  connectWallet,
  ensurePolygon,
  getChainId,
  getEthereum,
  POLYGON_CHAIN_ID,
  readMaticAndUsdc,
  shortAddr,
} from '@/lib/prediction/wallet';

const DEFAULT_STAKE = 100;
const MIN_GAP = 3;
const MIN_MID = 10;
const MAX_MID = 90;

type DeskMode = 'paper' | 'live';
/** Desk default horizon: short event windows where research can still settle soon. */
type Horizon = '1-3' | '1-7' | 'any';

const HORIZON_LABEL: Record<Horizon, string> = {
  '1-3': '1–3 days',
  '1-7': '1–7 days',
  any: 'Any horizon',
};

function inHorizon(endDate: string | null, horizon: Horizon): boolean {
  if (horizon === 'any') return true;
  const d = daysUntilEnd(endDate);
  if (d == null) return false;
  if (horizon === '1-3') return d >= 1 && d <= 3;
  return d >= 1 && d <= 7;
}

function fmtUsd(n: number) {
  const sign = n > 0 ? '+' : '';
  return `${sign}$${n.toFixed(2)}`;
}

export default function PaperTradeDesk({ rows }: { rows: GapRow[] }) {
  const [mode, setMode] = useState<DeskMode>('paper');
  const [horizon, setHorizon] = useState<Horizon>('1-3');
  const [batchBusy, setBatchBusy] = useState(false);
  const [book, setBook] = useState<DeskBook>(() => emptyDeskBook());
  const [liveBook, setLiveBook] = useState<LiveBook>(() => emptyLiveBook());
  const [hydrated, setHydrated] = useState(false);
  const [stake, setStake] = useState(DEFAULT_STAKE);
  const [flash, setFlash] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [matic, setMatic] = useState<number | null>(null);
  const [usdc, setUsdc] = useState<number | null>(null);
  const [clobBal, setClobBal] = useState<number | null>(null);
  const [clobAllow, setClobAllow] = useState<number | null>(null);
  const [walletBusy, setWalletBusy] = useState(false);

  const syncPaper = useCallback(() => setBook(readDeskBook()), []);
  const syncLive = useCallback(() => setLiveBook(readLiveBook()), []);

  useEffect(() => {
    syncPaper();
    syncLive();
    setHydrated(true);
    window.addEventListener('agents61-paper-desk', syncPaper);
    window.addEventListener('agents61-live-desk', syncLive);
    window.addEventListener('storage', syncPaper);
    return () => {
      window.removeEventListener('agents61-paper-desk', syncPaper);
      window.removeEventListener('agents61-live-desk', syncLive);
      window.removeEventListener('storage', syncPaper);
    };
  }, [syncPaper, syncLive]);

  const refreshChain = useCallback(async (addr: string) => {
    try {
      const cid = await getChainId();
      setChainId(cid);
      if (cid !== POLYGON_CHAIN_ID) {
        setMatic(null);
        setUsdc(null);
        setClobBal(null);
        setClobAllow(null);
        return;
      }
      const bals = await readMaticAndUsdc(addr);
      setMatic(bals.matic);
      setUsdc(bals.usdc);
      try {
        const c = await fetchClobCollateral();
        setClobBal(c.balance);
        setClobAllow(c.allowance);
      } catch {
        setClobBal(null);
        setClobAllow(null);
      }
    } catch {
      /* ignore refresh errors */
    }
  }, []);

  useEffect(() => {
    const eth = getEthereum();
    if (!eth?.on) return;
    const onAccounts = (...args: unknown[]) => {
      const accs = args[0] as string[] | undefined;
      clearClobSession();
      const next = accs?.[0] ?? null;
      setAddress(next);
      if (next) void refreshChain(next);
      else {
        setChainId(null);
        setMatic(null);
        setUsdc(null);
        setClobBal(null);
        setClobAllow(null);
      }
    };
    const onChain = (...args: unknown[]) => {
      const hex = args[0] as string | undefined;
      if (hex) setChainId(Number.parseInt(hex, 16));
      clearClobSession();
      if (address) void refreshChain(address);
    };
    eth.on('accountsChanged', onAccounts);
    eth.on('chainChanged', onChain);
    return () => {
      eth.removeListener?.('accountsChanged', onAccounts);
      eth.removeListener?.('chainChanged', onChain);
    };
  }, [address, refreshChain]);

  const baseCandidates = useMemo(() => {
    return [...rows]
      .filter((r) => Math.abs(r.gap) >= MIN_GAP)
      .filter((r) => r.market.marketProbability >= MIN_MID && r.market.marketProbability <= MAX_MID)
      .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));
  }, [rows]);

  const horizonCounts = useMemo(() => {
    const d13 = baseCandidates.filter((r) => inHorizon(r.market.endDate, '1-3')).length;
    const d17 = baseCandidates.filter((r) => inHorizon(r.market.endDate, '1-7')).length;
    return { '1-3': d13, '1-7': d17, any: baseCandidates.length };
  }, [baseCandidates]);

  const suggestions = useMemo(() => {
    return baseCandidates.filter((r) => inHorizon(r.market.endDate, horizon)).slice(0, 12);
  }, [baseCandidates, horizon]);

  const primaryGuide = useMemo(() => {
    const top = suggestions[0];
    if (!top) return null;
    return {
      row: top,
      guide: buildTradeGuide({
        row: top,
        stakeUsd: stake,
        chain: {
          connected: Boolean(address),
          onPolygon: chainId === POLYGON_CHAIN_ID,
          usdc,
          clobBal,
          clobAllow,
        },
      }),
    };
  }, [suggestions, stake, address, chainId, usdc, clobBal, clobAllow]);

  const batchRules: BatchRuleConfig = useMemo(() => {
    const base = { ...DEFAULT_BATCH_RULES, stakeUsd: stake };
    if (horizon === '1-3') return { ...base, minDays: 1, maxDays: 3 };
    if (horizon === '1-7') return { ...base, minDays: 1, maxDays: 7 };
    return { ...base, minDays: null, maxDays: null };
  }, [horizon, stake]);

  const batchCandidates = useMemo(
    () => matchBatchRules(suggestions, batchRules),
    [suggestions, batchRules]
  );

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
    window.setTimeout(() => setFlash(null), 3200);
  }

  async function onConnect() {
    setWalletBusy(true);
    try {
      const addr = await connectWallet();
      await ensurePolygon();
      setAddress(addr);
      await refreshChain(addr);
      toast(`Connected ${shortAddr(addr)} · Polygon`);
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e));
    } finally {
      setWalletBusy(false);
    }
  }

  function executePaper(row: GapRow, side: DeskSide) {
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

  async function executeLive(row: GapRow, side: DeskSide) {
    if (!address) {
      toast('Connect wallet first');
      return;
    }
    if (!tokenIdForSide(row.market, side)) {
      toast('No CLOB tokens for this market — paper only');
      return;
    }
    setBusyId(row.market.id);
    try {
      await ensurePolygon();
      const result = await placeLiveMarketBuy({
        market: row.market,
        side,
        amountUsd: stake,
      });
      const tokenId = tokenIdForSide(row.market, side)!;
      const fill = {
        id: `live-${row.market.id}-${Date.now()}`,
        marketId: row.market.id,
        question: row.market.question,
        url: row.market.url,
        side,
        amountUsd: stake,
        entryMid: row.market.marketProbability,
        agents61: row.agents61Probability,
        gap: row.gap,
        tokenId,
        orderId: result.orderId,
        status: result.status || (result.ok ? 'posted' : 'failed'),
        openedAt: new Date().toISOString(),
        error: result.error,
        mode: 'live' as const,
      };
      const next = appendLiveFill(fill);
      setLiveBook(next);
      if (result.ok) {
        toast(`Live ${side} posted · $${stake}${result.orderId ? ` · ${result.orderId.slice(0, 10)}…` : ''}`);
        void refreshChain(address);
      } else {
        toast(result.error || 'Live order failed');
      }
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e));
    } finally {
      setBusyId(null);
    }
  }

  function execute(row: GapRow, side: DeskSide) {
    if (mode === 'live') void executeLive(row, side);
    else executePaper(row, side);
  }

  function batchPaperOpen() {
    if (mode !== 'paper') {
      toast('批量开仓仅限 Paper（不自动 Live）');
      return;
    }
    if (batchCandidates.length === 0) {
      toast('规则下没有候选');
      return;
    }
    setBatchBusy(true);
    try {
      const next = readDeskBook();
      let opened = 0;
      let skipped = 0;
      for (const c of batchCandidates) {
        if (next.positions.some((p) => p.status === 'open' && p.marketId === c.row.market.id)) {
          skipped += 1;
          continue;
        }
        const deployedNow = openDeployed(next);
        if (deployedNow + stake > next.bankrollUsd) {
          skipped += 1;
          continue;
        }
        const entry = c.row.market.marketProbability;
        next.positions.push({
          id: `desk-batch-${c.row.market.id}-${Date.now()}-${opened}`,
          marketId: c.row.market.id,
          question: c.row.market.question,
          url: c.row.market.url,
          side: c.side,
          entryMid: entry,
          agents61: c.row.agents61Probability,
          gap: c.row.gap,
          stake,
          openedAt: new Date().toISOString(),
          status: 'open',
          realizedPnL: null,
          markMid: entry,
        });
        opened += 1;
      }
      writeDeskBook(next);
      setBook(next);
      toast(`规则批量纸面：开 ${opened} · 跳过 ${skipped}`);
    } finally {
      setBatchBusy(false);
    }
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
    return <div className="card p-8 text-sm text-slate-500">Loading trade desk…</div>;
  }

  const onPolygon = chainId === POLYGON_CHAIN_ID;

  return (
    <div className="space-y-4">
      {flash ? (
        <div className="rounded-xl bg-[#0052d9] text-white text-sm font-medium px-4 py-2">{flash}</div>
      ) : null}

      {/* Mode + chain */}
      <div className="card p-4 md:p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => setMode('paper')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md ${
                mode === 'paper' ? 'bg-white text-[#0052d9] shadow-sm' : 'text-slate-500'
              }`}
            >
              Paper
            </button>
            <button
              type="button"
              onClick={() => setMode('live')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md ${
                mode === 'live' ? 'bg-white text-[#0052d9] shadow-sm' : 'text-slate-500'
              }`}
            >
              Live
            </button>
          </div>
          <p className="text-xs text-slate-500 flex-1 min-w-[12rem]">
            {mode === 'paper'
              ? 'Virtual mid fills · 0 fees · this browser'
              : 'Real USDC on Polygon via Polymarket CLOB · wallet signs every order'}
          </p>
          {mode === 'live' ? (
            address ? (
              <button
                type="button"
                onClick={() => {
                  clearClobSession();
                  setAddress(null);
                  setChainId(null);
                  setMatic(null);
                  setUsdc(null);
                  setClobBal(null);
                  setClobAllow(null);
                  toast('Wallet session cleared (browser still connected)');
                }}
                className="btn-secondary text-xs"
              >
                <Unplug className="h-3.5 w-3.5" strokeWidth={2.5} />
                Disconnect session
              </button>
            ) : (
              <button
                type="button"
                disabled={walletBusy}
                onClick={() => void onConnect()}
                className="btn-primary text-xs disabled:opacity-40"
              >
                <Link2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                {walletBusy ? 'Connecting…' : 'Connect wallet'}
              </button>
            )
          ) : null}
        </div>

        {mode === 'live' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 text-sm">
            <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Wallet</p>
              <p className="font-semibold text-slate-900 mt-0.5">
                {address ? shortAddr(address) : '—'}
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Chain</p>
              <p className={`font-semibold mt-0.5 ${onPolygon ? 'text-emerald-700' : 'text-amber-700'}`}>
                {chainId == null ? '—' : onPolygon ? 'Polygon 137' : `Wrong chain (${chainId})`}
              </p>
              {address && !onPolygon ? (
                <button
                  type="button"
                  className="text-[11px] text-[#0052d9] mt-1"
                  onClick={() => {
                    void (async () => {
                      await ensurePolygon();
                      if (address) await refreshChain(address);
                    })();
                  }}
                >
                  Switch to Polygon
                </button>
              ) : null}
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">POL (gas)</p>
              <p className="font-semibold text-slate-900 mt-0.5">
                {matic == null ? '—' : matic.toFixed(4)}
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">USDC.e (wallet)</p>
              <p className="font-semibold text-slate-900 mt-0.5">
                {usdc == null ? '—' : `$${usdc.toFixed(2)}`}
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">CLOB collateral</p>
              <p className="font-semibold text-slate-900 mt-0.5">
                {clobBal == null ? '—' : `$${clobBal.toFixed(2)}`}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                allow {clobAllow == null ? '—' : `$${clobAllow.toFixed(2)}`}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {mode === 'paper' ? (
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
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="card-flat p-4">
            <p className="text-[10px] uppercase tracking-wider text-slate-400">Live fills (browser log)</p>
            <p className="text-xl font-bold text-slate-900">{liveBook.fills.length}</p>
          </div>
          <div className="card-flat p-4">
            <p className="text-[10px] uppercase tracking-wider text-slate-400">Last live</p>
            <p className="text-sm font-semibold text-slate-900 mt-1 line-clamp-2">
              {liveBook.fills[0]
                ? `${liveBook.fills[0].side} $${liveBook.fills[0].amountUsd} · ${liveBook.fills[0].status}`
                : '—'}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-slate-600 flex items-center gap-2">
          {mode === 'live' ? 'Size $' : 'Stake $'}
          <input
            type="number"
            min={1}
            max={mode === 'paper' ? book.bankrollUsd : 10_000}
            step={1}
            value={stake}
            onChange={(e) => setStake(Math.max(1, Number(e.target.value) || 1))}
            className="w-24 rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
          />
        </label>
        {mode === 'paper' ? (
          <>
            <button type="button" onClick={settleOpenWithMarks} className="btn-secondary text-sm">
              Auto-settle extreme mids
            </button>
            <button
              type="button"
              disabled={batchBusy || batchCandidates.length === 0}
              onClick={batchPaperOpen}
              className="btn-primary text-sm disabled:opacity-40"
              title="按规则批量纸面开仓：|gap|≥3、mid 10–90、确信度非 Low、当前期限窗"
            >
              {batchBusy ? 'Opening…' : `规则批量纸面 (${batchCandidates.length})`}
            </button>
            <button type="button" onClick={resetBook} className="text-xs text-slate-400 hover:text-rose-600">
              Reset desk
            </button>
          </>
        ) : (
          <p className="text-xs text-slate-400">
            Live uses FAK market buys on CLOB. Deposit USDC on polymarket.com if collateral is empty.
            批量规则只开 Paper，不自动 Live。
          </p>
        )}
      </div>

      {mode === 'paper' && batchCandidates.length > 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-xs text-slate-600">
          <p className="font-bold text-slate-800 mb-1">量化规则引擎（Prediction）</p>
          <p>
            |gap|≥{batchRules.minAbsGap} · mid {batchRules.minMid}–{batchRules.maxMid}% · 确信度 Medium+
            · 期限 {horizon === 'any' ? '不限' : HORIZON_LABEL[horizon]} · 最多{' '}
            {batchRules.maxPositions} 笔 · 每笔 ${stake}
          </p>
          <ul className="mt-2 space-y-0.5">
            {batchCandidates.map((c) => (
              <li key={c.row.market.id} className="line-clamp-1">
                {c.side} · {c.reason} · {c.row.market.question.slice(0, 64)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {primaryGuide ? (
        <TradeGuidePanel
          guide={primaryGuide.guide}
          title="区块链交易指导 · 当前最佳候选"
          question={primaryGuide.row.market.question}
          onApplySide={(side) => execute(primaryGuide.row, side)}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">
          当前筛选下没有可指导的候选。放宽到 1–7 天或 Any，或先去 Analyze 几个盘。
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <section className="card p-5 md:p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Suggestions</h2>
          <p className="text-sm text-slate-600 mb-3">
            Prediction agents → A61 probability → Gap → desk. Default window{' '}
            <strong>1–3 days</strong> (same-day is too thin). Gap ≥ {MIN_GAP}pp · mid {MIN_MID}–
            {MAX_MID}%.
          </p>
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 mb-4">
            {(['1-3', '1-7', 'any'] as Horizon[]).map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHorizon(h)}
                className={`px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide rounded-md ${
                  horizon === h ? 'bg-white text-[#0052d9] shadow-sm' : 'text-slate-500'
                }`}
              >
                {HORIZON_LABEL[h]}
                <span className="ml-1 font-semibold text-slate-400">({horizonCounts[h]})</span>
              </button>
            ))}
          </div>
          {suggestions.length === 0 ? (
            <p className="text-sm text-slate-500">
              No gaps in {HORIZON_LABEL[horizon].toLowerCase()}. Try{' '}
              {horizon === '1-3' ? '1–7 days' : 'Any horizon'}, run Analyze, or open the{' '}
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
                const already = mode === 'paper' && openIds.has(r.market.id);
                const hasClob = Boolean(r.market.clobTokenIds);
                const liveBlocked = mode === 'live' && (!address || !hasClob || !onPolygon);
                const days = daysUntilEnd(r.market.endDate);
                return (
                  <li key={r.market.id} className="rounded-xl border border-slate-100 p-4">
                    <Link
                      href={`/predictions/${encodeURIComponent(r.market.id)}`}
                      className="text-sm font-semibold text-slate-900 hover:text-[#0052d9] line-clamp-2"
                    >
                      {r.market.question}
                    </Link>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span className="font-semibold text-[#0052d9]">{formatDaysLeft(days)}</span>
                      <span>Mid {r.market.marketProbability}%</span>
                      <span>A61 {r.agents61Probability}%</span>
                      <span className="font-semibold text-slate-800">{formatGap(r.gap)}</span>
                      <span title={formatConfidencePlain(r.confidence).detail}>
                        确信度 {formatConfidencePlain(r.confidence).short}
                      </span>
                      <span>Model EV {fmtUsd(ev)}</span>
                      {mode === 'live' ? (
                        <span className={hasClob ? 'text-emerald-700' : 'text-amber-700'}>
                          {hasClob ? 'CLOB ready' : 'No token ids'}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={already || liveBlocked || busyId === r.market.id}
                        onClick={() => execute(r, side)}
                        className="btn-primary text-xs disabled:opacity-40"
                      >
                        {busyId === r.market.id
                          ? 'Signing…'
                          : mode === 'live'
                            ? `Live ${side}`
                            : `Paper ${side}`}
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </button>
                      <button
                        type="button"
                        disabled={already || liveBlocked || busyId === r.market.id}
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

        <section className="space-y-6">
          {mode === 'paper' ? (
            <>
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
                        <span
                          className={
                            p.realizedPnL && p.realizedPnL >= 0 ? 'text-emerald-700' : 'text-rose-700'
                          }
                        >
                          {fmtUsd(p.realizedPnL ?? 0)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <div className="card p-5 md:p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Live order log</h2>
              <p className="text-xs text-slate-500 mb-4">
                Local record of CLOB posts from this browser. Source of truth remains Polymarket /
                Polygon.
              </p>
              {liveBook.fills.length === 0 ? (
                <p className="text-sm text-slate-500">No live fills yet.</p>
              ) : (
                <ul className="space-y-3">
                  {liveBook.fills.slice(0, 30).map((f) => (
                    <li key={f.id} className="rounded-xl border border-slate-100 p-4 text-sm">
                      <p className="font-semibold text-slate-900 line-clamp-2">{f.question}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {f.side} · ${f.amountUsd} · mid {f.entryMid}% · {f.status}
                        {f.orderId ? ` · ${f.orderId.slice(0, 12)}…` : ''}
                      </p>
                      {f.error ? <p className="mt-1 text-xs text-rose-600">{f.error}</p> : null}
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#0052d9] mt-2 inline-block"
                      >
                        Polymarket
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
