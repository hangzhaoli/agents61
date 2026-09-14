/**
 * Kernel demo report — same types as live desk briefs.
 * Pack evidence is scored by the real checklist/RAG modules against FACTS.
 * Narrative is a canned Observer-style IC (research simulation, not advice).
 */

import { runResearchPrep, type ResearchPrep } from '@/lib/desk/research-pipeline';
import { getFundamentals, emptyFundamentals, type Fundamentals } from '@/lib/data/fundamentals';
import { getMasterBySlug } from '@/lib/masters';
import { buildPackContextAsync } from '@/lib/personas/modules';
import type { Assembly, IndependentBrief } from '@/lib/research';

export const KERNEL_DEMO_TICKER = 'NVDA';
export const KERNEL_DEMO_NAME = 'NVIDIA Corporation';
export const KERNEL_DEMO_QUESTION =
  'Staff five deep seats on NVDA. Quality vs duration vs price. Isolated briefs, then clerk stacks the split. No buy rating.';

const PREP_NOTES =
  'Data-center GPU franchise; CUDA switching costs; export-control and customer-capex duration are the live fights. Cached filings, not a live quote.';

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

type SeatDraft = {
  slug: string;
  stance: IndependentBrief['stance'];
  thesis: string;
  why: string;
  finding: string;
  risks: string;
  wouldChangeMind: string;
  looksAt: string;
  sourceLine: string;
};

const SEAT_DRAFTS: SeatDraft[] = [
  {
    slug: 'warren-buffett',
    stance: 'cautious',
    thesis:
      'Understandable cash engine, but the ten-year hold is a price-and-duration test — not a brand test.',
    why: 'The business can be explained without a circus: accelerators plus a software habit that customers do not casually rip out. Owner-earnings quality is visible in cash conversion. What is not visible is whether today’s multiple still works if unit growth normalizes.',
    finding:
      'Circle of competence: pass on the economics, not on forecasting next year’s GPU mix. Moat language (CUDA, switching costs) is real only if customers still need this silicon through a capex pause. Wonderful company at a full-to-rich price is a homework file, not a slogan. Underwrite frame: further work on owner earnings through a down-cycle — not a greater-fool tape.',
    risks:
      'Customer concentration, export controls, and a multiple that needs duration to stay honest. Buybacks do not rescue a thesis that is only “everyone knows it’s a great company.”',
    wouldChangeMind:
      'Would change mind if owner earnings flattened for several prints while the multiple still priced infinite duration — or if the product stopped being explainable in one paragraph.',
    looksAt: 'Owner earnings, ROE durability, leverage, ten-year hold, capital allocation',
    sourceLine: 'Method pack: Berkshire letters (public themes) · research simulation · unaffiliated',
  },
  {
    slug: 'howard-marks',
    stance: 'cautious',
    thesis:
      'Second-level: the crowd already agrees this is a great franchise. The pendulum question is what that agreement has done to prospective returns.',
    why: 'First-level thought is “AI winners compound.” Second-level is whether starting valuation plus consensus duration leaves a thin margin if capex merely becomes normal. Risk is permanent loss of capital from overpaying, not a beta number.',
    finding:
      'Pendulum on this name sits nearer optimism/euphoria than capitulation: tight narratives, high starting multiples, and a marginal buyer who needs the story to stay linear. Credit-market tells are not the whole file, but equity priced for perfection is usually not “cheap risk.” Underwrite frame: locate the pendulum; do not confuse a good company with a good starting price.',
    risks:
      'Consensus already in the price; a pause in hyperscaler capex would re-rate the duration assumption, not merely “the next quarter.”',
    wouldChangeMind:
      'Would change mind if starting multiples compressed while the business stayed cash-generative — i.e. the pendulum actually swung — not if a dip merely looked like a gift.',
    looksAt: 'Pendulum, second-level vs consensus, valuation vs growth already assumed',
    sourceLine: 'Method pack: Oaktree memo themes · research simulation · unaffiliated',
  },
  {
    slug: 'charlie-munger',
    stance: 'skeptical',
    thesis:
      'Invert first. Three kill-shots before any romance about the platform.',
    why: 'A thesis that needs several things to go right at once (duration, export policy, customer capex, multiple) is not “patient compounding.” It is a stack of hopes. Incentives of promoters and of owners are not the same.',
    finding:
      'Kill-shot 1: customer capex pauses and tokens do not need this much silicon. Kill-shot 2: export controls or geopolitics shrink the addressable stack. Kill-shot 3: the price only works if the multiple holds — a greater-fool residue. What remains after inversion is still a formidable business; it is not automatically an intelligent purchase at this implied valuation. Ruling: survives as a business, survives as a holding only at a lower starting price — or not at all for a price-sensitive owner. Underwrite frame: pass for now unless your own worksheet clears a margin after the kill-shots.',
    risks:
      'Psychological denial in the bull case (“it’s obvious”) and lollapalooza of narrative + FOMO + career risk of underweighting the winner.',
    wouldChangeMind:
      'Would change mind if the kill-shots were retired with facts (not slogans) and the remaining price still looked like owning the whole firm gladly with quotes shut for a decade.',
    looksAt: 'Inversion, incentives, competitive destruction, circle of competence',
    sourceLine: 'Method pack: Poor Charlie’s Almanack / inversion · research simulation · unaffiliated',
  },
  {
    slug: 'michael-burry',
    stance: 'skeptical',
    thesis:
      'Write the hidden assumption in the model before you praise the product.',
    why: 'Forensic seat: what has to stay true for the current capitalization to be anything other than a duration bet? If the file only works when inference demand is unbounded, that assumption belongs on page one.',
    finding:
      'Kill-condition: hyperscaler capex mean-reverts, software efficiency reduces silicon intensity, or China/export rules bite the mix. None of that falsifies that the chips are real. It falsifies a valuation that treats duration as infinite. Look at cash vs story, customer concentration, and whether inventories or receivables ever start telling on the boom. Underwrite frame: skeptical until the assumption is priced, not until the brand is famous.',
    risks:
      'Narrative crowding, model-risk (growth baked in), and the temptation to treat a cyclical capex wave as a perpetual S-curve.',
    wouldChangeMind:
      'Would change mind if filings showed cash and order quality surviving a down-cycle without the thesis needing a re-rate.',
    looksAt: 'Hidden model assumptions, cash vs accruals, concentration, duration',
    sourceLine: 'Method pack: Scion-style assumption hunt · research simulation · unaffiliated',
  },
  {
    slug: 'peter-lynch',
    stance: 'constructive',
    thesis:
      'Classify first: this is a fast grower the crowd already knows — not a ten-bagger hiding in a mall.',
    why: 'You can observe the product in the world (accelerators in the data center, not a biotech mystery). The story is simple: more compute for models. The mistake is labeling a well-known fast grower as if it were still undiscovered.',
    finding:
      'Lynch category: fast grower / stalwart-in-waiting if growth cools. PEG and growth-vs-price still have to match the category. “Invest in what you know” is a research start: you know GPUs are in demand; you still check debt, cash, and whether the story keeps changing every quarter. Underwrite frame: worth further homework as a classified growth file — not as a secret.',
    risks:
      'Category error: treating peak-cycle growth as perpetual, or needing a complicated new story every print.',
    wouldChangeMind:
      'Would change mind if the one-minute story broke (customers delayed, product no longer observable as the bottleneck) or if PEG no longer fit a fast-grower label.',
    looksAt: 'Lynch category, PEG heuristic, story simplicity, growth vs price',
    sourceLine: 'Method pack: One Up on Wall Street categories · research simulation · unaffiliated',
  },
];

