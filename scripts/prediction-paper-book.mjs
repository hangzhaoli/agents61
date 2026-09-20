/**
 * Internal virtual-money paper book for Prediction Markets.
 *
 * Opens simulated positions at Polymarket YES mid when Agents61 |gap| clears
 * filters. Default engine: DeepSeek Pro clerk (+ Tavily news when keyed).
 *
 * Usage:
 *   node --env-file=.env.paper.local scripts/prediction-paper-book.mjs
 *   node --env-file=.env.paper.local scripts/prediction-paper-book.mjs --settle
 *
 * Honesty: fills = mid, zero fees/slippage. Template-only gaps are NOT edge.
 * Realized P&L only after --settle when Gamma shows closed.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(root, 'scripts/output');
const LEDGER_PATH = resolve(OUT_DIR, 'prediction-paper-book.json');
const GAMMA = 'https://gamma-api.polymarket.com';
/** Prefer site API — Gamma often times out from CN networks. */
const MARKETS_API = 'https://agents61.com/api/prediction/markets';
const DEEPSEEK = 'https://api.deepseek.com/chat/completions';

const args = new Set(process.argv.slice(2));
const SETTLE = args.has('--settle');
const TEMPLATE_ONLY = args.has('--template-only');
const LIMIT = Number(process.argv.find((a, i, arr) => arr[i - 1] === '--limit') ?? 6);
const MIN_GAP = Number(process.argv.find((a, i, arr) => arr[i - 1] === '--min-gap') ?? 6);
const STAKE = Number(process.argv.find((a, i, arr) => arr[i - 1] === '--stake') ?? 100);
const BANKROLL = Number(process.argv.find((a, i, arr) => arr[i - 1] === '--bankroll') ?? 1000);
const MIN_VOL = Number(process.argv.find((a, i, arr) => arr[i - 1] === '--min-vol') ?? 50_000);

function loadEnvFile(name) {
  const p = resolve(root, name);
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (!m || process.env[m[1]]) continue;
    process.env[m[1]] = m[2].replace(/^"|"$/g, '');
  }
}
loadEnvFile('.env.paper.local');
loadEnvFile('.env.local');

