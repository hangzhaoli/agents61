import type { BlogPost } from '@/lib/blog';

type Overlay = Pick<
  BlogPost,
  | 'category'
  | 'keyTakeaway'
  | 'sections'
  | 'faqs'
  | 'relatedSlugs'
  | 'readingMinutes'
  | 'visuals'
  | 'tables'
>;

const OVERLAYS: Record<string, Overlay> = {
  'isolated-vs-division-of-labor': {
    category: 'method',
    readingMinutes: 9,
    keyTakeaway:
      'Isolated seats cannot see each other. Division of labor is a pipeline handoff, not a 61-person chat. Pick one method before you convene. Neither mode emits a buy ticket.',
    relatedSlugs: ['independent-then-assembled', 'ai-agents-for-investing', 'seating-3-16-61'],
    sections: [
      {
        heading: 'Why isolation is the default',
        body: 'A buy-side committee does not let the growth partner edit the value partner mid-sentence. Isolated mode copies that constraint: every unlocked seat sees the ticker and its own rules. Nobody reads a peer. The clerk stacks after the writing exists. Fake consensus is expensive because it looks like work.',
      },
      {
        heading: 'What division of labor actually hands off',
        body: 'Trend research can pass a map to cycle research. Cycle can pass a regime note to selection. Selection can pass a pool to the red team. Later groups may reference earlier notes. Peers in the same group still cannot see each other. If you wanted a group chat, you already have ChatGPT.',
      },
      {
        heading: 'When to flip the toggle',
        body: 'Use Isolated for a single name you already care about. Use Division of labor when the question is a sequence: where capital may flow, where we are in the cycle, then which names survive. Do not flip mid-run to chase a prettier paragraph.',
      },
      {
        heading: 'Compute and empty seats',
        body: 'You pay for 16, 29, 48, or 61 isolated prompts plus one clerk pass. Empty seats stay empty. 61-squared debate is how you burn tokens and still get one voice.',
      },
    ],
    faqs: [
      {
        question: 'Is Isolated “better” than Division of labor?',
        answer:
          'Different jobs. Isolated is the honest committee. Division of labor is a pipeline. The product is that you choose before the run.',
      },
      {
        question: 'Can later seats change earlier notes?',
        answer: 'No. Handoff is read-only context. Peers still write alone.',
      },
    ],
  },
  'vs-yahoo-seeking-alpha-chatgpt': {
    category: 'compare',
    readingMinutes: 10,
    keyTakeaway:
      'Yahoo is a tape. Seeking Alpha is a byline plus a rating. ChatGPT is one fluent memo. Agents61 is a committee simulation. Keep the first three. Staff the fourth when you need disagreement on the record.',
    relatedSlugs: [
      'chatgpt-stock-analysis-limits',
      'seeking-alpha-alternative-committee',
      'best-ai-for-stock-research-2026',
    ],
    sections: [
      {
        heading: 'Data sites win at data',
        body: 'Yahoo Finance, TradingView, Koyfin, and Bloomberg-class terminals are excellent at prices, charts, and a path to filings. They will not invert MSFT or keep a red team alive after a bull paragraph. Agents61 does not try to replace the tape.',
      },
      {
        heading: 'Article mills win at a human voice',
        body: 'Seeking Alpha and similar pages sell opinion at a subscription. Quality varies. You still get one narrative at a time, often with a rating that behaves like a buy button even when the lawyers say it is not. A committee that refuses a composite score is a different product.',
      },
      {
        heading: 'Chatbots win at speed',
        body: 'ChatGPT, Claude, and Perplexity will write a fluent AAPL memo in seconds. The failure mode is anchoring: the first confident paragraph becomes the room. Multi-agent theater that lets every “master” see the same draft is the same bug with more names.',
      },
      {
        heading: 'The stack that actually works',
        body: 'Pull quotes where you already pull them. Skim a human article if you want a byline. Use a chatbot for a first pass. Convene Agents61 when the leftover belief needs inversion. Read the clerk stack. Do not treat the PDF as an order.',
      },
    ],
    faqs: [
      {
        question: 'Is Agents61 a Seeking Alpha alternative?',
        answer: 'For structured disagreement, yes. For a daily article feed, no. Keep SA if you read bylines.',
      },
      {
        question: 'Does it replace Yahoo or Bloomberg?',
        answer: 'No. Those are terminals. This is a writing desk.',
      },
    ],
  },
  'how-to-research-a-stock': {
    category: 'method',
    readingMinutes: 11,
    keyTakeaway:
      'The useful sequence is flow, cycle, classification, inversion, timing, exit. AI can staff the seats. It cannot take the risk. There is no buy button at the end of a serious checklist.',
    relatedSlugs: [
      'how-to-use-agents61-to-make-money',
      'red-team-stock-idea',
      'how-to-red-team-nvda',
      'etf-research-without-a-rating',
    ],
    visuals: [
      {
        title: 'Six gates on one US name',
        intro:
          'This is the stock file. Coins do not enter it. Stop at the first fail. The desk will not print a buy ticket after gate 6.',
        gates: [
          {
            n: '1',
            question: 'Where might capital flow?',
            pass: 'You can name the neighborhood from Discover or a lineup, then take one ticker out of it.',
            fail: 'You are shopping a screener list. A theme you cannot explain for a dull year is not a position.',
          },
          {
            n: '2',
            question: 'Where is the cycle?',
            pass: 'You know whether you are paying a late multiple or a washed-out one. Cycle seats overlay this. They do not size you.',
            fail: 'You add because the memo was fluent this morning. Timing is a condition, not “now”.',
          },
          {
            n: '3',
            question: 'Is it a business?',
            pass: 'Revenue, ROE, leverage, or owner earnings are on the page. A serious seat may stay inconclusive if they are missing.',
            fail: 'You invent a multiple. An inconclusive seat is a stop, not a prompt to ask the model again until it agrees.',
          },
          {
            n: '4',
            question: 'What kills it?',
            pass: 'One sentence: the fact that forces a sale. Earnings quality, hidden leverage, a related party, a consensus with nothing left.',
            fail: 'You only have the bull paragraph. That is the expensive draft. Do not open the broker.',
          },
          {
            n: '5',
            question: 'Which paper book matches the account?',
            pass: 'Long-only cash uses Shares. Read drawdown before return. On 26 September 2026 the AAPL shares book was +68.39% with a −13.77% hole from 2022-09-30. The contract book on the same bars was +1.09% with profit factor 1.01.',
            fail: 'You pick the prettier ending. The contract row shows a long-short rule that barely paid for its hole. The shares row is only real if you can fund −13.77% on your account.',
          },
          {
            n: '6',
            question: 'Is the exit written before the entry?',
            pass: 'The kill from gate 4 is an order you could enter the same day as the shares, at a size that cannot change rent.',
            fail: 'Any missing line. Agents61 does not send the order. Missing means the capital stays put.',
          },
        ],
      },
    ],
    tables: [
      {
        caption: 'What each gate is allowed to change',
        columns: ['Gate', 'Desk surface', 'Pass looks like', 'Effect on capital'],
        rows: [
          ['Flow', 'Discover, lineup', 'One neighborhood, one ticker', 'You stop buying random names'],
          ['Cycle', 'Cycle seats', 'A regime, not a slogan', 'You do not size up just because the paragraph is new'],
          ['Classify', 'Selection seats', 'Filings, or an honest blank', 'You do not pay a story multiple for a missing number'],
          ['Invert', 'Red team', 'A written kill', 'This is the step that saves money'],
          ['Rehearse', 'US quant, Shares first', 'Hole in dollars, then return', 'You refuse a curve you would have abandoned'],
          ['Execute', 'Your broker', 'Size and exit the same day', 'The only place P&L can appear'],
        ],
        footnote:
          'Paper figures in gate 5 were read from the public US book on 26 September 2026, virtual $10,000, Sina daily bars. They are a drill, not a track record. Full tape and the wheel comparison sit in the desk tutorial.',
      },
    ],
    sections: [
      {
        heading: 'Start with the wrong question’s opposite',
        body: '“What stocks should I buy?” is a shopping prompt. The useful sequence is: where capital may flow this decade, where we are in the cycle, whether this name is a business or a story, whether the thesis survives a red team, when you would scale in, and when you would be forced to sell.',
      },
      {
        heading: 'Filings before vibes',
        body: 'Fundamental analysis still starts with revenue, ROE, leverage, owner earnings — not a vibes model. If numbers are missing, a serious seat stays inconclusive. Inventing a P/E is not equity research. That rule is why the crypto board refuses stock templates on BTC.',
      },
      {
        heading: 'Invert before you size',
        body: 'Write what would kill the idea. Earnings quality, hidden leverage, related-party structure, consensus with no residual, tails the model assumes away. A stock screener can rank. It cannot interrogate.',
      },
      {
        heading: 'What Agents61 maps onto the checklist',
        body: 'Trend and cycle seats cover the map. Selection seats classify. Debate seats invert. Timing and Kelly seats talk about pace, not permission. The clerk stacks. You still own the capital.',
      },
    ],
    faqs: [
      {
        question: 'How long should a first pass take?',
        answer:
          'Twenty minutes is enough to know if the name is worth a full desk run. See the Learn guide. A full isolated run is homework, not a trade.',
      },
      {
        question: 'Will the desk tell me to buy?',
        answer: 'No. Isolated briefs never say you should buy.',
      },
    ],
  },
  'buffett-wood-same-ticker': {
    category: 'method',
    readingMinutes: 8,
    keyTakeaway:
      'Quality investing and disruptive-innovation research are different tests. Averaging Buffett and Wood into one rating is how you get a fake committee. The split is the product.',
    relatedSlugs: ['isolated-vs-division-of-labor', 'how-personas-are-built', 'independent-then-assembled'],
    sections: [
      {
        heading: 'Two jobs, one URL',
        body: 'Search demand is real: “how would Buffett analyze this stock” and “Cathie Wood AI stocks” land on the same ticker more often than they should. Graham and Buffett ask whether it is a business you would own in the dark. Wood asks whether a disruption theme still has duration.',
      },
      {
        heading: 'Why one-pass LLMs collapse the split',
        body: 'If a model writes both voices in one pass, the second voice usually borrows the first. That is not multi-agent stock analysis. It is one memo in two fonts.',
      },
      {
        heading: 'How the desk keeps the split',
        body: 'On Agents61, Buffett and Wood are separate seats. Isolated mode: they never see each other. Division of labor: Wood may sit in trend while Buffett sits in selection, and selection can read a trend map without merging into a blended score. The clerk is allowed to say they split.',
      },
      {
        heading: 'Affiliation',
        body: 'Simulated personas are unaffiliated with the people. The rules come from public letters and books. A brief is a method test, not a claim that anyone bought the name.',
      },
    ],
    faqs: [
      {
        question: 'Does a Buffett seat mean Berkshire owns it?',
        answer: 'No. It means a method card ran. Check 13Fs elsewhere if you want filings.',
      },
    ],
  },
  'red-team-stock-idea': {
    category: 'method',
    readingMinutes: 9,
    keyTakeaway:
      'A red team is not a bearish paragraph for balance. It is a different look-at list. The clerk does not make the bull and the bear meet in the middle.',
    relatedSlugs: ['how-to-red-team-nvda', 'how-to-research-a-stock', 'independent-then-assembled'],
    sections: [
      {
        heading: 'The bull case is not the work',
        body: 'Retail stock research usually writes the bull case first because it feels like work. Professional committees often pay people to destroy the idea. If the thesis still stands, you own it with open eyes. If it dies, you saved the capital.',
      },
      {
        heading: 'What a real inversion looks at',
        body: 'Accruals, hidden leverage, related-party structure, consensus that has no residual, tails the model assumes away. “Add a cautious note” is not inversion. It is decoration.',
      },
      {
        heading: 'Seating on this desk',
        body: 'Analyst already includes Einhorn, Burry, and Munger in the working 16. Associate and above light more short-side and cycle seats. They write isolated kill-shots. The clerk does not average them into “cautiously optimistic.”',
      },
    ],
    faqs: [
      {
        question: 'Will the desk tell me to sell?',
        answer: 'No. It will write kill-conditions. You still decide.',
      },
    ],
  },
  'crypto-research-not-pe': {
    category: 'markets',
    readingMinutes: 9,
    keyTakeaway:
      'Forcing cash-flow multiples onto BTC, ETH, or SOL is how equity tools fail crypto. Settlement, usage, and policy are the file. No fake P/E. No coin rating.',
    relatedSlugs: [
      'how-to-use-agents61-to-make-money',
      'on-chain-due-diligence-desk',
      'ai-agents-for-investing',
    ],
    visuals: [
      {
        title: 'Three gates before a coin is allowed near capital',
        intro:
          'A coin that fails gate 1 does not get a stock memo with the nouns swapped. The paper perpetual is a trend rehearsal, not a reason to open a live liquidation engine.',
        gates: [
          {
            n: '1',
            question: 'Does it have cash flow?',
            pass: 'A token with a business underneath can meet an owner-earnings test. Say so, and use the stock file.',
            fail: 'BTC, and most L1s, do not. Inventing a P/E is the stop. Value seats are allowed to stay skeptical. Do not average them into a coin rating.',
          },
          {
            n: '2',
            question: 'Are you asking about usage or about price?',
            pass: 'Usage, issuance, security budget, and policy go to the committee. Price path goes to the blockchain paper perpetual, labeled as such.',
            fail: 'You blend a skeptical value note and a trend trade into one score, then size from the average.',
          },
          {
            n: '3',
            question: 'Can you fund the paper hole without a liquidation fantasy?',
            pass: 'On 26 September 2026, BTC contract was +5.95% with a −6.76% hole (about +$595 versus a $676 hole on the virtual $10,000). ETH was +6.94% with a −5.27% hole and profit factor 1.89. You can name those dollars on your real account and still walk away.',
            fail: 'You open a live perp because the paper tape was green. The paper book has fees and a research funding estimate. It cannot liquidate you. A live venue can.',
          },
        ],
      },
    ],
    tables: [
      {
        caption: 'Stock file versus chain file',
        columns: ['Question', 'US share', 'BTC / ETH perpetual'],
        rows: [
          ['Value test', 'Revenue, ROE, owner earnings', 'Usually refuse. No earnings to multiply.'],
          ['What you read', 'Filings', 'Issuance, security budget, usage, listings, policy'],
          ['Paper book', 'Shares, then Contract or Wheel if the account matches', 'Perpetual on /research/crypto only'],
          ['Window in this drill', '2022-09-30 → 2026-09-25', '2024-01-01 → 2026-09-26'],
          ['BTC on that window', '—', '+5.95% return, −6.76% hole, 25 closes, win 44%, profit factor 1.53'],
          ['ETH on that window', '—', '+6.94% return, −5.27% hole, 23 closes, win 52%, profit factor 1.89'],
          ['Where money moves', 'Your stock broker, after the kill is written', 'Not on this site. Not from the paper result.'],
        ],
        footnote:
          'Crypto rows are the public paper perpetual on Binance daily candles, virtual $10,000, read 26 September 2026. Funding is a clipped research estimate, not the exchange’s funding print. Re-open the book before you treat a cell as current.',
      },
    ],
    sections: [
      {
        heading: 'The stock template leak',
        body: 'Traditional finance websites treat every asset like a stock: price, market cap, a ratio, a rating. That habit leaks into crypto pages that invent earnings for a bearer settlement asset.',
      },
      {
        heading: 'What on-chain due diligence actually asks',
        body: 'Issuance, security budget, L1 usage, listings, and policy. ETH and SOL have different questions than BTC. Tokens with a business underneath can meet a cash-flow test. Most do not.',
      },
      {
        heading: 'How seats behave on the crypto board',
        body: 'Value seats usually stay cautious or skeptical on non-cash-flow maps. Trend and growth seats classify usage versus narrative. Cycle seats overlay risk-asset beta. The clerk does not average that into a coin rating.',
      },
    ],
    faqs: [
      {
        question: 'Can I run BTC like AAPL?',
        answer: 'You can type the ticker. The product is built to refuse a fake multiple. Use the crypto board.',
      },
    ],
  },
  'ai-agents-for-investing': {
    category: 'desk',
    readingMinutes: 10,
    keyTakeaway:
      'Agentic stock analysis only works if agents cannot see each other until a clerk pass — and if empty seats stay empty. A router that agrees with you is a parlor trick.',
    relatedSlugs: ['best-ai-for-stock-research-2026', 'isolated-vs-division-of-labor', 'seating-3-16-61'],
    sections: [
      {
        heading: 'The crowded search',
        body: '“AI agent investing” is a demo category. Most products are a router that calls tools and writes a confident memo. That can fetch a 10-K. It cannot stop the model from agreeing with you.',
      },
      {
        heading: 'What a useful multi-agent system looks like',
        body: 'Named jobs. Isolation or strict handoff. A red team. A quant overlay that refuses stories without significance. A human who still owns the PnL. That is an investment committee, not a copilot skin.',
      },
      {
        heading: 'Compute that does not lie',
        body: 'Compute should scale with isolated prompts (16, 29, 48, 61) plus one assembly, not with everyone talking to everyone. 61-squared debate is how you burn money and still get one paragraph.',
      },
    ],
    faqs: [
      {
        question: 'Is this an adviser?',
        answer: 'No. It is a research simulation. It is not a replacement for a CFA or a fiduciary.',
      },
    ],
  },
  'independent-then-assembled': {
    category: 'method',
    readingMinutes: 8,
    keyTakeaway:
      'A 61-person group chat contaminates judgment and burns tokens. Isolated briefs plus one clerk pass are cheaper and harder to fake-consensus.',
    relatedSlugs: ['isolated-vs-division-of-labor', 'seating-3-16-61'],
    sections: [
      {
        heading: 'The roundtable bug',
        body: 'Most “AI investment committees” are a roundtable: one prompt, many names, everyone sees the same draft. That is how anchoring works. The first fluent paragraph becomes the room.',
      },
      {
        heading: 'What the clerk is allowed to do',
        body: 'Stack agreements and splits. Not average the room into a buy rating. If quality seats and red-team seats disagree, the split stays on the page.',
      },
    ],
    faqs: [
      {
        question: 'Does seating change the method?',
        answer: 'No. Analyst through Partners use the same isolation rule. You only change how many seats run.',
      },
    ],
  },
  'seating-3-16-61': {
    category: 'desk',
    readingMinutes: 7,
    keyTakeaway:
      'Seating is the product. Empty seats stay empty. Analyst is 16. Associate is 29. Principal is 48. Committee and Partners are 61. Partners is volume, not extra names.',
    relatedSlugs: ['ai-agents-for-investing', 'how-personas-are-built'],
    sections: [
      {
        heading: 'The working 16',
        body: 'Analyst includes Wood, Laffont, Dalio, Marks, Templeton, Graham, Buffett, Lynch, Duan, Klarman, Greenblatt, Einhorn, Burry, Munger, O’Neil, Thorp. That covers era, cycle, dual-track selection, a real red team, a timing seat, and Kelly sizing.',
      },
      {
        heading: 'What you do not get at $49',
        body: 'Associate adds 13 seats — 29 total, not 61. Principal is 48. Committee ($149) and Partners ($349) unlock the remaining seats. Partners is the same 61 with more reports and priority routing.',
      },
      {
        heading: 'Founding Committee',
        body: 'A Committee-priced annual lock for early subscribers. You pay for seats that actually write.',
      },
    ],
    faqs: [
      {
        question: 'Does Observer write?',
        answer: 'No. Observer is a silent funnel. Paid desks start at Analyst.',
      },
    ],
  },
  'how-personas-are-built': {
    category: 'desk',
    readingMinutes: 7,
    keyTakeaway:
      'Hard rules from published work. Wikipedia is a seed. Quote graphics and tip groups never enter the model. Personas are unaffiliated simulations.',
    relatedSlugs: ['buffett-wood-same-ticker', 'seating-3-16-61'],
    sections: [
      {
        heading: 'The source order',
        body: 'Books, shareholder letters, public talks, then a Wikipedia extract as a cold-start seed. Second-hand social threads, tip groups, and unverified quote images do not go in. Those become hallucinated personas.',
      },
      {
        heading: 'What a seat sees',
        body: 'On a report, the persona only sees filings and its own card. It cannot borrow another master’s conclusion. If SEC facts are missing, the seat stays inconclusive rather than inventing numbers.',
      },
    ],
    faqs: [
      {
        question: 'Are you affiliated with the named people?',
        answer: 'No. Simulated personas. Rules from public text. That is the whole claim.',
      },
    ],
  },
};

export function enrichCorePost(post: BlogPost): BlogPost {
  const overlay = OVERLAYS[post.slug];
  if (!overlay) return post;
  return { ...post, ...overlay };
}
