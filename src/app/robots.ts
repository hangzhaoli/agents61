import type { MetadataRoute } from 'next';

/** Private app surfaces — keep noindex in page metadata; also Disallow so Google stops discovering ?next= variants. */
const PRIVATE_PATHS: string[] = [
  '/api/',
  '/login',
  '/register',
  '/dashboard',
  '/auth/',
  '/checkout/',
  '/internal/',
];

const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'Bytespider',
  'CCBot',
  'YouBot',
  'meta-externalagent',
];

export default function robots(): MetadataRoute.Robots {
  const allowSite = {
    allow: '/',
    disallow: PRIVATE_PATHS,
  };

  return {
    rules: [
      { userAgent: '*', ...allowSite },
      // Same private disallow for AI bots (do not open /dashboard to scrapers).
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, ...allowSite })),
    ],
    sitemap: 'https://agents61.com/sitemap.xml',
    host: 'https://agents61.com',
  };
}
