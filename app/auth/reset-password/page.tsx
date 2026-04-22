import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import { resetPassword } from "./actions";

type Props = { searchParams: Promise<{ error?: string; success?: string }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { error, success } = await searchParams;

  return (
    <AuthCard
      subtitle="비밀번호를 재설정합니다"
      heading="비밀번호 찾기"
      error={error ? decodeURIComponent(error) : undefined}
      success={success ? decodeURIComponent(success) : undefined}
      footer={
        <Link href="/auth/login" className="font-medium text-foreground hover:underline">
          ← 로그인으로 돌아가기
        </Link>
      }
    >
      {!success && (
        <form action={resetPassword} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="가입할 때 사용한 이메일"
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-foreground py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80"
          >
            재설정 이메일 보내기
          </button>
        </form>
      )}
    </AuthCard>
  );
}
