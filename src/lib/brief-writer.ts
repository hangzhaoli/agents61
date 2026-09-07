/**
 * Long-form isolated briefs: explicit stance, why, and a longer analysis.
 * Never “you should buy.” Missing numbers stay missing.
 */

import type { CryptoSnapshot } from '@/lib/data/crypto';
import type { Fundamentals } from '@/lib/data/fundamentals';
import { CRYPTO_THEMES, getCryptoAsset } from '@/lib/crypto-universe';
import { EM_NAMES, EM_THEMES, getEmName } from '@/lib/emerging-markets';
import { CANDIDATES, CYCLE_SNAPSHOT, TREND_THEMES } from '@/lib/opportunities';
import { getPersona } from '@/lib/personas';
import { getPrivateCompany } from '@/lib/private-universe';
import type { Master } from '@/lib/masters';
import { CYCLE_DUTIES, GROWTH_SCREENS, TREND_DUTIES, VALUE_SCREENS } from '@/lib/pipeline';

export type BriefKind = 'ticker' | 'opportunity' | 'crypto' | 'emerging' | 'private';
export type DraftStance = 'constructive' | 'cautious' | 'skeptical' | 'inconclusive';

export type BriefDraft = {
  slug: string;
  nameEn: string;
  role: string;
  group: Master['group'];
  stance: DraftStance;
  looksAt: string;
  thesis: string;
  why: string;
  finding: string;
  risks: string;
  wouldChangeMind: string;
  sourceLine: string;
};

function clip(s: string, n: number): string {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}

function pct(n: number | null): string | null {
  if (n == null || Number.isNaN(n)) return null;
  return `${(n * 100).toFixed(1)}%`;
}

function ratio(n: number | null, digits = 1): string | null {
  if (n == null || Number.isNaN(n)) return null;
  return n.toFixed(digits);
}

function moneyFact(n: number | null): string | null {
  if (n == null || Number.isNaN(n)) return null;
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  return `${sign}$${abs.toFixed(0)}`;
}

function filingLine(facts: Fundamentals): string {
  const bits = [
    facts.form && facts.fiscalYear
      ? `${facts.form}${facts.fiscalPeriod ? ` ${facts.fiscalPeriod}` : ''} FY${facts.fiscalYear}${
          facts.periodKind === 'interim' ? ' interim' : ''
        }`
      : null,
    facts.revenue != null
      ? `revenue ${moneyFact(facts.revenue)}${facts.periodKind === 'interim' ? ' YTD' : ''}`
      : null,
    facts.revenueYoY != null ? `revenue YoY ${pct(facts.revenueYoY)}` : null,
    facts.netIncome != null ? `net income ${moneyFact(facts.netIncome)}` : null,
    facts.roe != null ? `ROE ${pct(facts.roe)}` : null,
    facts.debtToEquity != null ? `LT debt/equity ${facts.debtToEquity.toFixed(2)}` : null,
    facts.pe != null ? `P/E ${ratio(facts.pe)}` : facts.peNm ? 'P/E n/m' : null,
    facts.pb != null ? `P/B ${ratio(facts.pb)}` : null,
    facts.ps != null ? `P/S ${ratio(facts.ps)}` : null,
    facts.price != null ? `price $${facts.price.toFixed(2)} cached` : null,
  ].filter(Boolean);
  if (!bits.length) {
    return facts.error
      ? `Filings incomplete (${facts.error}) — methodology only, no invented numbers.`
      : 'Filings incomplete — methodology only, no invented numbers.';
  }
  return `On file: ${bits.join('; ')}.`;
}

function cryptoLine(snap: CryptoSnapshot | null): string {
  if (!snap || snap.error) {
    return snap?.error
      ? `On-chain/price snapshot incomplete (${snap.error}) — methodology only.`
      : 'No crypto snapshot — methodology only, no invented series.';
  }
  const bits = [
    snap.change24h != null ? `24h ${(snap.change24h * 100).toFixed(1)}%` : null,
    snap.change7d != null ? `7d ${(snap.change7d * 100).toFixed(1)}%` : null,
    snap.marketCap != null ? `mkt cap snapshot on file` : null,
  ].filter(Boolean);
  return bits.length
    ? `Public snapshot (${snap.source}, cached): ${bits.join(', ')}. Not a live quote.`
    : 'Public snapshot thin — methodology only.';
}

