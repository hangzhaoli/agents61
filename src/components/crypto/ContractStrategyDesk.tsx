'use client';

import { useEffect, useState } from 'react';
import { LineChart, List, Loader2 } from 'lucide-react';
import { CRYPTO_CONTRACTS, EQUITY_CONTRACTS, type ContractSpec } from '@/lib/quant-lab/perp-universe';
import type { PerpBacktest, PerpTrade } from '@/lib/quant-lab/perp-strategy';

function money(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function signed(n: number, digits = 1) {
  const text = `${n > 0 ? '+' : ''}${n.toFixed(digits)}`;
  return text;
}

function tone(n: number) {
  if (n > 0) return 'text-emerald-700';
  if (n < 0) return 'text-red-600';
  return 'text-slate-700';
}

function price(n: number) {
  if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (n >= 1) return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return n.toLocaleString('en-US', { maximumFractionDigits: 4 });
}

function EquityChart({ points }: { points: { date: string; equity: number }[] }) {
  if (points.length < 2) return null;
  const width = 640;
  const height = 112;
  const values = points.map((p) => p.equity);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const coords = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - 8 - ((p.equity - min) / span) * (height - 16);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28" role="img" aria-label="Paper equity curve">
      <polyline fill="none" stroke="#0052d9" strokeWidth="2.5" points={coords} />
    </svg>
  );
}

