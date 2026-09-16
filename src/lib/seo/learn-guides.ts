import type { LearnGuide } from '@/lib/seo/hub-types';

export const LEARN_GUIDES: LearnGuide[] = [
  {
    slug: 'research-a-stock-in-20-minutes',
    title: 'Research a stock in 20 minutes',
    description: 'A short path: tape, convene, clerk stack, invert. No buy button at the end.',
    h1: 'Research a stock in 20 minutes — then stop',
    minutes: 8,
    steps: [
      { heading: 'Get the quote elsewhere', body: 'Yahoo, your broker, Koyfin. Agents61 is not the tape.' },
      { heading: 'Open the desk', body: 'Ask the committee with the ticker. Pick Isolated unless you need pipeline handoff.' },
      { heading: 'Read the clerk stack first', body: 'Splits before poetry. If the stack is thin, the run was thin.' },
      { heading: 'Force one kill-condition', body: 'Write what would invalidate the idea. If you cannot, you are not done.' },
    ],
    next: [
      { label: 'How to research a stock (long)', href: '/blog/how-to-research-a-stock' },
      { label: 'Invert a thesis', href: '/learn/invert-a-thesis' },
    ],
  },
  {
    slug: 'invert-a-thesis',
    title: 'Invert an investment thesis',
    description: 'A short inversion drill using the debate seats.',
    h1: 'Invert the thesis before you size',
    minutes: 6,
    steps: [
      { heading: 'State the leftover belief in one sentence', body: 'If it takes a paragraph, you do not have a belief. You have a mood.' },
      { heading: 'Convene with debate in mind', body: 'Ask what kills it. Earnings quality, leverage, cycle, governance.' },
      { heading: 'Do not average the bear', body: 'A 60/40 split is information. A blended “cautiously optimistic” is not.' },
    ],
    next: [
      { label: 'Red-team use case', href: '/use-cases/red-team-a-thesis' },
      { label: 'Red-team NVDA', href: '/blog/how-to-red-team-nvda' },
    ],
  },
  {
    slug: 'convene-isolated-vs-handoff',
    title: 'Isolated vs division of labor',
    description: 'When to flip the method toggle.',
    h1: 'Pick Isolated or Division of labor — then leave it alone',
    minutes: 5,
    steps: [
      { heading: 'Isolated is the default', body: 'One ticker, many methods, no peeking. Use this most days.' },
      { heading: 'Handoff when the question is a sequence', body: 'Trend → cycle → selection → debate. Later groups may read earlier notes.' },
      { heading: 'Never 61²', body: 'Peers in a group still cannot see each other. That is not a bug.' },
    ],
    next: [{ label: 'Full note', href: '/blog/isolated-vs-division-of-labor' }],
  },
  {
    slug: 'read-a-committee-stack',
    title: 'How to read a clerk stack',
    description: 'Read splits before the eloquent seat.',
    h1: 'Read the stack like minutes, not a blog',
    minutes: 5,
    steps: [
      { heading: 'Agreements first', body: 'If nothing agrees, you have noise or a bad run.' },
      { heading: 'Splits second', body: 'Name the methods that diverged. That is the product.' },
      { heading: 'Eloquence last', body: 'A beautiful paragraph from one seat is not a vote.' },
    ],
    next: [{ label: 'Independent then assembled', href: '/blog/independent-then-assembled' }],
  },
  {
    slug: 'crypto-without-fake-pe',
    title: 'Crypto research without a fake P/E',
    description: 'Use the on-chain board. Do not invent a multiple.',
    h1: 'Do not paste a stock template on BTC',
    minutes: 6,
    steps: [
      { heading: 'Open the crypto board', body: 'Not the US equity convene with a ticker hack.' },
      { heading: 'Ask in the right units', body: 'Settlement, fees, issuance, classification — not owner earnings if there are none.' },
      { heading: 'Allow inconclusive', body: 'A seat that invents a P/E has failed the product.' },
    ],
    next: [
      { label: 'Crypto hub', href: '/research/crypto' },
      { label: 'Longer note', href: '/blog/crypto-research-not-pe' },
    ],
  },
  {
    slug: 'pick-a-desk-tier',
    title: 'Pick a desk tier',
    description: '16 / 29 / 48 / 61 — you pay for seats, not a louder chat.',
    h1: 'Pay for how many seats run',
    minutes: 4,
    steps: [
      { heading: 'Analyst 16 / $19', body: 'Working desk. Enough to see isolation work.' },
      { heading: 'Associate 29 / $49', body: 'Bridge. More specialists, not the full 61.' },
      { heading: 'Principal 48 / $79', body: 'Expanded committee. Still not every seat.' },
      { heading: 'Committee $149 or Partners $349', body: 'All 61. Partners is compute and priority, not extra names.' },
    ],
    next: [
      { label: 'Seating note', href: '/blog/seating-3-16-61' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    slug: 'probability-gap-research',
    title: 'Research a prediction-market probability gap',
    description:
      'A short path: import Polymarket odds, run Agents61, read the gap, invert, watchlist. No bet ticket.',
    h1: 'Research a probability gap in 15 minutes — then stop',
    minutes: 8,
    steps: [
      {
        heading: 'Get the market mid from Polymarket',
        body: 'Copy an /event/… or /market/… URL. Agents61 is not the exchange.',
      },
      {
        heading: 'Import and read Market vs Agents61',
        body: 'Paste on /predictions. Note YES%, Agents61 estimate, and the Gap. Range matters — one number is a lie of precision.',
      },
      {
        heading: 'Read why wrong AND why right',
        body: 'A one-sided gap report is marketing. Resolution risk and invalidation come before any “edge” story.',
      },
      {
        heading: 'Watchlist, do not wallet',
        body: 'Track whether the mid moves toward Agents61. Do not treat a gap as a buy YES instruction.',
      },
    ],
    next: [
      { label: 'Prediction Markets', href: '/predictions' },
      { label: 'Hunt gaps use case', href: '/use-cases/hunt-probability-gaps' },
      { label: 'vs Polymarket', href: '/compare/polymarket' },
      { label: 'Blog: Polymarket odds vs AI', href: '/blog/polymarket-odds-vs-ai-research' },
    ],
  },
];

export function getLearnGuide(slug: string) {
  return LEARN_GUIDES.find((g) => g.slug === slug);
}
