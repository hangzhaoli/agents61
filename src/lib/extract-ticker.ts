/**
 * Pull a US ticker out of a free-text desk question.
 * Words that look like tickers but aren't symbols are skipped.
 */

const STOP = new Set([
  'A', 'I', 'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'HOW', 'WHY', 'WHAT',
  'WHEN', 'WHO', 'THIS', 'THAT', 'WITH', 'FROM', 'HAVE', 'HAS', 'WAS', 'WERE',
  'WILL', 'WOULD', 'COULD', 'SHOULD', 'ABOUT', 'INTO', 'OVER', 'AFTER', 'YOUR',
  'OUR', 'ITS', 'CAN', 'MAY', 'ALL', 'ANY', 'MORE', 'MOST', 'NEW', 'OLD', 'SEE',
  'GET', 'GOT', 'RUN', 'ASK', 'TELL', 'LOOK', 'BUY', 'SELL', 'HOLD', 'LONG',
  'SHORT', 'BULL', 'BEAR', 'TEAM', 'DESK', 'NAME', 'STOCK', 'STOCKS', 'MARKET',
  'PRICE', 'VALUE', 'GROWTH', 'RISK', 'DEBT', 'CASH', 'MOAT', 'CEO', 'IPO',
  'ETF', 'USA', 'USD', 'SEC', 'GAAP', 'ROE', 'EPS', 'YES', 'NOW', 'STILL',
  'JUST', 'VERY', 'ALSO', 'THAN', 'THEN', 'THEM', 'THEY', 'THEIR', 'DOES',
  'DID', 'DONT', 'ISNT', 'IS', 'IT', 'OR', 'AN', 'AT', 'BE', 'DO', 'GO', 'IF', 'IN', 'ME', 'MY', 'NO', 'OF', 'ON', 'SO', 'TO', 'UP', 'US', 'WE', 'AM', 'PM', 'AS', 'PLEASE', 'THANKS', 'HELLO', 'HI', 'OK', 'OKAY',
  'BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'LINK', 'AVAX', 'TON', 'UNI',
  'AAVE', 'NEAR', 'SUI', 'DOT', 'LTC', 'DOGE', 'WEB3', 'DEFI',
]);

export function extractTicker(message: string): string | null {
  const matches = message.toUpperCase().match(/\b([A-Z]{1,5}(?:-[A-Z])?)\b/g);
  if (!matches) return null;
  for (const raw of matches) {
    const t = raw.replace('.', '-');
    if (STOP.has(t)) continue;
    if (t.length < 1) continue;
    return t;
  }
  return null;
}
