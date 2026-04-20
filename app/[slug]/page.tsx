import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfilePage from "@/components/ProfilePage";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { Profile } from "@/lib/types";
import { getUserByUsername } from "@/data/users";

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
      <main className="flex min-h-screen w-full items-cent