/**
 * Multi-agent prediction research — P0.
 * Template agents always run; DeepSeek (when keyed) consolidates the clerk probability.
 * Research simulation only — not betting advice, no trade execution.
 */

import { deepseekChat, hasDeepseekKey } from '@/lib/llm/deepseek';
import { getCachedReport, setCachedReport } from './cache';
import type { PredictionMarket, PredictionAgentNote, StrategyReport, Confidence, ResolutionRisk } from './types';
import { gapOf } from './types';

const AGENTS: Array<{ id: PredictionAgentNote['id']; name: string; role: string }> = [
  { id: 'news', name: 'News Agent', role: 'Latest headlines & narrative shift' },
  { id: 'data', name: 'Data Agent', role: 'Hard numbers on file' },
  { id: 'base-rate', name: 'Base Rate Agent', role: 'Historical / class base rates' },
  { id: 'domain', name: 'Domain Expert', role: 'Category specialist lens' },
  { id: 'market', name: 'Market Agent', role: 'Polymarket price & volume read' },
  { id: 'bayesian', name: 'Bayesian Agent', role: 'Likelihood update vs prior' },
  { id: 'contrarian', name: 'Contrarian Agent', role: 'Why the crowd may be wrong' },
  { id: 'red-team', name: 'Red Team', role: 'Hunt judgment errors' },
  { id: 'resolution', name: 'Resolution Agent', role: 'Settlement rules & ambiguity' },
  { id: 'risk', name: 'Risk Agent', role: 'Tail paths & model risk' },
];

