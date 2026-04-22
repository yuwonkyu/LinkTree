import { redirect } from "next/navigation";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

type ClickRow = { link_type: string; created_at: string };
type DailyClicks = {
  date: string;
  label: string;
  kakao: number;
  instagram: number;
  phone: number;
  total: number;
};

async function getMyProfile(ownerId: string): Promise<Profile | null> {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("owner_id", ownerId)
    .maybeSingle();
  return data as Profile | null;
}

async function getDailyClicks(profileId: string): Promise<DailyClicks[]> {
  const supabase = await getSupabaseServerClient();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data } = await supabase
    .from("link_clicks")
    .select("link_type, created_at")
    .eq("profile_id", profileId)
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: true });

  // 날짜별 집계
  const byDate: Record<string, { kakao: number; instagram: number; phone: number }> = {};
  for (const row of (data as ClickRow[] | null) ?? []) {
    const date = new Date(row.created_at).toISOString().split("T")[0];
    if (!byDate[date]) byDate[date] = { kakao: 0, instagram: 0, phone: 0 };
    if (row.link_type === "kakao")     byDate[date].kakao++;
    if (row.link_type === "instagram") byDate[date].instagram++;
    if (row.link_type === "phone")     byDate[date].phone++;
  }

  // 최근 30일 전체 채우기
  const result: DailyClicks[] = [];
  const DAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = d.toISOString().split("T")[0];
    const label = i === 0 ? "오늘" : `${d.getMonth() + 1}/${d.getDate()}(${DAYS_KO[d.getDay()]})`;
    const counts = byDate[date] ?? { kakao: 0, instagram: 0, phone: 0 };
    result.push({ date, label, ...counts, total: counts.kakao + counts.instagram + counts.phone });
  }
  return result;
}

export default async function StatsPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const profile = await getMyProfile(user.id);
  if (!profile) redirect("/dashboard");

  const isPaid = profile.plan === "basic" || profile.plan === "pro";

  // 유료 플랜이 아니면 업그레이드 안내
  if (!isPaid) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-4xl mb-4">📊</span>
        <h1 className="text-base font-bold text-foreground">방문자 통계</h1>
        <p className="mt-2 text-sm text-(--muted)">
          베이직 이상 플랜에서 이용할 수 있어요.
        </p>
        <Link
          href="/billing"
          className="mt-5 inline-block rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-white hover:opacity-80 transition-opacity"
        >
          업그레이드하기
        </Link>
        <Link href="/dashboard" className="mt-3 text-xs text-(--muted) hover:text-foreground">
          ← 대시보드로 돌아가기
        </Link>
      </div>
    );
  }

  const dailyClicks = await getDailyClicks(profile.id);
  const maxTotal = Math.max(...dailyClicks.map((d) => d.total), 1);
  const total30d  = dailyClicks.reduce((s, d) => s + d.total, 0);
  const kakaoSum  = dailyClicks.reduce((s, d) => s + d.kakao, 0);
  const instaSum  = dailyClicks.reduce((s, d) => s + d.instagram, 0);
  const phoneSum  = dailyClicks.reduce((s, d) => s + d.phone, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">방문자 통계</h1>
          <p className="mt-1 text-sm text-(--muted)">최근 30일 링크 클릭 현황</p>
        </div>
        <Link href="/dashboard" className="text-xs font-medium text-(--muted) hover:text-foreground">
          ← 대시보드
        </Link>
      </div>

      {/* 요약 카드 2개 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <p className="text-xs text-(--muted)">누적 방문자</p>
          <p className="mt-1 text-3xl font-bold text-foreground">
            {(profile.view_count ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <p className="text-xs text-(--muted)">30일 클릭</p>
          <p className="mt-1 text-3xl font-bold text-foreground">
            {total30d.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 일별 클릭 바 차트 */}
      <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
        <h2 className="mb-5 text-sm font-semibold text-foreground">일별 링크 클릭</h2>

        {total30d === 0 ? (
          <p className="py-8 text-center text-sm text-(--muted)">
            아직 링크 클릭 데이터가 없어요.
          </p>
        ) : (
          <>
            {/* 바 차트 */}
            <div className="flex items-end gap-0.5 h-28 mb-2" aria-hidden="true">
              {dailyClicks.map((d) => (
                <div
                  key={d.date}
                  title={`${d.label}: ${d.total}회`}
                  className="group relative flex-1 flex flex-col justify-end"
                  style={{ height: "100%" }}
                >
                  <div
                    className="w-full rounded-t bg-foreground opacity-70 group-hover:opacity-100 transition-opacity"
                    style={{ height: `${Math.max((d.total / maxTotal) * 100, d.total > 0 ? 4 : 0)}%` }}
                  />
                  {/* 툴팁 */}
                  {d.total > 0 && (
                    <div className="pointer-events-none absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-0.5 text-[10px] font-semibold text-white group-hover:block z-10">
                      {d.total}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* X축 라벨 (첫날 / 오늘만 표시) */}
            <div className="flex justify-between text-[10px] text-(--muted) mt-1">
              <span>{dailyClicks[0]?.date.slice(5).replace("-", "/")}</span>
              <span>오늘</span>
            </div>
          </>
        )}
      </div>

      {/* 채널별 통계 */}
      <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
        <h2 className="mb-4 text-sm font-semibold text-foreground">채널별 클릭 (30일)</h2>
        <div className="space-y-4">
          {[
            { label: "카카오 문의", value: kakaoSum, color: "bg-yellow-400" },
            { label: "인스타그램",  value: instaSum, color: "bg-pink-500"   },
            { label: "전화 연결",   value: phoneSum,  color: "bg-blue-500"  },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-(--muted)">{label}</span>
                <span className="text-sm font-semibold text-foreground">
                  {value.toLocaleString()}회
                </span>
              </div>
              <div className="h-2 rounded-full bg-(--secondary) overflow-hidden">
                <div
                  className={`h-full rounded-full ${color} transition-all`}
                  style={{ width: total30d > 0 ? `${(value / total30d) * 100}%` : "0%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 최근 7일 상세 표 */}
      <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
        <h2 className="mb-4 text-sm font-semibold text-foreground">최근 7일 상세</h2>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-(--muted) border-b border-gray-100">
                <th className="pb-2 text-left font-medium pl-1">날짜</th>
                <th className="pb-2 text-right font-medium">카카오</th>
                <th className="pb-2 text-right font-medium">인스타</th>
                <th className="pb-2 text-right font-medium">전화</th>
                <th className="pb-2 text-right font-medium pr-1">합계</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dailyClicks.slice(-7).reverse().map((d) => (
                <tr key={d.date} className="text-foreground">
                  <td className="py-2.5 pl-1">{d.label}</td>
                  <td className="py-2.5 text-right">{d.kakao || "—"}</td>
                  <td className="py-2.5 text-right">{d.instagram || "—"}</td>
                  <td className="py-2.5 text-right">{d.phone || "—"}</td>
                  <td className="py-2.5 pr-1 text-right font-semibold">{d.total || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
