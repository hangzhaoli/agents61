'use client';

import Link from 'next/link';
import ContractStrategyDesk from '@/components/crypto/ContractStrategyDesk';

export default function UsQuantPane() {
  return (
    <div className="space-y-6">
      <div>
        <div className="badge badge-primary mb-2">US quant</div>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
          Equity contracts, separate from the chain desk
        </h2>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl">
          Three paper books: the contract, the shares themselves, and an options wheel. Each one
          writes the backtest and the trade tape. This is not the blockchain module, and it does
          not send orders.
        </p>
        <div className="mt-4">
          <Link href="/research/us-quant" className="btn-secondary text-sm">
            Open the US quant page
          </Link>
        </div>
      </div>
      <ContractStrategyDesk book="equity" />
    </div>
  );
}