function clamp(n: number, lo = 1, hi = 99): number {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function domainLens(category: string): string {
  switch (category) {
    case 'macro':
      return 'Macro: path of policy, growth, and inflation prints matter more than vibes.';
    case 'crypto':
      return 'Crypto: liquidity regimes and reflexive flows can dominate fundamentals short-term.';
    case 'politics':
      return 'Politics: polls, turnout models, and resolution wording (who counts as winner) dominate.';
    case 'tech':
      return 'Tech: shipping milestones and regulatory calendars beat brand narratives.';
    case 'geopolitics':
      return 'Geopolitics: fog-of-war and settlement ambiguity are first-class risks.';
    case 'policy':
      return 'Policy: enforcement timing and legal definitions drive YES/NO more than headlines.';
    default:
      return 'General: separate base rates from story momentum.';
  }
}

function templateAgents(market: PredictionMarket): PredictionAgentNote[] {
  const m = market.marketProbability;
  const seed = hashSeed(market.id + market.question);
  const drift = ((seed % 17) - 8); // -8..+8
  const polymarketUrl = market.url;

  const notes: PredictionAgentNote[] = [
    {
      id: 'news',
      name: 'News Agent',
      role: 'Latest headlines & narrative shift',
      summary: `Narrative around “${market.question.slice(0, 80)}” is active on public wires. Treat headlines as unverified until tied to a resolution criterion. Recent volume ($${Math.round(market.volumeUsd / 1e6)}M class) suggests the story is priced, not ignored.`,
      impliedProbability: clamp(m + drift * 0.4),
      sources: [
        { title: 'Polymarket market page', url: polymarketUrl },
        { title: 'Google News search (query)', url: `https://news.google.com/search?q=${encodeURIComponent(market.question)}` },
      ],
    },
    {
      id: 'data',
      name: 'Data Agent',
      role: 'Hard numbers on file',
      summary: `Market YES ≈ ${m}%. Volume ${market.volumeLabel}. Close window: ${market.endDateLabel}. No private dataset on this MVP pass — numbers are market microstructure + public context only.`,
      impliedProbability: clamp(m),
      sources: [{ title: 'Polymarket (Gamma/public)', url: polymarketUrl }],
    },
    {
      id: 'base-rate',
      name: 'Base Rate Agent',
      role: 'Historical / class base rates',
      summary: `Class base rate for ${market.category} events is rarely equal to the live mid. Start near a conservative class prior (~${clamp(40 + (seed % 21) - 10)}%), then update with market and domain evidence — do not anchor only on the tape.`,
      impliedProbability: clamp(40 + (seed % 21) - 10),
      sources: [
        { title: 'Reference class thinking (overview)', url: 'https://en.wikipedia.org/wiki/Reference_class_forecasting' },
      ],
    },
    {
      id: 'domain',
      name: 'Domain Expert',
      role: 'Category specialist lens',
      summary: domainLens(market.category),
      impliedProbability: clamp(m + drift * 0.6),
      sources: [{ title: 'Polymarket event', url: polymarketUrl }],
    },
    {
      id: 'market',
      name: 'Market Agent',
      role: 'Polymarket price & volume read',
      summary: `YES mid ${m}% with ${market.volumeLabel} notional. Crowded tape ≠ calibrated probability; thin books exaggerate gaps. Use mid as a prior, not a truth.`,
      impliedProbability: clamp(m),
      sources: [{ title: 'Polymarket', url: polymarketUrl }],
    },
    {
      id: 'bayesian',
      name: 'Bayesian Agent',
      role: 'Likelihood update vs prior',
      summary: `Blend base-rate prior with market likelihood. Posterior sketch ≈ ${clamp(m * 0.55 + (40 + (seed % 21) - 10) * 0.45 + drift * 0.3)}% before red-team haircut.`,
      impliedProbability: clamp(m * 0.55 + (40 + (seed % 21) - 10) * 0.45 + drift * 0.3),
      sources: [{ title: 'Bayes theorem (overview)', url: 'https://en.wikipedia.org/wiki/Bayes%27_theorem' }],
    },
    {
      id: 'contrarian',
      name: 'Contrarian Agent',
      role: 'Why the crowd may be wrong',
      summary:
        m >= 55
          ? 'Crowd is YES-heavy — ask what would have to be true for NO, and whether that path is underpriced.'
          : m <= 40
            ? 'Crowd is NO-leaning — ask whether base rates or catalysts are underweighted on YES.'
            : 'Market is near coin-flip — edge, if any, is in resolution wording and catalyst timing, not direction slogans.',
      impliedProbability: clamp(100 - m + drift * 0.2),
      sources: [{ title: 'Polymarket', url: polymarketUrl }],
    },
    {
      id: 'red-team',
      name: 'Red Team',
      role: 'Hunt judgment errors',
      summary:
        'Kill-shots: (1) resolution text does not match the intuitive question, (2) data used is stale vs end date, (3) narrative double-counts the same catalyst already in the mid.',
      impliedProbability: clamp(m - Math.abs(drift) * 0.5),
      sources: [{ title: 'Polymarket rules on market page', url: polymarketUrl }],
    },
    {
      id: 'resolution',
      name: 'Resolution Agent',
      role: 'Settlement rules & ambiguity',
      summary: market.description
        ? `Resolution draft on file: “${market.description.slice(0, 220)}${market.description.length > 220 ? '…' : ''}” — score ambiguity before trusting any edge.`
        : 'Resolution text thin on this pass — elevate Resolution Risk until the exact settlement source is verified on Polymarket.',
      sources: [{ title: 'Market resolution text', url: polymarketUrl }],
    },
    {
      id: 'risk',
      name: 'Risk Agent',
      role: 'Tail paths & model risk',
      summary:
        'Model risk: template/LLM research can sound calibrated while missing a settlement edge case. Position risk is out of scope for this MVP (no trading). Treat Probability Gap as a research prompt, not a bet size.',
      sources: [{ title: 'Agents61 disclaimer', url: 'https://agents61.com/disclaimer' }],
    },
  ];
  return notes;
}

function synthesizeTemplate(market: PredictionMarket, agents: PredictionAgentNote[]): StrategyReport {
  const implied = agents
    .map((a) => a.impliedProbability)
    .filter((n): n is number => typeof n === 'number');
  const avg = implied.reduce((a, b) => a + b, 0) / Math.max(1, implied.length);
  // Pull slightly from market to avoid wild gaps on thin info
  const agents61 = clamp(avg * 0.7 + market.marketProbability * 0.3);
  const gap = gapOf(agents61, market.marketProbability);
  const spread = 6 + (hashSeed(market.id) % 6);
  const lo = clamp(agents61 - spread);
  const hi = clamp(agents61 + spread);
  const confidence: Confidence = Math.abs(gap) >= 12 ? 'Medium' : Math.abs(gap) >= 6 ? 'Medium' : 'Low';
  const resolutionRisk: ResolutionRisk =
    market.description.length < 80 ? 'High' : market.category === 'geopolitics' ? 'High' : 'Medium';

  const whyDisagree =
    gap === 0
      ? ['Agents61 is near the market mid on this pass — no strong mispricing claim.']
      : [
          gap > 0
            ? 'Base-rate / domain blend sits above the live mid — market may be overweighting recent NO narrative.'
            : 'Red-team and resolution ambiguity pull Agents61 below the live mid — market may be overweighting YES story momentum.',
          'Bayesian blend refuses to fully anchor on Polymarket mid; crowd volume ≠ calibration.',
          domainLens(market.category),
        ];

  return {
    marketId: market.id,
    marketQuestion: market.question,
    marketProbability: market.marketProbability,
    agents61Probability: agents61,
    probabilityGap: gap,
    confidence: Math.abs(gap) >= 15 ? 'High' : confidence,
    probabilityRange: [lo, hi],
    whyDisagree: whyDisagree.slice(0, 3),
    bullEvidence: [
      `Market still assigns ${market.marketProbability}% to YES with ${market.volumeLabel} volume — the path is considered live.`,
      agents.find((a) => a.id === 'domain')?.summary ?? 'Domain path to YES remains plausible.',
      'Catalyst calendar before the end date can reprice quickly if confirming data prints.',
    ],
    bearEvidence: [
      agents.find((a) => a.id === 'red-team')?.summary ?? 'Red team flags settlement and narrative double-count risk.',
      agents.find((a) => a.id === 'contrarian')?.summary ?? 'Contrarian path to NO is under-discussed when YES is trendy.',
      'If resolution wording is stricter than the headline question, YES is overstated.',
    ],
    keyCatalysts: [
      `Official data / decisions before ${market.endDateLabel}`,
      'Major headline that changes the settlement-relevant fact pattern',
      'Liquidity shock on Polymarket that moves mid without new information',
    ],
    whatCouldMakeUsWrong: [
      'Settlement source resolves on a technicality Agents61 underweighted.',
      'A single high-credibility print arrives that the template pass could not see live.',
      'Market mid was already incorporating private or faster information.',
    ],
    resolutionRisk,
    sources: [
      { title: 'Polymarket market', url: market.url },
      { title: 'Agents61 disclaimer', url: 'https://agents61.com/disclaimer' },
      ...agents.flatMap((a) => a.sources).slice(0, 6),
    ],
    agentNotes: agents,
    clerkNote:
      'Prediction Clerk stacks isolated research notes into a probability — not a bet ticket. No wallet, no order routing.',
    analyzedAt: new Date().toISOString(),
    engine: 'template',
  };
}

async function maybeLlmRefine(market: PredictionMarket, draft: StrategyReport): Promise<StrategyReport> {
  if (!hasDeepseekKey()) return draft;
  try {
    const { content } = await deepseekChat({
      lane: 'verdict',
      thinking: true,
      effort: 'high',
      timeoutMs: 45_000,
      maxTokens: 1600,
      messages: [
        {
          role: 'system',
          content: `You are the Agents61 Prediction Clerk. Research simulation only — never say "you should bet/buy YES/NO", never give position size.
Return ONLY JSON:
{
  "agents61Probability": number 1-99,
  "confidence": "High"|"Medium"|"Low",
  "probabilityRange": [low, high],
  "whyDisagree": [string, string, string],
  "bullEvidence": [string, string, string],
  "bearEvidence": [string, string, string],
  "keyCatalysts": [string, string, string],
  "whatCouldMakeUsWrong": [string, string, string],
  "resolutionRisk": "Low"|"Medium"|"High",
  "clerkNote": string
}`,
        },
        {
          role: 'user',
          content: JSON.stringify({
            question: market.question,
            description: market.description,
            marketProbability: market.marketProbability,
            category: market.category,
            endDate: market.endDateLabel,
            volume: market.volumeLabel,
            draft,
            agentNotes: draft.agentNotes.map((a) => ({ id: a.id, summary: a.summary, p: a.impliedProbability })),
          }),
        },
      ],
    });
    const start = content.indexOf('{');
    const end = content.lastIndexOf('}');
    if (start < 0 || end <= start) return draft;
    const parsed = JSON.parse(content.slice(start, end + 1)) as Partial<StrategyReport>;
    const p = clamp(Number(parsed.agents61Probability ?? draft.agents61Probability));
    const range = Array.isArray(parsed.probabilityRange)
      ? ([clamp(Number(parsed.probabilityRange[0])), clamp(Number(parsed.probabilityRange[1]))] as [number, number])
      : draft.probabilityRange;
    return {
      ...draft,
      agents61Probability: p,
      probabilityGap: gapOf(p, market.marketProbability),
      confidence: (parsed.confidence as Confidence) || draft.confidence,
      probabilityRange: range[0] <= range[1] ? range : draft.probabilityRange,
      whyDisagree: Array.isArray(parsed.whyDisagree) ? parsed.whyDisagree.slice(0, 3).map(String) : draft.whyDisagree,
      bullEvidence: Array.isArray(parsed.bullEvidence) ? parsed.bullEvidence.slice(0, 5).map(String) : draft.bullEvidence,
      bearEvidence: Array.isArray(parsed.bearEvidence) ? parsed.bearEvidence.slice(0, 5).map(String) : draft.bearEvidence,
      keyCatalysts: Array.isArray(parsed.keyCatalysts) ? parsed.keyCatalysts.slice(0, 5).map(String) : draft.keyCatalysts,
      whatCouldMakeUsWrong: Array.isArray(parsed.whatCouldMakeUsWrong)
        ? parsed.whatCouldMakeUsWrong.slice(0, 5).map(String)
        : draft.whatCouldMakeUsWrong,
      resolutionRisk: (parsed.resolutionRisk as ResolutionRisk) || draft.resolutionRisk,
      clerkNote: String(parsed.clerkNote || draft.clerkNote),
      engine: 'deepseek',
      analyzedAt: new Date().toISOString(),
    };
  } catch {
    return draft;
  }
}

export async function analyzePredictionMarket(market: PredictionMarket): Promise<StrategyReport> {
  const agents = templateAgents(market);
  const draft = synthesizeTemplate(market, agents);
  const report = await maybeLlmRefine(market, draft);
  setCachedReport(report);
  return report;
}

/** Fast template-only seed so Top Gaps is not empty on first paint. */
export function seedTemplateReport(market: PredictionMarket): StrategyReport {
  const existing = getCachedReport(market.id);
  if (existing) return existing;
  const agents = templateAgents(market);
  const report = synthesizeTemplate(market, agents);
  setCachedReport(report);
  return report;
}
