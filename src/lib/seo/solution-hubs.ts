import type { SeoHub } from '@/lib/seo/hub-types';

export const SOLUTION_HUBS: SeoHub[] = [
  {
    slug: 'individual-investors',
    path: '/solutions/individual-investors',
    keyword: 'AI stock research for individual investors',
    title: 'AI Stock Research for Individual Investors',
    description:
      'A 61-master investment committee for intermediate US investors. Isolated briefs, no buy button, seats you can pay for — Analyst $19 to Partners $349.',
    h1: 'Stock research for people who already do the work',
    eyebrow: 'Solutions · Individual investors',
    intro:
      'If you have three years in US names and a mid five- to six-figure account, you do not need another chatbot. You need seats that will invert the idea after you picked the ticker.',
    bullets: [
      'Isolated masters — Buffett and Wood do not average.',
      'You pick Isolated or Division of labor before the run.',
      'Observer is a silent funnel. Paid desks start at Analyst 16 seats / $19.',
      'Never “you should buy.” The capital stays yours.',
    ],
    sections: [
      {
        heading: 'What this is not',
        body: 'Not a beginner app. Not a passive ETF checkup. Not Bloomberg. If you only want a rating, Seeking Alpha and Morningstar already exist.',
      },
      {
        heading: 'How a week looks',
        body: 'Pull quotes where you already pull them. Convene the desk on one ticker or a board scan. Read the clerk stack. Red-team the leftover belief. Do not treat the PDF as an order.',
      },
    ],
    faqs: [
      {
        question: 'Is this personalized advice?',
        answer: 'No. It is a research simulation and educational publication. Isolated briefs never say you should buy.',
      },
      {
        question: 'What do I pay?',
        answer: 'Analyst $19 (16), Associate $49 (29), Principal $79 (48), Committee $149 (61), Partners $349 (61 + priority). Cards via Waffo. Crypto via NOWPayments.',
      },
    ],
    related: [
      { label: 'Use case: isolated briefs', href: '/use-cases/isolated-briefs' },
      { label: 'How to research a stock', href: '/blog/how-to-research-a-stock' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    slug: 'newsletter-writers',
    path: '/solutions/newsletter-writers',
    keyword: 'AI investment research for newsletter writers',
    title: 'Investment Research Desk for Newsletter Writers',
    description:
      'Staff a 61-master committee before you publish a ticker note. Isolated briefs give you splits to quote — not a fake consensus for subscribers.',
    h1: 'A committee behind the byline',
    eyebrow: 'Solutions · Newsletter writers',
    intro:
      'A newsletter that only restates a chatbot is a liability. Use isolated seats to collect disagreements you can attribute as simulation — then write in your own name.',
    bullets: [
      'Export splits, not a composite rating.',
      'Name the method (Lynch, Einhorn) without claiming they emailed you.',
      'Crypto and ADR boards when the letter covers more than mega-cap US.',
    ],
    sections: [
      {
        heading: 'Compliance posture',
        body: 'Agents61 is not your lawyer. The product refuses a buy ticket. Your letter still needs your disclaimer. Do not paste a brief as if Buffett signed it.',
      },
    ],
    faqs: [
      {
        question: 'Can I republish the briefs?',
        answer: 'Treat them as AI-generated research simulation. Attribute the product. Do not impersonate the historical figures.',
      },
    ],
    related: [
      { label: 'Methodology', href: '/methodology' },
      { label: 'Compare vs Seeking Alpha', href: '/compare/seeking-alpha' },
    ],
  },
  {
    slug: 'family-offices',
    path: '/solutions/family-offices',
    keyword: 'investment committee software for family offices',
    title: 'Committee Simulation for Family Offices',
    description:
      'A structured disagreement layer for family-office research — not a Bloomberg replacement. Isolated master briefs before the human meeting.',
    h1: 'Staff the pre-meeting, not the terminal',
    eyebrow: 'Solutions · Family offices',
    intro:
      'Family offices that already pay for data do not need another tape. They need a written red team before the IC. Agents61 is that pre-read. It is not custody, allocation, or advice.',
    bullets: [
      'Committee and Partners seating for full 61.',
      'Division of labor when you want pipeline notes handed forward.',
      'Private desk for names that are not a ticker yet.',
    ],
    sections: [
      {
        heading: 'What we will not claim',
        body: 'We will not replace your CIO, your PMA, or Bloomberg. If the office needs a terminal, keep the terminal.',
      },
    ],
    faqs: [
      {
        question: 'Is this suitable as official IC minutes?',
        answer: 'No. It is a simulation to stress a thesis. Humans still own the minute book.',
      },
    ],
    related: [
      { label: 'Compare vs Bloomberg', href: '/compare/bloomberg' },
      { label: 'Private desk', href: '/research/private' },
    ],
  },
  {
    slug: 'crypto-researchers',
    path: '/solutions/crypto-researchers',
    keyword: 'on-chain research committee',
    title: 'On-Chain Research Committee',
    description:
      'Bitcoin and crypto due diligence without a fake P/E. A separate board, isolated seats, and no token buy button.',
    h1: 'Crypto research that does not invent a multiple',
    eyebrow: 'Solutions · Crypto researchers',
    intro:
      'Forcing owner-earnings language onto BTC is not diligence. Agents61 keeps an on-chain board so monetary, fee, and issuance questions stay in the right units.',
    bullets: [
      'BTC, ETH, SOL and a research board — not a stock template pasted on a token.',
      'Red-team seats still apply: what kills the monetary premium?',
      'No order routing. No exchange widget.',
    ],
    sections: [
      {
        heading: 'Units of analysis',
        body: 'Settlement premium, fees, issuance, validator set, regulatory classification. If a seat needs a P/E and there is none, it stays inconclusive.',
      },
    ],
    faqs: [
      {
        question: 'Do you execute trades?',
        answer: 'No. Research simulation only.',
      },
    ],
    related: [
      { label: 'Crypto hub', href: '/research/crypto' },
      { label: 'On-chain due diligence note', href: '/blog/on-chain-due-diligence-desk' },
      { label: 'Use case: crypto desk', href: '/use-cases/crypto-on-chain-desk' },
    ],
  },
  {
    slug: 'pre-ipo-watchers',
    path: '/solutions/pre-ipo-watchers',
    keyword: 'pre-IPO research AI',
    title: 'Pre-IPO Research Desk',
    description:
      'Private-company research simulation for OpenAI, Stripe, Anduril, and peers. No cap-table access. No buy button. Public-source stress tests only.',
    h1: 'Private names, public sources, no implied allocation',
    eyebrow: 'Solutions · Pre-IPO watchers',
    intro:
      'You cannot buy most of these names here. The desk still writes: unit economics rumors vs filings of comps, talent density, and what would invalidate the story.',
    bullets: [
      'OpenAI, Anthropic, Stripe, Anduril, Databricks, xAI on the private board.',
      'SpaceX public tape is SPCX — not this board.',
      'Never treat a brief as a secondary-share ticket.',
    ],
    sections: [
      {
        heading: 'Limit',
        body: 'No inside information. If the source is a podcast rumor, the seat should say so. Inconclusive is a valid output.',
      },
    ],
    faqs: [
      {
        question: 'Can I invest through Agents61?',
        answer: 'No. There is no buy button and no order routing — public or private.',
      },
    ],
    related: [
      { label: 'Private research hub', href: '/research/private' },
      { label: 'Pre-IPO note', href: '/blog/pre-ipo-research-simulation' },
      { label: 'Use case: private desk', href: '/use-cases/private-company-desk' },
    ],
  },
];

export function getSolution(slug: string) {
  return SOLUTION_HUBS.find((h) => h.slug === slug);
}
