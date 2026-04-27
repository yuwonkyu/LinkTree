import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase";
import { PLAN_META, type Plan } from "@/lib/types";
import { getSiteUrl } from "@/lib/site-url";
import PlanSelect from "./PlanSelect";
import SuspendButton from "./SuspendButton";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";
const SITE_URL = getSiteUrl();

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; q?: string }>;
}) {
  // 인증 확인
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) redirect("/dashboard");

  const { plan: planFilter, q } = await searchParams;

  // 전체 고객 조회
  let query = adminClient
    .from("profiles")
    .select(
      "id, slug, name, shop_name, plan, plan_expires_at, is_active, view_count, created_at",
    )
    .order("created_at", { ascending: false });

  if (planFilter && planFilter !== "all") query = query.eq("plan", planFilter);
  if (q) query = query.ilike("slug", `%${q}%`);

  const { data: profiles } = await query;

  // 매출 요약
  const { data: subs } = await adminClient
    .from("subscriptions")
    .select("plan, amount, status");

  const activeRevenue = (subs ?? [])
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + (s.amount ?? 0), 0);

  const planCounts = (profiles ?? []).reduce<Record<string, number>>(
    (acc, p) => {
      acc[p.plan] = (acc[p.plan] ?? 0) + 1;
      return acc;
    },
    {},
  );

  // 탈퇴 통계
  const { data: deletedStats } = await adminClient
    .from("deleted_accounts")
    .select("plan, days_active, had_paid, had_reviews, deleted_at")
    .order("deleted_at", { ascending: false });

  const totalDeleted = deletedStats?.length ?? 0;
  const deletedThisMonth = (deletedStats ?? []).filter((d) => {
    const dt = new Date(d.deleted_at);
    const now = new Date();
    return dt.getFullYear() === now.getFullYear() && dt.getMonth() === now.getMonth();
  }).length;
  const paidChurnCount = (deletedStats ?? []).filter((d) => d.had_paid).length;
  const avgDaysActive =
    totalDeleted > 0
      ? Math.round(
          (deletedStats ?? []).reduce((sum, d) => sum + (d.days_active ?? 0), 0) /
            totalDeleted,
        )
      : 0;

  return (
    <div className="min-h-screen bg-(--secondary)">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="font-display text-base font-bold text-foreground">
            InstaLink{" "}
            <span className="text-xs font-normal text-(--muted)">관리자</span>
          </span>
          <Link
            href="/dashboard"
            className="text-sm text-(--muted) hover:text-foreground"
          >
            ← 내 대시보드
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 flex flex-col gap-6">
        {/* 매출 요약 */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "전체 고객", value: profiles?.length ?? 0, unit: "명" },
            {
              label: "월 예상 매출",
              value: activeRevenue.toLocaleString(),
              unit: "원",
            },
            { label: "Basic", value: planCounts["basic"] ?? 0, unit: "명" },
            { label: "Pro", value: planCounts["pro"] ?? 0, unit: "명" },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl bg-white p-4 shadow-[0_2px_12px_rgba(17,24,39,0.06)]"
            >
              <p className="text-xs text-(--muted)">{card.label}</p>
              <p className="mt-1 text-xl font-bold text-foreground">
                {card.value}
                <span className="text-sm font-normal text-(--muted) ml-0.5">
                  {card.unit}
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* 탈퇴 통계 */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(17,24,39,0.06)]">
          <h2 className="mb-3 text-sm font-semibold text-foreground">회원 탈퇴 통계</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "누적 탈퇴", value: totalDeleted, unit: "명" },
              { label: "이번 달 탈퇴", value: deletedThisMonth, unit: "명" },
              { label: "유료 경험 후 탈퇴", value: paidChurnCount, unit: "명" },
              { label: "평균 이용 기간", value: avgDaysActive, unit: "일" },
            ].map((card) => (
              <div key={card.label} className="rounded-xl bg-(--secondary) p-3">
                <p className="text-xs text-(--muted)">{card.label}</p>
                <p className="mt-1 text-lg font-bold text-foreground">
                  {card.value}
                  <span className="text-xs font-normal text-(--muted) ml-0.5">
                    {card.unit}
                  </span>
                </p>
              </div>
            ))}
          </div>
          {totalDeleted > 0 && (
            <p className="mt-3 text-xs text-(--muted)">
              * 개인정보(이름·이메일·슬러그) 미포함 — 탈퇴 추이 분석용 익명 데이터
            </p>
          )}
        </div>

        {/* 필터 */}
        <form className="flex flex-wrap gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="슬러그 검색"
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
          {["all", "free", "basic", "pro"].map((p) => (
            <button
              key={p}
              name="plan"
              value={p}
              type="submit"
              className={`rounded-xl border px-3 py-2 text-xs font-medium capitalize transition-colors ${
                (planFilter ?? "all") === p
                  ? "border-foreground bg-foreground text-white"
                  : "border-gray-200 bg-white text-(--muted) hover:border-gray-300"
              }`}
            >
              {p === "all" ? "전체" : p}
            </button>
          ))}
        </form>

        {/* 고객 테이블 */}
        <div className="overflow-x-auto rounded-2xl bg-white shadow-[0_2px_12px_rgba(17,24,39,0.06)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-(--muted)">
                <th className="px-4 py-3 font-medium">슬러그</th>
                <th className="px-4 py-3 font-medium">이름</th>
                <th className="px-4 py-3 font-medium">플랜</th>
                <th className="px-4 py-3 font-medium">만료일</th>
                <th className="px-4 py-3 font-medium">상태</th>
                <th className="px-4 py-3 font-medium">조회수</th>
                <th className="px-4 py-3 font-medium">가입일</th>
                <th className="px-4 py-3 font-medium">중지</th>
                <th className="px-4 py-3 font-medium">바로가기</th>
              </tr>
            </thead>
            <tbody>
              {(profiles ?? []).map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50"
                >
                  <td className="px-4 py-3 font-mono text-xs text-foreground">
                    {p.slug}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {p.name || p.shop_name || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <PlanSelect
                      profileId={p.id}
                      current={(p.plan ?? "free") as Plan}
                    />
                  </td>
                  <td className="px-4 py-3 text-xs text-(--muted)">
                    {p.plan_expires_at
                      ? new Date(p.plan_expires_at).toLocaleDateString("ko-KR")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-(--muted)"
                      }`}
                    >
                      {p.is_active ? "공개" : "비공개"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-(--muted)">
                    {(p.view_count ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-xs text-(--muted)">
                    {new Date(p.created_at).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-4 py-3">
                    <SuspendButton
                      profileId={p.id}
                      initialActive={p.is_active ?? true}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`${SITE_URL}/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline"
                    >
                      보기 →
                    </a>
                  </td>
                </tr>
              ))}
              {!profiles?.length && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-sm text-(--muted)"
                  >
                    고객이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
