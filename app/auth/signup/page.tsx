import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import SignUpForm from "@/components/auth/SignUpForm";

type Props = { searchParams: Promise<{ error?: string; success?: string; ref?: string }> };

export default async function SignUpPage({ searchParams }: Props) {
  const { error, success, ref } = await searchParams;

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
      {/* 추천 코드 배너 */}
      {ref && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3">
          <span className="text-green-600">🎁</span>
          <p className="text-sm text-green-700">
            추천 코드{" "}
            <strong className="font-bold tracking-widest">{ref.toUpperCase()}</strong>
            가 가입 후 자동으로 적용됩니다.
          </p>
        </div>
      )}

      <SignUpForm refCode={ref} />
    </AuthCard>
  );
}
