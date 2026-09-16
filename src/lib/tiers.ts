/**
 * Product seating. Observer is a silent 1-report funnel desk.
 * Paid: Analyst 16, Associate 29, Principal 48, Committee 61, Partners 61 (higher compute).
 * Isolated prompts scale; never 61² debate. $49 is 29 seats — never all 61.
 */

import { MASTERS, type Master } from '@/lib/masters';
import { CORE_PERSONA_SLUGS } from '@/lib/personas';

export type PlanId = 'observer' | 'analyst' | 'associate' | 'principal' | 'committee' | 'partners';
export type PaidPlanId = Exclude<PlanId, 'observer'>;

export const OBSERVER_SLUGS = [
  'warren-buffett',
  'peter-lynch',
  'charlie-munger',
] as const;

export const ANALYST_SLUGS = CORE_PERSONA_SLUGS;

/** 13 specialists on the working 16 → 29 seats. Bridge desk, not most of the committee. */
export const ASSOCIATE_EXTRA_SLUGS = [
  'carl-icahn',
  'dan-loeb',
  'paul-singer',
  'stanley-druckenmiller',
  'michael-steinhardt',
  'george-soros',
  'paul-tudor-jones',
  'john-paulson',
  'mark-minervini',
  'steve-cohen',
  'li-lu',
  'bill-ackman',
  'chuck-akre',
] as const;

/** 32 specialists on top of the working 16 → 48 seats. Exit + remaining platform quant stay Committee. */
export const PRINCIPAL_EXTRA_SLUGS = [
  'chase-coleman',
  'ron-baron',
  't-rowe-price',
  'ken-fisher',
  'mark-mobius',
  'george-soros',
  'bill-gross',
  'john-paulson',
  'paul-tudor-jones',
  'walter-schloss',
  'john-neff',
  'chuck-akre',
  'terry-smith',
  'li-lu',
  'bill-miller',
  'julian-robertson',
  'lee-ainslie',
  'bill-ackman',
  'david-tepper',
  'mohnish-pabrai',
  'carl-icahn',
  'dan-loeb',
  'paul-singer',
  'michael-steinhardt',
  'stanley-druckenmiller',
  'mark-minervini',
  'richard-dennis',
  'ed-seykota',
  'steve-cohen',
  'jim-simons',
  'ken-griffin',
  'cliff-asness',
] as const;

export const PLAN_ORDER: PlanId[] = ['observer', 'analyst', 'associate', 'principal', 'committee', 'partners'];
export const MARKETING_PLAN_IDS: PaidPlanId[] = ['analyst', 'associate', 'principal', 'committee', 'partners'];

export const PLANS: Record<
  PlanId,
  {
    id: PlanId;
    name: string;
    seats: number;
    price: string;
    period: string;
    yearly: string | null;
    tagline: string;
    computeNote: string;
    reports: string;
    style: string;
    marketing: boolean;
    features: string[];
  }
> = {
  observer: {
    id: 'observer',
    name: 'Observer',
    seats: 3,
    price: '$0',
    period: '/month',
    yearly: null,
    tagline: 'Three isolated briefs, then a clerk. One report.',
    computeNote: '3 isolated prompts + 1 assembly pass',
    reports: '1/month',
    style: 'Silent sample desk',
    marketing: false,
    features: [
      'Buffett, Lynch, Munger — isolated, then clerk',
      '1 report / month',
    ],
  },
  analyst: {
    id: 'analyst',
    name: 'Analyst',
    seats: 16,
    price: '$19',
    period: '/month',
    yearly: '$169/year (save 26%)',
    tagline: 'The working 16. Isolated first, then red team.',
    computeNote: '16 isolated prompts + 1 assembly pass',
    reports: '20/month',
    style: 'Working desk',
    marketing: true,
    features: [
      '16 isolated prompts + 1 assembly',
      'Trend, cycle, dual-track, debate, timing, Thorp sizing',
      '20 reports / month',
      '3 stock monitoring alerts',
      'Full weekly newsletter',
    ],
  },
  associate: {
    id: 'associate',
    name: 'Associate',
    seats: 29,
    price: '$49',
    period: '/month',
    yearly: '$429/year (save 27%)',
    tagline: '29 isolated seats — more than the working 16, not most of the committee. Not 61.',
    computeNote: '29 isolated prompts + 1 assembly pass',
    reports: '30/month',
    style: 'Bridge desk',
    marketing: true,
    features: [
      '29 seats (working 16 + 13 red-team, cycle, and timing extras)',
      'Icahn, Loeb, Singer, Druckenmiller, Soros, and more — still isolated first',
      '30 reports / month',
      '6 stock monitoring alerts',
      'Exit desk stays dark. This is not a 61-seat run',
    ],
  },
  principal: {
    id: 'principal',
    name: 'Principal',
    seats: 48,
    price: '$79',
    period: '/month',
    yearly: '$699/year (save 26%)',
    tagline: 'Most of the committee — 48 specialists, not the full 61.',
    computeNote: '48 isolated prompts + 1 assembly pass',
    reports: '40/month',
    style: 'Expanded committee',
    marketing: true,
    features: [
      '48 seats (working 16 + 32 specialists)',
      'Expanded red team, cycle, tape, and growth/value extras',
      '40 reports / month',
      '10 stock monitoring alerts',
      'Exit desk and remaining quant stay dark',
    ],
  },
  committee: {
    id: 'committee',
    name: 'Committee',
    seats: 61,
    price: '$149',
    period: '/month',
    yearly: '$1,290/year (save 28%)',
    tagline: 'Every master unlocked. Standard queue. Still isolated first.',
    computeNote: '61 isolated prompts + 1 assembly pass (no 61² debate)',
    reports: '60/month',
    style: 'Full 61 · standard run',
    marketing: true,
    features: [
      'All 61 unlocked — still isolated first, never a 61-way chat',
      'Exit desk + full quant seven',
      '60 reports / month · standard queue',
      '20 stock monitoring alerts',
      'Light API access (10K calls / month)',
    ],
  },
  partners: {
    id: 'partners',
    name: 'Partners',
    seats: 61,
    price: '$349',
    period: '/month',
    yearly: '$2,990/year (save 29%)',
    tagline: 'Same 61 seats. High volume, priority queue, API — priced for real agent cost.',
    computeNote: '61 isolated prompts + 1 assembly pass · priority routing',
    reports: '200/month',
    style: 'Full 61 · high compute',
    marketing: true,
    features: [
      'Same 61 seats as Committee — more runs, not more voices in a chat',
      '200 reports / month · priority queue',
      '50 stock monitoring alerts',
      'API access (50K calls / month)',
      'Priority model routing for the isolated batch',
    ],
  },
};

