'use client';

import type { TradeOdds } from '@/lib/quant-lab/types';

const VERDICT_CN: Record<TradeOdds['verdict'], string> = {
  lean_long: '可试探',
  watch: '先观察',
  skip: '建议跳过',
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
            {odds.assetClass === 'crypto' ? '区块链量化 · 综合选单胜率' : 'Quant Lab · 综合选单胜率'}
          </p>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">{odds.plainHeadline}</h3>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
          {VERDICT_CN[odds.verdict]}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center mb-3">
        <div className="rounded-xl bg-white border border-slate-100 px-2 py-2.5">
          <p className="text-[10px] text-slate-400">综合胜率</p>
          <p className="text-2xl font-extrabold tabular-nums text-[#0052d9]">{odds.nextTradeWinProbPct}%</p>
          <p className="text-[10px] text-slate-400">下一笔估计</p>
        </div>
        <div className="rounded-xl bg-white border border-slate-100 px-2 py-2.5">
          <p className="text-[10px] text-slate-400">确信度</p>
          <p className="text-2xl font-extrabold tabular-nums text-amber-900">{odds.confidencePct}%</p>
          <p className="text-[10px] text-slate-400">对胜率有多有把握</p>
        </div>
        <div className="rounded-xl bg-white border border-slate-100 px-2 py-2.5">
          <p className="text-[10px] text-slate-400">历史规则胜率</p>
          <p className="text-2xl font-extrabold tabular-nums text-slate-900">{odds.historicalWinRatePct}%</p>
          <p className="text-[10px] text-slate-400">~{odds.sampleTrades} 笔样本</p>
        </div>
        <div className="rounded-xl bg-white border border-slate-100 px-2 py-2.5">
          <p className="text-[10px] text-slate-400">选单分</p>
          <p className="text-2xl font-extrabold tabular-nums text-cyan-800">{odds.selectScore}</p>
          <p className="text-[10px] text-slate-400">0–100 综合</p>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">{odds.plainDetail}</p>
      <p className="text-[10px] text-slate-400 mt-2">
        综合胜率 = 历史胜率向 50% 收缩 + Thorp 边修正
        {odds.assetClass === 'crypto' ? ' + 加密噪声折扣' : ''}
        。用于纸面选单，不是合约实盘保证。
      </p>
    </div>
  );
}