function stanceForEquity(master: Master, facts: Fundamentals): DraftStance {
  if (facts.error && facts.roe == null && facts.revenueYoY == null && facts.pe == null) {
    return 'inconclusive';
  }
  const roe = facts.roe;
  const yoy = facts.revenueYoY;
  const dte = facts.debtToEquity;
  const pe = facts.pe;
  const pb = facts.pb;

  if (master.group === 'debate' || master.group === 'exit') {
    if (dte != null && dte > 2) return 'skeptical';
    if (yoy != null && yoy < 0) return 'skeptical';
    if (pe != null && pe > 40) return 'skeptical';
    return 'cautious';
  }
  if (master.group === 'value' || master.group === 'quant') {
    if (pb != null && pb < 1.5 && roe != null && roe > 0.1) return 'constructive';
    if (roe != null && roe > 0.2 && (dte == null || dte < 2.5)) return 'constructive';
    if (roe != null && roe < 0.08) return 'skeptical';
    if (pe != null && pe > 35 && (yoy == null || yoy < 0.05)) return 'skeptical';
    return 'cautious';
  }
  if (master.group === 'growth' || master.group === 'trend' || master.group === 'timing') {
    if (yoy != null && yoy > 0.08) return 'constructive';
    if (yoy != null && yoy < 0) return 'skeptical';
    return 'cautious';
  }
  return 'cautious';
}

function stanceForCrypto(master: Master, snap: CryptoSnapshot | null): DraftStance {
  if (master.group === 'value') return 'cautious';
  if (master.group === 'debate' || master.group === 'exit') return 'skeptical';
  if (!snap || snap.error) return 'inconclusive';
  const d7 = snap.change7d;
  if (master.group === 'trend' || master.group === 'growth' || master.group === 'timing') {
    if (d7 != null && d7 > 0.08) return 'constructive';
    if (d7 != null && d7 < -0.12) return 'skeptical';
    return 'cautious';
  }
  if (master.group === 'quant') return 'cautious';
  return 'cautious';
}

const STANCE_LINE: Record<DraftStance, string> = {
  constructive: 'Constructive — the work is worth continuing, not an order.',
  cautious: 'Cautious — the file is open, the bar is not cleared.',
  skeptical: 'Skeptical — the burden of proof is on the bull case.',
  inconclusive: 'Inconclusive — missing facts; this seat will not invent them.',
};

function wrap(
  master: Master,
  stance: DraftStance,
  looksAt: string,
  thesis: string,
  why: string,
  finding: string,
  risks: string,
  sourceLine: string,
  kill: string
): BriefDraft {
  return {
    slug: master.slug,
    nameEn: master.nameEn,
    role: master.role,
    group: master.group,
    stance,
    looksAt,
    thesis,
    why,
    finding,
    risks,
    wouldChangeMind: `This seat flips if: ${kill}.`,
    sourceLine,
  };
}

export function draftIndependentBrief(
  master: Master,
  subject: string,
  facts: Fundamentals,
  question: string,
  kind: BriefKind = 'ticker',
  crypto: CryptoSnapshot | null = null
): BriefDraft {
  if (kind === 'opportunity') return draftOpportunity(master, question);
  if (kind === 'crypto') return draftCrypto(master, subject, question, crypto);
  if (kind === 'emerging') return draftEmerging(master, subject, facts, question);
  if (kind === 'private') return draftPrivate(master, subject, question);
  return draftEquity(master, subject, facts, question);
}

