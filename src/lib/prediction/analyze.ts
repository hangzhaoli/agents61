/**
 * Multi-agent prediction research — P0.
 * Template agents always run.
 * Paid / demo desks: news layer + DeepSeek Pro Prediction Clerk when keyed.
 * Research simulation only — not betting advice, no trade execution.
 */

import { deepseekChat, hasDeepseekKey } from '@/lib/llm/deepseek';
import { getEventNewsDigest, newsBlock } from '@/lib/llm/news-scan';
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

function templateAgents(market: PredictionMarket, newsBullets: string[]): PredictionAgentNote[] {
  const m = market.marketProbability;
  const seed = hashSeed(market.id + market.question);
  const drift = (seed % 17) - 8; // -8..+8
  const polymarketUrl = market.url;
  const newsSummary =
    newsBullets.length > 0
      ? `News layer (unverified): ${newsBullets.slice(0, 3).join(' | ')}`
      : `Narrative around “${market.question.slice(0, 80)}” is active on public wires. Treat headlines as unverified until tied to a resolution criterion. Recent volume (${market.volumeLabel}) suggests the story is priced, not ignored.`;

  const notes: PredictionAgentNote[] = [
    {
      id: 'news',
      name: 'News Agent',
      role: 'Latest headlines & narrative shift',
      summary: newsSummary,
      impliedProbability: clamp(m + drift * 0.4),
      sources: [
        { title: 'Polymarket market page', url: polymarketUrl },
        {
          title: 'Google News search (query)',
          url: `https://news.google.com/search?q=${encodeURIComponent(market.question)}`,
        },
      ],
    },
    {
      id: 'data',
      name: 'Data Agent',
      role: 'Hard numbers on file',
      summary: `Market YES ≈ ${m}%. Volume ${market.volumeLabel}. Close window: ${market.endDateLabel}. No private dataset on this pass — numbers are market microstructure + public context only.`,
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
        {
          title: 'Reference class thinking (overview)',
          url: 'https://en.wikipedia.org/wiki/Reference_class_forecasting',
        },
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
        'Model risk: template/LLM research can sound calibrated while missing a settlement edge case. Position risk is out of scope (no trading). Treat Probability Gap as a research prompt, not a bet size.',
      sources: [{ title: 'Agents61 disclaimer', url: 'https://agents61.com/disclaimer' }],
    },
  ];
  return notes;
}

