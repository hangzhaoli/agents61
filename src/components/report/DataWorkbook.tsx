'use client';

import type { Assembly, BriefStance } from '@/lib/research';
import {
  CycleLine,
  MetricsTable,
  StanceLegend,
  StancePie,
} from '@/components/report/ReportAnalytics';
import MiniSpark from '@/components/landing/MiniSpark';

const STANCE_COLOR: Record<BriefStance, string> = {
  constructive: '#059669',
  cautious: '#d97706',
  skeptical: '#dc2626',
  inconclusive: '#64748b',
};

function domainLabel(domain: Assembly['domain']): string {
  if (domain === 'crypto') return 'Crypto snapshot';
  if (domain === 'private') return 'Private desk marks';
  return 'Valuation & filings';
}

export default function DataWorkbook({ assembly }: { assembly: Assembly }) {
  const valuation = assembly.valuation ?? [];
  const scenarios = assembly.cycleScenarios ?? [];
  const total = Object.values(assembly.counts).reduce((a, b) => a + b, 0);

  return (
    <section className="data-workbook">
      <div className="data-workbook-head">
        <div>
          <p className="text-xs font-bold tracking-widest text-[#0052d9] uppercase">Data workbook</p>
          <h3 className="text-base font-extrabold text-slate-900 mt-1">
            Tables, stance mix, cycle fan — from isolated briefs
          </h3>
        </div>
        <p className="text-[11px] text-slate-400 max-w-xs text-right hidden sm:block">
          Cached model input · not live quotes · not a rating
        </p>
      </div>

      <div className="data-workbook-kpis">
        {(Object.keys(assembly.counts) as BriefStance[]).map((k) => (
          <div key={k} className="data-workbook-kpi">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: STANCE_COLOR[k] }} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{k}</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">{assembly.counts[k]}</div>
            <MiniSpark seed={`${assembly.ticker}-${k}`} tone={k === 'constructive' ? 'up' : k === 'skeptical' ? 'down' : 'flat'} className="w-16 h-5 mt-2 opacity-70" />
          </div>
        ))}
        <div className="data-workbook-kpi">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Seats</span>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">{total}</div>
          <span className="text-[10px] text-slate-400 mt-2 block">{assembly.ticker}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="data-workbook-panel">
          <h4 className="text-sm font-bold text-slate-900 mb-3">Stance mix</h4>
          <div className="flex items-center gap-6">
            <StancePie counts={assembly.counts} />
            <StanceLegend counts={assembly.counts} />
          </div>
        </div>
        <div className="data-workbook-panel">
          <h4 className="text-sm font-bold text-slate-900 mb-3">Cycle scenario fan (%)</h4>
          {scenarios.length ? (
            <CycleLine scenarios={scenarios} />
          ) : (
            <p className="text-sm text-slate-500">No cycle board on this run.</p>
          )}
        </div>
      </div>

      <div className="data-workbook-panel">
        <h4 className="text-sm font-bold text-slate-900 mb-3">{domainLabel(assembly.domain)}</h4>
        <MetricsTable rows={valuation} />
      </div>

      {assembly.dataHighlights && assembly.dataHighlights.length > 0 && (
        <div className="data-workbook-panel mt-4">
          <h4 className="text-sm font-bold text-slate-900 mb-2">Cited in briefs</h4>
          <ul className="text-sm text-slate-700 space-y-1 list-disc pl-4">
            {assembly.dataHighlights.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
