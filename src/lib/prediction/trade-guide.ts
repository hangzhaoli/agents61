/**
 * Plain-language trade guidance for Prediction Desk.
 * Research simulation for self-directed execution — not investment advice.
 */

import type { GapRow } from './gaps';
import type { Confidence, PredictionMarket } from './types';
import { confidenceScore, daysUntilEnd, formatConfidencePlain, gapPlain } from './types';
import type { DeskSide } from './paper-desk';

export type GuideAction = 'lean_yes' | 'lean_no' | 'watch' | 'skip';

export type SizeBand = 'skip' | 'probe' | 'standard' | 'trim';

export type ChainCheck = {
  id: string;
  label: string;
  ok: boolean | null;
  hint: string;
};

export type TradeGuide = {
  action: GuideAction;
  side: DeskSide | null;
  headline: string;
  why: string;
  sizeBand: SizeBand;
  sizeHint: string;
  holdHint: string;
  confidenceLabel: string;
  marketOdds: number;
  ourOdds: number;
  gap: number;
  daysLeft: number | null;
  doList: string[];
  dontList: string[];
  chainChecks: ChainCheck[];
  canSuggestLive: boolean;
};

function sizeFor(confidence: Confidence, absGap: number): { band: SizeBand; hint: string } {
  if (absGap < 3) {
    return { band: 'skip', hint: '差距太小，先别下；继续观察或换盘。' };
  }
  if (confidence === 'Low' || absGap < 6) {
    return { band: 'probe', hint: '试探仓：名义大约总资金的 2%–5%（示例 $25–$50）。' };
  }
  if (confidence === 'High' && absGap >= 12) {
    return { band: 'standard', hint: '标准仓：名义大约总资金的 5%–10%（示例 $50–$100）。仍要自己设上限。' };
  }
  return { band: 'trim', hint: '偏谨慎标准仓：名义大约总资金的 3%–7%（示例 $30–$70）。' };
}

