import { routeClerkMessage } from '@/lib/clerk-router';
import { deepseekChat, hasDeepseekKey } from '@/lib/llm/deepseek';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: { message?: string; extra?: string } = {};
  try {
    body = (await request.json()) as { message?: string; extra?: string };
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const message = (body.message ?? '').trim();
  if (!message || message.length > 2000) {
    return Response.json({ error: 'Ask the clerk in 1–2000 characters.' }, { status: 400 });
  }

  const routed = routeClerkMessage(message, body.extra);
  let reply = routed.reply;

  if (hasDeepseekKey()) {
    try {
      const live = await deepseekChat({
        lane: 'card',
        thinking: false,
        timeoutMs: 12000,
        maxTokens: 220,
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content:
              'You are the Agents61 clerk. You coordinate isolated master seats (unaffiliated digital identities). You never say buy, sell, overweight, or a target price. You never impersonate a master. Two or three short sentences. Hand off to a tool.',
          },
          { role: 'user', content: message },
        ],
      });
      if (live.content) reply = live.content;
    } catch {
      /* template reply stays */
    }
  }

  return Response.json({
    reply,
    tools: routed.tools,
    staffed: routed.staffed,
    model: hasDeepseekKey() ? 'deepseek-v4-flash' : 'template',
  });
}
