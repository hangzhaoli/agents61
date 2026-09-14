import type { SourcePack } from './types';

/**
 * Deep pack — scuttlebutt growth / 15 points (Common Stocks and Uncommon Profits).
 * Short fair-use themes only; not wholesale book text.
 */
export const philipFisherPack: SourcePack = {
  slug: 'philip-fisher',
  status: 'deep',
  title: 'Philip Fisher — scuttlebutt growth, rare sales',
  summary:
    'Own outstanding growth companies after scuttlebutt research; sell mainly on error or fundamental deterioration — not tape noise.',
  screeningChecklist: [
    {
      id: 'scuttlebutt',
      label: 'Scuttlebutt research done',
      howToJudge:
        'Have customers, suppliers, competitors, and ex-employees informed the view — or is this only a filing skim?',
    },
    {
      id: 'growth_quality',
      label: 'Above-average sales / earnings growth path',
      howToJudge:
        'Is there a multi-year path to grow sales and earnings above average without heroic one-offs?',
    },
    {
      id: 'rd_effectiveness',
      label: 'R&D / product pipeline effectiveness',
      howToJudge:
        'Does research and product development translate into commercial results — not vanity spend?',
    },
    {
      id: 'sales_org',
      label: 'Sales organization quality',
      howToJudge:
        'Is there evidence of an outstanding sales organization relative to peers?',
    },
    {
      id: 'profit_margins',
      label: 'Profit margins with room to protect',
      howToJudge:
        'Adequate margins with a path to maintain or improve them as the company scales.',
    },
    {
      id: 'management_depth',
      label: 'Management depth & integrity',
      howToJudge:
        'Depth beyond one founder narrative; integrity that survives stress tests.',
    },
    {
      id: 'hold_discipline',
      label: 'Hold unless thesis breaks',
      howToJudge:
        'Would you still hold if quotes vanished for years — absent error or deterioration?',
    },
  ],
  positionRisk: [
    'Buying growth without scuttlebutt — story without field checks',
    'Paying any price for quality without a decade economics test',
    'Selling a compounding franchise because of a dull quarter',
    'Confusing a hot product cycle with durable growth machinery',
  ],
  exitRules: [
    'Original appraisal was wrong (error of analysis)',
    'Fundamentals deteriorate: growth engine, margins, or management quality breaks',
    'Not an exit: ordinary quote volatility or fashion rotation alone',
    'Rare: clearly superior use of capital after tax/friction (very high bar)',
  ],
  cases: [
    {
      year: 1958,
      title: 'Common Stocks and Uncommon Profits — 15 points',
      lesson:
        'A structured qualitative checklist beats tip-chasing; growth investing still requires homework.',
      source: 'Common Stocks and Uncommon Profits',
    },
    {
      year: '1950s–1980s',
      title: 'Long holds in outstanding companies',
      lesson:
        'Scuttlebutt can justify multi-decade ownership when the growth machinery remains intact.',
      source: 'Fisher public method / letters themes',
    },
    {
      year: 'ongoing',
      title: 'Anti-overtrading',
      lesson:
        'Most “sell” impulses are noise; true sells are error or deterioration.',
      source: 'Fisher exit discipline themes',
    },
  ],
  excerpts: [
    {
      id: 'pf-scuttlebutt',
      work: 'Common Stocks and Uncommon Profits',
      locator: 'scuttlebutt method',
      quote:
        'Talk to the business ecosystem — customers, competitors, suppliers — before trusting a narrative.',
      tags: ['scuttlebutt', 'research', 'homework', 'growth'],
    },
    {
      id: 'pf-fifteen',
      work: 'Common Stocks and Uncommon Profits',
      locator: 'fifteen points theme',
      quote:
        'Outstanding companies show growth machinery, margins, R&D effectiveness, and management depth — not just a ticker story.',
      tags: ['fifteen', 'checklist', 'quality', 'growth'],
    },
    {
      id: 'pf-sell',
      work: 'Common Stocks and Uncommon Profits',
      locator: 'when to sell',
      quote:
        'Sell mainly when you were wrong or when fundamentals deteriorate — not because the tape is dull.',
      tags: ['sell', 'hold', 'discipline', 'exit'],
    },
    {
      id: 'pf-price',
      work: 'Common Stocks and Uncommon Profits / public remarks',
      locator: 'price vs value theme',
      quote:
        'The market knows the price of everything and the value of nothing — appraisal comes from business facts.',
      tags: ['price', 'value', 'appraisal'],
    },
    {
      id: 'pf-patience',
      work: 'Fisher method themes',
      locator: 'patience',
      quote:
        'Time is an ally when the company remains outstanding; impatience is usually the investor’s error.',
      tags: ['patience', 'compounding', 'hold'],
    },
  ],
  metricsBound: ['revenue_growth', 'margin_durability', 'ROE', 'P/E', 'ROIC', 'valuation_vs_assumption'],
  layerHints: {},
  citedWorks: [
    'Common Stocks and Uncommon Profits (Philip A. Fisher)',
    'Paths to Wealth Through Common Stocks (Philip A. Fisher)',
  ],
};
