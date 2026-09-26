import ContractStrategyDesk from '@/components/crypto/ContractStrategyDesk';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import MarketTape from '@/components/landing/MarketTape';
import CryptoBoardTable, { strengthBar } from '@/components/research/CryptoBoardTable';
import { CRYPTO_ASSETS, CRYPTO_THEMES } from '@/lib/crypto-universe';
import { ONCHAIN_HOOKS } from '@/lib/data/onchain';
import { getCryptoMarkets } from '@/lib/data/crypto';
import { pageMeta, PAGE_DESCRIPTIONS } from '@/lib/seo/meta';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMeta({
  title: 'Blockchain and on-chain asset analysis',
  description: PAGE_DESCRIPTIONS.crypto,
  path: '/research/crypto',
});

export default async function CryptoResearchPage() {
  const markets = await getCryptoMarkets();
  const bySymbol = new Map(markets.map((m) => [m.symbol, m]));

  return (
    <>
      <Navbar />
      <MarketTape />
      <div className="section-container py-16">
        <div className="max-w-3xl mb-12">
          <div className="badge badge-primary mb-4">Blockchain research</div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            On-chain subjects, same isolated desk
          </h1>
          <p className="text-lg text-slate-600">
            Crypto subscriptions do not turn Agents61 into a trading venue. This module is
            research: usage, settlement, policy, and cycle overlay. P/E and P/B are not forced
            onto tokens with no earnings. The contract module below is a paper perpetual: one
            backtest, and the trades that backtest produced. There is no buy button.
          </p>
        </div>

        <ContractStrategyDesk book="crypto" />

        <h2 className="text-xl font-bold text-slate-900 mt-12 mb-4">This week’s crypto map</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
          {CRYPTO_THEMES.map((t) => (
            <div key={t.id} className="crypto-theme-card">
              <div className="text-sm font-semibold text-slate-900">{t.title}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-500">Strength {t.strength}/10</span>
                {strengthBar(t.strength)}
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {t.industries.map((i) => (
                  <span key={i} className="badge badge-neutral text-[10px]">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-4">Assets on the board</h2>
        <CryptoBoardTable assets={CRYPTO_ASSETS} bySymbol={bySymbol} />
        <p className="text-xs text-slate-400 -mt-8 mb-12">
          Market-cap column is a public API snapshot (CoinGecko), cached, not a live quote.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mb-3">Data APIs you can plug in later</h2>
        <p className="text-sm text-slate-600 mb-4">
          Hooks are stubbed so a licensed on-chain feed can land without rewriting the desk.
          Unconfigured series stay blank — we do not invent MVRV or TVL.
        </p>
        <ul className="space-y-2 mb-10">
          {ONCHAIN_HOOKS.map((h) => (
            <li key={h.id} className="rounded-xl border border-slate-100 p-4">
              <div className="text-sm font-semibold text-slate-900">
                {h.provider} · {h.metric}
              </div>
              <div className="text-xs text-slate-500 mt-1">{h.note}</div>
            </li>
          ))}
        </ul>

        <Link href="/dashboard?entry=analyze" className="btn-primary">
          Ask the desk about BTC or ETH
        </Link>
      </div>
      <Footer />
    </>
  );
}