export function buildTradeGuide(opts: {
  row: GapRow;
  stakeUsd?: number;
  /** Live wallet readiness (optional) */
  chain?: {
    connected: boolean;
    onPolygon: boolean;
    usdc: number | null;
    clobBal: number | null;
    clobAllow: number | null;
  };
}): TradeGuide {
  const { row, stakeUsd = 100, chain } = opts;
  const market = row.market;
  const gap = row.gap;
  const absGap = Math.abs(gap);
  const conf = formatConfidencePlain(row.confidence);
  const daysLeft = daysUntilEnd(market.endDate);
  const hasClob = Boolean(market.clobTokenIds?.[0] && market.clobTokenIds?.[1]);
  const { band, hint: sizeHint } = sizeFor(row.confidence, absGap);

  let action: GuideAction = 'watch';
  let side: DeskSide | null = null;
  if (absGap >= 3 && row.confidence !== 'Low') {
    action = gap > 0 ? 'lean_yes' : 'lean_no';
    side = gap > 0 ? 'YES' : 'NO';
  } else if (absGap >= 6) {
    action = gap > 0 ? 'lean_yes' : 'lean_no';
    side = gap > 0 ? 'YES' : 'NO';
  } else if (absGap < 3) {
    action = 'skip';
  }

  // Extreme mid → skip guidance for new risk
  if (market.marketProbability < 10 || market.marketProbability > 90) {
    action = 'skip';
    side = null;
  }

  const headline =
    action === 'lean_yes'
      ? `偏 YES：我们的胜算 ${row.agents61Probability}% > 市场 ${market.marketProbability}%`
      : action === 'lean_no'
        ? `偏 NO：我们的胜算 ${row.agents61Probability}% < 市场 ${market.marketProbability}%`
        : action === 'skip'
          ? '建议观望：信号不够或盘口太极端'
          : '先看不急做：等确信度或差距更清楚';

  const why = `${gapPlain(gap)}。${conf.detail}`;

  const holdHint =
    daysLeft == null
      ? '到期日不明，持有期难估，优先核对结算规则。'
      : daysLeft <= 0
        ? '已到/过结算窗口，别新开；只适合核对结算。'
        : daysLeft <= 3
          ? `预计持有约 ${daysLeft} 天内看结算（短窗口）。`
          : daysLeft <= 7
            ? `预计持有约 ${daysLeft} 天；比 1–3 天窗口更久，仓位宜更小。`
            : `距结算约 ${daysLeft} 天，偏长仓；短线策略不优先。`;

  const doList: string[] = [
    `核对结算文案是否和问题字面一致（Polymarket 规则页）。`,
    `纸面先记一笔，再考虑 Live；名义参考约 $${stakeUsd}。`,
    side
      ? `若执行：买 ${side}（CLOB BUY ${side} token）。`
      : '差距不足时不要强迫方向。',
  ];
  if (daysLeft != null && daysLeft >= 1 && daysLeft <= 3) {
    doList.push('当前落在 1–3 天窗口，适合本桌默认短持有节奏。');
  }

  const dontList: string[] = [
    '不要把「胜算」当成「今天必赚」。',
    '不要在确信度低时加重仓。',
    '不要跳过 Polygon / USDC / 授权检查直接 Live。',
  ];
  if (!hasClob) dontList.push('此盘缺少 CLOB token，Live 下不了，只能纸面或去 Polymarket 网页。');
  if (market.volumeUsd < 50_000) dontList.push('成交量偏薄，滑点可能很大。');

  const chainChecks: ChainCheck[] = [
    {
      id: 'wallet',
      label: '钱包已连接',
      ok: chain ? chain.connected : null,
      hint: 'MetaMask 等 EOA，签名下单用。',
    },
    {
      id: 'polygon',
      label: '网络 = Polygon (137)',
      ok: chain ? chain.onPolygon : null,
      hint: 'Polymarket CLOB 在 Polygon 上结算。',
    },
    {
      id: 'usdc',
      label: '钱包有 USDC.e',
      ok: chain?.usdc != null ? chain.usdc >= Math.min(stakeUsd, 10) : null,
      hint: '抵押用 bridged USDC.e，不是随便一条链的 USDT。',
    },
    {
      id: 'clob',
      label: 'CLOB 抵押/授权够用',
      ok:
        chain?.clobBal != null && chain?.clobAllow != null
          ? chain.clobBal >= Math.min(stakeUsd, 10) && chain.clobAllow > 0
          : null,
      hint: '不够时先到 polymarket.com 入金并授权。',
    },
    {
      id: 'tokens',
      label: '本盘有 CLOB token',
      ok: hasClob,
      hint: hasClob ? '可路由 Live FAK 买单。' : 'Gamma 未提供 token id。',
    },
  ];

  const canSuggestLive =
    action !== 'skip' &&
    action !== 'watch' &&
    hasClob &&
    band !== 'skip' &&
    (chain
      ? chain.connected &&
        chain.onPolygon &&
        (chain.usdc == null || chain.usdc >= 1) &&
        (chain.clobBal == null || chain.clobBal >= 1)
      : true);

  return {
    action,
    side,
    headline,
    why,
    sizeBand: action === 'skip' ? 'skip' : band,
    sizeHint: action === 'skip' ? '本次不建议开仓。' : sizeHint,
    holdHint,
    confidenceLabel: conf.short,
    marketOdds: market.marketProbability,
    ourOdds: row.agents61Probability,
    gap,
    daysLeft,
    doList,
    dontList,
    chainChecks,
    canSuggestLive,
  };
}

export function topGuideRows(rows: GapRow[], limit = 3): GapRow[] {
  return [...rows]
    .filter((r) => Math.abs(r.gap) >= 3)
    .filter((r) => r.market.marketProbability >= 10 && r.market.marketProbability <= 90)
    .sort((a, b) => {
      const score = (r: GapRow) =>
        Math.abs(r.gap) * 2 + confidenceScore(r.confidence) / 20;
      return score(b) - score(a);
    })
    .slice(0, limit);
}

export function marketToGuideRow(
  market: PredictionMarket,
  agents61: number,
  gap: number,
  confidence: Confidence
): GapRow {
  return {
    market,
    agents61Probability: agents61,
    gap,
    confidence,
    volumeUsd: market.volumeUsd,
    endDate: market.endDate,
  };
}
