"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteAccountButton() {
  const router = useRouter();
  const [step, setStep]       = useState<"idle" | "confirm">("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        setError(typeof json.error === "string" ? json.error : "오류가 발생했습니다.");
        setLoading(false);
        return;
      }
      router.push("/auth/login?message=탈퇴가 완료되었습니다.");
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      setLoading(false);
    }
  }

  if (step === "idle") {
    return (
      <button
        type="button"
        onClick={() => setStep("confirm")}
        className="text-xs text-red-400 hover:text-red-600 transition-colors"
      >
        회원 탈퇴
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-red-100 bg-red-50 p-4">
      <p className="text-sm font-medium text-red-700">정말 탈퇴하시겠습니까?</p>
      <p className="mt-1 text-xs text-red-500">
        탈퇴 시 모든 페이지 데이터와 계정 정보가 즉시 삭제되며 복구할 수 없습니다.
      </p>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="rounded-lg bg-red-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "처리 중…" : "탈퇴 확인"}
        </button>
        <button
          type="button"
          onClick={() => { setStep("idle"); setError(null); }}
          disabled={loading}
          className="rounded-lg border border-gray-200 px-4 py-1.5 text-xs font-medium text-(--muted) hover:bg-white transition-colors"
        >
          취소
        </button>
      </div>
    </div>
  );
}
