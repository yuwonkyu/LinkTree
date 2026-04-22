"use client";

import { useState } from "react";

type Props = {
  slug: string;
  siteUrl: string;
  reviewCount: number;
  isPaid: boolean;
};

export default function ReviewLinkCard({ slug, siteUrl, reviewCount, isPaid }: Props) {
  const [copied, setCopied] = useState(false);
  const reviewUrl = `${siteUrl}/${slug}/review`;

  function handleCopy() {
    navigator.clipboard.writeText(reviewUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const FREE_LIMIT = 3;
  const isAtLimit = !isPaid && reviewCount >= FREE_LIMIT;

  return (
    <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">후기 수집</h2>
        <span className="text-xs text-(--muted)">
          {reviewCount}개 {!isPaid && `/ ${FREE_LIMIT}개`}
        </span>
      </div>
      <p className="mb-4 text-xs text-(--muted)">
        고객에게 링크를 공유하면 직접 후기를 남길 수 있어요.
      </p>

      {isAtLimit ? (
        <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
          <p className="text-xs font-semibold text-amber-800">
            무료 플랜 후기 한도 ({FREE_LIMIT}개)에 도달했어요.
          </p>
          <p className="mt-0.5 text-xs text-amber-700">
            베이직 이상으로 업그레이드하면 무제한으로 수집·표시됩니다.
          </p>
          <a
            href="/billing"
            className="mt-2 inline-block rounded-lg bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:opacity-80 transition-opacity"
          >
            업그레이드
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 rounded-xl bg-(--secondary) px-3 py-2">
            <p className="flex-1 truncate text-xs text-(--muted)">{reviewUrl}</p>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 rounded-lg bg-foreground px-3 py-1 text-xs font-semibold text-white hover:opacity-80 transition-opacity"
            >
              {copied ? "✓ 복사됨" : "복사"}
            </button>
          </div>
          <p className="text-[11px] text-(--muted)">
            💡 카카오톡으로 고객에게 공유하면 바로 후기를 남길 수 있어요.
          </p>
        </div>
      )}
    </div>
  );
}