function synthesizeTemplate(
  market: PredictionMarket,
  agents: PredictionAgentNote[],
  newsBullets: string[]
): StrategyReport {
  const implied = agents
    .map((a) => a.impliedProbability)
    .filter((n): n is number => typeof n === 'number');
  const avg = implied.reduce((a, b) => a + b, 0) / Math.max(1, implied.length);
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

  const bullEvidence = [
    `Market still assigns ${market.marketProbability}% to YES with ${market.volumeLabel} volume — the path is considered live.`,
    agents.find((a) => a.id === 'domain')?.summary ?? 'Domain path to YES remains plausible.',
    'Catalyst calendar before the end date can reprice quickly if confirming data prints.',
  ];
  const bearEvidence = [
    agents.find((a) => a.id === 'red-team')?.summary ?? 'Red team flags settlement and narrative double-count risk.',
    agents.find((a) => a.id === 'contrarian')?.summary ?? 'Contrarian path to NO is under-discussed when YES is trendy.',
    'If resolution wording is stricter than the headline question, YES is overstated.',
  ];
  const invalidationConditions = [
    'Settlement source resolves on a technicality Agents61 underweighted.',
    'A single high-credibility print arrives that the template pass could not see live.',
    'Market mid was already incorporating private or faster information.',
  ];
  const confFinal: Confidence = Math.abs(gap) >= 15 ? 'High' : confidence;
  const liquidityRisk: ResolutionRisk =
    market.volumeUsd < 50_000 ? 'High' : market.volumeUsd < 500_000 ? 'Medium' : 'Low';
  const informationRisk: ResolutionRisk = newsBullets.length >= 2 ? 'Low' : newsBullets.length === 1 ? 'Medium' : 'High';
  const eventRisk: ResolutionRisk =
    market.category === 'geopolitics' || market.category === 'politics' ? 'High' : 'Medium';
  const overallRisk: ResolutionRisk =
    [resolutionRisk, liquidityRisk, informationRisk, eventRisk].includes('High')
      ? 'High'
      : [resolutionRisk, liquidityRisk, informationRisk, eventRisk].includes('Medium')
        ? 'Medium'
        : 'Low';

  const yesProb = clamp(agents61 + Math.max(8, spread));
  const noProb = clamp(agents61 - Math.max(8, spread));
  const whyMarketMayBeRight = [
    `Live mid ${market.marketProbability}% is backed by ${market.volumeLabel} volume — informed flow may already be priced.`,
    agents.find((a) => a.id === 'market')?.summary ?? 'Market microstructure may embed faster information than this research pass.',
    'If settlement rules match the headline question tightly, crowd calibration is more trustworthy.',
  ];

  return {
    marketId: market.id,
    marketQuestion: market.question,
    marketProbability: market.marketProbability,
    agents61Probability: agents61,
    probabilityGap: gap,
    confidence: confFinal,
    probabilityRange: [lo, hi],
    whyDisagree: whyDisagree.slice(0, 3),
    whyMarketMayBeWrong: whyDisagree.slice(0, 3),
    whyMarketMayBeRight,
    bullEvidence,
    bearEvidence,
    keyCatalysts: [
      `Official data / decisions before ${market.endDateLabel}`,
      'Major headline that changes the settlement-relevant fact pattern',
      'Liquidity shock on Polymarket that moves mid without new information',
    ],
    whatCouldMakeUsWrong: invalidationConditions,
    invalidationConditions,
    scenarios: {
      yes: {
        probability: yesProb,
        reason: 'Confirming catalysts land before the end date and resolution wording matches the intuitive YES path.',
      },
      base: {
        probability: agents61,
        reason: 'Central research blend of base rate, market mid, and red-team haircut on this pass.',
      },
      no: {
        probability: noProb,
        reason: 'Settlement ambiguity or missing catalyst keeps YES from clearing the resolution bar.',
      },
    },
    risks: {
      resolution: resolutionRisk,
      liquidity: liquidityRisk,
      information: informationRisk,
      event: eventRisk,
      overall: overallRisk,
    },
    resolutionCheck: {
      source: market.url,
      deadline: market.endDateLabel,
      ambiguity: resolutionRisk,
      edgeCases: [
        'Headline question ≠ exact settlement criterion',
        'Data source named in rules is delayed or contested',
        'Partial / technical outcomes that map awkwardly to YES/NO',
      ],
      summary:
        agents.find((a) => a.id === 'resolution')?.summary ??
        'Verify settlement source and ambiguity before treating any gap as edge.',
    },
    resolutionRisk,
    executiveSummary:
      gap === 0
        ? `Agents61 ≈ market mid (${market.marketProbability}%) on “${market.question.slice(0, 100)}”. No strong mispricing claim on this pass (${confFinal} confidence).`
        : `Agents61 ${agents61}% vs market ${market.marketProbability}% (gap ${gap > 0 ? '+' : ''}${gap}%) on “${market.question.slice(0, 90)}”. ${confFinal} confidence; resolution risk ${resolutionRisk}.`,
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
    newsBullets: newsBullets.length ? newsBullets : undefined,
  };
}

