import { TAPE_ITEMS, type TapeItem } from '@/lib/landing-pulse';

export default function MarketTape({
  dark = false,
  items,
}: {
  dark?: boolean;
  items?: TapeItem[];
}) {
  const source = items?.length ? items : TAPE_ITEMS;
  const row = [...source, ...source];
  return (
    <div
      className={`market-tape ${dark ? 'market-tape-dark' : ''}`}
      aria-label="Research board tape. Cached snapshots. Not live quotes. Not advice."
    >
      <div className="market-tape-fade" />
      <div className="market-tape-track">
        {row.map((item, i) => (
          <span key={`${item.kicker}-${i}`} className="market-tape-item">
            <span className="market-tape-kicker">{item.kicker}</span>
            <span>{item.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
