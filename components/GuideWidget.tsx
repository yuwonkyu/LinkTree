"use client";

import { useState, useEffect } from "react";

const STEPS = [
  {
    emoji: "📋",
    title: "서비스 & 가격 확인",
    desc: "아래로 스크롤하면 제공 서비스와 가격을 확인할 수 있어요.",
  },
  {
    emoji: "💬",
    title: "카카오로 문의하기",
    desc: "\"카카오 문의\" 버튼을 누르면 채팅으로 바로 연결돼요. 예약·상담 모두 가능해요!",
  },
  {
    emoji: "📸",
    title: "인스타그램 팔로우",
    desc: "\"인스타그램 보기\" 버튼으로 최신 게시물과 소식을 확인해보세요.",
  },
  {
    emoji: "⭐",
    title: "후기 남기기",
    desc: "페이지 하단 후기 섹션에서 다른 분들의 리뷰를 확인하실 수 있어요.",
  },
];

export default function GuideWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [showPulse, setShowPulse] = useState(true);

  // 5초 후 펄스 애니메이션 종료
  useEffect(() => {
    const t = setTimeout(() => setShowPulse(false), 5000);
    return () => clearTimeout(t);
  }, []);

  // 모달 열릴 때 step 초기화
  const handleOpen = () => {
    setStep(0);
    setOpen(true);
    setShowPulse(false);
  };

  const handleClose = () => setOpen(false);

  const isLast = step === STEPS.length - 1;

  return (
    <>
      {/* 플로팅 버튼 */}
      <div className="fixed bottom-6 right-4 z-50">
        {showPulse && (
          <span className="absolute inset-0 rounded-full animate-ping bg-(--primary) opacity-40" />
        )}
        <button
          onClick={handleOpen}
          aria-label="이용 가이드 열기"
          className="relative flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95"
          style={{
            background: "var(--primary, #6366f1)",
            color: "#fff",
          }}
        >
          <span className="text-base leading-none">❓</span>
          <span>이용 가이드</span>
        </button>
      </div>

      {/* 모달 오버레이 */}
      {open && (
        <div
          className="fixed inset-0 z-60 flex items-end justify-center px-4 pb-6"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={handleClose}
        >
          {/* 모달 카드 */}
          <div
            className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
            style={{ background: "var(--card, #fff)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-bold" style={{ color: "var(--foreground, #111827)" }}>
                이용 가이드
              </h2>
              <button
                onClick={handleClose}
                className="rounded-full p-1 text-xl leading-none transition-colors hover:opacity-60"
                style={{ color: "var(--muted, #9ca3af)" }}
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            {/* 스텝 인디케이터 */}
            <div className="mb-5 flex gap-1.5">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className="h-1.5 flex-1 rounded-full transition-all"
                  style={{
                    background:
                      i === step
                        ? "var(--primary, #6366f1)"
                        : i < step
                        ? "var(--primary, #6366f1)"
                        : "var(--border, #e5e7eb)",
                    opacity: i < step ? 0.4 : 1,
                  }}
                  aria-label={`${i + 1}단계`}
                />
              ))}
            </div>

            {/* 스텝 콘텐츠 */}
            <div className="mb-6 min-h-25">
              <div className="mb-3 text-4xl">{STEPS[step].emoji}</div>
              <h3
                className="mb-2 text-lg font-bold"
                style={{ color: "var(--foreground, #111827)" }}
              >
                {STEPS[step].title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted, #6b7280)" }}>
                {STEPS[step].desc}
              </p>
            </div>

            {/* 버튼 영역 */}
            <div className="flex gap-2">
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-colors hover:opacity-70"
                  style={{
                    borderColor: "var(--border, #e5e7eb)",
                    color: "var(--muted, #6b7280)",
                    background: "transparent",
                  }}
                >
                  이전
                </button>
              )}
              <button
                onClick={isLast ? handleClose : () => setStep((s) => s + 1)}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "var(--primary, #6366f1)" }}
              >
                {isLast ? "시작하기 🎉" : "다음"}
              </button>
            </div>

            {/* 스킵 */}
            {!isLast && (
              <button
                onClick={handleClose}
                className="mt-3 w-full text-center text-xs transition-colors hover:opacity-60"
                style={{ color: "var(--muted, #9ca3af)" }}
              >
                건너뛰기
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
