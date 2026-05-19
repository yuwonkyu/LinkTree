"use client";

import { useState, useEffect } from "react";

const STEPS = [
  {
    emoji: "✏️",
    title: "편집하기 버튼을 눌러보세요",
    desc: "「편집하기」 버튼을 누르면 가게 이름, 소개글, 서비스 가격, 사진 등을 직접 꾸밀 수 있어요. 저장하면 내 페이지에 즉시 반영돼요!",
    highlight: "편집하기",
  },
  {
    emoji: "🔗",
    title: "내 페이지 보기로 결과 확인",
    desc: "편집을 마쳤다면 「내 페이지 보기 →」 버튼으로 고객에게 보이는 실제 페이지를 확인해보세요. 인스타그램 bio에 이 링크를 붙여넣으면 고객이 바로 찾아올 수 있어요!",
    highlight: "내 페이지 보기 →",
  },
  {
    emoji: "📊",
    title: "방문자 통계로 성과 확인",
    desc: "대시보드 아래쪽 「방문자 현황」과 「링크 클릭 통계」에서 얼마나 많은 고객이 방문했는지 볼 수 있어요.",
    sub: "💡 상세한 주간 분석 그래프는 베이직 플랜 이상에서 확인 가능해요.",
    highlight: "통계 상세",
  },
];

export default function DashboardGuideWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowPulse(false), 6000);
    return () => clearTimeout(t);
  }, []);

  const handleOpen = () => {
    setStep(0);
    setOpen(true);
    setShowPulse(false);
  };

  const handleClose = () => setOpen(false);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <>
      {/* 플로팅 버튼 */}
      <div className="fixed bottom-6 right-4 z-50">
        {showPulse && (
          <span className="absolute inset-0 rounded-full animate-ping bg-foreground opacity-20" />
        )}
        <button
          onClick={handleOpen}
          aria-label="대시보드 이용 가이드 열기"
          className="relative flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 active:scale-95 hover:opacity-90"
        >
          <span className="text-base leading-none">❓</span>
          <span>이용 가이드</span>
        </button>
      </div>

      {/* 모달 */}
      {open && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center px-4 pb-6"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={handleClose}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#F5F5F5] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  대시보드 이용 가이드
                </h2>
                <p className="mt-0.5 text-xs text-(--muted)">
                  {step + 1} / {STEPS.length} 단계
                </p>
              </div>
              <button
                onClick={handleClose}
                className="rounded-full p-1 text-xl leading-none text-(--muted) hover:opacity-60"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            {/* 프로그레스 바 */}
            <div className="mb-5 flex gap-1.5">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className="h-1.5 flex-1 rounded-full transition-all"
                  style={{
                    background: i <= step ? "#111827" : "#e5e7eb",
                    opacity: i < step ? 0.35 : 1,
                  }}
                  aria-label={`${i + 1}단계`}
                />
              ))}
            </div>

            {/* 콘텐츠 */}
            <div className="mb-6 min-h-30">
              <div className="mb-3 text-4xl">{current.emoji}</div>
              <h3 className="mb-2 text-lg font-bold text-foreground">
                {current.title}
              </h3>
              <p className="text-sm leading-relaxed text-(--muted)">
                {current.desc}
              </p>
              {current.sub && (
                <div className="mt-3 rounded-xl bg-(--secondary) px-3.5 py-2.5">
                  <p className="text-xs text-(--muted) leading-relaxed">
                    {current.sub}
                  </p>
                </div>
              )}
              {current.highlight && (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-gray-500 px-3.5 py-2.5">
                  <span className="text-xs text-(--muted)">
                    찾는 버튼 이름:
                  </span>
                  <span className="rounded-lg bg-foreground px-2.5 py-1 text-xs font-semibold text-white">
                    {current.highlight}
                  </span>
                </div>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex gap-2">
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-(--muted) transition-colors hover:opacity-70"
                >
                  이전
                </button>
              )}
              <button
                onClick={isLast ? handleClose : () => setStep((s) => s + 1)}
                className="flex-1 rounded-xl bg-foreground py-2.5 text-sm font-semibold text-white transition-all hover:opacity-85"
              >
                {isLast ? "시작하기 🎉" : "다음"}
              </button>
            </div>

            {!isLast && (
              <button
                onClick={handleClose}
                className="mt-3 w-full text-center text-xs text-(--muted) transition-colors hover:opacity-60"
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
