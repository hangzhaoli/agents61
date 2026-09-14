import type { SourcePack } from './types';

/**
 * Deep pilot pack — inversion / multidisciplinary checks.
 * Structure spirit aligned with investment-masters methodology cards; content original to Agents61.
 */
export const charlieMungerPack: SourcePack = {
  slug: 'charlie-munger',
  status: 'deep',
  title: 'Charlie Munger — inversion, kill-shots first, incentives & psychology',
  summary:
    'Invert the bull case before defending it. Kill bad ideas early. Read incentives and human misjudgment; stay multidisciplinary and intellectually honest.',
  screeningChecklist: [
    {
      id: 'invert',
      label: 'Inversion first',
      howToJudge:
        'List what would make this a permanent capital loss. If you cannot name kill-shots, you are not ready to underwrite.',
    },
    {
      id: 'kill_shots',
      label: 'Three kill-shots before thesis',
      howToJudge:
        'Require at least three concrete failure modes (accounting, competition, leverage, incentives, regulatory) before writing the bull case.',
    },
    {
      id: 'incentives',
      label: 'Incentive-caused bias',
      howToJudge:
        'Who gets paid for what? Sales, bonuses, and deal fees often explain behavior better than slide decks.',
    },
    {
      id: 'psychology',
      label: 'Psychology of misjudgment',
      howToJudge:
        'Check for social proof, authority bias, commitment/consistency, envy, and excess optimism in the story around the name.',
    },
    {
      id: 'multidisciplinary',
      label: 'Latticework check',
      howToJudge:
        'Apply more than one mental model: accounting, competitive strategy, psychology, and elementary probability — not a single narrative lens.',
    },
    {
      id: 'honesty',
      label: 'Intellectual honesty',
      howToJudge:
        'Prefer management and filings that admit bad news early. Complexity that resists plain English is a yellow flag.',
    },
    {
      id: 'circle',
      label: 'Stay in competence',
      howToJudge:
        'If the business requires faith in opaque tech/finance alchemy you cannot check, pass without apology.',
    },
  ],
  positionRisk: [
    'Falling in love with a narrative before listing failure modes',
    'Incentive systems that reward volume, leverage, or opacity',
    'Psychological contagion — everyone “knows” it is a winner',
    'Overconfidence from a single successful mental model',
  ],
  exitRules: [
    'A named kill-shot materializes (fraud path, broken unit economics, incentive blow-up)',
    'New facts show the original inversion was incomplete and a fatal mode was missed',
    'Management integrity fails the honesty test',
    'Not an exit: being temporarily unpopular while the kill-shots remain dormant',
  ],
  cases: [
    {
      year: '1990s–2000s',
      title: 'Avoiding what you cannot invert cleanly',
      lesson:
        'Passing on complexity is a feature. Many disasters look obvious only after incentives and leverage are mapped.',
      source: 'Poor Charlie’s Almanack / public talks (method themes)',
    },
    {
      year: 2008,
      title: 'Financial engineering & incentives',
      lesson:
        'When incentives pay for short-term volume in opaque products, invert: ask who eats the tail risk when correlations go to one.',
      source: 'Public remarks on financial folly / misjudgment themes',
    },
    {
      year: 'Berkshire partnership era',
      title: 'Quality + inversion partnership with Buffett',
      lesson:
        'Wonderful businesses still need inversion: what kills the moat, the allocator, or the price paid?',
      source: 'Berkshire meetings / Almanack themes',
    },
  ],
  excerpts: [
    {
      id: 'cm-invert',
      work: 'Poor Charlie’s Almanack / public talks',
      locator: 'inversion theme',
      quote:
        'Invert, always invert — solve problems by studying how to fail, then avoid those paths.',
      tags: ['inversion', 'kill-shot', 'failure'],
    },
    {
      id: 'cm-incentives',
      work: 'Poor Charlie’s Almanack',
      locator: 'incentive-caused bias',
      quote:
        'Never underestimate the power of incentives — show me the incentive and I will show you the outcome.',
      tags: ['incentives', 'psychology', 'bias'],
    },
    {
      id: 'cm-lattice',
      work: 'Poor Charlie’s Almanack',
      locator: 'latticework of mental models',
      quote:
        'Use a latticework of models from multiple disciplines; a single hammer turns every problem into a nail.',
      tags: ['multidisciplinary', 'models', 'latticework'],
    },
    {
      id: 'cm-fool',
      work: 'Public remarks / Almanack themes',
      locator: 'avoiding stupidity',
      quote:
        'It is remarkable how much long-term advantage people like us have gotten by trying to be consistently not stupid.',
      tags: ['humility', 'process', 'risk'],
    },
    {
      id: 'cm-account',
      work: 'Public talks on accounting & reality',
      locator: 'accounting skepticism',
      quote:
        'Treat accounting as a starting language, not truth — ask what cash and incentives say when the footnotes get cute.',
      tags: ['accounting', 'footnotes', 'cash'],
    },
  ],
  metricsBound: ['leverage', 'ROE', 'ROIC', 'margin_durability', 'P/E', 'owner_earnings'],
  layerHints: {
    killShotsFirst: true,
  },
  citedWorks: [
    'Poor Charlie’s Almanack (Peter Kaufman, ed.)',
    'Berkshire Hathaway annual meeting remarks (public)',
    'Harvard / university talks on psychology of human misjudgment (public transcripts/summaries)',
  ],
};
