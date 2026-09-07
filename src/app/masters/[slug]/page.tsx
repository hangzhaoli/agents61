import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { MASTERS, GROUP_META, getMasterBySlug, getMastersByGroup } from '@/lib/masters';
import MasterAvatar from '@/components/masters/MasterAvatar';
import MasterAnalyzeCta from '@/components/masters/MasterAnalyzeCta';
import MasterAuthCta from '@/components/masters/MasterAuthCta';
import StyleCurve from '@/components/masters/StyleCurve';
import { PLANS, unlocksOn } from '@/lib/tiers';
import { getPersona } from '@/lib/personas';
import { getMasterDossier } from '@/lib/master-dossier';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MASTERS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const master = getMasterBySlug(slug);
  if (!master) return {};

  return {
    title: `${master.nameEn} AI agent — ${master.role}`,
    description: `${master.nameEn} investment style, stock-selection strategy, and an illustrative style path on Agents61. ${master.methodology} Simulated persona from public books and letters. Not advice.`,
    keywords: [
      `${master.nameEn} stock analysis`,
      `${master.nameEn} investing`,
      `${master.nameEn} AI agent`,
      'investment research',
      'AI investment committee',
    ],
    openGraph: {
      title: `${master.nameEn} — Agents61 master seat`,
      description: master.methodology,
    },
  };
}

