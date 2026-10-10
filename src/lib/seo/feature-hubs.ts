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
  {
    slug: 'paper-trading-account',
    path: '/paper-trading-account',
    keyword: 'virtual paper trading account',
    title: 'Virtual $100k Paper Trading Account — Masters & Quant',
    description:
      'Agents61 virtual $100k paper account: master/quant strategies screen a pool, book fills at live marks, sync P&L. Research simulation — not a broker.',
    h1: 'A virtual $100k paper account that masters and quant can actually book',
    eyebrow: 'Product · Paper $100k',
    intro:
      'Most “paper trading” is a blank order ticket. Agents61 starts you at $100,000 virtual cash, lets timing masters screen a liquid universe, books equal-weight longs at live marks, then syncs the market back into equity and P&L. Still no buy button to a broker.',
    bullets: [
      'Starting cash: $100,000 virtual USD — paper only.',
      'Master rules (O’Neil, Turtle, Seykota, Minervini, Livermore) screen equity or crypto pools.',
      'Book signals into the account, then Sync market for latest marks.',
      'Desk entry: /dashboard?entry=paper · Quant Lab can book the same book.',
    ],
    sections: [
      {
        heading: 'What the $100k account is for',
        body: 'Rehearsal. You see how a rule would occupy cash, how marks move equity, and how a stop language looks in dollars — not a track record of customer accounts, not income, not a broker API.',
      },
      {
        heading: 'How a strategy lands in the book',
        body: 'Pick a timing master and a universe pool (liquid mega-cap, growth, ETFs, or crypto majors). The desk screens, attaches live marks, and books up to N concurrent longs with equal cash slots. Sync market revalues open lots.',
      },
      {
        heading: 'How this differs from US quant paper books',
        body: 'US quant (/research/us-quant) is a single-name contract/shares/wheel tape on daily bars. The $100k account is a multi-name portfolio book you can refill from Quant Lab or the Paper desk. Both refuse live orders.',
      },
      {
        heading: 'What we will never ship here',
        body: 'A wallet connect that places real orders, a “copy this P&L” claim, or a composite rating that pretends the paper curve is a salary.',
      },
    ],
    faqs: [
      {
        question: 'Is this live trading?',
        answer: 'No. Virtual cash and research marks only. No broker routing.',
      },
      {
        question: 'Where do I open the account?',
        answer: 'Register, then open /dashboard?entry=paper. Quant Lab can also book signals into the same book.',
      },
      {
        question: 'Does Sync market use real-time quotes?',
        answer:
          'It pulls cached desk quotes and daily closes for research marks. Not a live terminal feed. See /quant-lab and /paper-trading-account.',
      },
      {
        question: 'Can I reset the $100k?',
        answer: 'Yes. Reset clears lots and restores virtual cash. Prior paper fills stay local as history until you clear the browser store.',
      },
    ],
    related: [
      { label: 'Quant Lab', href: '/quant-lab' },
      { label: 'AI Quant Lab hub', href: '/ai-quant-lab' },
      { label: 'US quant books', href: '/research/us-quant' },
      { label: 'Learn: run the $100k desk', href: '/learn/run-paper-100k-desk' },
    ],
    ctaTitle: 'Register and open the $100k paper desk',
    ctaBody:
      'Create an account, run a master strategy into the virtual book, and sync marks. Research simulation — not a trade ticket.',
    ctaHref: '/dashboard?entry=paper',
    ctaGuestHref: '/register?next=%2Fdashboard%3Fentry%3Dpaper',
  },
  {
    slug: 'ai-quant-lab',
    path: '/ai-quant-lab',
    keyword: 'AI quant lab paper backtest',
    title: 'AI Quant Lab — Master Rules to Paper Backtests',
    description:
      'Agents61 Quant Lab: timing masters → strategy spec → Python paper backtest, trade-selection odds, full pool pipeline, and book into a $100k virtual account.',
    h1: 'AI Quant Lab: master rules, paper backtests, then a $100k book',
    eyebrow: 'Product · Quant Lab',
    intro:
      'Compile O’Neil, Turtle, Seykota, Minervini, or Livermore into a paper strategy. Single-ticker Python, or a full pool screen with multi-name signals. Thorp reviews Kelly. Book into the virtual $100k account when you want portfolio feedback — still not live trading.',
    bullets: [
      'Equity/ETF or crypto USD pairs (price/volume only — no fake P/E on tokens).',
      'Trade-selection odds: next-trade win probability + confidence for paper picks.',
      'Full pipeline: universe → screen → signals → paper portfolio path.',
      'Book to Paper $100k and sync market marks on the desk.',
    ],
    sections: [
      {
        heading: 'Single ticker vs full pipeline',
        body: 'Compile writes a self-contained yfinance-style backtest for one symbol. Full pipeline screens a liquid pool with master proxies, ranks names, and simulates a multi-name paper path. Use pipeline when you care about selection, not one chart.',
      },
      {
        heading: 'Trade-selection odds are not a live signal',
        body: 'The odds card shrinks historical win rate toward 50% by sample size and Thorp edge language. It ranks paper candidates. It does not place an order.',
      },
      {
        heading: 'From Lab to the $100k account',
        body: 'After a pipeline run, book buy/hold signals into the virtual account at live marks. Open /dashboard?entry=paper to sync equity. That loop is the SEO job for “paper trading with AI strategies” without pretending we are a broker.',
      },
    ],
    faqs: [
      {
        question: 'Is Quant Lab live trading?',
        answer: 'No. Paper research only. See /quant-lab.',
      },
      {
        question: 'Which masters can compile?',
        answer:
          'Timing / exit masters on the Quant Lab roster (e.g. William O’Neil, Richard Dennis, Ed Seykota, Mark Minervini, Jesse Livermore). Seating locks still apply.',
      },
      {
        question: 'Crypto in Quant Lab?',
        answer: 'Yes — BTC-USD / ETH-USD style pairs with price/volume rules. No invented equity fundamentals.',
      },
      {
        question: 'Where is the $100k book?',
        answer: 'Product hub /paper-trading-account · desk /dashboard?entry=paper.',
      },
    ],
    related: [
      { label: 'Open Quant Lab', href: '/quant-lab' },
      { label: 'Paper $100k hub', href: '/paper-trading-account' },
      { label: 'Use case: book a strategy', href: '/use-cases/paper-book-a-master-strategy' },
      { label: 'Ed Thorp seat', href: '/masters/ed-thorp' },
    ],
    ctaTitle: 'Register and open Quant Lab',
    ctaBody:
      'Create an account, compile a master rule, or run the pool pipeline into the $100k paper book. Not live trading.',
    ctaHref: '/dashboard?entry=quant',
    ctaGuestHref: '/register?next=%2Fdashboard%3Fentry%3Dquant',
  },
];

export function getFeatureHub(slug: string) {
  return FEATURE_HUBS.find((h) => h.slug === slug);
}
