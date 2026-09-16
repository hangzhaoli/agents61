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
        body: 'If you pay for 16, 45 stay empty. That is the product. A louder chat with 61 names sharing one draft is not a committee. You unlock seats; locked methodologies do not silently rewrite the brief.',
      },
      {
        heading: 'What the clerk does',
        body: 'After isolated writing, a clerk stacks agreements and splits. It does not vote. It does not emit “you should buy.” Read the stack like minutes: agreements first, splits second, eloquence last.',
      },
      {
        heading: 'Isolated vs division of labor',
        body: 'Isolated is the default — seats see the ticker and their rules only. Division of labor is a sequenced pipeline (trend → cycle → selection → debate) where later groups may read earlier notes. Peers inside a group still cannot see each other.',
      },
      {
        heading: 'Who it is for',
        body: 'Intermediate investors who already pull quotes elsewhere and want named disagreement on the record. Not beginners who want a button. Not professionals who need a Bloomberg replacement.',
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
      {
        question: 'What do tiers unlock?',
        answer:
          'How many seats run — Analyst 16, Associate 29, Principal 48, Committee/Partners 61. You pay for staffing, not a louder chat. See /pricing.',
      },
      {
        question: 'Can I try before paying?',
        answer: 'Register to open the desk. Pricing and seating details live on /pricing.',
      },
    ],
    related: [
      { label: 'vs ChatGPT', href: '/compare/chatgpt' },
      { label: '61 masters', href: '/masters' },
      { label: 'Pricing', href: '/pricing' },
    ],
    ctaTitle: 'Register and staff your first seats',
    ctaBody:
      'Create an account to unlock the working desk. Isolated masters, clerk stacks, no buy button — research simulation only.',
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
      'Keep your tape on Yahoo, Koyfin, or a broker — Agents61 writes.',
    ],
    sections: [
      {
        heading: 'Keep your tape',
        body: 'Quotes live on Yahoo, Koyfin, or a broker. Agents61 writes. That split is intentional. We will not race a terminal on charts; we will staff methods after you already verified the name.',
      },
      {
        heading: 'What a run looks like',
        body: 'Pick Isolated (default) or Division of labor → unlocked seats write → clerk stacks agreements and splits → you force one kill-condition before size. Eloquent paragraphs from one seat are not a vote.',
      },
      {
        heading: 'Red team is first-class',
        body: 'Debate seats exist so the bull paragraph cannot edit the bear paragraph. If you cannot write what would kill the idea, you do not have a thesis — you have a mood.',
      },
    ],
    faqs: [
      {
        question: 'Which market first?',
        answer: 'US listed equities. ETFs adjacent. A-shares later.',
      },
      {
        question: 'Does this replace Yahoo Finance?',
        answer: 'No. See /compare/yahoo-finance. Tape first, committee second.',
      },
      {
        question: 'Will the desk tell me what to buy?',
        answer: 'No. Briefs never end in a buy instruction. No order routing.',
      },
    ],
    related: [
      { label: 'Markets', href: '/markets' },
      { label: 'How to research a stock', href: '/blog/how-to-research-a-stock' },
      { label: 'Learn: 20-minute drill', href: '/learn/research-a-stock-in-20-minutes' },
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
      'Compare framing vs Seeking Alpha and ChatGPT on /compare.',
    ],
    sections: [
      {
        heading: 'Who should skip this',
        body: 'Beginners who want a button. Passive investors who want one ETF checkup. Anyone who needs a terminal. Agents61 is for people who already research and want disagreement on the record.',
      },
      {
        heading: 'Why refuse a composite score',
        body: 'TipRanks-style smart scores and Morningstar stars answer different jobs. For ticker research, averaging hides which method killed the idea. The clerk stacks splits instead.',
      },
      {
        heading: 'What “stock analysis AI” means here',
        body: 'Named methodologies, isolation or pipeline handoff, debate seats, and a clerk — not a chatbot that role-plays analysts in one thread.',
      },
    ],
    faqs: [
      {
        question: 'Do you cover options or futures?',
        answer: 'No. Research simulation on cash equities, ETFs, listed crypto research, and a private board.',
      },
      {
        question: 'How is this different from Seeking Alpha?',
        answer: 'SA sells bylines and ratings. Agents61 sells isolated seats and splits. See /compare/seeking-alpha.',
      },
      {
        question: 'Is there a free trial analyze?',
        answer:
          'Register to open the desk. Prediction Markets also offers one free Analyze on event odds — separate from equity seating.',
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
      'Same compliance line on masters, compare hubs, and the live desk.',
    ],
    sections: [
      {
        heading: 'Why we repeat “not advice”',
        body: 'Because fluency is dangerous. A well-written brief can feel like a recommendation. The software is built to refuse the last sentence — no buy button, no order routing, no composite rating that pretends to be a call.',
      },
      {
        heading: 'Unaffiliated by design',
        body: 'Master seats are simulations from public text. They are not endorsed by the living people. A 13F is a filing; a brief is a method. Do not confuse them — see /compare/gurufocus and /compare/deepticker.',
      },
      {
        heading: 'What you are buying',
        body: 'Seating and compute for isolated research writing — not brokerage, not a terminal, not a tip service.',
      },
    ],
    faqs: [
      {
        question: 'Are the masters affiliated?',
        answer: 'No. Unaffiliated simulations from public text. See /methodology.',
      },
      {
        question: 'Is Agents61 a registered adviser?',
        answer: 'No. Educational research simulation and publication. See /disclaimer.',
      },
      {
        question: 'Where is AI disclosure?',
        answer: 'On every public surface and at /ai-disclosure.',
      },
    ],
    related: [
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'AI disclosure', href: '/ai-disclosure' },
      { label: 'Methodology', href: '/methodology' },
    ],
  },
  {
    slug: 'prediction-market-research',
    path: '/prediction-market-research',
    keyword: 'prediction market research',
    title: 'Prediction Market Research — Polymarket Odds vs Agents61',
    description:
      'AI prediction market research: compare Polymarket YES probability with multi-agent Agents61 estimates. Probability gaps, Strategy Reports, resolution checks — not betting.',
    h1: 'Prediction market research that starts after you have a mid',
    eyebrow: 'Product · Prediction Markets',
    intro:
      'Polymarket and Kalshi answer what price the crowd trades. Agents61 answers whether that probability makes sense under independent research. Specialized agents, a Prediction Clerk, and a Probability Gap — research simulation only.',
    bullets: [
      'Live Polymarket Gamma feed on /predictions.',
      'Top Gaps, Market Scanner, URL import, Watchlist.',
      'Free: 1 analyze. Paid desk: news layer + Pro Clerk.',
      'No wallet, no Buy YES/NO, no position-size ticket.',
    ],
    sections: [
      {
        heading: 'Markets price the future. Agents61 researches the odds.',
        body: 'That line is the product. We compete as an intelligence layer, not as an exchange. Keep Polymarket for trading. Use Agents61 for disagreement — base rates, news, domain, market structure, Bayesian update, contrarian, red team, resolution, and risk.',
      },
      {
        heading: 'What the committee covers',
        body: 'Specialized prediction seats write, then a Prediction Clerk synthesizes range and confidence. The Probability Gap (Agents61 − Market) is disagreement under uncertainty — not a guaranteed edge. Resolution wording can dominate.',
      },
      {
        heading: 'Two-stage cost control',
        body: 'Scan widely with cheap filters on Top Gaps and the scanner. Run the full committee only on candidates you open. Free desks get one Analyze to try the Strategy Report; paid desks add news layer and Pro Clerk.',
      },
      {
        heading: 'What we will never ship',
        body: 'A wallet, Buy YES/NO, or a position-size ticket disguised as research. View Market / Analyze / Watchlist only.',
      },
    ],
    faqs: [
      {
        question: 'Is this a Polymarket trading bot?',
        answer: 'No. Research and probability intelligence only.',
      },
      {
        question: 'Where is the live desk?',
        answer: 'Start at /predictions. Compare framing at /compare/polymarket.',
      },
      {
        question: 'What is a Probability Gap?',
        answer:
          'Agents61 estimate minus market YES%. It flags disagreement for research — not a guaranteed trade. See /learn/probability-gap-research.',
      },
      {
        question: 'Do you support Kalshi?',
        answer: 'Architecture is multi-provider. Polymarket is live first; Kalshi follows after validation.',
      },
    ],
    related: [
      { label: 'Open Prediction Markets', href: '/predictions' },
      { label: 'vs Polymarket', href: '/compare/polymarket' },
      { label: 'Hunt gaps', href: '/use-cases/hunt-probability-gaps' },
      { label: 'Learn guide', href: '/learn/probability-gap-research' },
    ],
    ctaTitle: 'Register and research Polymarket odds',
    ctaBody:
      'Create an account to open Prediction Markets, run Analyze, and keep a watchlist. No wallet — research simulation only.',
    ctaHref: '/predictions',
    ctaGuestHref: '/register?next=%2Fpredictions',
  },
];

export function getFeatureHub(slug: string) {
  return FEATURE_HUBS.find((h) => h.slug === slug);
}
