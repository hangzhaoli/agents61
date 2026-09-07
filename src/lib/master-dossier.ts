/**
 * Per-master dossier for /masters/[slug]: investment style, selection playbook,
 * and a seeded illustrative style path. Not live agent performance.
 */

import type { Master, PipelineGroup } from '@/lib/masters';
import { GROUP_META } from '@/lib/masters';
import { getPersona } from '@/lib/personas';
import {
  CYCLE_DUTIES,
  DEBATE_SEQUENCE,
  EXIT_RULES,
  GROWTH_SCREENS,
  QUANT_DUTIES,
  TIMING_METHODS,
  TREND_DUTIES,
  VALUE_SCREENS,
} from '@/lib/pipeline';

export interface StylePath {
  points: number[];
  start: number;
  end: number;
  maxDrawdownPct: number;
  shapeLabel: string;
  caption: string;
}

export interface MasterDossier {
  school: string;
  horizon: string;
  turnover: string;
  concentration: string;
  riskPosture: string;
  styleNarrative: string;
  selectionIntro: string;
  selectionSteps: string[];
  screens: string[];
  avoids: string[];
  curve: StylePath;
}

interface GroupStyle {
  school: string;
  horizon: string;
  turnover: string;
  concentration: string;
  riskPosture: string;
  drift: number;
  vol: number;
  crashAt: number;
  crashDepth: number;
}

const GROUP_STYLE: Record<PipelineGroup, GroupStyle> = {
  trend: {
    school: 'Thematic / S-curve',
    horizon: '5–15 years (adoption, not next quarter)',
    turnover: 'Low-to-moderate; themes held through noisy prints',
    concentration: 'High in a few exponential platforms',
    riskPosture: 'Accepts drawdowns if the S-curve is intact; kills story stocks',
    drift: 0.021,
    vol: 0.038,
    crashAt: 16,
    crashDepth: 0.36,
  },
  cycle: {
    school: 'Macro / credit cycle',
    horizon: '18–48 months around a cycle phase',
    turnover: 'Moderate; size changes with the thermometer',
    concentration: 'Diversified expressions of one cycle call',
    riskPosture: 'Defense first when the pendulum is hot; aggression at extremes',
    drift: 0.011,
    vol: 0.026,
    crashAt: 26,
    crashDepth: 0.24,
  },
  value: {
    school: 'Value / quality compounding',
    horizon: 'Forever-hold language, reviewed annually',
    turnover: 'Very low',
    concentration: 'Concentrated in understandable businesses',
    riskPosture: 'Price and quality are separate questions; cash is a position',
    drift: 0.013,
    vol: 0.016,
    crashAt: 20,
    crashDepth: 0.18,
  },
  growth: {
    school: 'Growth / special situations',
    horizon: '2–7 years (ten-bagger clock, not day-trading)',
    turnover: 'Moderate; sells when the type changes',
    concentration: 'Focused book, not 200 names',
    riskPosture: 'Pays for growth only after classifying the type',
    drift: 0.017,
    vol: 0.032,
    crashAt: 22,
    crashDepth: 0.4,
  },
  debate: {
    school: 'Red team / inversion',
    horizon: 'Until the thesis is killed or survives interrogation',
    turnover: 'High on ideas that fail the kill-test',
    concentration: 'One name at a time on the stand',
    riskPosture: 'Asymmetric skepticism; does not split the difference',
    drift: 0.009,
    vol: 0.03,
    crashAt: 18,
    crashDepth: 0.28,
  },
  timing: {
    school: 'Price / stage / breakout',
    horizon: 'Weeks to a few quarters around a trigger',
    turnover: 'High vs. value seats; still rule-based',
    concentration: 'Only names that meet the pattern',
    riskPosture: 'No trigger, no size. Timing is a filter, not a buy ticket',
    drift: 0.015,
    vol: 0.024,
    crashAt: 12,
    crashDepth: 0.16,
  },
  exit: {
    school: 'Sell discipline / accountability',
    horizon: 'The hold is not the default; the exit rule is',
    turnover: 'Forced by stops, boxes, or index underperformance',
    concentration: 'Protects the book more than it hunts names',
    riskPosture: 'Defense: stops, trailing boxes, or “switch to the index”',
    drift: 0.012,
    vol: 0.019,
    crashAt: 24,
    crashDepth: 0.11,
  },
  quant: {
    school: 'Statistical / sizing / factors',
    horizon: 'As long as the signal stays significant',
    turnover: 'Process-driven, not story-driven',
    concentration: 'Risk-budgeted; no hero position without Kelly math',
    riskPosture: 'Intuition is not evidence; size the bet, cap the loss',
    drift: 0.014,
    vol: 0.011,
    crashAt: 30,
    crashDepth: 0.07,
  },
};

