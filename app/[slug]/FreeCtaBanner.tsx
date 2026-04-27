"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function FreeCtaBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 페이지 로드 후 0.6초 뒤 슬라이드인
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed bottom-5 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <Link
        href="/auth/signup"
        className="flex items-center gap-3 rounded-2xl bg-foreground px-5 py-3 shadow-[0_8px_32px_rgba(17,24,39,0.28)] transition hover:opacity-90 active:scale-[0.98]"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#FFD600] text-sm font-black text-[#111]">
          ⚡
        </span>
        <span className="text-sm font-bold text-white">
          나도 무료로 만들러 가기
        </span>
        <span className="rounded-lg bg-white/15 px-2 py-0.5 text-[11px] font-semibold text-white">
          무료
        </span>
      </Link>
    </div>
  );
}
