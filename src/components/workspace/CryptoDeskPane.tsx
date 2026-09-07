'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CRYPTO_ASSETS, CRYPTO_THEMES } from '@/lib/crypto-universe';

export default function CryptoDeskPane({ onLineup }: { onLineup: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="badge badge-primary mb-2">Blockchain</div>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
          On-chain board, same isolated desk
        </h2>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl">
          Settlement, L1 usage, and policy — not a cash-flow multiple unless a business sits
          underneath. Line up masters to screen this board. No buy button.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={onLineup} className="btn-primary text-sm">
            Line up masters on crypto
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <Link href="/research/crypto" className="btn-secondary text-sm">
            Full crypto research
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {CRYPTO_THEMES.map((t) => (
          <div key={t.id} className="rounded-xl border border-slate-100 p-4">
            <div className="text-sm font-semibold text-slate-900">{t.title}</div>
            <div className="text-xs text-slate-400 mt-1">Strength {t.strength}/10</div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <th className="py-3 px-4">Asset</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Research note</th>
              <th className="py-3 px-4" />
            </tr>
          </thead>
          <tbody>
            {CRYPTO_ASSETS.map((a) => (
              <tr key={a.symbol} className="border-b border-slate-50 last:border-0">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{a.symbol}</div>
                  <div className="text-xs text-slate-500">{a.name}</div>
                </td>
                <td className="py-3 px-4 capitalize text-slate-600">{a.category}</td>
                <td className="py-3 px-4 text-slate-600 text-xs leading-relaxed">{a.thesis}</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <Link
                    href={`/crypto/${a.symbol.toLowerCase()}`}
                    className="text-xs font-semibold text-[#0052d9] hover:underline"
                  >
                    Briefs →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
