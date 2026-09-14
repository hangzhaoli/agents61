import type { SourcePack } from './types';

/**
 * Deep pack — Magic Formula (earnings yield + ROC) + special situations.
 * Short fair-use themes from The Little Book That Beats the Market / You Can Be a Stock Market Genius.
 */
export const joelGreenblattPack: SourcePack = {
  slug: 'joel-greenblatt',
  status: 'deep',
  title: 'Joel Greenblatt — Magic Formula (EY + ROC) + special situations',
  summary:
    'Rank on high return on capital and cheap earnings yield; switch to special-sits process when spinoffs/mergers/recaps dominate the story.',
  screeningChecklist: [
    {
      id: 'earnings_yield',
      label: 'Earnings yield (cheap vs EBIT/EV)',
      howToJudge:
        'Is the business cheap on owner earnings / EBIT versus enterprise value? High yield because earnings are peak-cyclical or fake fails.',
    },
    {
      id: 'high_roic',
      label: 'High return on capital',
      howToJudge:
        'Does the business earn high ROC/ROIC on tangible capital? Low ROC dressed as growth fails the formula leg.',
    },
    {
      id: 'formula_legs',
      label: 'Both Magic Formula legs',
      howToJudge:
        'Prefer high ROC and high earnings yield together. One strong leg with one broken leg is not a formula pass.',
    },
    {
      id: 'earnings_quality',
      label: 'Earnings sustainability',
      howToJudge:
        'Earnings used in the yield must be sustainable — not a one-time spike, accounting fiction, or cyclical peak.',
    },
    {
      id: 'special_sit',
      label: 'Special situation (if any)',
      howToJudge:
        'Spinoff, merger stub, recap, or distress? If yes, evaluate the mechanic and process — not the brand story.',
    },
    {
      id: 'balance_sheet_ok',
      label: 'Balance sheet not a landmine',
      howToJudge:
        'Cheapness that requires heroic refinancing is not Magic Formula work. Check leverage.',
    },
    {
      id: 'price_vs_quality',
      label: 'Good business at non-stupid price',
      howToJudge:
        'A good business (high ROC) at a non-stupid price beats a mediocre business that looks statistically cheap.',
    },
  ],
  positionRisk: [
    'High earnings yield from peak-cyclical or fictional earnings',
    'Ignoring low ROC because the story is exciting',
    'Treating a special situation as a formula screen (or vice versa)',
    'Leverage that turns a “cheap” print into permanent loss',
  ],
  exitRules: [
    'Either formula leg breaks (ROC collapses or yield was an accounting mirage)',
    'Special-sit mechanic resolves against you or the process thesis fails',
    'Better formula opportunities clearly dominate after friction (research note — not a trade ticket)',
    'Not an exit: temporary unpopularity while both legs remain intact',
  ],
  cases: [
    {
      year: 2005,
      title: 'The Little Book — Magic Formula pedagogy',
      lesson:
        'Simple ranking on cheapness + quality of capital returns beats mysticism — still a screen, not a buy button.',
      source: 'The Little Book That Beats the Market',
    },
    {
      year: 1997,
      title: 'You Can Be a Stock Market Genius — special sits',
      lesson:
        'Spinoffs and special situations need process homework; formula ranking is the wrong tool when the mechanic is the edge.',
      source: 'You Can Be a Stock Market Genius',
    },
    {
      year: 'ongoing',
      title: 'Boring as a feature',
      lesson:
        'Formula winners are often boring high-ROC businesses at reasonable yields — excitement is not a leg.',
      source: 'Little Book method themes',
    },
  ],
  excerpts: [
    {
      id: 'jg-formula',
      work: 'The Little Book That Beats the Market',
      locator: 'Magic Formula ranking',
      quote:
        'Buy good businesses (high return on capital) at cheap prices (high earnings yield) — rank simply; do not replace the formula with a story.',
      tags: ['magic formula', 'ROIC', 'earnings yield', 'ROC', 'cheap'],
    },
    {
      id: 'jg-ey',
      work: 'The Little Book That Beats the Market',
      locator: 'earnings yield theme',
      quote:
        'Earnings yield asks how cheap the enterprise is versus earnings power — high yield from fake or peak earnings is not cheapness.',
      tags: ['earnings yield', 'EBIT', 'EV', 'valuation'],
    },
    {
      id: 'jg-roc',
      work: 'The Little Book That Beats the Market',
      locator: 'return on capital',
      quote:
        'High return on capital marks a good business; low ROC with a growth narrative still fails the quality leg.',
      tags: ['ROIC', 'ROC', 'quality', 'capital'],
    },
    {
      id: 'jg-special',
      work: 'You Can Be a Stock Market Genius',
      locator: 'special situations',
      quote:
        'Spinoffs, mergers, and recaps follow a different checklist — process and mechanics over brand stories.',
      tags: ['special situation', 'spinoff', 'merger', 'process'],
    },
    {
      id: 'jg-simple',
      work: 'The Little Book That Beats the Market',
      locator: 'simplicity',
      quote:
        'Figure out the value, pay less — mysticism and tip-chasing are not substitutes for the two formula legs.',
      tags: ['value', 'process', 'homework'],
    },
  ],
  metricsBound: ['ROIC', 'ROE', 'P/E', 'earnings_yield', 'leverage', 'margin_durability', 'FCF_yield'],
  layerHints: {},
  citedWorks: [
    'The Little Book That Beats the Market (Joel Greenblatt)',
    'You Can Be a Stock Market Genius (Joel Greenblatt)',
  ],
};
