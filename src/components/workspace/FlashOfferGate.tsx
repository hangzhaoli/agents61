'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Timer, X, Zap } from 'lucide-react';
import {
  FLASH_OFFER_PERCENT,
  FLASH_PROMPT_KEY,
  FLASH_PROMPT_WITHIN_MS,
  flashCheckoutHref,
  formatFlashCountdown,
} from '@/lib/flash-offer';

type FlashStatus = {
  active: boolean;
  eligible?: boolean;
  expiresAt?: number;
  remainingMs?: number;
  percentOff?: number;
  reason?: string;
};

function markPrompted() {
  try {
    sessionStorage.setItem(FLASH_PROMPT_KEY, '1');
  } catch {
    /* private mode */
  }
}

function alreadyPrompted() {
  try {
    return sessionStorage.getItem(FLASH_PROMPT_KEY) === '1';
  } catch {
    return false;
  }
}

function isSearchTarget(el: EventTarget | null): boolean {
  if (!(el instanceof Element)) return false;
  if (el.closest('[data-search]')) return true;
  if (el.closest('#clerk-compose')) return true;
  if (el.closest('.desk-console-compose')) return true;
  if (el.closest('form[data-clerk-compose]')) return true;
  const tag = el.tagName;
  if (tag === 'TEXTAREA' || tag === 'INPUT') {
    const input = el as HTMLInputElement | HTMLTextAreaElement;
    if (input.type === 'search' || input.getAttribute('role') === 'searchbox') return true;
    if (input.id === 'clerk-compose') return true;
    if (input.closest('[data-entry="clerk"], [data-pane="clerk"]')) return true;
  }
  return false;
}

/**
 * Observer / unpaid desk: after scroll without searching, within 30s of entry,
 * prompt once to claim a real 15% Waffo priceSnapshot for 30 minutes.
 */
export default function FlashOfferGate({ eligible }: { eligible: boolean }) {
  const router = useRouter();
  const entryAt = useRef(Date.now());
  const scrolled = useRef(false);
  const searched = useRef(false);
  const shown = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [banner, setBanner] = useState<{ expiresAt: number; remainingMs: number } | null>(null);
  const [tick, setTick] = useState(0);

  const tryPrompt = useCallback(() => {
    if (!eligible || shown.current || searched.current || !scrolled.current) return;
    if (Date.now() - entryAt.current > FLASH_PROMPT_WITHIN_MS) return;
    if (alreadyPrompted()) return;
    if (banner) return;
    shown.current = true;
    markPrompted();
    setModalOpen(true);
  }, [eligible, banner]);

  useEffect(() => {
    if (!eligible) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/billing/flash-offer', { cache: 'no-store' });
        const data = (await res.json()) as FlashStatus;
        if (cancelled || !data.active || !data.expiresAt) return;
        markPrompted();
        shown.current = true;
        setBanner({
          expiresAt: data.expiresAt,
          remainingMs: data.remainingMs ?? Math.max(0, data.expiresAt - Date.now()),
        });
      } catch {
        /* ignore */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [eligible]);

  useEffect(() => {
    if (!eligible) return;

    const onScroll = () => {
      const main = document.querySelector('.desk-app-main');
      const mainTop = main instanceof HTMLElement ? main.scrollTop : 0;
      const y = window.scrollY || document.documentElement.scrollTop || mainTop;
      if (y > 48 || mainTop > 48) {
        scrolled.current = true;
        tryPrompt();
      }
    };

    const markSearch = (e: Event) => {
      if (!isSearchTarget(e.target)) return;
      searched.current = true;
    };

    const onSubmit = (e: Event) => {
      if (!(e.target instanceof Element)) return;
      if (
        e.target.closest('.desk-console-compose') ||
        e.target.closest('[data-search]') ||
        e.target.closest('#clerk-compose')
      ) {
        searched.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    document.addEventListener('focusin', markSearch, true);
    document.addEventListener('input', markSearch, true);
    document.addEventListener('submit', onSubmit, true);

    const poll = window.setInterval(() => {
      tryPrompt();
      setTick((n) => n + 1);
    }, 1000);

    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll, true);
      document.removeEventListener('focusin', markSearch, true);
      document.removeEventListener('input', markSearch, true);
      document.removeEventListener('submit', onSubmit, true);
      window.clearInterval(poll);
    };
  }, [eligible, tryPrompt]);

  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [modalOpen]);

  const bannerRemaining = banner
    ? Math.max(0, banner.expiresAt - Date.now())
    : 0;

  useEffect(() => {
    if (!banner) return;
    if (bannerRemaining <= 0) setBanner(null);
  }, [banner, bannerRemaining, tick]);

  async function claim() {
    setClaimError('');
    setClaiming(true);
    try {
      const res = await fetch('/api/billing/flash-offer', { method: 'POST' });
      const data = (await res.json()) as {
        ok?: boolean;
        expiresAt?: number;
        remainingMs?: number;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.expiresAt) {
        setClaimError(data.error ?? '无法激活优惠，请稍后再试。');
        return;
      }
      setModalOpen(false);
      setBanner({
        expiresAt: data.expiresAt,
        remainingMs: data.remainingMs ?? FLASH_PROMPT_WITHIN_MS,
      });
      router.push(flashCheckoutHref('analyst'));
    } catch {
      setClaimError('网络错误，请重试。');
    } finally {
      setClaiming(false);
    }
  }

  if (!eligible) return null;

  return (
    <>
      {banner && bannerRemaining > 0 && (
        <div className="fixed bottom-4 left-1/2 z-[70] w-[min(92vw,28rem)] -translate-x-1/2 rounded-xl border border-[#0052d9]/20 bg-white px-4 py-3 shadow-[0_4px_24px_rgba(0,82,217,0.14)]">
          <div className="flex items-start gap-3">
            <Zap className="mt-0.5 h-4 w-4 shrink-0 text-[#0052d9]" strokeWidth={2} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900">
                限时 {FLASH_OFFER_PERCENT}% 优惠进行中
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                剩余 {formatFlashCountdown(bannerRemaining)} · 错过即恢复原价
              </p>
            </div>
            <Link
              href={flashCheckoutHref('analyst')}
              className="shrink-0 text-xs font-semibold text-[#0052d9] hover:underline"
            >
              去结账 →
            </Link>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            aria-label="关闭优惠提示"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setModalOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="flash-offer-title"
            className="relative w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_4px_24px_rgba(0,82,217,0.12)] md:p-7"
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700"
              aria-label="关闭"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0052d9]">
              <Timer className="h-3.5 w-3.5" strokeWidth={2} />
              限时 30 分钟 · 真实折扣
            </div>
            <h2 id="flash-offer-title" className="pr-8 text-xl font-extrabold text-slate-900 md:text-2xl">
              激活购买优惠：全站 {FLASH_OFFER_PERCENT}% off
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              未使用搜索、已向下浏览 — 现在可激活一次真实扣款折扣（Waffo
              结账价）。优惠仅保留 30 分钟；超时或关闭后恢复原价。研究模拟席位，非买卖建议。
            </p>
            {claimError && <p className="mt-3 text-sm text-red-600">{claimError}</p>}
            <button
              type="button"
              disabled={claiming}
              onClick={claim}
              className="btn-primary mt-5 w-full justify-center"
            >
              {claiming ? '激活中…' : '激活优惠'}
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="mt-2 w-full text-center text-sm font-medium text-slate-500 hover:text-slate-800"
            >
              稍后再说（按原价）
            </button>
          </div>
        </div>
      )}
    </>
  );
}
