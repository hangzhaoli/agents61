import type { SourcePack } from './types';

/**
 * Deep pack — forensic accounting / earnings quality / debate kill-shots first.
 * Short fair-use themes from Greenlight public letters and accounting-trap method.
 */
export const davidEinhornPack: SourcePack = {
  slug: 'david-einhorn',
  status: 'deep',
  title: 'David Einhorn — earnings quality, forensic traps, kill-shots first',
  summary:
    'Interrogate accounting and earnings quality before the bull narrative. Name forensic kill-shots early; debate from facts in the footnotes.',
  screeningChecklist: [
    {
      id: 'kill_shots',
      label: 'Forensic kill-shots first',
      howToJudge:
        'List concrete accounting or business failure modes before writing the bull case. If you cannot name traps, you are not ready.',
    },
    {
      id: 'earnings_quality',
      label: 'Earnings quality',
      howToJudge:
        'Are earnings cash-backed and recurring, or padded by one-timers, aggressive revenue recognition, or capitalize-everything games?',
    },
    {
      id: 'forensic_flags',
      label: 'Footnote / forensic flags',
      howToJudge:
        'Related parties, odd receivables, inventory games, off-balance items, changing definitions — flags demand homework.',
    },
    {
      id: 'cash_vs_accrual',
      label: 'Cash vs accrual rhyme',
      howToJudge:
        'Operating cash and reported earnings should roughly rhyme over time. Persistent divergence is a yellow-to-red flag.',
    },
    {
      id: 'leverage',
      label: 'Leverage & refinancing risk',
      howToJudge:
        'Accounting stories often blow up when leverage meets a funding wall. Map debt maturity and covenants.',
    },
    {
      id: 'incentive_alignment',
      label: 'Incentive / promotion risk',
      howToJudge:
        'Who gets paid for optics? Stock-comp, bonus metrics, and promotional narratives often explain the accounting stretch.',
    },
    {
      id: 'price_vs_assumption',
      label: 'What’s priced if the trap is real',
      howToJudge:
        'If the forensic risk materializes, what remains of equity value? Asymmetry matters more than a clever short slogan.',
    },
  ],
  positionRisk: [
    'Believing GAAP theater without cash confirmation',
    'Missing related-party or recognition games in footnotes',
    'Crowded narrative that punishes early forensic skepticism',
    'Leverage that turns an accounting debate into insolvency',
  ],
  exitRules: [
    'A named forensic kill-shot materializes (fraud path, restatement, cash shortfall)',
    'New filings show the original inversion missed a fatal accounting mode',
    'Incentive and promotional patterns worsen while numbers get cuter',
    'Not an exit: being temporarily unpopular while kill-shots remain dormant and cash still rhymes',
  ],
  cases: [
    {
      year: '2001–2002',
      title: 'Allied Capital critique (method lore)',
      lesson:
        'Persistent forensic questions about valuation and accounting can matter years before consensus agrees — process over popularity.',
      source: 'Greenlight public letters / Fooling Some of the People themes',
    },
    {
      year: '2007–2008',
      title: 'Lehman / financial opacity themes',
      lesson:
        'When leverage and opaque accounting meet a funding stress, footnote skepticism is not optional.',
      source: 'Public Greenlight / crisis-period forensic themes',
    },
    {
      year: 'ongoing',
      title: 'Long/short earnings-quality debates',
      lesson:
        'Both long and short work start with earnings quality — promotion without cash is a trap either way.',
      source: 'Greenlight investor letters (public themes)',
    },
  ],
  excerpts: [
    {
      id: 'de-forensic',
      work: 'Greenlight Capital letters / Fooling Some of the People themes',
      locator: 'forensic accounting discipline',
      quote:
        'Interrogate earnings quality and footnotes before the story — accounting traps often show up in cash, receivables, and related-party details.',
      tags: ['forensic', 'accounting', 'earnings quality', 'footnotes', 'kill-shot'],
    },
    {
      id: 'de-cash',
      work: 'Greenlight method themes',
      locator: 'cash vs reported earnings',
      quote:
        'When reported earnings and cash generation diverge for years, believe the cash trail until proven otherwise.',
      tags: ['cash', 'accrual', 'FCF', 'earnings'],
    },
    {
      id: 'de-invert',
      work: 'Public debate / short-thesis method',
      locator: 'kill-shots before narrative',
      quote:
        'Name the failure modes first — promotion, leverage, and recognition games — then decide if the bull case survives.',
      tags: ['inversion', 'kill-shot', 'debate', 'risk'],
    },
    {
      id: 'de-promo',
      work: 'Greenlight public themes',
      locator: 'promotional narratives',
      quote:
        'Promotional management plus stretchy accounting is a classic combination — incentives explain a lot of “surprising” numbers.',
      tags: ['incentives', 'promotion', 'psychology', 'accounting'],
    },
    {
      id: 'de-asym',
      work: 'Greenlight method themes',
      locator: 'asymmetry',
      quote:
        'Ask what equity is worth if the forensic risk is real — asymmetry beats a clever slogan.',
      tags: ['asymmetry', 'valuation', 'downside', 'risk'],
    },
  ],
  metricsBound: ['leverage', 'ROE', 'margin_durability', 'owner_earnings', 'P/E', 'FCF_yield'],
  layerHints: {
    killShotsFirst: true,
  },
  citedWorks: [
    'Fooling Some of the People All of the Time (David Einhorn)',
    'Greenlight Capital investor letters (public)',
  ],
};
