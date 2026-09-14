/**
 * Kernel demo — full homepage pipeline sample (not Observer-3).
 * Pack evidence scored by live checklist/RAG. Narratives are IC articles grounded in FACTS.
 * Clerk synthesis: tally + entry/hold/exit *conditions* — research simulation, not a buy order.
 */

import { runResearchPrep, type ResearchPrep } from '@/lib/desk/research-pipeline';
import { getFundamentals, emptyFundamentals, type Fundamentals } from '@/lib/data/fundamentals';
import { getMasterBySlug, type PipelineGroup } from '@/lib/masters';
import { PIPELINE_STEPS, QUANT_LAYER } from '@/lib/pipeline';
import { buildPackContextAsync } from '@/lib/personas/modules';
import type { Assembly, BriefStance, IndependentBrief } from '@/lib/research';

export const KERNEL_DEMO_TICKER = 'NVDA';
export const KERNEL_DEMO_NAME = 'NVIDIA Corporation';
export const KERNEL_DEMO_QUESTION =
  'Run the six-step desk on NVDA: trend → cycle → selection → debate → timing → exit, plus always-on quant. Isolated articles with numbers. Clerk tallies and frames entry/hold/exit conditions. No buy button.';

const PREP_NOTES =
  'Data-center accelerators + CUDA habit; export controls and hyperscaler capex duration are the live fights. Cached filings, not a live quote.';

function fallbackNvdaFacts(): Fundamentals {
  const base = emptyFundamentals(KERNEL_DEMO_TICKER);
  return {
    ...base,
    ticker: KERNEL_DEMO_TICKER,
    entityName: KERNEL_DEMO_NAME,
    form: '10-K',
    fiscalYear: 2025,
    fiscalPeriod: 'FY',
    periodKind: 'annual',
    revenue: 130_497_000_000,
    revenueYoY: 0.114,
    revenueCagrApprox: 0.55,
    netIncome: 72_880_000_000,
    netMargin: 0.558,
    epsDiluted: 2.94,
    epsYoY: 0.12,
    equity: 79_327_000_000,
    assets: 111_601_000_000,
    longTermDebt: 8_500_000_000,
    operatingCashFlow: 64_000_000_000,
    roe: 0.69,
    debtToEquity: 0.11,
    price: 120,
    marketCap: 2_900_000_000_000,
    pe: 41,
    peNm: false,
    pb: 36,
    ps: 22,
    source: 'sec-edgar',
    fmpInternalReady: false,
    ratiosNote: 'Illustrative cached snapshot for the public kernel demo — not a live quote.',
    error: null,
  };
}

async function loadDemoFacts(): Promise<{ facts: Fundamentals; liveFilings: boolean }> {
  try {
    const facts = await getFundamentals(KERNEL_DEMO_TICKER);
    if (facts.error || facts.revenue == null) {
      return { facts: fallbackNvdaFacts(), liveFilings: false };
    }
    return { facts, liveFilings: true };
  } catch {
    return { facts: fallbackNvdaFacts(), liveFilings: false };
  }
}

function fmtPct(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return 'not on file';
  return `${(n * 100).toFixed(1)}%`;
}

function fmtN(n: number | null | undefined, d = 1): string {
  if (n == null || Number.isNaN(n)) return 'not on file';
  return n.toFixed(d);
}

export type PipelineStepKey = (typeof PIPELINE_STEPS)[number]['key'] | 'quant';

type SeatDraft = {
  slug: string;
  step: PipelineStepKey;
  stepLabel: string;
  stance: BriefStance;
  thesis: string;
  why: string;
  finding: string;
  risks: string;
  wouldChangeMind: string;
  looksAt: string;
  sourceLine: string;
};

