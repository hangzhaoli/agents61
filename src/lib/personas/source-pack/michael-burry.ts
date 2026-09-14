import type { SourcePack } from './types';

/**
 * Deep pack — deep value / extreme inversion / filing homework. killShotsFirst.
 * Short fair-use themes from The Big Short method lore + Scion public letters (not wholesale).
 */
export const michaelBurryPack: SourcePack = {
  slug: 'michael-burry',
  status: 'deep',
  title: 'Michael Burry — invert the model, read the filing, patience for mispricing',
  summary:
    'Extreme inversion: what assumptions hide in the model? Prefer primary filings over narratives; wait when the crowd is wrong and the downside is mapped.',
  screeningChecklist: [
    {
      id: 'invert',
      label: 'Invert the model first',
      howToJudge:
        'List the hidden assumptions in the bull model (growth, losses, correlations, refinancing). If assumptions are fragile, the thesis is fragile.',
    },
    {
      id: 'kill_shots',
      label: 'Kill-shots before thesis',
      howToJudge:
        'Require concrete failure modes from filings — not vibes. If you cannot invert cleanly, pass.',
    },
    {
      id: 'filing_homework',
      label: 'Primary filing homework',
      howToJudge:
        'Prospectus, 10-K, footnotes, and segment detail beat secondary summaries. Unread filings = no thesis.',
    },
    {
      id: 'downside_first',
      label: 'Downside mapped',
      howToJudge:
        'What is left if the optimistic path fails? Open-ended downside without a floor fails deep-value work.',
    },
    {
      id: 'margin_of_safety',
      label: 'Margin of safety vs model risk',
      howToJudge:
        'Discount must cover model error and bad paths — statistical cheapness alone is not enough.',
    },
    {
      id: 'leverage',
      label: 'Leverage / structure risk',
      howToJudge:
        'Structured products, debt walls, and embedded leverage often hide in plain sight. Map who eats the tail.',
    },
    {
      id: 'patience_mispricing',
      label: 'Patience for mispricing',
      howToJudge:
        'Being early and lonely is common. If the thesis needs immediate consensus validation, it is not this method.',
    },
  ],
  positionRisk: [
    'Model assumptions that only work in one regime',
    'Skipping primary documents for a narrative summary',
    'Leverage and structured risk misunderstood until stress hits',
    'Impatience that exits before the mispricing resolves (or before the kill-shot is proven)',
  ],
  exitRules: [
    'A named kill-shot from the filing materializes',
    'New primary documents falsify the inverted assumptions',
    'Downside floor disappears (structure risk larger than appraisal)',
    'Not an exit: prolonged unpopularity while filings still support the inversion',
  ],
  cases: [
    {
      year: '2005–2007',
      title: 'Housing / structured credit inversion (method lore)',
      lesson:
        'Reading the underlying documents and inverting correlations beat consensus models that assumed continuous benign history.',
      source: 'The Big Short method portrayals / Scion public record themes',
    },
    {
      year: '2000s',
      title: 'Deep-value equity homework',
      lesson:
        'Unpopular equities with filing-backed asymmetry can sit idle for years — patience is part of the process.',
      source: 'Scion Capital letter themes (public)',
    },
    {
      year: 'ongoing',
      title: 'Model risk over narrative',
      lesson:
        'The edge is often “what breaks if the model’s quiet assumptions fail” — not a louder story.',
      source: 'Public Burry method themes',
    },
  ],
  excerpts: [
    {
      id: 'mb-invert',
      work: 'Scion / Big Short method themes',
      locator: 'invert the model',
      quote:
        'Ask what assumptions hide in the consensus model — growth, loss rates, correlations, refinancing — then test them in primary documents.',
      tags: ['inversion', 'model', 'kill-shot', 'assumptions'],
    },
    {
      id: 'mb-filing',
      work: 'Public Burry method themes',
      locator: 'read the filing',
      quote:
        'Primary filings and prospectuses beat secondary narratives — unread documents mean you do not have a thesis.',
      tags: ['filing', '10-K', 'homework', 'forensic'],
    },
    {
      id: 'mb-patience',
      work: 'Scion Capital letter themes',
      locator: 'patience',
      quote:
        'Mispricings can take years to resolve; loneliness is not proof you are wrong — nor proof you are right without filings.',
      tags: ['patience', 'mispricing', 'value', 'horizon'],
    },
    {
      id: 'mb-downside',
      work: 'Deep-value method themes',
      locator: 'downside first',
      quote:
        'Map permanent-loss paths before celebrating asymmetry — open-ended downside is not a bargain.',
      tags: ['downside', 'margin of safety', 'risk', 'permanent_loss'],
    },
    {
      id: 'mb-structure',
      work: 'Structured-credit method lore',
      locator: 'embedded leverage',
      quote:
        'Embedded leverage and structure often matter more than the headline story — ask who eats the tail when correlations go to one.',
      tags: ['leverage', 'structure', 'tail', 'correlation'],
    },
  ],
  metricsBound: ['P/B', 'P/E', 'leverage', 'ROE', 'valuation_vs_assumption', 'owner_earnings'],
  layerHints: {
    killShotsFirst: true,
  },
  citedWorks: [
    'Scion Capital investor letters (public themes)',
    'The Big Short (method portrayal — use as case lore, not scripture)',
  ],
};
