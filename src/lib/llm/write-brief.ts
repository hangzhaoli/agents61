/**
 * Isolated seat writer: DeepSeek V4 when a key is present, methodology-card fallback otherwise.
 * Each call gets only this persona's system prompt + facts + the question.
 * Peers in the same group stay silent. Handoff may include earlier pipeline notes.
 */

import type { CryptoSnapshot } from '@/lib/data/crypto';
import type { Fundamentals } from '@/lib/data/fundamentals';
import { privateFactsBlock, type PrivateFacts } from '@/lib/data/private-facts';
import { draftIndependentBrief, type BriefKind, type BriefDraft, type DraftStance } from '@/lib/brief-writer';
import type { Master } from '@/lib/masters';
import { getPersona } from '@/lib/personas';
import { COMPLIANCE_BLOCK } from '@/lib/personas/types';
import { buildPackContextAsync, type PackEvidence } from '@/lib/personas/modules';
import { getSourcePack } from '@/lib/personas/source-pack';
import type { PlanId } from '@/lib/tiers';
import {
  deepseekChat,
  hasDeepseekKey,
  type BriefEngine,
} from '@/lib/llm/deepseek';
import type { NewsDigest } from '@/lib/llm/news-scan';
import { newsBlock } from '@/lib/llm/news-scan';
import { REPORT_DIG_STANDARD } from '@/lib/llm/report-standard';

export type WrittenBrief = BriefDraft & {
  isolated: true;
  engine: BriefEngine;
  packEvidence?: PackEvidence;
};

const BUY_RE = /\byou should (buy|sell)\b/gi;

type LlmFields = {
  stance: DraftStance;
  looksAt: string;
  thesis: string;
  why: string;
  finding: string;
  risks: string;
  wouldChangeMind: string;
  underwriteFrame: string;
};

function clip(s: string, n: number): string {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}

function scrub(s: string): string {
  return s.replace(BUY_RE, 'this is not a recommendation to $1').trim();
}

function pct(n: number | null): string | null {
  if (n == null || Number.isNaN(n)) return null;
  return `${(n * 100).toFixed(1)}%`;
}

function money(n: number | null): string | null {
  if (n == null || Number.isNaN(n)) return null;
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  return `${sign}$${abs.toFixed(0)}`;
}

function factsBlock(facts: Fundamentals): string {
  const rows = [
    facts.entityName && `Name: ${facts.entityName}`,
    facts.form && facts.fiscalYear
      ? `Filing: ${facts.form}${facts.fiscalPeriod ? ` ${facts.fiscalPeriod}` : ''} FY${facts.fiscalYear}${
          facts.periodKind === 'interim' ? ' (INTERIM / not a full-year 10-K yet)' : ''
        }`
      : null,
    facts.periodEnd && `Period end: ${facts.periodEnd}`,
    facts.revenue != null
      ? `Revenue${facts.periodKind === 'interim' ? ' (YTD)' : ''}: ${money(facts.revenue)}`
      : null,
    facts.revenueYoY != null ? `Revenue YoY: ${pct(facts.revenueYoY)}` : null,
    facts.netIncome != null ? `Net income: ${money(facts.netIncome)}` : null,
    facts.epsDiluted != null ? `Diluted EPS: $${facts.epsDiluted.toFixed(2)}` : null,
    facts.roe != null ? `ROE: ${pct(facts.roe)}` : null,
    facts.debtToEquity != null ? `LT debt/equity: ${facts.debtToEquity.toFixed(2)}` : null,
    facts.equity != null ? `Stockholders equity: ${money(facts.equity)}` : null,
    facts.assets != null ? `Assets: ${money(facts.assets)}` : null,
    facts.longTermDebt != null ? `Long-term debt: ${money(facts.longTermDebt)}` : null,
    facts.price != null ? `Cached price: $${facts.price.toFixed(2)} (not live)` : null,
    facts.marketCap != null ? `Est. market cap: ${money(facts.marketCap)} (price × diluted shares)` : null,
    facts.pe != null
      ? `P/E (cached, not live): ${facts.pe.toFixed(1)}`
      : facts.peNm
        ? 'P/E: n/m (diluted EPS ≤ 0)'
        : null,
    facts.pb != null ? `P/B (cached, not live): ${facts.pb.toFixed(2)}` : null,
    facts.ps != null
      ? `P/S (cached, not live): ${facts.ps.toFixed(2)}${
          facts.periodKind === 'interim' ? ' — uses YTD sales, not annualized' : ''
        }`
      : null,
    facts.sharesDiluted != null
      ? `Weighted diluted shares: ${(facts.sharesDiluted / 1e9).toFixed(2)}B`
      : null,
    facts.ratiosNote,
    facts.error && `Filing gap: ${facts.error} — do not invent the missing numbers.`,
  ].filter(Boolean);
  if (!rows.length) return 'No filing facts on this run. Methodology only. Do not invent numbers.';
  return rows.join('\n');
}