const DUTY: Record<string, string> = {
  ...TREND_DUTIES,
  ...CYCLE_DUTIES,
  ...VALUE_SCREENS,
  ...GROWTH_SCREENS,
  ...TIMING_METHODS,
  ...EXIT_RULES,
  ...QUANT_DUTIES,
  'david-einhorn': DEBATE_SEQUENCE.redTeam[0].duty,
  'michael-burry': DEBATE_SEQUENCE.redTeam[1].duty,
  'carl-icahn': DEBATE_SEQUENCE.redTeam[2].duty,
  'dan-loeb': DEBATE_SEQUENCE.redTeam[3].duty,
  'paul-singer': DEBATE_SEQUENCE.redTeam[4].duty,
  'michael-steinhardt': DEBATE_SEQUENCE.crossExam[0].duty,
  'stanley-druckenmiller': DEBATE_SEQUENCE.crossExam[1].duty,
  'charlie-munger': DEBATE_SEQUENCE.verdict[0].duty,
};

/** Unique voice paragraphs — one per slug so inner pages are not templates. */
const STYLE_COPY: Record<string, string> = {
  'cathie-wood':
    'Wood’s public ARK method treats innovation as an S-curve problem: unit costs fall, adoption inflects, and the market usually prices a straight line. On this seat the work is naming which platform is still early versus which is a story stock with a press release. Drawdowns are expected; a broken adoption curve is not.',
  'philippe-laffont':
    'Laffont’s Coatue lens is commercialization, not TED-talk TAM. A trend that has not crossed into revenue, gross margin, and a repeatable sales motion is still a slide. This seat asks whether the stack is already in procurement budgets.',
  'chase-coleman':
    'Coleman / Tiger Global tracks penetration: internet, ads, and new consumption. The style is concentrated growth with a high tolerance for multiple expansion if the TAM is still empty. This seat kills names that only work if the next billion users appear on schedule.',
  'ron-baron':
    'Baron Funds is decade-scale people-and-product compounding (the public Tesla hold is the teaching exhibit). Turnover is supposed to be low; volatility is not a sell rule. This seat asks whether management can still compound for ten years, not ten weeks.',
  't-rowe-price':
    'T. Rowe Price pioneered growth-stock investing as a cycle analog: which past growth era does this one rhyme with, and what killed the analog. Historical, not nostalgic — the method is mapping, not collecting first editions.',
  'ken-fisher':
    'Fisher Investments style is flow-and-valuation: PSR, global allocation, and the market as a humiliator. This seat checks whether the “obvious” US mega-cap is already owned by everyone who can own it.',
  'mark-mobius':
    'Mobius is the EM diffusion lens: the same trend, a different geography and listing. US ADRs are the window, not the whole country. This seat asks how policy and listing structure change the cash-flow claim.',
  'ray-dalio':
    'Dalio’s published Bridgewater frame is clocks, not crystal balls: short-term debt cycle vs. long-term debt cycle, and an all-weather humility about forecasts. This seat places the name on a thermometer before anyone argues cheap or expensive.',
  'howard-marks':
    'Marks writes memos about second-level thinking and the pendulum. The style is credit-cycle humility: risk is not volatility, and the worst time to stretch for yield is when everyone else is comfortable. This seat locates the pendulum, then warns.',
  'john-templeton':
    'Templeton’s public rule is maximum pessimism — global, not local. The style is buying what is hated after the crowd has already sold, with diversification as the shock absorber. This seat asks whether there is actually pessimism, or just a dip in a bull market.',
  'george-soros':
    'Soros reflexivity: prices change the fundamentals that then change prices. The style is testing whether a trend is self-reinforcing or already eating itself. Size when the loop is intact; exit when it is not — still not a buy ticket on this site.',
  'john-maynard-keynes':
    'Keynes on this desk is the beauty contest: what consensus is priced, and where it is wrong. The King’s College record is public history; this seat uses the metaphor, not a reconstructed NAV. Solvency and time horizon stay in the warning.',
  'alan-howard':
    'Brevan Howard macro: rates and liquidity first. Equities are a derivative of the liquidity cycle on this seat. If the name only works in easy money, say so before the growth seats cheer.',
  'bill-gross':
    'The Bond King lens: curve, spreads, and the idea that bonds often see the turn first. This seat translates fixed-income signals into an equity-cycle footnote — it does not trade the bond.',
  'john-paulson':
    'Paulson’s public signature is credit quality and the 2007–08 housing inversion. This seat watches systemic plumbing (mortgage, leverage, hidden inventory) more than product TAM.',
  'paul-tudor-jones':
    'PTJ style is defense: macro inflection, tape, and the 1987 lesson that survival is the first return. This seat confirms a cycle turn; it does not average down into a broken tape.',
  'benjamin-graham':
    'Graham is price versus a conservative asset value, with Mr. Market as a partner you may ignore. The Intelligent Investor frame on this seat is margin of safety, not a brand story. If you cannot state the net-net or earning-power discount, the seat should pass.',
  'warren-buffett':
    'Buffett’s published Berkshire letters describe moats, owner-earnings, and a forever hold — after Graham, with Fisher quality added. The ~20% multi-decade Berkshire figure is public history of the firm, not this agent’s live track. This seat still asks whether you would buy the whole business.',
  'walter-schloss':
    'Schloss ran a cigar-butt book: cheap to book, low debt, many names, little stress. Public long-run figures are the historical partnership, not this simulation. This seat diversifies ugliness instead of falling in love.',
  'john-neff':
    'Neff’s Windsor GARP: low P/E with a growth adjustment, and a willingness to look dull. This seat is the original “modest growth, cheap multiple” screen — not a momentum toy.',
  'seth-klarman':
    'Klarman / Baupost: cash as ammunition, distress, and a long-term orientation as the edge. Margin of Safety is the voice. This seat would rather do nothing than stretch. Special situations over stories.',
  'chuck-akre':
    'Akre’s three-legged stool: business model, reinvestment runway, people. Compounding machines, not cigar butts. This seat pays a fair price for a great reinvestment engine and then tries to do very little.',
  'terry-smith':
    'Fundsmith in three sentences: buy good companies, don’t overpay, do nothing. High ROCE, low turnover, quality that looks expensive to Graham and cheap to a 20-year owner. This seat is allergic to tinkering.',
  'hetty-green':
    'Hetty Green on this desk is fortress cheapness: cash, credit, and a refusal to need the market. Historical persona, not a reconstructed ledger. This seat kills leverage theater.',
  'duan-yongping':
    'Duan’s public method is “buying a stock is buying a business you can explain,” with a Buffett/Munger vocabulary and a consumer-product instinct. If you cannot explain it to a family member, it is not homework.',
  'li-lu':
    'Li Lu: circle of competence plus a civilizational-cycle overlay (China / ADRs). Himalaya Capital’s public letters are the voice. This seat will not leave the circle to chase a US mega-cap fashion.',
  'peter-lynch':
    'Lynch: six types, ten-baggers in daily life, and “know what you own.” Magellan’s public record is history, not this agent. This seat classifies the name before cheering the story — and visits the mall, not the TAM slide.',
  'bill-miller':
    'Miller’s public style is concentrated, sometimes contrarian growth: high-competitiveness names after a stumble. This seat asks whether the stumble was cyclical or a broken model.',
  'julian-robertson':
    'Tiger cubs start here: best long vs. best short, global, fundamental. This seat thinks in pairs and industry leaders, not in single-name slogans.',
  'andreas-halvorsen':
    'Viking / Halvorsen: large-cap growth and industry leadership with hedge-fund process. This seat wants the leader, not the story of the third player.',
  'stephen-mandel':
    'Lone Pine: growth and value factors on the same name. This seat cross-checks the multiple against the growth type instead of picking a tribe.',
  'lee-ainslie':
    'Maverick: deep fundamental work in tech and services. This seat reads unit economics and competitive position, not the keynote.',
  'bill-ackman':
    'Ackman: concentrated quality plus a catalyst (or an activist letter). Pershing Square’s public presentations are the voice. This seat wants a platform and a reason the value unlocks — still not a buy button.',
  'david-tepper':
    'Tepper: distress reversals and crisis buying, with a credit-trained gut. This seat shows up when the cycle is ugly, not when the multiple is cute.',
  'mohnish-pabrai':
    'Pabrai: cloned Buffett with fewer names and less complexity. Checklist over cleverness. This seat wants a simple cash-flow story you could explain on one page.',
  'joel-greenblatt':
    'Greenblatt: Magic Formula rank plus special-situation craft from You Can Be a Stock Market Genius. Cheap and good, or a structured event. This seat will not romanticize a mediocre business at a fair price.',
  'david-einhorn':
    'Einhorn’s red-team job is earnings quality: cash vs. accruals, one-time items, and the footnote that does not match the slide. Greenlight letters are the voice. This seat tries to kill the accounting before anyone praises the brand.',
  'michael-burry':
    'Burry inverts the model: which assumptions have to stay true, and what the crowd has not read. Scion’s public crisis work is history. This seat is happiest when the file is boring and the risk is hidden.',
  'carl-icahn':
    'Icahn: governance, related parties, and whether capital is being extracted. This seat is not a product analyst — it is a control-and-incentives analyst.',
  'dan-loeb':
    'Loeb / Third Point: is the story empty, is the catalyst dated, is the letter already priced. This seat writes like a skeptical letter, not a fan essay.',
  'paul-singer':
    'Singer / Elliott: contracts, legal optionality, and tail risk. This seat looks for the hole in the indenture and the ugly scenario that is not in the pitch deck.',
  'michael-steinhardt':
    'Steinhardt’s variant perception: where this thesis differs from consensus, and whether that difference is real. This seat will not add a seventh identical growth paragraph.',
  'stanley-druckenmiller':
    'Druckenmiller: if you get one shot, would you concentrate — and if not, why is this on the desk? Macro plus security selection. This seat is allergic to watered-down conviction.',
  'charlie-munger':
    'Munger chairs the inversion: the best way to kill the thesis, multidisciplinary models, and “sit on your ass” compounding. Poor Charlie’s Almanack is the voice. This seat would rather be roughly right and idle than precisely busy.',
  'william-oneil':
    'O’Neil CANSLIM: earnings, leadership, and a cup-with-handle buy point with market follow-through. How to Make Money in Stocks is the playbook. This seat is a filter: no pattern, no size.',
  'mark-minervini':
    'Minervini SEPA: Stage 2 launches, tightness, and risk defined in advance. This seat confirms trend and setup; it does not argue philosophy with Graham.',
  'richard-dennis':
    'Dennis / Turtles: 20-day and 55-day breakout rules, systematic, no opinion. This seat is a mechanical confirm of direction, not a story about management.',
  'ed-seykota':
    'Seykota trend-following: ride the tape, cut the rest, psychology as risk. This seat asks whether price has already voted, not whether the 10-K is elegant.',
  'steve-cohen':
    'Cohen / Point72: short-horizon tape, volume, and news reaction with a process around specialists. This seat is a reaction filter, not a decade-compounder seat.',
  'jesse-livermore':
    'Livermore: iron stops, let winners run, and the public legend of a tape reader. Historical persona. This seat’s job is the stop, not the memoir.',
  'bernard-baruch':
    'Baruch: sell into optimism, leave the last eighth for someone else. This seat is an exit conscience when the room is proud.',
  'nicolas-darvas':
    'Darvas boxes: the original trailing box. If the box breaks, the seat sells the idea. Simple, visual, unforgiving.',
  'philip-fisher':
    'Philip Fisher: scuttlebutt, fifteen points, and do not sell a great growth company for a wobble. Common Stocks and Uncommon Profits is the voice. This seat exits on deterioration or error, not boredom.',
  'john-bogle':
    'Bogle is accountability: if the active book cannot beat a low-cost index in the argument, switch to the index. This seat is not a stock picker — it is the Friday conscience of the pipeline.',
  'ed-thorp':
    'Thorp: Kelly sizing, edge first, blackjack-to-hedge-fund humility. Beat the Dealer / Beat the Market are the public trail. This seat asks how much, not how exciting.',
  'jim-simons':
    'Simons / Renaissance public legend is statistical significance and not narrating the signal. This seat tests whether the pattern existed in history — it does not tell a founder story.',
  'ken-griffin':
    'Griffin / Citadel: multi-strategy, execution cost, and platform discipline. This seat cares whether the idea survives costs and crowding.',
  'david-shaw':
    'D.E. Shaw: model pipeline as engineering. This seat asks whether the method can be specified, not whether the anecdote is good.',
  'cliff-asness':
    'Asness / AQR: factor exposure — is this skill or a style bet (value, momentum, size). This seat will name the factor even when it is unfashionable.',
  'two-sigma':
    'Overdeck & Siegel / Two Sigma: alternative data as a cross-check, not a magic crystal. This seat asks what independent data would falsify the fundamental story.',
  'israel-englander':
    'Englander / Millennium: platform risk — a loss cap on any single view. This seat is the kill-switch on concentration theater.',
};

