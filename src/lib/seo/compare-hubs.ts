import type { CompareHub, SeoSection } from '@/lib/seo/hub-types';

const RELATED_CORE = [
  { label: 'All comparisons', href: '/compare' },
  { label: 'AI investment committee', href: '/ai-investment-committee' },
  { label: 'How the desk writes', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
];

function rows(competitor: Record<string, string>): CompareHub['rows'] {
  return [
    { feature: 'Job', a61: 'Investment committee simulation', competitor: competitor.job },
    { feature: 'Stock analysis', a61: 'Named masters, isolated or pipeline handoff', competitor: competitor.analysis },
    { feature: 'Red team / inversion', a61: 'Dedicated debate seats', competitor: competitor.red },
    { feature: 'Buy button / rating', a61: 'None. Splits stay splits', competitor: competitor.rating },
    { feature: 'Crypto / on-chain', a61: 'Separate board, no fake P/E', competitor: competitor.crypto },
    { feature: 'Best for', a61: 'Intermediate investors who already research', competitor: competitor.best },
  ];
}

const DESK_FLOW: SeoSection = {
  heading: 'What you actually get on Agents61',
  body: 'You bring a ticker (or open Prediction Markets for event odds). Unlocked seats write under their own rules. Isolated mode means seats cannot peek at each other. A clerk then stacks agreements and splits — without a composite buy/hold/sell. Empty seats stay empty; you pay for staffing, not a louder chat.',
};

const COMPLIANCE: SeoSection = {
  heading: 'What Agents61 will not do',
  body: 'No order routing. No wallet. No “you should buy” sentence at the bottom of a brief. Personas are unaffiliated simulations from books and letters — not the living people, not a 13F tip, not a Street poll. Keep your tape and your broker for execution.',
};

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
      'A first draft, a filing summary, brainstorming questions, or a topic you have not staffed yet. Speed and breadth beat seating when you still need to find the question.',
    whenA61Wins:
      'When you already have a name and need Buffett and Wood to disagree in public — without a copilot that agrees with you and collapses 16 methods into one fluent voice.',
    rows: rows({
      job: 'One-model chat memo',
      analysis: 'Single voice, prompt-dependent',
      red: 'Only if you remember to ask',
      rating: 'Often sounds like a call',
      crypto: 'Generic writeup',
      best: 'A first draft, not a desk',
    }),
    sections: [
      {
        heading: 'Why one fluent memo fails as a committee',
        body: 'A single model can role-play “Buffett” and “Wood” in the same thread. The second voice has already read the first. That is theater, not isolation. Agents61 pays for empty chairs so a growth seat cannot sand a value seat mid-paragraph. The clerk records the split instead of negotiating it away.',
      },
      DESK_FLOW,
      {
        heading: 'A practical stack',
        body: 'Use ChatGPT (or Perplexity) to gather filings links and a first pass. When the ticker is worth a desk run, register on Agents61, staff unlocked masters, and force a kill-condition before you size. Keep ChatGPT for drafting; keep Agents61 for disagreement on the record.',
      },
      COMPLIANCE,
    ],
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
      {
        question: 'Do I need to abandon ChatGPT?',
        answer:
          'No. Use it for speed. Use Agents61 when you need named methods that cannot rewrite each other. That stack is intentional.',
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
      'You want a human author, a ticker recap stream, community comments, or a quant rating to skim before deeper work.',
    whenA61Wins:
      'You want the same ticker stress-tested by named methods — Graham, Lynch, Burry — without a consensus score that hides the argument.',
    rows: rows({
      job: 'Articles and author ratings',
      analysis: 'One narrative at a time',
      red: 'Sometimes, uneven',
      rating: 'Ratings are the hook',
      crypto: 'Mixed coverage',
      best: 'Reading one thesis',
    }),
    sections: [
      {
        heading: 'Bylines vs empty chairs',
        body: 'A good Seeking Alpha piece is still one thesis with one author’s incentives. Agents61 is seating: unlocked masters write alone, then a clerk stacks. If half the room kills the idea, that split stays on the page — it does not get averaged into “Hold.”',
      },
      DESK_FLOW,
      {
        heading: 'How to use both',
        body: 'Read SA for coverage and author context. When a piece moves you, staff Agents61 on the ticker and ask what would invalidate the thesis. Keep the article. Add inversion before size.',
      },
      COMPLIANCE,
    ],
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
      {
        question: 'Can I red-team a Seeking Alpha thesis here?',
        answer:
          'Yes — that is a core use case. Paste the ticker, staff debate seats, and keep the bull narrative from editing the bear narrative.',
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
    whenCompetitorWins:
      'Checking a last print, a chart, news headlines, or a filing link in two clicks — the daily tape job.',
    whenA61Wins:
      'You already have the quote and need a committee to write without averaging. Thesis work after the numbers, not instead of them.',
    rows: rows({
      job: 'Quotes, charts, filings links',
      analysis: 'Data first, thesis optional',
      red: 'Not the product',
      rating: 'Not advice; still a tape',
      crypto: 'Prices if listed',
      best: 'Checking a last price',
    }),
    sections: [
      {
        heading: 'Tape first, committee second',
        body: 'Agents61 assumes you already pulled last price, volume, and a path to the 10-K elsewhere. We will not race Yahoo on charts. We will staff Graham, Lynch, and a debate seat on the name you already verified exists.',
      },
      DESK_FLOW,
      {
        heading: 'Typical workflow',
        body: 'Open Yahoo (or your broker) → confirm the ticker and a few multiples → register on Agents61 → run isolated briefs → read clerk splits → write one kill-condition before you size. Two tools, two jobs.',
      },
      COMPLIANCE,
    ],
    faqs: [
      {
        question: 'Does Agents61 replace Yahoo Finance?',
        answer:
          'No. It does not try to be a tape. Use Yahoo for quotes, charts, and filings links. Use Agents61 for isolated briefs and inversion.',
      },
      {
        question: 'Will Agents61 show live quotes?',
        answer:
          'The product is research writing, not a streaming quote plant. Keep Yahoo or your broker for prints.',
      },
      {
        question: 'What about news headlines on Yahoo?',
        answer:
          'Useful context. On Agents61, news-aware seats still write under method rules — and prediction research has its own news layer on paid plans. Neither is a replacement for a wire.',
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
    whenCompetitorWins: 'Screening, charting, and comparing multiples across a universe — the daily terminal job.',
    whenA61Wins: 'A single name that needs inversion, cycle context, and a clerk stack after the screen.',
    rows: rows({
      job: 'Retail data terminal',
      analysis: 'Charts, multiples, dashboards',
      red: 'Not the product',
      rating: 'You build the view',
      crypto: 'If the terminal lists it',
      best: 'Pros and power users who live in data',
    }),
    sections: [
      {
        heading: 'Terminals do not invert for you',
        body: 'A great Koyfin layout still leaves the thesis in your head. Agents61 externalizes disagreement: unlocked methods write alone, then the clerk shows where they split. That is not a cheaper FactSet — it is a different layer.',
      },
      DESK_FLOW,
      COMPLIANCE,
    ],
    faqs: [
      {
        question: 'Is Agents61 a Koyfin or Bloomberg alternative?',
        answer:
          'No. Positioning is explicit: professionals who need a terminal should keep it. Agents61 is the committee layer, not FactSet.',
      },
      {
        question: 'Can I screen names on Agents61?',
        answer:
          'Opportunity boards and prediction scanners help prioritize, but this is not a multi-factor equity screener. Bring candidates from Koyfin, then staff the desk.',
      },
      {
        question: 'Who is this for?',
        answer:
          'Intermediate investors who already research. If you live in charts and multiples all day, keep Koyfin. Add Agents61 when a name needs a committee.',
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
    whenCompetitorWins: 'You want a heatmap of published analyst ratings, price targets, and insider prints.',
    whenA61Wins: 'You want methods that predate this quarter’s consensus to write independently — without a composite badge.',
    rows: rows({
      job: 'Aggregate Street ratings',
      analysis: 'Consensus and scorecards',
      red: 'Not structured inversion',
      rating: 'Scores are the product',
      crypto: 'Limited',
      best: 'Tracking what analysts already published',
    }),
    sections: [
      {
        heading: 'Consensus is a different claim',
        body: 'A TipRanks smart score answers “what did published analysts say?” Agents61 answers “what do isolated historical methods write on this ticker today?” Mixing those claims is how investors confuse a poll with a brief.',
      },
      DESK_FLOW,
      COMPLIANCE,
    ],
    faqs: [
      {
        question: 'Does Agents61 show Wall Street ratings?',
        answer: 'No. It simulates historical master methods. That is not a live analyst poll.',
      },
      {
        question: 'Is Agents61 a TipRanks alternative?',
        answer:
          'Only for people who wanted method-shaped research instead of Street aggregation. Keep TipRanks for the poll. Add Agents61 for isolation.',
      },
      {
        question: 'Why refuse a composite score?',
        answer:
          'Compression hides the argument. The product is the split — which seats agreed, which killed the idea, and why.',
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
    sections: [
      {
        heading: 'A 13F is a filing. A brief is a method.',
        body: 'Copying a disclosed holding is a different product from stress-testing a ticker under Graham or Lynch rules. Agents61 never claims a living fund bought the name yesterday. Personas are unaffiliated simulations from public books and letters.',
      },
      {
        heading: 'After you see a holding',
        body: 'Open GuruFocus (or DeepTicker) → note the ticker → register on Agents61 → staff the relevant method seats → read splits and kill-conditions. Ownership history informs curiosity. The desk informs whether the method still likes the story.',
      },
      DESK_FLOW,
      COMPLIANCE,
    ],
    faqs: [
      {
        question: 'Does Agents61 use real Buffett holdings?',
        answer:
          'No. Personas are unaffiliated simulations from public books and letters. A 13F is a filing. A brief is a method.',
      },
      {
        question: 'Is Agents61 a GuruFocus alternative?',
        answer:
          'For ownership tracking, no. For applying a method to a ticker you already care about, yes — that is the adjacent job.',
      },
      {
        question: 'How does this relate to DeepTicker?',
        answer:
          'DeepTicker and GuruFocus compete on tracking. Agents61 sits beside both. See /compare/deepticker.',
      },
    ],
    related: [
      { label: 'Warren Buffett seat', href: '/masters/warren-buffett' },
      { label: 'Stanley Druckenmiller seat', href: '/masters/stanley-druckenmiller' },
      { label: 'David Tepper seat', href: '/masters/david-tepper' },
      { label: 'vs DeepTicker', href: '/compare/deepticker' },
      ...RELATED_CORE,
    ],
  },
  {
    slug: 'deepticker',
    competitor: 'DeepTicker',
    keyword: 'DeepTicker vs GuruFocus',
    title: 'Agents61 vs DeepTicker — Method Simulation vs Guru Tracker (2026)',
    description:
      'DeepTicker vs GuruFocus-style tools track disclosed holdings. Agents61 simulates investment methods on a ticker you already picked — isolated briefs, not a 13F copy signal.',
    h1: 'Agents61 vs DeepTicker: research seats vs guru tracking',
    eyebrow: 'Compare · Guru trackers',
    intro:
      'Searchers comparing DeepTicker and GuruFocus usually want ownership history. Agents61 is a different job: staff named methodology seats on a ticker, keep them isolated, and publish splits. We do not claim a living fund bought the name yesterday.',
    whenCompetitorWins:
      'You want screens of disclosed holdings, ownership changes, and guru-follower tools — the tracking job.',
    whenA61Wins:
      'You already have a ticker and want Buffett-, Lynch-, or Druckenmiller-shaped tests written in isolation — without treating a 13F as a tip.',
    rows: rows({
      job: 'Guru / holdings tracker',
      analysis: 'Disclosed ownership history',
      red: 'Not a multi-method debate desk',
      rating: 'Follow-the-filer signal risk',
      crypto: 'Not the core',
      best: 'Watching what funds reported',
    }),
    sections: [
      {
        heading: 'DeepTicker vs GuruFocus vs Agents61',
        body: 'DeepTicker and GuruFocus compete on who filed what and when. Agents61 does not enter that race. After a holding sparks curiosity, staff the method on the ticker: isolated seats, clerk splits, kill-conditions. Tracking answers “who owned it.” The desk answers “would this method still like the story under today’s facts?”',
      },
      {
        heading: 'Why follow-the-filer is not a brief',
        body: 'A 13F is lagged, incomplete, and silent on thesis. Treating it as a buy signal is a different risk from running a method simulation. Agents61 refuses to imply a live trade from a persona — and refuses a composite score that hides disagreement.',
      },
      DESK_FLOW,
      {
        heading: 'Suggested workflow',
        body: 'Screen ownership on DeepTicker or GuruFocus → pick one ticker → open the matching master page on Agents61 (e.g. Buffett, Lynch, Pabrai) → register → run Analyze → read the clerk stack before you size. Keep the tracker. Add the committee.',
      },
      COMPLIANCE,
    ],
    faqs: [
      {
        question: 'Is Agents61 a DeepTicker alternative?',
        answer:
          'Only if you wanted method-shaped research instead of ownership tracking. For 13F-style data, keep DeepTicker or GuruFocus. For committee simulation, use Agents61.',
      },
      {
        question: 'DeepTicker vs GuruFocus — where does Agents61 fit?',
        answer:
          'Those two compete on tracking. Agents61 sits beside them: after you see a holding, staff the method on the ticker. See also /compare/gurufocus.',
      },
      {
        question: 'Will Agents61 show real fund holdings?',
        answer:
          'No. We simulate methodologies from public books and letters. We do not scrape or republish living 13F positions as tips.',
      },
      {
        question: 'Which masters pair well after a guru screen?',
        answer:
          'Start with the method you were tracking — Buffett, Lynch, Druckenmiller, Tepper, Pabrai, Coleman — then add a debate seat so the bull narrative cannot edit the bear.',
      },
    ],
    related: [
      { label: 'vs GuruFocus', href: '/compare/gurufocus' },
      { label: 'Peter Lynch seat', href: '/masters/peter-lynch' },
      { label: 'Mohnish Pabrai seat', href: '/masters/mohnish-pabrai' },
      { label: 'Chase Coleman seat', href: '/masters/chase-coleman' },
      ...RELATED_CORE,
    ],
    ctaTitle: 'Done tracking holdings? Staff the method on your desk',
    ctaBody:
      'Register to run isolated master briefs on a ticker you found via DeepTicker or GuruFocus. Tracking shows who filed. Agents61 stress-tests the method — research simulation, not a copy-trade tip.',
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
    whenCompetitorWins: 'Fund due diligence, style boxes, fair-value language, and a familiar star rating.',
    whenA61Wins: 'A single equity or ETF that needs isolated methods, not a star that compresses the argument.',
    rows: rows({
      job: 'Fund and equity ratings',
      analysis: 'Moat + fair value language',
      red: 'Analyst note, one voice',
      rating: 'Stars are the hook',
      crypto: 'Not the core',
      best: 'Fund shoppers and rating readers',
    }),
    sections: [
      {
        heading: 'Stars compress. Splits preserve.',
        body: 'A Morningstar star is a useful shorthand for fund shoppers. Agents61 treats compression as the failure mode for ticker research: if every seat collapses into one badge, you paid for theater. The clerk keeps the argument visible.',
      },
      DESK_FLOW,
      COMPLIANCE,
    ],
    faqs: [
      {
        question: 'Is this a cheaper Morningstar?',
        answer: 'No. Different output. Morningstar rates. Agents61 stacks isolated briefs.',
      },
      {
        question: 'Can I research ETFs here?',
        answer:
          'Yes — as tickers through the equity desk and the ETF use case. You will not get a star substitute. See /use-cases/etf-committee.',
      },
      {
        question: 'Do you cover mutual funds like Morningstar?',
        answer:
          'Not as a fund plant. Agents61 is a research committee on names you bring — mainly US equities, ETFs, crypto board, and a private board.',
      },
    ],
    related: [
      { label: 'ETF committee use case', href: '/use-cases/etf-committee' },
      ...RELATED_CORE,
    ],
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
    sections: [
      {
        heading: 'Citations gather. Seats disagree.',
        body: 'Perplexity earns its place as a research front door. Agents61 starts when gathering is done: unlocked masters write under isolation, then a clerk stacks. Use both — gather, then staff.',
      },
      DESK_FLOW,
      {
        heading: 'Practical stack',
        body: 'Perplexity for sources and a first summary → Agents61 for isolated methods and inversion → your broker for execution. Do not ask either tool for a buy button.',
      },
      COMPLIANCE,
    ],
    faqs: [
      {
        question: 'Can I use both?',
        answer: 'Yes. Perplexity to gather. Agents61 to staff and invert. That is the intended stack.',
      },
      {
        question: 'Does Agents61 cite the open web like Perplexity?',
        answer:
          'Seats work from method rules and available context on the desk. Prediction research can add a paid news layer. We are not competing as a general answer engine.',
      },
      {
        question: 'Will Perplexity replace a committee?',
        answer:
          'A synthesis is still one voice. Isolation exists so methods cannot rewrite each other. That is the product difference.',
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
    whenA61Wins: 'Retail research simulation after you already pulled the numbers elsewhere.',
    rows: rows({
      job: 'Institutional terminal',
      analysis: 'Data, news, analytics',
      red: 'You staff the meeting',
      rating: 'Not a retail rating product',
      crypto: 'If the desk pays for it',
      best: 'Professionals',
    }),
    sections: [
      {
        heading: 'We say this on purpose',
        body: 'Search demand for a “Bloomberg alternative for retail” is real. Agents61 refuses the bait. Professionals who need the terminal should keep it. Intermediate investors who need a committee should staff Agents61 — after they already have a tape.',
      },
      DESK_FLOW,
      COMPLIANCE,
    ],
    faqs: [
      {
        question: 'Is Agents61 a Bloomberg alternative for retail?',
        answer:
          'Only in the narrow sense that it is research software. It is not a terminal alternative. We say that on purpose.',
      },
      {
        question: 'Who should use Agents61 instead?',
        answer:
          'Investors who already research on Yahoo, Koyfin, a broker, or a chat tool — and need isolated methods plus inversion, not another data plant.',
      },
      {
        question: 'Do you compete on news or messaging?',
        answer: 'No. Keep Bloomberg (or any wire) for that. Agents61 writes briefs and stacks splits.',
      },
    ],
    related: RELATED_CORE,
  },
  {
    slug: 'polymarket',
    competitor: 'Polymarket',
    keyword: 'Polymarket research tool',
    title: 'Agents61 vs Polymarket — Research Layer vs Prediction Exchange (2026)',
    description:
      'Polymarket prices YES/NO. Agents61 researches the odds: multi-agent probability gaps, Strategy Reports, and resolution checks. Not a wallet. Not a betting bot.',
    h1: 'Agents61 vs Polymarket: research the odds, do not replace the exchange',
    eyebrow: 'Compare · Prediction markets',
    intro:
      'Polymarket is the market: prices, volume, and settlement. Agents61 is the intelligence layer above it. We import crowd YES%, run a specialized prediction committee, and publish a Probability Gap — research simulation only. No buy YES/NO. No order routing.',
    whenCompetitorWins:
      'You need live odds, liquidity, or to trade the contract on Polymarket itself.',
    whenA61Wins:
      'You already see a mid and want independent probability research: base rates, news layer, resolution risk, and why the crowd may be wrong.',
    rows: [
      { feature: 'Job', a61: 'Prediction-market probability research', competitor: 'Prediction exchange + prices' },
      { feature: 'Market probability', a61: 'Reads Polymarket YES mid as input', competitor: 'Sets the mid via trading' },
      { feature: 'Independent estimate', a61: 'Multi-agent Agents61 probability + range', competitor: 'Crowd-implied only' },
      { feature: 'Probability Gap', a61: 'Core product metric (A61 − Market)', competitor: 'Not a research product' },
      { feature: 'Trade / wallet', a61: 'None — View Market only', competitor: 'Buy YES / NO on venue' },
      { feature: 'Best for', a61: 'Investors researching event odds', competitor: 'Traders who want the contract' },
    ],
    sections: [
      {
        heading: 'Markets price the future. Agents61 researches the odds.',
        body: 'That line is the product. Polymarket settles contracts. Agents61 answers whether the mid makes sense under independent research: base rates, domain, market structure, Bayesian update, contrarian and red-team seats, resolution wording — then a Prediction Clerk synthesizes range and confidence.',
      },
      {
        heading: 'What a Probability Gap is (and is not)',
        body: 'Gap = Agents61 estimate − market YES%. It is disagreement under research uncertainty — not a guaranteed edge. Resolution ambiguity can make a “correct” world-event resolve the wrong way for the contract. Free desks get one Analyze; paid desks add news layer and Pro Clerk.',
      },
      {
        heading: 'How to start',
        body: 'Open /predictions → sort Top Gaps or paste a Polymarket /event/… URL → run Analyze → read why-wrong and why-right before any edge story → Watchlist the mid. Keep Polymarket for trading. Keep Agents61 for research.',
      },
      COMPLIANCE,
    ],
    faqs: [
      {
        question: 'Is Agents61 a Polymarket alternative?',
        answer:
          'No. Polymarket is the venue. Agents61 is odds research on top of public market data — paste a URL, analyze, watchlist. We do not execute trades.',
      },
      {
        question: 'Can Agents61 guarantee a profitable gap?',
        answer:
          'No. Gaps are probability disagreement, not guaranteed returns. Resolution wording and information risk can dominate.',
      },
      {
        question: 'Do you support Kalshi?',
        answer:
          'Architecture is multi-provider. Polymarket is live first; Kalshi follows after validation.',
      },
      {
        question: 'Is there a free analyze?',
        answer:
          'Yes — one free Analyze to try the Strategy Report. Paid desks unlock news layer, Pro Clerk, and ongoing use alongside the equity committee.',
      },
    ],
    related: [
      { label: 'Prediction Markets desk', href: '/predictions' },
      { label: 'Market Scanner', href: '/predictions/scanner' },
      { label: 'How to research a probability gap', href: '/learn/probability-gap-research' },
      { label: 'All comparisons', href: '/compare' },
    ],
    ctaTitle: 'Research Polymarket odds on your desk',
    ctaBody:
      'Register to open Prediction Markets, run Analyze, and keep a watchlist. Polymarket stays the exchange. Agents61 stays the research layer — no wallet, no Buy YES/NO.',
    ctaHref: '/predictions',
    ctaGuestHref: '/register?next=%2Fpredictions',
  },
];

export function getCompareHub(slug: string) {
  return COMPARE_HUBS.find((h) => h.slug === slug);
}
