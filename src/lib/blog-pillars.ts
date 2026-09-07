import type { BlogPost } from '@/lib/blog';

export const BLOG_PILLARS: BlogPost[] = [
  {
    slug: 'chatgpt-stock-analysis-limits',
    title: 'ChatGPT stock analysis: what a fluent memo cannot do',
    date: 'September 5, 2026',
    excerpt:
      'ChatGPT writes a fast AAPL memo. It cannot keep 16–61 methodologies from collapsing into one paragraph. Isolation is the product difference.',
    tags: ['ChatGPT stock analysis', 'AI stock research', 'multi-agent investing', 'Agents61 vs ChatGPT'],
    category: 'compare',
    readingMinutes: 12,
    keyTakeaway:
      'A chatbot is a first draft. An investment committee is isolated seats plus a clerk stack. If every “master” can see the same draft, you still have one model.',
    relatedSlugs: ['vs-yahoo-seeking-alpha-chatgpt', 'best-ai-for-stock-research-2026', 'ai-agents-for-investing'],
    body: [
      'People type “ChatGPT stock analysis” because the demo is instant. You paste a ticker, you get a memo, and it sounds like equity research. The failure mode is not grammar. It is anchoring: the first confident paragraph becomes the room.',
      'Agents61 uses frontier models too. The difference is seating. Named master agents write isolated briefs. A clerk stacks agreements and splits. Nobody gets a consensus badge. That is the whole product claim.',
    ],
    sections: [
      {
        heading: 'What ChatGPT is good at',
        body: 'A first pass. A 10-K summary. A list of questions you have not asked yet. Speed. If you have not staffed a desk, a chatbot is a reasonable scratchpad. Keep it for that job.',
      },
      {
        heading: 'Where the memo lies',
        body: 'One voice. Prompt-dependent inversion. A tone that often sounds like a call even when you asked for balance. If you add “write as Buffett, then as Wood,” the second voice usually borrows the first. Two fonts. One model.',
      },
      {
        heading: 'Multi-agent theater is the same bug',
        body: 'Products that put 20 names in a group chat still share context. That is how committees get captured. Isolated mode on Agents61 forbids the peek. Division of labor allows a pipeline handoff, not a 61-way debate.',
      },
      {
        heading: 'A workflow that does not pretend',
        body: 'Use ChatGPT or Perplexity to gather. Pull quotes on Yahoo or your broker. Convene the desk on the leftover belief. Read the clerk stack before the eloquent seat. Do not ask either product what to buy.',
      },
      {
        heading: 'Compliance, not theater',
        body: 'Agents61 is a research simulation. Isolated briefs never say you should buy. There is no order routing. Personas are unaffiliated with the historical people. If a chatbot offered you a ticket, that was the tell.',
      },
    ],
    faqs: [
      {
        question: 'Does Agents61 use ChatGPT under the hood?',
        answer:
          'Frontier models run the legend twins. The product difference is isolation and seating — not which API wrote the sentence.',
      },
      {
        question: 'Can ChatGPT replace an investment committee?',
        answer: 'It can draft. It cannot keep methods from collapsing into one paragraph.',
      },
      {
        question: 'Should I stop using ChatGPT for stocks?',
        answer: 'No. Use it as a first draft. Staff a desk when you need disagreement on the record.',
      },
    ],
  },
  {
    slug: 'seeking-alpha-alternative-committee',
    title: 'A Seeking Alpha alternative that refuses a rating',
    date: 'September 5, 2026',
    excerpt:
      'Seeking Alpha sells a byline and a score. Agents61 publishes splits. Keep SA if you read authors. Add the desk when you need inversion.',
    tags: ['Seeking Alpha alternative', 'stock analysis sites', 'investment committee', 'quant ratings'],
    category: 'compare',
    readingMinutes: 11,
    keyTakeaway:
      'If you want a human author and a daily feed, stay on Seeking Alpha. If you want named methods to disagree without a composite buy/hold/sell, that is a different product.',
    relatedSlugs: ['vs-yahoo-seeking-alpha-chatgpt', 'red-team-stock-idea', 'best-ai-for-stock-research-2026'],
    body: [
      '“Seeking Alpha alternative” usually means one of two jobs: cheaper articles, or a score that feels less captured. Agents61 is neither. It is a 61-seat research simulation that will not print a rating.',
      'SA is useful. Quality varies. You still get one narrative at a time. The rating grammar is the hook even when the lawyers say it is not advice. A committee that keeps splits is the opposite hook.',
    ],
    sections: [
      {
        heading: 'When Seeking Alpha wins',
        body: 'You want a human byline, a ticker recap stream, or a quant rating to skim. You follow authors. You want comments. That is a media product. We do not pretend to be one.',
      },
      {
        heading: 'When a committee wins',
        body: 'You already have a name. You want Graham, Lynch, and Burry to write without seeing each other. You want the clerk to say they split. You do not want a smart score to launder the disagreement.',
      },
      {
        heading: 'Ratings are a different business',
        body: 'Composite scores feel like work. They also hide the method that dissented. Agents61 will not turn 61 seats into a star. If you need stars, Morningstar already exists. If you need Street aggregation, so does TipRanks.',
      },
      {
        heading: 'How to use both',
        body: 'Read the SA piece. Write the leftover belief in one sentence. Convene the desk. Compare the author rating to the clerk stack. If they agree too quickly, invert again.',
      },
    ],
    faqs: [
      {
        question: 'Is Agents61 a Seeking Alpha alternative?',
        answer: 'For structured disagreement, yes. For a daily article feed and author following, no.',
      },
      {
        question: 'Do you have quant ratings?',
        answer: 'No. A clerk stacks agreements and splits. There is no composite buy/hold/sell.',
      },
    ],
  },
  {
    slug: 'koyfin-vs-committee-research',
    title: 'Koyfin vs a research committee: terminals are not desks',
    date: 'September 5, 2026',
    excerpt:
      'Koyfin wins at charts and multiples. Agents61 wins after you already have the numbers. Not a cheaper Bloomberg. Not a FactSet replacement.',
    tags: ['Koyfin vs Agents61', 'data terminal', 'stock research tools', 'Bloomberg alternative'],
    category: 'compare',
    readingMinutes: 10,
    keyTakeaway:
      'A terminal is a data plant. A committee is a writing desk. Professionals who need Koyfin, TradingView, or Bloomberg should keep them. Agents61 starts after the tape.',
    relatedSlugs: ['vs-yahoo-seeking-alpha-chatgpt', 'how-to-research-a-stock'],
    body: [
      'Koyfin is a serious retail terminal: watchlists, multiples, chart density. Comparing it to Agents61 as if they were substitutes is a category error. One shows the numbers. The other staffs methods to write after you have them.',
    ],
    sections: [
      {
        heading: 'What terminals are for',
        body: 'Screening, charting, comparing a universe, living in data. Bloomberg, FactSet, Koyfin, TradingView. If that is your job, pay for it. Agents61 will not replace a watchlist of 40 multiples.',
      },
      {
        heading: 'What a committee is for',
        body: 'A single name that needs inversion, cycle context, and a clerk stack. Named seats that cannot contaminate each other. Empty chairs that stay empty. No quote plant.',
      },
      {
        heading: 'The “Bloomberg alternative for retail” search',
        body: 'We rank for that phrase so we can refuse it. Agents61 is not a cheaper terminal. It is a research-committee simulation for intermediate investors who already have a tape somewhere else.',
      },
      {
        heading: 'A sane stack',
        body: 'Koyfin or Yahoo for the tape. Agents61 for the writing. A human for the capital. If you drop the middle, you have data without inversion. If you drop the first, you have prose without facts.',
      },
    ],
    faqs: [
      {
        question: 'Is Agents61 a Koyfin or Bloomberg alternative?',
        answer: 'No. Keep the terminal. Add the committee layer.',
      },
    ],
  },
  {
    slug: 'best-ai-for-stock-research-2026',
    title: 'Best AI for stock research in 2026 — score the job, not the demo',
    date: 'September 5, 2026',
    excerpt:
      'The best AI for stock research is the one that isolates methods, refuses a buy button, and leaves empty seats empty. Chatbots win speed. Committees win inversion.',
    tags: ['best AI for stock research', 'AI stock analysis 2026', 'ChatGPT vs committee', 'Perplexity stock analysis'],
    category: 'compare',
    readingMinutes: 13,
    keyTakeaway:
      'Score tools on isolation, inversion, empty-seat honesty, and whether they emit a ticket. Cinematic demos and “one prompt, full diligence” are the red flags.',
    relatedSlugs: [
      'chatgpt-stock-analysis-limits',
      'ai-agents-for-investing',
      'vs-yahoo-seeking-alpha-chatgpt',
    ],
    body: [
      '“Best AI for stock research” is a shopping query. Most listicles rank chatbots by fluency. Fluency is the failure mode. The useful scorecard is whether the system can disagree with you without collapsing into one paragraph.',
    ],
    sections: [
      {
        heading: 'What searchers actually need',
        body: 'Intermediate US investors already have a broker and a tape. They want structured disagreement: value vs growth, cycle vs story, red team vs leftover belief. Beginners who want a ticker tip are in the wrong aisle. We do not serve that aisle.',
      },
      {
        heading: 'Scorecard (use this anywhere)',
        body: '1) Isolation — can methods see each other? 2) Inversion — is debate a dedicated step? 3) Empty seats — does upgrading light chairs or just get louder? 4) Rating reflex — does it print buy/hold/sell? 5) Asset honesty — will it invent a P/E for BTC? 6) Human residual — does it claim the risk is gone?',
      },
      {
        heading: 'Shortlist by job, not a fake top ten',
        body: 'ChatGPT / Claude: first draft. Perplexity: sourced overview. Yahoo / Koyfin: tape. Seeking Alpha / Morningstar: byline or stars. Agents61: isolated committee after you picked the name. GuruFocus: 13Fs, not methods. TipRanks: Street aggregation, the opposite of isolation.',
      },
      {
        heading: 'How Agents61 fits the scorecard',
        body: 'Named seats. Isolated default. Pipeline handoff as an option. Clerk stacks, does not vote. Analyst 16 at $19 through Partners 61 at $349. Crypto board without a fake multiple. No order routing. Personas unaffiliated.',
      },
      {
        heading: 'Pilot protocol (one weekend)',
        body: 'Pick one name you already like. Run ChatGPT. Run Perplexity. Convene Isolated on Agents61. Compare whether the bear survived. If the three outputs rhyme too closely, you learned the anchoring lesson. Do not size from any of them.',
      },
      {
        heading: 'Red flags on marketing pages',
        body: '“AI that tells you what to buy.” Live-trade implications from a persona name. 61 agents in a group chat. A composite score that hides dissent. Crypto pages with P/E columns. Demo accounts that silently unlock paid seats via a query string.',
      },
    ],
    faqs: [
      {
        question: 'What is the best free AI for stock research?',
        answer:
          'A chatbot plus a public tape is free and incomplete. Agents61 Observer is a silent funnel. Paid desks start at Analyst. Free fluency is not diligence.',
      },
      {
        question: 'Is Perplexity better than ChatGPT for stocks?',
        answer: 'Better citations. Still one synthesis. Use it to gather, then staff a desk.',
      },
      {
        question: 'Will this tell me the best stock to buy in 2026?',
        answer: 'No. That question is how people skip inversion.',
      },
    ],
  },
  {
    slug: 'how-to-red-team-nvda',
    title: 'How to red-team NVDA without a sell button',
    date: 'September 5, 2026',
    excerpt:
      'A worked inversion on a crowded name: earnings quality, cycle, concentration, and what would kill the leftover belief. Research simulation — not a call.',
    tags: ['red team NVDA', 'invert an investment thesis', 'NVIDIA stock research', 'AI stock analysis'],
    category: 'method',
    readingMinutes: 12,
    keyTakeaway:
      'The leftover belief is the work. Staff debate seats. Write kill-conditions. Do not average the bear into “cautiously optimistic.” This is not a sell recommendation.',
    relatedSlugs: ['red-team-stock-idea', 'how-to-research-a-stock', 'buffett-wood-same-ticker'],
    body: [
      'NVDA is the example because everyone already has a bull paragraph. That is the danger. A red team is not balance for the article. It is a different look-at list. Agents61 will not tell you to sell NVIDIA. It will staff seats that try to kill the idea.',
    ],
    sections: [
      {
        heading: 'State the leftover belief in one sentence',
        body: 'If it takes a paragraph, you do not have a belief. You have a mood. Example shape: “Inference demand keeps incremental capex in the money longer than the Street’s fade.” If you cannot write yours, stop. You are not ready to invert.',
      },
      {
        heading: 'Pull the tape elsewhere',
        body: 'Price, multiples, filings links — Yahoo, Koyfin, your broker. Agents61 is not the quote plant. A red team without numbers is a vibe.',
      },
      {
        heading: 'Staff the debate layer',
        body: 'Einhorn-shaped earnings quality. Burry-shaped hidden assumptions. Munger-shaped inversion. Cycle seats on the capex wave. Concentration and customer power. Isolated mode so the bull seat cannot edit the bear seat.',
      },
      {
        heading: 'What “kill” looks like on a crowded winner',
        body: 'Customer capex pauses. Incremental tokens do not need this silicon. Gross margin mean-reverts harder than the model. Export and policy residual. Valuation that only works if duration is infinite. Write them as conditions, not as a headline.',
      },
      {
        heading: 'Read the clerk stack',
        body: 'Agreements first. Splits second. Eloquence last. If quality and growth seats split, that is information. A blended “still a winner but rich” is how inversion dies.',
      },
      {
        heading: 'What you do not do next',
        body: 'You do not press a sell button because a simulated persona was loud. You do not size because a simulated Buffett was calm. You own the residual. Research simulation, not advice.',
      },
    ],
    faqs: [
      {
        question: 'Is this a bearish NVIDIA call?',
        answer: 'No. It is a method note on how to invert a crowded name. No buy or sell ticket.',
      },
      {
        question: 'Can I run this on other megacaps?',
        answer: 'Yes. The sequence is the same. The leftover belief changes.',
      },
    ],
  },
  {
    slug: 'etf-research-without-a-rating',
    title: 'ETF research without a star rating',
    date: 'September 5, 2026',
    excerpt:
      'QQQ, sector funds, and thematic wrappers need holdings, cycle, and inversion — not five stars. A committee can write. It will not rate the wrapper.',
    tags: ['ETF research', 'QQQ analysis', 'Morningstar alternative', 'index fund due diligence'],
    category: 'markets',
    readingMinutes: 10,
    keyTakeaway:
      'An ETF is a wrapper. Research the holdings, the fee, the cycle, and what the theme assumes. Refuse a star that hides the top weights.',
    relatedSlugs: ['how-to-research-a-stock', 'koyfin-vs-committee-research'],
    body: [
      'Morningstar stars and “best ETF” listicles are a different business. Agents61 will convene on QQQ or a sector fund the way it convenes on a name: isolated methods, clerk stack, no composite score.',
    ],
    sections: [
      {
        heading: 'What an ETF committee can ask',
        body: 'What are the real top weights? Is this a market bet or a factor bet wearing a story? Where are we in the cycle for those weights? What would make the wrapper a worse vehicle than the basket?',
      },
      {
        heading: 'What it must not do',
        body: 'Print five stars. Pretend a thematic ticker is a business. Ignore concentration because the expense ratio is low. Treat QQQ like a single stock with a cute P/E.',
      },
      {
        heading: 'Passive investors are not the audience',
        body: 'If you only need an annual checkup on a broad index, you do not need this desk. The product is for people who already research and want structured disagreement on a wrapper they are about to treat like a view.',
      },
      {
        heading: 'A short path',
        body: 'Open the holdings. Convene Isolated. Read whether value and growth seats are even talking about the same object. Write one kill-condition for the theme. Keep your tape elsewhere.',
      },
    ],
    faqs: [
      {
        question: 'Do you rate ETFs?',
        answer: 'No. Splits stay splits. Stars are someone else’s product.',
      },
    ],
  },
  {
    slug: 'pre-ipo-research-simulation',
    title: 'Pre-IPO research is a simulation — treat it like one',
    date: 'September 5, 2026',
    excerpt:
      'Private boards have fewer filings and more narrative. Isolated seats should stay inconclusive when facts are missing. Not a 13F. Not a allocation ticket.',
    tags: ['pre-IPO research', 'private company due diligence', 'SpaceX research', 'secondary markets'],
    category: 'markets',
    readingMinutes: 11,
    keyTakeaway:
      'A private name is not a late 10-K. Missing numbers should stay missing. Agents61 will not invent a multiple or imply a live allocation.',
    relatedSlugs: ['how-personas-are-built', 'how-to-research-a-stock'],
    body: [
      'Pre-IPO pages attract two audiences: people who want a story, and people who want a method. The second group still has to live with thin filings. The honest product move is inconclusive seats, not a fake DCF.',
    ],
    sections: [
      {
        heading: 'What the private board is',
        body: 'A research surface for names that are not a clean US listing. The same 61 methods. The same isolation rule. A louder disclaimer because the file is thinner.',
      },
      {
        heading: 'What it is not',
        body: 'Not a secondary marketplace. Not a claim that a master owns the name. Not a 13F. Not a “you should get in before the IPO” funnel. If a page sounds like an allocation, it failed.',
      },
      {
        heading: 'How seats should behave',
        body: 'Value seats stay skeptical when owner earnings are a rumor. Growth seats classify duration versus narrative. Debate seats attack governance and information asymmetry. The clerk is allowed to say the file is too thin.',
      },
      {
        heading: 'SpaceX and the rest',
        body: 'A famous private name does not change the method. It raises the narrative temperature. That is when isolation matters more, not less. Do not let a theme seat rewrite a capital-structure seat.',
      },
    ],
    faqs: [
      {
        question: 'Can I invest through Agents61?',
        answer: 'No. Research simulation only. No buy button. No order routing.',
      },
      {
        question: 'Do you use real fund holdings?',
        answer: 'No. Method cards from public text. Check 13Fs elsewhere if you want filings.',
      },
    ],
  },
  {
    slug: 'on-chain-due-diligence-desk',
    title: 'On-chain due diligence: a desk that will not invent a P/E',
    date: 'September 5, 2026',
    excerpt:
      'BTC, ETH, SOL, and the rest of the board need issuance, usage, and policy — not equity ratios. How to run the crypto committee without a coin rating.',
    tags: ['on-chain due diligence', 'Bitcoin research', 'crypto investment committee', 'Ethereum research'],
    category: 'markets',
    readingMinutes: 12,
    keyTakeaway:
      'Use the crypto board. Ask in the right units. Allow inconclusive. Never paste a stock template onto a bearer settlement asset.',
    relatedSlugs: ['crypto-research-not-pe', 'best-ai-for-stock-research-2026'],
    body: [
      'On-chain research fails in two directions: treating every token like a cash-flow stock, or treating every token like a vibe. The desk is built to refuse the first and to make the second expensive.',
    ],
    sections: [
      {
        heading: 'Open the right board',
        body: 'Do not hack BTC into the US equity convene and hope the seats notice. The crypto universe exists so value seats are not forced to invent owner earnings. Start at /research/crypto or /crypto/btc.',
      },
      {
        heading: 'Ask in the right units',
        body: 'Settlement and security budget for BTC. Fees, issuance, and L2 leakage for ETH. Usage and client diversity for SOL. Issuer and policy residual for exchange-adjacent tokens. A P/E column is a product bug.',
      },
      {
        heading: 'How the 61 behave',
        body: 'Value seats stay cautious or skeptical on non-cash-flow maps. Trend seats classify usage versus narrative. Cycle seats overlay risk-asset beta. Debate seats attack leverage in the wrappers, not a fake multiple. The clerk does not emit a coin rating.',
      },
      {
        heading: 'What “due diligence” still means',
        body: 'Read the explorer and the policy file yourself. The desk is homework. It is not a signal service. It is not a substitute for understanding custody, listings, and what you actually hold.',
      },
      {
        heading: 'A one-hour path',
        body: 'Pick one asset. Write the leftover belief. Convene Isolated. Read splits. Write one kill-condition that is not “price goes down.” If you cannot, you have a mood.',
      },
    ],
    faqs: [
      {
        question: 'Do you recommend coins?',
        answer: 'No. No buy button. No signal.',
      },
      {
        question: 'Why not use the equity seats on BTC?',
        answer: 'You can. The honest path is the crypto board so the file matches the asset.',
      },
    ],
  },
];
