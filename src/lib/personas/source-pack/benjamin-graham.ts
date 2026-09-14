import type { SourcePack } from './types';

/**
 * Deep pack — classical value: margin of safety, Mr. Market, balance-sheet first.
 * Short fair-use themes from Security Analysis / The Intelligent Investor; not wholesale text.
 */
export const benjaminGrahamPack: SourcePack = {
  slug: 'benjamin-graham',
  status: 'deep',
  title: 'Benjamin Graham — margin of safety, Mr. Market, investment vs speculation',
  summary:
    'Pay well below a conservative appraisal; treat the quote as an offer, not a verdict; separate investment (operations + margin) from speculation (greater-fool dependence).',
  screeningChecklist: [
    {
      id: 'margin_of_safety',
      label: 'Margin of safety',
      howToJudge:
        'Is price sufficiently below a conservative intrinsic appraisal (classically a wide discount)? If you cannot appraise, you do not have an investment.',
    },
    {
      id: 'investment_vs_speculation',
      label: 'Investment vs speculation',
      howToJudge:
        'Investment rests on thorough analysis, principal safety, and adequate return. A thesis that only works if someone else pays more is speculation.',
    },
    {
      id: 'balance_sheet_first',
      label: 'Balance sheet first',
      howToJudge:
        'Current assets, debt, dilution, and liquidation cushion matter before growth stories. Net-net / NCAV screens when applicable.',
    },
    {
      id: 'earnings_stability',
      label: 'Earnings stability / normalized power',
      howToJudge:
        'Prefer normalized earning power over peak-cycle profits. One hot year is not a valuation base.',
    },
    {
      id: 'leverage',
      label: 'Debt restraint',
      howToJudge:
        'Heavy fixed claims that can force liquidation at the wrong time fail the defensive test.',
    },
    {
      id: 'mr_market',
      label: 'Mr. Market as partner',
      howToJudge:
        'Use the quote as an offer to buy or sell — never as a measure of value. Euphoria and despair are invitations to calculate, not to obey.',
    },
    {
      id: 'price_vs_quality',
      label: 'Price vs conservative value',
      howToJudge:
        'P/B and P/E vs tangible book and normalized earnings are starting screens — not permission to ignore the appraisal.',
    },
  ],
  positionRisk: [
    'Paying full price for a “good story” with no statistical margin',
    'Confusing a low multiple on peak earnings with a true discount',
    'Ignoring debt and dilution because the equity narrative feels cheap',
    'Letting Mr. Market’s mood substitute for independent appraisal',
  ],
  exitRules: [
    'Price has closed the margin of safety — appraisal no longer supports a discount',
    'Facts show the original appraisal was wrong (assets impaired, earnings not normalizable)',
    'The position has become speculation: thesis now depends on a greater fool',
    'Not an exit: ordinary quote volatility while the margin and facts still hold',
  ],
  cases: [
    {
      year: '1934 / 1940',
      title: 'Security Analysis — investment defined',
      lesson:
        'Thorough analysis + margin of safety separates investment from speculation. Cheapness without a floor is still gambling dressed as value.',
      source: 'Security Analysis (Graham & Dodd) — method themes',
    },
    {
      year: 1949,
      title: 'The Intelligent Investor — Mr. Market',
      lesson:
        'The manic-depressive partner offers prices; the intelligent investor decides. Obeying the mood is how speculation enters through the back door.',
      source: 'The Intelligent Investor — Mr. Market allegory',
    },
    {
      year: '1950s–1970s',
      title: 'Net-nets and cigar butts (historical screen)',
      lesson:
        'Buying below net current asset value can work statistically — but dying businesses still need a margin and an exit discipline. Later students (Buffett) evolved toward quality when cigar butts ran out.',
      source: 'Graham practice / Intelligent Investor defensive chapters (themes)',
    },
  ],
  excerpts: [
    {
      id: 'bg-mos',
      work: 'The Intelligent Investor / Security Analysis',
      locator: 'margin of safety theme',
      quote:
        'A true investment requires a margin of safety — a discount to a carefully appraised value that cushions error and bad luck.',
      tags: ['margin of safety', 'appraisal', 'investment', 'P/B', 'P/E'],
    },
    {
      id: 'bg-mr-market',
      work: 'The Intelligent Investor',
      locator: 'Mr. Market allegory',
      quote:
        'Mr. Market is a manic-depressive partner who quotes prices daily; use those offers when useful, ignore them when absurd — never confuse price with value.',
      tags: ['Mr. Market', 'price', 'value', 'psychology'],
    },
    {
      id: 'bg-invest-spec',
      work: 'Security Analysis',
      locator: 'investment vs speculation',
      quote:
        'An investment operation is one which, upon thorough analysis, promises safety of principal and an adequate return — operations not meeting these requirements are speculative.',
      tags: ['investment', 'speculation', 'analysis'],
    },
    {
      id: 'bg-balance',
      work: 'Security Analysis',
      locator: 'balance-sheet / asset approach',
      quote:
        'Start from assets, working capital, and debt before extrapolating hopeful earnings — the balance sheet is the defensive investor’s first language.',
      tags: ['balance sheet', 'net-net', 'debt', 'defensive'],
    },
    {
      id: 'bg-earnings',
      work: 'Security Analysis / Intelligent Investor',
      locator: 'normalized earnings',
      quote:
        'Appraise earning power on a conservative, normalized basis — peak-cycle profits are a common way “value” becomes speculation.',
      tags: ['earnings', 'normalized', 'P/E', 'cycle'],
    },
  ],
  metricsBound: ['P/B', 'P/E', 'leverage', 'ROE', 'revenue_growth', 'valuation_vs_assumption'],
  layerHints: {},
  citedWorks: [
    'Security Analysis (Graham & Dodd)',
    'The Intelligent Investor (Benjamin Graham)',
  ],
};
