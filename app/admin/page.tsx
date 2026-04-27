import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase";
import { PLAN_META, type Plan } from "@/lib/types";
import { getSiteUrl } from "@/lib/site-url";
import PlanSelect from "./PlanSelect";
import SuspendButton from "./SuspendButton";
import AdminDeleteButton from "./AdminDeleteButton";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";
const SITE_URL = getSiteUrl();

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type SortKey = "created_desc" | "created_asc" | "views_desc" | "views_asc" | "expires_soon";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; q?: string; status?: string; sort?: SortKey }>;
}) {
  // 인증 확인
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) redirect("/dashboard");

  const { plan: planFilter, q, status: statusFilter, sort = "created_desc" } = await searchParams;

  // 전체 고객 조회
  let query = adminClient
    .from("profiles")
    .select("id, slug, name, shop_name, plan, plan_expires_at, is_active, view_count, created_at");

  // 플랜 필터
  if (planFilter && planFilter !== "all") query = query.eq("plan", planFilter);

  // 상태 필터
  if (statusFilter === "active")   query = query.eq("is_active", true);
  if (statusFilter === "inactive") query = query.eq("is_active", false);

  // 통합 검색 (슬러그 + 이름 + 상호)
  if (q) query = query.or(`slug.ilike.%${q}%,name.ilike.%${q}%,shop_name.ilike.%${q}%`);

  // 정렬
  const sortMap: Record<string, { column: string; ascending: boolean }> = {
    created_desc: { column: "created_at",  ascending: false },
    created_asc:  { column: "created_at",  ascending: true  },
    views_desc:   { column: "view_count",  ascending: false },
    views_asc:    { column: "view_count",  ascending: true  },
  };
  const sortCfg = sortMap[sort] ?? sortMap.created_desc;
  query = query.order(sortCfg.column, { ascending: sortCfg.ascending });

  const { data: rawProfiles } = await query;

  // 만료 임박 필터 (JS 측): 7일 이내
  let profiles = rawProfiles ?? [];
  if (sort === "expires_soon") {
    const soon = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    profiles = profiles
      .filter((p) => p.plan_expires_at && new Date(p.plan_expires_at) <= soon)
      .sort((a, b) =>
        new Date(a.plan_expires_at!).getTime() - new Date(b.plan_expires_at!).getTime()
      );
  }

  // 매출 요약
  const { data: subs } = await adminClient.from("subscriptions").select("plan, amount, status");
  const activeRevenue = (subs ?? [])
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + (s.amount ?? 0), 0);

  const { data: allProfiles } = await adminClient
    .from("profiles")
    .select("plan, is_active");

  const planCounts = (allProfiles ?? []).reduce<Record<string, number>>((acc, p) => {
    acc[p.plan] = (acc[p.plan] ?? 0) + 1;
    return acc;
  }, {});

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
  const paidChurnCount  = (deletedStats ?? []).filter((d) => d.had_paid).length;
  const avgDaysActive   = totalDeleted > 0
    ? Math.round((deletedStats ?? []).reduce((sum, d) => sum + (d.days_active ?? 0), 0) / totalDeleted)
    : 0;

  // 만료 임박 카운트 (7일 이내)
  const expiresSoonCount = (allProfiles ?? []).filter((p) => {
    const raw = (p as { plan_expires_at?: string }).plan_expires_at;
    if (!raw) return false;
    return new Date(raw) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }).length;

  return (
    <div className="min-h-screen bg-(--secondary)">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="font-display text-base font-bold text-foreground">
            InstaLink <span className="text-xs font-normal text-(--muted)">관리자</span>
          </span>
          <Link href="/dashboard" className="text-sm text-(--muted) hover:text-foreground">
            ← 내 대시보드
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 flex flex-col gap-6">

        {/* ── 매출 요약 ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "전체 고객",    value: allProfiles?.length ?? 0,         unit: "명" },
            { label: "월 예상 매출", value: activeRevenue.toLocaleString(),    unit: "원" },
            { label: "Basic",        value: planCounts["basic"] ?? 0,          unit: "명" },
            { label: "Pro",          value: planCounts["pro"] ?? 0,            unit: "명" },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl bg-white p-4 shadow-[0_2px_12px_rgba(17,24,39,0.06)]">
              <p className="text-xs text-(--muted)">{card.label}</p>
              <p className="mt-1 text-xl font-bold text-foreground">
                {card.value}
                <span className="text-sm font-normal text-(--muted) ml-0.5">{card.unit}</span>
              </p>
            </div>
          ))}
        </div>

        {/* ── 탈퇴 통계 ── */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(17,24,39,0.06)]">
          <h2 className="mb-3 text-sm font-semibold text-foreground">회원 탈퇴 통계</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "누적 탈퇴",         value: totalDeleted,      unit: "명" },
              { label: "이번 달 탈퇴",       value: deletedThisMonth,  unit: "명" },
              { label: "유료 경험 후 탈퇴",  value: paidChurnCount,    unit: "명" },
              { label: "평균 이용 기간",     value: avgDaysActive,     unit: "일" },
            ].map((card) => (
              <div key={card.label} className="rounded-xl bg-(--secondary) p-3">
                <p className="text-xs text-(--muted)">{card.label}</p>
                <p className="mt-1 text-lg font-bold text-foreground">
                  {card.value}
                  <span className="text-xs font-normal text-(--muted) ml-0.5">{card.unit}</span>
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

        {/* ── Supabase 삭제 가이드 (접이식 메모) ── */}
        <details className="group rounded-2xl bg-amber-50 border border-amber-200 shadow-[0_2px_12px_rgba(17,24,39,0.04)]">
          <summary className="flex cursor-pointer items-center justify-between px-5 py-4 select-none">
            <div className="flex items-center gap-2">
              <span className="text-base">📋</span>
              <span className="text-sm font-semibold text-amber-800">Supabase 계정 삭제 가이드</span>
              <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">메모</span>
            </div>
            <span className="text-amber-500 text-sm transition-transform group-open:rotate-180">▼</span>
          </summary>

          <div className="border-t border-amber-200 px-5 py-4 text-sm text-amber-900 flex flex-col gap-4">
            <p className="text-xs text-amber-700 font-medium">⚠️ 반드시 profiles 먼저 → Auth 유저 삭제 순서로 진행하세요 (역순 시 외래키 오류 발생)</p>

            {/* 방법 1 */}
            <div>
              <p className="font-semibold mb-2">방법 1 — 대시보드 UI (빠름)</p>
              <ol className="flex flex-col gap-1.5 pl-4 list-decimal text-xs leading-relaxed text-amber-800">
                <li>
                  <a href="https://supabase.com" target="_blank" rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-amber-950">supabase.com</a>
                  {" "}→ 프로젝트 진입
                </li>
                <li>
                  <strong>Table Editor</strong> → <code className="bg-amber-100 px-1 rounded">profiles</code> 테이블 →
                  상단 <strong>Filter</strong> → <code className="bg-amber-100 px-1 rounded">slug = 삭제할슬러그</code> 검색
                </li>
                <li>해당 행 왼쪽 체크박스 선택 → <strong>Delete row</strong> (휴지통 아이콘)</li>
                <li>
                  <strong>Authentication</strong> → <strong>Users</strong> → 이메일로 검색
                </li>
                <li>해당 유저 오른쪽 <strong>⋯ 메뉴</strong> → <strong>Delete user</strong> 클릭 → 확인</li>
              </ol>
            </div>

            {/* 방법 2 */}
            <div>
              <p className="font-semibold mb-2">방법 2 — SQL Editor (한 번에)</p>
              <pre className="rounded-xl bg-amber-100 px-4 py-3 text-xs text-amber-900 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`-- 1. profiles 삭제 (슬러그로)
DELETE FROM profiles
WHERE slug = '삭제할슬러그';

-- 2. auth.users 삭제 (이메일로)
DELETE FROM auth.users
WHERE email = '삭제할이메일@example.com';`}
              </pre>
              <p className="mt-1.5 text-xs text-amber-700">
                SQL Editor: Supabase 대시보드 왼쪽 메뉴 → <strong>SQL Editor</strong> → New query → 붙여넣기 후 Run
              </p>
            </div>
          </div>
        </details>

        {/* ── 필터 바 ── */}
        <div className="rounded-2xl bg-white p-4 shadow-[0_2px_12px_rgba(17,24,39,0.06)] flex flex-col gap-3">
          <form className="flex flex-col gap-3">
            {/* 검색 */}
            <div className="flex gap-2">
              <input
                name="q"
                defaultValue={q}
                placeholder="이름 · 상호명 · 슬러그 검색"
                className="flex-1 rounded-xl border border-gray-200 bg-(--secondary) px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-colors"
              />
              <button
                type="submit"
                className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-white hover:opacity-80 transition-opacity"
              >
                검색
              </button>
            </div>

            {/* 플랜 필터 */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-(--muted) w-8">플랜</span>
              {[
                { value: "all",   label: "전체" },
                { value: "free",  label: "Free" },
                { value: "basic", label: "Basic" },
                { value: "pro",   label: "Pro" },
              ].map(({ value, label }) => (
                <button key={value} name="plan" value={value} type="submit"
                  className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
                    (planFilter ?? "all") === value
                      ? "border-foreground bg-foreground text-white"
                      : "border-gray-200 bg-white text-(--muted) hover:border-gray-300"
                  }`}
                >
                  {label}
                  {value !== "all" && (
                    <span className="ml-1 opacity-60">({planCounts[value] ?? 0})</span>
                  )}
                </button>
              ))}
            </div>

            {/* 상태 필터 */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-(--muted) w-8">상태</span>
              {[
                { value: "all",      label: "전체" },
                { value: "active",   label: "공개 중" },
                { value: "inactive", label: "비공개" },
              ].map(({ value, label }) => (
                <button key={value} name="status" value={value} type="submit"
                  className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
                    (statusFilter ?? "all") === value
                      ? "border-foreground bg-foreground text-white"
                      : "border-gray-200 bg-white text-(--muted) hover:border-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 정렬 */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-(--muted) w-8">정렬</span>
              {[
                { value: "created_desc",  label: "최신 가입순" },
                { value: "created_asc",   label: "오래된 가입순" },
                { value: "views_desc",    label: "조회수 높은순" },
                { value: "views_asc",     label: "조회수 낮은순" },
                { value: "expires_soon",  label: `만료 임박 (${expiresSoonCount}명)` },
              ].map(({ value, label }) => (
                <button key={value} name="sort" value={value} type="submit"
                  className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
                    sort === value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-(--muted) hover:border-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 숨김 필드: 현재 필터 유지 */}
            {q          && <input type="hidden" name="q"      value={q} />}
            {planFilter && <input type="hidden" name="plan"   value={planFilter} />}
            {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
            {sort       && <input type="hidden" name="sort"   value={sort} />}
          </form>

          {/* 결과 요약 */}
          <p className="text-xs text-(--muted)">
            {q || (planFilter && planFilter !== "all") || (statusFilter && statusFilter !== "all") || sort !== "created_desc"
              ? `${profiles.length}명 표시 중`
              : `전체 ${allProfiles?.length ?? 0}명`}
          </p>
        </div>

        {/* ── 고객 테이블 ── */}
        <div className="overflow-x-auto rounded-2xl bg-white shadow-[0_2px_12px_rgba(17,24,39,0.06)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-(--muted)">
                <th className="px-4 py-3 font-medium">슬러그</th>
                <th className="px-4 py-3 font-medium">이름 / 상호</th>
                <th className="px-4 py-3 font-medium">플랜</th>
                <th className="px-4 py-3 font-medium">만료일</th>
                <th className="px-4 py-3 font-medium">상태</th>
                <th className="px-4 py-3 font-medium">조회수</th>
                <th className="px-4 py-3 font-medium">가입일</th>
                <th className="px-4 py-3 font-medium">중지</th>
                <th className="px-4 py-3 font-medium">삭제</th>
                <th className="px-4 py-3 font-medium">바로가기</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => {
                const expiresSoon = p.plan_expires_at
                  && new Date(p.plan_expires_at) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                return (
                  <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50/50 ${expiresSoon ? "bg-amber-50/40" : ""}`}>
                    <td className="px-4 py-3 font-mono text-xs text-foreground">{p.slug}</td>
                    <td className="px-4 py-3 text-foreground">
                      <div className="flex flex-col">
                        <span>{p.name || "—"}</span>
                        {p.shop_name && p.shop_name !== p.name && (
                          <span className="text-[11px] text-(--muted)">{p.shop_name}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <PlanSelect profileId={p.id} current={(p.plan ?? "free") as Plan} />
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {p.plan_expires_at ? (
                        <span className={expiresSoon ? "font-semibold text-amber-600" : "text-(--muted)"}>
                          {expiresSoon && "⚠️ "}
                          {new Date(p.plan_expires_at).toLocaleDateString("ko-KR")}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-(--muted)"
                      }`}>
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
                      <SuspendButton profileId={p.id} initialActive={p.is_active ?? true} />
                    </td>
                    <td className="px-4 py-3">
                      <AdminDeleteButton
                        profileId={p.id}
                        slug={p.slug}
                        name={p.name || p.shop_name || p.slug}
                        isActive={p.is_active ?? true}
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
                );
              })}
              {!profiles.length && (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-sm text-(--muted)">
                    조건에 맞는 고객이 없습니다.
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
