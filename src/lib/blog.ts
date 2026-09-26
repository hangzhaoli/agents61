import { BLOG_PILLARS } from '@/lib/blog-pillars';
import { enrichCorePost } from '@/lib/blog-enrichment';
import { EARN_WITH_AGENTS61 } from '@/lib/blog-earn-guide';

export const BLOG_CATEGORIES = ['method', 'compare', 'markets', 'desk'] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  body: string[];
  category?: BlogCategory;
  keyTakeaway?: string;
  sections?: { heading: string; body: string }[];
  faqs?: { question: string; answer: string }[];
  relatedSlugs?: string[];
  readingMinutes?: number;
};

const CORE_POSTS: BlogPost[] = [
  {
    slug: 'isolated-vs-division-of-labor',
    title: 'Isolated research vs division of labor: two ways an AI investment committee writes',
    date: 'September 3, 2026',
    excerpt:
      'Isolated seats cannot see each other. Division of labor lets later pipeline steps read earlier notes — still not a 61-person ChatGPT thread.',
    tags: [
      'AI investment committee',
      'isolated stock research',
      'multi-agent stock analysis',
      'division of labor',
      'investment research',
    ],
    body: [
      'Most “AI for stocks” products are one chat. You ask ChatGPT or a copilot to analyze AAPL, it fluent-fills a memo, and you call it due diligence. That is not how a buy-side investment committee works, and it is a bad way to invert a thesis.',
      'Agents61 runs two methods on the same 61-master desk. Isolated is the default: every unlocked seat — Buffett, Lynch, Burry, Wood — sees the ticker and its own rules only. Nobody reads a peer. A clerk then stacks agreements and splits. Fake consensus is expensive; isolation is cheaper and harder to game.',
      'Division of labor is the other switch. Trend research hands a map to cycle research. Cycle hands a regime note to value and growth selection. Selection hands a pool to the red team. Later groups may reference earlier notes. Peers in the same group still cannot see each other. It is a pipeline handoff, not a 61-squared debate.',
      'Pick the method in the dashboard before you convene or run a lineup stock screen. Seating does not change. Empty seats stay empty. Neither mode emits “you should buy.” This is investment research simulation, not advice.',
    ],
  },
  {
    slug: 'vs-yahoo-seeking-alpha-chatgpt',
    title: 'Stock analysis tools compared: Yahoo Finance, Seeking Alpha, ChatGPT, and a committee',
    date: 'September 3, 2026',
    excerpt:
      'Quote terminals and article mills are not an investment committee. A chatbot that agrees with you is not equity research.',
    tags: [
      'Yahoo Finance stock analysis',
      'Seeking Alpha alternative',
      'ChatGPT stock analysis',
      'stock research tools',
      'equity research',
    ],
    body: [
      'Yahoo Finance and similar stock analysis sites are excellent at prices, filings links, and a quote tape. They are not an investment thesis. They will not invert MSFT, run a ten-year hold test, or keep a red team alive after a bull paragraph.',
      'Seeking Alpha and Motley Fool-style pages are human (or hybrid) opinion at a subscription. Quality varies. You still get one narrative at a time, often with a rating that behaves like a buy button even when the lawyers say it is not.',
      'ChatGPT, Claude, and Perplexity will write a fluent AAPL stock analysis in seconds. The failure mode is anchoring: the first confident paragraph becomes the room. Multi-agent theater that lets every “master” see the same draft is the same bug with more names.',
      'Agents61 is closer to a miniature investment committee than to a data terminal (Bloomberg, Koyfin, FactSet) or a chatbot. Isolated briefs, optional pipeline handoff, clerk assembly, no order routing. If you need quotes, keep Yahoo. If you need someone to disagree with you on purpose, staff the desk.',
    ],
  },
  {
    slug: 'how-to-research-a-stock',
    title: 'How to research a stock before you buy — without a buy button',
    date: 'September 3, 2026',
    excerpt:
      'A due diligence checklist for intermediate US investors: filings, cycle, classification, inversion, timing, exit. AI can staff the seats. It cannot take the risk.',
    tags: [
      'how to analyze a stock',
      'stock due diligence',
      'fundamental analysis',
      'investment thesis',
      'US stock research',
    ],
    body: [
      '“What stocks should I buy?” is the wrong first question. The useful sequence is: where capital may flow this decade, where we are in the cycle, whether this name is a business or a story, whether the thesis survives a red team, when you would scale in, and when you would be forced to sell.',
      'Fundamental analysis still starts with filings — revenue, ROE, leverage, owner earnings — not a vibes model. If numbers are missing, a serious seat stays inconclusive. Inventing a P/E is not equity research.',
      'Then invert. Charlie Munger’s move is not a slogan: write what would kill the idea. Earnings quality (Einhorn), hidden assumptions (Burry), governance, tail risk. A stock screener can rank. It cannot interrogate.',
      'Agents61 maps that checklist onto 61 named agents and will not print a buy ticket. Use it as homework. The capital, and the mistake, remain yours.',
    ],
  },
  {
    slug: 'buffett-wood-same-ticker',
    title: 'Warren Buffett and Cathie Wood on the same ticker — why isolation matters',
    date: 'September 3, 2026',
    excerpt:
      'Quality investing and disruptive-innovation research are different tests. Averaging Buffett and Wood into one rating is how you get a fake committee.',
    tags: [
      'Warren Buffett stock analysis AI',
      'Cathie Wood disruptive innovation research',
      'value investing research',
      'growth stock research',
      'AI agents investing',
    ],
    body: [
      'Search demand is real: “how would Buffett analyze this stock” and “Cathie Wood AI stocks” land on the same URL more often than they should. Those are not the same job. Graham and Buffett ask whether it is a business you would own in the dark. Wood asks whether a disruption theme still has duration.',
      'If an LLM writes both voices in one pass, the second voice usually borrows the first. That is not multi-agent stock analysis. It is one memo in two fonts.',
      'On Agents61, Buffett and Wood are separate seats. Isolated mode: they never see each other. Division of labor: Wood may sit in trend while Buffett sits in selection, and selection can read a trend map without merging into a blended score.',
      'The clerk is allowed to say they split. That split is the product. Simulated personas are unaffiliated with the people; the rules come from public letters and books.',
    ],
  },
  {
    slug: 'red-team-stock-idea',
    title: 'Red-team a stock idea before the bull case gets fluent',
    date: 'September 2, 2026',
    excerpt:
      'Einhorn, Burry, Icahn, Loeb, Singer — short-side seats that try to kill the thesis. Inversion is not a vibe. It is a pipeline step.',
    tags: [
      'red team a stock idea',
      'invert an investment thesis',
      'Michael Burry forensic analysis',
      'David Einhorn earnings quality',
      'stock analysis',
    ],
    body: [
      'Retail stock research usually writes the bull case first because it feels like work. Professional investment committees often pay people to destroy the idea. If the thesis still stands, you own it with open eyes. If it dies, you saved the capital.',
      'A red team is not “add a bearish paragraph so the article looks balanced.” It is a different look-at list: accruals, hidden leverage, related-party structure, consensus that has no residual, tails the model assumes away.',
      'Agents61 keeps debate as its own layer. Analyst already includes Einhorn, Burry, and Munger in the working 16. Associate and above light more short-side and cycle seats. They write isolated kill-shots. The clerk does not make them meet in the middle.',
      'If you only wanted a ranking, a stock screener is cheaper. If you wanted someone to refuse your story, staff the red team.',
    ],
  },
  {
    slug: 'crypto-research-not-pe',
    title: 'Bitcoin research is not a P/E. On-chain analysis needs a different desk.',
    date: 'September 2, 2026',
    excerpt:
      'Forcing cash-flow multiples onto BTC, ETH, or SOL is how equity tools fail crypto. Settlement, usage, and policy are the file.',
    tags: [
      'blockchain asset analysis',
      'Bitcoin research not a P/E',
      'on-chain due diligence',
      'crypto investment committee',
      'Ethereum on-chain research',
    ],
    body: [
      'Traditional finance websites treat every asset like a stock: price, market cap, a ratio, a rating. That habit leaks into crypto “stock analysis” pages that invent earnings for a bearer settlement asset.',
      'On-chain due diligence looks at issuance, security budget, L1 usage, listings, and policy. ETH and SOL have different questions than BTC. Tokens with a business underneath can meet a cash-flow test. Most do not.',
      'Value seats on Agents61 usually stay cautious or skeptical on non-cash-flow maps. Trend and growth seats classify usage versus narrative. Cycle seats overlay risk-asset beta. The clerk does not average that into a coin rating.',
      'Use the crypto board, lineup screen, or a BTC brief the same way you use an equity report: homework. No buy button. Not a signal service.',
    ],
  },
  {
    slug: 'ai-agents-for-investing',
    title: 'AI agents for investing: committee, copilot, or parlor trick?',
    date: 'September 1, 2026',
    excerpt:
      'Agentic stock analysis only works if agents cannot see each other until a clerk pass — and if empty seats stay empty.',
    tags: [
      'AI agents stock market',
      'best AI for stock research',
      'multi-agent system finance',
      'LLM investment research',
      'AI copilot investing risks',
    ],
    body: [
      '“AI agent investing” is a crowded search. Most demos are a router that calls tools and writes a confident memo. That can fetch a 10-K. It cannot stop the model from agreeing with you.',
      'A useful multi-agent system in finance looks more like an investment committee: named jobs, isolation or strict handoff, a red team, a quant overlay that refuses stories without significance, and a human who still owns the PnL.',
      'Compute should scale with isolated prompts (16, 29, 48, 61) plus one assembly, not with everyone talking to everyone. 61-squared debate is how you burn money and still get one paragraph.',
      'Agents61 is built on that constraint. It is not an adviser. It is not a replacement for a CFA. It is a way to staff research so the most expensive thing you own is not a thesis nobody inverted.',
    ],
  },
  {
    slug: 'independent-then-assembled',
    title: 'Why masters write alone before anyone assembles',
    date: 'August 31, 2026',
    excerpt:
      'A 61-person group chat contaminates judgment and burns tokens. Isolated briefs plus one clerk pass are cheaper and harder to fake-consensus.',
    tags: ['isolated investment research', 'AI investment committee', 'investment memo'],
    body: [
      'Most “AI investment committees” are a roundtable: one prompt, many names, everyone sees the same draft. That is how anchoring works. The first fluent paragraph becomes the room.',
      'Agents61 does the opposite. Each unlocked master sees the ticker, the filings, and their own rules. They do not see Buffett’s note, Lynch’s category, or Munger’s kill-shots until a separate clerk pass stacks agreements and splits.',
      'That clerk does not average the room into a buy rating. If quality seats and red-team seats disagree, the split stays on the page. Analyst, Associate, Principal, Committee, and Partners use the same method. You only change how many isolated prompts run — 16, 29, 48, or 61 — plus one assembly pass. Never 61-squared debate.',
      'This is a research simulation. Isolated views, splits, and assembly notes are not personalized advice.',
    ],
  },
  {
    slug: 'seating-3-16-61',
    title: 'Analyst 16, Associate 29, Principal 48, two grades of 61',
    date: 'August 31, 2026',
    excerpt:
      'Seating is the product. Empty seats stay empty. Compute scales with isolated prompts, not with a louder chat.',
    tags: ['investment committee software', 'AI stock analysis committee', 'pricing'],
    body: [
      'The working 16 is Analyst: Wood, Laffont, Dalio, Marks, Templeton, Graham, Buffett, Lynch, Duan, Klarman, Greenblatt, Einhorn, Burry, Munger, O’Neil, Thorp. That covers era, cycle, dual-track selection, a real red team, a timing seat, and Kelly sizing.',
      'Associate ($49) adds 13 red-team, cycle, and timing seats — 29 total, not 61. Principal is 48. Committee and Partners unlock the remaining seats — including exit discipline. Partners is the same 61 with more reports and priority routing. Still isolated first. Never a 61-way conversation.',
      'Founding Committee is a Committee-priced annual lock for early subscribers. You pay for seats that actually write.',
    ],
  },
  {
    slug: 'how-personas-are-built',
    title: 'Personas from books and letters, not gossip',
    date: 'August 30, 2026',
    excerpt:
      'Hard rules from published work. Wikipedia is a seed. Quote graphics and tip groups never enter the model.',
    tags: ['Benjamin Graham security analysis AI', 'shareholder letters', 'methodology'],
    body: [
      'Each master agent is a methodology card: voice, hard rules, never-says, what they look at, and what kills a thesis. The sources are ordered: their books, shareholder letters, public talks, then a Wikipedia extract as a cold-start seed.',
      'We do not use second-hand social threads, tip groups, or unverified quote images. Those become hallucinated personas. They do not go in.',
      'On a report, the persona only sees filings and its own card. It cannot borrow another master’s conclusion. If SEC facts are missing, the seat stays inconclusive rather than inventing numbers.',
      'Simulated personas are unaffiliated with the people. The rules come from public text. That is the whole claim.',
    ],
  },
];

export const BLOG_POSTS: BlogPost[] = [EARN_WITH_AGENTS61, ...CORE_POSTS.map(enrichCorePost), ...BLOG_PILLARS];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function postsByCategory(category: BlogCategory) {
  return BLOG_POSTS.filter((p) => p.category === category);
}