function buildSeatDrafts(f: Fundamentals): SeatDraft[] {
  const pe = fmtN(f.pe);
  const pb = fmtN(f.pb);
  const ps = fmtN(f.ps);
  const roe = fmtPct(f.roe);
  const de = fmtN(f.debtToEquity, 2);
  const yoy = fmtPct(f.revenueYoY);
  const cagr = fmtPct(f.revenueCagrApprox);
  const nm = fmtPct(f.netMargin);
  const epsY = fmtPct(f.epsYoY);

  return [
    {
      slug: 'cathie-wood',
      step: 'trend',
      stepLabel: PIPELINE_STEPS[0]!.label,
      stance: 'constructive',
      thesis:
        'Multi-year capital is still flowing into AI compute platforms; NVDA sits on the S-curve spine, not a one-print fad — duration is the fight, not whether the theme exists.',
      why: `Trend seat: revenue still growing (${yoy} YoY; multi-year CAGR proxy ${cagr}) with NI/rev ${nm}. That is theme confirmation in the filings, not a price target. The method asks whether inference/training spend is a multi-year capital wave — not whether next quarter beats.`,
      finding: [
        `Article — Trend Research. The homepage question is “where does capital flow over the next decade?” On this file, the answer is still “into AI infrastructure,” and NVDA is the clearest listed beneficiary you can underwrite with numbers.`,
        `What the print shows: revenue YoY ${yoy}, approx multi-year revenue CAGR ${cagr}, net margin ${nm}, ROE ${roe}. Those are not moat proofs by themselves, but they are incompatible with “the theme already died.” Operating cash flow on file is strongly positive versus net income — cash is not a rumor.`,
        `What the method demands next: separate a real S-curve (customers rebuilding compute stacks) from a story stock (multiple expansion only). P/S ${ps} and P/E ${pe} already bake a long duration. Trend can stay constructive on capital flow while Selection and Timing refuse the starting price.`,
        `Underwrite frame: worth further homework on theme duration and customer concentration — not a buy ticket.`,
      ].join('\n\n'),
      risks:
        'Theme duration shortens; hyperscalers pause; a rival stack becomes good enough. High starting multiples amplify any of those.',
      wouldChangeMind:
        'Would flip if filings showed revenue and OCF rolling over together while customers publicly delayed AI capex — theme death, not a dip.',
      looksAt: `Theme duration · rev YoY ${yoy} · CAGR~ ${cagr} · P/S ${ps}`,
      sourceLine: 'Trend pack · ARK-style public method · research simulation · unaffiliated',
    },
    {
      slug: 'howard-marks',
      step: 'cycle',
      stepLabel: PIPELINE_STEPS[1]!.label,
      stance: 'cautious',
      thesis:
        'Second-level: everyone already agrees this is a great franchise. The pendulum question is what that agreement has done to prospective returns from today’s multiples.',
      why: `Cycle seat: P/E ${pe}, P/B ${pb}, P/S ${ps} with growth ${yoy}. First-level says “AI winner.” Second-level asks whether optimism is already in the price. Risk ≠ volatility; risk is permanent loss from overpaying when the crowd is sure.`,
      finding: [
        `Article — Cycle Research. Locate the pendulum before you cheer the business.`,
        `On file: starting P/E ${pe}, P/B ${pb}, P/S ${ps}. Revenue still growing (${yoy}), so this is not a value trap print — it is an optimism print. When growth is visible and multiples are elevated, prospective returns compress even if the company stays “good.”`,
        `Second-level thought: the marginal buyer needs the duration story to stay linear. A pause in hyperscaler capex would not merely “miss a quarter”; it would re-rate the assumption already paid for. Credit-market tells are secondary here; the equity itself is priced for perfection.`,
        `Underwrite frame: pass for now on price/pendulum unless multiples compress while cash generation stays intact — then the cycle seat reopens the file.`,
      ].join('\n\n'),
      risks:
        'Consensus already priced; duration assumption breaks; “good company” confuses with “good starting price.”',
      wouldChangeMind:
        'Would reopen if starting multiples compressed meaningfully while ROE/OCF stayed durable — pendulum shift with facts, not a gift-dip narrative.',
      looksAt: `Pendulum · P/E ${pe} · P/S ${ps} · second-level vs consensus`,
      sourceLine: 'Cycle pack · Oaktree memo themes · research simulation · unaffiliated',
    },
    {
      slug: 'warren-buffett',
      step: 'selection',
      stepLabel: `${PIPELINE_STEPS[2]!.label} · Value`,
      stance: 'cautious',
      thesis:
        'Understandable cash engine with light leverage — but the ten-year hold is a price test, not a brand test.',
      why: `Value seat: LT debt/equity ${de} (owner-test comfort typically wants this well below distress; our heuristic pass bar is under ~1.5–2.5). ROE ${roe}, OCF strong vs earnings. P/E ${pe} / P/B ${pb} are full-to-rich for a “wonderful at fair” frame.`,
      finding: [
        `Article — Stock Selection (value track). Would you own the whole firm for a decade with quotes shut?`,
        `Balance sheet: LT debt/equity ${de}. Heuristic bar: above ~2.5 fails the owner-test comfort screen; ${de} clears that bar — leverage is not the kill-shot on this print.`,
        `Owner earnings quality: ROE ${roe}; net margin ${nm}; OCF positive and not obviously below earnings on the demo file. That is a pass on cash quality heuristics (ROE ≥ ~15% with non-collapsing growth), not a proof of eternal moat.`,
        `Price: P/E ${pe}, P/B ${pb}, P/S ${ps}. Wonderful company language can stay true while the purchase is still a pass-for-now on price. Ten-year hold only if you would cheer owning the enterprise at this capitalization through a down-cycle.`,
        `Underwrite frame: further homework on duration vs multiple — not “buy the brand.”`,
      ].join('\n\n'),
      risks:
        'Multiple needs infinite duration; China/export mix; buybacks become the whole thesis if growth cools.',
      wouldChangeMind:
        'Would turn constructive on price if owner earnings kept compounding through a down-cycle at a materially lower starting multiple — or turn skeptical if ROE/OCF rolled over while the multiple stayed rich.',
      looksAt: `Owner earnings · ROE ${roe} · D/E ${de} · P/E ${pe} · 10-year hold`,
      sourceLine: 'Value pack · Berkshire letter themes · research simulation · unaffiliated',
    },
    {
      slug: 'peter-lynch',
      step: 'selection',
      stepLabel: `${PIPELINE_STEPS[2]!.label} · Growth`,
      stance: 'constructive',
      thesis:
        'Classify first: a known fast grower, not a secret ten-bagger in a mall — still worth homework if PEG and category still match.',
      why: `Growth seat: revenue YoY ${yoy}, EPS YoY ${epsY}, P/E ${pe}. Heuristic PEG ≈ P/E ÷ (rev YoY%) ≈ ${
        f.pe != null && f.revenueYoY != null && f.revenueYoY > 0.01
          ? (f.pe / (f.revenueYoY * 100)).toFixed(1)
          : 'n/a'
      }. Category error is the main risk — not “is the product real.”`,
      finding: [
        `Article — Stock Selection (growth track). One-minute story: customers need more compute for models; NVDA sells the picks and shovels you can observe.`,
        `Lynch category: fast grower (possibly aging toward stalwart if growth normalizes). You do not need a TED talk to explain it — that is a pass on “story simplicity.”`,
        `Growth vs price: rev YoY ${yoy}, EPS YoY ${epsY}, P/E ${pe}. The heuristic PEG on this desk is trailing P/E ÷ revenue YoY percent — a sketch, not forward PEG. When PEG is elevated, the method still allows homework but refuses to pretend the name is “undiscovered.”`,
        `Underwrite frame: worth further homework as a classified growth file — watch category drift and debt (D/E ${de}).`,
      ].join('\n\n'),
      risks:
        'Treating peak-cycle growth as perpetual; story changes every quarter; PEG no longer fits a fast-grower label.',
      wouldChangeMind:
        'Would flip if the one-minute story broke (customers delayed; silicon no longer the bottleneck) or if growth collapsed while the multiple stayed a fast-grower multiple.',
      looksAt: `Lynch category · PEG sketch · rev YoY ${yoy} · P/E ${pe}`,
      sourceLine: 'Growth pack · Magellan categories · research simulation · unaffiliated',
    },
    {
      slug: 'charlie-munger',
      step: 'debate',
      stepLabel: PIPELINE_STEPS[3]!.label,
      stance: 'skeptical',
      thesis:
        'Invert first. Three kill-shots before any romance about the platform.',
      why: `Debate chair: a thesis that needs duration + policy + capex + multiple to all stay friendly is a stack of hopes. P/E ${pe} and P/S ${ps} raise the bar for what must go right.`,
      finding: [
        `Article — Debate (inversion). List kill-shots before praise.`,
        `Kill-shot 1 — Capex pause: hyperscalers cut AI budgets; tokens need less silicon per unit of work. Kill-shot 2 — Policy: export controls shrink the mix. Kill-shot 3 — Price: the capitalization only works if the multiple holds — greater-fool residue at P/E ${pe} / P/S ${ps}.`,
        `What survives inversion: a formidable cash business (ROE ${roe}, D/E ${de}, strong OCF). That is not the same as an intelligent purchase at this implied valuation for a price-sensitive owner.`,
        `Ruling: business survives; holding at this price survives only if your worksheet clears a margin after the kill-shots — otherwise pass for now.`,
      ].join('\n\n'),
      risks:
        'FOMO + career risk of underweighting the winner; denying that several things must go right at once.',
      wouldChangeMind:
        'Would soften if kill-shots were retired with facts and the remaining price still looked like gladly owning the whole firm for a decade.',
      looksAt: `Inversion · kill-shots · P/E ${pe} · incentives`,
      sourceLine: 'Debate pack · inversion first · research simulation · unaffiliated',
    },
    {
      slug: 'michael-burry',
      step: 'debate',
      stepLabel: `${PIPELINE_STEPS[3]!.label} · Red team`,
      stance: 'skeptical',
      thesis:
        'Write the hidden duration assumption on page one before you praise the product.',
      why: `Red team: the model only works if inference/training demand stays elevated enough to justify P/S ${ps} and P/E ${pe}. That assumption is the file — not the logo.`,
      finding: [
        `Article — Red team. Forensic question: what is buried in the valuation model?`,
        `Hidden assumption: hyperscaler capex and silicon intensity stay high for years. If software efficiency or budget pauses cut unit demand, cash can stay fine for a while while the multiple collapses.`,
        `On file: growth ${yoy}, margins ${nm}, ROE ${roe}. None of that falsifies the chips. It also does not prove infinite duration. Watch cash vs story, concentration, and whether the boom ever shows up in working-capital tells.`,
        `Underwrite frame: skeptical until the duration assumption is priced — not until the brand is famous.`,
      ].join('\n\n'),
      risks:
        'Narrative crowding; cyclical capex waved as a perpetual S-curve; model-risk from growth baked into the multiple.',
      wouldChangeMind:
        'Would change mind if filings showed cash and order quality surviving a down-cycle without needing a re-rate to work.',
      looksAt: `Hidden assumptions · P/S ${ps} · cash vs narrative`,
      sourceLine: 'Debate pack · assumption hunt · research simulation · unaffiliated',
    },
    {
      slug: 'william-oneil',
      step: 'timing',
      stepLabel: PIPELINE_STEPS[4]!.label,
      stance: 'cautious',
      thesis:
        'Timing is a trigger filter, not a buy ticket — wait for follow-through after strength, and refuse entries that only work if the story stays perfect.',
      why: `Timing seat (CANSLIM spirit): earnings/sales strength on file (EPS YoY ${epsY}, rev YoY ${yoy}) can score as “C/A” style fundamental fuel, but market timing still needs price structure and follow-through — not on this fundamentals-only demo file.`,
      finding: [
        `Article — Timing. Homepage question: when to buy, and how much — as discipline, not a calendar tip.`,
        `Fundamentals fuel: EPS YoY ${epsY}, revenue YoY ${yoy}, ROE ${roe}. That is constructive for a CANSLIM-style “earnings power” check. What is missing on this demo: cup-with-handle / breakout / market follow-through series — so timing must stay inconclusive on chart triggers.`,
        `Positioning rule for this seat: do not invent a buy date. Scale only after a confirmed strength pattern and market follow-through; cut if the breakout fails. Size is later Quant’s job.`,
        `Underwrite frame: insufficient chart facts for an entry plan — keep a watchlist trigger, do not force a clock.`,
      ].join('\n\n'),
      risks:
        'Chasing without follow-through; averaging down a failed breakout; confusing fundamental strength with a timing green light.',
      wouldChangeMind:
        'Would turn actionable only with price-structure + follow-through facts on file — never from a narrative alone.',
      looksAt: `CANSLIM fuel · EPS YoY ${epsY} · wait for follow-through (not on file)`,
      sourceLine: 'Timing pack · CANSLIM discipline · research simulation · unaffiliated',
    },
    {
      slug: 'jesse-livermore',
      step: 'exit',
      stepLabel: PIPELINE_STEPS[5]!.label,
      stance: 'cautious',
      thesis:
        'Exit when the reason you are in is broken — or when the tape proves you wrong — not when a story still sounds clever.',
      why: `Exit seat: if the bull case is duration + multiple (P/E ${pe}), the exit triggers are duration break and failed tape after strength. Sitting through a broken thesis is how big money is lost.`,
      finding: [
        `Article — Exit Discipline. Homepage question: when to sell.`,
        `Rule set for this file: (1) Fundamental exit — revenue/OCF trend breaks the growth category that justified entry. (2) Tape exit — a failed breakout / broken box after you only entered on strength (once timing facts exist). (3) Never “hope” a rich multiple back.`,
        `On today’s fundamentals alone: growth ${yoy} and cash quality still support “thesis alive,” so there is no forced fundamental exit print. That is not permission to ignore future breaks.`,
        `Underwrite frame: write the exit rules before size — especially if you ever clear Timing.`,
      ].join('\n\n'),
      risks:
        'No stop after a failed strength entry; selling winners too early without a rule; holding a broken duration story because the brand is famous.',
      wouldChangeMind:
        'Would force exit language if growth and OCF rolled over together, or if a strength-based entry failed its follow-through.',
      looksAt: `Exit rules · thesis break · D/E ${de} · growth ${yoy}`,
      sourceLine: 'Exit pack · Livermore discipline themes · research simulation · unaffiliated',
    },
    {
      slug: 'ed-thorp',
      step: 'quant',
      stepLabel: QUANT_LAYER.label,
      stance: 'cautious',
      thesis:
        'Edge is uncertain at this multiple — Kelly says size small or zero until the edge is measurable, not vibes.',
      why: `Quant seat: high ROE ${roe} and low D/E ${de} help ruin-probability, but P/E ${pe} / P/S ${ps} compress expected edge. Without a quantified edge, half-Kelly of a guess is still a guess.`,
      finding: [
        `Article — Quant Risk Control (always on). Verify intuition; do not size from narrative.`,
        `Ruin inputs: leverage ${de} is not the red flag; valuation is. When expected edge is unclear, Kelly → position size near zero until you can state edge and odds without inventing them.`,
        `What this seat will not do: invent a target price, a “buy now” clock, or a confidence-weighted average of other seats.`,
        `Underwrite frame: if other seats clear entry conditions, size as a small fraction of a full Kelly until edge is estimated — otherwise do not size.`,
      ].join('\n\n'),
      risks:
        'Over-sizing a narrative; ignoring ruin; treating committee agreement as edge.',
      wouldChangeMind:
        'Would allow larger size only with a stated edge/odds worksheet — never from seat vote count alone.',
      looksAt: `Kelly sizing · edge unknown · D/E ${de} · P/E ${pe}`,
      sourceLine: 'Quant pack · Kelly discipline · research simulation · unaffiliated',
    },
  ];
}

