/**
 * Homepage / private-desk hooks — high-stakes open questions → Dashboard.
 * Research simulation only. Not a rating, not advice, not a live quote.
 */

export type PrivateHook = {
  slug: string;
  name: string;
  badge: string;
  /** Short urgency chip — FOMO without a buy button */
  stake: string;
  /** Cached secondary mark tease */
  markLabel: string;
  /** The open question visitors care about */
  question: string;
  /** One-line “what if / potential” tease */
  potential: string;
  /** Who the visitor imagines on the seat */
  mastersLine: string;
  /** Primary CTA label */
  cta: string;
  /** Pre-filled desk prompt */
  prompt: string;
};

export const PRIVATE_HOOKS: PrivateHook[] = [
  {
    slug: 'openai',
    name: 'OpenAI',
    badge: 'Pre-IPO · AI',
    stake: 'Mark at risk',
    markLabel: '~$157B round · no EDGAR',
    question:
      'Open weights keep getting “good enough.” Is OpenAI still a toll road — or already a race to zero?',
    potential:
      'Microsoft distribution + API seats could compound for a decade. Capex + commoditization can vaporize the mark in one funding cycle. Which story survives isolation?',
    mastersLine: 'Cathie Wood · Philip Fisher · Michael Burry',
    cta: 'Staff OpenAI on the desk',
    prompt:
      'Research OpenAI as a private company — compute moat vs open-weight commoditization, revenue run-rate, and IPO timing. Secondary marks only. No EDGAR.',
  },
  {
    slug: 'anthropic',
    name: 'Anthropic',
    badge: 'Pre-IPO · AI safety',
    stake: 'Trust premium',
    markLabel: '~$61.5B · enterprise bet',
    question:
      'Will enterprises keep paying a Claude trust premium — or does inference deflation kill the seat?',
    potential:
      'Sticky contracts look wonderful until cloud partners and open models compress margins. Brand narrative dies; unit economics decide.',
    mastersLine: 'Cathie Wood · Seth Klarman · Charlie Munger',
    cta: 'Invert Anthropic now',
    prompt:
      'Research Anthropic as a private company — enterprise trust premium vs compute bill, partner concentration, and secondary mark durability. No EDGAR.',
  },
  {
    slug: 'stripe',
    name: 'Stripe',
    badge: 'Pre-IPO · payments',
    stake: 'Take-rate fight',
    markLabel: '~$65B tender · reset',
    question:
      'Is Stripe still a take-rate on internet GDP — or do wallets and interchange crush the rail?',
    potential:
      'Embedded finance expands TAM. Regulation and big-tech wallets are structural. Value vs growth seats will split hard — before any IPO window.',
    mastersLine: 'Warren Buffett · Peter Lynch · Charlie Munger',
    cta: 'Pressure-test Stripe',
    prompt:
      'Research Stripe as a private company — take-rate durability, tender marks, and fintech cyclicality. Secondary marks only. No EDGAR.',
  },
  {
    slug: 'anduril',
    name: 'Anduril',
    badge: 'Pre-IPO · defense',
    stake: 'Post-SPCX private',
    markLabel: '~$28B · DoD politics',
    question:
      'Can software-defined defense keep software margins inside DoD budget politics?',
    potential:
      'One award re-rates the mark overnight. One export-control hit deletes it. Primes want the category. Isolation finds which story is real.',
    mastersLine: 'Cathie Wood · Druckenmiller · Ray Dalio · Klarman',
    cta: 'Convene Anduril desk',
    prompt:
      'Research Anduril as a private company — autonomy contracts, secondary valuation, and defense-budget risk. No EDGAR.',
  },
  {
    slug: 'databricks',
    name: 'Databricks',
    badge: 'Pre-IPO · data / AI',
    stake: 'Bundle risk',
    markLabel: '~$43B · lakehouse',
    question:
      'Durable seat expansion — or will hyperscalers bundle the lakehouse away for free?',
    potential:
      'Net retention looks compounding until AI features land inside cloud contracts. Fisher quality vs Einhorn falsifier — pick before the mark moves.',
    mastersLine: 'Philip Fisher · Peter Lynch · David Einhorn',
    cta: 'Kill-shot Databricks',
    prompt:
      'Research Databricks as a private company — lakehouse retention vs cloud bundling and secondary marks. No EDGAR.',
  },
  {
    slug: 'xai',
    name: 'xAI',
    badge: 'Pre-IPO · AI + X',
    stake: 'Optionality tax',
    markLabel: '~$50B · GPU + feed',
    question:
      'Is X distribution a monetizable moat — or a capital sink dressed as optionality?',
    potential:
      'Trend seats map GPUs. Debate seats ask governance + advertiser cyclicality. No invented revenue. The desk will say pass if the file is thin.',
    mastersLine: 'Cathie Wood · Michael Burry · Carl Icahn',
    cta: 'Stress-test xAI',
    prompt:
      'Research xAI as a private company — distribution + GPUs optionality, funding marks, and governance risk. No EDGAR. Do not invent revenue.',
  },
];

export function dashboardPrivateHref(slug: string): string {
  return `/dashboard?entry=analyze&private=${encodeURIComponent(slug)}`;
}

export function dashboardPrivateGuestHref(slug: string): string {
  const next = dashboardPrivateHref(slug);
  return `/register?next=${encodeURIComponent(next)}`;
}
