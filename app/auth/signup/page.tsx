import Link from "next/link";
import { signUp } from "@/app/auth/actions";
import AuthCard from "@/components/auth/AuthCard";

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors";

type Props = { searchParams: Promise<{ error?: string; success?: string }> };

export default async function SignUpPage({ searchParams }: Props) {
  const { error, success } = await searchParams;

  return (
    <AuthCard
      subtitle="나만의 링크 페이지를 만들어보세요"
      heading="회원가입"
      error={error ?? undefined}
      success={success === "1" ? "가입 확인 이메일을 보냈습니다. 받은 편지함을 확인해주세요." : undefined}
      footer={
        <>
          이미 계정이 있으신가요?{" "}
          <Link href="/auth/login" className="font-medium text-foreground hover:underline">
            로그인
          </Link>
        </>
      }
    >
      <form action={signUp} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-foreground">이름 / 브랜드명</label>
          <input id="name" name="name" type="text" placeholder="김지수 트레이너" required className={inputCls} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-foreground">이메일</label>
          <input id="email" name="email" type="email" placeholder="hello@example.com" required className={inputCls} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-foreground">비밀번호</label>
          <input id="password" name="password" type="password" placeholder="8자 이상" required minLength={8} className={inputCls} />
        </div>
        <button type="submit"
          className="mt-1 w-full rounded-xl bg-foreground py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80 active:opacity-70">
          가입하기
        </button>
      </form>
    </AuthCard>
  );
}