const AVOIDS: Record<PipelineGroup, string[]> = {
  trend: ['Story stocks with no commercialization path', 'Forcing a 12-month target onto a decade theme'],
  cycle: ['Calling cheap/expensive before placing the cycle', 'Treating a mid-cycle dip as maximum pessimism'],
  value: ['Paying any price for a beloved brand', 'Confusing a ticker with a business you would own outright'],
  growth: ['Cheering a name you cannot classify in one minute', 'Mixing a ten-bagger clock with a day-trade'],
  debate: ['Splitting the difference with the bull case', 'Praising the slide deck before reading the footnote'],
  timing: ['Sizing without a trigger', 'Pretending a timing filter is a fundamental buy ticket'],
  exit: ['Holding because the story is familiar', 'Moving a stop because hope improved'],
  quant: ['Story without a testable signal', 'A hero size that fails Kelly / risk-budget math'],
};

type CurveKind =
  | 'smooth'
  | 'hockey'
  | 'wave'
  | 'spike'
  | 'stairs'
  | 'chop'
  | 'tight'
  | 'boom-bust'
  | 'drawdown-first'
  | 'asymmetric'
  | 'peak-giveback'
  | 'factor-winter';

interface CurveSpec {
  kind: CurveKind;
  label: string;
  annual: number;
  vol: number;
  crashAt?: number;
  crashDepth?: number;
  crashAt2?: number;
  crashDepth2?: number;
  inflectAt?: number;
  period?: number;
  phase?: number;
  amp?: number;
  eventAt?: number;
  eventSize?: number;
  stepEvery?: number;
  stepSize?: number;
  troughAt?: number;
  springAt?: number;
  peakAt?: number;
}

