import { ArrowRight, Crosshair, Flame, Rocket, Zap } from 'lucide-react';
import AuthGateLink from '@/components/auth/AuthGateLink';
import Link from 'next/link';
import {
  PRIVATE_HOOKS,
  dashboardPrivateGuestHref,
  dashboardPrivateHref,
  type PrivateHook,
} from '@/lib/private-hooks';

function HookCard({ hook, index }: { hook: PrivateHook; index: number }) {
  const href = dashboardPrivateHref(hook.slug);
  const guestHref = dashboardPrivateGuestHref(hook.slug);
  const hot = index < 2;

  return (
    <article className={`private-hook-card ${hot ? 'private-hook-card-hot' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="private-hook-badge">{hook.badge}</span>
            <span className="private-hook-stake">
              <Flame className="h-3 w-3" strokeWidth={2.5} />
              {hook.stake}
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">{hook.name}</h3>
          <p className="text-[11px] font-semibold text-amber-300/90 mt-1 tabular-nums">{hook.markLabel}</p>
        </div>
        <span className="private-hook-icon" aria-hidden>
          <Crosshair className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>

      <p className="private-hook-question">{hook.question}</p>
      <p className="text-sm text-slate-400 leading-relaxed mb-4">{hook.potential}</p>
      <p className="text-[11px] text-slate-500 mb-5">
        Isolation seats:{' '}
        <span className="font-semibold text-slate-300">{hook.mastersLine}</span>
      </p>

      <div className="flex flex-col gap-2 mt-auto">
        <AuthGateLink href={href} guestHref={guestHref} className="private-hook-cta">
          {hook.cta}
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </AuthGateLink>
        <Link href={`/private/${hook.slug}`} className="private-hook-secondary">
          See fact card first →
        </Link>
      </div>
      <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">
        Pre-filled Dashboard prompt · secondary marks only · not a rating · not advice
      </p>
    </article>
  );
}

export default function PrivateDeskHooks({
  title = 'Billions marked. Zero EDGAR. Still unanswered.',
  subtitle = 'OpenAI · Anthropic · Stripe · Anduril — private marks move before filings exist. Pick the doubt that keeps you up. Masters write alone. Clerk stacks the split. You decide whether to dig or walk.',
  limit,
}: {
  title?: string;
  subtitle?: string;
  limit?: number;
}) {
  const hooks = typeof limit === 'number' ? PRIVATE_HOOKS.slice(0, limit) : PRIVATE_HOOKS;

  return (
    <section id="private-hooks" className="private-hooks-section">
      <div className="section-container py-16 md:py-24">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <div className="private-hooks-kicker mb-4">
              <Rocket className="h-3.5 w-3.5" strokeWidth={2} />
              Private desk · live stakes
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
              {title}
            </h2>
            <p className="mt-5 text-lg text-slate-400 leading-relaxed">{subtitle}</p>
            <p className="mt-3 text-sm font-semibold text-amber-300/90">
              SpaceX already listed as SPCX. The next private names will not wait for your weekend.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <AuthGateLink
              href="/dashboard?entry=private"
              guestHref="/register?next=%2Fdashboard%3Fentry%3Dprivate"
              className="private-hook-cta !px-5"
            >
              <Zap className="h-4 w-4" strokeWidth={2.5} />
              Open private desk hot
            </AuthGateLink>
            <Link href="/research/private" className="private-hook-ghost">
              Full private board
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          {hooks.map((hook, i) => (
            <HookCard key={hook.slug} hook={hook} index={i} />
          ))}
        </div>

        <div className="private-hooks-cta-bar">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold tracking-[0.2em] text-amber-300 mb-1">
              WHAT HAPPENS IN 30 SECONDS
            </div>
            <p className="text-lg font-extrabold text-white leading-snug">
              Sign in → prompt pre-filled → masters isolate → clerk frames dig-or-walk.
              <span className="block text-slate-400 font-semibold text-sm mt-1">
                No buy button. The expensive mistake is owning a private story nobody inverted.
              </span>
            </p>
          </div>
          <AuthGateLink
            href={dashboardPrivateHref('openai')}
            guestHref={dashboardPrivateGuestHref('openai')}
            className="private-hook-cta shrink-0 !px-6 !py-3.5 text-sm"
          >
            Staff OpenAI first
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </AuthGateLink>
        </div>
      </div>
    </section>
  );
}
