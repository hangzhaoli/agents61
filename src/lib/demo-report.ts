/**
 * Canned Observer sample for the homepage demo.
 * Written like short IC notes — not brochure copy. Never "you should buy."
 */

export type DemoStance = 'constructive' | 'cautious' | 'skeptical';

export const DEMO_TICKER = 'AAPL';
export const DEMO_NAME = 'Apple Inc.';
export const DEMO_PLAN = 'Observer · 3 isolated seats + 1 clerk';

export const DEMO_USER_PROMPT =
  'Staff Observer on AAPL. Dig quality vs price. Isolated briefs, then clerk underwrite frame. No buy rating.';

export const DEMO_SUGGESTIONS = [
  'Staff Observer on AAPL',
  'Is AAPL still a ten-year hold at this multiple?',
  'Invert the AAPL bull case',
];

/** Looks like a US ticker, not a question. */
export function looksLikeTicker(raw: string): boolean {
  return /^[A-Za-z]{1,5}(-[A-Za-z])?$/.test(raw.trim());
}

export const DEMO_BRIEFS: {
  slug: string;
  stance: DemoStance;
  looksAt: string;
  finding: string;
  falsifier: string;
}[] = [
  {
    slug: 'warren-buffett',
    stance: 'constructive',
    looksAt: 'Owner earnings + services mix + buyback discipline',
    finding:
      'Apple is still a cash compounder you can explain to a non-specialist: hardware habit funding a high-margin services stack, with buybacks returning capital instead of empire-building — so far.\n\nThe fight is not “is Apple famous.” It is whether owner earnings grow through the next unit cycle without China and App Store regulation chewing the cash engine.\n\nUnderwrite frame: Worth further homework — quality is visible; price still has to clear your own hurdle.',
    falsifier: 'Services growth stalls while buybacks become the whole thesis, or ROIC rolls over for three prints in a row.',
  },
  {
    slug: 'peter-lynch',
    stance: 'constructive',
    looksAt: 'Lynch category: stalwart with services attach — not a story stock',
    finding:
      'You see the product in ordinary life. That puts AAPL in the stalwart bucket with an attach story, not a biotech narrative.\n\nClassify first: if you need a TED talk to explain the growth, you mis-labeled it. Watch unit elasticity and services ARPU — those are observable, not mystical.\n\nUnderwrite frame: Worth further homework if the category still matches what you actually use.',
    falsifier: 'The product stops showing up in daily life, or you realize you bought a cyclical labeled as a compounder.',
  },
  {
    slug: 'charlie-munger',
    stance: 'cautious',
    looksAt: 'Inversion: what makes a smart holder look stupid',
    finding:
      'Wonderful company ≠ wonderful price. Invert: concentration risk, a rich multiple, and management hubris can wreck the holder even when the franchise is real.\n\nAsk what has to go right for the bull to need the multiple to re-rate. If the answer is “everything,” you are not underwriting — you are hoping.\n\nUnderwrite frame: Pass for now at a price that only works if perfection continues — unless your own worksheet clears margin of safety.',
    falsifier: 'The thesis requires multiple expansion for the math to work.',
  },
];

export const DEMO_ASSEMBLY = {
  counts: { constructive: 2, cautious: 1, skeptical: 0, inconclusive: 0 },
  agreements: [
    {
      slugs: ['warren-buffett', 'peter-lynch', 'charlie-munger'],
      text: 'Franchise quality is not the fight — all three can explain the cash engine without mythology.',
    },
    {
      slugs: ['warren-buffett', 'peter-lynch', 'charlie-munger'],
      text: 'This is an underwriting problem (business + price), not a greater-fool tape.',
    },
  ],
  splits: [
    {
      slugs: ['warren-buffett', 'peter-lynch'],
      text: 'Quality at a fair-to-full price can stay on the homework list.',
    },
    {
      slugs: ['charlie-munger'],
      text: 'Price still has to survive inversion — a rich multiple is a silent risk, not a detail.',
    },
  ],
  residual: 'Multiple compression, China mix, and capital-allocation drift. Not a timing call.',
  clerkNote:
    'Observer sample. Underwrite frame: Split — your judgment on price vs quality. Empty seats stay empty. Research simulation. Not a recommendation. Not a buy button.',
};