export type KernelDemoReport = {
  ticker: string;
  name: string;
  question: string;
  liveFilings: boolean;
  prep: ResearchPrep;
  briefs: IndependentBrief[];
  assembly: Assembly;
};

export async function buildKernelDemoReport(): Promise<KernelDemoReport> {
  const { facts, liveFilings } = await loadDemoFacts();
  const prep = runResearchPrep({
    fundamentals: facts,
    notes: PREP_NOTES,
  });

  const briefs: IndependentBrief[] = [];
  for (const draft of SEAT_DRAFTS) {
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
      group: master.group,
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

  const counts = {
    constructive: briefs.filter((b) => b.stance === 'constructive').length,
    cautious: briefs.filter((b) => b.stance === 'cautious').length,
    skeptical: briefs.filter((b) => b.stance === 'skeptical').length,
    inconclusive: briefs.filter((b) => b.stance === 'inconclusive').length,
  };

  const assembly: Assembly = {
    plan: 'observer',
    seatCount: briefs.length,
    ticker: KERNEL_DEMO_TICKER,
    question: KERNEL_DEMO_QUESTION,
    domain: 'ticker',
    counts,
    agreements: [
      'The franchise (accelerators + software habit) is real enough to research. Fame is not the file.',
      'This is an underwriting problem: business quality versus starting price and duration — not a tape-reading contest.',
      'Isolated briefs never collapse into a buy rating. Empty seats on a paid desk stay empty.',
    ],
    splits: [
      'Lynch keeps a classified growth/homework frame; Buffett and Marks treat price and pendulum as the fight.',
      'Munger and Burry lead with kill-shots and hidden duration assumptions. The clerk will not blend that into one score.',
    ],
    residual:
      'Open residual: hyperscaler capex path, export mix, and whether the multiple still works if growth merely becomes normal. Not a timing call. Not advice.',
    clerkNote:
      'Kernel demo. Clerk stack only. Research simulation — unaffiliated personas — not a recommendation — no buy button.',
    valuation: [
      { label: 'P/E', value: facts.pe != null ? facts.pe.toFixed(1) : '—', hint: 'Cached / demo file' },
      { label: 'P/B', value: facts.pb != null ? facts.pb.toFixed(1) : '—' },
      { label: 'P/S', value: facts.ps != null ? facts.ps.toFixed(1) : '—' },
      { label: 'ROE', value: facts.roe != null ? `${(facts.roe * 100).toFixed(0)}%` : '—' },
    ],
    cycleScenarios: [],
    underwriteFrame: 'split_needs_user_judgment',
    decisionHelp:
      'Your job is the residual: which falsifier you will actually watch. The desk will not average a fake consensus.',
  };

  return {
    ticker: KERNEL_DEMO_TICKER,
    name: facts.entityName || KERNEL_DEMO_NAME,
    question: KERNEL_DEMO_QUESTION,
    liveFilings,
    prep,
    briefs,
    assembly,
  };
}
