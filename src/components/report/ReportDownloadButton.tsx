'use client';

import { Download, FileText } from 'lucide-react';
import type { Assembly, IndependentBrief } from '@/lib/research';
import { downloadMarkdown, reportFilename, reportToMarkdown } from '@/lib/report-markdown';
import { downloadReportPdf } from '@/lib/report-pdf';
import type { PlanId } from '@/lib/tiers';
import { useState } from 'react';

export default function ReportDownloadButton({
  plan,
  question,
  ticker,
  briefs,
  assembly,
  className = 'btn-secondary text-sm',
}: {
  plan: PlanId;
  question: string;
  ticker: string | null;
  briefs: IndependentBrief[];
  assembly: Assembly;
  className?: string;
}) {
  const [pdfBusy, setPdfBusy] = useState(false);

  function saveMd() {
    downloadMarkdown(
      reportFilename(ticker),
      reportToMarkdown({ plan, question, ticker, briefs, assembly })
    );
  }

  async function savePdf() {
    setPdfBusy(true);
    try {
      await downloadReportPdf({ plan, question, ticker, briefs, assembly });
    } finally {
      setPdfBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={saveMd} className={className}>
        <FileText className="h-4 w-4" strokeWidth={2.5} />
        Markdown
      </button>
      <button type="button" onClick={() => void savePdf()} disabled={pdfBusy} className={className}>
        <Download className="h-4 w-4" strokeWidth={2.5} />
        {pdfBusy ? 'Building PDF…' : 'PDF'}
      </button>
    </div>
  );
}
