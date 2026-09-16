import { ArrowRight } from 'lucide-react';
import AuthGateLink from '@/components/auth/AuthGateLink';

type Props = {
  title?: string;
  body?: string;
  /** Logged-in destination */
  href?: string;
  /** Guest destination (SSR strips ?next= for crawlers) */
  guestHref?: string;
  label?: string;
};

export default function SeoRegisterCta({
  title = 'Register and open the desk',
  body = 'Create an account to staff isolated masters on a ticker, run prediction-market research, and keep watchlists. Research simulation — not advice, no buy button.',
  href = '/dashboard',
  guestHref = '/register',
  label = 'Create account',
}: Props) {
  return (
    <section className="mt-12 rounded-2xl bg-[#0052d9] text-white p-8 md:p-10">
      <h2 className="text-2xl font-extrabold mb-3">{title}</h2>
      <p className="text-blue-100 max-w-2xl mb-6 leading-relaxed">{body}</p>
      <AuthGateLink
        href={href}
        guestHref={guestHref}
        className="inline-flex items-center gap-2 bg-white text-[#0052d9] font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
      >
        {label}
        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
      </AuthGateLink>
    </section>
  );
}
