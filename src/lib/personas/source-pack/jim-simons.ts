import type { SourcePack } from './types';

/**
 * Deep pack — statistical significance / model discipline (Simons / Renaissance spirit).
 * Research simulation — no trade orders, no secret Medallion recipes.
 */
export const jimSimonsPack: SourcePack = {
  slug: 'jim-simons',
  status: 'deep',
  title: 'Jim Simons — statistical edge, no narrative override',
  summary:
    'Demand statistically tested signals; do not override models with storytime; size and capacity constraints matter as much as the signal.',
  screeningChecklist: [
    {
      id: 'signal_test',
      label: 'Signal historically tested',
      howToJudge:
        'Is there an out-of-sample / holdout discipline — or only a backtest story?',
    },
    {
      id: 'no_override',
      label: 'No narrative override',
      howToJudge:
        'Would you override the model because a headline feels important? That fails the method.',
    },
    {
      id: 'capacity',
      label: 'Capacity / crowding check',
      howToJudge:
        'Does the edge survive size and competition — or is it a toy signal?',
    },
    {
      id: 'correlation_book',
      label: 'Correlation / book risk',
      howToJudge:
        'Are many “signals” secretly one factor? Hidden correlation kills “diversified” books.',
    },
    {
      id: 'costs',
      label: 'Costs & slippage realism',
      howToJudge:
        'Does the edge survive realistic costs — or only paper fills?',
    },
    {
      id: 'ruin_check',
      label: 'Drawdown / ruin bounds',
      howToJudge:
        'Is there a pre-committed risk budget? Unbounded narrative risk fails.',
    },
  ],
  positionRisk: [
    'Overfitting a beautiful backtest',
    'Human override after a losing streak',
    'Ignoring capacity until the edge is gone',
    'Treating a single narrative as a “signal”',
  ],
  exitRules: [
    'Signal fails statistical validation out of sample',
    'Costs/crowding erase the edge',
    'Risk budget / correlation limits breached',
    'Not an exit: short losing streaks inside validated bounds',
  ],
  cases: [
    {
      year: '1980s–',
      title: 'Renaissance / Medallion public legend',
      lesson:
        'Systematic research culture and model discipline — not public stock tips — define the reputation.',
      source: 'Public profiles of Renaissance Technologies (method culture)',
    },
    {
      year: 'ongoing',
      title: 'Do not override the models',
      lesson:
        'The edge is process integrity; discretionary narrative is usually the leak.',
      source: 'Simons public remarks themes',
    },
    {
      year: 'ongoing',
      title: 'Science over story',
      lesson:
        'If you cannot specify the test, you do not have a signal — you have a vibe.',
      source: 'Quant method culture (Simons-adjacent)',
    },
  ],
  excerpts: [
    {
      id: 'js-models',
      work: 'Jim Simons public remarks',
      locator: 'do not override',
      quote:
        'We don’t override the models — narrative exception-handling is usually how edges die.',
      tags: ['signal', 'model', 'discipline', 'override'],
    },
    {
      id: 'js-stat',
      work: 'Simons / Renaissance method culture',
      locator: 'statistical significance',
      quote:
        'Ask whether the pattern is statistically meaningful after costs — not whether it makes a good dinner story.',
      tags: ['stat', 'significance', 'costs', 'test'],
    },
    {
      id: 'js-science',
      work: 'Simons public interviews',
      locator: 'science culture',
      quote:
        'Hire for scientific honesty: the willingness to kill a favorite hypothesis.',
      tags: ['science', 'falsifier', 'process'],
    },
    {
      id: 'js-noise',
      work: 'Quant method themes',
      locator: 'noise vs signal',
      quote:
        'Most patterns are noise; the burden of proof is on the signal, not on the skeptic.',
      tags: ['noise', 'signal', 'burden'],
    },
    {
      id: 'js-capacity',
      work: 'Quant capacity themes',
      locator: 'capacity',
      quote:
        'An edge that cannot survive size is a research toy, not a book.',
      tags: ['capacity', 'crowding', 'size'],
    },
  ],
  metricsBound: ['leverage', 'valuation_vs_assumption', 'P/E', 'revenue_growth'],
  layerHints: { killShotsFirst: true },
  citedWorks: [
    'Jim Simons public interviews / profiles (model discipline themes)',
    'Public reporting on Renaissance Technologies research culture (not Medallion internals)',
  ],
};