/** Unique silhouette per seat so 61 pages do not share one auto-scaled line. */
const CURVE_SPEC: Record<string, CurveSpec> = {
  'cathie-wood': { kind: 'hockey', label: 'Adoption S-curve with a deep mid-path hole', annual: 0.28, vol: 0.045, inflectAt: 16, crashAt: 28, crashDepth: 0.42 },
  'philippe-laffont': { kind: 'hockey', label: 'Late inflection once revenue shows up', annual: 0.2, vol: 0.03, inflectAt: 24, crashAt: 34, crashDepth: 0.22 },
  'chase-coleman': { kind: 'boom-bust', label: 'Penetration run, then a multiple-compression bust', annual: 0.22, vol: 0.04, crashAt: 30, crashDepth: 0.38 },
  'ron-baron': { kind: 'smooth', label: 'Decade hold: one ugly year, then still compounding', annual: 0.16, vol: 0.028, crashAt: 14, crashDepth: 0.28 },
  't-rowe-price': { kind: 'wave', label: 'Two growth-cycle analogs stacked', annual: 0.12, vol: 0.018, period: 20, phase: 0.4, amp: 0.12 },
  'ken-fisher': { kind: 'chop', label: 'Flow noise, then a valuation-gap grind', annual: 0.1, vol: 0.035, eventAt: 33, eventSize: 0.14, crashAt: 12, crashDepth: 0.11 },
  'mark-mobius': { kind: 'drawdown-first', label: 'EM fear first, then the trend arrives', annual: 0.18, vol: 0.03, troughAt: 14 },
  'ray-dalio': { kind: 'wave', label: 'Two debt-cycle waves around a modest drift', annual: 0.09, vol: 0.012, period: 24, phase: 1.2, amp: 0.16 },
  'howard-marks': { kind: 'chop', label: 'Pendulum: uncomfortable first, then the easy money fades', annual: 0.08, vol: 0.028, crashAt: 8, crashDepth: 0.13, eventAt: 36, eventSize: 0.12 },
  'john-templeton': { kind: 'drawdown-first', label: 'Maximum-pessimism trough, then a global recovery', annual: 0.15, vol: 0.022, troughAt: 10 },
  'george-soros': { kind: 'spike', label: 'Long grind, one reflexivity spike, partial giveback', annual: 0.07, vol: 0.02, eventAt: 31, eventSize: 0.55 },
  'john-maynard-keynes': { kind: 'chop', label: 'Beauty-contest sideways, late consensus unwind', annual: 0.06, vol: 0.032, crashAt: 40, crashDepth: 0.16, eventAt: 14, eventSize: 0.09 },
  'alan-howard': { kind: 'wave', label: 'Liquidity wave — inverse to easy-money exuberance', annual: 0.07, vol: 0.014, period: 18, phase: 2.8, amp: 0.14 },
  'bill-gross': { kind: 'smooth', label: 'Bond-like grind with a duration scare', annual: 0.05, vol: 0.01, crashAt: 22, crashDepth: 0.14 },
  'john-paulson': { kind: 'spike', label: 'Quiet credit book, one crisis payoff, then flat', annual: 0.04, vol: 0.012, eventAt: 20, eventSize: 0.72 },
  'paul-tudor-jones': { kind: 'asymmetric', label: 'Defense: cuts the crash, keeps the inflection', annual: 0.14, vol: 0.03, crashAt: 12, crashDepth: 0.18 },
  'benjamin-graham': { kind: 'chop', label: 'Mr. Market: cheap pops, no hockey stick', annual: 0.08, vol: 0.024, eventAt: 9, eventSize: 0.11, crashAt: 27, crashDepth: 0.1 },
  'warren-buffett': { kind: 'smooth', label: 'Quality compounder, shallow holes, forever hold', annual: 0.14, vol: 0.012, crashAt: 19, crashDepth: 0.16 },
  'walter-schloss': { kind: 'chop', label: 'Cigar-butt scrapes: many small uglies, modest end', annual: 0.09, vol: 0.038, crashAt: 6, crashDepth: 0.08, eventAt: 21, eventSize: 0.07 },
  'john-neff': { kind: 'stairs', label: 'Dull GARP: modest steps, no drama', annual: 0.1, vol: 0.012, stepEvery: 8, stepSize: 0.07 },
  'seth-klarman': { kind: 'stairs', label: 'Cash for a long time, then two special-situation jumps', annual: 0.11, vol: 0.01, stepEvery: 16, stepSize: 0.18 },
  'chuck-akre': { kind: 'smooth', label: 'Compounding machine — steep and quiet', annual: 0.15, vol: 0.01, crashAt: 33, crashDepth: 0.11 },
  'terry-smith': { kind: 'tight', label: 'Buy good, do nothing: almost a straight line', annual: 0.13, vol: 0.006 },
  'hetty-green': { kind: 'tight', label: 'Fortress cash: tiny steps, no crash theater', annual: 0.06, vol: 0.005 },
  'duan-yongping': { kind: 'smooth', label: 'Business-you-can-explain compounder', annual: 0.13, vol: 0.014, crashAt: 26, crashDepth: 0.13 },
  'li-lu': { kind: 'hockey', label: 'Circle-of-competence grind, then a civilizational leg', annual: 0.17, vol: 0.022, inflectAt: 20, crashAt: 36, crashDepth: 0.2 },
  'peter-lynch': { kind: 'stairs', label: 'Ten-bagger discoveries: sit, jump, sit, jump', annual: 0.18, vol: 0.016, stepEvery: 7, stepSize: 0.11 },
  'bill-miller': { kind: 'boom-bust', label: 'Concentrated growth, one ugly stumble, then a second leg', annual: 0.16, vol: 0.036, crashAt: 18, crashDepth: 0.34 },
  'julian-robertson': { kind: 'wave', label: 'Long/short pair waves, not a single-name melt-up', annual: 0.11, vol: 0.016, period: 14, phase: 0.9, amp: 0.1 },
  'andreas-halvorsen': { kind: 'smooth', label: 'Industry-leader growth, moderate vol', annual: 0.13, vol: 0.018, crashAt: 21, crashDepth: 0.17 },
  'stephen-mandel': { kind: 'stairs', label: 'Growth/value cross-check: fewer, cleaner steps', annual: 0.12, vol: 0.014, stepEvery: 10, stepSize: 0.09 },
  'lee-ainslie': { kind: 'hockey', label: 'Tech/services unit-economics inflection', annual: 0.15, vol: 0.02, inflectAt: 18, crashAt: 32, crashDepth: 0.19 },
  'bill-ackman': { kind: 'boom-bust', label: 'Concentrated platform: campaign run, then a hole', annual: 0.17, vol: 0.03, crashAt: 24, crashDepth: 0.4 },
  'david-tepper': { kind: 'drawdown-first', label: 'Crisis print first, then the distress reversal', annual: 0.2, vol: 0.028, troughAt: 8 },
  'mohnish-pabrai': { kind: 'smooth', label: 'Cloned compounder, fewer names, slower line', annual: 0.12, vol: 0.016, crashAt: 29, crashDepth: 0.15 },
  'joel-greenblatt': { kind: 'stairs', label: 'Magic Formula ranks plus event jumps', annual: 0.14, vol: 0.014, stepEvery: 9, stepSize: 0.1 },
  'david-einhorn': { kind: 'chop', label: 'Accounting kill-shots: choppy, one down-spike', annual: 0.05, vol: 0.04, crashAt: 23, crashDepth: 0.22, eventAt: 7, eventSize: 0.06 },
  'michael-burry': { kind: 'spike', label: 'Long boredom, one inverted-model payoff', annual: 0.03, vol: 0.01, eventAt: 27, eventSize: 0.8 },
  'carl-icahn': { kind: 'boom-bust', label: 'Activist campaign: gap up, fight, gap down, settle', annual: 0.1, vol: 0.034, crashAt: 22, crashDepth: 0.3 },
  'dan-loeb': { kind: 'stairs', label: 'Letter, catalyst, next letter', annual: 0.11, vol: 0.02, stepEvery: 11, stepSize: 0.12 },
  'paul-singer': { kind: 'spike', label: 'Legal/credit option: years of nothing, then the contract', annual: 0.06, vol: 0.014, eventAt: 38, eventSize: 0.48 },
  'michael-steinhardt': { kind: 'chop', label: 'Variant perception: high-vol chop, not a compounder', annual: 0.09, vol: 0.045, crashAt: 17, crashDepth: 0.18, eventAt: 34, eventSize: 0.15 },
  'stanley-druckenmiller': { kind: 'spike', label: 'One concentrated shot, then protect', annual: 0.12, vol: 0.018, eventAt: 15, eventSize: 0.45 },
  'charlie-munger': { kind: 'tight', label: 'Sit on your ass: almost no activity, still up', annual: 0.12, vol: 0.007, crashAt: 40, crashDepth: 0.08 },
  'william-oneil': { kind: 'stairs', label: 'CANSLIM buy points: flat, breakout, flat', annual: 0.16, vol: 0.012, stepEvery: 6, stepSize: 0.09 },
  'mark-minervini': { kind: 'stairs', label: 'SEPA Stage-2 launches, tight risk', annual: 0.17, vol: 0.01, stepEvery: 8, stepSize: 0.12 },
  'richard-dennis': { kind: 'stairs', label: 'Turtle breakouts on a clock', annual: 0.13, vol: 0.01, stepEvery: 5, stepSize: 0.07 },
  'ed-seykota': { kind: 'asymmetric', label: 'Ride the tape, flatten the rest', annual: 0.15, vol: 0.026, crashAt: 17, crashDepth: 0.12 },
  'steve-cohen': { kind: 'chop', label: 'Short-horizon tape: many wiggles, modest drift', annual: 0.1, vol: 0.05, eventAt: 4, eventSize: 0.05, crashAt: 39, crashDepth: 0.09 },
  'jesse-livermore': { kind: 'asymmetric', label: 'Iron stop: the crash is a nick, not a hole', annual: 0.14, vol: 0.028, crashAt: 23, crashDepth: 0.1 },
  'bernard-baruch': { kind: 'peak-giveback', label: 'Sell into optimism — peak mid-path, leave the last eighth', annual: 0.11, vol: 0.016, peakAt: 32 },
  'nicolas-darvas': { kind: 'stairs', label: 'Box, jump, new box — break means flat', annual: 0.15, vol: 0.008, stepEvery: 7, stepSize: 0.1 },
  'philip-fisher': { kind: 'smooth', label: 'Scuttlebutt growth: hold through wobbles', annual: 0.14, vol: 0.02, crashAt: 15, crashDepth: 0.2 },
  'john-bogle': { kind: 'tight', label: 'Index accountability: boring 100 → ~140', annual: 0.085, vol: 0.008, crashAt: 25, crashDepth: 0.12 },
  'ed-thorp': { kind: 'tight', label: 'Kelly-sized edge: high SR, no hero spike', annual: 0.12, vol: 0.007 },
  'jim-simons': { kind: 'tight', label: 'Statistical grind: almost no narrative wiggle', annual: 0.14, vol: 0.005 },
  'ken-griffin': { kind: 'tight', label: 'Multi-strat: costs shaved, tiny dips', annual: 0.11, vol: 0.009, crashAt: 18, crashDepth: 0.06 },
  'david-shaw': { kind: 'tight', label: 'Engineered pipeline, low path drama', annual: 0.115, vol: 0.006 },
  'cliff-asness': { kind: 'factor-winter', label: 'Value winter, then the factor spring', annual: 0.1, vol: 0.016, springAt: 22 },
  'two-sigma': { kind: 'stairs', label: 'Alt-data cross-check: one information jump', annual: 0.1, vol: 0.008, stepEvery: 20, stepSize: 0.16 },
  'israel-englander': { kind: 'asymmetric', label: 'Platform loss-cap: flat bottom, no blow-up', annual: 0.1, vol: 0.02, crashAt: 27, crashDepth: 0.07 },
};

