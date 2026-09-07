import type { jsPDF } from 'jspdf';
import type { Assembly, BriefStance, IndependentBrief } from '@/lib/research';
import { PLANS, type PlanId } from '@/lib/tiers';
import { reportFilename } from '@/lib/report-markdown';

const STANCE_RGB: Record<BriefStance, [number, number, number]> = {
  constructive: [5, 150, 105],
  cautious: [217, 119, 6],
  skeptical: [220, 38, 38],
  inconclusive: [100, 116, 139],
};

function wrap(doc: jsPDF, text: string, x: number, y: number, maxW: number, lineH = 5) {
  const lines = doc.splitTextToSize(text, maxW) as string[];
  doc.text(lines, x, y);
  return y + lines.length * lineH;
}

export async function downloadReportPdf(opts: {
  plan: PlanId;
  question: string;
  ticker: string | null;
  briefs: IndependentBrief[];
  assembly: Assembly;
}) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;
  const maxW = pageW - margin * 2;
  const meta = PLANS[opts.plan];
  let y = 18;

  const ensure = (need: number) => {
    if (y + need > pageH - 16) {
      footer();
      doc.addPage();
      y = 18;
    }
  };
  const footer = () => {
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Agents61 research simulation. Not investment advice. No buy button. Page ' +
        `${doc.getNumberOfPages()}`,
      margin,
      pageH - 8
    );
    doc.setTextColor(15, 23, 42);
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 82, 217);
  doc.text('Agents61 committee report', margin, y);
  y += 8;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.text(opts.ticker ? String(opts.ticker) : 'Methodology board', margin, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  y = wrap(
    doc,
    `${meta.name} · ${opts.assembly.seatCount} isolated seats · ${opts.assembly.domain ?? 'ticker'} · ${opts.question}`,
    margin,
    y,
    maxW,
    4.5
  );
  y += 3;
  doc.setTextColor(71, 85, 105);
  y = wrap(
    doc,
    'Publisher research simulation. Isolated briefs never say you should buy. There is no order ticket. Not personalized advice. 1940 Act publisher-exclusion language is our own positioning.',
    margin,
    y,
    maxW,
    4.2
  );
  y += 6;
  doc.setTextColor(15, 23, 42);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Stance mix', margin, y);
  y += 4;
  const total = Math.max(1, Object.values(opts.assembly.counts).reduce((a, b) => a + b, 0));
  const barX = margin;
  const barW = maxW;
  const barH = 8;
  let x = barX;
  (Object.keys(opts.assembly.counts) as BriefStance[]).forEach((k) => {
    const w = (opts.assembly.counts[k] / total) * barW;
    const [r, g, b] = STANCE_RGB[k];
    doc.setFillColor(r, g, b);
    doc.rect(x, y, w, barH, 'F');
    x += w;
  });
  y += barH + 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(
    `constructive ${opts.assembly.counts.constructive} · cautious ${opts.assembly.counts.cautious} · skeptical ${opts.assembly.counts.skeptical} · inconclusive ${opts.assembly.counts.inconclusive}`,
    margin,
    y
  );
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Cycle scenario fan', margin, y);
  y += 3;
  const scenarios = opts.assembly.cycleScenarios ?? [];
  const chartH = 32;
  const chartW = maxW;
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, chartW, chartH);
  if (scenarios.length) {
    const pts = scenarios.map((s, i) => {
      const px = margin + (scenarios.length === 1 ? chartW / 2 : (i / (scenarios.length - 1)) * chartW);
      const py = y + chartH - (s.probability / 100) * chartH;
      return { px, py, label: s.label, p: s.probability };
    });
    doc.setDrawColor(0, 82, 217);
    doc.setLineWidth(0.6);
    for (let i = 1; i < pts.length; i++) {
      doc.line(pts[i - 1].px, pts[i - 1].py, pts[i].px, pts[i].py);
    }
    doc.setFontSize(7);
    pts.forEach((p) => {
      doc.setFillColor(0, 82, 217);
      doc.circle(p.px, p.py, 1.1, 'F');
      doc.setTextColor(100, 116, 139);
      doc.text(`${p.label} ${p.p}%`, p.px, y + chartH + 4, { align: 'center' });
    });
    doc.setTextColor(15, 23, 42);
  }
  y += chartH + 10;

  ensure(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Metrics', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  for (const row of opts.assembly.valuation ?? []) {
    ensure(6);
    doc.setFont('helvetica', 'bold');
    doc.text(row.label, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(row.value, margin + 55, y);
    y += 5;
  }
  y += 4;

  ensure(20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Clerk assembly', margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.text('Where they agree', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  for (const line of opts.assembly.agreements) {
    ensure(10);
    y = wrap(doc, `• ${line}`, margin, y, maxW, 4.2) + 1;
  }
  y += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('The split that stays', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  for (const line of opts.assembly.splits) {
    ensure(10);
    y = wrap(doc, `• ${line}`, margin, y, maxW, 4.2) + 1;
  }
  y += 2;
  ensure(12);
  y = wrap(doc, opts.assembly.residual, margin, y, maxW, 4.2) + 3;
  doc.setTextColor(100, 116, 139);
  y = wrap(doc, opts.assembly.clerkNote, margin, y, maxW, 4.2) + 6;
  doc.setTextColor(15, 23, 42);

  for (const b of opts.briefs) {
    ensure(48);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin - 1, y - 4, maxW + 2, 6, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`${b.nameEn} — ${b.role}`, margin, y);
    y += 6;
    const rgb = STANCE_RGB[b.stance];
    doc.setTextColor(...rgb);
    doc.setFontSize(9);
    doc.text(`Stance: ${b.stance}`, margin, y);
    doc.setTextColor(15, 23, 42);
    y += 5;
    doc.setFont('helvetica', 'bold');
    y = wrap(doc, `View: ${b.thesis ?? ''}`, margin, y, maxW, 4.2) + 1;
    y = wrap(doc, `Why: ${b.why ?? ''}`, margin, y, maxW, 4.2) + 1;
    doc.setFont('helvetica', 'normal');
    y = wrap(doc, b.finding, margin, y, maxW, 4.2) + 1;
    if (b.risks) y = wrap(doc, `Risks: ${b.risks}`, margin, y, maxW, 4.2) + 1;
    doc.setTextColor(100, 116, 139);
    y = wrap(doc, `${b.sourceLine}  ${b.wouldChangeMind}`, margin, y, maxW, 4.2) + 6;
    doc.setTextColor(15, 23, 42);
  }

  footer();
  doc.save(reportFilename(opts.ticker, 'pdf'));
}
