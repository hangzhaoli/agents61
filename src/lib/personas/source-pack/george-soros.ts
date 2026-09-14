import type { SourcePack } from './types';

/**
 * Deep pack — reflexivity / boom-bust feedback (Soros).
 * Short fair-use themes from The Alchemy of Finance / public remarks.
 */
export const georgeSorosPack: SourcePack = {
  slug: 'george-soros',
  status: 'deep',
  title: 'George Soros — reflexivity, boom-bust, survival first',
  summary:
    'Markets are reflexive: biased perceptions shape fundamentals that then reinforce the bias — until they don’t. Size for survival; admit error fast.',
  screeningChecklist: [
    {
      id: 'reflexivity',
      label: 'Reflexive feedback identified',
      howToJudge:
        'Is there a feedback loop where price/perception is changing the fundamentals (credit, flows, policy)?',
    },
    {
      id: 'regime',
      label: 'Boom, bust, or near-equilibrium',
      howToJudge:
        'Name the phase. Near-equilibrium needs different sizing than a runaway boom.',
    },
    {
      id: 'bias_map',
      label: 'Prevailing bias mapped',
      howToJudge:
        'What is the crowd’s misconception — and how is it being validated by recent price action?',
    },
    {
      id: 'falsifier',
      label: 'Clear falsifier / stop hypothesis',
      howToJudge:
        'What observation would kill the reflexivity thesis? If none, you are storytelling.',
    },
    {
      id: 'liquidity',
      label: 'Liquidity / policy overlay',
      howToJudge:
        'Funding conditions and policy can amplify or break the loop — are they on the checklist?',
    },
    {
      id: 'ruin_check',
      label: 'Survival / ruin check',
      howToJudge:
        'Can you be wrong and still stay in the game? Hero bets that require perfection fail.',
    },
  ],
  positionRisk: [
    'Fighting a reflexive boom without a falsifier',
    'Confusing a narrative with a measurable feedback loop',
    'Sizing as if equilibrium when the boom is still feeding itself',
    'Refusing to reverse when the thesis is invalidated',
  ],
  exitRules: [
    'Falsifier hits: the feedback loop breaks or reverses',
    'Bias was mis-specified — original hypothesis was wrong',
    'Liquidity/policy regime change destroys the path dependency',
    'Not an exit: short-term noise inside an intact reflexive phase',
  ],
  cases: [
    {
      year: 1992,
      title: 'ERM / sterling episode (public record)',
      lesson:
        'When policy, credibility, and market pressure form a reflexive loop, timing and sizing matter more than clever slogans.',
      source: 'Public macro history / Soros Fund Management era commentary',
    },
    {
      year: 1987,
      title: 'The Alchemy of Finance — reflexivity pedagogy',
      lesson:
        'Participant bias and market prices co-evolve — equilibrium assumptions can mislead.',
      source: 'The Alchemy of Finance',
    },
    {
      year: 'ongoing',
      title: 'Admit error quickly',
      lesson:
        'Being right is less important than how much you make when right and how little you lose when wrong.',
      source: 'Soros public remarks themes',
    },
  ],
  excerpts: [
    {
      id: 'gs-reflexivity',
      work: 'The Alchemy of Finance',
      locator: 'reflexivity',
      quote:
        'Perceptions influence events that then reinforce perceptions — until the feedback loop exhausts itself.',
      tags: ['reflexivity', 'feedback', 'boom', 'bust'],
    },
    {
      id: 'gs-bias',
      work: 'The Alchemy of Finance',
      locator: 'prevailing bias',
      quote:
        'Markets are always biased in one way or another; the question is whether the bias is self-reinforcing.',
      tags: ['bias', 'consensus', 'reflexivity'],
    },
    {
      id: 'gs-wrong',
      work: 'Soros public remarks',
      locator: 'right vs wrong sizing',
      quote:
        'It is not whether you are right or wrong, but how much you make when you are right and how much you lose when you are wrong.',
      tags: ['sizing', 'risk', 'survival'],
    },
    {
      id: 'gs-equilibrium',
      work: 'The Alchemy of Finance',
      locator: 'near-equilibrium vs far-from-equilibrium',
      quote:
        'Near-equilibrium periods behave differently from boom-bust far-from-equilibrium episodes — method must match regime.',
      tags: ['regime', 'cycle', 'equilibrium'],
    },
    {
      id: 'gs-humility',
      work: 'Soros method themes',
      locator: 'fallibility',
      quote:
        'Assume fallibility; design the thesis so it can be killed by evidence.',
      tags: ['falsifier', 'humility', 'process'],
    },
  ],
  metricsBound: ['credit_spreads', 'leverage', 'valuation_vs_assumption', 'P/E', 'revenue_growth'],
  layerHints: { consensusPriceContrast: true },
  citedWorks: [
    'The Alchemy of Finance (George Soros)',
    'Soros on Soros / public interviews (selected method remarks)',
  ],
};
