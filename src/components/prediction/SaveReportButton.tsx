'use client';

import { useEffect, useState } from 'react';
import { Bookmark, Star } from 'lucide-react';
import type { StrategyReport } from '@/lib/prediction/types';
import {
  readPredictionSaves,
  upsertPredictionSave,
  writePredictionSaves,
} from '@/lib/prediction/saves';
import { hydratePredictionSaves, pushPredictionSaves } from '@/lib/sync/cloud-client';
import { readDeskSession } from '@/lib/demo-session';
import { parsePlan } from '@/lib/tiers';
import AuthGateLink from '@/components/auth/AuthGateLink';

export default function SaveReportButton({
  marketId,
  marketSlug,
  question,
  report,
}: {
  marketId: string;
  marketSlug: string;
  question: string;
  report: StrategyReport;
}) {
  const [saved, setSaved] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const session = readDeskSession();
    setLoggedIn(Boolean(session?.email));
    const local = readPredictionSaves();
    const hit = local.find((s) => s.marketId === marketId);
    setSaved(Boolean(hit));
    setFavorited(Boolean(hit?.favorited));
    void hydratePredictionSaves(local, writePredictionSaves).then(() => {
      const next = readPredictionSaves().find((s) => s.marketId === marketId);
      setSaved(Boolean(next));
      setFavorited(Boolean(next?.favorited));
    });
  }, [marketId]);

  async function save(asFavorite: boolean) {
    const session = readDeskSession();
    if (!session?.email) {
      setMsg('Sign in to save history and favorites.');
      return;
    }
    const plan = parsePlan(session.plan);
    const result = upsertPredictionSave(plan, {
      marketId,
      marketSlug,
      question,
      report,
      favorited: asFavorite ? true : favorited,
    });
    if (!result.ok) {
      setMsg(result.error);
      return;
    }
    setSaved(true);
    setFavorited(result.item.favorited);
    setMsg(asFavorite ? 'Favorited & saved to your history.' : 'Saved to your prediction history.');
    await pushPredictionSaves(result.items);
  }

  if (!loggedIn) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <AuthGateLink
          href={`/predictions/${encodeURIComponent(marketId)}`}
          guestHref={`/register?next=${encodeURIComponent(`/predictions/${encodeURIComponent(marketId)}`)}`}
          className="btn-secondary text-sm"
        >
          Sign in to save / favorite
        </AuthGateLink>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-secondary text-sm inline-flex items-center gap-1.5" onClick={() => void save(false)}>
          <Bookmark className="h-4 w-4" strokeWidth={2} />
          {saved ? 'Update save' : 'Save to history'}
        </button>
        <button type="button" className="btn-secondary text-sm inline-flex items-center gap-1.5" onClick={() => void save(true)}>
          <Star
            className={`h-4 w-4 ${favorited ? 'fill-amber-400 text-amber-500' : ''}`}
            strokeWidth={2}
          />
          {favorited ? 'Favorited' : 'Favorite'}
        </button>
      </div>
      {msg && <p className="text-xs text-slate-500">{msg}</p>}
    </div>
  );
}
