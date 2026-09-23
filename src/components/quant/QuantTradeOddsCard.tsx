'use client';

import type { TradeOdds } from '@/lib/quant-lab/types';

const VERDICT_EN: Record<TradeOdds['verdict'], string> = {
  lean_long: 'Paper long ok',
  watch: 'Watch first',
  skip: 'Skip this setup',
};

export default function QuantTradeOddsCard({ odds }: { odds: TradeOdds }) {
  const tone =
    odds.verdict === 'lean_long'
      ? 'border-emerald-200 bg-emerald-50/50'
      : odds.verdict === 'skip'
        ? 'border-slate-200 bg-slate-50'
        : 'border-amber-200 bg-amber-50/40';

  return (
    <div className={`rounded-2xl border p-4 md:p-5 mb-4 ${tone}`}>
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#0052d9]">
            {odds.assetClass === 'crypto'
              ? 'Crypto quant · trade-selection odds'
              : 'Quant Lab · trade-selection odds'}
          </p>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">{odds.plainHeadline}</h3>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
          {VERDICT_EN[odds.verdict]}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center mb-3">
        <div className="rounded-xl bg-white border border-slate-100 px-2 py-2.5">
          <p className="text-[10px] text-slate-400">Win probability</p>
          <p className="text-2xl font-extrabold tabular-nums text-[#0052d9]">{odds.nextTradeWinProbPct}%</p>
          <p className="text-[10px] text-slate-400">Next-trade estimate</p>
        </div>
        <div className="rounded-xl bg-white border border-slate-100 px-2 py-2.5">
          <p className="text-[10px] text-slate-400">Confidence</p>
          <p className="text-2xl font-extrabold tabular-nums text-amber-900">{odds.confidencePct}%</p>
          <p className="text-[10px] text-slate-400">How sure we are</p>
        </div>
        <div className="rounded-xl bg-white border border-slate-100 px-2 py-2.5">
          <p className="text-[10px] text-slate-400">Historical win rate</p>
          <p className="text-2xl font-extrabold tabular-nums text-slate-900">{odds.historicalWinRatePct}%</p>
          <p className="text-[10px] text-slate-400">~{odds.sampleTrades} sample trades</p>
        </div>
        <div className="rounded-xl bg-white border border-slate-100 px-2 py-2.5">
          <p className="text-[10px] text-slate-400">Select score</p>
          <p className="text-2xl font-extrabold tabular-nums text-cyan-800">{odds.selectScore}</p>
          <p className="text-[10px] text-slate-400">0–100 composite</p>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">{odds.plainDetail}</p>
      <p className="text-[10px] text-slate-400 mt-2">
        Win probability = historical rate shrunk toward 50% + Thorp edge adjustment
        {odds.assetClass === 'crypto' ? ' + crypto noise haircut' : ''}. For paper selection only —
        not a live contract guarantee.
      </p>
    </div>
  );
}
