/**
 * One-shot live DeepSeek brief smoke test. Uses production env from .env.vercel.check
 * Run: node scripts/test-deepseek-live.mjs
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(root, '.env.vercel.check');
for (const line of readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, '');
}

const key = process.env.DEEPSEEK_API_KEY?.trim();
if (!key) {
  console.error('FAIL: DEEPSEEK_API_KEY empty');
  process.exit(1);
}
console.log('Key length:', key.length);

const body = {
  model: 'deepseek-v4-flash',
  messages: [
    {
      role: 'system',
      content:
        'You simulate Warren Buffett for Agents61. Reply ONLY with JSON: {"stance":"constructive|cautious|skeptical|inconclusive","thesis":"2 sentences","finding":"one paragraph","risks":"one line","wouldChangeMind":"one line"}. Never say you should buy or sell.',
    },
    {
      role: 'user',
      content:
        'QUESTION: Is NVDA still a compounder?\nSUBJECT: NVDA\nFACTS: Revenue $60.9B, P/E 45.2 (cached, not live quote).',
    },
  ],
  stream: false,
  max_tokens: 600,
  thinking: { type: 'disabled' },
  temperature: 0.4,
};

const res = await fetch('https://api.deepseek.com/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

const text = await res.text();
if (!res.ok) {
  console.error('FAIL: HTTP', res.status, text.slice(0, 500));
  process.exit(1);
}

const json = JSON.parse(text);
const content = json.choices?.[0]?.message?.content ?? '';
const model = json.model ?? body.model;
console.log('OK: model =', model);
console.log('Content preview:', content.slice(0, 400));
if (content.includes('you should buy') || content.includes('you should sell')) {
  console.error('FAIL: compliance violation in output');
  process.exit(1);
}
if (model.includes('template') || content.length < 80) {
  console.error('FAIL: output too short or template-like');
  process.exit(1);
}
console.log('PASS: live DeepSeek brief smoke test');