function draftPrivate(master: Master, subject: string, question: string): BriefDraft {
  const co = getPrivateCompany(subject.toLowerCase());
  const name = co?.name ?? subject;
  const mark = co?.lastValuationLabel ?? 'secondary mark not on file';
  const persona = getPersona(master.slug);
  const looks = persona?.looksAt?.[0] ?? 'secondary mark vs. business quality';
  const kill = persona?.killsThesisIf?.[0] ?? 'the mark embeds perfection with no path to liquidity';
  const stance: DraftStance = master.group === 'debate' ? 'skeptical' : master.group === 'value' ? 'cautious' : 'inconclusive';
  const q = question.trim() || `Research ${name} as a private subject.`;
  return wrap(
    master,
    stance,
    looks,
    `${STANCE_LINE[stance]} ${name} is a private-desk name — ${mark}. Not EDGAR.`,
    `Why: private marks are stale and non-executable. ${persona?.hardRules?.[0] ?? master.methodology}`,
    `On “${q}”. ${name} is researched without SEC companyfacts. Secondary mark: ${mark}. Comparables: ${co?.comparableTickers.join(', ') ?? 'none listed'}. This seat will not invent cap-table numbers.`,
    'Main risk: treating a media valuation as an investable price.',
    'Private desk · secondary marks · methodology card',
    kill
  );
}