export type ClerkSynthesis = {
  agree: number;
  oppose: number;
  cautious: number;
  inconclusive: number;
  tallyLine: string;
  article: string;
  entryConditions: string[];
  holdHorizon: string;
  exitTriggers: string[];
  sizingNote: string;
  residual: string;
};

export type KernelDemoReport = {
  ticker: string;
  name: string;
  question: string;
  liveFilings: boolean;
  prep: ResearchPrep;
  briefs: IndependentBrief[];
  assembly: Assembly;
  clerk: ClerkSynthesis;
  steps: { key: PipelineStepKey; label: string; question: string; briefs: IndependentBrief[] }[];
};

function buildClerk(f: Fundamentals, briefs: IndependentBrief[]): ClerkSynthesis {
  const agree = briefs.filter((b) => b.stance === 'constructive').length;
  const oppose = briefs.filter((b) => b.stance === 'skeptical').length;
  const cautious = briefs.filter((b) => b.stance === 'cautious').length;
  const inconclusive = briefs.filter((b) => b.stance === 'inconclusive').length;
  const pe = fmtN(f.pe);
  const ps = fmtN(f.ps);
  const yoy = fmtPct(f.revenueYoY);
  const roe = fmtPct(f.roe);

  return {
    agree,
    oppose,
    cautious,
    inconclusive,
    tallyLine: `${agree} constructive · ${oppose} skeptical · ${cautious} cautious · ${inconclusive} inconclusive — a count of isolated stances, not a vote to trade.`,
    article: [
      `Clerk assembly — after isolation. ${agree} seats lean constructive on the business/theme; ${oppose} lead with kill-shots; ${cautious} refuse to confuse a good franchise with a good starting price (P/E ${pe}, P/S ${ps}).`,
      `What is not in dispute: cash quality and growth on file (rev YoY ${yoy}, ROE ${roe}) are real enough to research. What is in dispute: whether today’s capitalization still clears Buffett’s decade test, Marks’s pendulum, and Munger/Burry’s duration assumptions.`,
      `This clerk will not average those stances into “buy NVDA.” The product residual is yours: which falsifier you will actually watch, and whether Timing ever gets chart facts.`,
      `Practical underwrite (simulation language): treat Trend/Lynch as “theme alive”; treat Marks/Buffett/Munger/Burry as “price and duration not cleared”; treat O’Neil as “no entry clock without follow-through”; treat Livermore/Thorp as “write exits and size small or zero until edge is stated.”`,
    ].join('\n\n'),
    entryConditions: [
      'Timing (O’Neil): only after strength + market follow-through are on file — not from this fundamentals-only page.',
      'Value (Buffett): only if you would own the whole firm for a decade at a starting multiple you can defend after a down-cycle — today’s P/E/P/S are the barrier.',
      'Cycle (Marks): prefer reopening after multiple compression with cash still intact — not a dip that still prices perfection.',
      'Debate clearance: at least one kill-shot (capex pause / policy / multiple-only math) must be retired with facts before size.',
    ],
    holdHorizon:
      'Method-implied horizons if a file were ever cleared: Buffett seat → decade ownership test; Lynch seat → as long as the Lynch category still matches; Marks seat → until the pendulum shifts again; O’Neil seat → while the strength structure holds; Livermore seat → until the reason for entry breaks. None of these is a calendar tip for your brokerage.',
    exitTriggers: [
      'Growth + OCF roll over together (category break).',
      'Failed breakout / broken strength after a timing entry (once chart facts exist).',
      'Duration assumption breaks while the multiple stays rich (Burry/Munger kill-shots fire).',
      'You cannot restate the edge — Thorp: size → zero.',
    ],
    sizingNote:
      'Thorp: with edge unmeasured, Kelly → small or zero. Never convert “3 constructive seats” into full size. Research simulation — not an order.',
    residual:
      'Open residual: hyperscaler capex path, export mix, and whether P/E/P/S still work if growth merely becomes normal. Your judgment — not a clerk buy ticket.',
  };
}

