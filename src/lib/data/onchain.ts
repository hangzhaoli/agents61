/**
 * On-chain / blockchain data API stubs.
 * Plug Glassnode, Dune, DefiLlama, or a licensed feed here later.
 * Research simulation only — do not invent series.
 */

export type OnchainHook = {
  id: string;
  provider: 'glassnode' | 'dune' | 'defillama' | 'custom';
  metric: string;
  status: 'unconfigured';
  note: string;
};

export const ONCHAIN_HOOKS: OnchainHook[] = [
  {
    id: 'btc-mvrv',
    provider: 'glassnode',
    metric: 'MVRV',
    status: 'unconfigured',
    note: 'Set GLASSNODE_API_KEY to load Bitcoin MVRV as model input. Never invent the series.',
  },
  {
    id: 'eth-fees',
    provider: 'dune',
    metric: 'L1 + L2 fee share',
    status: 'unconfigured',
    note: 'Set DUNE_API_KEY to load fee share. Missing stays inconclusive.',
  },
  {
    id: 'defi-tvl',
    provider: 'defillama',
    metric: 'Protocol TVL',
    status: 'unconfigured',
    note: 'Public DefiLlama can be wired without a key. Not loaded until the hook is switched on.',
  },
];

export function onchainConfigured(): boolean {
  return Boolean(
    process.env.GLASSNODE_API_KEY?.trim() ||
      process.env.DUNE_API_KEY?.trim() ||
      process.env.DEFILLAMA_ENABLED === 'true'
  );
}
