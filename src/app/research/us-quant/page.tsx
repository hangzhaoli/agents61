import ContractStrategyDesk from '@/components/crypto/ContractStrategyDesk';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { pageMeta } from '@/lib/seo/meta';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMeta({
  title: 'US quant — paper equity contracts',
  description:
    'Agents61 US quant book: paper long/short contracts on SPY, QQQ, and US single names. Backtest and trade tape. Not live trading.',
  path: '/research/us-quant',
});

export default function UsQuantPage() {
  return (
    <>
      <Navbar />
      <div className="section-container py-16">
        <div className="max-w-3xl mb-8">
          <div className="badge badge-primary mb-4">US quant</div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            A paper book for US equity contracts
          </h1>
          <p className="text-lg text-slate-600">
            This module is separate from the blockchain desk. Pick a contract, the stock itself, or
            an options wheel. Each book writes its own backtest and trade tape. No broker, no
            orders, no buy button.
          </p>
        </div>
        <ContractStrategyDesk book="equity" />
        <div className="mt-10">
          <Link href="/dashboard?entry=us-quant" className="btn-primary">
            Open it on the desk
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
