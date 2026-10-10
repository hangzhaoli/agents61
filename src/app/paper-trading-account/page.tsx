import { FeatureRoute, featureMetadata } from '@/lib/seo/feature-page';

export const metadata = featureMetadata('paper-trading-account');
export default function Page() {
  return <FeatureRoute slug="paper-trading-account" />;
}