function draftEquity(
  master: Master,
  ticker: string,
  facts: Fundamentals,
  question: string
): BriefDraft {
  const t = ticker.toUpperCase();
  const persona = getPersona(master.slug);
  const looks = persona?.looksAt?.[0] ?? master.methodology.split('.')[0];
  const kill = persona?.killsThesisIf?.[0] ?? 'the story requires a greater fool or a multiple re-rate to work';
  const filings = filingLine(facts);
  const stance = stanceForEquity(master, facts);
  const q = question.trim() || `Research ${t} as a US-listed name.`;
  const rule = persona?.hardRules?.[0] ?? master.methodology;
  const rule2 = persona?.hardRules?.[1] ?? master.signature;
  const voiceBit = persona?.voice?.split('.')[0] ?? master.era;
  const pe =
    facts.pe != null ? `P/E ${facts.pe.toFixed(1)}` : facts.peNm ? 'P/E n/m' : 'P/E not on file';
  const pb = facts.pb != null ? `P/B ${facts.pb.toFixed(2)}` : 'P/B not on file';
  const roe = facts.roe != null ? `ROE ${(facts.roe * 100).toFixed(1)}%` : 'ROE not on file';
  const yoy = facts.revenueYoY != null ? `revenue YoY ${(facts.revenueYoY * 100).toFixed(1)}%` : 'revenue YoY not on file';

  const ni = facts.netIncome != null ? `net income ${moneyFact(facts.netIncome)}` : 'net income not on file';
  const rev = facts.revenue != null ? `revenue ${moneyFact(facts.revenue)}${facts.periodKind === 'interim' ? ' YTD' : ''}` : 'revenue not on file';
  const frame =
    stance === 'skeptical'
      ? 'Underwrite frame: Pass for now.'
      : facts.error && facts.revenue == null
        ? 'Underwrite frame: Insufficient facts.'
        : 'Underwrite frame: Worth further homework.';

  const thesisByGroup: Record<Master['group'], string> = {
    trend: `${STANCE_LINE[stance]} On ${t}, I care whether the decade capital flow still funds this vehicle — ${yoy}, ${rev}.`,
    cycle: `${STANCE_LINE[stance]} ${t} sits on the thermometer before any multiple debate — ${CYCLE_SNAPSHOT.phase} at ${CYCLE_SNAPSHOT.temperature}.`,
    value: `${STANCE_LINE[stance]} Owner test on ${t}: ${pe}, ${pb}, ${roe}, ${ni}.`,
    growth: `${STANCE_LINE[stance]} Classify ${t} before cheering growth. ${yoy}. ${pe}.`,
    debate: `${STANCE_LINE[stance]} Invert ${t} first. What has to be false for the bull to die?`,
    timing: `${STANCE_LINE[stance]} No trigger, no implied entry on ${t} — quality seats do not move this pencil.`,
    exit: `${STANCE_LINE[stance]} Holding ${t} is not the default. Sell rule first.`,
    quant: `${STANCE_LINE[stance]} ${t} is a distribution. ${pe}; ${pb}. Thin sample → smaller size.`,
  };

  const whyByGroup: Record<Master['group'], string> = {
    trend: `Why: ${clip(rule, 140)}. If the industry is not on the decade map, I pass without a speech. ${filings}`,
    cycle: `Why: cycle first. ${CYCLE_SNAPSHOT.dalio} A hot reading is not a ticket. ${filings}`,
    value: `Why: ${voiceBit}. I want a business I would own in full. ${filings}`,
    growth: `Why: ${clip(master.signature, 120)}. Unclassified growth is a narrative. ${filings}`,
    debate: `Why: kill-shot seat. ${clip(rule, 140)} Footnotes beat stories. ${filings}`,
    timing: `Why: without a stage/breakout/turtle trigger, a good business is still not an entry.`,
    exit: `Why: ${clip(master.signature, 120)}. Hope is not a position.`,
    quant: `Why: if edge is not measurable, Kelly ceiling collapses. ${filings}`,
  };

  const findingByGroup: Record<Master['group'], string> = {
    trend: `Question: “${clip(q, 100)}”.\n\nBusiness dig: ${t} must still sit inside a funded decade theme — not a tourist ticker. On file: ${rev}; ${yoy}.\n\nMethod: ${clip(rule, 160)}. Second rule: ${clip(rule2, 120)}.\n\nVariant view: the tape often prices the theme; this seat prices whether ${t} is the vehicle.\n\n${frame}`,
    cycle: `Question: “${clip(q, 100)}”.\n\nRegime first: ${CYCLE_SNAPSHOT.phase}, thermometer ${CYCLE_SNAPSHOT.temperature}. ${CYCLE_SNAPSHOT.dalio}\n\nOn ${t}: ${filings}\n\nI will not time an entry from this chair. I will say whether the print smells mid-cycle or peak.\n\n${frame}`,
    value: `Question: “${clip(q, 100)}”.\n\nOwner earnings lens on ${t}. ${voiceBit}. Hard rule: ${clip(rule, 150)}.\n\nNumbers on file: ${pe}; ${pb}; ${roe}; ${ni}; ${yoy}. ${filings}\n\nA low multiple that needs a hero story is not a margin of safety. A rich multiple with durable ROE can still be a business — but then price is the risk.\n\n${frame}`,
    growth: `Question: “${clip(q, 100)}”.\n\nClassify before multiple. ${clip(master.signature, 140)}.\n\n${yoy}. ${pe}. ${rev}. ${filings}\n\nFast growth with no category is how you buy a story. Stalwart growth with a broken category is how you overstay.\n\n${frame}`,
    debate: `Question: “${clip(q, 100)}”.\n\nInvert ${t}. ${clip(rule, 160)}.\n\n${filings}\n\nName what must be true for the bull: earnings quality, leverage (${facts.debtToEquity != null ? facts.debtToEquity.toFixed(2) : 'D/E not on file'}), and whether footnotes hide the cycle. If I cannot name the kill path, I am not doing the job.\n\n${frame}`,
    timing: `Question: “${clip(q, 100)}”.\n\nTrigger or nothing. ${filings}\n\nStage / breakout / turtle — pick the method this seat uses. A constructive quality seat elsewhere does not create an entry here.\n\n${frame}`,
    exit: `Question: “${clip(q, 100)}”.\n\nSell rules first. ${clip(master.signature, 140)}.\n\n${filings}\n\nIf the reason to stay is hope, the seat is already late. Write the violation that forces a sale.\n\n${frame}`,
    quant: `Question: “${clip(q, 100)}”.\n\n${t} is a return distribution, not a feeling. ${filings}\n\n${pe}; ${pb}. If sample is thin or correlations hid risk, size shrinks. Kelly is a ceiling.\n\n${frame}`,
  };

  const risksByGroup: Record<Master['group'], string> = {
    trend: `Main risk: the era is right and the vehicle is wrong — or the era has already been bid.`,
    cycle: `Main risk: treating a regime note as a timing ticket.`,
    value: `Main risk: a multiple that looks cheap because earnings are peak, or a quality story that needs the multiple to re-rate.`,
    growth: `Main risk: mis-classification — a cyclical labeled a compounder.`,
    debate: `Main risk: the fraud/cycle path is in the footnotes and the bull case ignores it.`,
    timing: `Main risk: entering because the committee liked the business.`,
    exit: `Main risk: moving the stop because the story is still pretty.`,
    quant: `Main risk: overfitting a short sample or sizing as if variance were known.`,
  };

  return wrap(
    master,
    stance,
    looks,
    thesisByGroup[master.group],
    whyByGroup[master.group],
    findingByGroup[master.group],
    risksByGroup[master.group],
    filings,
    kill
  );
}

