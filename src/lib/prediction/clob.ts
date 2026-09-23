/**
 * Polymarket CLOB helpers for browser live desk (Polygon 137).
 * Orders are signed in-wallet; Agents61 never holds keys or custody.
 */

import type { DeskSide } from './paper-desk';
import type { PredictionMarket } from './types';
import { getEthersSigner, POLYGON_CHAIN_ID } from './wallet';

export const CLOB_HOST = 'https://clob.polymarket.com';

type TickSize = '0.1' | '0.01' | '0.001' | '0.0001';

function asTickSize(raw?: string): TickSize {
  if (raw === '0.1' || raw === '0.01' || raw === '0.001' || raw === '0.0001') return raw;
  return '0.01';
}

export function tokenIdForSide(market: PredictionMarket, side: DeskSide): string | null {
  const ids = market.clobTokenIds;
  if (!ids || ids.length < 2) return null;
  return side === 'YES' ? ids[0]! : ids[1]!;
}

export type ClobSession = {
  client: import('@polymarket/clob-client').ClobClient;
  address: string;
};

let cached: ClobSession | null = null;

export function clearClobSession() {
  cached = null;
}

export async function getClobSession(): Promise<ClobSession> {
  if (cached) return cached;
  const { ClobClient, SignatureType } = await import('@polymarket/clob-client');
  const signer = await getEthersSigner();
  const address = await signer.getAddress();
  const temp = new ClobClient(CLOB_HOST, POLYGON_CHAIN_ID, signer);
  const creds = await temp.createOrDeriveApiKey();
  const client = new ClobClient(
    CLOB_HOST,
    POLYGON_CHAIN_ID,
    signer,
    creds,
    SignatureType.EOA
  );
  cached = { client, address };
  return cached;
}

export async function fetchClobCollateral(): Promise<{ balance: number; allowance: number }> {
  const { AssetType } = await import('@polymarket/clob-client');
  const { client } = await getClobSession();
  const res = await client.getBalanceAllowance({ asset_type: AssetType.COLLATERAL });
  const balance = Number(res?.balance ?? 0) / 1e6;
  const allowance = Number(res?.allowance ?? 0) / 1e6;
  return {
    balance: Math.round(balance * 100) / 100,
    allowance: Math.round(allowance * 100) / 100,
  };
}

export type LiveOrderResult = {
  ok: boolean;
  orderId?: string;
  status?: string;
  error?: string;
  raw?: unknown;
};

export async function placeLiveMarketBuy(opts: {
  market: PredictionMarket;
  side: DeskSide;
  amountUsd: number;
}): Promise<LiveOrderResult> {
  const tokenID = tokenIdForSide(opts.market, opts.side);
  if (!tokenID) {
    return { ok: false, error: 'Market missing CLOB token ids — cannot route live' };
  }
  if (!(opts.amountUsd > 0)) {
    return { ok: false, error: 'Amount must be > 0' };
  }

  try {
    const { Side, OrderType } = await import('@polymarket/clob-client');
    const { client } = await getClobSession();
    const tickSize = asTickSize(opts.market.tickSize);
    const negRisk = Boolean(opts.market.negRisk);
    const resp = await client.createAndPostMarketOrder(
      {
        tokenID,
        amount: opts.amountUsd,
        side: Side.BUY,
      },
      { tickSize, negRisk },
      OrderType.FAK
    );

    if (resp && typeof resp === 'object' && 'error' in resp && (resp as { error?: string }).error) {
      return {
        ok: false,
        error: String((resp as { error?: string }).error),
        raw: resp,
      };
    }

    const orderId =
      (resp as { orderID?: string; id?: string })?.orderID ||
      (resp as { orderID?: string; id?: string })?.id;
    const status = (resp as { status?: string })?.status;
    const success = (resp as { success?: boolean })?.success !== false;

    return {
      ok: success,
      orderId: orderId ? String(orderId) : undefined,
      status: status ? String(status) : undefined,
      error: success ? undefined : String((resp as { errorMsg?: string })?.errorMsg || 'Order rejected'),
      raw: resp,
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