function clamp(n, lo = 1, hi = 99) {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function hashSeed(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function parsePrices(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(Number).filter(Number.isFinite);
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(Number).filter(Number.isFinite);
  } catch {
    /* ignore */
  }
  return [];
}

function yesPct(m) {
  const prices = parsePrices(m.outcomePrices);
  if (!prices.length || !Number.isFinite(prices[0])) return null;
  const p = prices[0];
  const pct = p <= 1.0001 ? p * 100 : p;
  return Math.max(0, Math.min(100, Math.round(pct * 10) / 10));
}

function volOf(m) {
  if (typeof m.volumeNum === 'number') return m.volumeNum;
  if (typeof m.volume24hr === 'number') return m.volume24hr;
  const v = Number(m.volume);
  return Number.isFinite(v) ? v : 0;
}

function categoryOf(q) {
  const s = q.toLowerCase();
  if (/\b(btc|bitcoin|eth|crypto|solana)\b/.test(s)) return 'crypto';
  if (/\b(fed|rate|recession|gdp|cpi|oil)\b/.test(s)) return 'macro';
  if (/\b(election|president|senate|trump|democrat|republican)\b/.test(s)) return 'politics';
  if (/\b(ai|openai|ipo|spacex|nvidia|apple)\b/.test(s)) return 'tech';
  if (/\b(war|ukraine|china|taiwan|nato)\b/.test(s)) return 'geopolitics';
  return 'general';
}

async function fetchActiveMarkets(limit = 40) {
  try {
    const res = await fetch(MARKETS_API, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(25_000),
    });
    if (res.ok) {
      const json = await res.json();
      const rows = Array.isArray(json.markets) ? json.markets : [];
      if (rows.length) {
        return rows.slice(0, limit).map((m) => ({
          id: String(m.id),
          slug: String(m.slug || m.id),
          question: String(m.question || ''),
          marketProbability: Number(m.marketProbability),
          volumeUsd: Number(m.volumeUsd) || 0,
          endDate: m.endDate || null,
          description: String(m.description || m.question || ''),
          url: String(m.url || `https://polymarket.com/market/${m.slug || m.id}`),
          category: String(m.category || categoryOf(String(m.question || ''))),
          closed: false,
        }));
      }
    }
  } catch (e) {
    console.warn('Site markets API failed, trying Gamma…', e.message || e);
  }

  const url = new URL(`${GAMMA}/markets`);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('active', 'true');
  url.searchParams.set('closed', 'false');
  url.searchParams.set('order', 'volume24hr');
  url.searchParams.set('ascending', 'false');
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`Gamma ${res.status}`);
  const json = await res.json();
  const rows = Array.isArray(json) ? json : json.markets;
  return (rows || [])
    .map((raw) => {
      const question = (raw.question || raw.title || '').trim();
      const mid = yesPct(raw);
      const id = String(raw.id ?? raw.conditionId ?? '');
      if (!question || mid == null || !id) return null;
      if (question.toLowerCase().includes('test')) return null;
      const endDate = raw.endDateIso || raw.endDate || null;
      const slug = String(raw.slug || id);
      const eventSlug = raw.events?.[0]?.slug;
      return {
        id,
        slug,
        question,
        marketProbability: mid,
        volumeUsd: volOf(raw),
        endDate,
        description: (raw.description || '').trim() || question,
        url: eventSlug
          ? `https://polymarket.com/event/${eventSlug}`
          : `https://polymarket.com/market/${slug}`,
        category: categoryOf(question),
        closed: Boolean(raw.closed),
        clobTokenIds: raw.clobTokenIds,
      };
    })
    .filter(Boolean);
}

async function fetchMarketById(id) {
  const url = new URL(`${GAMMA}/markets`);
  url.searchParams.set('id', id);
  url.searchParams.set('limit', '1');
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) return null;
  const json = await res.json();
  const rows = Array.isArray(json) ? json : json.markets;
  const raw = rows?.[0];
  if (!raw) return null;
  const mid = yesPct(raw);
  if (mid == null) return null;
  return {
    id: String(raw.id ?? id),
    marketProbability: mid,
    closed: Boolean(raw.closed),
    question: (raw.question || raw.title || '').trim(),
  };
}

async function tavilyNews(question) {
  const key = process.env.TAVILY_API_KEY?.trim();
  if (!key) return [];
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: key,
        query: question.slice(0, 180),
        search_depth: 'basic',
        max_results: 4,
      }),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.results || []).slice(0, 4).map((r) => String(r.title || r.content || '').slice(0, 160));
  } catch {
    return [];
  }
}

function templateEstimate(market) {
  const m = market.marketProbability;
  const seed = hashSeed(market.id + market.question);
  const drift = (seed % 17) - 8;
  const base = clamp(40 + (seed % 21) - 10);
  const implied = [
    clamp(m + drift * 0.4),
    clamp(m),
    base,
    clamp(m + drift * 0.6),
    clamp(m),
    clamp(m * 0.55 + base * 0.45 + drift * 0.3),
    clamp(100 - m + drift * 0.2),
    clamp(m - Math.abs(drift) * 0.5),
  ];
  const avg = implied.reduce((a, b) => a + b, 0) / implied.length;
  const agents61 = clamp(avg * 0.7 + m * 0.3);
  return {
    agents61Probability: agents61,
    probabilityGap: Math.round((agents61 - m) * 10) / 10,
    confidence: Math.abs(agents61 - m) >= 12 ? 'Medium' : 'Low',
    engine: 'template',
    resolutionRisk: market.description.length < 80 ? 'High' : 'Medium',
  };
}

