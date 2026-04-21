"use client";

import { useEffect, useRef, useState } from "react";
import { signUp } from "@/app/auth/actions";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type EmailStatus = "idle" | "checking" | "available" | "taken" | "invalid";

type Props = { refCode?: string };

export default function SignUpForm({ refCode }: Props) {
  const [email, setEmail]             = useState("");
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");
  const [emailMsg, setEmailMsg]       = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 이메일 변경 시 실시간 검사
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!email) {
      setEmailStatus("idle");
      setEmailMsg("");
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setEmailStatus("invalid");
      setEmailMsg("이메일 형식을 확인해주세요.");
      return;
    }

    // 형식은 맞음 → 500ms 디바운스 후 중복 확인
    setEmailStatus("checking");
    setEmailMsg("확인 중…");

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/auth/check-email?email=${encodeURIComponent(email)}`,
        );
        const { available, error } = await res.json();

        if (error) {
          setEmailStatus("invalid");
          setEmailMsg(error);
        } else if (available) {
          setEmailStatus("available");
          setEmailMsg("사용 가능한 이메일입니다.");
        } else {
          setEmailStatus("taken");
          setEmailMsg("이미 사용 중인 이메일입니다.");
        }
      } catch {
        // 네트워크 오류 시 검사 skip — 서버 액션에서 재검증
        setEmailStatus("idle");
        setEmailMsg("");
      }
    }, 500);
  }, [email]);

  // 제출 버튼 비활성화 조건: 이메일을 입력했는데 available이 아닌 경우
  const submitDisabled = email.length > 0 && emailStatus !== "available";

  // 상태별 스타일
  const statusColor: Record<EmailStatus, string> = {
    idle:      "",
    checking:  "text-(--muted)",
    available: "text-green-600",
    taken:     "text-red-500",
    invalid:   "text-red-500",
  };

  const borderColor: Record<EmailStatus, string> = {
    idle:      "border-gray-200",
    checking:  "border-gray-200",
    available: "border-green-400",
    taken:     "border-red-400",
    invalid:   "border-red-400",
  };

  const inputBase =
    "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors";

  return (
    <form action={signUp} className="flex flex-col gap-4">
      {refCode && <input type="hidden" name="ref" value={refCode} />}

      {/* 이름 */}
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          이름 / 브랜드명
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="김지수 트레이너"
          required
          className={`${inputBase} border-gray-200`}
        />
      </div>

      {/* 이메일 — 실시간 검사 */}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="hello@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          className={`${inputBase} ${borderColor[emailStatus]}`}
        />
        {emailMsg && (
          <p className={`flex items-center gap-1 text-xs ${statusColor[emailStatus]}`}>
            {emailStatus === "checking" && (
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {emailStatus === "available" && "✓"}
            {(emailStatus === "taken" || emailStatus === "invalid") && "✕"}
            {emailMsg}
          </p>
        )}
      </div>

      {/* 비밀번호 */}
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="8자 이상"
          required
          minLength={8}
          className={`${inputBase} border-gray-200`}
        />
      </div>

      <button
        type="submit"
        disabled={submitDisabled}
        className="mt-1 w-full rounded-xl bg-foreground py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80 active:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
      >
        가입하기
      </button>
    </form>
  );
}