export default async function MasterProfilePage({ params }: Props) {
  const { slug } = await params;
  const master = getMasterBySlug(slug);
  if (!master) notFound();

  const meta = GROUP_META[master.group];
  const colleagues = getMastersByGroup(master.group).filter((m) => m.slug !== slug);
  const persona = getPersona(slug);
  const plan = unlocksOn(master.slug);
  const dossier = getMasterDossier(master);

  return (
    <>
      <Navbar />
      <div className="section-container py-12">
        <Link
          href="/masters"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0052d9] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
          All 61 Masters
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main profile */}
          <div className="lg:col-span-2">
            <div className="card p-8 md:p-10">
              <div className="flex items-start gap-6 mb-8">
                <MasterAvatar master={master} size="xl" />
                <div>
                  <div className="badge badge-primary mb-2">{meta.label}</div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                    {master.nameEn}
                  </h1>
                  <p className="text-sm font-medium text-slate-400 mt-2 uppercase tracking-wider">
                    {master.role}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Methodology
                  </h2>
                  <p className="text-slate-700 leading-relaxed">{master.methodology}</p>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Signature Move
                  </h2>
                  <p className="text-slate-700 leading-relaxed">{master.signature}</p>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Era
                  </h2>
                  <p className="text-slate-700">{master.era}</p>
                </div>

                <blockquote className="border-l-4 border-[#0052d9] pl-4 py-2 bg-blue-50/50 rounded-r-lg">
                  <p className="text-slate-700 italic">&ldquo;{master.quote}&rdquo;</p>
                </blockquote>

                <div>
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Investment style
                  </h2>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                      <dt className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">School</dt>
                      <dd className="text-sm font-medium text-slate-800 mt-1">{dossier.school}</dd>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                      <dt className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Horizon</dt>
                      <dd className="text-sm font-medium text-slate-800 mt-1">{dossier.horizon}</dd>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                      <dt className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Turnover</dt>
                      <dd className="text-sm font-medium text-slate-800 mt-1">{dossier.turnover}</dd>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                      <dt className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Concentration</dt>
                      <dd className="text-sm font-medium text-slate-800 mt-1">{dossier.concentration}</dd>
                    </div>
                  </dl>
                  <p className="text-sm font-medium text-slate-800 mb-3">{dossier.riskPosture}</p>
                  {dossier.styleNarrative.split('\n\n').map((para) => (
                    <p key={para.slice(0, 48)} className="text-slate-700 leading-relaxed mb-3 last:mb-0">
                      {para}
                    </p>
                  ))}
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Stock-selection strategy
                  </h2>
                  <p className="text-slate-700 leading-relaxed mb-4">{dossier.selectionIntro}</p>
                  <ol className="space-y-3">
                    {dossier.selectionSteps.map((step, i) => (
                      <li key={step} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                        <span className="shrink-0 h-6 w-6 rounded-full bg-[#0052d9]/10 text-[#0052d9] text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  {dossier.screens.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Screens on the desk
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {dossier.screens.map((item) => (
                          <span key={item} className="badge badge-neutral">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-4">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      This seat usually avoids
                    </h3>
                    <ul className="space-y-2">
                      {dossier.avoids.map((item) => (
                        <li key={item} className="text-sm text-slate-700 leading-relaxed pl-3 border-l-2 border-slate-200">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <StyleCurve
                    points={dossier.curve.points}
                    color={meta.color}
                    name={master.nameEn}
                    end={dossier.curve.end}
                    maxDrawdownPct={dossier.curve.maxDrawdownPct}
                    shapeLabel={dossier.curve.shapeLabel}
                  />
                  <p className="text-xs text-slate-500 leading-relaxed mt-3">{dossier.curve.caption}</p>
                </div>

                {persona ? (
                  <>
                    <div>
                      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Hard rules
                      </h2>
                      <ul className="space-y-2">
                        {persona.hardRules.map((rule) => (
                          <li key={rule} className="text-sm text-slate-700 leading-relaxed pl-3 border-l-2 border-slate-200">
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Looks at
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {persona.looksAt.map((item) => (
                          <span key={item} className="badge badge-neutral">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Kills the thesis if
                      </h2>
                      <ul className="space-y-2">
                        {persona.killsThesisIf.map((item) => (
                          <li key={item} className="text-sm text-slate-700 leading-relaxed pl-3 border-l-2 border-red-200">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">
                    This specialist seat unlocks on {PLANS[plan].name}. The 16 Analyst cards have
                    published hard rules; remaining seats still write isolated briefs from
                    their methodology notes — they do not see the other drafts.
                  </p>
                )}
              </div>

              <MasterAnalyzeCta name={master.nameEn} plan={plan} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card-flat p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Pipeline Position
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: meta.color }}
                />
                <span className="text-sm font-medium text-slate-700">{meta.label}</span>
              </div>
              <p className="text-xs text-slate-500">{meta.description}</p>
              {meta.step > 0 && (
                <div className="mt-3 text-xs text-slate-400">
                  Step {meta.step} of 6 in the committee pipeline
                </div>
              )}
              {meta.step === 0 && (
                <div className="mt-3 text-xs text-slate-400">
                  Runs across all 6 steps
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Unlocks on
                </div>
                <p className="text-sm font-medium text-slate-800">
                  {PLANS[unlocksOn(master.slug)].name} ({PLANS[unlocksOn(master.slug)].seats} seats)
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  On a report this seat writes an isolated brief. It does not see the other masters’ drafts.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Style snapshot</div>
                <p className="text-xs text-slate-600"><span className="font-semibold text-slate-800">School:</span> {dossier.school}</p>
                <p className="text-xs text-slate-600"><span className="font-semibold text-slate-800">Horizon:</span> {dossier.horizon}</p>
                <p className="text-xs text-slate-600"><span className="font-semibold text-slate-800">Turnover:</span> {dossier.turnover}</p>
              </div>
            </div>

            {colleagues.length > 0 && (
              <div className="card-flat p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Committee Colleagues
                </h3>
                <div className="space-y-3">
                  {colleagues.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/masters/${c.slug}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <MasterAvatar master={c} size="sm" />
                      <div>
                        <div className="text-sm font-medium text-slate-700 group-hover:text-[#0052d9] transition-colors">
                          {c.nameEn}
                        </div>
                        <div className="text-xs text-slate-400">{c.role}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <MasterAuthCta name={master.nameEn} slug={master.slug} />
      </div>
      <Footer />
    </>
  );
}