function cryptoBlock(snap: CryptoSnapshot | null): string {
  if (!snap) return 'No crypto snapshot. Do not invent on-chain series or a fake P/E.';
  if (snap.error) {
    return `Crypto snapshot incomplete (${snap.error}). Methodology only. No invented price or P/E.`;
  }
  const rows = [
    `Asset: ${snap.name} (${snap.symbol})`,
    snap.priceUsd != null ? `Cached price USD: ${snap.priceUsd}` : null,
    snap.marketCap != null ? `Market cap: ${money(snap.marketCap)}` : null,
    snap.volume24h != null ? `24h volume: ${money(snap.volume24h)}` : null,
    snap.change24h != null ? `24h change: ${pct(snap.change24h)}` : null,
    snap.change7d != null ? `7d change: ${pct(snap.change7d)}` : null,
    snap.circulatingSupply != null ? `Circulating supply: ${snap.circulatingSupply}` : null,
    `Source: ${snap.source}, cached at ${snap.fetchedAt}. Not a live quote.`,
    'Do not force cash-flow multiples (P/E, P/B) onto a token with no earnings.',
  ].filter(Boolean);
  return rows.join('\n');
}

function mapStance(raw: unknown): DraftStance | null {
  const s = String(raw ?? '')
    .toLowerCase()
    .trim();
  if (s === 'constructive' || s === 'bullish' || s === 'long' || s === 'positive') return 'constructive';
  if (s === 'skeptical' || s === 'bearish' || s === 'short' || s === 'negative') return 'skeptical';
  if (s === 'cautious' || s === 'neutral' || s === 'hold' || s === 'mixed') return 'cautious';
  if (s === 'inconclusive' || s === 'unknown' || s === 'insufficient') return 'inconclusive';
  return null;
}

function extractJson(text: string): unknown {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = (fence ? fence[1] : text).trim();
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('No JSON object');
  return JSON.parse(raw.slice(start, end + 1)) as unknown;
}

function parseFields(text: string): LlmFields {
  const obj = extractJson(text) as Record<string, unknown>;
  const stance = mapStance(obj.stance);
  if (!stance) throw new Error('Bad stance');
  const thesis = scrub(String(obj.thesis ?? ''));
  const why = scrub(String(obj.why ?? ''));
  const finding = scrub(String(obj.finding ?? obj.thesis ?? ''));
  const risks = scrub(String(obj.risks ?? ''));
  const wouldChangeMind = scrub(String(obj.wouldChangeMind ?? obj.falsifier ?? ''));
  const looksAt = String(obj.looksAt ?? obj.looks_at ?? '').trim();
  const underwriteFrame = String(
    obj.underwriteFrame ?? obj.underwrite_frame ?? obj.frame ?? ''
  )
    .trim()
    .toLowerCase();
  if (!thesis || !finding) throw new Error('Empty thesis');
  return {
    stance,
    looksAt: clip(looksAt, 200),
    thesis: clip(thesis, 560),
    why: clip(why || thesis, 640),
    finding: clip(finding, 5200),
    risks: clip(risks || 'Main risk: the file on this desk is incomplete.', 480),
    wouldChangeMind: clip(
      wouldChangeMind || 'This seat flips if the facts that support the method disappear.',
      420
    ),
    underwriteFrame,
  };
}

function templateBrief(
  master: Master,
  subject: string,
  facts: Fundamentals,
  question: string,
  kind: BriefKind,
  crypto: CryptoSnapshot | null,
  note: string,
  packEvidence?: PackEvidence | null
): WrittenBrief {
  const draft = draftIndependentBrief(master, subject, facts, question, kind, crypto);
  return {
    ...draft,
    isolated: true,
    engine: 'template',
    sourceLine: `${draft.sourceLine} · ${note}`,
    ...(packEvidence ? { packEvidence } : {}),
  };
}

