'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { StrategyReport } from '@/lib/prediction/types';
import {
  PRED_TRIAL_FORBIDDEN,
  persistPredTrialUsed,
  readPredTrialUsed,
} from '@/lib/prediction/entitlement';
import { readDeskSession, isDemoEmail } from '@/lib/demo-session';
import { isPaidPlan } from '@/lib/tiers';
import { appendPoint } from '@/lib/prediction/history';
import { updateWatchSnapshots, isOnWatchlist } from '@/lib/prediction/watchlist';
import PaywallModal from '@/components/workspace/PaywallModal';

export default function AnalyzeButton({ marketId }: { marketId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paywall, setPaywall] = useState(false);

  function lockedLocally(): boolean {
    const session = readDeskSession();
    const skip = Boolean(session && (isPaidPlan(session.plan) || isDemoEmail(session.email)));
    return readPredTrialUsed() && !skip;
  }

  async function run() {
    if (lockedLocally()) {
      setPaywall(true);
      setError(PRED_TRIAL_FORBIDDEN.error);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/prediction/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: marketId }),
      });
      const data = (await res.json()) as {
        report?: StrategyReport;
        error?: string;
        code?: string;
        entitlement?: { trialBurned?: boolean; useClerk?: boolean };
      };

      if (res.status === 403 && data.code === PRED_TRIAL_FORBIDDEN.code) {
        persistPredTrialUsed();
        setPaywall(true);
        setError(data.error || PRED_TRIAL_FORBIDDEN.error);
        return;
      }

      if (!res.ok || !data.report) {
        setError(data.error || 'Analysis failed');
        return;
      }

      if (data.entitlement?.trialBurned) {
        persistPredTrialUsed();
      }

      const report = data.report;
      appendPoint(marketId, {
        at: report.analyzedAt,
        marketProbability: report.marketProbability,
        agents61Probability: report.agents61Probability,
        gap: report.probabilityGap,
        analysisId: `${marketId}-${report.analyzedAt}`,
      });

      if (isOnWatchlist(marketId)) {
        updateWatchSnapshots([
          {
            marketId,
            marketProbability: report.marketProbability,
            agents61Probability: report.agents61Probability,
          },
        ]);
      }

      router.refresh();
    } catch {
      setError('Network error — try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button type="button" className="btn-primary" onClick={run} disabled={loading}>
        {loading ? 'Running prediction desk…' : reportCtaLabel()}
      </button>
      <p className="text-[11px] text-slate-400">
        Free: 1 template analyze. Paid desk: news layer + Pro Prediction Clerk.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <PaywallModal open={paywall} remainingCount={0} onClose={() => setPaywall(false)} />
    </div>
  );
}

function reportCtaLabel() {
  return 'Run Agents61 Analysis';
}