async function clerkRefine(market, draft, newsBullets) {
  const key = process.env.DEEPSEEK_API_KEY?.trim();
  if (!key) throw new Error('DEEPSEEK_API_KEY missing');
  const newsSection =
    newsBullets.length > 0
      ? `NEWS (unverified):\n- ${newsBullets.join('\n- ')}`
      : 'NEWS LAYER: unavailable — do not invent headlines.';

  const res = await fetch(DEEPSEEK, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-v4-flash',
      temperature: 0.2,
      max_tokens: 900,
      thinking: { type: 'disabled' },
      messages: [
        {
          role: 'system',
          content: `You are Agents61 Prediction Clerk (research simulation, not a bookie).
Never say bet/buy/sell YES/NO or give position size.
Calibrate carefully — only diverge from market mid when resolution wording, base rates, or news justify it.
Return ONLY JSON (no markdown):
{"agents61Probability":1-99,"confidence":"High"|"Medium"|"Low","resolutionRisk":"Low"|"Medium"|"High","executiveSummary":"string","whyGap":"one sentence"}`,
        },
        {
          role: 'user',
          content: JSON.stringify({
            question: market.question,
            description: market.description.slice(0, 600),
            marketProbability: market.marketProbability,
            category: market.category,
            endDate: market.endDate,
            volumeUsd: market.volumeUsd,
            draft,
            newsSection,
          }),
        },
      ],
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`DeepSeek ${res.status}: ${text.slice(0, 200)}`);
  const json = JSON.parse(text);
  const msg = json.choices?.[0]?.message ?? {};
  const content = String(msg.content || msg.reasoning_content || '');
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error(`Clerk JSON missing: ${content.slice(0, 120)}`);
  const parsed = JSON.parse(content.slice(start, end + 1));
  const p = clamp(Number(parsed.agents61Probability ?? draft.agents61Probability));
  return {
    agents61Probability: p,
    probabilityGap: Math.round((p - market.marketProbability) * 10) / 10,
    confidence: ['High', 'Medium', 'Low'].includes(parsed.confidence) ? parsed.confidence : draft.confidence,
    resolutionRisk: ['High', 'Medium', 'Low'].includes(parsed.resolutionRisk)
      ? parsed.resolutionRisk
      : draft.resolutionRisk,
    engine: 'deepseek',
    executiveSummary: String(parsed.executiveSummary || ''),
    whyGap: String(parsed.whyGap || ''),
  };
}

function daysUntil(iso) {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return null;
  return Math.max(0, Math.round((t - Date.now()) / 86_400_000));
}

/** Stake $S at YES mid entry (0-1). Side YES|NO. Model p = Agents61/100. */
function paperMath({ side, entryPct, agents61Pct, stake }) {
  const entry = entryPct / 100;
  const pYes = agents61Pct / 100;
  if (side === 'YES') {
    const shares = stake / entry;
    const winProfit = shares * (1 - entry);
    const ev = pYes * winProfit + (1 - pYes) * -stake;
    const roiIfWin = winProfit / stake;
    return { shares, ev, evPct: (ev / stake) * 100, roiIfWinPct: roiIfWin * 100, maxLoss: stake };
  }
  const noEntry = 1 - entry;
  const shares = stake / noEntry;
  const winProfit = shares * (1 - noEntry);
  const pNo = 1 - pYes;
  const ev = pNo * winProfit + (1 - pNo) * -stake;
  const roiIfWin = winProfit / stake;
  return { shares, ev, evPct: (ev / stake) * 100, roiIfWinPct: roiIfWin * 100, maxLoss: stake };
}

