import {
  detectPrepForCommittee,
  formatPrepClerkReply,
  routeClerkMessage,
} from '@/lib/clerk-router';
import { getFundamentals } from '@/lib/data/fundamentals';
import { runResearchPrep } from '@/lib/desk/research-pipeline';
import { deepseekChat, hasDeepseekKey } from '@/lib/llm/deepseek';
import { getNewsDigest, hasTavilyKey } from '@/lib/llm/news-scan';

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
  let researchPrep = routed.researchPrep;

  // Research-prep path: facts blocks only — never invent a committee buy score.
  if (routed.prepTicker) {
    try {
      const facts = await getFundamentals(routed.prepTicker);
      const news = hasTavilyKey()
        ? await getNewsDigest(routed.prepTicker, facts.entityName)
        : null;
      researchPrep = runResearchPrep({ fundamentals: facts, news });
      reply = formatPrepClerkReply(routed.prepTicker, researchPrep, {
        forCommittee: detectPrepForCommittee(message),
      });
    } catch (err) {
      const reason = err instanceof Error ? err.message : 'prep failed';
      reply = `Could not finish research-prep for ${routed.prepTicker} (${reason}). You can still convene isolated seats — I will not invent a buy score.`;
    }
  } else if (hasDeepseekKey()) {
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
              'You are the Agents61 clerk. You coordinate isolated master seats (unaffiliated digital identities). You never say buy, sell, overweight, or a target price. You never impersonate a master. You may suggest research-prep then seat briefs — never average ratings into a buy score. Two or three short sentences. Hand off to a tool.',
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
    researchPrep: researchPrep ?? undefined,
    prepTicker: routed.prepTicker,
    model: routed.prepTicker
      ? 'research-prep'
      : hasDeepseekKey()
        ? 'deepseek-v4-flash'
        : 'template',
  });
}
