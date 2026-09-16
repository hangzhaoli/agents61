import type { SeoHub } from '@/lib/seo/hub-types';

export const USE_CASE_HUBS: SeoHub[] = [
  {
    slug: 'red-team-a-thesis',
    path: '/use-cases/red-team-a-thesis',
    keyword: 'red team a stock idea',
    title: 'Use Case: Red-Team a Stock Thesis',
    description:
      'Invert an investment thesis with dedicated debate seats. Kill the idea before the bull paragraph becomes the room.',
    h1: 'Use case: red-team the leftover belief',
    eyebrow: 'Use cases · Debate',
    intro:
      'You already like the name. That is the danger. Staff Einhorn on earnings quality, Burry on hidden assumptions, Munger on inversion. Isolation keeps the bull seat from editing the bear seat.',
    bullets: [
      'Dedicated debate layer in the six-step pipeline.',
      'Clerk stacks splits — it does not vote them away.',
      'Works on US tickers, ETFs, and the crypto board.',
      'Ends in kill-conditions, not a sell button.',
    ],
    sections: [
      {
        heading: 'When to run it',
        body: 'After a first pass, before size. If you cannot write what would kill the idea, you do not have a thesis. You have a mood. The desk externalizes that drill so fluency cannot skip it.',
      },
      {
        heading: 'How isolation helps inversion',
        body: 'If the bear seat can read the bull’s first paragraph, you paid for costumes. Isolated debate seats write under their own rules. The clerk shows the split instead of negotiating a blended “cautiously optimistic.”',
      },
      {
        heading: 'What good output looks like',
        body: 'Named kill-conditions, earnings-quality flags, and cycle or governance risks that survive a fluent bull memo. You still decide. The product refuses “you should sell.”',
      },
    ],
    faqs: [
      {
        question: 'Will the desk tell me to sell?',
        answer: 'No. It will write kill-conditions. You still decide.',
      },
      {
        question: 'Can I red-team a Seeking Alpha thesis?',
        answer: 'Yes — bring the ticker, staff debate seats, keep the article as context. See /compare/seeking-alpha.',
      },
      {
        question: 'Isolated or division of labor?',
        answer:
          'Isolated for a clean invert. Pipeline handoff when you want cycle or selection notes before debate. See /learn/invert-a-thesis.',
      },
    ],
    related: [
      { label: 'Red-team NVDA note', href: '/blog/how-to-red-team-nvda' },
      { label: 'Compare vs ChatGPT', href: '/compare/chatgpt' },
      { label: 'Learn: invert', href: '/learn/invert-a-thesis' },
    ],
    ctaTitle: 'Register and red-team a ticker you already like',
    ctaBody:
      'Create an account, staff debate seats, and keep the bull narrative from editing the bear. Research simulation — not a sell ticket.',
  },
  {
    slug: 'isolated-briefs',
    path: '/use-cases/isolated-briefs',
    keyword: 'isolated investment research',
    title: 'Use Case: Isolated Master Briefs',
    description:
      'Run Buffett and Wood on the same ticker without either reading the other. Isolation is the default writing mode.',
    h1: 'Use case: isolated briefs on one ticker',
    eyebrow: 'Use cases · Isolated',
    intro:
      'Multi-agent theater that shares a draft is still one voice. Isolated mode is the product: unlocked seats see the ticker and their own rules only. A clerk assembles after.',
    bullets: [
      'Default mode on the desk.',
      'Empty seats stay empty — you pay for staffing, not volume of chat.',
      'Division of labor is the other switch, not a 61² debate.',
      'Clerk stacks agreements and splits — no consensus badge.',
    ],
    sections: [
      {
        heading: 'Why isolation is cheaper to trust',
        body: 'Fake consensus is expensive. If every seat can see the first fluent paragraph, you paid for costumes. Isolation is the rule that makes “61 masters” mean something.',
      },
      {
        heading: 'How to read the result',
        body: 'Agreements first. Splits second. Eloquence last. A beautiful paragraph from one seat is not a vote. See /learn/read-a-committee-stack.',
      },
      {
        heading: 'When to flip the other switch',
        body: 'Use Division of labor when the question is a sequence (trend → cycle → selection → debate). Peers in a group still cannot see each other. That is not a bug.',
      },
    ],
    faqs: [
      {
        question: 'Can seats talk to each other in isolated mode?',
        answer: 'No. That is the point.',
      },
      {
        question: 'Do locked seats still influence the brief?',
        answer: 'No. Empty chairs stay empty. You unlock staffing with tier.',
      },
      {
        question: 'Buffett and Wood on the same ticker — really?',
        answer:
          'Yes — that is a named demo of isolation. Neither reads the other’s draft before the clerk stacks. See /blog/buffett-wood-same-ticker.',
      },
    ],
    related: [
      { label: 'Isolated vs division of labor', href: '/blog/isolated-vs-division-of-labor' },
      { label: 'Buffett and Wood', href: '/blog/buffett-wood-same-ticker' },
    ],
  },
  {
    slug: 'crypto-on-chain-desk',
    path: '/use-cases/crypto-on-chain-desk',
    keyword: 'crypto due diligence AI',
    title: 'Use Case: On-Chain Committee Desk',
    description:
      'Run an investment committee on BTC or ETH without pasting a stock P/E onto a token.',
    h1: 'Use case: on-chain desk, correct units',
    eyebrow: 'Use cases · Crypto',
    intro:
      'Ask what the monetary premium is, not what the “earnings” are. The crypto board exists so the template cannot lie.',
    bullets: [
      'Separate from the US equity tape.',
      'Inconclusive is allowed when the metric does not exist.',
      'No exchange ticket.',
      'BTC, ETH, SOL and listed board names — not every meme ticker.',
    ],
    sections: [
      {
        heading: 'Example prompt shape',
        body: '“Research BTC as a settlement asset over a ten-year hold. Do not invent a multiple. Invert the energy and classification risks.” Wrong units are a product defect — seats should refuse fake P/Es.',
      },
      {
        heading: 'Why a separate board',
        body: 'Equity templates smuggle earnings language into tokens. The on-chain desk forces settlement, fees, issuance, and classification questions instead.',
      },
      {
        heading: 'What you still need elsewhere',
        body: 'Prices and execution live on your exchange or tape. Agents61 writes research. No order routing.',
      },
    ],
    faqs: [
      {
        question: 'Which assets?',
        answer: 'BTC, ETH, SOL and the board listed under /research/crypto. Not every meme ticker.',
      },
      {
        question: 'Will a seat invent a P/E?',
        answer: 'It should not. Inconclusive is allowed. A fake multiple is a failed run.',
      },
      {
        question: 'Is this trading advice?',
        answer: 'No. Research simulation on the crypto board — not a ticket.',
      },
    ],
    related: [
      { label: 'Crypto research hub', href: '/research/crypto' },
      { label: 'Bitcoin is not a P/E', href: '/blog/crypto-research-not-pe' },
      { label: 'Learn guide', href: '/learn/crypto-without-fake-pe' },
    ],
  },
  {
    slug: 'private-company-desk',
    path: '/use-cases/private-company-desk',
    keyword: 'private company research AI',
    title: 'Use Case: Private Company Desk',
    description:
      'Stress OpenAI, Stripe, or Anduril from public sources. Research simulation — not a secondary share.',
    h1: 'Use case: private desk, public sources',
    eyebrow: 'Use cases · Private',
    intro:
      'The question is not “should I buy the round.” The question is whether the story survives a red team using only what a stranger can read.',
    bullets: [
      'Six names on the public private board.',
      'SpaceX listed research is /stocks/spcx.',
      'No cap-table, no allocation.',
      'Fluency without a source is a defect.',
    ],
    sections: [
      {
        heading: 'Honest output',
        body: 'A seat that cannot see revenue should say so. Fluency without a source is a defect. The private desk exists to stress public narratives — not to invent diligence you do not have.',
      },
      {
        heading: 'What this is not',
        body: 'Not fundraising. Not brokerage. Not a secondary marketplace. Not a claim that you can buy the company from this page.',
      },
      {
        heading: 'How to use it',
        body: 'Open a private board name → staff unlocked seats → demand kill-conditions → treat gaps in public data as inconclusive, not as permission to invent.',
      },
    ],
    faqs: [
      {
        question: 'Is this fundraising or brokerage?',
        answer: 'Neither.',
      },
      {
        question: 'Which companies?',
        answer: 'The public private board under /research/private — plus SpaceX-style listed research where noted.',
      },
      {
        question: 'Can seats use non-public data?',
        answer: 'No. Public sources only. Missing numbers should stay inconclusive.',
      },
    ],
    related: [
      { label: 'Private hub', href: '/research/private' },
      { label: 'Pre-IPO note', href: '/blog/pre-ipo-research-simulation' },
    ],
  },
  {
    slug: 'etf-committee',
    path: '/use-cases/etf-committee',
    keyword: 'ETF research committee',
    title: 'Use Case: ETF Committee Research',
    description:
      'Run QQQ or a sector ETF through isolated seats. A rating-free committee note — not a star, not a buy.',
    h1: 'Use case: ETF as a ticker, not a vibe',
    eyebrow: 'Use cases · ETFs',
    intro:
      'An ETF is a ruleset plus a book. Staff cycle and selection seats on the index, not a slogan about “owning the future.”',
    bullets: [
      'US ETFs adjacent to the equity desk.',
      'No Morningstar star substitute.',
      'Useful before you add or trim size you already decided.',
      'Concentration and cycle sensitivity on the record.',
    ],
    sections: [
      {
        heading: 'What to ask',
        body: 'Concentration, cycle sensitivity, and what the methodology would refuse to hold inside the wrapper. “Own the future” is not a research question.',
      },
      {
        heading: 'Stars vs splits',
        body: 'Morningstar rates funds with a familiar grammar. Agents61 will not give you five stars on QQQ. It will stack isolated methods and show where they disagree. See /compare/morningstar.',
      },
      {
        heading: 'When to run it',
        body: 'Before you add or trim size you already decided — not as a buy button substitute for a core holding.',
      },
    ],
    faqs: [
      {
        question: 'Do you cover every ETF?',
        answer: 'US-listed first. The desk is not a global fund plant.',
      },
      {
        question: 'Is this a Morningstar alternative?',
        answer: 'No. Different job. See /compare/morningstar.',
      },
      {
        question: 'Example ticker?',
        answer: 'Start with /stocks/qqq or another US-listed ETF you already hold.',
      },
    ],
    related: [
      { label: 'ETF research note', href: '/blog/etf-research-without-a-rating' },
      { label: 'QQQ page', href: '/stocks/qqq' },
      { label: 'vs Morningstar', href: '/compare/morningstar' },
    ],
  },
  {
    slug: 'cycle-first-research',
    path: '/use-cases/cycle-first-research',
    keyword: 'market cycle research AI',
    title: 'Use Case: Cycle-First Research',
    description:
      'Start with Dalio / Marks / Templeton overlay, then pick names. A regime note — not a timing ticket.',
    h1: 'Use case: cycle first, ticker second',
    eyebrow: 'Use cases · Cycle',
    intro:
      '“Where are we in the cycle?” is a research question. It is not a buy-the-dip button. Run the meter, then convene names that survive that regime.',
    bullets: [
      'Cycle meter on the marketing site and the desk.',
      'Division of labor can hand the regime note to selection.',
      'No promised calling of tops.',
      'Map first — then staff tickers that survive the regime.',
    ],
    sections: [
      {
        heading: 'Honesty',
        body: 'Cycle work is a map. Maps are wrong at the edges. The product will not sell you a date, a top call, or a timing ticket.',
      },
      {
        heading: 'How it plugs into the pipeline',
        body: 'In Division of labor, cycle seats can hand a regime note to selection and debate. Isolated mode still lets you ask cycle questions — without pretending the rest of the room already agreed.',
      },
      {
        heading: 'What to do next',
        body: 'Read the meter → pick tickers that fit the regime question → staff selection and invert → size remains yours.',
      },
    ],
    faqs: [
      {
        question: 'Is this market timing advice?',
        answer: 'No. It is a regime note inside a research simulation.',
      },
      {
        question: 'Where is the cycle meter?',
        answer: 'On /cycle and inside the desk pipeline.',
      },
      {
        question: 'Will it call tops?',
        answer: 'No. And it will not pretend to.',
      },
    ],
    related: [
      { label: 'Cycle meter', href: '/cycle' },
      { label: 'Pipeline', href: '/pipeline' },
    ],
  },
  {
    slug: 'hunt-probability-gaps',
    path: '/use-cases/hunt-probability-gaps',
    keyword: 'mispriced prediction markets',
    title: 'Use Case: Hunt Prediction Market Probability Gaps',
    description:
      'Find where Polymarket YES% and Agents61 multi-agent probability disagree. Research simulation — gaps are disagreement, not guaranteed trades.',
    h1: 'Use case: hunt probability gaps on prediction markets',
    eyebrow: 'Use cases · Prediction Markets',
    intro:
      'The market says 32%. Agents61 estimates 46%. The product is the gap — plus why, catalysts, and what would invalidate the thesis. Paste a Polymarket URL or open the scanner. No wallet.',
    bullets: [
      'Top Probability Gaps ranked by |Agents61 − Market|.',
      'Full Strategy Report after Analyze (free: 1 run; paid: news + Pro Clerk).',
      'Watchlist tracks whether the tape moves toward or away from Agents61.',
      'Resolution risk comes before any “edge” story.',
    ],
    sections: [
      {
        heading: 'What “mispriced” means here',
        body: 'We mean probability disagreement under research uncertainty — not a guaranteed edge. Resolution ambiguity can make a “correct” world-event resolve the wrong way for the contract. Read why-wrong and why-right before you treat a gap as interesting.',
      },
      {
        heading: 'Two-stage cost control',
        body: 'Scan widely with cheap filters on Top Gaps and the Market Scanner. Run the full committee only on candidates you open. That is how the desk stays affordable.',
      },
      {
        heading: 'End-to-end loop',
        body: 'Open /predictions → sort gaps or paste a URL → Analyze → read range and invalidation → Watchlist the mid → do not open a wallet from Agents61. Keep Polymarket for trading.',
      },
    ],
    faqs: [
      {
        question: 'Will Agents61 tell me to buy YES?',
        answer: 'No. View Market / Analyze / Watchlist only. Research simulation.',
      },
      {
        question: 'Where do I start?',
        answer: 'Open /predictions, sort Top Gaps, or paste a Polymarket URL.',
      },
      {
        question: 'Is one free Analyze enough?',
        answer:
          'Enough to see a Strategy Report. Paid desks add news layer, Pro Clerk, and ongoing use beside the equity committee.',
      },
    ],
    related: [
      { label: 'Prediction Markets', href: '/predictions' },
      { label: 'vs Polymarket', href: '/compare/polymarket' },
      { label: 'Learn: probability gaps', href: '/learn/probability-gap-research' },
    ],
    ctaTitle: 'Register and hunt your first probability gap',
    ctaBody:
      'Create an account to open Prediction Markets, run Analyze, and watchlist mids. Gaps are disagreement — not a Buy YES ticket.',
    ctaHref: '/predictions',
    ctaGuestHref: '/register?next=%2Fpredictions',
  },
];

export function getUseCase(slug: string) {
  return USE_CASE_HUBS.find((u) => u.slug === slug);
}
