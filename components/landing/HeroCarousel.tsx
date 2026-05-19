"use client";

import { useState, useEffect, useRef } from "react";

const SLIDES = [
  {
    slug: "/sample1",
    theme: "라이트",
    industry: "PT 트레이너",
    name: "김지수 트레이너",
    role: "다이어트 · 체형교정 전문 PT",
    links: ["📞 카카오 상담", "📸 인스타그램"],
    services: ["1:1 PT · ₩80,000", "체형교정 · ₩70,000"],
    bg: "#ffffff",
    accent: "#111827",
    fg: "#111827",
    muted: "#6b7280",
    card: "#f5f5f5",
    borderColor: "rgba(17,24,39,0.08)",
  },
  {
    slug: "/sample2",
    theme: "다크",
    industry: "필라테스 강사",
    name: "박서연 강사",
    role: "1:1 레슨 · 재활 필라테스",
    links: ["📞 카카오 예약", "📸 인스타그램"],
    services: ["1:1 레슨 · ₩90,000", "그룹 레슨 · ₩50,000"],
    bg: "#121212",
    accent: "#FEE500",
    fg: "#f3f4f6",
    muted: "#cbd5e1",
    card: "#1e1e1e",
    borderColor: "rgba(255,255,255,0.08)",
  },
  {
    slug: "/sample3",
    theme: "웜리넨",
    industry: "헤어 디자이너",
    name: "최지안 디자이너",
    role: "컬러 · 펌 · 케어 전문",
    links: ["📞 예약 문의", "🖼️ 포트폴리오"],
    services: ["컬러 · ₩120,000", "펌 · ₩100,000"],
    bg: "#f8f2e9",
    accent: "#b58458",
    fg: "#3a2c22",
    muted: "#725b49",
    card: "#fff9f0",
    borderColor: "rgba(58,44,34,0.08)",
  },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const goTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setActive((prev) => (prev + 1) % SLIDES.length);
        setAnimating(false);
      }, 200);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  function goTo(i: number) {
    if (i === active || animating) return;
    if (goTimerRef.current) clearTimeout(goTimerRef.current);
    setAnimating(true);
    goTimerRef.current = setTimeout(() => {
      setActive(i);
      setAnimating(false);
      goTimerRef.current = null;
    }, 150);
  }

  const ex = SLIDES[active];

  return (
    <div className="flex flex-col items-center">
      {/* 모바일 Mockup 프레임 */}
      <div
        className="relative"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(6px) scale(0.98)" : "translateY(0) scale(1)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        {/* 폰 외곽 프레임 */}
        <div
          className="relative w-50 rounded-4xl border-[5px] border-white shadow-[0_24px_64px_rgba(17,24,39,0.20)]"
          style={{ background: ex.bg }}
        >
          {/* 노치 */}
          <div className="flex justify-center py-2">
            <div className="h-1.25 w-14 rounded-full" style={{ background: `${ex.fg}20` }} />
          </div>

          {/* 앱 콘텐츠 */}
          <div className="px-3 pb-5">
            {/* 프로필 */}
            <div className="flex flex-col items-center gap-1.5 pb-3 text-center">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
                style={{ background: ex.accent, color: ex.bg }}
              >
                {ex.name[0]}
              </div>
              <div>
                <p
                  className="text-[11px] font-bold leading-tight"
                  style={{ color: ex.fg }}
                >
                  {ex.name}
                </p>
                <p className="mt-0.5 text-[9px] leading-tight" style={{ color: ex.muted }}>
                  {ex.role}
                </p>
              </div>
            </div>

            {/* 구분선 */}
            <div className="mb-2.5 h-px" style={{ background: ex.borderColor }} />

            {/* 링크 버튼들 */}
            <div className="flex flex-col gap-1.5">
              {ex.links.map((label, i) => (
                <div
                  key={label}
                  className="rounded-xl px-2 py-2 text-center text-[10px] font-semibold"
                  style={
                    i === 0
                      ? { background: ex.accent, color: ex.bg }
                      : {
                          background: ex.card,
                          color: ex.fg,
                          border: `1px solid ${ex.borderColor}`,
                        }
                  }
                >
                  {label}
                </div>
              ))}
            </div>

            {/* 서비스 가격 미리보기 */}
            <div className="mt-2.5 rounded-xl p-2" style={{ background: ex.card }}>
              <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider" style={{ color: ex.muted }}>
                서비스 · 가격
              </p>
              {ex.services.map((s) => (
                <p key={s} className="text-[9px] leading-relaxed" style={{ color: ex.fg }}>
                  · {s}
                </p>
              ))}
            </div>
          </div>

          {/* 홈 바 */}
          <div className="flex justify-center pb-2.5 pt-1">
            <div className="h-0.75 w-10 rounded-full" style={{ background: `${ex.fg}30` }} />
          </div>
        </div>

        {/* 테마 뱃지 */}
        <div
          className="absolute -right-3 -top-2 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm"
          style={{ background: ex.accent, color: ex.bg }}
        >
          {ex.theme}
        </div>
      </div>

      {/* 인디케이터 dots */}
      <div className="mt-4 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`${SLIDES[i].theme} 테마 보기`}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === active ? "20px" : "6px",
              height: "6px",
              background: i === active ? "#111827" : "#d1d5db",
            }}
          />
        ))}
      </div>

      {/* 업종 레이블 */}
      <p className="mt-1.5 text-[11px] text-(--muted)">
        <span className="font-semibold text-foreground">{ex.industry}</span> 예시
      </p>
    </div>
  );
}
