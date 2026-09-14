import type { MetadataRoute } from 'next';
import { MASTERS } from '@/lib/masters';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/lib/blog';
import { POPULAR_TICKERS } from '@/lib/popular-tickers';
import { PRIVATE_COMPANIES } from '@/lib/private-universe';
import { CRYPTO_ASSETS } from '@/lib/crypto-universe';
import { COMPARE_HUBS } from '@/lib/seo/compare-hubs';
import { SOLUTION_HUBS } from '@/lib/seo/solution-hubs';
import { USE_CASE_HUBS } from '@/lib/seo/use-case-hubs';
import { FEATURE_HUBS } from '@/lib/seo/feature-hubs';
import { LEARN_GUIDES } from '@/lib/seo/learn-guides';

const SITE_URL = 'https://agents61.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '',
    '/about',
    '/features',
    '/how-it-works',
    '/compare',
    '/alternatives',
    '/solutions',
    '/use-cases',
    '/learn',
    '/for-llms',
    '/press',
    '/blog',
    '/contact',
    '/affiliate',
    '/markets',
    '/pipeline',
    '/methodology',
    '/cycle',
    '/demo',
    '/masters',
    '/pricing',
    '/research/crypto',
    '/research/emerging',
    '/research/private',
    '/quant-lab',
    '/disclaimer',
    '/privacy',
    '/terms',
    '/ai-disclosure',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const featurePages = FEATURE_HUBS.map((h) => ({
    url: `${SITE_URL}${h.path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const comparePages = COMPARE_HUBS.map((h) => ({
    url: `${SITE_URL}/compare/${h.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const solutionPages = SOLUTION_HUBS.map((h) => ({
    url: `${SITE_URL}${h.path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  const useCasePages = USE_CASE_HUBS.map((h) => ({
    url: `${SITE_URL}${h.path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  const learnPages = LEARN_GUIDES.map((g) => ({
    url: `${SITE_URL}/learn/${g.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const masterPages = MASTERS.map((m) => ({
    url: `${SITE_URL}/masters/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const blogPages = BLOG_POSTS.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }));

  const categoryPages = BLOG_CATEGORIES.map((c) => ({
    url: `${SITE_URL}/blog/category/${c}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  const stockPages = POPULAR_TICKERS.map((t) => ({
    url: `${SITE_URL}/stocks/${t.symbol.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  const privatePages = PRIVATE_COMPANIES.map((c) => ({
    url: `${SITE_URL}/private/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const cryptoPages = CRYPTO_ASSETS.map((a) => ({
    url: `${SITE_URL}/crypto/${a.symbol.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...featurePages,
    ...comparePages,
    ...solutionPages,
    ...useCasePages,
    ...learnPages,
    ...masterPages,
    ...stockPages,
    ...privatePages,
    ...cryptoPages,
    ...blogPages,
    ...categoryPages,
    {
      url: `${SITE_URL}/llms.txt`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/llms-full.txt`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/.well-known/llms.txt`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    },
  ];
}
