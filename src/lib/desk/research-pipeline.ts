/**
 * Pre-persona research prep (ai-hedge-fund spirit): fundamentals / sentiment / valuation
 * layers run BEFORE isolated seat briefs. Output is FACTS/CONTEXT only — never a buy score.
 */

import type { Fundamentals } from '@/lib/data/fundamentals';
import type { NewsDigest } from '@/lib/llm/news-scan';

export type ResearchPrep = {
  fundamentals: {
    summary: string;
    highlights: string[];
  };
  sentiment: {
    summary: string;
    tone: 'constructive' | 'cautious' | 'skeptical' | 'unknown';
    highlights: string[];
  };
  valuation: {
    summary: string;
    highlights: string[];
  };
  /** Combined block for brief user messages. */
  contextBlock: string;
};

function money(n: number | null): string | null {
  if (n == null || Number.isNaN(n)) return null;
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  return `${sign}$${abs.toFixed(0)}`;
}

function pct(n: number | null): string | null {
  if (n == null || Number.isNaN(n)) return null;
  return `${(n * 100).toFixed(1)}%`;
}

export type TickerFactsInput = {
  fundamentals: Fundamentals;
  news?: NewsDigest | null;
  /** Optional free-text desk notes. */
  notes?: string;
};

/**
 * Heuristic prep from desk FACTS (+ optional news / FMP-backed ratios already on Fundamentals).
 * Does not emit composite ratings or trade instructions.
 */
