import { cookies } from 'next/headers';
import { extraById, EXTRA_CREDITS_FORBIDDEN, parseTokenExtra, TOKEN_PACKS } from '@/lib/token-extras';
import { deepseekChat, hasDeepseekKey } from '@/lib/llm/deepseek';
import {
  consumeExtraCredit,
  extraCheckoutPath,
  extraEmailFromJar,
} from '@/lib/billing/extra-credits';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: Request) {
  let body: { extra?: string; text?: string; ticker?: string } = {};
  try {
    body = (await request.json()) as { extra?: string; text?: string; ticker?: string };
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const extraId = parseTokenExtra(body.extra);
  if (!extraId) return Response.json({ error: 'Pick a token extra.' }, { status: 400 });

  const ticker = (body.ticker ?? '').trim().toUpperCase().slice(0, 12);
  const text = (body.text ?? '').trim().slice(0, 12000);
  if (extraId === 'filing_extract' && text.length < 40) {
    return Response.json({ error: 'Paste a longer filing excerpt (40+ characters).' }, { status: 400 });
  }

  const jar = await cookies();
  const email = extraEmailFromJar((name) => jar.get(name)?.value);
  if (!email.includes('@')) {
    return Response.json(
      {
        ...EXTRA_CREDITS_FORBIDDEN,
        packs: TOKEN_PACKS.map((p) => ({
          id: p.id,
          name: p.name,
          priceUsd: p.priceUsd,
          href: extraCheckoutPath(p.id),
        })),
      },
      { status: 402 }
    );
  }

  let balance;
  try {
    balance = await consumeExtraCredit(email, extraId);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not debit extra credits.';
    return Response.json({ error: message }, { status: 500 });
  }
  if (!balance) {
    return Response.json(
      {
        ...EXTRA_CREDITS_FORBIDDEN,
        packs: TOKEN_PACKS.map((p) => ({
          id: p.id,
          name: p.name,
          priceUsd: p.priceUsd,
          href: extraCheckoutPath(p.id),
        })),
      },
      { status: 402 }
    );
  }

  const extra = extraById(extraId);

  const system =
    extraId === 'filing_extract'
      ? 'You extract filing facts for an investment-research simulation. List: material numbers, contradictions, risk factors, questions unlocked seats should ask. Never say buy, sell, or a target price. Never impersonate a named investor.'
      : 'You write trigger and invalidation conditions for a research simulation. Frame as “what would change a method’s mind,” not orders. No buy, no sell, no overweight. If you mention a price, label it a watch condition.';

  const user =
    extraId === 'filing_extract'
      ? `Filing excerpt${ticker ? ` (${ticker})` : ''}:\n\n${text}`
      : `Ticker or question: ${ticker || text || 'unspecified'}. Write 5–8 watch conditions a timing/exit method might keep. Research simulation only.`;

  let content = '';
  let model = 'template';

  if (hasDeepseekKey()) {
    try {
      const live = await deepseekChat({
        lane: 'card',
        thinking: false,
        timeoutMs: 25000,
        maxTokens: 700,
        temperature: 0.2,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      });
      content = live.content;
      model = live.model;
    } catch {
      content = '';
    }
  }

  if (!content) {
    content =
      extraId === 'filing_extract'
        ? 'Live extract is off or timed out. Paste the filing again later, or convene unlocked seats on the ticker — they read cached companyfacts, not this paste.'
        : 'Live trigger pack is off or timed out. Use the timing / exit kits instead: conditions, not tickets. Isolated briefs never say you should buy.';
  }

  return Response.json({
    extra: extraId,
    name: extra.name,
    priceUsd: extra.priceUsd,
    model,
    remaining: balance.remaining,
    content,
    disclaimer:
      'Token extra. Research simulation. Not advice. No order routing. DeepSeek V4 Flash when configured.',
  });
}
