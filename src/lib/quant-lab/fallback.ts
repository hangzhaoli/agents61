/**
 * Template fallback strategies when DeepSeek is unavailable.
 */

import { getMasterBySlug } from '@/lib/masters';
import { getQuantMaster, QUANT_LAB_DISCLAIMER } from '@/lib/quant-lab/masters';
import { estimateTradeOdds } from '@/lib/quant-lab/trade-odds';
import type { GeneratedQuantStrategy, QuantMasterSlug } from '@/lib/quant-lab/types';

function pythonHeader(ticker: string, master: string): string {
  const crypto = /-USD$/i.test(ticker) || /^(BTC|ETH|SOL)/i.test(ticker);
  return `# Agents61 Quant Lab — PAPER BACKTEST ONLY
# Master: ${master} | Ticker: ${ticker}${crypto ? ' | Asset: crypto (yfinance USD pair)' : ''}
# Run: pip install yfinance pandas numpy && python this_file.py
# NOT investment advice. NOT for live orders.
${crypto ? '# Crypto: price/volume rules only — no fake P/E or earnings filters.\n' : ''}
`;
}

function turtlePython(ticker: string, entry: number, exit: number): string {
  return `${pythonHeader(ticker, 'Richard Dennis / Turtle')}
import yfinance as yf
import pandas as pd
import numpy as np

TICKER = "${ticker.toUpperCase()}"
ENTRY_DAYS = ${entry}
EXIT_DAYS = ${exit}

def backtest():
    df = yf.download(TICKER, period="5y", interval="1d", auto_adjust=True, progress=False)
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
    close = df["Close"].astype(float)
    high = df["High"].astype(float)
    entry = high.rolling(ENTRY_DAYS).max().shift(1)
    exit_level = close.rolling(EXIT_DAYS).min().shift(1)
    position = 0
    trades = []
    for i in range(ENTRY_DAYS + 1, len(df)):
        if position == 0 and close.iloc[i] > entry.iloc[i]:
            position = close.iloc[i]
            trades.append({"type": "buy", "price": position, "date": str(df.index[i].date())})
        elif position > 0 and close.iloc[i] < exit_level.iloc[i]:
            ret = (close.iloc[i] - position) / position
            trades.append({"type": "sell", "price": close.iloc[i], "return": ret, "date": str(df.index[i].date())})
            position = 0
    rets = [t["return"] for t in trades if t.get("return") is not None]
    print(f"Trades: {len(rets)}")
    if rets:
        print(f"Win rate: {100*np.mean(np.array(rets)>0):.1f}%")
        print(f"Avg trade: {100*np.mean(rets):.2f}%")
        print(f"Total compounded (approx): {100*(np.prod(1+np.array(rets))-1):.1f}%")
    else:
        print("No closed trades in window.")

if __name__ == "__main__":
    backtest()
`;
}

function oneilPython(ticker: string, stop: number): string {
  return `${pythonHeader(ticker, "William O'Neil / CANSLIM")}
import yfinance as yf
import pandas as pd
import numpy as np

TICKER = "${ticker.toUpperCase()}"
STOP_PCT = ${stop}

def backtest():
    df = yf.download(TICKER, period="5y", interval="1d", auto_adjust=True, progress=False)
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
    close = df["Close"].astype(float)
    vol = df["Volume"].astype(float)
    vol_ma = vol.rolling(50).mean()
    high52 = close.rolling(252).max().shift(1)
    position = 0
    rets = []
    for i in range(252, len(df)):
        if position == 0:
            if close.iloc[i] > high52.iloc[i] and vol.iloc[i] > 1.4 * vol_ma.iloc[i]:
                position = close.iloc[i]
        else:
            if close.iloc[i] <= position * (1 - STOP_PCT):
                rets.append((close.iloc[i] - position) / position)
                position = 0
    print(f"Closed trades: {len(rets)}")
    if rets:
        print(f"Win rate: {100*np.mean(np.array(rets)>0):.1f}%")
        print(f"Avg trade: {100*np.mean(rets):.2f}%")

if __name__ == "__main__":
    backtest()
`;
}

function livermorePython(ticker: string, stop: number): string {
  return `${pythonHeader(ticker, 'Jesse Livermore')}
import yfinance as yf
import pandas as pd
import numpy as np

TICKER = "${ticker.toUpperCase()}"
STOP_PCT = ${stop}

def backtest():
    df = yf.download(TICKER, period="5y", interval="1d", auto_adjust=True, progress=False)
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
    close = df["Close"].astype(float)
    pivot = close.rolling(20).max().shift(1)
    position = 0
    rets = []
    for i in range(21, len(df)):
        if position == 0 and close.iloc[i] > pivot.iloc[i]:
            position = close.iloc[i]
        elif position > 0:
            trail = close.iloc[i-20:i].max()
            if close.iloc[i] < trail * (1 - STOP_PCT) or close.iloc[i] < position * (1 - STOP_PCT):
                rets.append((close.iloc[i] - position) / position)
                position = 0
    print(f"Closed trades: {len(rets)}")
    if rets:
        print(f"Win rate: {100*np.mean(np.array(rets)>0):.1f}%")

if __name__ == "__main__":
    backtest()
`;
}

