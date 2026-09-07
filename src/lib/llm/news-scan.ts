/**
 * Shared news layer — zero-marginal-cost real-time context for reports.
 *
 * Architecture (agreed): ONE scan per subject, before seats write.
 *   Tavily free tier (1,000 basic searches/mo, no card) → top results →
 *   DeepSeek V4-Flash digests them into 5-7 dated bullets → the same digest
 *   is injected into every seat's FACTS and the clerk pass.
 * Cached 12h per subject, so repeated reports on the same name cost nothing.
 *
 * Worst-case cost per report: 1 Tavily credit (free tier) + ~$0.002 Flash
 * digest. Anything failing returns null and the report runs exactly as before.
 */

import { unstable_cache } from 'next/cache';
import { deepseekChat, hasDeepseekKey } from '@/lib/llm/deepseek';

export type NewsDigest = {
  subject: string;
  bullets: string[];
  fetchedAt: string;
  source: 'tavily';
};

export function hasTavilyKey(): boolean {
  return Boolean(process.env.TAVILY_API_KEY?.trim());
}

type TavilyResult = { title?: string; url?: string; content?: string; published_date?: string };

async function tavilySearch(query: string): Promise<TavilyResult[]> {
  const key = process.env.TAVILY_API_KEY?.trim();
  if (!key) return [];
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 12_000);
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: key,
        query,
        max_results: 5,
        search_depth: 'basic', // 1 credit — free tier covers 1,000/mo
        time_range: 'week',
        topic: 'news',
      }),
      signal: ac.signal,
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { results?: TavilyResult[] };
    return (json.results ?? []).filter((r) => r.title && r.content);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

function clip(s: string, n: number): string {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}

/** Flash digest: raw SERP → 5-7 dated, source-attributed bullets. ~$0.002. */
async function digestWithFlash(subject: string, results: TavilyResult[]): Promise<string[]> {
  const raw = results
    .map(
      (r, i) =>
        `[${i + 1}] ${r.title} (${r.published_date ?? 'date n/a'})\n${clip(r.content ?? '', 420)}\n${r.url ?? ''}`
    )
    .join('\n\n');

  const { content } = await deepseekChat({
    lane: 'card',
    messages: [
      {
        role: 'system',
        content: [
          'You compress web search results into a desk news layer for equity research.',
          'Rules:',
          '- Output ONLY a JSON array of 4-7 strings. No markdown, no commentary.',
          '- Each string: "YYYY-MM-DD or "recent" — fact — (source name)". One fact per bullet.',
          '- Prefer numbers: revenue, guidance, filings, deals, ratings, dates.',
          '- Drop duplicates, opinion pieces, and anything not about the subject.',
          '- Never invent facts not present in the results. English only.',
        ].join('\n'),
      },
      {
        role: 'user',
        content: `SUBJECT: ${subject}\n\nSEARCH RESULTS (last 7 days):\n${raw}`,
      },
    ],
    thinking: false,
    timeoutMs: 20_000,
    maxTokens: 700,
    temperature: 0.2,
  });

  const start = content.indexOf('[');
  const end = content.lastIndexOf(']');
  if (start < 0 || end <= start) throw new Error('No JSON array in digest');
  const parsed = JSON.parse(content.slice(start, end + 1)) as unknown;
  if (!Array.isArray(parsed)) throw new Error('Digest is not an array');
  const bullets = parsed.map((x) => clip(String(x), 260)).filter((b) => b.length > 12).slice(0, 7);
  if (!bullets.length) throw new Error('Empty digest');
  return bullets;
}

async function scanSubject(subject: string, companyName: string | null): Promise<NewsDigest | null> {
  const label = companyName && companyName.toUpperCase() !== subject.toUpperCase()
    ? `${companyName} (${subject})`
    : subject;
  const results = await tavilySearch(`${label} stock news filings earnings guidance`);
  if (!results.length) return null;

  let bullets: string[];
  if (hasDeepseekKey()) {
    try {
      bullets = await digestWithFlash(label, results);
    } catch (err) {
      console.error(`[news-scan] digest fallback for ${subject}:`, err instanceof Error ? err.message : err);
      bullets = results.slice(0, 5).map((r) => clip(`${r.published_date ?? 'recent'} — ${r.title}`, 220));
    }
  } else {
    bullets = results.slice(0, 5).map((r) => clip(`${r.published_date ?? 'recent'} — ${r.title}`, 220));
  }
  return { subject: subject.toUpperCase(), bullets, fetchedAt: new Date().toISOString(), source: 'tavily' };
}

/**
 * Cached per subject+name. Success sticks 12h. Failures throw inside the
 * cached fn — unstable_cache never stores thrown errors — so an outage or
 * exhausted quota simply retries on the next report instead of sticking.
 */
export async function getNewsDigest(
  subject: string,
  companyName: string | null = null
): Promise<NewsDigest | null> {
  if (!hasTavilyKey()) return null;
  const subj = subject.trim().toUpperCase();
  if (!subj || subj === 'BOARD') return null;
  const nameKey = (companyName ?? '').trim().toLowerCase().slice(0, 60);

  const cached = unstable_cache(
    async () => {
      const digest = await scanSubject(subj, companyName);
      if (!digest) throw new Error(`news scan empty for ${subj}`);
      return digest;
    },
    ['news-scan-v1', subj, nameKey],
    { revalidate: 43_200, tags: [`news-${subj}`] }
  );
  try {
    return await cached();
  } catch {
    return null;
  }
}

/** Prompt block shared by every seat and the clerk. */
export function newsBlock(digest: NewsDigest): string {
  return [
    `NEWS LAYER — last 7 days, web search via Tavily, fetched ${digest.fetchedAt.slice(0, 10)}.`,
    'Unverified leads, NOT filing facts. Attribute as "news layer reports …"; never merge into FACTS numbers.',
    ...digest.bullets.map((b) => `- ${b}`),
  ].join('\n');
}
