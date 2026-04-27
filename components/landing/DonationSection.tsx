"use client";

import { useState } from "react";
import { COMPANY_INFO } from "@/lib/company-info";

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

export default function DonationSection() {
  const [copied, setCopied]         = useState(false);
  const [kakaoBlocked, setKakaoBlocked] = useState(false);

  const hasKakao = !!COMPANY_INFO.donationKakao;
  const hasToss  = !!COMPANY_INFO.donationTossBank;

  if (!hasKakao && !hasToss) return null;

  async function copyAccount() {
    await navigator.clipboard.writeText(COMPANY_INFO.donationTossBank);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleKakaoClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!isMobileDevice()) {
      e.preventDefault();
      setKakaoBlocked(true);
      setTimeout(() => setKakaoBlocked(false), 4000);
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6">
      <div className="mx-auto max-w-lg rounded-3xl bg-(--card) shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
        {/* 모바일: 세로 / PC: 가로 */}
        <div className="flex flex-col items-center gap-5 px-6 py-8 sm:flex-row sm:gap-8 sm:px-10">
          {/* 아이콘 + 텍스트 */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFD600] text-2xl shadow-[0_4px_16px_rgba(255,214,0,0.4)]">
              ⚡
            </div>
            <h2 className="mt-3 text-base font-extrabold">InstaLink가 유용하셨나요?</h2>
            <p className="mt-1 text-sm leading-5 text-(--muted)">
              개발자에게 커피 한 잔을 선물해보세요 ☕
            </p>
          </div>

          {/* 버튼들 */}
          <div className="flex w-full flex-col gap-2.5 sm:min-w-[220px]">
            {hasKakao && (
              <div className="flex flex-col gap-1">
                <a
                  href={COMPANY_INFO.donationKakao}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleKakaoClick}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] py-3 text-sm font-bold text-[#3C1E1E] transition hover:brightness-95 active:scale-[0.98]"
                >
                  <span>💛</span> 카카오페이로 후원하기
                </a>
                {kakaoBlocked && (
                  <p className="text-center text-xs text-amber-600">
                    📱 카카오페이는 모바일에서만 이용 가능합니다
                  </p>
                )}
              </div>
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
        </div>
        <p className="pb-5 text-center text-xs text-(--muted)">
          후원금은 서버 비용 및 기능 개발에 사용됩니다.
        </p>
      </div>
    </section>
  );
}
