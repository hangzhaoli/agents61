/**
 * Clerk assembly pass: DeepSeek V4-Pro synthesizes isolated briefs into a decision frame.
 * Does not average stances into a rating. Falls back to rule-based assembly on failure.
 */

import type { Fundamentals } from '@/lib/data/fundamentals';
import { COMPLIANCE_BLOCK } from '@/lib/personas/types';
import {
  deepseekChat,
  hasDeepseekKey,
  type BriefEngine,
} from '@/lib/llm/deepseek';
import {
  CLERK_DIG_STANDARD,
  underwriteLabel,
  type UnderwriteFrame,
} from '@/lib/llm/report-standard';
import { newsBlock, type NewsDigest } from '@/lib/llm/news-scan';
import type { Assembly, IndependentBrief } from '@/lib/research';

function briefDigest(briefs: IndependentBrief[]): string {
  return briefs
    .map(
      (b) =>
        `[${b.nameEn} · ${b.group} · ${b.stance}]\nTest: ${b.looksAt}\nThesis: ${b.thesis}\nFinding: ${b.finding.slice(0, 900)}\nFalsifier: ${b.wouldChangeMind}`
    )
    .join('\n\n');
}

function extractJson(text: string): unknown {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = (fence ? fence[1] : text).trim();
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('No JSON object');
  return JSON.parse(raw.slice(start, end + 1)) as unknown;
}

function scrub(s: string): string {
  return s.replace(/\byou should (buy|sell)\b/gi, 'this is not a recommendation to $1').trim();
}

function factsLine(facts: Fundamentals): string {
  const rows = [
    facts.entityName,
    facts.form && facts.fiscalYear
      ? `${facts.form}${facts.fiscalPeriod ? ` ${facts.fiscalPeriod}` : ''} FY${facts.fiscalYear}${
          facts.periodKind === 'interim' ? ' interim' : ''
        }`
      : null,
    facts.revenue != null ? `Revenue ${facts.revenue}` : null,
    facts.revenueYoY != null ? `Revenue YoY ${(facts.revenueYoY * 100).toFixed(1)}%` : null,
    facts.netIncome != null ? `Net income ${facts.netIncome}` : null,
    facts.roe != null ? `ROE ${(facts.roe * 100).toFixed(1)}%` : null,
    facts.pe != null ? `P/E ${facts.pe.toFixed(1)} (cached)` : facts.peNm ? 'P/E n/m' : null,
    facts.pb != null ? `P/B ${facts.pb.toFixed(2)} (cached)` : null,
    facts.ps != null ? `P/S ${facts.ps.toFixed(2)} (cached)` : null,
    facts.price != null ? `Price $${facts.price.toFixed(2)} (cached)` : null,
    facts.marketCap != null ? `Mkt cap est. ${facts.marketCap}` : null,
    facts.error,
  ].filter(Boolean);
  return rows.length ? rows.join(' · ') : 'No filing facts on this run.';
}

function mapFrame(raw: unknown): UnderwriteFrame {
  const s = String(raw ?? '')
    .toLowerCase()
    .trim();
  if (s.includes('pass')) return 'pass_for_now';
  if (s.includes('insufficient') || s.includes('thin')) return 'insufficient_facts';
  if (s.includes('split') || s.includes('judgment')) return 'split_needs_user_judgment';
  if (s.includes('homework') || s.includes('worth') || s.includes('further')) {
    return 'worth_further_homework';
  }
  return 'split_needs_user_judgment';
}

export async function enrichAssemblyWithClerk(
  base: Assembly,
  briefs: IndependentBrief[],
  facts: Fundamentals,
  news?: NewsDigest | null
): Promise<Assembly> {
  if (!hasDeepseekKey() || briefs.length === 0) return base;

  const system = [
    'You are the Agents61 clerk. You read isolated master briefs that never saw each other.',
    COMPLIANCE_BLOCK,
    '',
    'Orchestration note: the desk may run research-prep (fundamentals / sentiment / valuation heuristics) before seats write. You may reference that prep as shared context. Never average seat stances or prep layers into a buy score, star rating, or trade ticket. Seats remain isolated briefs. If the user asked only for prep, summarize facts — do not invent a committee verdict.',
    '',
    CLERK_DIG_STANDARD,
    '',
    'Reply ONLY with JSON (no markdown fences):',
    '{',
    '  "executiveSummary": "4-7 sentences. Name the fight, cite numbers, state the split, end with underwrite frame in plain English. No buy/sell language.",',
    '  "dataHighlights": ["3-6 bullets with concrete numbers from FACTS or briefs"],',
    '  "openQuestions": ["3-5 bullets: next verification steps a serious analyst would run"],',
    '  "underwriteFrame": "worth_further_homework|pass_for_now|split_needs_user_judgment|insufficient_facts",',
    '  "decisionHelp": "1-2 sentences: what has to be true to size homework capital vs walk away"',
    '}',
    'English only. Research simulation — not investment advice. Do not invent facts outside FACTS/briefs. A NEWS LAYER block, when present, is unverified web news — cite it as "news layer reports", never as filing fact.',
  ].join('\n');

  const user = [
    `QUESTION: ${base.question}`,
    `SUBJECT: ${base.ticker}`,
    `SEATS: ${base.seatCount} isolated briefs`,
    `STANCE COUNTS: constructive ${base.counts.constructive}, cautious ${base.counts.cautious}, skeptical ${base.counts.skeptical}, inconclusive ${base.counts.inconclusive}`,
    '',
    `FACTS: ${factsLine(facts)}`,
    news ? `\n${newsBlock(news)}` : '',
    '',
    'ISOLATED BRIEFS:',
    briefDigest(briefs),
  ].join('\n');

  try {
    const { content, model } = await deepseekChat({
      lane: 'verdict',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      thinking: true,
      effort: 'high',
      timeoutMs: 75_000,
      maxTokens: 1800,
    });
    const obj = extractJson(content) as Record<string, unknown>;
    const executiveSummary = scrub(String(obj.executiveSummary ?? ''));
    if (!executiveSummary || executiveSummary.length < 100) throw new Error('Summary too short');

    const dataHighlights = (Array.isArray(obj.dataHighlights) ? obj.dataHighlights : [])
      .map((x) => scrub(String(x)))
      .filter(Boolean)
      .slice(0, 6);
    const openQuestions = (Array.isArray(obj.openQuestions) ? obj.openQuestions : [])
      .map((x) => scrub(String(x)))
      .filter(Boolean)
      .slice(0, 6);
    const underwriteFrame = mapFrame(obj.underwriteFrame);
    const decisionHelp = scrub(String(obj.decisionHelp ?? '')).slice(0, 500);

    return {
      ...base,
      executiveSummary,
      dataHighlights,
      openQuestions,
      underwriteFrame,
      decisionHelp: decisionHelp || undefined,
      clerkEngine: model,
      clerkNote: `${base.clerkNote} Clerk frame: ${underwriteLabel(underwriteFrame)}. DeepSeek V4-Pro — not a buy rating.`,
    };
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'Clerk LLM failed';
    console.error(`[write-clerk] fallback: ${reason}`);
    return base;
  }
}
