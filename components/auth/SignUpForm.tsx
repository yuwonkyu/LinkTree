"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { signUp } from "@/app/auth/actions";
import { createBrowserClient } from "@supabase/ssr";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="mt-1 w-full rounded-xl bg-foreground py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80 active:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          처리 중…
        </span>
      ) : (
        "무료로 시작하기"
      )}
    </button>
  );
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type EmailStatus = "idle" | "checking" | "available" | "taken" | "invalid";

type Props = { refCode?: string };

export default function SignUpForm({ refCode }: Props) {
  const [email, setEmail]             = useState("");
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");
  const [emailMsg, setEmailMsg]       = useState("");
  const [agreedTerms,   setAgreedTerms]   = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const agreedAll = agreedTerms && agreedPrivacy;

  const handleSocialLogin = async (provider: "google" | "kakao") => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
    );
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

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

  // 제출 버튼 비활성화 조건: 이메일 미확인 또는 동의 미체크
  const submitDisabled =
    (email.length > 0 && emailStatus !== "available") ||
    !agreedTerms ||
    !agreedPrivacy;

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
    <div className="flex flex-col gap-4">
      {/* 소셜 로그인 */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => handleSocialLogin("kakao")}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-[#e8d600] bg-[#FEE500] py-2.5 text-sm font-semibold text-[#3C1E1E] transition hover:brightness-95 hover:scale-[1.01] active:scale-[0.99] active:brightness-90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 3C6.48 3 2 6.72 2 11.3c0 2.91 1.83 5.47 4.59 6.97L5.5 22l5.06-2.75c.47.06.95.1 1.44.1 5.52 0 10-3.72 10-8.3C22 6.72 17.52 3 12 3z"/>
          </svg>
          카카오 바로 시작하기
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-700 transition hover:brightness-95 hover:scale-[1.01] active:scale-[0.99] active:brightness-90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          구글 바로 시작하기
        </button>
      </div>

      {/* 구분선 */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-(--muted)">또는 이메일로 가입</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

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

      {/* 약관 동의 */}
      <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-(--secondary) px-4 py-3">
        {/* 전체 동의 */}
        <label className="flex cursor-pointer items-center gap-3 border-b border-gray-200 pb-2.5">
          <input
            type="checkbox"
            checked={agreedAll}
            onChange={(e) => {
              setAgreedTerms(e.target.checked);
              setAgreedPrivacy(e.target.checked);
            }}
            className="h-4 w-4 shrink-0 accent-foreground"
          />
          <span className="text-sm font-semibold text-foreground">전체 동의하기</span>
        </label>

        {/* 개별 항목 */}
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-foreground"
          />
          <span className="text-xs text-foreground leading-relaxed">
            <span className="font-medium">[필수]</span>{" "}
            <a href="/terms" target="_blank" rel="noopener noreferrer"
              className="font-medium underline underline-offset-2 hover:text-(--muted)">
              이용약관
            </a>{" "}
            동의
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agreedPrivacy}
            onChange={(e) => setAgreedPrivacy(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-foreground"
          />
          <span className="text-xs text-foreground leading-relaxed">
            <span className="font-medium">[필수]</span>{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer"
              className="font-medium underline underline-offset-2 hover:text-(--muted)">
              개인정보처리방침
            </a>{" "}
            동의
          </span>
        </label>
        <p className="pl-7 text-xs text-(--muted)">
          이메일, 이름, 서비스 이용 정보를 회원 관리·서비스 제공 목적으로 수집합니다.
        </p>
      </div>

      <SubmitButton disabled={submitDisabled} />
    </form>
    </div>
  );
}