function settlePnL(pos, finalYesPct) {
  const won =
    pos.side === 'YES' ? finalYesPct >= 95 : finalYesPct <= 5;
  // If not clearly resolved, mark unresolved
  if (finalYesPct > 5 && finalYesPct < 95) {
    return { status: 'open', realizedPnL: null, won: null };
  }
  const entry = pos.entryMid / 100;
  if (pos.side === 'YES') {
    const shares = pos.stake / entry;
    const realized = won ? shares * (1 - entry) : -pos.stake;
    return { status: 'settled', realizedPnL: Math.round(realized * 100) / 100, won };
  }
  const noEntry = 1 - entry;
  const shares = pos.stake / noEntry;
  const realized = won ? shares * entry : -pos.stake; // win: NO pays 1, cost was noEntry
  return { status: 'settled', realizedPnL: Math.round(realized * 100) / 100, won };
}

async function openBook() {
  console.log('Fetching Gamma active markets…');
  const markets = await fetchActiveMarkets(48);
  const candidates = markets
    .filter((m) => m.volumeUsd >= MIN_VOL)
    .filter((m) => m.marketProbability >= 12 && m.marketProbability <= 88)
    .slice(0, Math.max(LIMIT * 3, 12));

  console.log(`Candidates after filters: ${candidates.length} (will analyze up to ${LIMIT})`);

  const analyses = [];
  for (const market of candidates) {
    if (analyses.length >= LIMIT) break;
    const draft = templateEstimate(market);
    let report = draft;
    if (!TEMPLATE_ONLY) {
      process.stdout.write(`  Clerk: ${market.question.slice(0, 64)}… `);
      try {
        const news = await tavilyNews(market.question);
        report = await clerkRefine(market, draft, news);
        console.log(`gap ${report.probabilityGap > 0 ? '+' : ''}${report.probabilityGap} (${report.engine})`);
      } catch (e) {
        console.log(`FAIL (skip trade) (${e.message.slice(0, 100)})`);
        // Keep template for diagnostics only — openBook will refuse template trades.
        report = { ...draft, clerkFailed: true };
      }
    } else {
      console.log(`  Template: ${market.question.slice(0, 64)}… gap ${draft.probabilityGap}`);
    }
    analyses.push({ market, report, template: draft });
  }

  const positions = [];
  let deployed = 0;
  for (const { market, report, template } of analyses) {
    // Never paper-trade template fallback when clerk mode was requested —
    // template gaps are hash-seeded and look like edge without being edge.
    if (!TEMPLATE_ONLY && report.engine !== 'deepseek') continue;
    if (Math.abs(report.probabilityGap) < MIN_GAP) continue;
    if (report.resolutionRisk === 'High') continue;
    if (deployed + STAKE > BANKROLL) break;
    const side = report.probabilityGap > 0 ? 'YES' : 'NO';
    const math = paperMath({
      side,
      entryPct: market.marketProbability,
      agents61Pct: report.agents61Probability,
      stake: STAKE,
    });
    const days = daysUntil(market.endDate);
    positions.push({
      id: `pp-${market.id}-${Date.now()}`,
      marketId: market.id,
      question: market.question,
      url: market.url,
      category: market.category,
      openedAt: new Date().toISOString(),
      side,
      entryMid: market.marketProbability,
      agents61: report.agents61Probability,
      gap: report.probabilityGap,
      templateGap: template.probabilityGap,
      confidence: report.confidence,
      resolutionRisk: report.resolutionRisk,
      engine: report.engine,
      volumeUsd: market.volumeUsd,
      endDate: market.endDate,
      daysToResolutionEst: days,
      stake: STAKE,
      modelEvUsd: Math.round(math.ev * 100) / 100,
      modelEvPct: Math.round(math.evPct * 10) / 10,
      roiIfCorrectPct: Math.round(math.roiIfWinPct * 10) / 10,
      status: 'open',
      realizedPnL: null,
      executiveSummary: report.executiveSummary || null,
      whyGap: report.whyGap || null,
    });
    deployed += STAKE;
  }

  const skipped = analyses.length - positions.length;
  const totalModelEv = positions.reduce((s, p) => s + p.modelEvUsd, 0);
  const medianDays = (() => {
    const ds = positions.map((p) => p.daysToResolutionEst).filter((d) => d != null).sort((a, b) => a - b);
    if (!ds.length) return null;
    return ds[Math.floor(ds.length / 2)];
  })();

  const book = {
    version: 1,
    createdAt: new Date().toISOString(),
    assumptions: {
      fill: 'Gamma YES mid (optimistic — no book/slippage)',
      fees: 0,
      stakePerPositionUsd: STAKE,
      bankrollUsd: BANKROLL,
      minAbsGapPp: MIN_GAP,
      minVolumeUsd: MIN_VOL,
      engine: TEMPLATE_ONLY ? 'template' : 'deepseek-clerk-preferred',
      warning:
        'Template gaps are hash-seeded blends — not tradable edge. Prefer deepseek engine rows for any real-money decision. Realized P&L requires settlement.',
    },
    summary: {
      analyzed: analyses.length,
      opened: positions.length,
      skipped,
      deployedUsd: deployed,
      bankrollUsd: BANKROLL,
      modelImpliedEvUsd: Math.round(totalModelEv * 100) / 100,
      modelImpliedEvOnDeployedPct:
        deployed > 0 ? Math.round((totalModelEv / deployed) * 1000) / 10 : 0,
      medianDaysToResolutionEst: medianDays,
      deskCostMonthlyUsd: 19,
      modelDaysToPaybackVsAnalyst:
        totalModelEv > 0 ? Math.round((19 / (totalModelEv / Math.max(1, medianDays || 30))) * 10) / 10 : null,
      notePayback:
        'Payback estimate uses model EV / median days — not realized. Treat as upper-bound optimism.',
    },
    positions,
    analyses: analyses.map(({ market, report, template }) => ({
      marketId: market.id,
      question: market.question,
      mid: market.marketProbability,
      clerk: report,
      template,
    })),
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(LEDGER_PATH, JSON.stringify(book, null, 2));
  console.log('\n=== PAPER BOOK SUMMARY ===');
  console.log(JSON.stringify(book.summary, null, 2));
  console.log(`Wrote ${LEDGER_PATH}`);
  return book;
}

async function settleBook() {
  if (!existsSync(LEDGER_PATH)) throw new Error(`No ledger at ${LEDGER_PATH}`);
  const book = JSON.parse(readFileSync(LEDGER_PATH, 'utf8'));
  let realized = 0;
  let settled = 0;
  let stillOpen = 0;
  for (const pos of book.positions) {
    if (pos.status === 'settled') {
      realized += pos.realizedPnL ?? 0;
      settled += 1;
      continue;
    }
    const live = await fetchMarketById(pos.marketId);
    if (!live) {
      stillOpen += 1;
      continue;
    }
    const result = settlePnL(pos, live.marketProbability);
    if (result.status === 'settled') {
      pos.status = 'settled';
      pos.realizedPnL = result.realizedPnL;
      pos.won = result.won;
      pos.settledAt = new Date().toISOString();
      pos.finalYesPct = live.marketProbability;
      realized += result.realizedPnL;
      settled += 1;
      console.log(
        `${result.won ? 'WIN' : 'LOSS'} ${pos.side} ${pos.question.slice(0, 50)} → ${result.realizedPnL}`
      );
    } else {
      pos.markMid = live.marketProbability;
      stillOpen += 1;
    }
  }
  book.settledAt = new Date().toISOString();
  book.summary.realizedPnLUsd = Math.round(realized * 100) / 100;
  book.summary.settledCount = settled;
  book.summary.stillOpenCount = stillOpen;
  book.summary.realizedRoiOnDeployedPct =
    book.summary.deployedUsd > 0
      ? Math.round((realized / book.summary.deployedUsd) * 1000) / 10
      : 0;
  writeFileSync(LEDGER_PATH, JSON.stringify(book, null, 2));
  console.log('\n=== SETTLE SUMMARY ===');
  console.log(JSON.stringify(book.summary, null, 2));
  return book;
}

if (SETTLE) {
  await settleBook();
} else {
  await openBook();
}
