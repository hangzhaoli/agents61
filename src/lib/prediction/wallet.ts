/**
 * Browser wallet helpers for Polymarket live desk (Polygon 137 + MetaMask/EOA).
 */

export const POLYGON_CHAIN_ID = 137;
export const POLYGON_HEX = '0x89';

/** Bridged USDC.e used as Polymarket collateral on Polygon */
export const USDC_E = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

export const POLYGON_PARAMS = {
  chainId: POLYGON_HEX,
  chainName: 'Polygon Mainnet',
  nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
  rpcUrls: ['https://polygon-rpc.com'],
  blockExplorerUrls: ['https://polygonscan.com'],
} as const;

export type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export function getEthereum(): EthereumProvider | null {
  if (typeof window === 'undefined') return null;
  return window.ethereum ?? null;
}

export function shortAddr(addr: string) {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export async function connectWallet(): Promise<string> {
  const eth = getEthereum();
  if (!eth) throw new Error('No browser wallet — install MetaMask or similar');
  const accounts = (await eth.request({ method: 'eth_requestAccounts' })) as string[];
  const addr = accounts?.[0];
  if (!addr) throw new Error('Wallet returned no account');
  return addr;
}

export async function getChainId(): Promise<number> {
  const eth = getEthereum();
  if (!eth) throw new Error('No wallet');
  const hex = (await eth.request({ method: 'eth_chainId' })) as string;
  return Number.parseInt(hex, 16);
}

export async function ensurePolygon(): Promise<void> {
  const eth = getEthereum();
  if (!eth) throw new Error('No wallet');
  const chainId = await getChainId();
  if (chainId === POLYGON_CHAIN_ID) return;
  try {
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: POLYGON_HEX }],
    });
  } catch (err) {
    const code = (err as { code?: number })?.code;
    if (code === 4902) {
      await eth.request({
        method: 'wallet_addEthereumChain',
        params: [POLYGON_PARAMS],
      });
      return;
    }
    throw err;
  }
}

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

export async function readMaticAndUsdc(address: string): Promise<{
  matic: number;
  usdc: number;
}> {
  const { ethers } = await import('ethers');
  const eth = getEthereum();
  if (!eth) throw new Error('No wallet');
  // MetaMask / EIP-1193 provider is compatible with Web3Provider at runtime
  const provider = new ethers.providers.Web3Provider(eth as never);
  const bal = await provider.getBalance(address);
  const matic = Number(ethers.utils.formatEther(bal));
  const usdc = new ethers.Contract(USDC_E, ERC20_ABI, provider);
  const [raw, decimals] = await Promise.all([usdc.balanceOf(address), usdc.decimals()]);
  const usdcBal = Number(ethers.utils.formatUnits(raw, decimals));
  return {
    matic: Math.round(matic * 1e4) / 1e4,
    usdc: Math.round(usdcBal * 100) / 100,
  };
}

export async function getEthersSigner() {
  const { ethers } = await import('ethers');
  const eth = getEthereum();
  if (!eth) throw new Error('No wallet');
  await ensurePolygon();
  const provider = new ethers.providers.Web3Provider(eth as never);
  await provider.send('eth_requestAccounts', []);
  return provider.getSigner();
}
