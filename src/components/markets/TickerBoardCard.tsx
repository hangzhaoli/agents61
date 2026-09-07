import Link from 'next/link';
import {
  Bitcoin,
  Building2,
  Cpu,
  Layers,
  LineChart,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import MiniSpark from '@/components/landing/MiniSpark';
import type { TickerProfile } from '@/lib/popular-tickers';
import {
  changeTone,
  formatChangePct,
  formatPrice,
  type DeskQuote,
} from '@/lib/data/desk-quotes';

function SectorIcon({ ticker }: { ticker: TickerProfile }) {
  const cls = 'h-4 w-4 text-[#0052d9]';
  if (ticker.kind === 'etf') return <Layers className={cls} strokeWidth={2} />;
  const s = ticker.sector.toLowerCase();
  if (s.includes('crypto') || ticker.symbol === 'BTC') return <Bitcoin className={cls} strokeWidth={2} />;
  if (s.includes('semiconductor') || s.includes('software') || s.includes('tech'))
    return <Cpu className={cls} strokeWidth={2} />;
  if (s.includes('bank') || s.includes('financial') || s.includes('payment'))
    return <Building2 className={cls} strokeWidth={2} />;
  if (s.includes('consumer') || s.includes('retail')) return <ShoppingBag className={cls} strokeWidth={2} />;
  return <LineChart className={cls} strokeWidth={2} />;
}

export default function TickerBoardCard({
  ticker,
  quote,
}: {
  ticker: TickerProfile;
  quote?: DeskQuote;
}) {
  const tone = changeTone(quote?.changePct ?? null);
  const ToneIcon = tone === 'up' ? TrendingUp : tone === 'down' ? TrendingDown : LineChart;

  return (
    <Link
      href={`/stocks/${ticker.symbol.toLowerCase()}`}
      className="market-ticker-card group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="market-ticker-icon">
            <SectorIcon ticker={ticker} />
          </span>
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900">{ticker.symbol}</div>
            <div className="text-[11px] text-slate-500 truncate">{ticker.name}</div>
          </div>
        </div>
        <MiniSpark seed={ticker.symbol} tone={tone} className="w-[72px] h-6 shrink-0 opacity-80 group-hover:opacity-100" />
      </div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <div className="text-base font-extrabold text-slate-900 tabular-nums leading-none">
            {formatPrice(quote?.price ?? null)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Cached · not live</div>
        </div>
        <div
          className={`inline-flex items-center gap-0.5 text-xs font-bold tabular-nums ${
            tone === 'up' ? 'text-emerald-600' : tone === 'down' ? 'text-red-600' : 'text-slate-500'
          }`}
        >
          <ToneIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
          {formatChangePct(quote?.changePct ?? null)}
        </div>
      </div>
      <div className="text-[11px] text-slate-400 mt-2 line-clamp-1">
        {ticker.kind === 'etf' ? 'ETF' : ticker.sector}
      </div>
    </Link>
  );
}
