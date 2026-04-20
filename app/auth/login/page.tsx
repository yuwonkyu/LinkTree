import Link from "next/link";
import { signIn } from "@/app/auth/actions";

type Props = {
  searchParams: Promise<{ error?: string; redirectTo?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-(--secondary) px-4 py-10">
      <div className="w-full max-w-sm">
        {/* 로고 영역 */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            InstaLink
          </h1>
          <p className="mt-1 text-sm text-(--muted)">
            내 링크 페이지 관리하기
          </p>
        </div>

        <div className="rounded-2xl bg-(--card) p-6 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <h2 className="mb-5 text-lg font-semibold text-foreground">로그인</h2>

          {/* 오류 메시지 */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={signIn} className="flex flex-col gap-4">
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
                className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="mt-1 w-full rounded-xl bg-foreground py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80 active:opacity-70"
            >
              로그인
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-(--muted)">
            계정이 없으신가요?{" "}
            <Link href="/auth/signup" className="font-medium text-foreground hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
