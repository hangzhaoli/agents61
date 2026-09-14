import type { SourcePack } from './types';

/**
 * Deep pack — liquidity-first macro, concentrated conviction (Druckenmiller).
 */
export const stanleyDruckenmillerPack: SourcePack = {
  slug: 'stanley-druckenmiller',
  status: 'deep',
  title: 'Stanley Druckenmiller — liquidity, one shot, protect capital',
  summary:
    'Follow liquidity and the path of least resistance; when conviction is rare and high, concentrate — then protect aggressively when wrong.',
  screeningChecklist: [
    {
      id: 'liquidity',
      label: 'Liquidity / credit impulse',
      howToJudge:
        'Are central-bank and private credit conditions expanding or contracting? Liquidity often leads fundamentals.',
    },
    {
      id: 'path_resistance',
      label: 'Path of least resistance',
      howToJudge:
        'Does price action confirm the thesis, or are you fighting the tape with a clever story?',
    },
    {
      id: 'conviction_one_shot',
      label: 'One-shot concentration test',
      howToJudge:
        'If you could only take one concentrated position this year, would this clear the bar?',
    },
    {
      id: 'asymmetric',
      label: 'Asymmetric payoff',
      howToJudge:
        'Upside vs downside must be asymmetric after survival sizing — not a coin flip dressed as macro.',
    },
    {
      id: 'falsifier',
      label: 'Kill criteria written',
      howToJudge:
        'What data or price level ends the thesis? No kill line = no tradeable hypothesis (research note only).',
    },
    {
      id: 'protect',
      label: 'Protect-when-wrong discipline',
      howToJudge:
        'Can you cut size fast without ego? Preservation is part of the method.',
    },
  ],
  positionRisk: [
    'Fighting liquidity with a valuation sermon',
    'Diversifying away a rare high-conviction idea into mediocrity',
    'Staying large after the thesis is broken',
    'Confusing a good story with a confirmed path of least resistance',
  ],
  exitRules: [
    'Liquidity impulse reverses against the thesis',
    'Price path invalidates the hypothesis (kill line hit)',
    'Conviction was never real — it was narrative FOMO',
    'Not an exit: noise inside an intact liquidity regime with confirmed tape',
  ],
  cases: [
    {
      year: '1980s–1990s',
      title: 'Quantum / Duquesne era discipline themes',
      lesson:
        'Macro edge compounds when liquidity reading and ruthless capital protection sit together.',
      source: 'Public interviews / Duquesne Capital era commentary',
    },
    {
      year: 2000,
      title: 'Tech bubble — cut when wrong',
      lesson:
        'Even strong operators reverse when the thesis breaks; ego is not a position size.',
      source: 'Public remarks on late-1990s / 2000s risk cuts',
    },
    {
      year: 'ongoing',
      title: 'Courage to concentrate',
      lesson:
        'Diversification is often a hedge against not knowing; rare conviction deserves size — with a kill switch.',
      source: 'Druckenmiller public method themes',
    },
  ],
  excerpts: [
    {
      id: 'sd-liquidity',
      work: 'Druckenmiller public interviews',
      locator: 'liquidity first',
      quote:
        'Earnings can lag; liquidity and credit often set the path of least resistance first.',
      tags: ['liquidity', 'credit', 'macro', 'flow'],
    },
    {
      id: 'sd-pig',
      work: 'Druckenmiller public remarks',
      locator: 'concentration',
      quote:
        'It takes courage to be a pig when the opportunity is rare — and discipline to stop being a pig when wrong.',
      tags: ['conviction', 'sizing', 'concentration'],
    },
    {
      id: 'sd-protect',
      work: 'Druckenmiller method themes',
      locator: 'capital preservation',
      quote:
        'Making money is one skill; keeping it when the thesis breaks is the lasting edge.',
      tags: ['protect', 'risk', 'exit'],
    },
    {
      id: 'sd-tape',
      work: 'Druckenmiller public method',
      locator: 'price confirmation',
      quote:
        'Respect the tape: a beautiful thesis that the market refuses to confirm is usually unfinished homework.',
      tags: ['tape', 'confirmation', 'path'],
    },
    {
      id: 'sd-one',
      work: 'Druckenmiller public remarks',
      locator: 'one shot',
      quote:
        'Ask whether this is the year’s one shot — most ideas are not.',
      tags: ['conviction', 'filter', 'opportunity'],
    },
  ],
  metricsBound: ['credit_spreads', 'leverage', 'valuation_vs_assumption', 'P/E', 'revenue_growth'],
  layerHints: { consensusPriceContrast: true, killShotsFirst: true },
  citedWorks: [
    'Stanley Druckenmiller public interviews (liquidity / sizing themes)',
    'Duquesne Capital era public commentary (selected)',
  ],
};
