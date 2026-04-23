"use client";

import type { Theme } from "@/lib/types";
import { PLAN_LIMITS, toPlanKey } from "@/lib/plan-limits";

const THEMES: { id: Theme; label: string; bg: string; fg: string; accent: string }[] = [
  { id: "light",       label: "라이트",      bg: "#ffffff",  fg: "#111827", accent: "#111827" },
  { id: "dark",        label: "다크",        bg: "#121212",  fg: "#f3f4f6", accent: "#f3f4f6" },
  { id: "ucc",         label: "UCC",         bg: "#0d0221",  fg: "#f8f7ff", accent: "#ffd60a" },
  { id: "softsage",    label: "소프트세이지", bg: "#f4f8f5",  fg: "#23352d", accent: "#6f9680" },
  { id: "warmlinen",   label: "웜리넨",      bg: "#f8f2e9",  fg: "#3a2c22", accent: "#b58458" },
  { id: "energysteel", label: "에너지스틸",  bg: "#0f172a",  fg: "#e2e8f0", accent: "#a3e635" },
];

type Props = {
  selected: Theme;
  onChange: (theme: Theme) => void;
  plan?: string;
};

export default function ThemeSelector({ selected, onChange, plan }: Props) {
  const planKey  = toPlanKey(plan);
  const limits   = PLAN_LIMITS[planKey];
  const allowAll = limits.themes === "all";
  const allowed  = allowAll ? THEMES.map((t) => t.id) : (limits.themes as readonly string[]);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {THEMES.map((t) => {
          const locked = !allowed.includes(t.id);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => { if (!locked) onChange(t.id); }}
              disabled={locked}
              title={locked ? "Pro 또는 Basic 플랜에서 사용 가능합니다" : t.label}
              className={`relative flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
                selected === t.id
                  ? "border-foreground"
                  : locked
                  ? "border-transparent opacity-40 cursor-not-allowed"
                  : "border-transparent hover:border-gray-200"
              }`}
            >
              <div
                className="h-10 w-full rounded-lg"
                style={{ background: t.bg, border: `1.5px solid ${t.accent}33` }}
              >
                <div className="mx-2 mt-1.5 h-1.5 w-8 rounded-full" style={{ background: t.fg, opacity: 0.7 }} />
                <div className="mx-2 mt-1 h-1 w-5 rounded-full"   style={{ background: t.accent, opacity: 0.8 }} />
              </div>
              <span className="text-xs font-medium text-foreground">{t.label}</span>
              {locked && (
                <span className="absolute right-1.5 top-1.5 text-[10px]">🔒</span>
              )}
            </button>
          );
        })}
      </div>
      {planKey === "free" && (
        <p className="text-xs text-(--muted)">
          🔒 다크·UCC 테마는 Basic 이상, 나머지 3종은 Pro 전용입니다.{" "}
          <a href="/billing" className="font-medium underline underline-offset-2 hover:text-foreground">업그레이드</a>
        </p>
      )}
      {planKey === "basic" && (
        <p className="text-xs text-(--muted)">
          🔒 소프트세이지·웜리넨·에너지스틸 테마는 Pro 전용입니다.{" "}
          <a href="/billing" className="font-medium underline underline-offset-2 hover:text-foreground">업그레이드</a>
        </p>
      )}
    </div>
  );
}
