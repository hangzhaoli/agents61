'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Copy,
  Download,
  FlaskConical,
  Loader2,
  Lock,
  Save,
  Trash2,
} from 'lucide-react';
import MasterAvatar from '@/components/masters/MasterAvatar';
import { getMasterBySlug } from '@/lib/masters';
import { QUANT_MASTERS, QUANT_LAB_DISCLAIMER } from '@/lib/quant-lab/masters';
import {
  CRYPTO_QUANT_PRESETS,
  normalizeQuantTicker,
  type QuantAssetClass,
} from '@/lib/quant-lab/crypto-tickers';
import {
  hydrateVault,
  pushVault,
  type CloudSyncState,
} from '@/lib/sync/cloud-client';
import {
  readVault,
  removeFromVault,
  saveToVault,
  vaultLimit,
  writeVault,
} from '@/lib/quant-lab/strategy-vault';
import type { GeneratedQuantStrategy, QuantMasterSlug, VaultStrategy } from '@/lib/quant-lab/types';
import { estimateTradeOdds } from '@/lib/quant-lab/trade-odds';
import QuantTradeOddsCard from '@/components/quant/QuantTradeOddsCard';
import { isUnlocked, PLANS, type PlanId } from '@/lib/tiers';

function withOdds(s: GeneratedQuantStrategy): GeneratedQuantStrategy {
  if (s.tradeOdds) return s;
  return {
    ...s,
    tradeOdds: estimateTradeOdds({
      masterSlug: s.spec.masterSlug as QuantMasterSlug,
      ticker: s.spec.ticker,
      thorp: s.thorpReview,
    }),
  };
}

type Tab = 'spec' | 'python' | 'thorp';

