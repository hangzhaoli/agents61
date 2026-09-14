import type { SourcePack } from './types';

/**
 * Deep pack — Kelly / bankroll / edge sizing. Research simulation only:
 * fractional-Kelly bands as CONTEXT — never trade orders or “all-in” tickets.
 */
export const edThorpPack: SourcePack = {
  slug: 'ed-thorp',
  status: 'deep',
  title: 'Ed Thorp — edge first, Kelly/fractional sizing, ruin awareness',
  summary:
    'No edge, no bet. Size from honest probabilities and payoffs (fractional Kelly); shrink for uncertainty, costs, and ruin — never invent p and b to justify a ticket.',
  screeningChecklist: [
    {
      id: 'edge_exists',
      label: 'Repeatable edge claimed?',
      howToJudge:
        'Is there a statistical, structural, or mispricing edge — or only a narrative? No edge → size is zero.',
    },
    {
      id: 'kelly_inputs',
      label: 'Honest p and b (Kelly inputs)',
      howToJudge:
        'Can win probability (p) and payoff odds (b) be estimated without fantasy? If not, f* = 0.',
    },
    {
      id: 'fractional_kelly',
      label: 'Fractional Kelly / uncertainty haircut',
      howToJudge:
        'Use half-Kelly or less in practice because p and b are noisy; costs and slippage shrink further.',
    },
    {
      id: 'ruin_check',
      label: 'Ruin / bankroll check',
      howToJudge:
        'Never size so a short losing streak ends the bankroll. Correlated losses and leverage raise ruin risk.',
    },
    {
      id: 'leverage',
      label: 'Leverage restraint',
      howToJudge:
        'Embedded or explicit leverage that forces ruin on ordinary variance fails the Thorp screen.',
    },
    {
      id: 'correlation_book',
      label: 'Correlation with the rest of the book',
      howToJudge:
        'An “independent” bet that is secretly correlated with existing risks is oversized in disguise.',
    },
    {
      id: 'no_hero_bet',
      label: 'No hero / all-in sizing',
      howToJudge:
        'Conviction theater is not a Kelly input. All-in fails by definition.',
    },
  ],
  positionRisk: [
    'Inventing probabilities to justify a large fraction',
    'Ignoring costs, slippage, and estimation error',
    'Leverage that turns variance into ruin',
    'Treating a story as a statistical edge',
  ],
  exitRules: [
    'Edge claim falsified — no remaining positive expectancy under honest inputs',
    'p/b estimates become too uncertain → size band collapses to zero',
    'Ruin path emerges (correlation, leverage, liquidity)',
    'Not an exit: ordinary mark-to-market noise while edge and bankroll rules still hold',
  ],
  cases: [
    {
      year: 1962,
      title: 'Beat the Dealer — counted edge + bankroll',
      lesson:
        'A small measured edge still requires bankroll discipline; overbetting a real edge can still ruin you.',
      source: 'Beat the Dealer',
    },
    {
      year: 1967,
      title: 'Beat the Market — warrant/hedge arithmetic',
      lesson:
        'Mispricing plus hedge construction can create edge; size still follows risk of ruin, not excitement.',
      source: 'Beat the Market',
    },
    {
      year: '1970s–2000s',
      title: 'Market-making / quant compounding',
      lesson:
        'Quiet compounding with controlled size beats hero bets — Kelly is a ceiling, fractional Kelly is practice.',
      source: 'A Man for All Markets',
    },
  ],
  excerpts: [
    {
      id: 'et-edge',
      work: 'A Man for All Markets / Beat the Dealer themes',
      locator: 'no edge, no bet',
      quote:
        'Without a measurable edge, the correct size is zero — narrative conviction is not an edge.',
      tags: ['edge', 'Kelly', 'sizing', 'probability'],
    },
    {
      id: 'et-kelly',
      work: 'Kelly criterion practice (Thorp)',
      locator: 'fractional Kelly',
      quote:
        'Full Kelly maximizes growth under known odds but is too aggressive when p and b are estimated — use a fraction.',
      tags: ['Kelly', 'fractional', 'bankroll', 'sizing'],
    },
    {
      id: 'et-ruin',
      work: 'A Man for All Markets',
      locator: 'risk of ruin',
      quote:
        'Overbetting — even with an edge — raises the chance of ruin; bankroll survival is part of the method.',
      tags: ['ruin', 'bankroll', 'risk', 'leverage'],
    },
    {
      id: 'et-costs',
      work: 'Thorp quant practice themes',
      locator: 'costs shrink edge',
      quote:
        'Costs, slippage, and uncertainty shrink the usable Kelly fraction — ignore friction and you oversize.',
      tags: ['costs', 'slippage', 'edge', 'Kelly'],
    },
    {
      id: 'et-quiet',
      work: 'A Man for All Markets',
      locator: 'quiet compounding',
      quote:
        'Prefer quiet compounding with controlled size over heroic concentration — the model is a tool, not truth.',
      tags: ['compounding', 'humility', 'process', 'quant'],
    },
  ],
  metricsBound: ['leverage', 'valuation_vs_assumption', 'P/E', 'ROE'],
  layerHints: {},
  citedWorks: [
    'Beat the Dealer (Edward Thorp)',
    'Beat the Market (Thorp & Kassouf)',
    'A Man for All Markets (Edward Thorp)',
  ],
};
