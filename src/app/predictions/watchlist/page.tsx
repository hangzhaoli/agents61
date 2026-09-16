import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { pageMeta } from '@/lib/seo/meta';
import WatchlistClient from '@/components/prediction/WatchlistClient';

export const metadata = pageMeta({
  title: 'Prediction Watchlist — track probability gaps',
  description:
    'Watch Polymarket markets and track whether crowd odds move toward or away from Agents61 estimates.',
  path: '/predictions/watchlist',
});

export default function PredictionsWatchlistPage() {
  return (
    <>
      <Navbar />
      <div className="section-container py-12 md:py-16">
        <WatchlistClient />
      </div>
      <Footer />
    </>
  );
}