function draftOpportunity(master: Master, question: string): BriefDraft {
  const persona = getPersona(master.slug);
  const looks = persona?.looksAt?.[0] ?? master.methodology.split('.')[0];
  const kill = persona?.killsThesisIf?.[0] ?? 'the story requires a greater fool or a multiple re-rate to work';
  const q = clip(question, 110);
  const theme = TREND_THEMES.find((t) => t.sponsor === master.slug || t.validator === master.slug);
  const name = CANDIDATES.find((c) => c.sponsor === master.slug);
  let stance: DraftStance = 'cautious';
  let thesis = STANCE_LINE.cautious;
  let why = 'Opportunity scan is pipeline 1–3 only.';
  let finding = '';
  let risks = 'A name on the board is homework, not an order.';
  let sourceLine = 'Weekly opportunity board · research simulation, not a live scan.';

  if (master.group === 'trend') {
    const duty = TREND_DUTIES[master.slug] ?? master.role;
    if (theme) {
      stance = theme.strength >= 7 ? 'constructive' : 'cautious';
      thesis = `${STANCE_LINE[stance]} Era map: ${theme.title}.`;
      why = `Why: ${duty}. Strength ${theme.strength}/10 is a committee score, not a forecast.`;
      finding = `On “${q}”. This seat only maps the decade. ${duty}. This week’s card: ${theme.title} (strength ${theme.strength}/10; ${theme.industries.join(', ')}). I am not picking a ticker from this chair. If the theme is bid past the work, the map still exists — the vehicle may not. Isolated: I have not seen the value or growth lists.`;
      sourceLine = `Trend board · ${theme.id}`;
    } else {
      finding = `On “${q}”. ${duty}. No sponsored theme on this week’s board — this seat stays a map, not a name.`;
    }
  } else if (master.group === 'cycle') {
    const duty = CYCLE_DUTIES[master.slug] ?? master.role;
    stance = CYCLE_SNAPSHOT.temperature >= 70 ? 'skeptical' : 'cautious';
    thesis = `${STANCE_LINE[stance]} Thermometer ${CYCLE_SNAPSHOT.temperature} · ${CYCLE_SNAPSHOT.phase}.`;
    why = `Why: ${duty}. Regime first. Boom/recovery/stagflation/recession probabilities on the board are a scenario fan, not a call.`;
    finding = `On “${q}”. ${duty}. Thermometer ${CYCLE_SNAPSHOT.temperature} · ${CYCLE_SNAPSHOT.phase}. ${CYCLE_SNAPSHOT.dalio} ${CYCLE_SNAPSHOT.marks} This is a phase reading. I will not turn it into an entry. Late expansion is when people confuse a rising tape with a cleared risk list.`;
    sourceLine = `Cycle meter · ${CYCLE_SNAPSHOT.updated}`;
    risks = 'Main risk: using the thermometer as a buy/sell switch.';
  } else if (master.group === 'value') {
    const screen = VALUE_SCREENS[master.slug] ?? master.methodology;
    if (name) {
      stance = 'constructive';
      thesis = `${STANCE_LINE[stance]} Sample on the value track: ${name.ticker} (${name.name}).`;
      why = `Why: screen is ${clip(screen, 140)}. The name is a homework file, not a ticket.`;
      finding = `On “${q}”. Value/quality track, written alone. Screen: ${clip(screen, 180)}. Sample name: ${name.ticker} (${name.name}) — ${name.reason} I would want the filings, the P/E and P/B when they exist, and a reason the earnings are not peak. This is not a buy. It is a name that survived this seat’s screen this week.`;
      sourceLine = `Dual-track pool · ${name.ticker}`;
    } else {
      finding = `On “${q}”. ${clip(screen, 180)}. No sample name on this desk’s value board — seat stays a screen.`;
    }
  } else if (master.group === 'growth') {
    const screen = GROWTH_SCREENS[master.slug] ?? master.methodology;
    if (name) {
      stance = 'constructive';
      thesis = `${STANCE_LINE[stance]} Sample on the growth track: ${name.ticker} (${name.name}).`;
      why = `Why: classify first. ${clip(screen, 140)}`;
      finding = `On “${q}”. Growth/opportunity track, written alone. Classify: ${clip(screen, 180)}. Sample: ${name.ticker} (${name.name}) — ${name.reason} Category mistakes are how stalwarts get bought as ten-baggers. Not a buy.`;
      sourceLine = `Dual-track pool · ${name.ticker}`;
    } else {
      finding = `On “${q}”. ${clip(screen, 180)}. No sample name on this desk’s growth board — seat stays a classification.`;
    }
  } else {
    stance = 'inconclusive';
    thesis = STANCE_LINE.inconclusive;
    why = 'This seat is not part of opportunity scan (steps 1–3).';
    finding = `On “${q}”: this seat is not part of the opportunity scan (steps 1–3).`;
  }

  return wrap(master, stance, looks, thesis, why, finding, risks, sourceLine, kill);
}

