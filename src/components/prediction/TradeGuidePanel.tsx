'use client';

import type { TradeGuide } from '@/lib/prediction/trade-guide';
import { formatGap } from '@/lib/prediction/types';
import { Check, CircleAlert, Minus } from 'lucide-react';

function CheckIcon({ ok }: { ok: boolean | null }) {
  if (ok === true) return <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.5} />;
  if (ok === false) return <CircleAlert className="h-3.5 w-3.5 text-amber-600" strokeWidth={2.5} />;
  return <Minus className="h-3.5 w-3.5 text-slate-300" strokeWidth={2.5} />;
}

export default function TradeGuidePanel({
  guide,
  title,
  question,
  onApplySide,
}: {
  guide: TradeGuide;
  title?: string;
  question?: string;
  onApplySide?: (side: 'YES' | 'NO') => void;
}) {
  const actionLabel =
    guide.action === 'lean_yes'
      ? '偏 YES'
      : guide.action === 'lean_no'
        ? '偏 NO'
        : guide.action === 'skip'
          ? '观望'
          : '先看';

  return (
    <section className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 md:p-6 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#0052d9]">
            {title ?? '区块链交易指导'}
          </p>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">{guide.headline}</h3>
          {question ? (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{question}</p>
          ) : null}
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
            guide.action === 'skip' || guide.action === 'watch'
              ? 'bg-slate-100 text-slate-600'
              : guide.action === 'lean_yes'
                ? 'bg-emerald-50 text-emerald-800'
                : 'bg-rose-50 text-rose-800'
          }`}
        >
          {actionLabel}
        </span>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed">{guide.why}</p>

      <div className="grid sm:grid-cols-4 gap-2 text-center">
        <div className="rounded-lg border border-slate-100 bg-white px-2 py-2">
          <p className="text-[10px] text-slate-400">市场胜算</p>
          <p className="font-extrabold tabular-nums text-slate-900">{guide.marketOdds}%</p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-white px-2 py-2">
          <p className="text-[10px] text-slate-400">我们的胜算</p>
          <p className="font-extrabold tabular-nums text-[#0052d9]">{guide.ourOdds}%</p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-white px-2 py-2">
          <p className="text-[10px] text-slate-400">差了多少</p>
          <p className="font-extrabold tabular-nums text-cyan-700">{formatGap(guide.gap)}</p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-white px-2 py-2">
          <p className="text-[10px] text-slate-400">确信度</p>
          <p className="font-extrabold tabular-nums text-amber-900">{guide.confidenceLabel}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-100 bg-white p-3">
          <p className="text-xs font-bold text-slate-900 mb-1">仓位参考</p>
          <p className="text-sm text-slate-600">{guide.sizeHint}</p>
          <p className="text-xs text-slate-500 mt-2">{guide.holdHint}</p>
          {guide.side && onApplySide ? (
            <button
              type="button"
              onClick={() => onApplySide(guide.side!)}
              className="btn-primary text-xs mt-3"
            >
              按指导选 {guide.side}
            </button>
          ) : null}
        </div>
        <div className="rounded-xl border border-slate-100 bg-white p-3">
          <p className="text-xs font-bold text-slate-900 mb-2">链上执行清单（Polygon）</p>
          <ul className="space-y-1.5">
            {guide.chainChecks.map((c) => (
              <li key={c.id} className="flex items-start gap-2 text-xs text-slate-600">
                <CheckIcon ok={c.ok} />
                <span>
                  <span className="font-semibold text-slate-800">{c.label}</span>
                  <span className="text-slate-400"> · {c.hint}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-slate-400 mt-2">
            {guide.canSuggestLive
              ? '清单大致就绪时可切 Live 签名下单。'
              : '清单未齐时先用 Paper，或到 polymarket.com 补 USDC/授权。'}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-bold text-emerald-800 mb-1">可以做</p>
          <ul className="space-y-1">
            {guide.doList.map((line) => (
              <li key={line} className="text-xs text-slate-600 pl-2 border-l-2 border-emerald-200">
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold text-rose-800 mb-1">别做</p>
          <ul className="space-y-1">
            {guide.dontList.map((line) => (
              <li key={line} className="text-xs text-slate-600 pl-2 border-l-2 border-rose-200">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 leading-relaxed">
        研究模拟指导，帮助你自己在 Polygon / Polymarket CLOB 上决策；不是代客下单，也不是稳赚承诺。
      </p>
    </section>
  );
}
