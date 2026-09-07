/**
 * Market-level outputs for pipeline steps 1–3.
 * US-first fixtures (research niche). Research simulation, not live data.
 */

export const CYCLE_SNAPSHOT = {
  temperature: 62,
  phase: 'Late Expansion',
  dalio: 'The short-term debt cycle is hot; long-term debt is still high. This is not crisis pricing.',
  marks: 'The pendulum has left midpoint toward optimism, but not yet euphoria.',
  templeton: 'There is not enough pessimism to call this a maximum-pessimism buy.',
  updated: 'Weekly committee reading',
  scenarios: [
    { id: 'boom', label: 'Boom', probability: 18 },
    { id: 'recovery', label: 'Recovery', probability: 22 },
    { id: 'stagflation', label: 'Stagflation', probability: 27 },
    { id: 'recession', label: 'Recession', probability: 33 },
  ],
};

export const TREND_THEMES = [
  {
    id: 'ai-infra',
    title: 'AI infrastructure is still in a capex peak',
    sponsor: 'cathie-wood',
    validator: 'philippe-laffont',
    strength: 8,
    industries: ['Semiconductors', 'Cloud', 'Power'],
  },
  {
    id: 'internet-penetration',
    title: 'Digital ads and new consumption have not fully penetrated',
    sponsor: 'chase-coleman',
    validator: 'ken-fisher',
    strength: 7,
    industries: ['Internet', 'Consumer'],
  },
  {
    id: 'decade-compounders',
    title: 'Decade-scale platforms remain a long-run race',
    sponsor: 'ron-baron',
    validator: 't-rowe-price',
    strength: 7,
    industries: ['EV', 'Software', 'Payments'],
  },
  {
    id: 'quality-cash',
    title: 'High-return cash compounders are scarcer at higher rates',
    sponsor: 't-rowe-price',
    validator: 'ken-fisher',
    strength: 6,
    industries: ['Consumer staples', 'Healthcare', 'Exchanges'],
  },
  {
    id: 'em-diffusion',
    title: 'The trend is diffusing into EM; US-listed ADRs are the window',
    sponsor: 'mark-mobius',
    validator: 'ken-fisher',
    strength: 5,
    industries: ['EM internet', 'Energy transition'],
  },
];

export type CandidateTrack = 'value' | 'growth';

export interface Candidate {
  ticker: string;
  name: string;
  track: CandidateTrack;
  sponsor: string;
  reason: string;
}

/** One name per selection master — dual-track pool, US listings. */
export const CANDIDATES: Candidate[] = [
  { ticker: 'KO', name: 'Coca-Cola', track: 'value', sponsor: 'benjamin-graham', reason: 'Predictable cash flow; margin of safety from price, not the story.' },
  { ticker: 'BRK-B', name: 'Berkshire Hathaway', track: 'value', sponsor: 'warren-buffett', reason: 'Moat + cash + a management final-review sample.' },
  { ticker: 'BAC', name: 'Bank of America', track: 'value', sponsor: 'walter-schloss', reason: 'Still cheap vs. book; leverage you can track — cigar-butt finance.' },
  { ticker: 'CVX', name: 'Chevron', track: 'value', sponsor: 'john-neff', reason: 'Low P/E plus modest growth — original GARP.' },
  { ticker: 'BMY', name: 'Bristol-Myers Squibb', track: 'value', sponsor: 'seth-klarman', reason: 'Distress narrative not fully cleared; cash-ammunition special situation.' },
  { ticker: 'COST', name: 'Costco', track: 'value', sponsor: 'chuck-akre', reason: 'Three-legged stool: model, reinvestment, people.' },
  { ticker: 'MSFT', name: 'Microsoft', track: 'value', sponsor: 'terry-smith', reason: 'High return on capital; close to a hold-forever candidate.' },
  { ticker: 'VZ', name: 'Verizon', track: 'value', sponsor: 'hetty-green', reason: 'Extreme cheapness and the balance sheet must be judged separately — debt first.' },
  { ticker: 'AAPL', name: 'Apple', track: 'value', sponsor: 'duan-yongping', reason: 'You are buying the company: the model can be explained to a non-specialist.' },
  { ticker: 'BABA', name: 'Alibaba', track: 'value', sponsor: 'li-lu', reason: 'China asset inside the circle of competence; US ADR window, not an A-share launch.' },

  { ticker: 'SHOP', name: 'Shopify', track: 'growth', sponsor: 'peter-lynch', reason: 'A growth company you can see in daily life — classify first, then value.' },
  { ticker: 'AMD', name: 'AMD', track: 'growth', sponsor: 'bill-miller', reason: 'Competitiveness intact after a narrative setback — contrarian growth.' },
  { ticker: 'NVDA', name: 'NVIDIA', track: 'growth', sponsor: 'julian-robertson', reason: 'Best global growth long sample; selection ≠ chase the high.' },
  { ticker: 'AMZN', name: 'Amazon', track: 'growth', sponsor: 'andreas-halvorsen', reason: 'Core holding in large-cap growth plus industry leadership.' },
  { ticker: 'GOOGL', name: 'Alphabet', track: 'growth', sponsor: 'stephen-mandel', reason: 'Growth and value factors cross-checked on the same name.' },
  { ticker: 'NOW', name: 'ServiceNow', track: 'growth', sponsor: 'lee-ainslie', reason: 'Deep-fundamental sample in tech / services.' },
  { ticker: 'UBER', name: 'Uber', track: 'growth', sponsor: 'bill-ackman', reason: 'Quality platform plus a still-debatable value-unlock catalyst.' },
  { ticker: 'PYPL', name: 'PayPal', track: 'growth', sponsor: 'david-tepper', reason: 'Distress-reversal candidate: former leader after a broken narrative — split the cash flows.' },
  { ticker: 'GOOG', name: 'Alphabet Class C', track: 'growth', sponsor: 'mohnish-pabrai', reason: 'High concentration, low complexity — Buffett-clone sample.' },
  { ticker: 'QCOM', name: 'Qualcomm', track: 'growth', sponsor: 'joel-greenblatt', reason: 'Magic Formula rank: return on capital plus a special situation.' },
];

export const HOW_TO_BUY = {
  headline: 'Late-expansion entry rules (steps 5–6 run after you open a name)',
  rules: [
    'The pool is step-3 output, not an order ticket.',
    'Timing needs a trigger (breakout / Stage 2 / turtles) — a name in the pool is not a buy.',
    'Quant: half-Kelly in late expansion; Englander caps loss on any single view.',
  ],
};
