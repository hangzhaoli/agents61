import type { ReactNode } from 'react';

export default function CheckoutShell({
  kicker,
  title,
  subtitle,
  children,
}: {
  kicker: string;
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="section-container py-12 md:py-16 max-w-xl mx-auto">
      <div className="chrome-frame chrome-frame-fixed">
        <div className="chrome-frame-inner checkout-shell">
          <div className="checkout-shell-head">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                {kicker}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{title}</h1>
            <div className="text-sm text-slate-600 mt-2 leading-relaxed">{subtitle}</div>
          </div>
          <div className="checkout-shell-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
