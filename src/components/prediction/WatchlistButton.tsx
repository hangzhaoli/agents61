'use client';

import { useEffect, useState } from 'react';
import { BookmarkPlus, Check } from 'lucide-react';
import type { PredictionMarket } from '@/lib/prediction/types';
import { addToWatchlist, isOnWatchlist } from '@/lib/prediction/watchlist';

export default function WatchlistButton({
  market,
  agents61Probability,
}: {
  market: PredictionMarket;
  agents61Probability: number | null;
}) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(isOnWatchlist(market.id));
    const sync = () => setOn(isOnWatchlist(market.id));
    window.addEventListener('agents61-prediction-watchlist', sync);
    return () => window.removeEventListener('agents61-prediction-watchlist', sync);
  }, [market.id]);

  function toggle() {
    addToWatchlist(market, agents61Probability);
    setOn(true);
  }

  return (
    <button type="button" className="btn-secondary text-sm inline-flex items-center gap-1.5" onClick={toggle}>
      {on ? <Check className="h-4 w-4 text-emerald-600" strokeWidth={2.5} /> : <BookmarkPlus className="h-4 w-4" strokeWidth={2} />}
      {on ? 'On watchlist' : 'Add to Watchlist'}
    </button>
  );
}
