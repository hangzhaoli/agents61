/**
 * Common investor jobs. Each kit staffs named digital identities
 * (unaffiliated simulations) and deep-links into an existing desk tool.
 */

export type WorkKit = {
  id: string;
  title: string;
  job: string;
  staff: string[];
  entry: 'lineup' | 'analyze' | 'discover' | 'quant' | 'watchlist' | 'clerk';
  href: string;
  extra?: 'filing_extract' | 'trigger_pack';
};

export const WORK_KITS: WorkKit[] = [
  {
    id: 'lynch-screen',
    title: 'Lynch daily-life screen',
    job: 'Filter US names the way a six-type growth seat would — story, category, PEG. Not a buy list.',
    staff: ['peter-lynch'],
    entry: 'lineup',
    href: '/dashboard?entry=lineup&market=us&masters=peter-lynch',
  },
  {
    id: 'graham-filter',
    title: 'Graham margin screen',
    job: 'Cheapness and balance-sheet first. Price is not a reason.',
    staff: ['benjamin-graham', 'walter-schloss'],
    entry: 'lineup',
    href: '/dashboard?entry=lineup&market=us&masters=benjamin-graham,walter-schloss',
  },
  {
    id: 'canslim',
    title: 'O’Neil CANSLIM tape',
    job: 'Stage and follow-through as a timing question. A breakout is a condition, not an order.',
    staff: ['william-oneil', 'mark-minervini'],
    entry: 'lineup',
    href: '/dashboard?entry=lineup&market=us&masters=william-oneil,mark-minervini',
  },
  {
    id: 'turtle-breakout',
    title: 'Turtle / Seykota trend',
    job: '20- and 55-day style breakout rules as a filter. Survival first.',
    staff: ['richard-dennis', 'ed-seykota'],
    entry: 'lineup',
    href: '/dashboard?entry=lineup&market=us&masters=richard-dennis,ed-seykota',
  },
  {
    id: 'cycle-pendulum',
    title: 'Dalio / Marks / Templeton regime',
    job: 'Where the cycle sits before any multiple debate. Phase reading only.',
    staff: ['ray-dalio', 'howard-marks', 'john-templeton'],
    entry: 'discover',
    href: '/dashboard?entry=discover',
  },
  {
    id: 'red-team',
    title: 'Red-team a leftover belief',
    job: 'Einhorn, Burry, Icahn write kill-conditions after isolation.',
    staff: ['david-einhorn', 'michael-burry', 'carl-icahn'],
    entry: 'analyze',
    href: '/dashboard?entry=analyze&q=Invert%20this%20leftover%20belief.%20Write%20kill-conditions%20only%20%E2%80%94%20not%20a%20ticket.',
  },
  {
    id: 'ten-year-hold',
    title: 'Buffett 10-year hold test',
    job: 'Ask whether owner earnings survive a unit cycle. Fame is not a hurdle.',
    staff: ['warren-buffett', 'charlie-munger'],
    entry: 'analyze',
    href: '/dashboard?entry=analyze&q=Research%20as%20a%20ten-year%20hold.%20Do%20owner%20earnings%20survive%20a%20unit%20cycle%3F',
  },
  {
    id: 'greenblatt-formula',
    title: 'Greenblatt magic-formula screen',
    job: 'Rank cheapness × return on capital. The list is homework, not a rotation.',
    staff: ['joel-greenblatt'],
    entry: 'lineup',
    href: '/dashboard?entry=lineup&market=us&masters=joel-greenblatt',
  },
  {
    id: 'klarman-special',
    title: 'Klarman special-sit filter',
    job: 'Price vs. liquidation value, then a catalyst. No catalyst is a finding.',
    staff: ['seth-klarman', 'benjamin-graham'],
    entry: 'lineup',
    href: '/dashboard?entry=lineup&market=us&masters=seth-klarman,benjamin-graham',
  },
  {
    id: 'fisher-scuttlebutt',
    title: 'Fisher scuttlebutt / quality',
    job: 'Fifteen points as questions: people, product, research. Gossip is not a multiple.',
    staff: ['philip-fisher', 'terry-smith'],
    entry: 'analyze',
    href: '/dashboard?entry=analyze&q=Quality%20compounder%20test%20%E2%80%94%20people%2C%20product%2C%20research.%20No%20target%20price.',
  },
  {
    id: 'druckenmiller-liquidity',
    title: 'Druckenmiller liquidity filter',
    job: 'Ask whether the tape is a liquidity event before a story. Phase, not a ticket.',
    staff: ['stanley-druckenmiller', 'paul-tudor-jones'],
    entry: 'discover',
    href: '/dashboard?entry=discover',
  },
  {
    id: 'activist-thesis',
    title: 'Ackman / Icahn activist thesis',
    job: 'What must change in capital allocation. A campaign is a condition set.',
    staff: ['bill-ackman', 'carl-icahn'],
    entry: 'analyze',
    href: '/dashboard?entry=analyze&q=What%20capital-allocation%20change%20would%20invalidate%20the%20thesis%3F%20No%20order.',
  },
  {
    id: 'bogle-check',
    title: 'Bogle accountability',
    job: 'If the book cannot beat the index in the argument, the kit says switch — not trade.',
    staff: ['john-bogle', 'ed-thorp'],
    entry: 'quant',
    href: '/dashboard?entry=quant',
  },
  {
    id: 'earnings-tray',
    title: 'Earnings / 10-K tray',
    job: 'Paste a filing. Extract facts and questions for unlocked seats. Token extra.',
    staff: [],
    entry: 'clerk',
    href: '/dashboard?entry=clerk&extra=filing_extract',
    extra: 'filing_extract',
  },
  {
    id: 'trigger-pack',
    title: 'Trigger / invalidation pack',
    job: 'What would change a seat’s mind — levels and conditions. Not a buy or sell ticket. Token extra.',
    staff: ['jesse-livermore', 'nicolas-darvas', 'william-oneil'],
    entry: 'clerk',
    href: '/dashboard?entry=clerk&extra=trigger_pack',
    extra: 'trigger_pack',
  },
  {
    id: 'watch-alerts',
    title: 'Watchlist alerts',
    job: 'Names you already hold in your head. The desk does not route orders.',
    staff: [],
    entry: 'watchlist',
    href: '/dashboard?entry=watchlist',
  },
  {
    id: 'crypto-board',
    title: 'On-chain board',
    job: 'Settlement assets without a fake P/E. Value seats stay empty if they have no cash flow.',
    staff: [],
    entry: 'lineup',
    href: '/dashboard?entry=lineup&market=crypto',
  },
];

export function getWorkKit(id: string): WorkKit | undefined {
  return WORK_KITS.find((k) => k.id === id);
}
