import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PRIMARY_KEYWORDS } from '@/lib/seo/keywords';
import { PAGE_DESCRIPTIONS } from '@/lib/seo/meta';
import JsonLd, { ORGANIZATION_LD } from '@/components/seo/JsonLd';
import { waffoVerifyMetaContent } from '@/lib/waffo-verify';

const waffoVerify = waffoVerifyMetaContent();

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0052d9',
};

export const metadata: Metadata = {
  title: {
    default: 'Agents61 — 61-master AI investment committee for US stock research',
    template: '%s | Agents61',
  },
  description: PAGE_DESCRIPTIONS.home,
  keywords: PRIMARY_KEYWORDS,
  metadataBase: new URL('https://agents61.com'),
  openGraph: {
    type: 'website',
    siteName: 'Agents61',
    title: 'Agents61 — 61-master AI investment committee',
    description: PAGE_DESCRIPTIONS.home,
    images: [{ url: '/assets/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agents61 — 61-master AI investment committee',
    description:
      'US stock research, ETF and on-chain analysis. Isolated briefs or division of labor. No buy button.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://agents61.com' },
  verification: {
    google: 'yN9RC-Q3-7EcBlyZ4U09iyHTi1sXEs_cVBts-wotdwE',
  },
  ...(waffoVerify ? { other: { 'waffo-verify': waffoVerify } } : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/brand/favicon.ico" sizes="any" />
        <link rel="icon" href="/brand/favicon-32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/brand/apple-touch.png" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM brief" />
        {/* Waffo Pancake domain verify — must be in first HTML, not client-only */}
        <meta name="waffo-verify" content="f256b89f08766ad4bd136510068a8cfc" />
      </head>
      <body className="font-sans bg-white text-slate-900 antialiased">
        <JsonLd data={ORGANIZATION_LD} />
        {children}
      </body>
    </html>
  );
}
