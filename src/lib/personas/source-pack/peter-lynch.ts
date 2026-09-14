import type { SourcePack } from './types';

/**
 * Deep pack — GARP / know-what-you-own: classify first, PEG homework, local knowledge.
 * Short fair-use themes from One Up on Wall Street / Beating the Street.
 */
export const peterLynchPack: SourcePack = {
  slug: 'peter-lynch',
  status: 'deep',
  title: 'Peter Lynch — classify, know what you own, GARP / PEG homework',
  summary:
    'Classify the stock before you fall in love with the story; dig until you can explain the business simply; growth at a reasonable price beats story-only multiples.',
  screeningChecklist: [
    {
      id: 'classify',
      label: 'Classify the stock',
      howToJudge:
        'Slow grower, stalwart, fast grower, cyclical, turnaround, or asset play? Wrong category → wrong expectations and wrong PEG.',
    },
    {
      id: 'know_what_you_own',
      label: 'Know what you own',
      howToJudge:
        'Can you explain in plain English how it makes money and why earnings should grow? If not, you do not own a thesis — you own a ticker.',
    },
    {
      id: 'peg_screen',
      label: 'PEG / growth vs multiple',
      howToJudge:
        'Relate P/E to expected growth (classic PEG homework). A high P/E with no growth story fails; a moderate P/E with durable growth can clear.',
    },
    {
      id: 'local_edge',
      label: 'Local / scuttlebutt edge',
      howToJudge:
        'Is there observable product, store, or customer evidence — not just a sell-side narrative? Homework beats hot tips.',
    },
    {
      id: 'earnings_story',
      label: 'Earnings story coherence',
      howToJudge:
        'Story and reported growth should rhyme. Story without earnings, or earnings without a durable story, both fail the ten-bagger screen.',
    },
    {
      id: 'balance_sheet_ok',
      label: 'Balance sheet not a landmine',
      howToJudge:
        'Growth stories die on debt walls. Check leverage before celebrating the category.',
    },
    {
      id: 'price_vs_quality',
      label: 'Price fair for the category',
      howToJudge:
        'Stalwarts and fast growers deserve different multiples. Do not pay fast-grower prices for a cyclical peak.',
    },
  ],
  positionRisk: [
    'Misclassification (treating a cyclical peak as a fast grower)',
    'Paying any price because the product is familiar',
    'Ignoring debt while chasing a ten-bagger narrative',
    'Confusing a hot tip with homework',
  ],
  exitRules: [
    'The growth story that justified the multiple is broken (category wrong or earnings stalled)',
    'PEG / multiple no longer reasonable for the remaining growth',
    'Balance-sheet risk that was ignored becomes the main story',
    'Not an exit: a dull quarter in a still-intact fast grower you still understand',
  ],
  cases: [
    {
      year: '1977–1990',
      title: 'Magellan era — classification discipline',
      lesson:
        'Many winners started as understandable businesses in the right category, not as abstract macro bets. Classification prevented paying growth prices for cyclicals.',
      source: 'One Up on Wall Street / Magellan public record (method themes)',
    },
    {
      year: 1989,
      title: 'One Up on Wall Street — know what you own',
      lesson:
        'Local knowledge and simple business models beat opaque “can’t miss” stories. If you cannot explain it, you cannot hold it through volatility.',
      source: 'One Up on Wall Street',
    },
    {
      year: 1993,
      title: 'Beating the Street — homework over tips',
      lesson:
        'Ten-baggers come from earnings compounding you can underwrite — not from tips. Revisit the category when the story changes.',
      source: 'Beating the Street',
    },
  ],
  excerpts: [
    {
      id: 'pl-classify',
      work: 'One Up on Wall Street',
      locator: 'six categories theme',
      quote:
        'Classify first — slow grower, stalwart, fast grower, cyclical, turnaround, asset play — or you will apply the wrong expectations and the wrong multiple.',
      tags: ['classify', 'category', 'GARP', 'growth'],
    },
    {
      id: 'pl-know',
      work: 'One Up on Wall Street',
      locator: 'know what you own',
      quote:
        'Never invest in any idea you cannot illustrate with a crayon — if you do not understand the business, you do not own a thesis.',
      tags: ['know what you own', 'homework', 'business model'],
    },
    {
      id: 'pl-peg',
      work: 'One Up on Wall Street / Magellan themes',
      locator: 'P/E vs growth (PEG homework)',
      quote:
        'Relate the P/E to the growth rate — a fair price for growth is homework, not a slogan. PEG is a screen, not a buy button.',
      tags: ['PEG', 'P/E', 'growth', 'valuation'],
    },
    {
      id: 'pl-local',
      work: 'One Up on Wall Street',
      locator: 'scuttlebutt / local knowledge',
      quote:
        'Useful edges often come from noticing products and customers in daily life — then verifying with numbers — not from cocktail-party tips.',
      tags: ['scuttlebutt', 'local', 'edge', 'homework'],
    },
    {
      id: 'pl-tenbagger',
      work: 'One Up on Wall Street',
      locator: 'ten-bagger theme',
      quote:
        'Big winners usually compound earnings for years in businesses you can follow — story without earnings rarely becomes a ten-bagger.',
      tags: ['ten-bagger', 'earnings', 'compounding', 'revenue_growth'],
    },
  ],
  metricsBound: ['PEG', 'P/E', 'revenue_growth', 'ROE', 'leverage', 'margin_durability'],
  layerHints: {},
  citedWorks: [
    'One Up on Wall Street (Peter Lynch)',
    'Beating the Street (Peter Lynch)',
  ],
};
