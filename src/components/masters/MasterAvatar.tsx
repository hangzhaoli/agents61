import type { Master } from '@/lib/masters';

type Size = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_PX: Record<Size, number> = {
  xxs: 22,
  xs: 32,
  sm: 40,
  md: 56,
  lg: 80,
  xl: 96,
};

export default function MasterAvatar({
  master,
  size = 'md',
  className = '',
}: {
  master: Master;
  size?: Size;
  className?: string;
}) {
  const px = SIZE_PX[size];

  return (
    <span
      className={`master-avatar ${className}`.trim()}
      style={{
        background: `linear-gradient(135deg, ${master.avatarColor}, ${master.avatarColor}cc)`,
        width: px,
        height: px,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/assets/masters/${master.slug}.png`}
        alt=""
        width={px}
        height={px}
        className="h-full w-full object-cover"
      />
    </span>
  );
}
