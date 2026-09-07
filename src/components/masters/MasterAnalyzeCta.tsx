'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Search } from 'lucide-react';
import type { PlanId } from '@/lib/tiers';
import { readDeskSession } from '@/lib/demo-session';

export default function MasterAnalyzeCta({
  name,
  plan,
}: {
  name: string;
  plan: PlanId;
}) {
  const router = useRouter();
  const [ticker, setTicker] = useState('');

  function submit(e: FormEvent) {
    e.preventDefault();
    const symbol = ticker.trim().toUpperCase();
    if (!symbol) return;
    const dest = `/stocks/${encodeURIComponent(symbol.toLowerCase())}?plan=${plan}`;
    if (readDeskSession()) {
      router.push(dest);
      return;
    }
    router.push(`/register?next=${encodeURIComponent(dest)}`);
  }

  return (
    <div className="mt-10 pt-8 border-t border-slate-100">
      <h3 className="text-lg font-bold text-slate-900 mb-2">
        Run {name} on a ticker
      </h3>
      <p className="text-sm text-slate-600 mb-4">
        Opens a committee report at the lowest plan that includes this seat. {name} still
        writes an isolated brief — they do not see the other drafts.
      </p>
      <form onSubmit={submit} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="US ticker — AAPL, NVDA, BRK-B"
          className="w-full h-14 pl-11 pr-36 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0052d9]/30"
          aria-label="Stock ticker"
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !py-2.5 !px-4 text-sm">
          Analyze
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}
