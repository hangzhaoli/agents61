import { sparkPoints } from '@/lib/landing-pulse';

interface Props {
  seed: string;
  tone?: 'up' | 'down' | 'flat';
  className?: string;
}

const STROKE = {
  up: '#059669',
  down: '#dc2626',
  flat: '#0052d9',
};

export default function MiniSpark({ seed, tone = 'flat', className }: Props) {
  const points = sparkPoints(seed);
  const w = 88;
  const h = 28;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const d = points
    .map((v, i) => {
      const x = (i / Math.max(1, points.length - 1)) * w;
      const y = h - ((v - min) / Math.max(1e-6, max - min)) * h;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className ?? 'w-[88px] h-7'} aria-hidden>
      <path d={d} fill="none" stroke={STROKE[tone]} strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}
