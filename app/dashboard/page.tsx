import { redirect } from "next/navigation";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

async function getMyProfile(ownerId: string): Promise<Profile | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) {
    console.error("대시보드 profiles 조회 실패:", error.message);
    return null;
  }
  return data as Profile | null;
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://instalink.vercel.app";

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const profile = await getMyProfile(user.id);

  return (
    <div className="flex flex-col gap-6">
      {/* 인사말 */}
      <div>
        <h1 className="text-xl font-bold text-foreground">
          안녕하세요{profile?.name ? `, ${profile.name}님` : ""}! 👋
        </h1>
        <p className="mt-1 text-sm text-(--muted)">내 InstaLink 페이지를 관리하세요.</p>
      </div>

      {/* 프로필 없는 경우 온보딩 안내 */}
      {!profile && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-6 text-center">
          <p className="text-sm text-(--muted)">아직 페이지가 없습니다.</p>
          <p className="mt-1 text-xs text-(--muted)">
            Supabase 트리거가 자동으로 프로필을 생성합니다.
            <br />
            페이지가 보이지 않으면 로그아웃 후 다시 로그인해보세요.
          </p>
        </div>
      )}

      {/* 내 페이지 카드 */}
      {profile && (
        <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">내 페이지</h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                profile.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-(--muted)"
              }`}
            >
              {profile.is_active ? "공개 중" : "비공개"}
            </span>
          </div>

          <p className="mb-1 text-lg font-bold text-foreground">
            {profile.shop_name || profile.name || "미설정"}
          </p>
          <p className="mb-4 text-sm text-(--muted)">{profile.tagline || "소개글 없음"}</p>

          <div className="flex flex-wrap gap-2">
            <a
              href={`${SITE_URL}/${profile.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80"
            >
              내 페이지 보기 →
            </a>
            {/* 편집 버튼 — 3주차에 활성화 */}
            <span className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-(--muted) cursor-not-allowed">
              편집하기 (준비 중)
            </span>
          </div>
        </div>
      )}

      {/* URL 정보 */}
      {profile && (
        <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <h2 className="mb-3 text-sm font-semibold text-foreground">내 링크</h2>
          <div className="flex items-center gap-2 rounded-xl bg-(--secondary) px-3 py-2.5">
            <span className="flex-1 truncate font-mono text-sm text-foreground">
              {SITE_URL}/{profile.slug}
            </span>
            <span className="shrink-0 text-xs text-(--muted)">복사</span>
          </div>
        </div>
      )}

      {/* 다음 단계 안내 카드 */}
      <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
        <h2 className="mb-3 text-sm font-semibold text-foreground">준비 중인 기능</h2>
        <ul className="flex flex-col gap-2">
          {[
            { label: "프로필 편집", week: "3주차" },
            { label: "서비스·후기 관리", week: "3주차" },
            { label: "구독 결제 (토스페이먼츠)", week: "4주차" },
            { label: "방문자 통계", week: "Phase 2" },
          ].map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between text-sm text-(--muted)"
            >
              <span>{item.label}</span>
              <span className="rounded-full bg-(--secondary) px-2 py-0.5 text-xs">
                {item.week}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
