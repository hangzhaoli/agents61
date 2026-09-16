'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { StrategyReport } from '@/lib/prediction/types';

export default function AnalyzeButton({ marketId }: { marketId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/prediction/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: marketId }),
      });
      const data = (await res.json()) as { report?: StrategyReport; error?: string };
      if (!res.ok || !data.report) {
        setError(data.error || 'Analysis failed');
        return;
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
        {loading ? 'Running 10 agents…' : 'Analyze with Agents61'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
