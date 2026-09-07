import type { SeoHub } from '@/lib/seo/hub-types';

export const FEATURE_HUBS: SeoHub[] = [
  {
    slug: 'ai-investment-committee',
    path: '/ai-investment-committee',
    keyword: 'AI investment committee',
    title: 'AI Investment Committee — 61 Isolated Master Seats',
    description:
      'An AI investment committee of 61 named master agents. Isolated briefs or pipeline handoff. Research simulation, not a chatbot and not a buy button.',
    h1: 'An AI investment committee that will not average the room',
    eyebrow: 'Product · AI investment committee',
    intro:
      'Most “AI for investing” is one model wearing many hats. Agents61 is seating: 16, 29, 48, or 61 unlocked methodologies. Locked seats stay dark. A clerk stacks. Nobody gets a consensus badge.',
    bullets: [
      'Named seats — Graham, Buffett, Lynch, Wood, Dalio, Burry, and the rest of the 61.',
      'Isolated by default. Division of labor as a pipeline, not a group chat.',
      'US stocks, ETFs, on-chain, EM ADRs, a private board.',
      'Analyst $19 / month for the working 16.',
    ],
    sections: [
      {
        heading: 'Committee means empty chairs',
        body: 'If you pay for 16, 45 stay empty. That is the product. A louder chat with 61 names sharing one draft is not a committee.',
      },
      {
        heading: 'What the clerk does',
        body: 'After isolated writing, a clerk stacks agreements and splits. It does not vote. It does not emit “you should buy.”',
      },
    ],
    faqs: [
      {
        question: 'Is this investment advice?',
        answer: 'No. Research simulation and educational publication. No order routing.',
      },
      {
        question: 'How is this different from ChatGPT?',
        answer: 'Isolation and named methods. See /compare/chatgpt.',
      },
    ],
    related: [
      { label: 'vs ChatGPT', href: '/compare/chatgpt' },
      { label: '61 masters', href: '/masters' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    slug: 'ai-stock-research',
    path: '/ai-stock-research',
    keyword: 'AI stock research',
    title: 'AI Stock Research Desk',
    description:
      'AI stock research for US names: isolated master briefs, red-team debate, cycle overlay. Not Yahoo Finance. Not a copilot that agrees with you.',
    h1: 'AI stock research that starts after you have a ticker',
    eyebrow: 'Product · AI stock research',
    intro:
      'The desk is not a screener that pretends to be a thesis. You bring a name — or ask the opportunity board — then unlocked seats write.',
    bullets: [
      'Programmatic ticker pages for popular US names.',
      'Filings-aware seats stay inconclusive when numbers are missing.',
      'PDF briefs for homework, not tickets.',
    ],
    sections: [
      {
        heading: 'Keep your tape',
        body: 'Quotes live on Yahoo, Koyfin, or a broker. Agents61 writes. That split is intentional.',
      },
    ],
    faqs: [
      {
        question: 'Which market first?',
        answer: 'US listed equities. ETFs adjacent. A-shares later.',
      },
    ],
    related: [
      { label: 'Markets', href: '/markets' },
      { label: 'How to research a stock', href: '/blog/how-to-research-a-stock' },
    ],
  },
  {
    slug: 'stock-analysis-ai',
    path: '/stock-analysis-ai',
    keyword: 'stock analysis AI',
    title: 'Stock Analysis AI — Isolated Masters, No Rating',
    description:
      'Stock analysis AI without a composite rating. 61 methods, isolated or handed down a pipeline. Compare with Seeking Alpha and ChatGPT.',
    h1: 'Stock analysis AI that keeps the split',
    eyebrow: 'Product · Stock analysis AI',
    intro:
      'A rating is a compression. Compression is how you hide the argument. Agents61 keeps the argument on the page.',
    bullets: [
      'No star, no smart score, no buy/hold/sell badge.',
      'Red-team seats are first-class, not a prompt you forgot.',
      'Same compliance line on every report.',
    ],
    sections: [
      {
        heading: 'Who should skip this',
        body: 'Beginners who want a button. Passive investors who want one ETF checkup. Anyone who needs a terminal.',
      },
    ],
    faqs: [
      {
        question: 'Do you cover options or futures?',
        answer: 'No. Research simulation on cash equities, ETFs, listed crypto research, and a private board.',
      },
    ],
    related: [
      { label: 'vs Seeking Alpha', href: '/compare/seeking-alpha' },
      { label: 'Features', href: '/features' },
    ],
  },
  {
    slug: 'investment-research-simulation',
    path: '/investment-research-simulation',
    keyword: 'investment research simulation',
    title: 'Investment Research Simulation',
    description:
      'Investment research simulation: 61 unaffiliated master personas, isolated then assembled. Educational publication — not an adviser, not a broker.',
    h1: 'Call it a simulation. That is the honest word.',
    eyebrow: 'Product · Research simulation',
    intro:
      'The personas are built from books and letters. They are not the people. The output is homework. The risk is yours. That sentence is the product.',
    bullets: [
      'Publisher positioning, not a hidden SMA.',
      'AI disclosure on every public surface.',
      'Waffo for cards. NOWPayments for crypto. No bundled trade.',
    ],
    sections: [
      {
        heading: 'Why we repeat “not advice”',
        body: 'Because fluency is dangerous. A well-written brief can feel like a recommendation. The software is built to refuse the last sentence.',
      },
    ],
    faqs: [
      {
        question: 'Are the masters affiliated?',
        answer: 'No. Unaffiliated simulations from public text. See /methodology.',
      },
    ],
    related: [
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'AI disclosure', href: '/ai-disclosure' },
      { label: 'Methodology', href: '/methodology' },
    ],
  },
];

export function getFeatureHub(slug: string) {
  return FEATURE_HUBS.find((h) => h.slug === slug);
}
