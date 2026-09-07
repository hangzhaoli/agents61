/**
 * Canonical six-step committee pipeline.
 * Source: agents61-六步投研管线设计.md — do not invent extra stages.
 */

export const PIPELINE_STEPS = [
  {
    step: 1,
    key: 'trend' as const,
    groups: ['trend'] as const,
    question: 'Where does capital flow over the next decade?',
    label: 'Trend Research',
    count: 7,
    output: 'Era Trend List',
    outputDetail: '3–5 major trends, beneficiary industries, and strength scores (1–10).',
  },
  {
    step: 2,
    key: 'cycle' as const,
    groups: ['cycle'] as const,
    question: 'Where are we in the cycle?',
    label: 'Cycle Research',
    count: 9,
    output: 'Cycle Position + Thermometer',
    outputDetail: 'Current phase, 0–100 thermometer, and scenario odds: boom / recession / stagflation / recovery.',
  },
  {
    step: 3,
    key: 'selection' as const,
    groups: ['value', 'growth'] as const,
    question: 'What to buy',
    label: 'Stock Selection',
    count: 20,
    output: 'Dual-Track Candidate Pool',
    outputDetail: '10–20 value-track names + 10–20 growth-track names, each with a written reason.',
  },
  {
    step: 4,
    key: 'debate' as const,
    groups: ['debate'] as const,
    question: 'Bull case vs. red-team interrogation',
    label: 'Debate',
    count: 8,
    output: 'Investment Proposal',
    outputDetail: 'Both sides, risk list, confidence score, and sizing suggestion.',
    note: 'The product’s soul. Buffett sits on the value track and runs the 10-year hold test here — not a 9th debate seat.',
  },
  {
    step: 5,
    key: 'timing' as const,
    groups: ['timing'] as const,
    question: 'When to buy, and how much',
    label: 'Timing',
    count: 5,
    output: 'Entry Plan',
    outputDetail: 'Trigger conditions, scale-in plan, and initial size.',
  },
  {
    step: 6,
    key: 'exit' as const,
    groups: ['exit'] as const,
    question: 'When to sell',
    label: 'Exit',
    count: 5,
    output: 'Exit Discipline',
    outputDetail: 'Stops, take-profit rules, rebalancing, and penalties for breaking the rules.',
  },
] as const;

export const QUANT_LAYER = {
  key: 'quant' as const,
  label: 'Quant Risk Control',
  count: 7,
  question: 'Verify every intuition',
  output: 'Backtest + sizing + risk budget',
  alwaysOn: true,
};

export const TREND_DUTIES: Record<string, string> = {
  'cathie-wood': 'Disruptive-innovation lead: AI, robotics, genomics, blockchain, energy storage',
  'philippe-laffont': 'Tech-stack commercialization: which trends have already hit an inflection',
  'chase-coleman': 'Internet and new-consumption penetration',
  'ron-baron': 'Decade-scale growth screens (Tesla-style compounders)',
  't-rowe-price': 'Historical analog: which past growth cycle this one most resembles',
  'ken-fisher': 'Global flows and valuation-gap checks',
  'mark-mobius': 'Emerging-markets lens: how the trend diffuses geographically',
};

export const CYCLE_DUTIES: Record<string, string> = {
  'ray-dalio': 'Long-term and short-term debt-cycle placement (Bridgewater frame)',
  'howard-marks': 'Pendulum location plus memo-style risk warnings',
  'john-templeton': 'Pessimism / optimism gauge (buy-at-maximum-pessimism test)',
  'george-soros': 'Reflexivity: is the trend self-reinforcing or self-destroying',
  'john-maynard-keynes': 'Beauty contest: what consensus is priced, and where it is wrong',
  'alan-howard': 'Rates and liquidity-cycle call',
  'bill-gross': 'Bond-market signals (curve, credit spreads)',
  'john-paulson': 'Credit quality and systemic-risk watch',
  'paul-tudor-jones': 'Macro-trader confirmation of cycle turns',
};

export const VALUE_SCREENS: Record<string, string> = {
  'benjamin-graham': 'Margin of safety: price below two-thirds of intrinsic value',
  'warren-buffett': 'Moat + ROE + management quality, final review',
  'walter-schloss': 'Net-net cigar butts: PB < 0.8, low debt, diversified',
  'john-neff': 'Low P/E plus modest growth (original GARP)',
  'seth-klarman': 'Distress and special situations, cash-as-ammunition',
  'chuck-akre': 'Compounding three-legged stool: model / reinvestment / people',
  'terry-smith': 'High return on capital, hold-forever candidates',
  'hetty-green': 'Extreme cheapness plus a fortress balance sheet',
  'duan-yongping': 'Buying a stock is buying a business you can explain',
  'li-lu': 'Circle of competence plus civilizational-cycle view (China / ADRs)',
};

