"use client";

import type { BusinessHours } from "@/lib/types";

const DAYS = [
  { key: "mon", label: "월" },
  { key: "tue", label: "화" },
  { key: "wed", label: "수" },
  { key: "thu", label: "목" },
  { key: "fri", label: "금" },
  { key: "sat", label: "토" },
  { key: "sun", label: "일" },
] as const;

type DayKey = (typeof DAYS)[number]["key"];

type Props = {
  value: BusinessHours;
  onChange: (v: BusinessHours) => void;
};

export default function BusinessHoursEditor({ value, onChange }: Props) {
  function isOpen(key: DayKey) {
    const v = value[key];
    return v !== null && v !== undefined && v !== "";
  }

  function toggle(key: DayKey) {
    if (isOpen(key)) {
      onChange({ ...value, [key]: null });
    } else {
      onChange({ ...value, [key]: "09:00-18:00" });
    }
  }

  function setTime(key: DayKey, time: string) {
    onChange({ ...value, [key]: time || null });
  }

  return (
    <div className="flex flex-col gap-2">
      {/* 요일 토글 헤더 */}
      <div className="flex gap-1.5">
        {DAYS.map(({ key, label }) => {
          const open = isOpen(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                open
                  ? "bg-foreground text-white"
                  : "bg-gray-100 text-(--muted) hover:bg-gray-200"
              }`}
              title={open ? `${label}요일 클릭하면 휴무 설정` : `${label}요일 클릭하면 영업 설정`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 영업일별 시간 입력 */}
      <div className="flex flex-col gap-1.5">
        {DAYS.filter(({ key }) => isOpen(key)).map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2">
            <span className="w-5 text-center text-xs font-bold text-foreground">{label}</span>
            <input
              type="text"
              value={value[key] ?? ""}
              onChange={(e) => setTime(key, e.target.value)}
              placeholder="09:00-18:00"
              className="flex-1 rounded-lg border border-gray-200 bg-(--secondary) px-3 py-1.5 text-xs text-foreground outline-none focus:border-gray-400 transition-colors"
            />
          </div>
        ))}
      </div>

      <p className="text-xs text-(--muted)">
        요일 버튼을 눌러 영업일을 선택하고, 시간을 입력하세요 (예: 09:00-18:00).
      </p>
    </div>
  );
}
