import { redirect } from "next/navigation";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { Plan, Profile } from "@/lib/types";
import { getSiteUrl } from "@/lib/site-url";
import BillingClient from "./BillingClient";

const SITE_URL = getSiteUrl();
const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY ?? "";

export default async function BillingPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, plan, plan_expires_at")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!profile) redirect("/dashboard");

  const currentPlan: Plan = (profile.plan as Plan) ?? "free";

  return (
    <div className="min-h-screen bg-(--secondary)">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <span className="font-display text-base font-bold tracking-tight text-foreground">
            InstaLink
          </span>
          <Link
            href="/dashboard"
            className="text-sm text-(--muted) hover:text-foreground"
          >
            ← 대시보드
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">플랜 선택</h1>
          <p className="mt-1 text-sm text-(--muted)">
            현재 플랜:{" "}
            <span className="font-semibold text-foreground capitalize">
              {currentPlan}
            </span>
            {profile.plan_expires_at && (
              <span className="ml-2 text-xs text-(--muted)">
                (만료:{" "}
                {new Date(profile.plan_expires_at).toLocaleDateString("ko-KR")})
              </span>
            )}
          </p>
        </div>

        {!TOSS_CLIENT_KEY && (
          <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
            ⚠️ 토스페이먼츠 클라이언트 키가 설정되지 않았습니다.{" "}
            <code className="rounded bg-amber-100 px-1">.env.local</code>에{" "}
            <code className="rounded bg-amber-100 px-1">
              NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY
            </code>
            를 추가하세요.
          </div>
        )}

        <BillingClient
          currentPlan={currentPlan}
          userId={user.id}
          userEmail={user.email ?? ""}
          userName={profile.name ?? ""}
          clientKey={TOSS_CLIENT_KEY}
          siteUrl={SITE_URL}
        />

        {currentPlan !== "free" && (
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="mb-1 text-sm font-semibold text-foreground">환불 신청</h2>
            <p className="mb-3 text-xs text-(--muted)">
              결제일로부터 7일 이내 미사용 시 전액 환불 가능합니다.{" "}
              <a href="/refund" className="underline hover:text-foreground">환불 정책 보기</a>
            </p>
            <a
              href={`mailto:duck01777@gmail.com?subject=${encodeURIComponent(`[환불 신청] ${user.email ?? ""}`)}&body=${encodeURIComponent(`가입 이메일: ${user.email ?? ""}\n현재 플랜: ${currentPlan}\n\n결제일:\n\n환불 사유:\n\n(자세히 작성해주세요)`)}`}
              className="inline-block rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-foreground hover:bg-(--secondary) transition-colors"
            >
              이메일로 환불 신청하기
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