export async function buildKernelDemoReport(): Promise<KernelDemoReport> {
  const { facts, liveFilings } = await loadDemoFacts();
  const prep = runResearchPrep({ fundamentals: facts, notes: PREP_NOTES });
  const drafts = buildSeatDrafts(facts);

  const briefs: IndependentBrief[] = [];
  for (const draft of drafts) {
    const master = getMasterBySlug(draft.slug);
    if (!master) continue;
    const pack = await buildPackContextAsync({
      slug: draft.slug,
      question: KERNEL_DEMO_QUESTION,
      subject: KERNEL_DEMO_TICKER,
      fundamentals: facts,
      extraText: `${PREP_NOTES} ${draft.finding} ${prep.contextBlock}`,
    });
    briefs.push({
      slug: draft.slug,
      nameEn: master.nameEn,
      role: master.role,
      group: master.group as PipelineGroup,
      stance: draft.stance,
      looksAt: draft.looksAt,
      thesis: draft.thesis,
      why: draft.why,
      finding: draft.finding,
      risks: draft.risks,
      wouldChangeMind: draft.wouldChangeMind,
      sourceLine: draft.sourceLine,
      isolated: true,
      packEvidence: pack.evidence ?? undefined,
    });
  }

  const clerk = buildClerk(facts, briefs);
  const counts = {
    constructive: clerk.agree,
    cautious: clerk.cautious,
    skeptical: clerk.oppose,
    inconclusive: clerk.inconclusive,
  };

  const assembly: Assembly = {
    plan: 'analyst',
    seatCount: briefs.length,
    ticker: KERNEL_DEMO_TICKER,
    question: KERNEL_DEMO_QUESTION,
    domain: 'ticker',
    counts,
    agreements: [
      'Theme/cash quality is real enough to research — fame is not the file.',
      'This is underwriting (business + price + duration), not a greater-fool tape.',
    ],
    splits: [
      'Trend/Lynch constructive on category vs Marks/Buffett/Munger/Burry on price and kill-shots.',
      'Timing has fundamental fuel but no chart follow-through on this demo — no forced entry clock.',
    ],
    residual: clerk.residual,
    clerkNote: clerk.tallyLine,
    valuation: [
      { label: 'P/E', value: facts.pe != null ? facts.pe.toFixed(1) : '—', hint: 'Cached / demo' },
      { label: 'P/B', value: facts.pb != null ? facts.pb.toFixed(1) : '—' },
      { label: 'P/S', value: facts.ps != null ? facts.ps.toFixed(1) : '—' },
      { label: 'ROE', value: facts.roe != null ? `${(facts.roe * 100).toFixed(0)}%` : '—' },
    ],
    cycleScenarios: [],
    underwriteFrame: 'split_needs_user_judgment',
    decisionHelp: clerk.sizingNote,
    executiveSummary: clerk.article,
  };

  const stepDefs: { key: PipelineStepKey; label: string; question: string }[] = [
    ...PIPELINE_STEPS.map((s) => ({ key: s.key as PipelineStepKey, label: s.label, question: s.question })),
    { key: 'quant', label: QUANT_LAYER.label, question: QUANT_LAYER.question },
  ];

  const steps = stepDefs
    .map((s) => ({
      ...s,
      briefs: briefs.filter((b) => {
        const d = drafts.find((x) => x.slug === b.slug);
        return d?.step === s.key;
      }),
    }))
    .filter((s) => s.briefs.length > 0);

  return {
    ticker: KERNEL_DEMO_TICKER,
    name: facts.entityName || KERNEL_DEMO_NAME,
    question: KERNEL_DEMO_QUESTION,
    liveFilings,
    prep,
    briefs,
    assembly,
    clerk,
    steps,
  };
}
