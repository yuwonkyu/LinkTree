import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase";

type PublicProfile = {
  slug: string;
  shop_name: string;
  tagline: string;
  is_active: boolean;
};

async function getActiveProfiles(): Promise<PublicProfile[]> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("slug, shop_name, tagline, is_active")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(12);

    if (error || !data) {
      return [];
    }

    return data as PublicProfile[];
  } catch {
    return [];
  }
}

export default async function Page() {
  const profiles = await getActiveProfiles();

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-(--secondary) px-4 py-6 sm:px-6">
      <div className="w-full max-w-2xl rounded-2xl bg-(--card) p-6 shadow-[0_4px_20px_rgba(17,24,39,0.06)] backdrop-blur-sm sm:p-8">
        <h1 className="text-2xl font-bold text-foreground">InstaLink</h1>
        <p className="mt-2 text-sm text-(--muted)">
          공개된 프로필 페이지 목록입니다. 원하는 페이지를 선택해 이동하세요.
        </p>

        {profiles.length > 0 ? (
          <ul className="mt-6 space-y-3">
            {profiles.map((profile) => (
              <li key={profile.slug}>
                <Link
                  href={`/${profile.slug}`}
                  className="block rounded-xl border border-(--line) px-4 py-3 transition hover:bg-white/50"
                >
                  <p className="text-sm font-semibold text-foreground">{profile.shop_name}</p>
                  <p className="mt-1 text-xs text-(--muted)">{profile.tagline}</p>
                  <p className="mt-2 text-xs text-blue-600">/{profile.slug}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-(--line) p-4 text-sm text-(--muted)">
            아직 공개된 프로필이 없습니다. 먼저 Supabase SQL을 실행한 뒤
            <span className="mx-1 font-medium text-foreground">sample-gym</span>
            데이터를 생성해 주세요.
            <div className="mt-3">
              <Link href="/sample-gym" className="text-blue-600 underline">
                /sample-gym 바로가기 시도
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
