"use client";

import { useState } from "react";

type Props = {
  referralCode: string;
  alreadyUsedCode: boolean;
  referralCount: number;
  siteUrl: string;
};

export default function ReferralCard({
  referralCode,
  alreadyUsedCode,
  referralCount,
  siteUrl,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyResult, setApplyResult] = useState<{ ok?: boolean; error?: string } | null>(null);

  const shareUrl = `${siteUrl}/auth/signup?ref=${referralCode}`;

  async function copyCode() {
    await navigator.clipboard.writeText(shareUrl).catch(() => {
      navigator.clipboard.writeText(referralCode);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function applyCode() {
    if (!codeInput.trim()) return;
    setApplying(true);
    setApplyResult(null);
    const res = await fetch("/api/referral/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referralCode: codeInput.trim() }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      setApplyResult({ ok: true });
    } else {
      setApplyResult({ error: json.error ?? "오류가 발생했습니다." });
    }
    setApplying(false);
  }

  return (
    <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
      <h2 className="mb-1 text-sm font-semibold text-foreground">친구 추천</h2>
      <p className="mb-4 text-xs text-(--muted)">
        추천 링크로 가입한 친구가 유료 구독을 시작하면 내 플랜이 1개월 연장됩니다.
      </p>

      {/* 내 추천 코드 */}
      <div className="mb-4 flex items-center gap-2">
        <code className="flex-1 rounded-xl bg-(--secondary) px-3 py-2 text-sm font-bold tracking-widest text-foreground">
          {referralCode}
        </code>
        <button
          type="button"
          onClick={copyCode}
          className="rounded-xl bg-foreground px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-80"
        >
          {copied ? "복사됨 ✓" : "링크 복사"}
        </button>
      </div>

      {referralCount > 0 && (
        <p className="mb-4 text-xs font-medium text-green-600">
          지금까지 {referralCount}명이 내 코드로 가입했습니다.
        </p>
      )}

      {/* 추천 코드 입력 */}
      {!alreadyUsedCode && !applyResult?.ok && (
        <div className="border-t border-black/5 pt-4">
          <p className="mb-2 text-xs text-(--muted)">추천인 코드가 있으신가요?</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
              placeholder="코드 입력 (예: AB12CD34)"
              maxLength={8}
              className="flex-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-mono uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
            <button
              type="button"
              onClick={applyCode}
              disabled={applying || !codeInput.trim()}
              className="rounded-xl bg-foreground px-3 py-2 text-xs font-semibold text-white disabled:opacity-40 transition-opacity hover:opacity-80"
            >
              {applying ? "확인 중…" : "적용"}
            </button>
          </div>
          {applyResult?.error && (
            <p className="mt-1.5 text-xs text-red-500">{applyResult.error}</p>
          )}
        </div>
      )}

      {applyResult?.ok && (
        <p className="mt-2 text-xs font-medium text-green-600">
          추천 코드가 적용되었습니다! 감사합니다.
        </p>
      )}

      {alreadyUsedCode && (
        <p className="mt-2 text-xs text-(--muted)">이미 추천 코드를 사용하셨습니다.</p>
      )}
    </div>
  );
}
