"use client";

import { useState } from "react";
import { COMPANY_INFO } from "@/lib/company-info";

export default function DonationSection() {
  const [copied, setCopied] = useState(false);

  const hasKakao = !!COMPANY_INFO.donationKakao;
  const hasToss  = !!COMPANY_INFO.donationTossBank;

  if (!hasKakao && !hasToss) return null;

  async function copyAccount() {
    await navigator.clipboard.writeText(COMPANY_INFO.donationTossBank);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6">
      <div className="mx-auto max-w-sm rounded-3xl bg-(--card) px-6 py-8 text-center shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFD600] text-2xl shadow-[0_4px_16px_rgba(255,214,0,0.4)]">
          ⚡
        </div>
        <h2 className="mt-4 text-lg font-extrabold">InstaLink가 유용하셨나요?</h2>
        <p className="mt-1.5 text-sm leading-6 text-(--muted)">
          개발자에게 커피 한 잔을 선물해보세요 ☕<br />
          서비스 개선에 큰 힘이 됩니다.
        </p>
        <div className="mt-5 flex flex-col gap-2.5">
          {hasKakao && (
            <a
              href={COMPANY_INFO.donationKakao}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] py-3 text-sm font-bold text-[#3C1E1E] transition hover:brightness-95 active:scale-[0.98]"
            >
              <span>💛</span> 카카오페이로 후원하기
            </a>
          )}
          {hasToss && (
            <button
              type="button"
              onClick={copyAccount}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white py-3 text-sm font-bold text-foreground transition hover:bg-black/5 active:scale-[0.98]"
            >
              {copied ? (
                <><span>✅</span> 계좌번호 복사됨!</>
              ) : (
                <><span>🏦</span> {COMPANY_INFO.donationTossBank}</>
              )}
            </button>
          )}
        </div>
        <p className="mt-4 text-xs text-(--muted)">후원금은 서버 비용 및 기능 개발에 사용됩니다.</p>
      </div>
    </section>
  );
}
