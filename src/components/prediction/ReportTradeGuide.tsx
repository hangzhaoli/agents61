'use client';

import TradeGuidePanel from '@/components/prediction/TradeGuidePanel';
import { buildTradeGuide, marketToGuideRow } from '@/lib/prediction/trade-guide';
import type { PredictionMarket, StrategyReport } from '@/lib/prediction/types';

/** Client island: blockchain trade guidance from a finished strategy report. */
export default function ReportTradeGuide({
  market,
  report,
}: {
  market: PredictionMarket;
  report: StrategyReport;
}) {
  const row = marketToGuideRow(
    market,
    report.agents61Probability,
    report.probabilityGap,
    report.confidence
  );
  const guide = buildTradeGuide({ row, stakeUsd: 100 });

  return (
    <div className="mt-6">
      <TradeGuidePanel guide={guide} title="区块链交易指导" question={report.marketQuestion} />
      <p className="text-xs text-slate-500 mt-2">
        到{' '}
        <a href="/predictions/desk" className="text-[#0052d9] font-semibold hover:underline">
          交易台
        </a>{' '}
        可连 Polygon 钱包按指导纸面或 Live 执行。
      </p>
    </div>
  );
}
