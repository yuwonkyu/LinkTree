import Link from "next/link";
import { signIn } from "@/app/auth/actions";
import AuthCard from "@/components/auth/AuthCard";

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <AuthCard
      subtitle="내 링크 페이지 관리하기"
      heading="로그인"
      error={error ? decodeURIComponent(error) : undefined}
      footer={
        <>
          계정이 없으신가요?{" "}
          <Link href="/auth/signup" className="font-medium text-foreground hover:underline">
            회원가입
          </Link>
        </>
      }
    >
      <form action={signIn} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-foreground">이메일</label>
          <input id="email" name="email" type="email" placeholder="hello@example.com" required className={inputCls} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-foreground">비밀번호</label>
          <input id="password" name="password" type="password" placeholder="••••••••" required className={inputCls} />
        </div>
        <button type="submit"
          className="mt-1 w-full rounded-xl bg-foreground py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80 active:opacity-70">
          로그인
        </button>
      </form>
    </AuthCard>
  );
}
