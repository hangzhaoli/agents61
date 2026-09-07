import Link from 'next/link';
import BrandLogo from '@/components/brand/BrandLogo';
import AuthGateLink from '@/components/auth/AuthGateLink';

const FOOTER_SECTIONS = [
  {
    title: 'Product',
    links: [
      { label: 'Committee Desk', href: '/dashboard' },
      { label: 'AI investment committee', href: '/ai-investment-committee' },
      { label: 'AI stock research', href: '/ai-stock-research' },
      { label: 'Stock analysis AI', href: '/stock-analysis-ai' },
      { label: 'Research simulation', href: '/investment-research-simulation' },
      { label: 'How it works', href: '/how-it-works' },
      { label: '61 Masters', href: '/masters' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'All solutions', href: '/solutions' },
      { label: 'Individual investors', href: '/solutions/individual-investors' },
      { label: 'Newsletter writers', href: '/solutions/newsletter-writers' },
      { label: 'Family offices', href: '/solutions/family-offices' },
      { label: 'Crypto researchers', href: '/solutions/crypto-researchers' },
      { label: 'Pre-IPO watchers', href: '/solutions/pre-ipo-watchers' },
      { label: 'All use cases', href: '/use-cases' },
    ],
  },
  {
    title: 'Compare',
    links: [
      { label: 'All comparisons', href: '/compare' },
      { label: 'vs ChatGPT', href: '/compare/chatgpt' },
      { label: 'vs Seeking Alpha', href: '/compare/seeking-alpha' },
      { label: 'vs Yahoo Finance', href: '/compare/yahoo-finance' },
      { label: 'vs Koyfin', href: '/compare/koyfin' },
      { label: 'vs Perplexity', href: '/compare/perplexity' },
      { label: 'vs Bloomberg', href: '/compare/bloomberg' },
      { label: 'Alternatives index', href: '/alternatives' },
    ],
  },
  {
    title: 'Guides',
    links: [
      { label: 'Learn', href: '/learn' },
      { label: 'Research a stock in 20 min', href: '/learn/research-a-stock-in-20-minutes' },
      { label: 'Invert a thesis', href: '/learn/invert-a-thesis' },
      { label: 'Blog', href: '/blog' },
      { label: 'Method notes', href: '/blog/category/method' },
      { label: 'Compare notes', href: '/blog/category/compare' },
      { label: 'For LLMs / GEO', href: '/for-llms' },
    ],
  },
  {
    title: 'Markets',
    links: [
      { label: 'US Stocks', href: '/markets' },
      { label: 'Blockchain research', href: '/research/crypto' },
      { label: 'Emerging markets', href: '/research/emerging' },
      { label: 'Private / pre-IPO', href: '/research/private' },
      { label: 'US ETFs', href: '/stocks/qqq' },
      { label: 'Bitcoin desk', href: '/crypto/btc' },
      { label: 'A-Shares (later)', href: '/markets#a-shares' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Press & link kit', href: '/press' },
      { label: 'Contact', href: '/contact' },
      { label: 'Affiliate', href: '/affiliate' },
      { label: 'Product brief (GitHub)', href: 'https://github.com/hangzhaoli/agents61' },
      { label: 'llms.txt', href: '/llms.txt' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Use', href: '/terms' },
      { label: 'AI Disclosure', href: '/ai-disclosure' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="section-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.label === 'Committee Desk' ? (
                      <AuthGateLink
                        href={link.href}
                        className="text-sm text-slate-500 hover:text-[#0052d9] transition-colors"
                      >
                        {link.label}
                      </AuthGateLink>
                    ) : link.href.startsWith('http') ? (
                      <a
                        href={link.href}
                        className="text-sm text-slate-500 hover:text-[#0052d9] transition-colors"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-slate-500 hover:text-[#0052d9] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 h-8">
              <BrandLogo variant="wordmark" className="h-8" />
            </Link>
            <p className="text-xs text-slate-400 text-center max-w-lg">
              Agents61 is a research simulation and educational publication. Not investment advice.
              No buy button. Publisher’s own 1940 Act positioning.
              All reports are AI-generated and do not constitute personalized recommendations.
              Past performance does not guarantee future results.
            </p>
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} Agents61. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
