/**
 * First pass of a desk run: name the work before anyone writes.
 * Unlocked seats only. Locked seats stay empty.
 * No ticker → opportunity scan = pipeline steps 1–3 only.
 */

import { MASTERS, GROUP_META, GROUP_ORDER, type PipelineGroup } from '@/lib/masters';
import { extractSubject, type ResearchDomain } from '@/lib/extract-subject';
import { mastersForPlan, PLANS, type PlanId } from '@/lib/tiers';
import type { BriefKind } from '@/lib/brief-writer';

export type DeskIntent =
  | 'opportunity'
  | 'ten-year-hold'
  | 'invert'
  | 'cycle'
  | 'classify'
  | 'crypto'
  | 'emerging'
  | 'private'
  | 'general';

export type PlannedSeat = {
  slug: string;
  nameEn: string;
  role: string;
  group: PipelineGroup;
  groupLabel: string;
};

export type DeskPlan = {
  question: string;
  ticker: string | null;
  intent: DeskIntent;
  intentLabel: string;
  domain: BriefKind;
  steps: string[];
  seats: PlannedSeat[];
  lockedCount: number;
  deferredCount: number;
  planId: PlanId;
  planName: string;
};

/** Pipeline steps 1–3: era, cycle, dual-track selection. Debate/timing/exit wait for a name. */
export const OPPORTUNITY_GROUPS: PipelineGroup[] = ['trend', 'cycle', 'value', 'growth'];

export const OPPORTUNITY_PROMPT =
  'I have not bought anything yet. What US-listed opportunities fit this week’s trend and cycle?';

export function classifyIntent(
  message: string,
  ticker: string | null,
  domain: ResearchDomain | null
): { intent: DeskIntent; intentLabel: string } {
  const q = message.toLowerCase();

  if (domain === 'crypto') {
    return {
      intent: 'crypto',
      intentLabel: ticker
        ? `Crypto / on-chain research — ${ticker}`
        : 'Crypto / on-chain board — Trend → Cycle → classify',
    };
  }
  if (domain === 'emerging') {
    return {
      intent: 'emerging',
      intentLabel: ticker
        ? `Emerging-market name — ${ticker} (US listing)`
        : 'Emerging-market opportunity scan — US-listed window',
    };
  }
  if (domain === 'private') {
    return {
      intent: 'private',
      intentLabel: ticker
        ? `Private desk — ${ticker} (secondary marks, no EDGAR)`
        : 'Private / pre-IPO board — secondary marks only',
    };
  }

  const opportunityAsk =
    !ticker ||
    /\b(opportunit|what to buy|don't know|do not know|haven't bought|have not bought|no ticker|idea|ideas|scan the market|market now|where does capital|candidate pool|what should i (look|watch|research))\b/.test(
      q
    );

  if (ticker && /\b(invert|kill|red.?team|short|trap|fraud|earnings quality)\b/.test(q)) {
    return { intent: 'invert', intentLabel: 'Invert first — try to kill the thesis' };
  }
  if (ticker && /\b(10[- ]?year|ten[- ]year|decade|hold test|moat)\b/.test(q)) {
    return { intent: 'ten-year-hold', intentLabel: 'Ten-year hold / quality test' };
  }
  if (ticker && /\b(lynch|category|stalwart|ten[- ]bagger|growth story)\b/.test(q)) {
    return { intent: 'classify', intentLabel: 'Classify the business first' };
  }
  if (!ticker && /\b(cycle|macro|pendulum)\b/.test(q) && !opportunityAsk) {
    return { intent: 'cycle', intentLabel: 'Cycle / regime reading' };
  }
  if (opportunityAsk) {
    return {
      intent: 'opportunity',
      intentLabel: 'Opportunity scan — Trend → Cycle → Value / Growth',
    };
  }
  if (/\b(cycle|macro|pendulum|debt cycle|thermometer)\b/.test(q)) {
    return { intent: 'cycle', intentLabel: 'Cycle / regime reading' };
  }
  return { intent: 'general', intentLabel: 'Isolated committee research' };
}

function domainFromIntent(intent: DeskIntent, extracted: ResearchDomain | null): BriefKind {
  if (intent === 'opportunity') return 'opportunity';
  if (intent === 'crypto') return 'crypto';
  if (intent === 'emerging') return 'emerging';
  if (intent === 'private') return 'private';
  if (extracted === 'private') return 'private';
  return extracted === 'crypto' || extracted === 'emerging' ? extracted : 'ticker';
}