function engineLabel(engine: BriefEngine): string {
  if (engine === 'deepseek-v4-pro') return 'DeepSeek V4-Pro';
  if (engine === 'deepseek-v4-flash') return 'DeepSeek V4-Flash';
  return 'methodology card';
}

function sourceTag(facts: Fundamentals, engine: BriefEngine): string {
  const filing =
    facts.form && facts.fiscalYear
      ? `${facts.form}${facts.fiscalPeriod ? ` ${facts.fiscalPeriod}` : ''} FY${facts.fiscalYear}${
          facts.periodKind === 'interim' ? ' interim' : ''
        }`
      : facts.error
        ? `Filings incomplete (${facts.error})`
        : 'Desk facts on file';
  return `${filing} · ${engineLabel(engine)} · not a live quote`;
}

export type WriteBriefOpts = {
  master: Master;
  subject: string;
  facts: Fundamentals;
  question: string;
  kind: BriefKind;
  crypto: CryptoSnapshot | null;
  privateFacts?: PrivateFacts | null;
  plan: PlanId;
  handoffNotes?: string;
  /** Shared news layer — one scan per report, injected into every seat. */
  news?: NewsDigest | null;
  /**
   * Optional pre-persona research-prep block (fundamentals/sentiment/valuation).
   * Injected as CONTEXT only — never averaged into a buy score.
   */
  researchPrepBlock?: string;
};

