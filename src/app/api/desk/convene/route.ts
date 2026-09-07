import { cookies } from 'next/headers';
import { emptyFundamentals, getFundamentals } from '@/lib/data/fundamentals';
import { getCryptoSnapshot } from '@/lib/data/crypto';
import { getPrivateFacts } from '@/lib/data/private-facts';
import { getPrivateCompany } from '@/lib/private-universe';
import { buildDeskPlan } from '@/lib/desk-plan';
import { entitlementFromJar, TRIAL_COOKIE, TRIAL_COOKIE_SET, TRIAL_FORBIDDEN } from '@/lib/desk-trial';
import { getMasterBySlug, type Master } from '@/lib/masters';
import {
  assembleBriefs,
  attachHandoff,
  groupRank,
  writeIndependentBrief,
  type IndependentBrief,
} from '@/lib/research';
import { parseDeskMode } from '@/lib/desk-mode';
import { deskModelBanner } from '@/lib/llm/deepseek';
import { concurrencyForPlan } from '@/lib/llm/write-brief';
import { enrichAssemblyWithClerk } from '@/lib/llm/write-clerk';
import { getNewsDigest, hasTavilyKey } from '@/lib/llm/news-scan';
import { mapPool } from '@/lib/llm/pool';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function sse(event: string, data: unknown): Uint8Array {
  return new TextEncoder().encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function handoffDigest(upstream: IndependentBrief[]): string {
  if (!upstream.length) return '';
  return upstream
    .slice(-8)
    .map((b) => `${b.nameEn} (${b.group}, ${b.stance}): ${b.finding || b.thesis}`)
    .join('\n');
}

export async function POST(request: Request) {
  let body: { message?: string; plan?: string; mode?: string } = {};
  try {
    body = (await request.json()) as { message?: string; plan?: string; mode?: string };
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const message = (body.message ?? '').trim();
  if (!message || message.length > 2000) {
    return Response.json({ error: 'Ask the desk in 1–2000 characters.' }, { status: 400 });
  }

  const jar = await cookies();
  const ent = entitlementFromJar((name) => jar.get(name)?.value);
  if (!ent.canGenerate) {
    return Response.json(TRIAL_FORBIDDEN, { status: 403 });
  }

  const plan = ent.skipPaywall ? ent.runPlan : 'analyst';
  if (!ent.skipPaywall) {
    jar.set(TRIAL_COOKIE, TRIAL_COOKIE_SET.value, TRIAL_COOKIE_SET.options);
  }

  const desk = buildDeskPlan(message, plan);
  const mode = parseDeskMode(body.mode);
  const seats = desk.seats
    .map((s) => getMasterBySlug(s.slug))
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
    .sort((a, b) => groupRank(a.group) - groupRank(b.group) || a.nameEn.localeCompare(b.nameEn));
  const kind = desk.domain;
  const board = !desk.ticker;
  const privateSlug =
    kind === 'private' && desk.ticker ? getPrivateCompany(desk.ticker.toLowerCase())?.slug ?? desk.ticker.toLowerCase() : null;
  const privateSnap = privateSlug ? getPrivateFacts(privateSlug) : null;
  const facts =
    kind === 'private'
      ? emptyFundamentals(privateSlug ?? 'PRIVATE')
      : board || kind === 'crypto'
        ? emptyFundamentals(desk.ticker ?? (kind === 'crypto' ? 'CRYPTO' : kind === 'emerging' ? 'EM' : 'BOARD'))
        : await getFundamentals(desk.ticker as string);
  if (kind === 'private' && privateSnap && !privateSnap.error) {
    facts.entityName = privateSnap.name;
    facts.ratiosNote = privateSnap.disclaimer;
  }
  const cryptoSnap = kind === 'crypto' && desk.ticker ? await getCryptoSnapshot(desk.ticker) : null;
  const subject =
    desk.ticker ??
    (kind === 'crypto' ? 'CRYPTO' : kind === 'emerging' ? 'EM' : kind === 'private' ? 'PRIVATE' : 'BOARD');
  // Shared news layer: one scan per report, every seat + the clerk read it.
  // Free Tavily tier (1,000 searches/mo) + ~$0.002 Flash digest, cached 12h per subject.
  const news =
    hasTavilyKey() && desk.ticker
      ? await getNewsDigest(desk.ticker, facts.entityName ?? privateSnap?.name ?? null)
      : null;
  const banner = deskModelBanner();
  const limit = concurrencyForPlan(plan);

  const stream = new ReadableStream({
    async start(controller) {
      const briefs: IndependentBrief[] = [];
      try {
        controller.enqueue(
          sse('start', {
            plan,
            ticker: desk.ticker,
            question: message,
            intent: desk.intent,
            domain: kind,
            mode,
            seatCount: seats.length,
            filingError: facts.error,
            liveModel: banner.live,
            modelNote: banner.modelNote,
            newsLive: Boolean(news),
          })
        );

        const writeSeat = async (master: Master, upstream: IndependentBrief[]) => {
          let brief = await writeIndependentBrief({
            master,
            subject,
            facts,
            question: message,
            kind,
            crypto: cryptoSnap,
            privateFacts: privateSnap,
            plan,
            handoffNotes: mode === 'handoff' ? handoffDigest(upstream) : undefined,
            news,
          });
          if (mode === 'handoff') {
            brief = attachHandoff(brief, upstream);
          }
          briefs.push(brief);
          controller.enqueue(sse('brief', brief));
        };

        if (mode === 'handoff') {
          const ranks = [...new Set(seats.map((s) => groupRank(s.group)))].sort((a, b) => a - b);
          for (const rank of ranks) {
            const batch = seats.filter((s) => groupRank(s.group) === rank);
            const upstream = briefs.filter((b) => groupRank(b.group) < rank);
            await mapPool(batch, limit, (master) => writeSeat(master, upstream));
          }
        } else {
          await mapPool(seats, limit, (master) => writeSeat(master, []));
        }

        let assembly = assembleBriefs(briefs, plan, subject, message, desk.intent, {
          facts,
          crypto: cryptoSnap,
          privateFacts: privateSnap,
          domain: kind,
          mode,
        });
        if (banner.live) {
          assembly = await enrichAssemblyWithClerk(assembly, briefs, facts, news);
        }
        controller.enqueue(sse('clerk', assembly));
        controller.enqueue(sse('done', { seatCount: briefs.length, liveModel: banner.live }));
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Convening failed';
        controller.enqueue(sse('error', { error: msg }));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
    },
  });
}
