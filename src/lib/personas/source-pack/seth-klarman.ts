import type { SourcePack } from './types';

/**
 * Deep pack — absolute-return value: downside first, cash as option, special situations.
 * Short fair-use themes from Margin of Safety / Baupost public remarks; not wholesale text.
 */
export const sethKlarmanPack: SourcePack = {
  slug: 'seth-klarman',
  status: 'deep',
  title: 'Seth Klarman — downside first, cash as option, special-situation patience',
  summary:
    'Absolute return mindset: appraise downside before upside; hold cash when nothing is cheap; prefer forced-seller and complexity discounts over crowded quality compounders.',
  screeningChecklist: [
    {
      id: 'downside_first',
      label: 'Downside first',
      howToJudge:
        'What is a conservative terminal value if the crowd is wrong? If downside is open-ended, pass — regardless of the bull story.',
    },
    {
      id: 'margin_of_safety',
      label: 'Margin of safety (absolute)',
      howToJudge:
        'Discount must protect against appraisal error and bad luck. “Great business at fair price” without a discount is often not Baupost work.',
    },
    {
      id: 'forced_seller',
      label: 'Inefficiency / forced seller',
      howToJudge:
        'Is there a reason price is wrong (forced selling, complexity, stigma, spinoff orphan) — or is it merely a popular compounder?',
    },
    {
      id: 'cash_optionality',
      label: 'Cash vs deploy',
      howToJudge:
        'Willingness to hold cash when bargains are scarce is a feature. Opportunity cost of a bad compounder is real.',
    },
    {
      id: 'complexity_discount',
      label: 'Complexity / special situation',
      howToJudge:
        'Prefer situations where complexity or stigma creates a discount you can underwrite — not complexity that hides permanent loss.',
    },
    {
      id: 'leverage',
      label: 'Balance-sheet optionality',
      howToJudge:
        'Excess leverage that removes optionality fails. Prefer capital structures that survive a bad path.',
    },
    {
      id: 'price_vs_assumption',
      label: 'What’s already consensus',
      howToJudge:
        'If the bull case is already the consensus price, the absolute-return edge is gone even if the company is “good.”',
    },
  ],
  positionRisk: [
    'Paying compounder prices with no forced-seller discount',
    'Confusing cheapness with a melting business (value trap)',
    'Illiquidity without a compensating discount',
    'FOMO into fully invested when cash is the higher-EV option',
  ],
  exitRules: [
    'Price has closed the absolute discount — upside now requires a perfect path',
    'Catalyst or inefficiency thesis falsified; remaining story is consensus quality',
    'Downside case worsens (leverage, liquidation value, or franchise decay)',
    'Not an exit: temporary unpopularity while the downside floor still holds',
  ],
  cases: [
    {
      year: 1991,
      title: 'Margin of Safety — absolute return framing',
      lesson:
        'Risk is permanent capital loss, not underperforming a benchmark while fully invested. Cash and patience are tools.',
      source: 'Margin of Safety (Seth Klarman) — method themes',
    },
    {
      year: '2008–2009',
      title: 'Crisis liquidity & forced sellers',
      lesson:
        'Dislocations create opportunities when sellers are forced — but only with a downside appraisal, not because “everything looks cheap.”',
      source: 'Baupost public commentary themes / crisis-period value practice',
    },
    {
      year: '2010s–2020s',
      title: 'Crowded quality vs special situations',
      lesson:
        'When quality compounders price in perfection, absolute-return desks often wait. Special situations and stigma can still offer asymmetric work.',
      source: 'Baupost letters / public interview themes (paraphrase)',
    },
  ],
  excerpts: [
    {
      id: 'sk-mos',
      work: 'Margin of Safety (Seth Klarman)',
      locator: 'margin of safety / absolute return',
      quote:
        'Margin of safety is a philosophy of downside protection — not a slogan glued onto a growth story after the fact.',
      tags: ['margin of safety', 'downside', 'absolute return', 'value'],
    },
    {
      id: 'sk-cash',
      work: 'Margin of Safety / Baupost themes',
      locator: 'cash as optionality',
      quote:
        'Cash is an option on future bargains when nothing meets the discount test — fully invested is not a moral requirement.',
      tags: ['cash', 'optionality', 'patience', 'opportunity cost'],
    },
    {
      id: 'sk-forced',
      work: 'Margin of Safety',
      locator: 'forced sellers / inefficiency',
      quote:
        'Prefer prices set by forced sellers, complexity, or stigma — inefficiencies you can underwrite — over consensus “great companies.”',
      tags: ['forced seller', 'special situation', 'complexity', 'inefficiency'],
    },
    {
      id: 'sk-risk',
      work: 'Margin of Safety',
      locator: 'risk definition',
      quote:
        'Risk is the probability and amount of permanent capital loss given the price paid — not day-to-day volatility versus a benchmark.',
      tags: ['risk', 'permanent loss', 'volatility', 'price'],
    },
    {
      id: 'sk-trap',
      work: 'Baupost public themes',
      locator: 'value traps',
      quote:
        'Cheap can still be a trap when the business is melting — appraisal must include a path where the asset keeps earning or liquidating sanely.',
      tags: ['value trap', 'appraisal', 'downside', 'franchise'],
    },
  ],
  metricsBound: ['P/B', 'P/E', 'FCF_yield', 'leverage', 'valuation_vs_assumption', 'owner_earnings'],
  layerHints: {},
  citedWorks: [
    'Margin of Safety (Seth Klarman)',
    'Baupost Group public letters and interview excerpts',
  ],
};