function draftCrypto(
  master: Master,
  symbol: string,
  question: string,
  snap: CryptoSnapshot | null
): BriefDraft {
  const persona = getPersona(master.slug);
  const looks = persona?.looksAt?.[0] ?? master.methodology.split('.')[0];
  const kill = persona?.killsThesisIf?.[0] ?? 'the token requires a greater fool or a narrative re-rate to work';
  const q = question.trim() || `Research ${symbol} as a crypto/on-chain subject.`;
  const asset = getCryptoAsset(symbol) ?? snap?.asset;
  const label = asset ? `${asset.symbol} (${asset.name})` : symbol.toUpperCase();
  const filings = cryptoLine(snap);
  const stance = symbol ? stanceForCrypto(master, snap) : 'inconclusive';
  const theme = CRYPTO_THEMES[0];

  if (!symbol || symbol === 'BOARD' || symbol === 'CRYPTO') {
    const board = CRYPTO_THEMES.map((t) => `${t.title} (${t.strength}/10)`).join('; ');
    return wrap(
      master,
      master.group === 'debate' ? 'skeptical' : 'cautious',
      looks,
      `${STANCE_LINE.cautious} Crypto board — no single token underwritten.`,
      `Why: ${clip(master.methodology, 160)} Tokens without cash flows fail a classic owner test unless this seat has a different job.`,
      `On “${clip(q, 110)}”. Blockchain research module, isolated. This week’s map: ${board}. ${asset?.thesis ?? 'No single asset named.'} I will not turn a sector map into a ticket. On-chain APIs (MVRV, fees, TVL) are hooks — unconfigured series stay blank. ${filings}`,
      'Main risk: treating a token tape as a business because the chart is up.',
      'Crypto opportunity board · research simulation.',
      kill
    );
  }

  const groupFinding: Record<Master['group'], string> = {
    trend: `On “${clip(q, 110)}”. ${label} against the crypto era map (${theme.title}). ${asset?.thesis ?? ''} ${filings} This is theme fit, not a target. Isolated — I have not seen the value seat call it un-ownable.`,
    cycle: `On “${clip(q, 110)}”. ${label} on the same thermometer as risk assets. ${CYCLE_SNAPSHOT.phase} at ${CYCLE_SNAPSHOT.temperature}. Crypto beta usually widens in late expansion. Phase reading only. ${filings}`,
    value: `On “${clip(q, 110)}”. ${label} usually fails a cash-flow owner test. ${asset?.thesis ?? ''} If this seat stays involved, it is as a scarce asset or a fee business — not as a P/E. ${filings} I will not invent a multiple. Stance stays honest: most tokens are not Graham paper.`,
    growth: `On “${clip(q, 110)}”. Classify ${label} before the tape. Usage, developers, fee capture — or it is a story. ${asset?.thesis ?? ''} ${filings} Category first. Not a buy.`,
    debate: `On “${clip(q, 110)}”. Invert ${label}. ${asset?.risks ?? 'Issuer, contract, and policy risk.'} Leverage, listings, and circular TVL are the usual kill-shots. ${filings} This seat is not here to bless a narrative.`,
    timing: `On “${clip(q, 110)}”. Trigger on ${label}, not a white paper. ${filings} No implied entry.`,
    exit: `On “${clip(q, 110)}”. Sell rules for ${label} are path-dependent and often ignored. ${asset?.risks ?? ''} ${filings} Holding is not the default.`,
    quant: `On “${clip(q, 110)}”. ${label} is a fat-tailed series. Size as if variance is understated. ${filings} No formula turns a meme into an edge.`,
  };

  return wrap(
    master,
    stance,
    looks,
    `${STANCE_LINE[stance]} ${label} — crypto/on-chain research, not an equity multiple.`,
    `Why: ${clip(persona?.hardRules?.[0] ?? master.methodology, 180)} ${asset?.thesis ?? ''} Cash-flow tools (P/E, P/B) do not apply unless a real business sits underneath.`,
    groupFinding[master.group],
    asset?.risks ?? 'Main risk: policy, custody, and narrative reflexivity.',
    filings,
    kill
  );
}

