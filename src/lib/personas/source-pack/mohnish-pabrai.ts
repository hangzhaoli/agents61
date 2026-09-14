import type { SourcePack } from './types';

/**
 * Deep pack — Dhandho / shameless cloning (Pabrai).
 */
export const mohnishPabraiPack: SourcePack = {
  slug: 'mohnish-pabrai',
  status: 'deep',
  title: 'Mohnish Pabrai — Dhandho heads-I-win, cloning',
  summary:
    'Heads I win, tails I don’t lose much: clone proven capital allocators; favor asymmetric downside with few concentrated bets.',
  screeningChecklist: [
    {
      id: 'heads_i_win',
      label: 'Heads I win / tails I don’t lose much',
      howToJudge:
        'Is downside capped by asset value, moat, or forced-seller dynamics — while upside remains open?',
    },
    {
      id: 'clone_check',
      label: 'Clone with understanding',
      howToJudge:
        'If cloning Buffett/Munger/others: do you understand *why* — or only the ticker list?',
    },
    {
      id: 'circle',
      label: 'Inside circle of competence',
      howToJudge:
        'Can you explain the business plainly? Outside circle fails even if “cheap.”',
    },
    {
      id: 'few_bets',
      label: 'Few high-conviction bets',
      howToJudge:
        'Is this one of a handful of ideas that clear the bar — or filler diversification?',
    },
    {
      id: 'leverage',
      label: 'Low permanent-loss leverage',
      howToJudge:
        'Avoid structures that turn temporary pain into forced sale.',
    },
    {
      id: 'price_vs_quality',
      label: 'Mispricing vs quality',
      howToJudge:
        'Dhandho wants favorable odds — not lottery tickets dressed as value.',
    },
  ],
  positionRisk: [
    'Cloning tickers without cloning the reasoning',
    'Ignoring downside because the story is Buffett-adjacent',
    'Too many mediocre bets diluting rare asymmetry',
    'Leverage that violates “tails I don’t lose much”',
  ],
  exitRules: [
    'Downside thesis breaks — permanent capital loss path appears',
    'Clone reasoning was wrong (you copied a list, not a method)',
    'Better asymmetric opportunity clearly dominates after friction',
    'Not an exit: dull quotes while odds remain favorable',
  ],
  cases: [
    {
      year: 2007,
      title: 'The Dhandho Investor — pedagogy',
      lesson:
        'Asymmetric bets with limited downside beat clever complexity.',
      source: 'The Dhandho Investor',
    },
    {
      year: '2000s–',
      title: 'Shameless cloning',
      lesson:
        'Standing on giants’ shoulders is allowed — understanding remains mandatory.',
      source: 'Pabrai public talks / cloning themes',
    },
    {
      year: 'ongoing',
      title: 'Low fees, high concentration',
      lesson:
        'Fee drag and over-diversification are silent destroyers of asymmetry.',
      source: 'Pabrai Funds method themes',
    },
  ],
  excerpts: [
    {
      id: 'mp-dhandho',
      work: 'The Dhandho Investor',
      locator: 'heads I win',
      quote:
        'Prefer situations where upside is open and downside is limited — odds first, storytelling second.',
      tags: ['dhandho', 'asymmetric', 'odds', 'downside'],
    },
    {
      id: 'mp-clone',
      work: 'Pabrai public talks',
      locator: 'shameless cloning',
      quote:
        'Clone great capital allocators shamelessly — then do the homework so the clone is not cargo-cult.',
      tags: ['cloning', 'buffett', 'homework'],
    },
    {
      id: 'mp-few',
      work: 'The Dhandho Investor / talks',
      locator: 'few bets',
      quote:
        'A handful of carefully chosen asymmetric bets beats a zoo of almost-ideas.',
      tags: ['concentration', 'focus', 'bets'],
    },
    {
      id: 'mp-circle',
      work: 'Pabrai method themes',
      locator: 'circle of competence',
      quote:
        'Stay inside businesses you can understand; cloning does not expand the circle by magic.',
      tags: ['circle', 'competence', 'understand'],
    },
    {
      id: 'mp-lunch',
      work: 'Pabrai public remarks',
      locator: 'Buffett lunch lesson',
      quote:
        'Paying for access to a great allocator’s mind can be cheaper than learning the hard way — still not a substitute for your own checklist.',
      tags: ['learning', 'buffett', 'process'],
    },
  ],
  metricsBound: ['P/B', 'P/E', 'leverage', 'ROE', 'FCF_yield', 'owner_earnings', 'valuation_vs_assumption'],
  layerHints: {},
  citedWorks: [
    'The Dhandho Investor (Mohnish Pabrai)',
    'Pabrai Funds letters / public talks (cloning & Dhandho themes)',
  ],
};
