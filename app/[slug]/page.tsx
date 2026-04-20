import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfilePage from "@/components/ProfilePage";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { Profile } from "@/lib/types";
import { getUserByUsername } from "@/data/users";
import ShareButton from "./ShareButton";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getProfileBySlug(slug: string): Promise<Profile | null> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      return data as Profile;
    }
  } catch {
    // DB 미구성 초기 단계에서는 아래 로컬 폴백을 사용합니다.
  }

  const localUser = getUserByUsername(slug);
  if (!localUser) {
    return null;
  }

  return {
    id: `local-${localUser.username}`,
    slug: localUser.username,
    owner_id: "local-owner",
    name: localUser.name,
    shop_name: localUser.brandName,
    tagline: localUser.role,
    description: localUser.intro,
    kakao_url: localUser.kakaoUrl ?? "",
    instagram_id: localUser.instagramHandle,
    location: localUser.location,
    hours: localUser.availability,
    image_url: localUser.imageSrc,
    services: localUser.services.map((service) => ({
      name: service.name,
      price: service.price,
      note: service.note,
    })),
    reviews: localUser.reviews.map((review) => ({
      text: review.content,
      author: review.author,
    })),
    is_active: true,
    created_at: new Date().toISOString(),
    theme: localUser.options?.theme,
  } as Profile;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://instalink.vercel.app";

  const title = profile ? `${profile.name} — ${profile.shop_name}` : slug;
  const description = profile?.tagline ?? "인스타 프로필 링크 페이지";
  const imageUrl = profile ? `${SITE}/${slug}/opengraph-image` : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE}/${slug}`,
    },
    openGraph: {
      type: "website",
      url: `${SITE}/${slug}`,
      title: profile?.name ?? slug,
      description,
      images: imageUrl ? [imageUrl] : [],
      siteName: "InstaLink",
    },
    twitter: {
      card: "summary_large_image",
      title: profile?.name ?? slug,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://instalink.vercel.app";

  // 조회수 증가 (비동기, 페이지 렌더링 블로킹 없음)
  if (profile?.is_active) {
    const supabase = await getSupabaseServerClient();
    supabase.rpc("increment_view_count", { profile_slug: slug }).then(() => {});
  }

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

  const themeClass = profile.theme && profile.theme !== "light" ? `theme-${profile.theme}` : "";

  return (
    <main
      className={`flex min-h-screen w-full flex-col items-center bg-(--secondary) px-4 py-6 sm:px-6 ${themeClass}`}
    >
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-(--card) p-2 shadow-[0_4px_20px_rgba(17,24,39,0.06)] backdrop-blur-sm">
          <ProfilePage profile={profile} />
        </div>
        <div className="mt-3">
          <ShareButton url={`${SITE}/${slug}`} />
        </div>
      </div>
    </main>
  );
}