export default function QuantLabPanel({ plan }: { plan: PlanId }) {
  const [masterSlug, setMasterSlug] = useState<QuantMasterSlug>('william-oneil');
  const [assetClass, setAssetClass] = useState<QuantAssetClass>('equity');
  const [ticker, setTicker] = useState('SPY');
  const [notes, setNotes] = useState('');
  const [tab, setTab] = useState<Tab>('spec');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<GeneratedQuantStrategy | null>(null);
  const [vault, setVault] = useState<VaultStrategy[]>([]);
  const [copied, setCopied] = useState(false);
  const [syncState, setSyncState] = useState<CloudSyncState>('idle');
  const limit = vaultLimit(plan);
  const master = getMasterBySlug(masterSlug);
  const unlocked = isUnlocked(plan, masterSlug);

  const syncLocal = useCallback(() => setVault(readVault()), []);

  const commitVault = useCallback((next: VaultStrategy[]) => {
    writeVault(next);
    setVault(next);
    setSyncState('syncing');
    void pushVault(next).then((ok) => setSyncState(ok ? 'synced' : 'local-only'));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setSyncState('syncing');
      const local = readVault();
      setVault(local);
      const state = await hydrateVault(local, writeVault);
      if (cancelled) return;
      setVault(readVault());
      setSyncState(state);
    })();
    window.addEventListener('agents61-vault', syncLocal);
    return () => {
      cancelled = true;
      window.removeEventListener('agents61-vault', syncLocal);
    };
  }, [syncLocal]);

  const syncLabel =
    syncState === 'syncing'
      ? 'syncing…'
      : syncState === 'synced'
        ? 'vault synced'
        : syncState === 'error'
          ? 'sync error — saved on device'
          : 'this device only';

  async function generate() {
    if (!unlocked) return;
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/quant/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterSlug,
          ticker: normalizeQuantTicker(ticker, assetClass),
          notes:
            assetClass === 'crypto'
              ? `${notes ? notes + ' · ' : ''}crypto paper backtest — price/volume only, no equity fundamentals`
              : notes,
        }),
      });
      const data = (await res.json()) as GeneratedQuantStrategy & { error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Generation failed');
        return;
      }
      setResult(withOdds(data));
      setTab('spec');
    } catch {
      setError('Network error — try again.');
    } finally {
      setBusy(false);
    }
  }

  function save() {
    if (!result) return;
    const res = saveToVault(plan, result);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    commitVault(res.items);
    setError('');
  }

  function copyPython() {
    if (!result?.python) return;
    navigator.clipboard.writeText(result.python).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function downloadPy() {
    if (!result) return;
    const blob = new Blob([result.python], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agents61-${masterSlug}-${ticker.toLowerCase()}.py`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="quant-lab">
      <div className="quant-lab-head">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-[#0052d9]" strokeWidth={2} />
          <div>
            <h2 className="text-lg font-bold text-slate-900">Quant Lab</h2>
            <p className="text-xs text-slate-500">
              Master → strategy spec → Python backtest · Thorp reviews Kelly & overfitting ·{' '}
              {vault.length}/{limit} vault slots · {syncLabel}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
          Paper only
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-4">{QUANT_LAB_DISCLAIMER}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="quant-label">Timing / exit master</label>
          <div className="space-y-1.5">
            {QUANT_MASTERS.map((qm) => {
              const m = getMasterBySlug(qm.slug);
              const on = isUnlocked(plan, qm.slug);
              const active = masterSlug === qm.slug;
              return (
                <button
                  key={qm.slug}
                  type="button"
                  disabled={!on}
                  onClick={() => setMasterSlug(qm.slug)}
                  className={`quant-master-pick w-full ${active ? 'quant-master-pick-active' : ''} ${!on ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    {m && <MasterAvatar master={m} size="xs" />}
                    <span className="text-sm font-semibold text-slate-900">{qm.label}</span>
                    {!on && <Lock className="h-3.5 w-3.5 text-slate-400 ml-auto" strokeWidth={2} />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 text-left">{qm.system.slice(0, 80)}…</p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="quant-label">Asset class</label>
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 mb-3">
            {(['equity', 'crypto'] as QuantAssetClass[]).map((ac) => (
              <button
                key={ac}
                type="button"
                onClick={() => {
                  setAssetClass(ac);
                  if (ac === 'crypto' && !/-USD$/i.test(ticker)) setTicker('BTC-USD');
                  if (ac === 'equity' && /-USD$/i.test(ticker)) setTicker('SPY');
                }}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md ${
                  assetClass === ac ? 'bg-white text-[#0052d9] shadow-sm' : 'text-slate-500'
                }`}
              >
                {ac === 'equity' ? 'Equity / ETF' : 'Crypto / chain'}
              </button>
            ))}
          </div>
          <label className="quant-label">Compile for ticker</label>
          <input
            value={ticker}
            onChange={(e) =>
              setTicker(
                assetClass === 'crypto'
                  ? e.target.value.toUpperCase()
                  : e.target.value.toUpperCase()
              )
            }
            className="quant-input mb-2"
            placeholder={assetClass === 'crypto' ? 'BTC-USD' : 'SPY'}
          />
          {assetClass === 'crypto' ? (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {CRYPTO_QUANT_PRESETS.map((p) => (
                <button
                  key={p.symbol}
                  type="button"
                  onClick={() => setTicker(p.yfinance)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                    ticker === p.yfinance || ticker === p.symbol
                      ? 'border-[#0052d9] bg-blue-50 text-[#0052d9]'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {p.symbol}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {['SPY', 'QQQ', 'AAPL', 'NVDA'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTicker(t)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                    ticker === t
                      ? 'border-[#0052d9] bg-blue-50 text-[#0052d9]'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
          {assetClass === 'crypto' ? (
            <p className="text-[11px] text-slate-500 mb-2">
              Uses yfinance pairs (BTC-USD / ETH-USD). Rules stay price/volume — no fake P/E. Paper
              only.
            </p>
          ) : null}
          <label className="quant-label">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="quant-input resize-none mb-3"
            placeholder={
              assetClass === 'crypto'
                ? 'e.g. BTC-USD 日线趋势，纸面选单看综合胜率'
                : 'e.g. long-only, 5y daily, ignore earnings gaps'
            }
          />
          {master && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 mb-3">
              <strong className="text-slate-800">{master.nameEn}</strong> · {master.methodology}
            </div>
          )}
          <button
            type="button"
            onClick={generate}
            disabled={busy || !unlocked}
            className="btn-primary w-full justify-center"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                Compiling…
              </>
            ) : (
              <>Compile strategy + Python</>
            )}
          </button>
          {!unlocked && (
            <p className="text-xs text-slate-500 mt-2">
              Locked on {PLANS[plan].name}.{' '}
              <Link href="/pricing" className="text-[#0052d9] font-semibold hover:underline">
                Upgrade seating →
              </Link>
            </p>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      {result && (
        <div className="quant-output">
          {result.tradeOdds ? <QuantTradeOddsCard odds={result.tradeOdds} /> : null}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{result.spec.name}</h3>
              <p className="text-[10px] text-slate-400">
                Engine: {result.engine} · Ed Thorp quant review included
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={save} className="btn-secondary text-xs !py-2 !px-3">
                <Save className="h-3.5 w-3.5" strokeWidth={2.5} />
                Save to vault
              </button>
              <button type="button" onClick={copyPython} className="btn-secondary text-xs !py-2 !px-3">
                <Copy className="h-3.5 w-3.5" strokeWidth={2.5} />
                {copied ? 'Copied' : 'Copy Python'}
              </button>
              <button type="button" onClick={downloadPy} className="btn-secondary text-xs !py-2 !px-3">
                <Download className="h-3.5 w-3.5" strokeWidth={2.5} />
                Download .py
              </button>
            </div>
          </div>

          <div className="flex gap-1 mb-3">
            {(['spec', 'python', 'thorp'] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`quant-tab ${tab === t ? 'quant-tab-active' : ''}`}
              >
                {t === 'spec' ? 'Strategy spec' : t === 'python' ? 'Python backtest' : 'Thorp review'}
              </button>
            ))}
          </div>

          {tab === 'spec' && (
            <div className="quant-panel text-sm text-slate-700 space-y-3">
              <p><strong>Style:</strong> {result.spec.style}</p>
              <div>
                <strong className="text-slate-900">Entry rules</strong>
                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                  {result.spec.entryRules.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong className="text-slate-900">Exit rules</strong>
                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                  {result.spec.exitRules.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong className="text-slate-900">Parameters</strong>
                <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded-lg mt-1 overflow-x-auto">
                  {JSON.stringify(result.spec.parameters, null, 2)}
                </pre>
              </div>
              <p className="text-xs text-slate-500">{result.spec.positionSizing}</p>
            </div>
          )}

          {tab === 'python' && (
            <pre className="quant-code">{result.python}</pre>
          )}

          {tab === 'thorp' && (
            <div className="quant-panel space-y-3">
              <div className="flex items-start gap-2 rounded-lg border border-teal-200 bg-teal-50/60 p-3">
                <AlertTriangle className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-sm text-teal-900">{result.thorpReview.summary}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Edge claim</span>
                  <div className="font-bold text-slate-900 capitalize">{result.thorpReview.edgeClaim}</div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Kelly band</span>
                  <div className="font-bold text-slate-900">{result.thorpReview.kellyFractionBand}</div>
                </div>
              </div>
              <div>
                <strong className="text-sm text-slate-900">Overfitting warnings</strong>
                <ul className="text-sm text-slate-600 list-disc pl-4 mt-1">
                  {result.thorpReview.overfittingWarnings.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong className="text-sm text-slate-900">Significance</strong>
                <ul className="text-sm text-slate-600 list-disc pl-4 mt-1">
                  {result.thorpReview.significanceNotes.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-slate-500">{result.thorpReview.ruinNote}</p>
            </div>
          )}
        </div>
      )}

      {vault.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Strategy Vault</h3>
          <ul className="space-y-2">
            {vault.map((s) => (
              <li key={s.id} className="quant-vault-row">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-900 truncate">{s.spec.name}</div>
                  <div className="text-[10px] text-slate-400">
                    {new Date(s.createdAt).toLocaleDateString()} · {s.engine}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setResult(s);
                    setTab('python');
                  }}
                  className="text-xs font-semibold text-[#0052d9] hover:underline shrink-0"
                >
                  Open
                </button>
                <button
                  type="button"
                  onClick={() => commitVault(removeFromVault(s.id))}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                  aria-label="Delete strategy"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