export function buildDeskPlan(message: string, planId: PlanId): DeskPlan {
  const question = message.trim();
  const extracted = extractSubject(question);
  const ticker = extracted.ticker;
  const { intent, intentLabel } = classifyIntent(question, ticker, extracted.domain);
  const domain = domainFromIntent(intent, extracted.domain);
  const unlocked = mastersForPlan(planId);
  const boardScan =
    (intent === 'opportunity' || intent === 'crypto' || intent === 'emerging' || intent === 'private') &&
    !ticker;
  const writingMasters = boardScan
    ? unlocked
        .filter((m) => OPPORTUNITY_GROUPS.includes(m.group))
        .sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group))
    : unlocked;

  const seats: PlannedSeat[] = writingMasters.map((m) => ({
    slug: m.slug,
    nameEn: m.nameEn,
    role: m.role,
    group: m.group,
    groupLabel: GROUP_META[m.group].label,
  }));

  const lockedCount = MASTERS.length - unlocked.length;
  const deferredCount = unlocked.length - writingMasters.length;
  const meta = PLANS[planId];

  const steps = boardScan
    ? intent === 'crypto'
      ? [
          'Crypto board — settlement, L2 fee split, on-chain credit, venue policy.',
          'Cycle overlay — risk-asset beta in this thermometer, not a timing ticket.',
          'Classify usage versus narrative. P/E and P/B are not forced onto tokens.',
          deferredCount > 0
            ? `Debate, timing, and exit stay dark until you name an asset (${deferredCount} unlocked seats wait).`
            : 'You can open BTC/ETH/SOL next and run debate / timing.',
          'Clerk stacks the board. Not a buy list. No buy button.',
        ]
      : intent === 'emerging'
        ? [
            'Emerging-market board — US-listed ADRs and ETFs only.',
            'Cycle and policy overlay. GDP slogans are not a screen.',
            'Value vs growth tracks stay separate. China ADRs get a structure test.',
            'Clerk stacks the board. Not a local-exchange ticket.',
          ]
        : intent === 'private'
          ? [
              'Private desk — Anduril, Stripe, OpenAI, and other pre-IPO names. SpaceX is SPCX.',
              'Secondary marks and public disclosures only. No SEC EDGAR.',
              'Value seats ask business quality; trend seats map capex cycles; debate inverts the mark.',
              deferredCount > 0
                ? `Timing and exit stay dark until you pick one name (${deferredCount} seats wait).`
                : 'Open a private name for full debate / timing.',
              'Clerk stacks the board. Not a secondary-market ticket. No buy button.',
            ]
        : [
            'Step 1 · Trend Research — where capital may flow over the next decade.',
            'Step 2 · Cycle Research — where we are on the thermometer (not a timing ticket).',
            'Step 3A · Value / Quality — names that pass a business test.',
            'Step 3B · Growth / Opportunity — names that pass a classification test.',
            deferredCount > 0
              ? `Debate, timing, and exit stay dark until you pick a ticker (${deferredCount} unlocked seats wait).`
              : 'You can open a name next and run debate / timing.',
            lockedCount > 0
              ? `${lockedCount} seats locked by ${meta.name} stay empty.`
              : 'Full 1–3 roster on this desk.',
            'Clerk stacks the board. Not a buy list. Not a recommendation.',
          ]
    : [
        ticker
          ? domain === 'crypto'
            ? `Research ${ticker} as crypto/on-chain — public snapshot if available, no invented series.`
            : domain === 'private'
              ? `Research ${ticker} as private / pre-IPO — secondary marks only, no EDGAR.`
              : `Research ${ticker} from filings — no live quote, no invented ratios.`
          : 'No ticker in the question — methodology only, no invented numbers.',
        `${seats.length} unlocked seats write alone. They cannot see each other’s drafts.`,
        lockedCount > 0
          ? `${lockedCount} locked seats stay empty. We do not ghost-fill them.`
          : 'Full 61 roster. Still isolated first — never a 61-way chat.',
        'A clerk stacks agreements and splits. No average. No “you should buy.” No buy button.',
        'You can download Markdown or PDF when the clerk is done.',
      ];

  return {
    question,
    ticker,
    intent,
    intentLabel,
    domain,
    steps,
    seats,
    lockedCount,
    deferredCount,
    planId,
    planName: meta.name,
  };
}
