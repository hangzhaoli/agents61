import type { CompareHub } from '@/lib/seo/hub-types';

const RELATED_CORE = [
  { label: 'All comparisons', href: '/compare' },
  { label: 'AI investment committee', href: '/ai-investment-committee' },
  { label: 'How the desk writes', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
];

function rows(
  competitor: Record<string, string>
): CompareHub['rows'] {
  return [
    { feature: 'Job', a61: 'Investment committee simulation', competitor: competitor.job },
    { feature: 'Stock analysis', a61: 'Named masters, isolated or pipeline handoff', competitor: competitor.analysis },
    { feature: 'Red team / inversion', a61: 'Dedicated debate seats', competitor: competitor.red },
    { feature: 'Buy button / rating', a61: 'None. Splits stay splits', competitor: competitor.rating },
    { feature: 'Crypto / on-chain', a61: 'Separate board, no fake P/E', competitor: competitor.crypto },
    { feature: 'Best for', a61: 'Intermediate investors who already research', competitor: competitor.best },
  ];
}

export const COMPARE_HUBS: CompareHub[] = [
  {
    slug: 'chatgpt',
    competitor: 'ChatGPT',
    keyword: 'Agents61 vs ChatGPT stock analysis',
    title: 'Agents61 vs ChatGPT — Committee Research vs One Fluent Memo (2026)',
    description:
      'Agents61 vs ChatGPT for stock analysis: isolated 61-master briefs vs one chatbot voice. Compare inversion, consensus risk, and why a fluent memo is not a committee.',
    h1: 'Agents61 vs ChatGPT: a committee, not one fluent memo',
    eyebrow: 'Compare · AI stock research',
    intro:
      'ChatGPT writes a fast AAPL memo. The failure mode is anchoring: the first confident paragraph becomes the room. Agents61 staffs named seats that cannot see each other, then a clerk stacks splits. Same ticker. No averaged rating.',
    whenCompetitorWins:
      'A first draft, a filing summary, or a question you have not staffed yet. Speed, not inversion.',
    whenA61Wins:
      'When you already have a name and need Buffett and Wood to disagree in public — without a copilot that agrees with you.',
    rows: rows({
      job: 'One-model chat memo',
      analysis: 'Single voice, prompt-dependent',
      red: 'Only if you remember to ask',
      rating: 'Often sounds like a call',
      crypto: 'Generic writeup',
      best: 'A first draft, not a desk',
    }),
    faqs: [
      {
        question: 'Can ChatGPT replace an investment committee?',
        answer:
          'It can draft. It cannot keep 16–61 methodologies from collapsing into one paragraph. Agents61 isolates seats so a growth seat cannot sand a value seat.',
      },
      {
        question: 'Does Agents61 use ChatGPT under the hood?',
        answer:
          'Frontier models run the legend twins. The product difference is seating and isolation — not which API wrote the sentence.',
      },
      {
        question: 'Will Agents61 tell me what to buy?',
        answer: 'No. Isolated briefs never say you should buy. There is no order routing.',
      },
    ],
    related: [
      { label: 'ChatGPT stock analysis limits (note)', href: '/blog/chatgpt-stock-analysis-limits' },
      ...RELATED_CORE,
    ],
  },
  {
    slug: 'seeking-alpha',
    competitor: 'Seeking Alpha',
    keyword: 'Seeking Alpha alternative',
    title: 'Agents61 vs Seeking Alpha — Committee Simulation vs Article Mill (2026)',
    description:
      'Seeking Alpha alternative: Agents61 runs isolated master briefs instead of one byline and a rating. Compare stock analysis, red-team seats, and buy-button risk.',
    h1: 'Agents61 vs Seeking Alpha: committee vs a byline',
    eyebrow: 'Compare · Stock analysis sites',
    intro:
      'Seeking Alpha sells human (or hybrid) opinion at a subscription. Quality varies. You still get one narrative at a time, often with a rating that behaves like a buy button. Agents61 does not publish a rating. It publishes splits.',
    whenCompetitorWins:
      'You want a human author, a ticker recap stream, or a quant rating to skim.',
    whenA61Wins:
      'You want the same ticker stress-tested by named methods — Graham, Lynch, Burry — without a consensus score.',
    rows: rows({
      job: 'Articles and author ratings',
      analysis: 'One narrative at a time',
      red: 'Sometimes, uneven',
      rating: 'Ratings are the hook',
      crypto: 'Mixed coverage',
      best: 'Reading one thesis',
    }),
    faqs: [
      {
        question: 'Is Agents61 a Seeking Alpha alternative?',
        answer:
          'For structured disagreement, yes. For a daily article feed and author following, no. Keep SA if you read bylines. Add the desk when you need inversion.',
      },
      {
        question: 'Does Agents61 have quant ratings like SA?',
        answer: 'No. A clerk stacks agreements and splits. There is no composite buy/hold/sell.',
      },
    ],
    related: [
      { label: 'Seeking Alpha alternative note', href: '/blog/seeking-alpha-alternative-committee' },
      { label: 'Use case: red-team a thesis', href: '/use-cases/red-team-a-thesis' },
      ...RELATED_CORE,
    ],
  },
  {
    slug: 'yahoo-finance',
    competitor: 'Yahoo Finance',
    keyword: 'Yahoo Finance stock analysis alternative',
    title: 'Agents61 vs Yahoo Finance — Committee vs Quote Tape (2026)',
    description:
      'Yahoo Finance wins at quotes, charts, and filings links. Agents61 wins when you need an investment committee on a ticker. Not a terminal replacement.',
    h1: 'Agents61 vs Yahoo Finance: desk vs tape',
    eyebrow: 'Compare · Data sites',
    intro:
      'Yahoo Finance is excellent at last price, charts, and a path to filings. It will not invert MSFT or keep a red team alive after a bull paragraph. Agents61 is not a quote product. Keep the tape. Staff the desk.',
    whenCompetitorWins: 'Checking a last print, a chart, or a filing link in two clicks.',
    whenA61Wins: 'You already have the quote and need a committee to write without averaging.',
    rows: rows({
      job: 'Quotes, charts, filings links',
      analysis: 'Data first, thesis optional',
      red: 'Not the product',
      rating: 'Not advice; still a tape',
      crypto: 'Prices if listed',
      best: 'Checking a last price',
    }),
    faqs: [
      {
        question: 'Does Agents61 replace Yahoo Finance?',
        answer: 'No. It does not try to be a tape. Use Yahoo for quotes. Use Agents61 for isolated briefs.',
      },
    ],
    related: RELATED_CORE,
  },
  {
    slug: 'koyfin',
    competitor: 'Koyfin',
    keyword: 'Koyfin vs Agents61',
    title: 'Agents61 vs Koyfin — Research Desk vs Data Terminal (2026)',
    description:
      'Koyfin is a retail-friendly data terminal. Agents61 is a 61-master research simulation. Compare charts vs isolated briefs — they are different jobs.',
    h1: 'Agents61 vs Koyfin: briefs vs a terminal',
    eyebrow: 'Compare · Terminals',
    intro:
      'Koyfin, TradingView, and Bloomberg-class terminals win at data density. Agents61 will not replace a watchlist of 40 multiples. It will staff named seats to write after you already have the numbers.',
    whenCompetitorWins: 'Screening, charting, and comparing multiples across a universe.',
    whenA61Wins: 'A single name that needs inversion, cycle context, and a clerk stack.',
    rows: rows({
      job: 'Retail data terminal',
      analysis: 'Charts, multiples, dashboards',
      red: 'Not the product',
      rating: 'You build the view',
      crypto: 'If the terminal lists it',
      best: 'Pros and power users who live in data',
    }),
    faqs: [
      {
        question: 'Is Agents61 a Koyfin or Bloomberg alternative?',
        answer:
          'No. POSITIONING is explicit: professionals who need a terminal should keep it. Agents61 is the committee layer, not FactSet.',
      },
    ],
    related: [
      { label: 'Koyfin vs committee note', href: '/blog/koyfin-vs-committee-research' },
      ...RELATED_CORE,
    ],
  },
  {
    slug: 'tipranks',
    competitor: 'TipRanks',
    keyword: 'TipRanks alternative',
    title: 'Agents61 vs TipRanks — Isolated Masters vs Analyst Aggregation (2026)',
    description:
      'TipRanks aggregates Street ratings. Agents61 isolates historical methodologies and refuses a composite score. Compare smart-score culture vs clerk splits.',
    h1: 'Agents61 vs TipRanks: splits vs a smart score',
    eyebrow: 'Compare · Analyst aggregation',
    intro:
      'TipRanks is useful when you want to see what the Street already said. Averaging analysts is the opposite of isolation. Agents61 will not turn 61 seats into a smart score.',
    whenCompetitorWins: 'You want a heatmap of published analyst ratings and insider prints.',
    whenA61Wins: 'You want methods that predate this quarter’s consensus to write independently.',
    rows: rows({
      job: 'Aggregate Street ratings',
      analysis: 'Consensus and scorecards',
      red: 'Not structured inversion',
      rating: 'Scores are the product',
      crypto: 'Limited',
      best: 'Tracking what analysts already published',
    }),
    faqs: [
      {
        question: 'Does Agents61 show Wall Street ratings?',
        answer: 'No. It simulates historical master methods. That is not a live analyst poll.',
      },
    ],
    related: RELATED_CORE,
  },
  {
    slug: 'gurufocus',
    competitor: 'GuruFocus',
    keyword: 'GuruFocus alternative',
    title: 'Agents61 vs GuruFocus — Live 13F Tracking vs Method Simulation (2026)',
    description:
      'GuruFocus tracks what famous investors filed. Agents61 simulates how those methods would write on a ticker today. Different jobs — do not confuse a 13F with a brief.',
    h1: 'Agents61 vs GuruFocus: method vs 13F',
    eyebrow: 'Compare · Guru trackers',
    intro:
      'GuruFocus and Dataroma-style pages show what a fund reported last quarter. Agents61 does not claim Buffett bought the name. It runs a Buffett-shaped test. Those are not the same claim.',
    whenCompetitorWins: 'You want actual 13F holdings, ownership history, and guru screens.',
    whenA61Wins: 'You want the method applied to a ticker you already picked — without implying a live trade.',
    rows: rows({
      job: '13F and guru screens',
      analysis: 'Holdings history',
      red: 'Not a debate desk',
      rating: 'Ownership as signal',
      crypto: 'Not the core',
      best: 'Copying or tracking disclosed holdings',
    }),
    faqs: [
      {
        question: 'Does Agents61 use real Buffett holdings?',
        answer:
          'No. Personas are unaffiliated simulations from public books and letters. A 13F is a filing. A brief is a method.',
      },
    ],
    related: RELATED_CORE,
  },
  {
    slug: 'morningstar',
    competitor: 'Morningstar',
    keyword: 'Morningstar alternative research',
    title: 'Agents61 vs Morningstar — Committee Splits vs Star Ratings (2026)',
    description:
      'Morningstar sells moat language and star ratings. Agents61 refuses a composite score and keeps isolated master briefs. Compare fund research vs a ticker committee.',
    h1: 'Agents61 vs Morningstar: splits vs stars',
    eyebrow: 'Compare · Fund research',
    intro:
      'Morningstar is strong on funds, moats, and a rating grammar investors already know. Agents61 is a ticker committee. It will not give you five stars. It will give you seats that disagree.',
    whenCompetitorWins: 'Fund due diligence, style boxes, and a familiar star rating.',
    whenA61Wins: 'A single equity or ETF that needs isolated methods, not a star.',
    rows: rows({
      job: 'Fund and equity ratings',
      analysis: 'Moat + fair value language',
      red: 'Analyst note, one voice',
      rating: 'Stars are the hook',
      crypto: 'Not the core',
      best: 'Fund shoppers and rating readers',
    }),
    faqs: [
      {
        question: 'Is this a cheaper Morningstar?',
        answer: 'No. Different output. Morningstar rates. Agents61 stacks isolated briefs.',
      },
    ],
    related: RELATED_CORE,
  },
  {
    slug: 'perplexity',
    competitor: 'Perplexity',
    keyword: 'Perplexity stock analysis vs Agents61',
    title: 'Agents61 vs Perplexity — Cited Chat vs Isolated Committee (2026)',
    description:
      'Perplexity cites the open web quickly. Agents61 isolates 61 methods and refuses to average them. Compare research chat vs a staffed desk.',
    h1: 'Agents61 vs Perplexity: citations vs seats',
    eyebrow: 'Compare · Answer engines',
    intro:
      'Perplexity is a strong first pass: sources, filings links, a summary. The risk is still one synthesized voice. Agents61 pays for empty seats so a growth method cannot rewrite a value method mid-paragraph.',
    whenCompetitorWins: 'A sourced overview before you decide the ticker is worth a desk run.',
    whenA61Wins: 'After the overview, when you need named disagreement on the record.',
    rows: rows({
      job: 'Cited answer engine',
      analysis: 'Web + filings, one synthesis',
      red: 'Prompt-dependent',
      rating: 'Can sound decisive',
      crypto: 'News-shaped',
      best: 'Fast sourced briefing',
    }),
    faqs: [
      {
        question: 'Can I use both?',
        answer: 'Yes. Perplexity to gather. Agents61 to staff and invert. That is the intended stack.',
      },
    ],
    related: [
      { label: 'Best AI for stock research', href: '/blog/best-ai-for-stock-research-2026' },
      ...RELATED_CORE,
    ],
  },
  {
    slug: 'bloomberg',
    competitor: 'Bloomberg',
    keyword: 'Bloomberg terminal alternative for retail',
    title: 'Agents61 vs Bloomberg — Retail Committee vs Professional Terminal (2026)',
    description:
      'Bloomberg is the professional terminal. Agents61 is not a cheaper Bloomberg. It is a research-committee simulation for intermediate investors who already have a tape.',
    h1: 'Agents61 vs Bloomberg: not a cheaper terminal',
    eyebrow: 'Compare · Professional terminals',
    intro:
      'If you need Bloomberg, you need Bloomberg. Agents61 does not pretend to be a data plant. It is a 61-seat writing desk for people who already have quotes somewhere else.',
    whenCompetitorWins: 'Live markets, messaging, and institutional data. Always.',
    whenA61Wins: 'Retail research simulation after you already pulled the numbers.',
    rows: rows({
      job: 'Institutional terminal',
      analysis: 'Data, news, analytics',
      red: 'You staff the meeting',
      rating: 'Not a retail rating product',
      crypto: 'If the desk pays for it',
      best: 'Professionals',
    }),
    faqs: [
      {
        question: 'Is Agents61 a Bloomberg alternative for retail?',
        answer:
          'Only in the narrow sense that it is research software. It is not a terminal alternative. We say that on purpose.',
      },
    ],
    related: RELATED_CORE,
  },
];

export function getCompareHub(slug: string) {
  return COMPARE_HUBS.find((h) => h.slug === slug);
}
