import type { MetadataRoute } from 'next';

const allowSite = {
  allow: '/',
  disallow: ['/api/', '/dashboard/'],
} as const;

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
  return {
    rules: [
      { userAgent: '*', ...allowSite },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/' as const })),
    ],
    sitemap: 'https://agents61.com/sitemap.xml',
    host: 'https://agents61.com',
  };
}
