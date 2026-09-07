import SeoIndexPage from '@/components/seo/SeoIndexPage';
import { SOLUTION_HUBS } from '@/lib/seo/solution-hubs';
import { pageMeta } from '@/lib/seo/meta';

export const metadata = pageMeta({
  title: 'Solutions — Who the Agents61 desk is for',
  description:
    'AI investment committee solutions for individual investors, newsletter writers, family offices, crypto researchers, and pre-IPO watchers.',
  path: '/solutions',
});

export default function SolutionsIndex() {
  return (
    <SeoIndexPage
      eyebrow="Solutions"
      h1="Who the desk is for"
      intro="Same committee. Different jobs. Not a beginner buy-button app and not a Bloomberg replacement."
      path="/solutions"
      cards={SOLUTION_HUBS.map((h) => ({ href: h.path, title: h.h1, blurb: h.description }))}
    />
  );
}
