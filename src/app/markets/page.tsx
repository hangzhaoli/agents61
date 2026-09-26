import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import MarketTape from '@/components/landing/MarketTape';
import DeskPulse from '@/components/landing/DeskPulse';
import TickerBoardCard from '@/components/markets/TickerBoardCard';
import { CANDIDATES } from '@/lib/opportunities';
import { POPULAR_TICKERS } from '@/lib/popular-tickers';
import { getDeskQuotes } from '@/lib/data/desk-quotes';
import { getLivePulse } from '@/lib/landing-pulse';
import { pageMeta, PAGE_DESCRIPTIONS } from '@/lib/seo/meta';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = pageMeta({
  title: 'US stocks, ETFs, crypto, and emerging-market research',
  description: PAGE_DESCRIPTIONS.markets,
  path: '/markets',
});

export default async function MarketsPage() {
  const sample = CANDIDATES.slice(0, 8);
  const symbols = [...POPULAR_TICKERS.map((t) => t.symbol), ...sample.map((c) => c.ticker)];
  const quoteMap = await getDeskQuotes(symbols);
  const { tape, cells } = await getLivePulse();

  return (
    <>
      <Navbar />
      <MarketTape items={tape} />
      <div className="section-container py-16">
        <div className="max-w-3xl mb-8">
          <div className="badge badge-primary mb-4">Markets</div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">US first. Quotes are not the product.</h1>
          <p className="text-lg text-slate-600">
            The desk researches names. Filing facts come from SEC EDGAR (cached 7 days). Cached
            prices below are model input only — not live quotes. Isolated briefs, then assembly.
            SpaceX trades as SPCX (listed June 2026) on the public equity board.
          </p>
        </div>

        <div className="mb-12">
          <DeskPulse cells={cells} />
          <p className="text-[11px] text-slate-400 mt-2">
            Board readings and ticker tiles use hourly-cached snapshots. Illustrative sparklines when no feed is available.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900">US stocks</h2>
            <p className="text-sm text-slate-600 mt-2">
              Common shares with a US ticker and, where possible, companyfacts. Open a name from
              the desk or type a ticker. Reports include P/E and P/B when the model-input cache has them.
            </p>
            <Link href="/research/us-quant" className="mt-4 inline-block text-sm font-semibold text-[#0052d9]">
              US quant book →
            </Link>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900">Blockchain / crypto</h2>
            <p className="text-sm text-slate-600 mt-2">
              On-chain subjects on the same isolated desk. No buy button. Cash-flow multiples are
              not forced onto tokens with no earnings.
            </p>
            <Link href="/research/crypto" className="mt-4 inline-block text-sm font-semibold text-[#0052d9]">
              Crypto research board →
            </Link>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900">Emerging markets</h2>
            <p className="text-sm text-slate-600 mt-2">
              US-listed ADRs and EM cash-flow names. Policy and listing structure sit beside filings.
            </p>
            <Link href="/research/emerging" className="mt-4 inline-block text-sm font-semibold text-[#0052d9]">
              EM opportunity board →
            </Link>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900">US ETFs</h2>
            <p className="text-sm text-slate-600 mt-2">
              Adjacent. Some trusts have no us-gaap companyfacts — the fact card will say so
              instead of inventing ratios. Example: QQQ.
            </p>
            <Link href="/stocks/qqq" className="mt-4 inline-block text-sm font-semibold text-[#0052d9]">
              Open QQQ report →
            </Link>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900">Private / pre-IPO</h2>
            <p className="text-sm text-slate-600 mt-2">
              Anduril, Stripe, OpenAI, and other private names. SpaceX graduated to SPCX (Nasdaq,
              June 2026). Secondary marks only on the private desk — no EDGAR, no live quote.
            </p>
            <Link href="/research/private" className="mt-4 inline-block text-sm font-semibold text-[#0052d9]">
              Private desk board →
            </Link>
          </div>
          <div id="a-shares" className="card p-6">
            <h2 className="text-lg font-bold text-slate-900">A-shares (later)</h2>
            <p className="text-sm text-slate-600 mt-2">
              Not in the launch niche. English-language US investors first. When A-shares open,
              they get their own data card and seating — they will not silently reuse US EDGAR.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-2">Popular US names on the desk</h2>
        <p className="text-sm text-slate-500 mb-4 max-w-2xl">
          Each ticker has its own committee page — unique intro, isolated briefs, EDGAR facts when they
          exist. ETFs such as QQQ and SPY are wrappers, not issuers.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-14">
          {POPULAR_TICKERS.map((t) => (
            <TickerBoardCard key={t.symbol} ticker={t} quote={quoteMap.get(t.symbol)} />
          ))}
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-4">Sample names on the desk</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sample.map((c) => {
            const ticker = POPULAR_TICKERS.find((t) => t.symbol === c.ticker);
            if (ticker) {
              return (
                <TickerBoardCard key={c.ticker} ticker={ticker} quote={quoteMap.get(c.ticker)} />
              );
            }
            return (
              <Link
                key={c.ticker}
                href={`/stocks/${c.ticker.toLowerCase()}`}
                className="market-ticker-card"
              >
                <div className="text-sm font-bold text-slate-900">{c.ticker}</div>
                <div className="text-xs text-slate-500">{c.name}</div>
                <div className="text-[11px] text-slate-400 mt-1 capitalize">{c.track} track</div>
              </Link>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
}
