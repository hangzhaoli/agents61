import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { getPrivateCompany, PRIVATE_COMPANIES, privateDeskPrompt } from '@/lib/private-universe';
import { getPrivateFacts } from '@/lib/data/private-facts';
import { PRIVATE_HOOKS, dashboardPrivateGuestHref, dashboardPrivateHref } from '@/lib/private-hooks';
import AuthGateLink from '@/components/auth/AuthGateLink';
import type { Metadata } from 'next';

export const dynamicParams = false;

export function generateStaticParams() {
  return PRIVATE_COMPANIES.map((c) => ({ slug: c.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getPrivateCompany(slug);
  if (!c) return { title: 'Private desk' };
  const hook = PRIVATE_HOOKS.find((h) => h.slug === c.slug);
  return {
    title: hook
      ? `${c.name}: ${hook.question.slice(0, 60)}… — private desk`
      : `${c.name} private-company research — committee desk`,
    description: `${(hook?.question ?? c.whyOnDesk).slice(0, 155)} Secondary marks only. Not advice.`,
    alternates: { canonical: `https://agents61.com/private/${c.slug}` },
  };
}

export default async function PrivateCompanyPage({ params }: Props) {
  const { slug } = await params;
  const company = getPrivateCompany(slug);
  if (!company) notFound();
  const facts = getPrivateFacts(slug);
  const hook = PRIVATE_HOOKS.find((h) => h.slug === company.slug);
  const deskHref = dashboardPrivateHref(company.slug);
  const guestHref = dashboardPrivateGuestHref(company.slug);

  return (
    <>
      <Navbar />
      <div className="section-container py-16">
        <div className="max-w-3xl mb-10">
          <div className="badge badge-primary mb-4">Private desk · {company.sector}</div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">{company.name}</h1>
          <p className="text-lg text-slate-600">{company.tagline}</p>
        </div>

        {hook && (
          <div className="rounded-2xl border border-slate-900 bg-slate-900 text-white p-6 mb-8 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[10px] font-bold tracking-widest text-amber-300 uppercase">
                {hook.stake}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tabular-nums">{hook.markLabel}</span>
            </div>
            <p className="text-xl font-extrabold leading-snug mb-3">{hook.question}</p>
            <p className="text-sm text-slate-400 mb-4">{hook.potential}</p>
            <p className="text-xs text-slate-500 mb-5">
              Isolation seats: <strong className="text-slate-200">{hook.mastersLine}</strong>
            </p>
            <AuthGateLink href={deskHref} guestHref={guestHref} className="btn-primary">
              {hook.cta}
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </AuthGateLink>
            <p className="text-[10px] text-slate-500 mt-3">
              Logged in → Analyze pre-filled. Guest → register, then same desk. Not a buy button.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 card p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Why it is on the desk</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{company.whyOnDesk}</p>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Committee angle</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{company.committeeAngle}</p>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Risks to watch</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{company.risksToWatch}</p>
          </div>
          <div className="card p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Cached fact card</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-slate-400 uppercase tracking-wider">Secondary mark</dt>
                <dd className="font-bold text-slate-900 mt-0.5">{facts.lastValuationLabel ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400 uppercase tracking-wider">Last round</dt>
                <dd className="text-slate-700 mt-0.5">{facts.lastRound ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400 uppercase tracking-wider">Revenue run-rate</dt>
                <dd className="text-slate-700 mt-0.5 tabular-nums">
                  {facts.revenueRunRateUsd == null
                    ? '—'
                    : `$${(facts.revenueRunRateUsd / 1e9).toFixed(1)}B est.`}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400 uppercase tracking-wider">Listed comparables</dt>
                <dd className="text-slate-700 mt-0.5">{facts.comparableTickers.join(', ') || '—'}</dd>
              </div>
            </dl>
            <p className="text-[10px] text-slate-400 mt-4">{facts.disclaimer}</p>
          </div>
        </div>

        <AuthGateLink href={deskHref} guestHref={guestHref} className="btn-primary">
          Convene {company.name} on the desk
        </AuthGateLink>
        <p className="text-xs text-slate-400 mt-3 max-w-xl">
          Prompt: &quot;{hook?.prompt ?? privateDeskPrompt(company.slug)}&quot;
        </p>
      </div>
      <Footer />
    </>
  );
}
