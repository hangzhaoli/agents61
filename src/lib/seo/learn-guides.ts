import type { LearnGuide } from '@/lib/seo/hub-types';

export const LEARN_GUIDES: LearnGuide[] = [
  {
    slug: 'research-a-stock-in-20-minutes',
    title: 'Research a stock in 20 minutes',
    description: 'A short path: tape, convene, clerk stack, invert. No buy button at the end.',
    h1: 'Research a stock in 20 minutes — then stop',
    minutes: 8,
    intro:
      'This is a homework drill, not a trading session. Pull the quote elsewhere, staff the desk, read splits, write one kill-condition, then stop — before fluency turns into a false sense of completion.',
    steps: [
      {
        heading: 'Get the quote elsewhere',
        body: 'Yahoo, your broker, or Koyfin for last price, a quick chart, and a path to filings. Agents61 is not the tape. Confirm the ticker exists and you are looking at the right share class before you spend seats.',
      },
      {
        heading: 'Open the desk and pick a mode',
        body: 'Register if you need an account, then ask the committee with the ticker. Use Isolated unless the question is clearly a sequence (trend → cycle → selection → debate). Empty seats stay empty — that is the product.',
      },
      {
        heading: 'Read the clerk stack first',
        body: 'Agreements before poetry. Splits before the most eloquent seat. If the stack is thin, the run was thin — do not paper over it with a fluent paragraph from one master.',
      },
      {
        heading: 'Force one kill-condition — then stop',
        body: 'Write what would invalidate the idea in one sentence. If you cannot, you are not done. Do not end the drill with a buy button. Size and execution stay outside Agents61.',
      },
    ],
    next: [
      { label: 'How to research a stock (long)', href: '/blog/how-to-research-a-stock' },
      { label: 'Invert a thesis', href: '/learn/invert-a-thesis' },
      { label: 'Read a clerk stack', href: '/learn/read-a-committee-stack' },
    ],
    ctaTitle: 'Register and run the 20-minute drill on a real ticker',
    ctaBody:
      'Create an account, staff isolated seats, and read the clerk stack. Same rule as this guide: stop after one kill-condition — research simulation, not a trade ticket.',
  },
  {
    slug: 'invert-a-thesis',
    title: 'Invert an investment thesis',
    description: 'A short inversion drill using the debate seats.',
    h1: 'Invert the thesis before you size',
    minutes: 6,
    intro:
      'Inversion is cheaper before size than after. Use debate seats so the bull narrative cannot edit the bear narrative. The output is kill-conditions — not a sell order.',
    steps: [
      {
        heading: 'State the leftover belief in one sentence',
        body: 'If it takes a paragraph, you do not have a belief. You have a mood. Write the sentence you would be embarrassed to be wrong about.',
      },
      {
        heading: 'Convene with debate in mind',
        body: 'Ask what kills it: earnings quality, leverage, cycle, governance, customer concentration. Staff dedicated debate seats — do not rely on remembering to prompt a chatbot.',
      },
      {
        heading: 'Do not average the bear',
        body: 'A 60/40 split is information. A blended “cautiously optimistic” is not. Read the clerk stack for named disagreement, then decide whether the leftover belief still deserves size.',
      },
    ],
    next: [
      { label: 'Red-team use case', href: '/use-cases/red-team-a-thesis' },
      { label: 'Red-team NVDA', href: '/blog/how-to-red-team-nvda' },
    ],
    ctaTitle: 'Register and invert a thesis you already like',
    ctaBody:
      'Create an account and staff debate seats before you size. Kill-conditions stay on the page — research simulation, not a sell ticket.',
  },
  {
    slug: 'convene-isolated-vs-handoff',
    title: 'Isolated vs division of labor',
    description: 'When to flip the method toggle.',
    h1: 'Pick Isolated or Division of labor — then leave it alone',
    minutes: 5,
    intro:
      'Two writing modes. One default. Do not thrash the toggle mid-run. Isolation prevents peeking; handoff sequences the question without turning peers into a group chat.',
    steps: [
      {
        heading: 'Isolated is the default',
        body: 'One ticker, many methods, no peeking. Use this most days. Buffett and Wood can disagree without either reading the other’s draft. The clerk stacks after.',
      },
      {
        heading: 'Handoff when the question is a sequence',
        body: 'Trend → cycle → selection → debate. Later groups may read earlier notes. That is useful when regime context should constrain selection — not when you want pure method independence.',
      },
      {
        heading: 'Never 61²',
        body: 'Peers in a group still cannot see each other. That is not a bug. A full mesh debate is theater, not a committee.',
      },
    ],
    next: [
      { label: 'Full note', href: '/blog/isolated-vs-division-of-labor' },
      { label: 'Isolated briefs use case', href: '/use-cases/isolated-briefs' },
    ],
  },
  {
    slug: 'read-a-committee-stack',
    title: 'How to read a clerk stack',
    description: 'Read splits before the eloquent seat.',
    h1: 'Read the stack like minutes, not a blog',
    minutes: 5,
    intro:
      'The clerk does not vote. It records. Treat the stack as meeting minutes: structure first, rhetoric last.',
    steps: [
      {
        heading: 'Agreements first',
        body: 'If nothing agrees, you have noise or a bad run. Shared kill-conditions or shared facts are the useful kind of agreement — not a fake consensus rating.',
      },
      {
        heading: 'Splits second',
        body: 'Name the methods that diverged. That is the product. A growth seat and a value seat disagreeing is information, not a bug to average away.',
      },
      {
        heading: 'Eloquence last',
        body: 'A beautiful paragraph from one seat is not a vote. Do not let the best writer become the room. Size stays yours; the stack stays split.',
      },
    ],
    next: [{ label: 'Independent then assembled', href: '/blog/independent-then-assembled' }],
  },
  {
    slug: 'crypto-without-fake-pe',
    title: 'Crypto research without a fake P/E',
    description: 'Use the on-chain board. Do not invent a multiple.',
    h1: 'Do not paste a stock template on BTC',
    minutes: 6,
    intro:
      'Wrong units are a product defect. The crypto board exists so seats ask settlement, fees, issuance, and classification questions — not owner earnings that do not exist.',
    steps: [
      {
        heading: 'Open the crypto board',
        body: 'Not the US equity convene with a ticker hack. Use the on-chain desk so the template cannot smuggle equity language into a token.',
      },
      {
        heading: 'Ask in the right units',
        body: 'Settlement asset, monetary premium, fees, issuance, energy and classification risk — not a pasted P/E. Write the question so a seat that invents a multiple fails the brief.',
      },
      {
        heading: 'Allow inconclusive',
        body: 'A seat that invents a P/E has failed the product. Missing metrics should stay inconclusive. Execution still lives on your exchange — Agents61 does not route orders.',
      },
    ],
    next: [
      { label: 'Crypto hub', href: '/research/crypto' },
      { label: 'Longer note', href: '/blog/crypto-research-not-pe' },
      { label: 'Use case', href: '/use-cases/crypto-on-chain-desk' },
    ],
  },
  {
    slug: 'pick-a-desk-tier',
    title: 'Pick a desk tier',
    description: '16 / 29 / 48 / 61 — you pay for seats, not a louder chat.',
    h1: 'Pay for how many seats run',
    minutes: 4,
    intro:
      'Tiers unlock staffing. Locked seats stay dark. Partners is compute and priority — not extra costume names.',
    steps: [
      {
        heading: 'Analyst 16 / $19',
        body: 'Working desk. Enough to see isolation work on a real ticker without paying for the full 61.',
      },
      {
        heading: 'Associate 29 / $49',
        body: 'Bridge tier. More specialists, still not every seat. Use when 16 feels thin on domain coverage.',
      },
      {
        heading: 'Principal 48 / $79',
        body: 'Expanded committee. Most methodologies unlocked; a few remain dark. Still pays for empty chairs on purpose.',
      },
      {
        heading: 'Committee $149 or Partners $349',
        body: 'All 61. Partners is compute and priority, not extra names. You still get isolation and a clerk — not a louder group chat.',
      },
    ],
    next: [
      { label: 'Seating note', href: '/blog/seating-3-16-61' },
      { label: 'Pricing', href: '/pricing' },
    ],
    ctaTitle: 'Register, then pick seating on pricing',
    ctaBody:
      'Create an account to open the desk. Choose how many seats run on /pricing — you pay for staffing, not a composite rating.',
    ctaHref: '/pricing',
    ctaGuestHref: '/register?next=%2Fpricing',
  },
  {
    slug: 'probability-gap-research',
    title: 'Research a prediction-market probability gap',
    description:
      'A short path: import Polymarket odds, run Agents61, read the gap, invert, watchlist. No bet ticket.',
    h1: 'Research a probability gap in 15 minutes — then stop',
    minutes: 8,
    intro:
      'Polymarket sets the mid. Agents61 researches whether that probability holds under independent seats. Gaps are disagreement — not a Buy YES instruction. Stop after watchlist.',
    steps: [
      {
        heading: 'Get the market mid from Polymarket',
        body: 'Copy an /event/… or /market/… URL from Polymarket. Note the YES mid and resolution wording. Agents61 is not the exchange and will not open a wallet for you.',
      },
      {
        heading: 'Import and read Market vs Agents61',
        body: 'Paste on /predictions (or open Top Gaps / Scanner). Note YES%, Agents61 estimate, range, and the Gap. A single point estimate without a range is a lie of precision — read the range.',
      },
      {
        heading: 'Read why wrong AND why right',
        body: 'A one-sided gap report is marketing. Resolution risk, information risk, and invalidation come before any “edge” story. If resolution wording is ambiguous, treat the gap as research noise until clarified.',
      },
      {
        heading: 'Watchlist, do not wallet — then stop',
        body: 'Track whether the mid moves toward Agents61. Do not treat a gap as a buy YES instruction. Free desks get one Analyze; paid desks add news layer and Pro Clerk. Execution stays on Polymarket if you trade at all.',
      },
    ],
    next: [
      { label: 'Prediction Markets', href: '/predictions' },
      { label: 'Hunt gaps use case', href: '/use-cases/hunt-probability-gaps' },
      { label: 'vs Polymarket', href: '/compare/polymarket' },
      { label: 'Blog: Polymarket odds vs AI', href: '/blog/polymarket-odds-vs-ai-research' },
    ],
    ctaTitle: 'Register and research your first probability gap',
    ctaBody:
      'Create an account to open Prediction Markets, run Analyze, and watchlist mids. Keep Polymarket for trading — Agents61 stays research-only.',
    ctaHref: '/predictions',
    ctaGuestHref: '/register?next=%2Fpredictions',
  },
];

export function getLearnGuide(slug: string) {
  return LEARN_GUIDES.find((g) => g.slug === slug);
}
