"use client";

import { useState } from "react";

type Props = {
  initialValue: boolean;
};

export default function AvailabilityToggle({ initialValue }: Props) {
  const [isAvailable, setIsAvailable] = useState(initialValue);
  const [loading, setLoading]         = useState(false);

  async function toggle() {
    setLoading(true);
    const next = !isAvailable;
    try {
      const res = await fetch("/api/profile/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: next }),
      });
      if (res.ok) setIsAvailable(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-foreground">
          {isAvailable ? "✅ 예약 가능" : "❌ 현재 마감"}
        </p>
        <p className="text-xs text-(--muted)">
          {isAvailable
            ? "고객 페이지에 '예약 가능' 배지가 표시됩니다."
            : "고객 페이지에 '마감' 배지가 표시됩니다."}
        </p>
      </div>
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        aria-label="예약 가능 여부 토글"
        className={`relative h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
          isAvailable ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            isAvailable ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
