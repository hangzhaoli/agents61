import SeoIndexPage from '@/components/seo/SeoIndexPage';
import { LEARN_GUIDES } from '@/lib/seo/learn-guides';
import { pageMeta } from '@/lib/seo/meta';

export const metadata = pageMeta({
  title: 'Learn — Short paths on the Agents61 desk',
  description:
    'Short tutorials: research a stock in 20 minutes, invert a thesis, read a clerk stack, pick a desk tier. Not a trade diary.',
  path: '/learn',
});

export default function LearnIndex() {
  return (
    <SeoIndexPage
      eyebrow="Learn"
      h1="Short paths, then stop"
      intro="Tutorials are homework. They end without a ticket. For depth, use the blog."
      path="/learn"
      cards={LEARN_GUIDES.map((g) => ({
        href: `/learn/${g.slug}`,
        title: g.h1,
        blurb: `${g.minutes} min · ${g.description}`,
      }))}
    />
  );
}
