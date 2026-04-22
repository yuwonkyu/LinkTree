"use client";

import { useState } from "react";

const STEPS = [
  {
    num: "①",
    title: "인스타그램 프로필 편집 열기",
    desc: '인스타그램 앱 → 프로필 탭 → "프로필 편집" 버튼 탭',
  },
  {
    num: "②",
    title: "링크 추가",
    desc: '"링크 추가" 또는 "외부 링크" 항목을 탭하세요.',
  },
  {
    num: "③",
    title: "링크 붙여넣기",
    desc: "아래 링크를 복사해서 붙여넣은 뒤 완료를 누르세요.",
  },
];

type Props = {
  slug: string;
  siteUrl: string;
  highlight?: boolean;
};

export default function InstaGuideModal({ slug, siteUrl, highlight = false }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const pageUrl = `${siteUrl}/${slug}`;

  function handleCopy() {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          highlight
            ? "w-full rounded-xl bg-foreground py-2.5 text-sm font-semibold text-white hover:opacity-80 transition-opacity"
            : "flex items-center gap-1.5 text-sm text-(--muted) hover:text-foreground transition-colors"
        }
      >
        📱 인스타 bio에 링크 넣는 방법
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">인스타 bio 링크 설정</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-(--muted) hover:text-foreground transition-colors"
              >
                닫기
              </button>
            </div>

            <ol className="flex flex-col gap-4 mb-6">
              {STEPS.map((step) => (
                <li key={step.num} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-white">
                    {step.num}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{step.title}</p>
                    <p className="mt-0.5 text-xs text-(--muted)">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="rounded-xl bg-(--secondary) px-4 py-3">
              <p className="mb-2 text-xs font-medium text-(--muted)">내 InstaLink 주소</p>
              <p className="mb-3 break-all text-sm font-semibold text-foreground">{pageUrl}</p>
              <button
                type="button"
                onClick={handleCopy}
                className="w-full rounded-xl bg-foreground py-2 text-sm font-semibold text-white hover:opacity-80 transition-opacity"
              >
                {copied ? "✓ 복사됐어요!" : "링크 복사하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
