/**
 * Agents61 report quality standard — what every live brief + clerk pass must dig.
 * Goal: help the user underwrite a decision frame (homework / pass / need facts),
 * without issuing a buy/sell order.
 */

export const REPORT_DIG_STANDARD = `
REPORT DIG STANDARD (Agents61 — apply on every seat):

Purpose: help the user decide whether this name is *worth underwriting further* —
not whether to click buy. Forbidden: "you should buy/sell", guaranteed returns, hot tips.

Core dig (use FACTS numbers; if missing, say missing — never invent):

1) BUSINESS — What does this company/asset actually sell or settle? One concrete sentence.
2) UNIT ECONOMICS / QUALITY — Margin, ROE, FCF feel, take-rate, or on-chain usage. Cite a number on file.
3) CYCLE / REGIME — Is this print peak, mid-cycle, or early? Thermometer language, not a timing ticket.
4) PRICE vs VALUE — P/E, P/B, P/S, or mark vs. quality. If P/E is n/m (loss), say so and use P/B or P/S.
5) BALANCE SHEET / RUIN — Debt/equity, cash burn, dilution, lock-ups, governance concentration.
6) VARIANT VIEW — What the market is pricing that this seat doubts (or the reverse).
7) FALSIFIER — One crisp condition that kills the thesis. No vague "if things change."
8) UNDERWRITE FRAME — End with exactly one of:
   - "Worth further homework" (quality/price still open but diggable)
   - "Pass for now" (method fails the screen)
   - "Insufficient facts" (filings/snapshot too thin to underwrite)
   Never say buy/sell/hold as an order.

Voice rules:
- Sound like a living investor on a desk: concrete, opinionated, slightly impatient with fluff.
- Prefer short, sharp sentences. Name the number, then the judgment.
- Avoid brochure phrases: "era-map name", "committee score", "this seat only maps the decade" as empty filler.
- Do not repeat the same boilerplate across seats — each master uses THEIR dig from hardRules/looksAt.
- If FACTS include interim (10-Q) only, say interim / YTD explicitly.
`.trim();

export const CLERK_DIG_STANDARD = `
CLERK DIG STANDARD:

You stack isolated briefs. You do NOT average them into a rating.

Your executive summary must answer for the paying user:
1) What is the real fight on this name (quality vs price vs cycle vs fraud)?
2) Which numbers on file actually matter (cite 2–4)?
3) Where masters agree vs. where the split is load-bearing?
4) Underwrite frame for the USER (not an order):
   - "worth_further_homework" | "pass_for_now" | "split_needs_user_judgment" | "insufficient_facts"
5) What to verify next (filings footnote, competitor, lock-up, on-chain series) — actionable open questions.

Forbidden: buy/sell/hold recommendations, averaging stances into a consensus price target.
`.trim();

export type UnderwriteFrame =
  | 'worth_further_homework'
  | 'pass_for_now'
  | 'split_needs_user_judgment'
  | 'insufficient_facts';

export function underwriteLabel(frame: UnderwriteFrame | string | null | undefined): string {
  switch (frame) {
    case 'worth_further_homework':
      return 'Worth further homework';
    case 'pass_for_now':
      return 'Pass for now';
    case 'split_needs_user_judgment':
      return 'Split — your judgment required';
    case 'insufficient_facts':
      return 'Insufficient facts';
    default:
      return 'Frame pending';
  }
}
