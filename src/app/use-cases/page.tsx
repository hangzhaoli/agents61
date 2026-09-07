import SeoIndexPage from '@/components/seo/SeoIndexPage';
import { USE_CASE_HUBS } from '@/lib/seo/use-case-hubs';
import { pageMeta } from '@/lib/seo/meta';

export const metadata = pageMeta({
  title: 'Use cases — How to run the Agents61 committee',
  description:
    'Use cases: red-team a thesis, isolated briefs, on-chain desk, private companies, ETF committee, cycle-first research.',
  path: '/use-cases',
});

export default function UseCasesIndex() {
  return (
    <SeoIndexPage
      eyebrow="Use cases"
      h1="Jobs the desk actually runs"
      intro="Not a feature list. These are the questions you bring after you already have a name — or a cycle view."
      path="/use-cases"
      cards={USE_CASE_HUBS.map((h) => ({ href: h.path, title: h.h1, blurb: h.description }))}
    />
  );
}