const OBSERVER_SET = new Set<string>(OBSERVER_SLUGS);
const ANALYST_SET = new Set<string>(ANALYST_SLUGS);
const ASSOCIATE_SET = new Set<string>([...ANALYST_SLUGS, ...ASSOCIATE_EXTRA_SLUGS]);
const PRINCIPAL_SET = new Set<string>([...ANALYST_SLUGS, ...PRINCIPAL_EXTRA_SLUGS]);

export function parsePlan(raw: string | string[] | undefined | null): PlanId {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (
    v === 'analyst' ||
    v === 'associate' ||
    v === 'principal' ||
    v === 'committee' ||
    v === 'partners' ||
    v === 'observer'
  ) {
    return v;
  }
  return 'observer';
}

/** Cookie/query is a billed desk. Observer and missing values are not. */
export function isPaidPlan(raw: string | string[] | undefined | null): raw is PaidPlanId {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return (
    v === 'analyst' ||
    v === 'associate' ||
    v === 'principal' ||
    v === 'committee' ||
    v === 'partners'
  );
}

export function slugsForPlan(plan: PlanId): string[] {
  if (plan === 'observer') return [...OBSERVER_SLUGS];
  if (plan === 'analyst') return [...ANALYST_SLUGS];
  if (plan === 'associate') return [...ANALYST_SLUGS, ...ASSOCIATE_EXTRA_SLUGS];
  if (plan === 'principal') return [...ANALYST_SLUGS, ...PRINCIPAL_EXTRA_SLUGS];
  return MASTERS.map((m) => m.slug);
}

export function mastersForPlan(plan: PlanId): Master[] {
  const allow = new Set(slugsForPlan(plan));
  return MASTERS.filter((m) => allow.has(m.slug));
}

export function isUnlocked(plan: PlanId, slug: string): boolean {
  if (plan === 'committee' || plan === 'partners') return true;
  if (plan === 'principal') return PRINCIPAL_SET.has(slug);
  if (plan === 'associate') return ASSOCIATE_SET.has(slug);
  if (plan === 'analyst') return ANALYST_SET.has(slug);
  return OBSERVER_SET.has(slug);
}

export function isFullRoster(plan: PlanId): boolean {
  return plan === 'committee' || plan === 'partners';
}

/** Strategy Vault slots per plan (Quant Lab). */
export function vaultLimitForPlan(plan: PlanId): number {
  if (plan === 'partners') return 50;
  if (plan === 'committee') return 25;
  if (plan === 'principal') return 10;
  if (plan === 'associate') return 5;
  if (plan === 'analyst') return 2;
  return 0;
}

/** Stock / private watchlist alert slots per plan (matches pricing copy). */
export function alertLimitForPlan(plan: PlanId): number {
  if (plan === 'partners') return 50;
  if (plan === 'committee') return 20;
  if (plan === 'principal') return 10;
  if (plan === 'associate') return 6;
  if (plan === 'analyst') return 3;
  return 1;
}

/** Saved prediction reports / favorites per plan. */
export function predictionSaveLimitForPlan(plan: PlanId): number {
  if (plan === 'partners') return 100;
  if (plan === 'committee') return 50;
  if (plan === 'principal') return 30;
  if (plan === 'associate') return 20;
  if (plan === 'analyst') return 10;
  return 3;
}

export function nextPlan(plan: PlanId): PlanId | null {
  const i = PLAN_ORDER.indexOf(plan);
  if (i < 0 || i >= PLAN_ORDER.length - 1) return null;
  return PLAN_ORDER[i + 1];
}

/** Lowest plan that includes this master. Partners is compute, not a seat gate. */
export function unlocksOn(slug: string): PlanId {
  if (OBSERVER_SET.has(slug)) return 'observer';
  if (ANALYST_SET.has(slug)) return 'analyst';
  if (ASSOCIATE_SET.has(slug)) return 'associate';
  if (PRINCIPAL_SET.has(slug)) return 'principal';
  return 'committee';
}

export const RESEARCH_PROTOCOL = {
  headline: 'Independent first. Assembled second.',
  steps: [
    {
      n: 1,
      title: 'Isolated briefs',
      body: 'Each unlocked legend sees the ticker, filings, and their own rules — not anyone else’s draft. No group chat. No anchoring.',
    },
    {
      n: 2,
      title: 'Clerk assembly',
      body: 'A separate pass stacks agreements, splits, and residual risks. It does not average the room into a fake consensus.',
    },
    {
      n: 3,
      title: 'Then, only then, debate',
      body: 'Red-team interrogation runs after independent work exists to attack. Observer skips this layer; paid desks unlock it with their seats.',
    },
  ],
  why:
    'A 61-person roundtable contaminates judgment and burns tokens. Isolated seats plus one synthesis are cheaper and more honest.',
} as const;
