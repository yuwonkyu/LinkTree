import Link from "next/link";
import { signUp } from "@/app/auth/actions";

type Props = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function SignUpPage({ searchParams }: Props) {
  const { error, success } = await searchParams;

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-(--secondary) px-4 py-10">
      <div className="w-full max-w-sm">
        {/* 로고 영역 */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            InstaLink
          </h1>
          <p className="mt-1 text-sm text-(--muted)">
            나만의 링크 페이지를 만들어보세요
          </p>
        </div>

        <div className="rounded-2xl bg-(--card) p-6 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <h2 className="mb-5 text-lg font-semibold text-foreground">회원가입</h2>

          {/* 이메일 확인 안내 */}
          {success === "1" && (
            <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              가입 확인 이메일을 보냈습니다. 받은 편지함을 확인해주세요.
            </div>
          )}

          {/* 오류 메시지 */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form action={signUp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                이름 / 브랜드명
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="뀨 PT"
                required
                className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors"
              />
            </div>

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
                placeholder="8자 이상"
                required
                minLength={8}
                className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="mt-1 w-full rounded-xl bg-foreground py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80 active:opacity-70"
            >
              가입하기
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-(--muted)">
            이미 계정이 있으신가요?{" "}
            <Link href="/auth/login" className="font-medium text-foreground hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
