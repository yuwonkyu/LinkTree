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
      </main>
    </div>
  );
}
