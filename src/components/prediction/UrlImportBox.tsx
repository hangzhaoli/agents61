'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link2, Loader2 } from 'lucide-react';

export default function UrlImportBox() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/prediction/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !data.id) {
        setError(data.error || 'Could not import that market URL');
        return;
      }
      router.push(`/predictions/${encodeURIComponent(data.id)}`);
    } catch {
      setError('Network error — try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card p-5 md:p-6 space-y-3">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <Link2 className="h-4 w-4 text-[#0052d9]" strokeWidth={2} />
        Paste a Polymarket URL
      </div>
      <p className="text-xs text-slate-500">
        Import a market from Polymarket, then run Agents61 analysis. Kalshi URLs coming after
        Polymarket validation.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://polymarket.com/event/…"
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0052d9]"
        />
        <button type="submit" className="btn-primary text-sm shrink-0" disabled={loading || !url.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Import & open'}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
