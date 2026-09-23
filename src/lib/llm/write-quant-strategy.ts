/**
 * Quant Lab LLM: master strategy spec → Python backtest + Thorp risk review.
 */

import { getMasterBySlug } from '@/lib/masters';
import { getPersona } from '@/lib/personas';
import { COMPLIANCE_BLOCK } from '@/lib/personas/types';
import { fallbackQuantStrategy } from '@/lib/quant-lab/fallback';
import { getQuantMaster, QUANT_LAB_DISCLAIMER } from '@/lib/quant-lab/masters';
import { isCryptoTicker, normalizeQuantTicker } from '@/lib/quant-lab/crypto-tickers';
import type { GeneratedQuantStrategy, QuantMasterSlug, ThorpReview } from '@/lib/quant-lab/types';
import { deepseekChat, hasDeepseekKey } from '@/lib/llm/deepseek';

function extractJson(text: string): unknown {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = (fence ? fence[1] : text).trim();
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('No JSON object');
  return JSON.parse(raw.slice(start, end + 1)) as unknown;
}

function extractPython(text: string): string {
  const fence = text.match(/```(?:python|py)?\s*([\s\S]*?)```/i);
  if (fence) return fence[1].trim();
  if (text.includes('import yfinance') || text.includes('def backtest')) return text.trim();
  throw new Error('No Python block');
}

function parseThorp(raw: unknown): ThorpReview {
  const o = (raw ?? {}) as Record<string, unknown>;
  const arr = (v: unknown) =>
    (Array.isArray(v) ? v : []).map((x) => String(x)).filter(Boolean).slice(0, 6);
  const edge = String(o.edgeClaim ?? o.edge ?? 'unknown').toLowerCase();
  return {
    edgeClaim: edge === 'yes' ? 'yes' : edge === 'no' ? 'no' : 'unknown',
    kellyFractionBand: String(o.kellyFractionBand ?? o.kelly_fraction_band ?? '0%'),
    overfittingWarnings: arr(o.overfittingWarnings ?? o.overfitting_warnings),
    significanceNotes: arr(o.significanceNotes ?? o.significance_notes),
    ruinNote: String(o.ruinNote ?? o.ruin_note ?? 'Size to survive being wrong.'),
    paperTradingOnly: true,
    summary: String(o.summary ?? 'Thorp quant review — paper backtest only.'),
  };
}

export type GenerateQuantOpts = {
  masterSlug: QuantMasterSlug;
  ticker: string;
  notes?: string;
};

export async function generateQuantStrategy(opts: GenerateQuantOpts): Promise<GeneratedQuantStrategy> {
  const slug = opts.masterSlug;
  const ticker = normalizeQuantTicker(opts.ticker.trim() || 'SPY');
  const crypto = isCryptoTicker(ticker);
  if (!hasDeepseekKey()) {
    return fallbackQuantStrategy(slug, ticker);
  }

  const qm = getQuantMaster(slug);
  const master = getMasterBySlug(slug);
  const persona = getPersona(slug);
  if (!qm || !master) {
    throw new Error('Unknown quant master');
  }

  const system = [
    persona?.systemPrompt ?? `You compile ${master.nameEn}'s public methodology for Agents61 Quant Lab.`,
    COMPLIANCE_BLOCK,
    '',
    'QUANT LAB OVERRIDE — you are NOT writing investment advice or live orders.',
    'Output TWO fenced blocks in order:',
    '1) ```json``` with keys: spec (object), thorpReview (object)',
    '2) ```python``` a self-contained yfinance daily backtest script for ONE ticker',
    '',
    'spec fields: name, masterSlug, masterName, ticker, timeframe, style, entryRules[], exitRules[], filters[], parameters{}, positionSizing, disclaimer',
    'thorpReview fields: edgeClaim (yes|no|unknown), kellyFractionBand, overfittingWarnings[], significanceNotes[], ruinNote, summary',
    'Python must: use yfinance+pandas+numpy only, include PAPER BACKTEST header comment, define backtest(), print trade count and win rate.',
    crypto
      ? 'ASSET CLASS: CRYPTO. Use yfinance ticker exactly as given (e.g. BTC-USD). Do NOT invent P/E, earnings, or equity CANSLIM fundamentals — adapt rules to price/volume/volatility only. Warn about 24/7 markets and weekend gaps differently than equities.'
      : 'ASSET CLASS: EQUITY/ETF (or index). Standard US session daily bars.',
    'Never include API keys, broker SDKs, or order placement.',
    QUANT_LAB_DISCLAIMER,
  ].join('\n');

  const user = [
    `MASTER: ${master.nameEn} (${slug})`,
    `METHODOLOGY: ${master.methodology}`,
    `SIGNATURE: ${master.signature}`,
    `COMPILE HINT: ${qm.compileHint}`,
    `DEFAULT PARAMS: ${JSON.stringify(qm.defaultParams)}`,
    `TICKER: ${ticker}${crypto ? ' (crypto / yfinance USD pair)' : ''}`,
    opts.notes ? `USER NOTES: ${opts.notes}` : '',
    '',
    'Thorp quant layer must warn about overfitting, low sample size, and fractional Kelly.',
    crypto ? 'Thorp must also note crypto regime shifts and that paper fills ignore funding/perp fees.' : '',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const { content, model } = await deepseekChat({
      lane: 'verdict',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      thinking: true,
      effort: 'high',
      timeoutMs: 90_000,
      maxTokens: 4000,
    });

    const jsonPart = extractJson(content) as {
      spec?: Record<string, unknown>;
      thorpReview?: unknown;
      python?: string;
    };
    let python: string;
    try {
      python = jsonPart.python ? String(jsonPart.python) : extractPython(content);
    } catch {
      if (jsonPart.python) python = String(jsonPart.python);
      else throw new Error('No Python block');
    }
    const specRaw = jsonPart.spec ?? jsonPart;
    const thorpReview = parseThorp(jsonPart.thorpReview ?? (specRaw as Record<string, unknown>).thorpReview);

    const spec = {
      name: String((specRaw as Record<string, unknown>).name ?? `${master.nameEn} · ${ticker}`),
      masterSlug: slug,
      masterName: master.nameEn,
      ticker,
      timeframe: 'daily' as const,
      style: String((specRaw as Record<string, unknown>).style ?? qm.system),
      entryRules: Array.isArray((specRaw as Record<string, unknown>).entryRules)
        ? ((specRaw as Record<string, unknown>).entryRules as unknown[]).map(String)
        : [qm.compileHint],
      exitRules: Array.isArray((specRaw as Record<string, unknown>).exitRules)
        ? ((specRaw as Record<string, unknown>).exitRules as unknown[]).map(String)
        : ['Stop per methodology'],
      filters: Array.isArray((specRaw as Record<string, unknown>).filters)
        ? ((specRaw as Record<string, unknown>).filters as unknown[]).map(String)
        : [],
      parameters:
        typeof (specRaw as Record<string, unknown>).parameters === 'object' &&
        (specRaw as Record<string, unknown>).parameters
          ? ((specRaw as Record<string, unknown>).parameters as Record<string, number | string | boolean>)
          : qm.defaultParams,
      positionSizing: String(
        (specRaw as Record<string, unknown>).positionSizing ?? 'Fixed risk per trade — see Thorp Kelly band.'
      ),
      disclaimer: QUANT_LAB_DISCLAIMER,
    };

    return {
      spec,
      python,
      thorpReview,
      engine: model,
    };
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'Quant LLM failed';
    console.error(`[write-quant] fallback: ${reason}`);
    return fallbackQuantStrategy(slug, ticker);
  }
}
