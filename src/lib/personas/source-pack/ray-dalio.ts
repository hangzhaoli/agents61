import type { SourcePack } from './types';

/**
 * Deep pack — debt-cycle machine: short-term vs long-term cycles, diversification, regime.
 * Short fair-use themes from Principles / Big Debt Crises / public Bridgewater excerpts.
 */
export const rayDalioPack: SourcePack = {
  slug: 'ray-dalio',
  status: 'deep',
  title: 'Ray Dalio — debt cycles, cause-effect machine, diversify risk',
  summary:
    'Locate the economy in short- and long-term debt cycles; map how this company funds itself; name the regime; diversify risk rather than bet on one story.',
  screeningChecklist: [
    {
      id: 'short_debt_cycle',
      label: 'Short-term debt cycle',
      howToJudge:
        'Tightening or easing? Growth above/below potential? Late-cycle credit junkies die first when financing tightens.',
    },
    {
      id: 'long_debt_cycle',
      label: 'Long-term debt cycle',
      howToJudge:
        'Is private/public debt so high that deleveraging is the central risk? Refinancing walls and foreign-capital dependence matter.',
    },
    {
      id: 'funding_map',
      label: 'How this company funds itself',
      howToJudge:
        'Operating cash, cheap credit, or speculative equity? Map sensitivity to rates, spreads, and liquidity (QE/QT, fiscal impulse).',
    },
    {
      id: 'regime',
      label: 'Economic regime',
      howToJudge:
        'Name the regime: disinflationary growth, reflation, stagflation, or deflationary bust — assets that only work in one regime need an explicit hedge logic.',
    },
    {
      id: 'credit_thermometer',
      label: 'Credit / liquidity thermometer',
      howToJudge:
        'Credit spreads, yield curve, and financing ease often reveal risk appetite earlier than equity narratives admit.',
    },
    {
      id: 'diversify_risk',
      label: 'Diversify risk (not stories)',
      howToJudge:
        'A single concentrated bet that requires one regime forever is a machine failure unless correlations are understood.',
    },
    {
      id: 'second_level',
      label: 'What’s in the price vs consensus',
      howToJudge:
        'What growth, margins, and credit conditions does the quote already assume? First-level “good company” is not a cycle underwrite.',
    },
  ],
  positionRisk: [
    'Equity thesis that only works if a late-cycle credit boom never ends',
    'Ignoring refinancing walls or foreign-capital dependence',
    '100% bet on one inflation/deflation regime',
    'Confusing diversification of tickers with diversification of risk factors',
  ],
  exitRules: [
    'Regime or cycle phase falsified — funding assumptions no longer hold',
    'Credit thermometer flips and the company is a financing junkie',
    'Correlations go to one and the “diversified” book was one bet',
    'Not an exit: ordinary volatility inside a still-intact cycle map',
  ],
  cases: [
    {
      year: '1930s / historical',
      title: 'Big Debt Crises — deleveraging patterns',
      lesson:
        'Long-term debt cycles end in deleveragings with familiar cause-effect chains. Studying templates beats vibes.',
      source: 'Big Debt Crises (Ray Dalio) — template themes',
    },
    {
      year: 2008,
      title: 'Financial crisis — credit machine failure',
      lesson:
        'When credit contracts, assets priced for perpetual easy money reprice violently. Locate where you are before the music stops.',
      source: 'Principles / Bridgewater public crisis commentary themes',
    },
    {
      year: '2010s–2020s',
      title: 'Easy money & FOMO regimes',
      lesson:
        'Prolonged liquidity trains investors to treat risk assets as one-way. Diversify risk factors; name when the machine is late-cycle.',
      source: 'Principles; public Daily Observations themes',
    },
  ],
  excerpts: [
    {
      id: 'rd-cycles',
      work: 'Principles / Big Debt Crises',
      locator: 'short vs long-term debt cycle',
      quote:
        'Separate the short-term debt cycle (expansion/recession) from the long-term debt cycle (deleveraging risk) — locate both before underwriting equities.',
      tags: ['debt cycle', 'deleveraging', 'cycle', 'credit'],
    },
    {
      id: 'rd-cause',
      work: 'Principles',
      locator: 'cause-effect machine',
      quote:
        'Prefer being roughly right on the machine (money, credit, debt service) to being precisely wrong on a point forecast.',
      tags: ['cause-effect', 'machine', 'humility', 'forecast'],
    },
    {
      id: 'rd-diversify',
      work: 'Principles',
      locator: 'diversify risk',
      quote:
        'Diversify risk exposures — a book of correlated bets is one bet wearing many tickers.',
      tags: ['diversify', 'risk', 'correlation', 'all-weather'],
    },
    {
      id: 'rd-credit',
      work: 'Big Debt Crises / public observations',
      locator: 'credit and liquidity',
      quote:
        'Credit spreads, real rates, and liquidity conditions often move asset prices more than clever equity stories admit.',
      tags: ['credit_spreads', 'liquidity', 'rates', 'thermometer'],
    },
    {
      id: 'rd-regime',
      work: 'Principles',
      locator: 'regime awareness',
      quote:
        'Name the economic regime — inflation vs deflation paths change which assets work. “This time is different” needs evidence.',
      tags: ['regime', 'inflation', 'deflation', 'consensus'],
    },
  ],
  metricsBound: ['credit_spreads', 'leverage', 'valuation_vs_assumption', 'P/E', 'revenue_growth'],
  layerHints: {
    consensusPriceContrast: true,
  },
  citedWorks: [
    'Principles (Ray Dalio)',
    'Big Debt Crises (Ray Dalio)',
    'Bridgewater Daily Observations (public excerpts)',
  ],
};
