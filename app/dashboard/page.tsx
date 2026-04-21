import { redirect } from "next/navigation";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { Profile } from "@/lib/types";
import { PLAN_META } from "@/lib/types";
import CopyLinkButton from "./CopyLinkButton";
import ReferralCard from "./ReferralCard";

type ClickStats = { kakao: number; instagram: number };

async function getClickStats(profileId: string): Promise<ClickStats> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("link_clicks")
    .select("link_type")
    .eq("profile_id", profileId);

  if (error || !data) return { kakao: 0, instagram: 0 };

  return data.reduce(
    (acc, row) => {
      if (row.link_type === "kakao") acc.kakao += 1;
      if (row.link_type === "instagram") acc.instagram += 1;
      return acc;
    },
    { kakao: 0, instagram: 0 },
  );
}

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

  // 프로필 먼저 조회 후, 파생 데이터를 병렬로 조회
  const profile = await getMyProfile(user.id);

  const [clickStats, referralCount] = profile
    ? await Promise.all([
        getClickStats(profile.id),
        getSupabaseServerClient().then((sb) =>
          sb
            .from("referral_events")
            .select("id", { count: "exact", head: true })
            .eq("referrer_id", profile.id)
            .then(({ count }) => count ?? 0)
        ),
      ])
    : [null, 0];

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
          {"view_count" in profile && (
            <p className="mb-1 text-xs text-(--muted)">
              👁 누적 조회수 {(profile as Profile & { view_count: number }).view_count.toLocaleString()}회
            </p>
          )}
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
            <Link
              href="/dashboard/edit"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-foreground hover:bg-(--secondary) transition-colors"
            >
              편집하기
            </Link>
          </div>
        </div>
      )}

      {/* URL 정보 */}
      {profile && (
        <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <h2 className="mb-3 text-sm font-semibold text-foreground">내 링크</h2>
          <CopyLinkButton slug={profile.slug} />
        </div>
      )}

      {/* 클릭 통계 카드 */}
      {profile && clickStats && (
        <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <h2 className="mb-3 text-sm font-semibold text-foreground">링크 클릭 통계</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-(--secondary) p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{clickStats.kakao.toLocaleString()}</p>
              <p className="mt-0.5 text-xs text-(--muted)">카카오 문의</p>
            </div>
            <div className="rounded-xl bg-(--secondary) p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{clickStats.instagram.toLocaleString()}</p>
              <p className="mt-0.5 text-xs text-(--muted)">인스타그램</p>
            </div>
          </div>
        </div>
      )}

      {/* 플랜 카드 */}
      {profile && (
        <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">구독 플랜</h2>
            <Link href="/billing" className="text-xs font-medium text-foreground hover:underline">
              플랜 변경 →
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-white capitalize">
              {profile.plan ?? "free"}
            </span>
            <span className="text-sm text-(--muted)">
              {PLAN_META[profile.plan ?? "free"]?.price === 0
                ? "무료"
                : `${PLAN_META[profile.plan ?? "free"]?.price.toLocaleString()}원/월`}
            </span>
          </div>
          {profile.plan_expires_at && (
            <p className="mt-1.5 text-xs text-(--muted)">
              다음 결제일: {new Date(profile.plan_expires_at).toLocaleDateString("ko-KR")}
            </p>
          )}
          {(!profile.plan || profile.plan === "free") && (
            <Link
              href="/billing"
              className="mt-3 inline-block rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-white hover:opacity-80 transition-opacity"
            >
              업그레이드하기
            </Link>
          )}
        </div>
      )}

      {/* 레퍼럴 카드 */}
      {profile?.referral_code && (
        <ReferralCard
          referralCode={profile.referral_code}
          alreadyUsedCode={!!profile.referred_by}
          referralCount={referralCount}
          siteUrl={SITE_URL}
        />
      )}
    </div>
  );
}