export const GROWTH_SCREENS: Record<string, string> = {
  'peter-lynch': 'Ten-baggers you can see in daily life + six-type classification',
  'bill-miller': 'Contrarian growth: high-competitiveness names that stumbled',
  'julian-robertson': 'Best global long/short pairings',
  'andreas-halvorsen': 'Large-cap growth plus industry leaders',
  'stephen-mandel': 'Growth and value factors cross-checked on the same name',
  'lee-ainslie': 'Deep fundamentals in tech / services',
  'bill-ackman': 'Quality platforms plus a catalyst to unlock value',
  'david-tepper': 'Distress reversals and crisis buying',
  'mohnish-pabrai': 'Formulaic Buffett clone: concentrated, low complexity',
  'joel-greenblatt': 'Magic Formula rank plus special-situation arb',
};

export const DEBATE_SEQUENCE = {
  redTeam: [
    { slug: 'david-einhorn', duty: 'Earnings quality and accounting traps' },
    { slug: 'michael-burry', duty: 'Extreme inversion: what assumptions hide in the model' },
    { slug: 'carl-icahn', duty: 'Governance and related-party extraction' },
    { slug: 'dan-loeb', duty: 'Is the story empty, is the catalyst real' },
    { slug: 'paul-singer', duty: 'Tail risk and legal / contract holes' },
  ],
  crossExam: [
    { slug: 'michael-steinhardt', duty: 'Variant perception: where this thesis differs from consensus' },
    { slug: 'stanley-druckenmiller', duty: 'If you get only one shot, would you concentrate' },
  ],
  verdict: [
    { slug: 'charlie-munger', duty: 'Debate chair · inversion: the best way to kill this thesis' },
    { slug: 'warren-buffett', duty: 'Final review · 10-year hold test', guestFrom: 'value' },
  ],
  drama: 'Ackman vs Icahn remain opponents in debate — content column, not a ninth seat.',
} as const;

export const TIMING_METHODS: Record<string, string> = {
  'william-oneil': 'CANSLIM buy point: cup-with-handle breakout + market-follow-through',
  'mark-minervini': 'SEPA: Stage 2 launch confirmation',
  'richard-dennis': 'Turtle rules: 20-day / 55-day breakout system',
  'ed-seykota': 'Trend following: confirm the momentum direction',
  'steve-cohen': 'Tape and short-horizon signals: volume, price, news reaction',
};

export const EXIT_RULES: Record<string, string> = {
  'jesse-livermore': 'Iron stop-loss, let winners run',
  'bernard-baruch': 'Sell into optimism rather than wait for the top',
  'nicolas-darvas': 'Sell if the box breaks — original trailing stop',
  'philip-fisher': 'Do not sell lightly — only error or deteriorating fundamentals',
  'john-bogle': 'Plan zero: if the book cannot beat the index, switch to the index (accountability)',
};

export const QUANT_DUTIES: Record<string, string> = {
  'ed-thorp': 'Position size: Kelly criterion (how much per bet)',
  'jim-simons': 'Statistical test: does the signal have historical significance',
  'ken-griffin': 'Multi-strategy integration and execution-cost control',
  'david-shaw': 'Model-pipeline architecture (engineering the method)',
  'cliff-asness': 'Factor exposure: skill or style bet',
  'two-sigma': 'Alternative-data cross-check',
  'israel-englander': 'Platform risk: loss cap on any single view',
};

export const WEEKLY_AGENDA = [
  { day: 'Mon', focus: 'Trend + cycle', detail: 'Weekly macro and trend update (Dalio thermometer)' },
  { day: 'Tue', focus: 'Selection', detail: 'Adds and removals from the candidate pool' },
  { day: 'Wed', focus: 'Debate', detail: 'Focus-name bull/bear (clip / podcast)' },
  { day: 'Thu', focus: 'Timing + exit', detail: 'Portfolio operating plan' },
  { day: 'Fri', focus: 'Quant', detail: 'Performance attribution + Bogle accountability (did we beat the index?)' },
] as const;
