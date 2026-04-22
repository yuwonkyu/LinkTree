"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import AuthCard from "@/components/auth/AuthCard";

function getSupabaseBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    const { error: err } = await supabase.auth.updateUser({ password });

    if (err) {
      setError("비밀번호 변경에 실패했습니다. 링크가 만료되었을 수 있습니다. 다시 시도해주세요.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    // 3초 후 로그인 페이지로 이동
    setTimeout(() => { window.location.href = "/auth/login"; }, 3000);
  }

  return (
    <AuthCard
      subtitle="새 비밀번호를 설정합니다"
      heading="비밀번호 변경"
      error={error || undefined}
      success={success ? "비밀번호가 변경되었습니다. 잠시 후 로그인 페이지로 이동합니다." : undefined}
      footer={
        <a href="/auth/login" className="font-medium text-foreground hover:underline">
          ← 로그인으로 돌아가기
        </a>
      }
    >
      {!success && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              새 비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8자 이상"
              required
              minLength={8}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="confirm" className="text-sm font-medium text-foreground">
              비밀번호 확인
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="비밀번호 재입력"
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-foreground py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-60"
          >
            {loading ? "변경 중…" : "비밀번호 변경하기"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