async function maybeLlmRefine(
  market: PredictionMarket,
  draft: StrategyReport,
  newsBullets: string[]
): Promise<StrategyReport> {
  if (!hasDeepseekKey()) return draft;
  try {
    const newsSection =
      newsBullets.length > 0
        ? newsBlock({
            subject: market.question.slice(0, 40),
            bullets: newsBullets,
            fetchedAt: new Date().toISOString(),
            source: 'tavily',
          })
        : 'NEWS LAYER: unavailable on this pass — do not invent headlines.';

    const { content } = await deepseekChat({
      lane: 'verdict',
      thinking: true,
      effort: 'high',
      timeoutMs: 55_000,
      maxTokens: 2200,
      messages: [
        {
          role: 'system',
          content: `You are the Agents61 Prediction Clerk — a research simulation clerk, not a bookie.
Rules:
- Never say "you should bet/buy/sell YES/NO", never give position size or Kelly fractions as instructions.
- Calibrate agents61Probability using: base rates, resolution wording risk, and the news layer (unverified).
- Prefer narrower confidence when resolution text is ambiguous or news is thin.
- Probability Gap = Agents61 − Polymarket mid; explain disagreement in research terms.
- English only. Return ONLY JSON:
{
  "agents61Probability": number 1-99,
  "confidence": "High"|"Medium"|"Low",
  "probabilityRange": [low, high],
  "executiveSummary": string,
  "whyDisagree": [string, string, string],
  "whyMarketMayBeWrong": [string, string, string],
  "whyMarketMayBeRight": [string, string, string],
  "bullEvidence": [string, string, string],
  "bearEvidence": [string, string, string],
  "keyCatalysts": [string, string, string],
  "whatCouldMakeUsWrong": [string, string, string],
  "invalidationConditions": [string, string, string],
  "scenarios": {
    "yes": { "probability": number, "reason": string },
    "base": { "probability": number, "reason": string },
    "no": { "probability": number, "reason": string }
  },
  "risks": {
    "resolution": "Low"|"Medium"|"High",
    "liquidity": "Low"|"Medium"|"High",
    "information": "Low"|"Medium"|"High",
    "event": "Low"|"Medium"|"High",
    "overall": "Low"|"Medium"|"High"
  },
  "resolutionCheck": {
    "source": string,
    "deadline": string,
    "ambiguity": "Low"|"Medium"|"High",
    "edgeCases": [string, string, string],
    "summary": string
  },
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
            url: market.url,
            newsLayer: newsSection,
            draft: {
              agents61Probability: draft.agents61Probability,
              probabilityGap: draft.probabilityGap,
              confidence: draft.confidence,
              probabilityRange: draft.probabilityRange,
              executiveSummary: draft.executiveSummary,
              whyDisagree: draft.whyDisagree,
              whyMarketMayBeWrong: draft.whyMarketMayBeWrong,
              whyMarketMayBeRight: draft.whyMarketMayBeRight,
              invalidationConditions: draft.invalidationConditions,
              scenarios: draft.scenarios,
              risks: draft.risks,
              resolutionCheck: draft.resolutionCheck,
              resolutionRisk: draft.resolutionRisk,
            },
            agentNotes: draft.agentNotes.map((a) => ({
              id: a.id,
              name: a.name,
              summary: a.summary,
              p: a.impliedProbability,
            })),
          }),
        },
      ],
    });
    const start = content.indexOf('{');
    const end = content.lastIndexOf('}');
    if (start < 0 || end <= start) return draft;
    const parsed = JSON.parse(content.slice(start, end + 1)) as Partial<StrategyReport> & {
      scenarios?: StrategyReport['scenarios'];
      risks?: StrategyReport['risks'];
      resolutionCheck?: StrategyReport['resolutionCheck'];
    };
    const p = clamp(Number(parsed.agents61Probability ?? draft.agents61Probability));
    const range = Array.isArray(parsed.probabilityRange)
      ? ([clamp(Number(parsed.probabilityRange[0])), clamp(Number(parsed.probabilityRange[1]))] as [
          number,
          number,
        ])
      : draft.probabilityRange;
    const whyDisagree = Array.isArray(parsed.whyDisagree)
      ? parsed.whyDisagree.slice(0, 3).map(String)
      : draft.whyDisagree;
    const whyWrong = Array.isArray(parsed.whyMarketMayBeWrong)
      ? parsed.whyMarketMayBeWrong.slice(0, 5).map(String)
      : Array.isArray(parsed.whyDisagree)
        ? whyDisagree
        : draft.whyMarketMayBeWrong;
    const whyRight = Array.isArray(parsed.whyMarketMayBeRight)
      ? parsed.whyMarketMayBeRight.slice(0, 5).map(String)
      : Array.isArray(parsed.bearEvidence)
        ? parsed.bearEvidence.slice(0, 3).map(String)
        : draft.whyMarketMayBeRight;
    const invalidation = Array.isArray(parsed.invalidationConditions)
      ? parsed.invalidationConditions.slice(0, 5).map(String)
      : Array.isArray(parsed.whatCouldMakeUsWrong)
        ? parsed.whatCouldMakeUsWrong.slice(0, 5).map(String)
        : draft.invalidationConditions;
    const whatWrong = Array.isArray(parsed.whatCouldMakeUsWrong)
      ? parsed.whatCouldMakeUsWrong.slice(0, 5).map(String)
      : invalidation;

    const scenarios = mergeScenarios(draft.scenarios, parsed.scenarios, p);
    const risks = mergeRisks(draft.risks, parsed.risks, parsed.resolutionRisk as ResolutionRisk | undefined);
    const resolutionCheck = mergeResolutionCheck(draft.resolutionCheck, parsed.resolutionCheck);

    return {
      ...draft,
      agents61Probability: p,
      probabilityGap: gapOf(p, market.marketProbability),
      confidence: (parsed.confidence as Confidence) || draft.confidence,
      probabilityRange: range[0] <= range[1] ? range : draft.probabilityRange,
      executiveSummary: String(parsed.executiveSummary || draft.executiveSummary),
      whyDisagree,
      whyMarketMayBeWrong: whyWrong,
      whyMarketMayBeRight: whyRight,
      bullEvidence: Array.isArray(parsed.bullEvidence)
        ? parsed.bullEvidence.slice(0, 5).map(String)
        : draft.bullEvidence,
      bearEvidence: Array.isArray(parsed.bearEvidence)
        ? parsed.bearEvidence.slice(0, 5).map(String)
        : draft.bearEvidence,
      keyCatalysts: Array.isArray(parsed.keyCatalysts)
        ? parsed.keyCatalysts.slice(0, 5).map(String)
        : draft.keyCatalysts,
      whatCouldMakeUsWrong: whatWrong,
      invalidationConditions: invalidation,
      scenarios,
      risks,
      resolutionCheck,
      resolutionRisk:
        (parsed.resolutionRisk as ResolutionRisk) || risks.overall || draft.resolutionRisk,
      clerkNote: String(parsed.clerkNote || draft.clerkNote),
      engine: 'deepseek',
      newsBullets: newsBullets.length ? newsBullets : draft.newsBullets,
      analyzedAt: new Date().toISOString(),
    };
  } catch {
    return draft;
  }
}

function mergeScenarios(
  draft: StrategyReport['scenarios'],
  parsed: StrategyReport['scenarios'] | undefined,
  agents61: number
): StrategyReport['scenarios'] {
  if (!parsed || typeof parsed !== 'object') return { ...draft, base: { ...draft.base, probability: agents61 } };
  const branch = (
    key: 'yes' | 'base' | 'no',
    fallbackProb: number
  ): StrategyReport['scenarios']['yes'] => {
    const b = parsed[key];
    if (b && typeof b === 'object') {
      return {
        probability: clamp(Number(b.probability ?? fallbackProb)),
        reason: String(b.reason || draft[key].reason),
      };
    }
    return { ...draft[key], probability: key === 'base' ? agents61 : draft[key].probability };
  };
  return {
    yes: branch('yes', draft.yes.probability),
    base: branch('base', agents61),
    no: branch('no', draft.no.probability),
  };
}

function mergeRisks(
  draft: StrategyReport['risks'],
  parsed: StrategyReport['risks'] | undefined,
  resolutionRisk?: ResolutionRisk
): StrategyReport['risks'] {
  const pick = (v: unknown, fallback: ResolutionRisk): ResolutionRisk =>
    v === 'Low' || v === 'Medium' || v === 'High' ? v : fallback;
  if (!parsed || typeof parsed !== 'object') {
    return resolutionRisk ? { ...draft, resolution: resolutionRisk, overall: resolutionRisk } : draft;
  }
  return {
    resolution: pick(parsed.resolution, resolutionRisk ?? draft.resolution),
    liquidity: pick(parsed.liquidity, draft.liquidity),
    information: pick(parsed.information, draft.information),
    event: pick(parsed.event, draft.event),
    overall: pick(parsed.overall, resolutionRisk ?? draft.overall),
  };
}

function mergeResolutionCheck(
  draft: StrategyReport['resolutionCheck'],
  parsed: StrategyReport['resolutionCheck'] | undefined
): StrategyReport['resolutionCheck'] {
  if (!draft && !parsed) return undefined;
  const base = draft ?? {
    source: '',
    deadline: '',
    ambiguity: 'Medium' as ResolutionRisk,
    edgeCases: [],
    summary: '',
  };
  if (!parsed || typeof parsed !== 'object') return base;
  return {
    source: String(parsed.source || base.source),
    deadline: String(parsed.deadline || base.deadline),
    ambiguity:
      parsed.ambiguity === 'Low' || parsed.ambiguity === 'Medium' || parsed.ambiguity === 'High'
        ? parsed.ambiguity
        : base.ambiguity,
    edgeCases: Array.isArray(parsed.edgeCases)
      ? parsed.edgeCases.slice(0, 5).map(String)
      : base.edgeCases,
    summary: String(parsed.summary || base.summary),
  };
}

export type AnalyzeOptions = {
  /** Paid / demo: fetch news + Pro clerk when keys exist. Free trial: template only. */
  useClerk?: boolean;
};

export async function analyzePredictionMarket(
  market: PredictionMarket,
  opts: AnalyzeOptions = {}
): Promise<StrategyReport> {
  const useClerk = Boolean(opts.useClerk);
  let newsBullets: string[] = [];
  if (useClerk) {
    const digest = await getEventNewsDigest(market.question);
    newsBullets = digest?.bullets ?? [];
  }

  const agents = templateAgents(market, newsBullets);
  const draft = synthesizeTemplate(market, agents, newsBullets);
  const report = useClerk ? await maybeLlmRefine(market, draft, newsBullets) : draft;
  setCachedReport(report);
  return report;
}

/** Fast template-only seed so Top Gaps is not empty on first paint. */
export function seedTemplateReport(market: PredictionMarket): StrategyReport {
  const existing = getCachedReport(market.id);
  if (existing) return existing;
  const agents = templateAgents(market, []);
  const report = synthesizeTemplate(market, agents, []);
  setCachedReport(report);
  return report;
}

/** Exported for UI labels — agent roster is fixed. */
export function predictionAgentRoster(): typeof AGENTS {
  return AGENTS;
}
