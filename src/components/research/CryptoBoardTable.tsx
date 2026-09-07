import Link from 'next/link';
import { Bitcoin, Coins, TrendingDown, TrendingUp } from 'lucide-react';
import MiniSpark from '@/components/landing/MiniSpark';
import { changeTone, formatChangePct, formatPrice } from '@/lib/data/desk-quotes';
import type { CryptoSnapshot } from '@/lib/data/crypto';

const ICON: Record<string, typeof Bitcoin> = {
  BTC: Bitcoin,
  ETH: Coins,
};

function CryptoIcon({ symbol }: { symbol: string }) {
  const Icon = ICON[symbol] ?? Coins;
  return (
    <span className="crypto-asset-icon">
      <Icon className="h-4 w-4" strokeWidth={2} />
    </span>
  );
}

function strengthBar(strength: number) {
  return (
    <div className="crypto-strength-bar" aria-hidden>
      <div className="crypto-strength-fill" style={{ width: `${Math.min(10, strength) * 10}%` }} />
    </div>
  );
}

function priceUsd(n: number | null): string {
  if (n == null) return '—';
  if (n >= 1000) return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  return formatPrice(n);
}

export default function CryptoBoardTable({
  assets,
  bySymbol,
}: {
  assets: Array<{ symbol: string; name: string; category: string }>;
  bySymbol: Map<string, CryptoSnapshot>;
}) {
  return (
    <div className="overflow-x-auto card mb-12">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-400">
            <th className="py-3 px-4">Asset</th>
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4">Cached price</th>
            <th className="py-3 px-4">Cached mkt cap</th>
            <th className="py-3 px-4">7d</th>
            <th className="py-3 px-4 hidden md:table-cell">Trend</th>
            <th className="py-3 px-4">Research</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((a) => {
            const snap = bySymbol.get(a.symbol);
            const d7 = snap?.change7d ?? null;
            const tone = changeTone(d7);
            const ToneIcon = tone === 'up' ? TrendingUp : tone === 'down' ? TrendingDown : Coins;
            return (
              <tr key={a.symbol} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <CryptoIcon symbol={a.symbol} />
                    <div>
                      <div className="font-bold text-slate-900">{a.symbol}</div>
                      <div className="text-xs text-slate-500">{a.name}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 capitalize text-slate-600">{a.category}</td>
                <td className="py-3 px-4 tabular-nums font-semibold text-slate-900">
                  {priceUsd(snap?.priceUsd ?? null)}
                </td>
                <td className="py-3 px-4 tabular-nums text-slate-600">
                  {snap?.marketCap == null
                    ? '—'
                    : snap.marketCap >= 1e12
                      ? `$${(snap.marketCap / 1e12).toFixed(2)}T`
                      : snap.marketCap >= 1e9
                        ? `$${(snap.marketCap / 1e9).toFixed(1)}B`
                        : `$${(snap.marketCap / 1e6).toFixed(0)}M`}
                </td>
                <td
                  className={`py-3 px-4 tabular-nums font-semibold ${
                    tone === 'up' ? 'text-emerald-600' : tone === 'down' ? 'text-red-600' : 'text-slate-500'
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    <ToneIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                    {formatChangePct(d7)}
                  </span>
                </td>
                <td className="py-3 px-4 hidden md:table-cell">
                  <MiniSpark seed={a.symbol} tone={tone} className="w-[72px] h-6" />
                </td>
                <td className="py-3 px-4">
                  <Link
                    href={`/crypto/${a.symbol.toLowerCase()}`}
                    className="font-semibold text-[#0052d9] hover:underline"
                  >
                    Open briefs →
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export { strengthBar };
