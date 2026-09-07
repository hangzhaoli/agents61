import SeoIndexPage from '@/components/seo/SeoIndexPage';
import { COMPARE_HUBS } from '@/lib/seo/compare-hubs';
import { pageMeta } from '@/lib/seo/meta';

export const metadata = pageMeta({
  title: 'Alternatives — Agents61 vs the usual stock-research stack',
  description:
    'Seeking Alpha alternative, ChatGPT stock analysis alternative, Yahoo Finance analysis alternative, Koyfin vs a committee. Same desk, named comparisons.',
  path: '/alternatives',
  keywords: ['Seeking Alpha alternative', 'ChatGPT stock analysis alternative', 'Yahoo Finance alternative'],
});

export default function AlternativesPage() {
  return (
    <SeoIndexPage
      eyebrow="Alternatives"
      h1="If you already use something else"
      intro="These are not smash-mouth takedowns. Each page says when the other product wins. Agents61 is the committee layer."
      path="/alternatives"
      cards={COMPARE_HUBS.map((h) => ({
        href: `/compare/${h.slug}`,
        title: `Agents61 vs ${h.competitor}`,
        blurb: h.description,
      }))}
    />
  );
}
