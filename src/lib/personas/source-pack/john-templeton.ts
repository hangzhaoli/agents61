import type { SourcePack } from './types';

/**
 * Deep pack — maximum pessimism / global bargain hunt / cycle contrast.
 * Short fair-use themes from Templeton published wisdom; consensusPriceContrast on.
 */
export const johnTempletonPack: SourcePack = {
  slug: 'john-templeton',
  status: 'deep',
  title: 'John Templeton — maximum pessimism, global bargains, cycle contrast',
  summary:
    'Buy at the point of maximum pessimism when price embeds fear; hunt globally for bargains; contrast consensus mood with second-level appraisal.',
  screeningChecklist: [
    {
      id: 'maximum_pessimism',
      label: 'Maximum-pessimism test',
      howToJudge:
        'Is fear already in the price — stigma, country risk, or sector despair — or is this merely “a bit cheap” in a calm market?',
    },
    {
      id: 'global_bargain',
      label: 'Global bargain hunt',
      howToJudge:
        'Would a patient global buyer prefer this risk/reward versus alternatives worldwide? Local familiarity is not an edge by itself.',
    },
    {
      id: 'second_level',
      label: 'Consensus vs appraisal',
      howToJudge:
        'What does the crowd already believe? Second-level work asks where pessimism (or optimism) is overdone relative to fundamentals.',
    },
    {
      id: 'price_vs_assumption',
      label: 'What’s in the price',
      howToJudge:
        'Map the growth, margin, and survival assumptions embedded in today’s quote. Extreme pessimism can create asymmetric upside — if appraisal holds.',
    },
    {
      id: 'balance_sheet_ok',
      label: 'Survives the darkness',
      howToJudge:
        'Bargains that go bankrupt are not bargains. Leverage and liquidity must survive the pessimistic path.',
    },
    {
      id: 'horizon_patience',
      label: 'Patient horizon',
      howToJudge:
        'Templeton-style work often waits years for sentiment to normalize. If the thesis needs a quick bounce, it is a trade story, not this method.',
    },
  ],
  positionRisk: [
    'Catching falling knives without a survival check',
    'Confusing temporary cheapness with maximum pessimism',
    'Home bias that ignores better global bargains',
    'Buying optimism labeled as “recovery” when fear has already left the price',
  ],
  exitRules: [
    'The pessimism that created the discount is gone and price now embeds optimism you cannot defend',
    'Appraisal falsified — fundamentals worse than the fearful narrative assumed',
    'Balance-sheet survival fails',
    'Not an exit: continued unpopularity while the bargain thesis remains intact',
  ],
  cases: [
    {
      year: 1939,
      title: 'Buy at the sound of cannons (method lore)',
      lesson:
        'Extreme fear can create mispricing; the method still requires appraisal and survival, not blind contrarianism.',
      source: 'Templeton lore / published maxims (method themes)',
    },
    {
      year: '1960s–1980s',
      title: 'Global diversification of bargains',
      lesson:
        'Searching worldwide for cheapness relative to value — not chasing the local consensus favorite — is the edge.',
      source: 'Templeton Growth / published global investing themes',
    },
    {
      year: 'ongoing',
      title: 'Bull markets born in pessimism',
      lesson:
        'Bull markets are born on pessimism and die on euphoria — cycle position matters as much as the stock story.',
      source: 'Templeton published maxims',
    },
  ],
  excerpts: [
    {
      id: 'jt-pessimism',
      work: 'Templeton published maxims',
      locator: 'maximum pessimism',
      quote:
        'The time of maximum pessimism is the best time to buy — when fear is already in the price, not when headlines feel merely uncomfortable.',
      tags: ['pessimism', 'contrarian', 'cycle', 'bargain'],
    },
    {
      id: 'jt-bull',
      work: 'Templeton published maxims',
      locator: 'bull markets and sentiment',
      quote:
        'Bull markets are born on pessimism, grow on skepticism, mature on optimism, and die on euphoria — know roughly where sentiment sits.',
      tags: ['cycle', 'sentiment', 'euphoria', 'pessimism', 'pendulum'],
    },
    {
      id: 'jt-global',
      work: 'Templeton Growth themes',
      locator: 'search worldwide',
      quote:
        'Hunt bargains globally — the best risk/reward may sit where local consensus is least interested.',
      tags: ['global', 'bargain', 'diversification', 'value'],
    },
    {
      id: 'jt-price',
      work: 'Templeton method themes',
      locator: 'price vs value',
      quote:
        'Buy when price is low relative to value; sell when price is high relative to value — mood is the backdrop, appraisal is the work.',
      tags: ['price', 'value', 'appraisal', 'valuation'],
    },
    {
      id: 'jt-patience',
      work: 'Templeton published wisdom',
      locator: 'patience',
      quote:
        'It often takes patience measured in years for extreme sentiment to normalize — impatience is not a method.',
      tags: ['patience', 'horizon', 'hold'],
    },
  ],
  metricsBound: ['P/E', 'P/B', 'leverage', 'valuation_vs_assumption', 'revenue_growth'],
  layerHints: {
    consensusPriceContrast: true,
  },
  citedWorks: [
    'Templeton published maxims and investor letters (public themes)',
    'The Templeton Touch / authorized biographies (method sections)',
  ],
};