export function runResearchPrep(input: TickerFactsInput): ResearchPrep {
  const f = input.fundamentals;
  const netMargin =
    f.netMargin ??
    (f.netIncome != null && f.revenue != null && f.revenue !== 0 ? f.netIncome / f.revenue : null);
  const earningsYieldProxy = f.pe != null && f.pe > 0 ? 1 / f.pe : null;
  const pegProxy =
    f.pe != null && f.pe > 0 && f.revenueYoY != null && f.revenueYoY > 0.01
      ? f.pe / (f.revenueYoY * 100)
      : null;

  const fundHighlights = [
    f.entityName && `Entity: ${f.entityName}`,
    f.form && f.fiscalYear
      ? `Filing: ${f.form}${f.fiscalPeriod ? ` ${f.fiscalPeriod}` : ''} FY${f.fiscalYear}${
          f.periodKind === 'interim' ? ' interim' : ''
        }`
      : null,
    f.periodEnd ? `Period end: ${f.periodEnd}` : null,
    f.revenue != null ? `Revenue: ${money(f.revenue)}` : null,
    f.revenueYoY != null ? `Revenue YoY: ${pct(f.revenueYoY)}` : null,
    f.revenueCagrApprox != null
      ? `Revenue CAGR~ (multi-year approx): ${pct(f.revenueCagrApprox)} — annual EDGAR points only`
      : null,
    f.netIncome != null ? `Net income: ${money(f.netIncome)}` : null,
    netMargin != null ? `Net margin (NI/rev): ${pct(netMargin)} — single period` : null,
    f.epsDiluted != null ? `Diluted EPS: ${f.epsDiluted.toFixed(2)}` : null,
    f.epsYoY != null ? `Diluted EPS YoY: ${pct(f.epsYoY)}` : null,
    f.operatingCashFlow != null
      ? `Operating cash flow: ${money(f.operatingCashFlow)} — FCF-like input, not free cash after maintenance`
      : 'Operating cash flow / FCF: not on file',
    f.roe != null ? `ROE: ${pct(f.roe)}` : null,
    f.roe != null ? `ROIC: not on file — ROE ${pct(f.roe)} is a rough proxy only` : 'ROIC: not on file',
    f.debtToEquity != null ? `LT debt/equity: ${f.debtToEquity.toFixed(2)}` : null,
    f.longTermDebt != null ? `LT debt: ${money(f.longTermDebt)}` : null,
    f.equity != null ? `Equity: ${money(f.equity)}` : null,
    f.assets != null ? `Assets: ${money(f.assets)}` : null,
    f.fmpInternalReady ? 'Ratio source: cached FMP profile (model input, not a live display quote)' : null,
    f.ratiosNote ? `Ratios note: ${f.ratiosNote}` : null,
    f.error && `Gap: ${f.error}`,
  ].filter(Boolean) as string[];

  const fundamentals = {
    summary:
      fundHighlights.length > 0
        ? 'Filing-backed fundamentals on this run (EDGAR multi-year when tagged + optional FMP ratios).'
        : 'Fundamentals thin — seats must not invent numbers.',
    highlights: fundHighlights.length ? fundHighlights : ['No filing facts on this run.'],
  };

  // Sentiment: stub/heuristic from news + growth / margin print — not a score to trade on
  const news = input.news;
  const sentimentHighlights: string[] = [];
  let tone: ResearchPrep['sentiment']['tone'] = 'unknown';

  if (news?.bullets?.length) {
    const heads = news.bullets.slice(0, 4).map((b) => b.trim()).filter(Boolean);
    sentimentHighlights.push(...heads.map((h) => `News layer (unverified): ${h}`));
    const blob = heads.join(' ').toLowerCase();
    if (/\b(fraud|probe|downgrade|plunge|default|lawsuit|restatement)\b/.test(blob)) tone = 'skeptical';
    else if (/\b(beat|surge|upgrade|record|win)\b/.test(blob)) tone = 'constructive';
    else tone = 'cautious';
  } else if (f.revenueYoY != null || f.epsYoY != null || f.revenueCagrApprox != null) {
    const growth = f.revenueYoY ?? f.epsYoY ?? f.revenueCagrApprox;
    if (growth != null && growth > 0.12 && (netMargin == null || netMargin > -0.02)) {
      tone = 'constructive';
      sentimentHighlights.push(
        `Heuristic from growth/margin print only: growth proxy ${pct(growth)}${
          netMargin != null ? `, NI/rev ${pct(netMargin)}` : ''
        }.`
      );
    } else if (
      (growth != null && growth < -0.05) ||
      (netMargin != null && netMargin < -0.05)
    ) {
      tone = 'skeptical';
      sentimentHighlights.push(
        `Heuristic from growth/margin print only: growth proxy ${growth != null ? pct(growth) : 'n/a'}${
          netMargin != null ? `, NI/rev ${pct(netMargin)}` : ''
        }.`
      );
    } else {
      tone = 'cautious';
      sentimentHighlights.push('No news layer — neutral growth/margin heuristic.');
    }
  } else {
    sentimentHighlights.push('No news layer and no growth print — sentiment unknown.');
  }

  if (f.debtToEquity != null && f.debtToEquity > 2) {
    sentimentHighlights.push(
      `Leverage flag (heuristic): LT debt/equity ${f.debtToEquity.toFixed(2)} — funding sensitivity for seats.`
    );
  }

  if (f.operatingCashFlow != null && f.netIncome != null && f.netIncome > 0 && f.operatingCashFlow < 0) {
    sentimentHighlights.push(
      'Forensic flag (heuristic): OCF negative while NI positive — cash-vs-accrual homework for seats.'
    );
  }

  if (input.notes?.trim()) {
    sentimentHighlights.push(`Desk notes: ${input.notes.trim().slice(0, 240)}`);
  }

  const sentiment = {
    summary: `Sentiment layer is heuristic/stub for orchestration — tone=${tone}. Not a rating.`,
    tone,
    highlights: sentimentHighlights,
  };

  const valHighlights = [
    f.pe != null ? `P/E ${f.pe.toFixed(1)} (cached)` : f.peNm ? 'P/E n/m' : 'P/E not on file',
    earningsYieldProxy != null
      ? `Earnings-yield proxy ~${pct(earningsYieldProxy)} (1÷P/E — not EBIT/EV; Magic Formula leg sketch)`
      : null,
    pegProxy != null
      ? `PEG heuristic ~${pegProxy.toFixed(1)} (P/E ÷ rev YoY% — not forward PEG; CANSLIM/GARP sketch)`
      : 'PEG heuristic not on file (need P/E + positive rev YoY)',
    f.pb != null ? `P/B ${f.pb.toFixed(2)} (cached)` : 'P/B not on file',
    f.ps != null ? `P/S ${f.ps.toFixed(2)} (cached)` : 'P/S not on file',
    f.price != null ? `Price $${f.price.toFixed(2)} (cached, not live)` : 'Price not on file',
    f.marketCap != null ? `Est. mkt cap ${money(f.marketCap)}` : null,
    f.roe != null && f.pb != null
      ? `Quality×price sketch: ROE ${pct(f.roe)} at P/B ${f.pb.toFixed(2)} — screen only`
      : null,
    f.roe != null && earningsYieldProxy != null
      ? `Magic Formula sketch: ROE ${pct(f.roe)} + EY~ ${pct(earningsYieldProxy)} — not a ranked score`
      : null,
  ].filter(Boolean) as string[];

  const valuation = {
    summary:
      'Valuation layer lists multiples and crude Magic Formula / PEG / CANSLIM-adjacent proxies on file only. No target price, no composite “buy score”.',
    highlights: valHighlights,
  };

  const contextBlock = [
    'RESEARCH PREP (pre-persona — shared FACTS/CONTEXT, not a committee score):',
    `FUNDAMENTALS: ${fundamentals.summary}`,
    ...fundamentals.highlights.map((h) => `  - ${h}`),
    `SENTIMENT: ${sentiment.summary}`,
    ...sentiment.highlights.map((h) => `  - ${h}`),
    `VALUATION: ${valuation.summary}`,
    ...valuation.highlights.map((h) => `  - ${h}`),
    'Seats still write isolated briefs. Clerk must not average these layers into a buy rating.',
  ].join('\n');

  return { fundamentals, sentiment, valuation, contextBlock };
}
