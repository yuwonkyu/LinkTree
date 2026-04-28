"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevRef = useRef(`${pathname}${searchParams}`);

  useEffect(() => {
    const current = `${pathname}${searchParams}`;
    if (prevRef.current === current) return;
    prevRef.current = current;

    // 새 경로 도착 → 빠르게 100%로 채우고 사라짐
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWidth(100);
    setVisible(true);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 350);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname, searchParams]);

  if (!visible && width === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[9999] h-[2px] bg-foreground transition-all duration-300 ease-out"
      style={{
        width: `${width}%`,
        opacity: visible ? 1 : 0,
        transition: visible
          ? "width 0.3s ease-out"
          : "opacity 0.2s ease, width 0s 0.2s",
      }}
    />
  );
}

// useSearchParams는 Suspense 경계 필요
export default function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <ProgressBar />
    </Suspense>
  );
}