function TradeTable({ trades }: { trades: PerpTrade[] }) {
  const rows = [...trades].reverse();
  if (!rows.length) {
    return <p className="text-sm text-slate-500">No trades in this window.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
            <th className="py-2 pr-3">Side</th>
            <th className="py-2 pr-3">Entry</th>
            <th className="py-2 pr-3">Exit</th>
            <th className="py-2 pr-3">Prices</th>
            <th className="py-2 pr-3">P&L</th>
            <th className="py-2 pr-3">Why</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id} className="border-b border-slate-50 last:border-0">
              <td className="py-2.5 pr-3 font-semibold text-slate-900">{t.instrument ?? t.side}</td>
              <td className="py-2.5 pr-3 text-slate-600">{t.entryDate}</td>
              <td className="py-2.5 pr-3 text-slate-600">{t.exitDate ?? 'Open'}</td>
              <td className="py-2.5 pr-3 text-slate-600">
                {price(t.entryPrice)}
                {t.exitPrice != null ? ` → ${price(t.exitPrice)}` : ''}
              </td>
              <td className={`py-2.5 pr-3 font-semibold ${tone(t.pnlUsd)}`}>
                {signed(t.pnlPct)}% · {signed(t.pnlUsd, 0)}
              </td>
              <td className="py-2.5 pr-3 text-xs text-slate-500">{whyTrade(t)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const US_STYLES = [
  { id: 'contract', label: 'Contract' },
  { id: 'shares', label: 'Shares' },
  { id: 'wheel', label: 'Options wheel' },
] as const;

function whyTrade(t: PerpTrade) {
  if (t.status === 'open') return `Marked open · ${t.bars}d`;
  const reason =
    t.exitReason === 'stop'
      ? 'ATR stop'
      : t.exitReason === 'called'
        ? 'Called away'
        : t.exitReason === 'assigned'
          ? 'Assigned'
          : t.exitReason === 'expiry'
            ? 'Expired'
            : 'Channel exit';
  return `${reason} · ${t.bars}d`;
}

export default function ContractStrategyDesk({ book = 'crypto' }: { book?: 'crypto' | 'equity' }) {
  const items = book === 'equity' ? EQUITY_CONTRACTS : CRYPTO_CONTRACTS;
  const [symbol, setSymbol] = useState(book === 'equity' ? 'SPY' : 'BTC');
  const [style, setStyle] = useState<(typeof US_STYLES)[number]['id']>('contract');
  const [data, setData] = useState<PerpBacktest | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setBusy(true);
    setError('');
    const styleQuery = book === 'equity' ? `&style=${style}` : '';
    fetch(`/api/quant/perp-backtest?symbol=${symbol}${styleQuery}`)
      .then(async (res) => {
        const body = (await res.json()) as PerpBacktest & { error?: string };
        if (!res.ok) throw new Error(body.error ?? 'Backtest failed');
        return body;
      })
      .then((body) => {
        if (!cancelled) setData(body);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Backtest failed');
      })
      .finally(() => {
        if (!cancelled) setBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [symbol, style, book]);

  const summary = data?.summary;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-[#0052d9] uppercase">
            {book === 'equity' ? 'US quant' : 'Contract strategy'}
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 mt-1">
            {book === 'equity' ? equityTitle(style) : 'Paper perpetual automation'}
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {book === 'equity'
              ? equityBlurb(style)
              : 'Trend-filtered breakout on a crypto perpetual. The same run feeds the backtest and the trade tape. No orders are sent.'}
          </p>
        </div>
      </div>

      {book === 'equity' ? (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {US_STYLES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStyle(item.id)}
              className={`px-2.5 py-1 text-xs font-bold rounded-md border ${
                style === item.id
                  ? 'bg-[#0052d9] text-white border-[#0052d9]'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mb-4">
        <SymbolRow
          label={book === 'equity' ? 'US names' : 'Crypto'}
          items={items}
          symbol={symbol}
          onPick={setSymbol}
        />
      </div>

      {busy && (
        <p className="text-sm text-slate-500 flex items-center gap-2 mb-3">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
          Running {symbol} paper book…
        </p>
      )}
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      {data && summary && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            {data.pair} · {data.window.from} → {data.window.to} · {data.window.bars} bars · {data.dataNote}
          </p>

          <div className="rounded-xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <LineChart className="h-4 w-4 text-[#0052d9]" strokeWidth={2} />
              <h4 className="text-sm font-bold text-slate-900">Backtest</h4>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                Paper
              </span>
            </div>
            <EquityChart points={data.equity} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              <Stat label="Return" value={`${signed(summary.totalReturnPct)}%`} className={tone(summary.totalReturnPct)} />
              <Stat label="Max drawdown" value={`${summary.maxDrawdownPct.toFixed(1)}%`} className="text-slate-900" />
              <Stat label="Win rate" value={`${summary.winRatePct.toFixed(0)}%`} className="text-slate-900" />
              <Stat label="Closed trades" value={String(summary.closedTrades)} className="text-slate-900" />
              <Stat label="Profit factor" value={summary.profitFactor.toFixed(2)} className="text-slate-900" />
              <Stat label="Sharpe" value={summary.sharpe.toFixed(2)} className="text-slate-900" />
              <Stat label="End equity" value={money(summary.endEquity)} className="text-slate-900" />
              <Stat
                label="Open book"
                value={summary.openSide === 'flat' ? 'Flat' : `${summary.openSide} ${signed(summary.openPnlUsd, 0)}`}
                className={tone(summary.openPnlUsd)}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              Fees {money(summary.feesUsd)} · {data.kind === 'equity' ? 'carry' : 'funding'}{' '}
              {signed(summary.fundingUsd, 0)} · {summary.longs} long / {summary.shorts} short signals · start{' '}
              {money(summary.startEquity)}
            </p>
            <ul className="mt-3 space-y-1 text-xs text-slate-600">
              {data.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <List className="h-4 w-4 text-[#0052d9]" strokeWidth={2} />
              <h4 className="text-sm font-bold text-slate-900">Trades</h4>
            </div>
            <TradeTable trades={data.trades} />
          </div>

          <p className="text-xs text-slate-400">{data.disclaimer}</p>
        </div>
      )}
    </section>
  );
}

function equityTitle(style: (typeof US_STYLES)[number]['id']) {
  if (style === 'shares') return 'Long-only US shares';
  if (style === 'wheel') return 'Options wheel';
  return 'US equity paper contract';
}

function equityBlurb(style: (typeof US_STYLES)[number]['id']) {
  if (style === 'shares') {
    return 'Buys the stock itself when the trend breaks out, then sells on the channel or the stop. No short, no financing, no broker order.';
  }
  if (style === 'wheel') {
    return 'Sells a cash-secured put, takes the shares if assigned, then sells covered calls until the shares are called away. Premiums are a model, not a live chain.';
  }
  return 'A long/short paper contract on the same US names. Separate from shares and from the options wheel. No orders are sent.';
}

function SymbolRow({
  label,
  items,
  symbol,
  onPick,
}: {
  label: string;
  items: ContractSpec[];
  symbol: string;
  onPick: (symbol: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 w-24 shrink-0">{label}</span>
      {items.map((item) => (
        <button
          key={item.symbol}
          type="button"
          onClick={() => onPick(item.symbol)}
          title={item.label}
          className={`px-2.5 py-1 text-xs font-bold rounded-md border ${
            symbol === item.symbol
              ? 'bg-white text-[#0052d9] border-[#0052d9] shadow-sm'
              : 'bg-slate-50 text-slate-500 border-slate-200'
          }`}
        >
          {item.symbol}
        </button>
      ))}
    </div>
  );
}

function Stat({ label, value, className }: { label: string; value: string; className: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className={`text-sm font-bold ${className}`}>{value}</div>
    </div>
  );
}