function hashSlug(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clampPoint(v: number): number {
  return Math.round(Math.max(52, Math.min(310, v)) * 10) / 10;
}

function maxDrawdown(points: number[]): number {
  let peak = points[0] ?? 100;
  let dd = 0;
  for (const p of points) {
    peak = Math.max(peak, p);
    dd = Math.min(dd, peak === 0 ? 0 : (p - peak) / peak);
  }
  return dd;
}

function monthlyDrift(annual: number): number {
  return annual / 12;
}

function applyCrash(i: number, spec: CurveSpec, rand: () => number): number {
  if (i === spec.crashAt) return -(spec.crashDepth ?? 0) * (0.85 + rand() * 0.2);
  if (i === spec.crashAt2) return -(spec.crashDepth2 ?? 0) * (0.85 + rand() * 0.2);
  return 0;
}

function buildPoints(spec: CurveSpec, rand: () => number): number[] {
  const n = 48;
  const pts: number[] = [100];
  const d = monthlyDrift(spec.annual);

  for (let i = 1; i < n; i += 1) {
    const prev = pts[i - 1] ?? 100;
    const noise = (rand() - 0.5) * spec.vol;
    let next = prev;

    switch (spec.kind) {
      case 'smooth':
      case 'tight': {
        next = prev * (1 + d + noise + applyCrash(i, spec, rand));
        break;
      }
      case 'hockey': {
        const inflect = spec.inflectAt ?? 18;
        const local = i < inflect ? d * 0.22 : d * 2.1;
        next = prev * (1 + local + noise + applyCrash(i, spec, rand));
        break;
      }
      case 'wave': {
        const amp = spec.amp ?? 0.12;
        const period = spec.period ?? 20;
        const phase = spec.phase ?? 0;
        const wave = 1 + amp * Math.sin((2 * Math.PI * i) / period + phase);
        next = 100 * Math.exp(d * i) * wave * (1 + noise * 0.35);
        break;
      }
      case 'spike': {
        const eventAt = spec.eventAt ?? 24;
        const size = spec.eventSize ?? 0.5;
        if (i === eventAt) next = prev * (1 + size);
        else if (i === eventAt + 1) next = prev * 0.94;
        else if (i === eventAt + 2) next = prev * 0.97;
        else next = prev * (1 + d * 0.45 + noise * 0.6);
        break;
      }
      case 'stairs': {
        const every = spec.stepEvery ?? 8;
        const size = spec.stepSize ?? 0.09;
        if (i % every === 0) next = prev * (1 + size);
        else next = prev * (1 + noise * 0.25);
        if (next < prev * 0.985) next = prev * 0.995;
        break;
      }
      case 'chop': {
        const mean = 100 + spec.annual * 420;
        next = prev + 0.16 * (mean - prev) + (rand() - 0.5) * spec.vol * 240;
        if (i === spec.eventAt) next = prev * (1 + (spec.eventSize ?? 0.1));
        if (i === spec.crashAt) next = prev * (1 - (spec.crashDepth ?? 0.12));
        break;
      }
      case 'boom-bust': {
        const crashAt = spec.crashAt ?? 24;
        if (i < crashAt) next = prev * (1 + d * 1.6 + noise);
        else if (i === crashAt) next = prev * (1 - (spec.crashDepth ?? 0.35));
        else next = prev * (1 + d * 1.15 + noise * 0.7);
        break;
      }
      case 'drawdown-first': {
        const trough = spec.troughAt ?? 12;
        if (i <= trough) next = prev * (0.965 - spec.vol * 0.4);
        else next = prev * (1 + d * 1.85 + noise);
        break;
      }
      case 'asymmetric': {
        let step = d + noise + applyCrash(i, spec, rand);
        if (step < 0) step *= 0.28;
        next = prev * (1 + step);
        break;
      }
      case 'peak-giveback': {
        const peak = spec.peakAt ?? 30;
        if (i <= peak) next = prev * (1 + d * 1.4 + noise * 0.5);
        else next = prev * (0.992 + noise * 0.2);
        break;
      }
      case 'factor-winter': {
        const spring = spec.springAt ?? 22;
        if (i < spring) next = prev * (1 - d * 0.7 + noise * 0.5);
        else next = prev * (1 + d * 2.2 + noise);
        break;
      }
      default:
        next = prev * (1 + d + noise);
    }

    pts.push(clampPoint(next));
  }
  return pts;
}

function buildCurve(slug: string, group: PipelineGroup): StylePath {
  const spec = CURVE_SPEC[slug] ?? {
    kind: 'smooth' as const,
    label: `${group} style sketch`,
    annual: 0.1,
    vol: 0.02,
  };
  const rand = mulberry32(hashSlug(slug) ^ 0x85ebca6b);
  const points = buildPoints(spec, rand);
  const dd = maxDrawdown(points);
  const end = points[points.length - 1] ?? 100;
  return {
    points,
    start: 100,
    end: Math.round(end * 10) / 10,
    maxDrawdownPct: Math.round(dd * 1000) / 10,
    shapeLabel: spec.label,
    caption:
      `Illustrative 48-month silhouette of ${spec.label.toLowerCase()}. Index 100 at month 0. Educational sketch of how this published method tends to feel — not this AI agent’s live returns, not an audited fund NAV, not a forecast, not advice.`,
  };
}

export function getMasterDossier(master: Master): MasterDossier {
  const g = GROUP_STYLE[master.group];
  const persona = getPersona(master.slug);
  const duty = DUTY[master.slug];
  const style =
    STYLE_COPY[master.slug] ??
    `${master.nameEn} sits in ${GROUP_META[master.group].label} as ${master.role}. Public method: ${master.methodology}`;

  const selectionSteps = [
    duty ? `Desk duty: ${duty}.` : `Role on the pipeline: ${master.role}.`,
    `Apply the published method: ${master.methodology}`,
    `Signature check: ${master.signature}`,
    ...(persona?.hardRules.slice(0, 2) ?? []),
    persona?.killsThesisIf[0]
      ? `Kill the name if ${persona.killsThesisIf[0]}.`
      : 'Write a falsifier. Isolation means you do not borrow a colleague’s excuse.',
  ].filter(Boolean);

  const screens = [
    duty,
    master.signature,
    ...(persona?.looksAt ?? []).slice(0, 3),
  ].filter((x, i, arr): x is string => Boolean(x) && arr.indexOf(x) === i);

  return {
    school: g.school,
    horizon: g.horizon,
    turnover: g.turnover,
    concentration: g.concentration,
    riskPosture: g.riskPosture,
    styleNarrative: [
      style,
      `${master.nameEn} is ${master.role} in ${GROUP_META[master.group].label} (${master.era}). The voice on this seat is anchored to: “${master.quote}”`,
      `This page is a simulated research seat built from public books, letters, and methodology cards. It is not ${master.nameEn}’s fund, not a live audited track record, and not a recommendation to buy or sell anything.`,
    ].join('\n\n'),
    selectionIntro: `How ${master.nameEn} would screen a US name on this desk — isolated, with no view of the other drafts. ${duty ?? master.role}.`,
    selectionSteps,
    screens,
    avoids: AVOIDS[master.group],
    curve: buildCurve(master.slug, master.group),
  };
}
