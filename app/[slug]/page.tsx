import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfilePage from "@/components/ProfilePage";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getProfileBySlug(slug: string): Promise<Profile | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("profiles 조회 실패:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  return data as Profile;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);

  if (!profile) {
    return {
      title: "프로필을 찾을 수 없음",
      description: "요청하신 페이지가 존재하지 않습니다.",
    };
  }

  if (!profile.is_active) {
    return {
      title: `${profile.shop_name} | 서비스 준비 중`,
      description: "현재 서비스 준비 중입니다.",
    };
  }

  return {
    title: `${profile.name} | ${profile.shop_name}`,
    description: profile.tagline || profile.description || "인스타 프로필 랜딩페이지",
    openGraph: {
      title: `${profile.name} | ${profile.shop_name}`,
      description: profile.tagline || profile.description || "인스타 프로필 랜딩페이지",
      images: profile.image_url
        ? [
            {
              url: profile.image_url,
              alt: `${profile.name} 프로필 이미지`,
            },
          ]
        : undefined,
    },
  };
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  if (!profile.is_active) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-(--secondary) px-4 py-6 sm:px-6">
        <div className="w-full max-w-md rounded-2xl bg-(--card) p-8 text-center shadow-[0_4px_20px_rgba(17,24,39,0.06)] backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-foreground">서비스 준비 중</h1>
          <p className="mt-3 text-sm text-(--muted)">
            현재 페이지는 활성화되지 않았습니다. 잠시 후 다시 확인해주세요.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-(--secondary) px-4 py-6 sm:px-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-(--card) p-2 shadow-[0_4px_20px_rgba(17,24,39,0.06)] backdrop-blur-sm">
          <ProfilePage profile={profile} />
        </div>
      </div>
    </main>
  );
}