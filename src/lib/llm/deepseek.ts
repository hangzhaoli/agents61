/**
 * DeepSeek V4 client (OpenAI-compatible Chat Completions).
 * Current IDs: deepseek-v4-flash (0731) and deepseek-v4-pro (0813).
 * Legacy aliases deepseek-chat / deepseek-reasoner are retired — do not use them.
 * Thinking is a request param, not a model name.
 */

import type { Persona } from '@/lib/personas/types';

export const DEEPSEEK_FLASH = 'deepseek-v4-flash';
export const DEEPSEEK_PRO = 'deepseek-v4-pro';
export const DEEPSEEK_BASE = 'https://api.deepseek.com';

export type DeepseekLane = Persona['modelLane'];
export type BriefEngine = typeof DEEPSEEK_FLASH | typeof DEEPSEEK_PRO | 'template';

export function hasDeepseekKey(): boolean {
  return Boolean(process.env.DEEPSEEK_API_KEY?.trim());
}

export function modelForLane(lane: DeepseekLane): typeof DEEPSEEK_FLASH | typeof DEEPSEEK_PRO {
  return lane === 'card' ? DEEPSEEK_FLASH : DEEPSEEK_PRO;
}

export function deskModelBanner(): { live: boolean; modelNote: string } {
  if (hasDeepseekKey()) {
    return {
      live: true,
      modelNote:
        'DeepSeek V4 — Flash for cards, Pro with thinking for debate and verdict. A seat that times out falls back to its methodology card.',
    };
  }
  return {
    live: false,
    modelNote: 'Methodology cards only — live DeepSeek is not configured on this desk.',
  };
}

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

type CompletionJson = {
  choices?: Array<{
    message?: {
      content?: string | null;
      reasoning_content?: string | null;
    };
  }>;
};

export async function deepseekChat(opts: {
  lane: DeepseekLane;
  messages: ChatMessage[];
  thinking: boolean;
  effort?: 'low' | 'high' | 'max';
  timeoutMs: number;
  maxTokens: number;
  temperature?: number;
}): Promise<{ content: string; model: typeof DEEPSEEK_FLASH | typeof DEEPSEEK_PRO }> {
  const key = process.env.DEEPSEEK_API_KEY?.trim();
  if (!key) throw new Error('DEEPSEEK_API_KEY missing');

  const model = modelForLane(opts.lane);
  const base = (process.env.DEEPSEEK_BASE_URL?.trim() || DEEPSEEK_BASE).replace(/\/$/, '');
  const body: Record<string, unknown> = {
    model,
    messages: opts.messages,
    stream: false,
    max_tokens: opts.maxTokens,
    thinking: { type: opts.thinking ? 'enabled' : 'disabled' },
  };
  if (opts.thinking) {
    body.reasoning_effort = opts.effort ?? 'high';
  } else if (opts.temperature != null) {
    body.temperature = opts.temperature;
  }

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), opts.timeoutMs);
  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(body),
      signal: ac.signal,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`DeepSeek HTTP ${res.status}${detail ? `: ${detail.slice(0, 240)}` : ''}`);
    }
    const json = (await res.json()) as CompletionJson;
    const message = json.choices?.[0]?.message;
    const content =
      message?.content?.trim() || message?.reasoning_content?.trim() || '';
    if (!content) throw new Error('Empty DeepSeek content');
    return { content, model };
  } finally {
    clearTimeout(timer);
  }
}
