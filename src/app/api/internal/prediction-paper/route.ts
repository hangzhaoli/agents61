import { NextResponse } from 'next/server';
import {
  assertPaperAuth,
  loadPaperBook,
  openPaperBook,
  runPaperDaily,
  settlePaperBook,
} from '@/lib/prediction/paper-book';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

type Action = 'read' | 'settle' | 'open' | 'daily';

function parseAction(request: Request): Action {
  const url = new URL(request.url);
  const a = (url.searchParams.get('action') || 'read').toLowerCase();
  if (a === 'settle' || a === 'open' || a === 'daily') return a;
  return 'read';
}

async function runAction(action: Action, opts: { limit?: number; minGap?: number }) {
  if (action === 'settle') return settlePaperBook(opts);
  if (action === 'open') return openPaperBook(opts);
  if (action === 'daily') return runPaperDaily(opts);
  return loadPaperBook(opts);
}

function jsonBook(action: Action, book: Awaited<ReturnType<typeof loadPaperBook>>) {
  if (action === 'read') {
    return NextResponse.json({ ok: true, book });
  }
  return NextResponse.json({
    ok: true,
    action,
    summary: book.summary,
    lastRun: book.runs[0] ?? null,
    openPositions: book.positions.filter((p) => p.status === 'open').length,
    settledPositions: book.positions.filter((p) => p.status === 'settled').length,
  });
}

/**
 * Internal Prediction Markets paper book.
 * Auth: Authorization: Bearer $CRON_SECRET (Vercel Cron) or INTERNAL_PAPER_TOKEN
 *   or ?token= / x-paper-token
 *
 * GET  ?action=read|settle|open|daily  (Cron uses GET → daily)
 * POST ?action=settle|open|daily
 */
export async function GET(request: Request) {
  if (!assertPaperAuth(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const url = new URL(request.url);
  // Vercel Cron is GET — default to daily when cron header / explicit action
  const isCron = Boolean(request.headers.get('x-vercel-cron'));
  let action = parseAction(request);
  if (isCron && action === 'read') action = 'daily';
  if (!url.searchParams.get('action') && isCron) action = 'daily';

  const limit = Number(url.searchParams.get('limit') || '') || undefined;
  const minGap = Number(url.searchParams.get('minGap') || '') || undefined;

  try {
    const book = await runAction(action, { limit, minGap });
    return jsonBook(action, book);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'paper run failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!assertPaperAuth(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  let action: Action = parseAction(request);
  let limit: number | undefined;
  let minGap: number | undefined;

  try {
    const body = (await request.json().catch(() => ({}))) as {
      action?: string;
      limit?: number;
      minGap?: number;
    };
    if (body.action === 'settle' || body.action === 'open' || body.action === 'daily') {
      action = body.action;
    }
    if (typeof body.limit === 'number') limit = body.limit;
    if (typeof body.minGap === 'number') minGap = body.minGap;
  } catch {
    /* no body */
  }

  if (action === 'read') action = 'daily';

  try {
    const book = await runAction(action, { limit, minGap });
    return jsonBook(action, book);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'paper run failed' },
      { status: 500 }
    );
  }
}
