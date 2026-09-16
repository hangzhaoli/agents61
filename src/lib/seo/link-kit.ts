/** Press + directory submission pack. Prefer brand / naked URL anchors. */

export const LINK_KIT = {
  name: 'Agents61',
  url: 'https://agents61.com',
  homepage: 'https://agents61.com/',
  email: 'research@agents61.com',
  pressEmail: 'research@agents61.com',
  github: 'https://github.com/hangzhaoli/agents61',
  logoMark: 'https://agents61.com/brand/mark-61.png',
  logoWordmark: 'https://agents61.com/brand/logo-61.png',
  ogImage: 'https://agents61.com/opengraph-image',
  tagline: '61-master AI investment committee. Isolated briefs. No buy button.',
  oneLiner:
    'Agents61 is a 61-seat AI investment research committee: named master agents write isolated briefs, a clerk stacks splits — research simulation, not advice.',
  short:
    'Agents61 staffs 61 named investment-master seats. Unlocked agents write isolated stock-research briefs (or a pipeline handoff). A clerk stacks agreements and splits. Not a quote terminal, not ChatGPT, not a buy button.',
  long: `Agents61 is software that simulates an investment committee for intermediate US investors.

Sixty-one historical methodologies (Graham, Buffett, Wood, Dalio, Lynch, Burry, and others) run as separate master-agent seats. Isolated is the default: seats cannot see each other. Division of labor is a pipeline handoff, not a 61-person chat. A clerk then stacks agreements and splits. Locked seats stay empty.

It is a research simulation — not investment advice, not a Bloomberg/Koyfin terminal, not a Seeking Alpha article mill, and not a chatbot that agrees with you. There is no order routing and no “you should buy.”

Markets: US stocks and ETFs first, plus on-chain and US-listed emerging-market ADRs. Crypto research does not invent a P/E.

Pricing: Observer is silent and free. Analyst is 16 seats at $19/month. Associate 29 / $49. Principal 48 / $79. Committee 61 / $149. Partners is the same 61 with more volume at $349. Cards via Waffo. Crypto via NOWPayments.`,
  pricingModel: 'Freemium',
  priceNote: 'Observer free (silent). Analyst $19/mo (16 seats). Up to Partners $349/mo.',
  platforms: ['Web'],
  languages: ['English'],
  categories: [
    'Investment research',
    'AI stock analysis',
    'Fintech',
    'Equity research',
    'AI agents',
  ],
  tags: [
    'AI investment committee',
    'stock research',
    'multi-agent',
    'fundamental analysis',
    'not investment advice',
  ],
  competitors: [
    { name: 'ChatGPT', url: 'https://chatgpt.com', altTo: 'https://agents61.com/compare/chatgpt' },
    { name: 'Seeking Alpha', url: 'https://seekingalpha.com', altTo: 'https://agents61.com/compare/seeking-alpha' },
    { name: 'Yahoo Finance', url: 'https://finance.yahoo.com', altTo: 'https://agents61.com/compare/yahoo-finance' },
    { name: 'Koyfin', url: 'https://www.koyfin.com', altTo: 'https://agents61.com/compare/koyfin' },
    { name: 'Perplexity', url: 'https://www.perplexity.ai', altTo: 'https://agents61.com/compare/perplexity' },
    { name: 'TipRanks', url: 'https://www.tipranks.com', altTo: 'https://agents61.com/compare/tipranks' },
    { name: 'GuruFocus', url: 'https://www.gurufocus.com', altTo: 'https://agents61.com/compare/gurufocus' },
    { name: 'DeepTicker', url: 'https://www.deepticker.com', altTo: 'https://agents61.com/compare/deepticker' },
    { name: 'Morningstar', url: 'https://www.morningstar.com', altTo: 'https://agents61.com/compare/morningstar' },
    { name: 'Polymarket', url: 'https://polymarket.com', altTo: 'https://agents61.com/compare/polymarket' },
  ],
  preferredAnchors: [
    { text: 'Agents61', href: 'https://agents61.com/' },
    { text: 'agents61.com', href: 'https://agents61.com/' },
    { text: 'AI investment committee', href: 'https://agents61.com/ai-investment-committee' },
    { text: 'Seeking Alpha alternative (committee)', href: 'https://agents61.com/compare/seeking-alpha' },
    { text: 'Agents61 vs ChatGPT', href: 'https://agents61.com/compare/chatgpt' },
    { text: 'DeepTicker vs GuruFocus (committee framing)', href: 'https://agents61.com/compare/deepticker' },
    { text: '61 Masters', href: 'https://agents61.com/masters' },
    { text: 'For LLMs', href: 'https://agents61.com/for-llms' },
  ],
  neverSay: [
    'you should buy',
    'best stock picker',
    'Bloomberg killer',
    'guaranteed returns',
    'affiliated with Buffett / Wood / any named master',
  ],
} as const;

export type DirectoryCost = 'free' | 'paid' | 'already';

export type DirectoryPack = {
  slug: string;
  name: string;
  cost: DirectoryCost;
  submitUrl: string;
  why: string;
  fields: Record<string, string>;
};

