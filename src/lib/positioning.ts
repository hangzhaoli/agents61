/**
 * Positioning niche — locked from the research brief.
 * Not a data terminal. Not Seeking Alpha. Not a copilot chat.
 */

export const POSITIONING = {
  market: 'US / English, US stocks first (ETFs adjacent). US-listed EM ADRs and crypto/on-chain research boards. A-shares later.',
  segment: 'Intermediate retail (3yr+, ~$50k–$500k) and value-investing enthusiasts.',
  notFor: [
    'Complete beginners who only want a buy button',
    'Passive investors who only need an ETF checkup',
    'Pros who want a Bloomberg/Koyfin terminal',
  ],
  job: 'Structured research: what to buy, whether this name survives debate, how/when to enter and exit.',
  pain: 'Data sites have no view. Seeking Alpha is expensive and uneven. AI copilots are shallow chat.',
  wedge:
    'Masters research a name in isolation, then a clerk assembles agreements and splits. Analyst unlocks 16 seats, Associate 29, Principal 48, Committee and Partners all 61.',
  output: 'A committee research simulation (views, why, divergence, tables, charts). Never “you should buy.” No buy button.',
  priceAnchor: '$19/mo Analyst — inside the $10–30 retail research sweet spot.',
  seoJob: '{ticker} stock analysis pages as programmatic SEO, committee report as the template.',
} as const;
