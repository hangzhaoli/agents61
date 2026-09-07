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
    ],
    sections: [
      {
        heading: 'When to run it',
        body: 'After a first pass, before size. If you cannot write what would kill the idea, you do not have a thesis. You have a mood.',
      },
    ],
    faqs: [
      {
        question: 'Will the desk tell me to sell?',
        answer: 'No. It will write kill-conditions. You still decide.',
      },
    ],
    related: [
      { label: 'Red-team NVDA note', href: '/blog/how-to-red-team-nvda' },
      { label: 'Compare vs ChatGPT', href: '/compare/chatgpt' },
    ],
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
    ],
    sections: [
      {
        heading: 'Why isolation is cheaper to trust',
        body: 'Fake consensus is expensive. If every seat can see the first fluent paragraph, you paid for costumes.',
      },
    ],
    faqs: [
      {
        question: 'Can seats talk to each other in isolated mode?',
        answer: 'No. That is the point.',
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
    ],
    sections: [
      {
        heading: 'Example prompt shape',
        body: '“Research BTC as a settlement asset over a ten-year hold. Do not invent a multiple. Invert the energy and classification risks.”',
      },
    ],
    faqs: [
      {
        question: 'Which assets?',
        answer: 'BTC, ETH, SOL and the board listed under /research/crypto. Not every meme ticker.',
      },
    ],
    related: [
      { label: 'Crypto research hub', href: '/research/crypto' },
      { label: 'Bitcoin is not a P/E', href: '/blog/crypto-research-not-pe' },
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
    ],
    sections: [
      {
        heading: 'Honest output',
        body: 'A seat that cannot see revenue should say so. Fluency without a source is a defect.',
      },
    ],
    faqs: [
      {
        question: 'Is this fundraising or brokerage?',
        answer: 'Neither.',
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
    ],
    sections: [
      {
        heading: 'What to ask',
        body: 'Concentration, cycle sensitivity, and what the methodology would refuse to hold inside the wrapper.',
      },
    ],
    faqs: [
      {
        question: 'Do you cover every ETF?',
        answer: 'US-listed first. The desk is not a global fund plant.',
      },
    ],
    related: [
      { label: 'ETF research note', href: '/blog/etf-research-without-a-rating' },
      { label: 'QQQ page', href: '/stocks/qqq' },
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
    ],
    sections: [
      {
        heading: 'Honesty',
        body: 'Cycle work is a map. Maps are wrong at the edges. The product will not sell you a date.',
      },
    ],
    faqs: [
      {
        question: 'Is this market timing advice?',
        answer: 'No. It is a regime note inside a research simulation.',
      },
    ],
    related: [
      { label: 'Cycle meter', href: '/cycle' },
      { label: 'Pipeline', href: '/pipeline' },
    ],
  },
];

export function getUseCase(slug: string) {
  return USE_CASE_HUBS.find((h) => h.slug === slug);
}