function draftEmerging(
  master: Master,
  ticker: string,
  facts: Fundamentals,
  question: string
): BriefDraft {
  const t = ticker.toUpperCase();
  const em = getEmName(t);
  const base = t && t !== 'BOARD' && t !== 'EM' ? draftEquity(master, t, facts, question) : null;
  const persona = getPersona(master.slug);
  const looks = persona?.looksAt?.[0] ?? master.methodology.split('.')[0];
  const kill =
    em?.killShot ??
    persona?.killsThesisIf?.[0] ??
    'policy, listing structure, or FX makes the residual claim unownable';

  if (!base) {
    const board = EM_THEMES.map((x) => x.title).join('; ');
    const samples = EM_NAMES.slice(0, 4)
      .map((n) => `${n.ticker} (${n.region})`)
      .join(', ');
    return wrap(
      master,
      master.group === 'debate' ? 'skeptical' : 'cautious',
      looks,
      `${STANCE_LINE.cautious} Emerging-market board — US-listed window only.`,
      `Why: ${clip(master.methodology, 160)} ADRs and local policy are different files.`,
      `On “${clip(question, 110)}”. EM opportunity scan. Themes: ${board}. Sample window: ${samples}. Templeton-style work starts with pessimism and price, not GDP slogans. China ADRs need a structure test. India quality needs a credit test. LatAm platforms hide a credit cycle. This is not a local-exchange ticket and not a buy list.`,
      'Main risk: treating country GDP as a portfolio.',
      'Emerging-market board · US listings.',
      kill
    );
  }

  const overlay = em
    ? ` EM overlay: ${em.region} · ${em.theme}. ${em.whyOnBoard} Kill-shot unique to this listing: ${em.killShot}.`
    : ` EM overlay: US-listed emerging-market window. Policy, FX, and listing structure sit beside P/E and P/B.`;

  return {
    ...base,
    looksAt: looks,
    thesis: `${base.thesis}${em ? ` Region: ${em.region}.` : ''}`,
    why: `${base.why}${overlay}`,
    finding: `${base.finding}${overlay} Isolated: I am not averaging a country ETF view with this name.`,
    risks: `${base.risks}${em ? ` EM-specific: ${em.killShot}` : ' EM-specific: policy and listing structure.'}`,
    wouldChangeMind: `This seat flips if: ${kill}.`,
  };
}
