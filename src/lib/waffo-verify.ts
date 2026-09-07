/**
 * Waffo Pancake product-domain verification (KYB Step 8).
 * Dashboard → 生成验证指引 → paste the challenge into WAFFO_DOMAIN_VERIFY.
 * Docs: https://docs.waffo.ai/settings/domain-verification
 *
 * Meta:  <meta name="waffo-verify" content="…">
 * File:  https://agents61.com/.well-known/waffo-verify.txt
 */

/** Latest Pancake challenge (expires ~24h). Env overrides if set. */
const PINNED_CHALLENGE = 'f256b89f08766ad4bd136510068a8cfc';

export function waffoDomainChallenge(): string | null {
  const raw = process.env.WAFFO_DOMAIN_VERIFY?.trim();
  return raw || PINNED_CHALLENGE;
}

/** Value for <meta name="waffo-verify"> — strip the well-known prefix if present. */
export function waffoVerifyMetaContent(): string | null {
  const raw = waffoDomainChallenge();
  if (!raw) return null;
  return raw.replace(/^waffo-domain-verify=/i, '');
}

/** Body of /.well-known/waffo-verify.txt — one line, no extra whitespace. */
export function waffoVerifyFileBody(): string | null {
  const raw = waffoDomainChallenge();
  if (!raw) return null;
  return raw.startsWith('waffo-domain-verify=') ? raw : `waffo-domain-verify=${raw}`;
}