export const DIRECTORY_PACKS: DirectoryPack[] = [
  {
    slug: 'github',
    name: 'GitHub product brief',
    cost: 'already',
    submitUrl: 'https://github.com/hangzhaoli/agents61',
    why: 'Already live. Keep the homepage URL in the README. Do not delete.',
    fields: {
      Homepage: LINK_KIT.url,
      Description: LINK_KIT.oneLiner,
    },
  },
  {
    slug: 'alternativeto',
    name: 'AlternativeTo',
    cost: 'free',
    submitUrl: 'https://alternativeto.net/manage-item/',
    why: 'DR-class compare directory. Hang under Seeking Alpha, ChatGPT, Koyfin — not as a Bloomberg clone.',
    fields: {
      Name: LINK_KIT.name,
      URL: LINK_KIT.url,
      'Short description': LINK_KIT.short,
      'Full description': LINK_KIT.long,
      Platforms: 'Online / Web',
      Pricing: 'Freemium — Observer free; paid desks from $19/month',
      Tags: 'finance, investing, ai, research, stocks',
      'Alternative to': 'ChatGPT, Seeking Alpha, Yahoo Finance, Koyfin, Perplexity, TipRanks',
      License: 'Proprietary',
    },
  },
  {
    slug: 'producthunt',
    name: 'Product Hunt',
    cost: 'free',
    submitUrl: 'https://www.producthunt.com/posts/new',
    why: 'Launch listing + referral traffic. Needs a maker account. Ship on a weekday morning PT.',
    fields: {
      Name: LINK_KIT.name,
      Tagline: '61-master AI investment committee — isolated briefs, no buy button',
      Description: `${LINK_KIT.oneLiner}\n\nWho it is for: intermediate US investors who already research names.\nWho it is not for: beginners who want a ticker tip, or anyone who needs a Bloomberg terminal.\n\n${LINK_KIT.short}\n\nFirst link: https://agents61.com/\nHow it works: https://agents61.com/how-it-works\nCompare: https://agents61.com/compare`,
      Topics: 'Fintech, Artificial Intelligence, Investing, Productivity',
      'First comment':
        'Maker here. Agents61 is a research simulation, not advice — 61 named seats write alone, a clerk stacks splits, empty seats stay empty. Happy to walk through Isolated vs Division of labor if useful.',
    },
  },
  {
    slug: 'indiehackers',
    name: 'Indie Hackers',
    cost: 'free',
    submitUrl: 'https://www.indiehackers.com/products/new',
    why: 'Founder-index page. Brand anchor only.',
    fields: {
      Name: LINK_KIT.name,
      Website: LINK_KIT.url,
      Tagline: LINK_KIT.tagline,
      Description: LINK_KIT.long,
    },
  },
  {
    slug: 'saashub',
    name: 'SaaSHub',
    cost: 'free',
    submitUrl: 'https://www.saashub.com/services/submit',
    why: 'Free queue if you list competitors. Verify with research@agents61.com if asked.',
    fields: {
      Name: LINK_KIT.name,
      URL: LINK_KIT.url,
      Description: LINK_KIT.short,
      Categories: 'Finance, Artificial Intelligence, Analytics',
      Competitors: 'ChatGPT, Seeking Alpha, Koyfin, Perplexity, TipRanks, Morningstar',
    },
  },
  {
    slug: 'crunchbase',
    name: 'Crunchbase',
    cost: 'free',
    submitUrl: 'https://www.crunchbase.com/add-new',
    why: 'Entity page. Helps YMYL more than an AI-tool farm. Needs a CB account.',
    fields: {
      Name: LINK_KIT.name,
      Website: LINK_KIT.url,
      Description: LINK_KIT.oneLiner,
      Categories: 'FinTech, Artificial Intelligence, Financial Services',
      'Contact email': LINK_KIT.email,
    },
  },
  {
    slug: 'wellfound',
    name: 'Wellfound (AngelList)',
    cost: 'free',
    submitUrl: 'https://wellfound.com/recruit/new',
    why: 'Company page if you want a jobs/entity URL. Skip if you do not want recruiting noise.',
    fields: {
      Name: LINK_KIT.name,
      Website: LINK_KIT.url,
      Description: LINK_KIT.oneLiner,
    },
  },
  {
    slug: 'betalist',
    name: 'BetaList',
    cost: 'paid',
    submitUrl: 'https://betalist.com/submit',
    why: 'Paid only in 2026. Keep copy ready; do not pay unless you want a launch day.',
    fields: {
      Name: LINK_KIT.name,
      URL: LINK_KIT.url,
      Tagline: LINK_KIT.tagline,
      Description: LINK_KIT.short,
    },
  },
  {
    slug: 'taaft',
    name: "There's An AI For That",
    cost: 'paid',
    submitUrl: 'https://theresanaiforthat.com/launch/',
    why: 'One-off listing fee. Free only via their monthly X thread. Skip unless you want to pay.',
    fields: {
      URL: LINK_KIT.url,
      Name: LINK_KIT.name,
      Description: LINK_KIT.short,
      Tasks: 'stock research, investment analysis, due diligence, thesis inversion',
    },
  },
  {
    slug: 'futurepedia',
    name: 'Futurepedia',
    cost: 'paid',
    submitUrl: 'https://www.futurepedia.io/submit-tool',
    why: 'Paid listing. Copy ready; do not checkout from this pass.',
    fields: {
      Name: LINK_KIT.name,
      URL: LINK_KIT.url,
      Description: LINK_KIT.short,
      Category: 'Finance',
    },
  },
  {
    slug: 'toolify',
    name: 'Toolify',
    cost: 'paid',
    submitUrl: 'https://www.toolify.ai/submit',
    why: 'Paid (~$99). Skip this pass.',
    fields: {
      Name: LINK_KIT.name,
      URL: LINK_KIT.url,
      Description: LINK_KIT.short,
    },
  },
];
