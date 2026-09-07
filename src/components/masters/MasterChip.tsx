import { getMasterBySlug } from '@/lib/masters';
import MasterAvatar from '@/components/masters/MasterAvatar';

export default function MasterChip({
  slug,
  tone = 'light',
}: {
  slug: string;
  tone?: 'light' | 'dark';
}) {
  const master = getMasterBySlug(slug);
  if (!master) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full pr-2.5 pl-0.5 py-0.5 ${
        tone === 'dark' ? 'bg-white/10' : 'bg-slate-100'
      }`}
    >
      <MasterAvatar master={master} size="xxs" />
      <span
        className={`text-xs font-semibold ${
          tone === 'dark' ? 'text-white' : 'text-slate-800'
        }`}
      >
        {master.nameEn}
      </span>
    </span>
  );
}

export function MasterChipRow({
  slugs,
  tone = 'light',
}: {
  slugs: string[];
  tone?: 'light' | 'dark';
}) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {slugs.map((slug) => (
        <MasterChip key={slug} slug={slug} tone={tone} />
      ))}
    </span>
  );
}

/** Avatar + name + caption. Use when a master owns a line of copy. */
export function MasterSeatLine({
  slug,
  caption,
  tone = 'light',
}: {
  slug?: string;
  caption: string;
  tone?: 'light' | 'dark';
}) {
  const master = slug ? getMasterBySlug(slug) : undefined;
  const nameClass = tone === 'dark' ? 'text-white' : 'text-slate-900';
  const capClass = tone === 'dark' ? 'text-slate-400' : 'text-slate-500';
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      {master ? (
        <MasterAvatar master={master} size="xs" />
      ) : (
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
            tone === 'dark' ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-500'
          }`}
        >
          61
        </span>
      )}
      <div className="min-w-0">
        {master && (
          <div className={`text-sm font-semibold truncate ${nameClass}`}>{master.nameEn}</div>
        )}
        <div className={`text-xs leading-snug ${master ? capClass : `${nameClass} font-medium`}`}>
          {caption}
        </div>
      </div>
    </div>
  );
}
