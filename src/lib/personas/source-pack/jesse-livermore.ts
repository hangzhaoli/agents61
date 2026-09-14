import type { SourcePack } from './types';

/**
 * Deep pack — tape / pivot points / iron stops (Livermore).
 * Research simulation — no trade orders.
 */
export const jesseLivermorePack: SourcePack = {
  slug: 'jesse-livermore',
  status: 'deep',
  title: 'Jesse Livermore — pivot points, iron stops, sit tight',
  summary:
    'Trade with the tape’s confirmed trend; cut losses with iron discipline; let winners run by sitting — never average losers.',
  screeningChecklist: [
    {
      id: 'tape_confirm',
      label: 'Tape confirmation',
      howToJudge:
        'Does price action confirm the line of least resistance — or are you arguing with the tape?',
    },
    {
      id: 'pivot',
      label: 'Pivot / key level defined',
      howToJudge:
        'Is there a clear pivotal point that validates or kills the idea?',
    },
    {
      id: 'cut_loss_rule',
      label: 'Iron stop predefined',
      howToJudge:
        'Is the loss cut written before entry? No stop = incomplete plan (research note — not an order).',
    },
    {
      id: 'no_average_down',
      label: 'No averaging losers',
      howToJudge:
        'Averaging a loser is usually ego — does the plan forbid it?',
    },
    {
      id: 'sit_tight',
      label: 'Sit-tight readiness',
      howToJudge:
        'If confirmed right, can you sit through noise without tinkering?',
    },
    {
      id: 'timing',
      label: 'Timing vs opinion',
      howToJudge:
        'Being early is often indistinguishable from being wrong — wait for confirmation.',
    },
  ],
  positionRisk: [
    'Opinion without tape confirmation',
    'Moving or removing stops after entry',
    'Averaging down a broken thesis',
    'Overtrading instead of sitting with a winner',
  ],
  exitRules: [
    'Stop / pivotal invalidation hit',
    'Tape character changes against the line of least resistance',
    'Original timing was wrong — exit and wait',
    'Not an exit: ordinary noise inside a confirmed trend with intact pivot',
  ],
  cases: [
    {
      year: 1929,
      title: 'Short the crash (public legend)',
      lesson:
        'When the line of least resistance turns down hard, survival and timing dominate narrative.',
      source: 'Public market history / Livermore legend',
    },
    {
      year: 1940,
      title: 'Reminiscences of a Stock Operator (Lefèvre)',
      lesson:
        'The book encodes method: probe, confirm, sit, cut — not tip-chasing.',
      source: 'Reminiscences of a Stock Operator (Edwin Lefèvre)',
    },
    {
      year: 'ongoing',
      title: 'Sitting makes the money',
      lesson:
        'Thinking gets you in; sitting gets you paid — if the thesis remains confirmed.',
      source: 'Livermore / Lefèvre themes',
    },
  ],
  excerpts: [
    {
      id: 'jl-sit',
      work: 'Reminiscences of a Stock Operator',
      locator: 'sitting',
      quote:
        'It never was my thinking that made the big money for me — it always was my sitting.',
      tags: ['sit', 'patience', 'winner', 'tape'],
    },
    {
      id: 'jl-stop',
      work: 'Livermore / Lefèvre themes',
      locator: 'cut losses',
      quote:
        'Define the loss before you need it; hope is not a risk control.',
      tags: ['stop', 'loss', 'discipline', 'risk'],
    },
    {
      id: 'jl-tape',
      work: 'Reminiscences of a Stock Operator',
      locator: 'line of least resistance',
      quote:
        'Prices move along the line of least resistance — argue with the tape at your peril.',
      tags: ['tape', 'trend', 'pivot'],
    },
    {
      id: 'jl-probe',
      work: 'Livermore method themes',
      locator: 'probe then size',
      quote:
        'Probe for confirmation before sizing like a hero — premature size is how operators die.',
      tags: ['probe', 'sizing', 'confirmation'],
    },
    {
      id: 'jl-average',
      work: 'Livermore / Lefèvre themes',
      locator: 'never average a loser',
      quote:
        'Averaging a losing position usually compounds the original error.',
      tags: ['average', 'loser', 'ego', 'exit'],
    },
  ],
  metricsBound: ['revenue_growth', 'valuation_vs_assumption', 'P/E', 'leverage'],
  layerHints: { killShotsFirst: true },
  citedWorks: [
    'Reminiscences of a Stock Operator (Edwin Lefèvre — Livermore method)',
    'How to Trade in Stocks (Jesse Livermore) — pivot / timing themes',
  ],
};
