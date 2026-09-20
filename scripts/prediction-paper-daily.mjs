/**
 * Call production (or local) daily paper job: settle then open.
 *
 *   node --env-file=.env.paper.local scripts/prediction-paper-daily.mjs
 *
 * Env:
 *   CRON_SECRET or INTERNAL_PAPER_TOKEN
 *   PAPER_API_BASE (default https://agents61.com)
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function loadEnvFile(name) {
  const p = resolve(root, name);
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (!m || process.env[m[1]]) continue;
    process.env[m[1]] = m[2].replace(/^"|"$/g, '').replace(/\\n$/g, '');
  }
}
loadEnvFile('.env.paper.local');
loadEnvFile('.env.local');

const secret = (process.env.CRON_SECRET || process.env.INTERNAL_PAPER_TOKEN || '').trim();
const base = (process.env.PAPER_API_BASE || 'https://agents61.com').replace(/\/$/, '');

if (!secret) {
  console.error('Set CRON_SECRET or INTERNAL_PAPER_TOKEN');
  process.exit(1);
}

const url = `${base}/api/internal/prediction-paper?action=daily&limit=4&minGap=3`;
console.log('POST', url);

const res = await fetch(url, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${secret}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ action: 'daily', limit: 4, minGap: 3 }),
  signal: AbortSignal.timeout(290_000),
});

const text = await res.text();
console.log('status', res.status);
try {
  console.log(JSON.stringify(JSON.parse(text), null, 2));
} catch {
  console.log(text.slice(0, 800));
}
if (!res.ok) process.exit(1);