export async function writeLlmBrief(opts: WriteBriefOpts): Promise<WrittenBrief> {
  const { master, subject, facts, question, kind, crypto, privateFacts, plan, news } = opts;
  const fallbackNote = hasDeepseekKey()
    ? 'DeepSeek fallback — methodology card'
    : 'DeepSeek not configured — methodology card';

  const pack = getSourcePack(master.slug);
  const packBuilt =
    pack &&
    (await buildPackContextAsync({
      slug: master.slug,
      question,
      subject,
      fundamentals: kind === 'private' ? null : facts,
      extraText: [opts.handoffNotes, news?.bullets?.join(' ')].filter(Boolean).join(' '),
    }));
  const packContext = packBuilt?.block ?? '';
  const packEvidence = packBuilt?.evidence ?? null;

  if (!hasDeepseekKey()) {
    return templateBrief(master, subject, facts, question, kind, crypto, fallbackNote, packEvidence);
  }

  const persona = getPersona(master.slug);
  const lane = persona?.modelLane ?? (master.group === 'debate' ? 'debate' : master.group === 'exit' ? 'verdict' : 'card');
  const thinking = lane !== 'card';
  const effort = thinking ? (plan === 'partners' ? 'max' : 'high') : undefined;
  const timeoutMs = thinking ? 55_000 : 22_000;
  const maxTokens = thinking ? 2800 : 1800;

  const hard = persona?.hardRules?.slice(0, 3).map((r, i) => `${i + 1}. ${r}`).join('\n') ?? '';
  const looks = persona?.looksAt?.slice(0, 4).map((r) => `- ${r}`).join('\n') ?? '';
  const kills = persona?.killsThesisIf?.slice(0, 3).map((r) => `- ${r}`).join('\n') ?? '';
  const never = persona?.neverSays?.slice(0, 4).map((r) => `- ${r}`).join('\n') ?? '';

  const system = [
    persona?.systemPrompt ?? `You are simulating ${master.nameEn}'s public method for Agents61.`,
    COMPLIANCE_BLOCK,
    '',
    REPORT_DIG_STANDARD,
    '',
    `VOICE: ${persona?.voice ?? master.era}`,
    `OUTPUT STYLE: ${persona?.outputStyle ?? 'Concrete desk memo. Numbers first.'}`,
    hard ? `HARD RULES:\n${hard}` : '',
    looks ? `LOOKS AT:\n${looks}` : '',
    kills ? `KILLS THESIS IF:\n${kills}` : '',
    never ? `NEVER SAYS:\n${never}` : '',
    '',
    'DESK OUTPUT — reply with ONLY this JSON object, no markdown fences:',
    '{',
    '  "stance": "constructive|cautious|skeptical|inconclusive",',
    '  "looksAt": "name the metrics you actually used AND the numbers from FACTS (e.g. ROE 18%, P/E 41)",',
    '  "thesis": "2-4 sentences in THIS master\'s spoken voice — a real judgment, not brochure copy",',
    '  "why": "tie stance to THIS method + at least two FACTS numbers + what bar they clear or miss (e.g. D/E 0.11 vs distress >2.5)",',
    '  "finding": "Write like a short IC article (4-7 short paragraphs as ONE string). Structure: (1) method question this seat answers (2) numbers on file with thresholds — why pass/fail (3) what the method demands next (4) kill-shots or pendulum if debate/cycle (5) end with underwrite frame. Cite FACTS. If a SOURCE PACK checklist note is present, explain it in prose. Never invent numbers.",',
    '  "risks": "2-3 concrete risks with numbers or mechanisms — not generic market risk",',
    '  "wouldChangeMind": "one crisp falsifier with a measurable trigger",',
    '  "underwriteFrame": "worth_further_homework|pass_for_now|insufficient_facts"',
    '}',
    'English only. Cite FACTS. If a number is absent, say "not on file." Do not invent news headlines. When a NEWS LAYER block is present you may cite it, attributed as unverified news — never merge it into FACTS numbers.',
    'Forbidden: "you should buy/sell", target prices as orders, calendar tips ("buy Monday"), averaging other seats. You may state method-implied horizons (e.g. decade hold test) and entry/exit *conditions* as research discipline.',
  ]
    .filter(Boolean)
    .join('\n');

  const user = [
    `QUESTION: ${question}`,
    `SUBJECT: ${subject}`,
    `DOMAIN: ${kind}`,
    `SEAT: ${master.nameEn} · ${master.role} · pipeline group ${master.group}`,
    `SIGNATURE MOVE: ${master.signature}`,
    opts.handoffNotes
      ? `MODE: division of labor. You may read earlier pipeline notes below. Still apply YOUR test only. Peers in your group stay silent.\n\nUPSTREAM NOTES:\n${opts.handoffNotes}`
      : 'MODE: isolated. You cannot see other masters. Write alone like a real IC memo.',
    '',
    'FACTS (ground truth for this run — do not invent beyond this block):',
    kind === 'private' && privateFacts
      ? privateFactsBlock(privateFacts)
      : factsBlock(facts),
    kind === 'crypto' ? `\nCRYPTO SNAPSHOT:\n${cryptoBlock(crypto)}` : '',
    news ? `\n${newsBlock(news)}` : '',
    opts.researchPrepBlock ? `\n${opts.researchPrepBlock}` : '',
    packContext ? `\n${packContext}` : '',
    '',
    'Write like a short investment-committee article for THIS seat only. If SOURCE PACK checklist lines include [PASS]/[FAIL] with numbers, explain those bars in prose (what printed, what bar it clears or misses). CONTEXT/SOURCE PACK blocks are aids — not orders and not a composite rating.',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const { content, model } = await deepseekChat({
      lane,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      thinking,
      effort,
      timeoutMs,
      maxTokens,
      temperature: thinking ? undefined : 0.35,
    });
    const fields = parseFields(content);
    const looksAt =
      fields.looksAt || persona?.looksAt?.[0] || master.methodology.split('.')[0] || master.role;
    const engine: BriefEngine = model;
    const frameLine =
      fields.underwriteFrame.includes('pass')
        ? 'Underwrite frame: Pass for now.'
        : fields.underwriteFrame.includes('insufficient')
          ? 'Underwrite frame: Insufficient facts.'
          : 'Underwrite frame: Worth further homework.';
    const finding =
      fields.finding.includes('Underwrite frame') || fields.finding.includes('Worth further')
        ? fields.finding
        : `${fields.finding}\n\n${frameLine}`;
    return {
      slug: master.slug,
      nameEn: master.nameEn,
      role: master.role,
      group: master.group,
      stance: fields.stance,
      looksAt,
      thesis: fields.thesis,
      why: fields.why,
      finding,
      risks: fields.risks,
      wouldChangeMind: fields.wouldChangeMind.startsWith('This seat')
        ? fields.wouldChangeMind
        : `This seat flips if: ${fields.wouldChangeMind}`,
      sourceLine: sourceTag(facts, engine),
      isolated: true,
      engine,
      ...(packEvidence ? { packEvidence } : {}),
    };
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'DeepSeek call failed';
    console.error(`[write-brief] ${master.slug} fallback: ${reason}`);
    return templateBrief(master, subject, facts, question, kind, crypto, fallbackNote, packEvidence);
  }
}

export function concurrencyForPlan(plan: PlanId): number {
  if (plan === 'partners') return 6;
  if (plan === 'committee') return 5;
  return 4;
}
