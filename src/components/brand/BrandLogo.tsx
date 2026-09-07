import Image from 'next/image';

type Variant = 'mark' | 'wordmark';

const SRC: Record<Variant, { src: string; w: number; h: number; alt: string }> = {
  mark: { src: '/brand/mark-61.png', w: 424, h: 372, alt: 'Agents61' },
  wordmark: { src: '/brand/logo-61.png', w: 717, h: 478, alt: 'Agents61' },
};

export default function BrandLogo({
  variant = 'mark',
  className = '',
  priority = false,
}: {
  variant?: Variant;
  className?: string;
  priority?: boolean;
}) {
  const asset = SRC[variant];
  return (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.w}
      height={asset.h}
      priority={priority}
      unoptimized
      className={`h-full w-auto object-contain object-left ${className}`.trim()}
    />
  );
}
