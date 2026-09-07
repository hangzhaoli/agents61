'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { MASTERS, PIPELINE_STEPS } from '@/lib/masters';
import MasterAvatar from '@/components/masters/MasterAvatar';
import { readDeskSession } from '@/lib/demo-session';
import { resolveCryptoSymbol } from '@/lib/crypto-universe';

const EXAMPLES = ['AAPL', 'NVDA', 'MSFT', 'BRK-B', 'KO', 'QQQ'];
const CRYPTO_EXAMPLES = ['BTC', 'ETH', 'SOL'];

function pathForSymbol(raw: string): string {
  const crypto = resolveCryptoSymbol(raw);
  if (crypto) return `/crypto/${crypto.toLowerCase()}`;
  return `/stocks/${encodeURIComponent(raw.trim().toLowerCase())}`;
}

function goToSymbol(
  router: ReturnType<typeof useRouter>,
  raw: string
) {
  const dest = pathForSymbol(raw);
  if (readDeskSession()) {
    router.push(dest);
    return;
  }
  router.push(`/register?next=${encodeURIComponent(dest)}`);
}

export default function HeroBanner() {
  const router = useRouter();
  const [ticker, setTicker] = useState('');
  const [hovered, setHovered] = useState<string | null>(null);

  const hoveredMaster = useMemo(
    () => MASTERS.find((m) => m.slug === hovered) ?? null,
    [hovered]
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const symbol = ticker.trim().toUpperCase();
    if (!symbol) return;
    goToSymbol(router, symbol);
  }

  return (
    <div className="chrome-frame max-w-5xl mx-auto">
      <div className="chrome-frame-inner p-5 md:p-8">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 text-[11px] font-medium tracking-wide text-slate-400 uppercase">
              61-Legend Committee Desk
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
            <Sparkles className="h-3 w-3 text-[#0052d9]" />
            Live pipeline · 16 / 29 / 48 / 61 seats
          </span>
        </div>

        <form onSubmit={submit} className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="US ticker or crypto — AAPL, NVDA, BTC"
            className="w-full h-14 pl-11 pr-36 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] focus:outline-none focus:ring-2 focus:ring-[#0052d9]/30 focus:border-[#0052d9]"
            aria-label="Ticker or crypto symbol"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !py-2.5 !px-4 text-sm"
          >
            Convene
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-slate-400">Try</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => {
                setTicker(ex);
                goToSymbol(router, ex);
              }}
              className="px-2.5 py-1 rounded-md text-xs font-semibold text-[#0052d9] bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              {ex}
            </button>
          ))}
          <span className="text-xs text-slate-300 hidden sm:inline">·</span>
          <span className="text-xs text-slate-400">Crypto</span>
          {CRYPTO_EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => {
                setTicker(ex);
                goToSymbol(router, ex);
              }}
              className="px-2.5 py-1 rounded-md text-xs font-semibold text-[#0052d9] bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
          {PIPELINE_STEPS.map((step) => (
            <div
              key={step.step}
              className="rounded-lg border border-slate-100 bg-slate-50/80 px-2 py-2 text-center hover:bg-blue-50/80 hover:border-blue-100 transition-colors"
            >
              <div className="text-[10px] font-semibold text-[#0052d9]">Step {step.step}</div>
              <div className="text-[11px] font-medium text-slate-700 leading-tight mt-0.5">
                {step.label}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{step.count} seats</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-slate-500">
            {hoveredMaster
              ? `${hoveredMaster.nameEn} · ${hoveredMaster.role}`
              : 'Hover an avatar to see each legend’s seat in the pipeline'}
          </p>
          <Link href="/masters" className="text-xs font-semibold text-[#0052d9] hover:underline">
            All 61 legends →
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5">
          {MASTERS.map((m) => (
            <Link
              key={m.slug}
              href={`/masters/${m.slug}`}
              onMouseEnter={() => setHovered(m.slug)}
              onMouseLeave={() => setHovered(null)}
              className={`relative rounded-full transition-transform duration-200 ${
                hovered === m.slug ? 'z-10 scale-125' : 'hover:scale-110'
              }`}
              title={`${m.nameEn} · ${m.role}`}
            >
              <MasterAvatar master={m} size="xs" />
              <span className="sr-only">{m.nameEn}</span>
              <span
                className="absolute inset-0 rounded-full ring-1 ring-white/80"
                style={{ boxShadow: `0 0 0 1px ${m.avatarColor}33` }}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
