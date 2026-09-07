import Link from 'next/link';
import {
  Lock,
  Scale,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { getMasterBySlug, getMastersByGroup, type Master } from '@/lib/masters';
import MasterAvatar from '@/components/masters/MasterAvatar';
import {
  DEBATE_SEQUENCE,
  EXIT_RULES,
  PIPELINE_STEPS,
  QUANT_DUTIES,
  QUANT_LAYER,
  TIMING_METHODS,
} from '@/lib/pipeline';
import { CYCLE_SNAPSHOT, TREND_THEMES } from '@/lib/opportunities';
import { isEmergingTicker } from '@/lib/emerging-markets';
import type { Fundamentals } from '@/lib/data/fundamentals';
import { isFullRoster, isUnlocked, PLANS, type PlanId } from '@/lib/tiers';
import { runIsolatedResearch } from '@/lib/research';
import PlanSeatBar from '@/components/report/PlanSeatBar';
import IsolatedResearch from '@/components/report/IsolatedResearch';
import ReportDownloadButton from '@/components/report/ReportDownloadButton';

export default function CommitteeReport({
  ticker,
  facts,
  plan,
  heading,
  lede,
}: {
  ticker: string;
  facts: Fundamentals;
  plan: PlanId;
  heading?: string;
  lede?: string;
}) {
  const t = ticker.toUpperCase();
  const kind = isEmergingTicker(t) ? 'emerging' : 'ticker';
  const { briefs, assembly } = runIsolatedResearch(plan, t, facts, '', kind);
  const planMeta = PLANS[plan];

  const take = (group: Master['group']) =>
    getMastersByGroup(group).filter((m) => isUnlocked(plan, m.slug));

  const valueMasters = take('value');
  const growthMasters = take('growth');
  const timingMasters = take('timing');
  const exitMasters = take('exit');
  const quantMasters = take('quant');
  const cycleMasters = take('cycle');

  const redTeam = DEBATE_SEQUENCE.redTeam.filter((row) => isUnlocked(plan, row.slug));
  const crossExam = DEBATE_SEQUENCE.crossExam.filter((row) => isUnlocked(plan, row.slug));
  const verdict = DEBATE_SEQUENCE.verdict.filter((row) => isUnlocked(plan, row.slug));
  const debateUnlocked = redTeam.length + crossExam.length + verdict.length > 0;

  const bullish = assembly.counts.constructive;
  const bearish = assembly.counts.skeptical;
  const neutral = assembly.counts.cautious + assembly.counts.inconclusive;
  const total = Math.max(1, bullish + bearish + neutral);
  const bullishPct = Math.round((bullish / total) * 100);
  const bearishPct = Math.round((bearish / total) * 100);
  const neutralPct = 100 - bullishPct - bearishPct;

  return (
    <div className="section-container py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{heading ?? t}</h1>
            <div className="badge badge-primary">{planMeta.name} · {planMeta.seats} seats</div>
          </div>
          {lede ? (
            <p className="text-slate-600 max-w-3xl mt-1">{lede}</p>
          ) : null}
          <p className="text-slate-500 mt-2">
            Independent briefs, then clerk assembly · {planMeta.computeNote}
            {' · '}filing facts from SEC EDGAR (cached 7 days) — not investment advice, no buy button
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard?entry=analyze" className="btn-secondary text-sm">
            Ask the desk
          </Link>
          <ReportDownloadButton
            plan={plan}
            question={`Research ${t} as a US-listed name.`}
            ticker={t}
            briefs={briefs}
            assembly={assembly}
          />
        </div>
      </div>

      <PlanSeatBar plan={plan} ticker={t} />

      <div className="flex flex-wrap gap-2 mb-8">
        <a href="#isolated" className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#0052d9]/10 text-[#0052d9]">
          Isolated briefs
        </a>
        <a href="#assembly" className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          Assembly
        </a>
        {PIPELINE_STEPS.map((s) => (
          <a
            key={s.step}
            href={`#step-${s.step}`}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-[#0052d9]/10 hover:text-[#0052d9] transition-colors"
          >
            {s.step}. {s.output}
          </a>
        ))}
      </div>

      <EdgarFactCard facts={facts} />

      <IsolatedResearch
        plan={plan}
        briefs={briefs}
        assembly={assembly}
        compact={plan === 'observer'}
      />

      <div className="card p-6 md:p-8 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Split after isolation</h2>
        <p className="text-sm text-slate-500 mb-6">
          Counted from independent briefs only — not a vote, not a recommendation.
        </p>
        <div className="flex h-8 rounded-full overflow-hidden bg-slate-100 mb-4">
          <div className="bg-emerald-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${bullishPct}%` }}>
            {bullishPct > 8 ? `${bullishPct}%` : ''}
          </div>
          <div className="bg-slate-300 flex items-center justify-center text-slate-600 text-xs font-bold" style={{ width: `${neutralPct}%` }}>
            {neutralPct > 8 ? `${neutralPct}%` : ''}
          </div>
          <div className="bg-red-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${bearishPct}%` }}>
            {bearishPct > 8 ? `${bearishPct}%` : ''}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <TrendingUp className="h-4 w-4" /> {bullish} constructive
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <Minus className="h-4 w-4" /> {neutral} cautious / inconclusive
          </span>
          <span className="flex items-center gap-1.5 text-red-600">
            <TrendingDown className="h-4 w-4" /> {bearish} skeptical
          </span>
        </div>
      </div>

      <div className="space-y-8">
        <section id="step-1" className="card-flat p-6 md:p-8">
          <StepHead n={1} title="Era Trend List" question="Where does capital flow over the next decade?" />
          {isUnlocked(plan, 'cathie-wood') ? (
            <>
              <p className="text-sm text-slate-600 mb-4">
                {t} is mapped against this week’s trend board by the unlocked trend seats. Strength is a committee score, not a price forecast.
              </p>
              <div className="space-y-3">
                {TREND_THEMES.map((theme) => (
                  <div key={theme.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-100 px-3 py-2">
                    <span className="text-sm font-semibold text-slate-900">{theme.title}</span>
                    <span className="text-xs text-slate-400">Strength {theme.strength}/10</span>
                    {theme.industries.map((ind) => (
                      <span key={ind} className="badge badge-neutral text-[10px]">{ind}</span>
                    ))}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <LockedLayer plan={plan} need="Analyst (16)" label="Trend research (Wood, Laffont, and the rest of the era desk)" />
          )}
        </section>

        <section id="step-2" className="card-flat p-6 md:p-8">
          <StepHead n={2} title="Cycle Position Report" question="Where are we in the cycle?" />
          {cycleMasters.length > 0 ? (
            <>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-5xl font-extrabold text-[#0052d9]">{CYCLE_SNAPSHOT.temperature}</span>
                <span className="badge badge-warning mb-1">{CYCLE_SNAPSHOT.phase}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {CYCLE_SNAPSHOT.scenarios.map((s) => (
                  <div key={s.id} className="rounded-lg bg-slate-50 px-3 py-2">
                    <div className="text-xs text-slate-500">{s.label}</div>
                    <div className="text-sm font-bold text-slate-900">{s.probability}%</div>
                  </div>
                ))}
              </div>
              <ul className="text-sm text-slate-600 space-y-1">
                {isUnlocked(plan, 'ray-dalio') && <li>Dalio: {CYCLE_SNAPSHOT.dalio}</li>}
                {isUnlocked(plan, 'howard-marks') && <li>Marks: {CYCLE_SNAPSHOT.marks}</li>}
                {isUnlocked(plan, 'john-templeton') && <li>Templeton: {CYCLE_SNAPSHOT.templeton}</li>}
              </ul>
            </>
          ) : (
            <LockedLayer plan={plan} need="Analyst (16)" label="Cycle desk (Dalio, Marks, Templeton)" />
          )}
        </section>

        <section id="step-3" className="card-flat p-6 md:p-8">
          <StepHead n={3} title="Why this name (dual track)" question="What to buy — why this ticker is in the pool, or not" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Value / Quality track</h3>
              {valueMasters.length ? (
                <div className="space-y-2">
                  {valueMasters.slice(0, isFullRoster(plan) ? 10 : plan === 'principal' ? 7 : plan === 'associate' ? 5 : 4).map((m) => (
                    <OpinionRow key={m.slug} name={m.nameEn} slug={m.slug} text={`${t}: screened alone against ${m.role}.`} />
                  ))}
                </div>
              ) : (
                <LockedLayer plan={plan} need="Observer" label="Value track" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Growth / Opportunity track</h3>
              {growthMasters.length ? (
                <div className="space-y-2">
                  {growthMasters.slice(0, isFullRoster(plan) ? 10 : plan === 'principal' ? 7 : plan === 'associate' ? 5 : 4).map((m) => (
                    <OpinionRow key={m.slug} name={m.nameEn} slug={m.slug} text={`${t}: screened alone against ${m.role}.`} />
                  ))}
                </div>
              ) : (
                <LockedLayer plan={plan} need="Observer" label="Growth track" />
              )}
            </div>
          </div>
        </section>

        <section id="step-4" className="card p-6 md:p-8 relative overflow-hidden">
          <StepHead n={4} title="Investment Proposal" question="Bull case vs. red-team interrogation — after isolation" />
          {debateUnlocked ? (
            <>
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Debate starts only after independent briefs exist. Red team still does not see a shared draft.
                </p>
                {redTeam.length > 0 && (
                  <>
                    <p className="text-sm font-semibold text-slate-800">Red-team interrogation</p>
                    <div className="space-y-2">
                      {redTeam.map((row) => {
                        const m = getMasterBySlug(row.slug);
                        if (!m) return null;
                        return (
                          <div key={row.slug} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                            <MasterAvatar master={m} size="sm" />
                            <div>
                              <div className="text-sm font-semibold text-slate-900">{m.nameEn}</div>
                              <div className="text-xs text-slate-500">{row.duty}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                {crossExam.map((row) => (
                  <p key={row.slug} className="text-sm text-slate-600">
                    {getMasterBySlug(row.slug)?.nameEn} — {row.duty}
                  </p>
                ))}
                {verdict.map((row) => (
                  <p key={row.slug} className="text-sm text-slate-600">
                    {getMasterBySlug(row.slug)?.nameEn} — {row.duty}
                  </p>
                ))}
              </div>
              {!isFullRoster(plan) && (
                <div className="mt-6 flex flex-col items-center">
                  <Lock className="h-5 w-5 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600 mb-3">
                    Full transcript, risk list, and sizing stay on higher seats.
                  </p>
                  <Link href="/pricing" className="btn-primary text-sm">
                    <Scale className="h-4 w-4" />
                    Unlock more seats
                  </Link>
                </div>
              )}
            </>
          ) : (
            <LockedLayer plan={plan} need="Analyst (16)" label="Red-team debate (Einhorn, Burry, and inversion)" />
          )}
        </section>

        <section id="step-5" className="card-flat p-6 md:p-8">
          <StepHead n={5} title="Entry Plan" question="When to buy, and how much" />
          {timingMasters.length ? (
            <div className="space-y-3">
              {timingMasters.map((m) => (
                <div key={m.slug} className="flex items-start gap-3">
                  <MasterAvatar master={m} size="sm" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{m.nameEn}</div>
                    <div className="text-xs text-slate-500">{TIMING_METHODS[m.slug]}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <LockedLayer plan={plan} need="Analyst (16)" label="Timing desk (O’Neil and the tape seats)" />
          )}
        </section>

        <section id="step-6" className="card-flat p-6 md:p-8">
          <StepHead n={6} title="Exit Discipline" question="When to sell" />
          {exitMasters.length ? (
            <div className="space-y-3">
              {exitMasters.map((m) => (
                <div key={m.slug} className="flex items-start gap-3">
                  <MasterAvatar master={m} size="sm" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{m.nameEn}</div>
                    <div className="text-xs text-slate-500">{EXIT_RULES[m.slug]}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <LockedLayer plan={plan} need="Committee or Partners (61)" label="Exit desk (Livermore, Darvas, Bogle accountability)" />
          )}
        </section>

        <section id="quant" className="card p-6 md:p-8 border-[#0d9488]/20 bg-gradient-to-r from-teal-50/50 to-cyan-50/50">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-5 w-5 text-[#0d9488]" />
            <h2 className="text-lg font-bold text-slate-900">{QUANT_LAYER.label}</h2>
          </div>
          {quantMasters.length ? (
            <>
              <p className="text-sm text-slate-600 mb-4">{QUANT_LAYER.output}. Verify every intuition — after the isolated briefs, not instead of them.</p>
              <div className="flex flex-wrap gap-2">
                {quantMasters.map((m) => (
                  <div key={m.slug} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-100">
                    <MasterAvatar master={m} size="xs" />
                    <span className="text-xs text-slate-700">{m.nameEn}</span>
                    <span className="text-[10px] text-slate-400 hidden md:inline">{QUANT_DUTIES[m.slug]}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <LockedLayer plan={plan} need="Analyst (16)" label="Quant (Thorp Kelly sizing, then the full seven on Committee)" />
          )}
        </section>
      </div>

      <p className="mt-10 text-center text-xs text-slate-400 max-w-2xl mx-auto">
        Agents61 is a research simulation and educational tool. Isolated views, splits, and
        assembly notes only. Not personalized advice. AI-generated.
      </p>
    </div>
  );
}

function LockedLayer({ plan, need, label }: { plan: PlanId; need: string; label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-5 flex items-start gap-3">
      <Lock className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm text-slate-700">{label} is locked on {PLANS[plan].name}.</p>
        <p className="text-xs text-slate-500 mt-1">Unlocks on {need}. Empty seats stay empty — we do not ghost-fill them.</p>
        <Link href="/pricing" className="inline-block mt-3 text-sm font-semibold text-[#0052d9] hover:underline">
          Compare plans
        </Link>
      </div>
    </div>
  );
}

function money(n: number | null): string {
  if (n == null || Number.isNaN(n)) return '—';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  return `${sign}$${abs.toFixed(0)}`;
}

function pct(n: number | null): string {
  if (n == null || Number.isNaN(n)) return '—';
  const v = n * 100;
  const sign = v > 0 ? '+' : '';
  return `${sign}${v.toFixed(1)}%`;
}

function ratio(n: number | null): string {
  if (n == null || Number.isNaN(n)) return '—';
  return n.toFixed(2);
}

function EdgarFactCard({ facts }: { facts: Fundamentals }) {
  const peValue =
    facts.pe != null ? facts.pe.toFixed(1) : facts.peNm ? 'n/m' : '—';

  // Filing numbers first so interim issuers (e.g. SPCX) do not look "empty" at the top.
  const metrics = [
    { label: facts.periodKind === 'interim' ? 'Revenue (YTD)' : 'Revenue (FY)', value: money(facts.revenue) },
    {
      label: facts.periodKind === 'interim' ? 'Revenue YoY (same interim)' : 'Revenue YoY',
      value: pct(facts.revenueYoY),
    },
    { label: 'Net income', value: money(facts.netIncome) },
    { label: 'Diluted EPS', value: facts.epsDiluted == null ? '—' : `$${facts.epsDiluted.toFixed(2)}` },
    { label: 'ROE', value: facts.roe == null ? '—' : `${(facts.roe * 100).toFixed(1)}%` },
    { label: 'LT debt / equity', value: ratio(facts.debtToEquity) },
    { label: 'P/E', value: peValue },
    { label: 'P/B', value: facts.pb == null ? '—' : facts.pb.toFixed(2) },
    { label: 'P/S', value: facts.ps == null ? '—' : facts.ps.toFixed(2) },
    { label: 'Cached price', value: facts.price == null ? '—' : `$${facts.price.toFixed(2)}` },
    { label: 'Mkt cap (est.)', value: money(facts.marketCap) },
  ];

  const periodBadge =
    facts.periodKind === 'interim'
      ? `${facts.form ?? '10-Q'}${facts.fiscalPeriod ? ` ${facts.fiscalPeriod}` : ''} interim (no 10-K yet)`
      : facts.fiscalYear
        ? `FY${facts.fiscalYear}`
        : null;

  return (
    <div className="card p-6 md:p-8 mb-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Filing facts · SEC EDGAR</h2>
          <p className="text-sm text-slate-500 mt-1">
            {facts.entityName ?? facts.ticker}
            {facts.form ? ` · ${facts.form}` : ''}
            {facts.fiscalPeriod ? ` ${facts.fiscalPeriod}` : ''}
            {facts.fiscalYear ? ` · FY${facts.fiscalYear}` : ''}
            {facts.periodEnd ? ` · ended ${facts.periodEnd}` : ''}
            {facts.cik ? ` · CIK ${facts.cik}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="badge badge-neutral">Public filing · not a live quote</span>
          {periodBadge && <span className="badge badge-neutral">{periodBadge}</span>}
          {(facts.fmpInternalReady || facts.pb != null || facts.ps != null) && (
            <span className="badge badge-neutral">P/E · P/B · P/S cached model input</span>
          )}
        </div>
      </div>
      {facts.error ? (
        <p className="text-sm text-slate-600">{facts.error}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl bg-slate-50 p-4 text-center">
              <div className="text-xs text-slate-500 mb-1">{m.label}</div>
              <div className="text-lg font-bold text-slate-900">{m.value}</div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-slate-400 mt-4">
        Filings from SEC companyfacts (us-gaap). {facts.ratiosNote ??
          'P/E, P/B, and P/S use cached price × diluted shares when a data key is absent.'}{' '}
        Not a live quote, not advice, not a buy button. Missing numbers stay blank; P/E shows n/m
        when diluted EPS ≤ 0.
      </p>
    </div>
  );
}

function StepHead({ n, title, question }: { n: number; title: string; question: string }) {
  return (
    <div className="mb-4">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Step {n} · {question}
      </div>
      <h2 className="text-lg font-bold text-slate-900 mt-1">{title}</h2>
    </div>
  );
}

function OpinionRow({ name, slug, text }: { name: string; slug: string; text: string }) {
  const m = getMasterBySlug(slug);
  return (
    <div className="rounded-xl border border-slate-100 p-3">
      <div className="flex items-center gap-2 mb-1">
        {m && <MasterAvatar master={m} size="xs" />}
        <span className="text-sm font-semibold text-slate-900">{name}</span>
      </div>
      <p className="text-xs text-slate-600">{text}</p>
    </div>
  );
}
