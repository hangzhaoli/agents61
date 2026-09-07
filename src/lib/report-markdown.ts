import type { Assembly, IndependentBrief } from '@/lib/research';
import { PLANS, type PlanId } from '@/lib/tiers';

export function reportToMarkdown(opts: {
  plan: PlanId;
  question: string;
  ticker: string | null;
  briefs: IndependentBrief[];
  assembly: Assembly;
}): string {
  const { plan, question, ticker, briefs, assembly } = opts;
  const meta = PLANS[plan];
  const lines: string[] = [
    `# Agents61 committee report`,
    ``,
    `- Plan: ${meta.name} (${meta.seats} seats)`,
    `- Question: ${question}`,
    ticker ? `- Subject: ${ticker}` : `- Subject: none (methodology only)`,
    `- Domain: ${assembly.domain ?? 'ticker'}`,
    `- Isolated seats: ${assembly.seatCount}`,
    `- Stances: constructive ${assembly.counts.constructive}, cautious ${assembly.counts.cautious}, skeptical ${assembly.counts.skeptical}, inconclusive ${assembly.counts.inconclusive}`,
    ``,
    `This is a research simulation. Isolated briefs never say you should buy. There is no buy button. Not personalized advice. Publisher’s own 1940 Act positioning — not a payment-processor approval.`,
    ``,
    `## Summary table`,
    ``,
    `| Metric | Value |`,
    `| --- | --- |`,
    ...(assembly.valuation ?? []).map((r) => `| ${r.label} | ${r.value} |`),
    ``,
    `## Cycle scenarios`,
    ``,
    ...(assembly.cycleScenarios ?? []).map((s) => `- ${s.label}: ${s.probability}%`),
    ``,
    `## Clerk assembly`,
    ``,
    `### Where they agree`,
    ...assembly.agreements.map((a) => `- ${a}`),
    ``,
    `### The split that stays`,
    ...assembly.splits.map((a) => `- ${a}`),
    ``,
    `${assembly.residual}`,
    ``,
    `_${assembly.clerkNote}_`,
    ``,
    `## Isolated briefs`,
    ``,
  ];

  for (const b of briefs) {
    lines.push(`### ${b.nameEn} — ${b.role}`);
    lines.push(`**Stance:** ${b.stance}`);
    lines.push(``);
    lines.push(`**View:** ${b.thesis ?? ''}`);
    lines.push(``);
    lines.push(`**Why:** ${b.why ?? ''}`);
    lines.push(``);
    lines.push(b.finding);
    lines.push(``);
    if (b.risks) {
      lines.push(`**Risks:** ${b.risks}`);
      lines.push(``);
    }
    lines.push(`Looks at: ${b.looksAt}`);
    lines.push(`Source: ${b.sourceLine}`);
    lines.push(`${b.wouldChangeMind}`);
    lines.push(``);
  }

  return lines.join('\n');
}

export function downloadMarkdown(filename: string, markdown: string) {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function reportFilename(ticker: string | null, ext = 'md'): string {
  const day = new Date().toISOString().slice(0, 10);
  const tag = ticker ? ticker.toLowerCase() : 'question';
  return `agents61-${tag}-${day}.${ext}`;
}