function seykotaPython(ticker: string, fast: number, slow: number): string {
  return `${pythonHeader(ticker, 'Ed Seykota')}
import yfinance as yf
import pandas as pd
import numpy as np

TICKER = "${ticker.toUpperCase()}"
FAST, SLOW = ${fast}, ${slow}

def backtest():
    df = yf.download(TICKER, period="5y", interval="1d", auto_adjust=True, progress=False)
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
    close = df["Close"].astype(float)
    ma_f = close.rolling(FAST).mean()
    ma_s = close.rolling(SLOW).mean()
    position = 0
    rets = []
    for i in range(SLOW + 1, len(df)):
        if position == 0 and ma_f.iloc[i] > ma_s.iloc[i] and close.iloc[i] > close.iloc[i-20:i].max():
            position = close.iloc[i]
        elif position > 0 and ma_f.iloc[i] < ma_s.iloc[i]:
            rets.append((close.iloc[i] - position) / position)
            position = 0
    print(f"Closed trades: {len(rets)}")
    if rets and len(rets) > 1:
        print(f"Sharpe (naive): {np.mean(rets)/np.std(rets)*np.sqrt(252/20):.2f}")

if __name__ == "__main__":
    backtest()
`;
}

function minerviniPython(ticker: string, stop: number): string {
  return oneilPython(ticker, stop).replace("CANSLIM", 'SEPA stage-2').replace('William O\'Neil', 'Mark Minervini');
}

export function fallbackQuantStrategy(
  masterSlug: QuantMasterSlug,
  ticker: string
): GeneratedQuantStrategy {
  const qm = getQuantMaster(masterSlug)!;
  const master = getMasterBySlug(masterSlug);
  const sym = ticker.trim().toUpperCase() || 'SPY';
  const params = qm.defaultParams;

  let python: string;
  switch (masterSlug) {
    case 'richard-dennis':
      python = turtlePython(sym, Number(params.entry_days), Number(params.exit_days));
      break;
    case 'william-oneil':
      python = oneilPython(sym, Number(params.stop_pct));
      break;
    case 'jesse-livermore':
      python = livermorePython(sym, Number(params.stop_pct));
      break;
    case 'ed-seykota':
      python = seykotaPython(sym, Number(params.fast_ma), Number(params.slow_ma));
      break;
    case 'mark-minervini':
      python = minerviniPython(sym, Number(params.stop_pct));
      break;
    default:
      python = turtlePython(sym, 20, 10);
  }

  const thorpReview = {
      edgeClaim: 'unknown' as const,
      kellyFractionBand: '0% until out-of-sample edge is shown',
      overfittingWarnings: [
        'Template strategy — parameters not optimized on this ticker.',
        'Single-asset backtest ignores correlation and regime change.',
        'Survivorship and look-ahead bias possible if you tweak rules after seeing results.',
      ],
      significanceNotes: [
        'Run walk-forward or hold-out years before trusting win rate.',
        'Fewer than 30 closed trades → significance is not meaningful.',
      ],
      ruinNote: 'Full Kelly on noisy short-term edges risks ruin — use fractional Kelly or fixed risk per trade.',
      paperTradingOnly: true as const,
      summary: 'Template compile. DeepSeek not configured or call failed — methodology card only.',
    };

  return {
    spec: {
      name: `${master?.nameEn ?? qm.label} · ${sym}`,
      masterSlug,
      masterName: master?.nameEn ?? qm.label,
      ticker: sym,
      timeframe: 'daily',
      style: qm.system,
      entryRules: [qm.compileHint, 'Template rules — regenerate with DeepSeek for a custom spec.'],
      exitRules: [`Stop / exit per ${masterSlug} methodology`, 'Paper backtest only'],
      filters: ['Long-only research default', 'No live quote dependency in script'],
      parameters: params,
      positionSizing: 'Fixed notional per signal — Thorp Kelly review required before scaling.',
      disclaimer: QUANT_LAB_DISCLAIMER,
    },
    python,
    thorpReview,
    tradeOdds: estimateTradeOdds({ masterSlug, ticker: sym, thorp: thorpReview }),
    engine: 'template',
  };
}
