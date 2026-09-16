/**
 * Lightweight FAQ generators for master profile SEO.
 * Same shape as compare hubs — no long-form essay system.
 */

import type { Master } from '@/lib/masters';

export type MasterFaq = { question: string; answer: string };

export function masterFaqs(master: Master): MasterFaq[] {
  const name = master.nameEn;
  return [
    {
      question: `How does Agents61 use ${name}?`,
      answer: `${name} is a named seat on the Agents61 investment committee — an unaffiliated simulation from public books, letters, and methodology notes. On a report the seat writes an isolated brief. It does not see other masters' drafts. Not the real person. Not advice.`,
    },
    {
      question: `What is ${name}'s investing method on this desk?`,
      answer: `${master.methodology} Signature move: ${master.signature}`,
    },
    {
      question: `Is this ${name} stock analysis or a buy signal?`,
      answer: `Neither a tip nor a rating. Agents61 is research simulation: method-shaped briefs, clerk stacks of agreements and splits, no order routing. If you want 13F holdings trackers, use GuruFocus-style tools — see /compare/gurufocus.`,
    },
  ];
}
