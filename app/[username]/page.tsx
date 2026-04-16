import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfileOptions, getUserByUsername } from "@/data/users";
import Profile from "@/components/Profile";

type PageProps = {
  params: Promise<{
    username: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const user = getUserByUsername(username);

  if (!user) {
    return {
      title: "프로필을 찾을 수 없음",
      description: "요청하신 트레이너 프로필이 존재하지 않습니다.",
    };
  }

  const title = `${user.name} | ${user.brandName}`;
  const description = user.ctaLabel ? `${user.role} · ${user.ctaLabel}` : user.role;
  const pageUrl = `/${user.username}`;
  const shareImage = user.ogImageSrc || user.imageSrc || "/sampleop.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: `${user.name} 프로필 이미지`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
  };
}

export default async function UsernamePage({ params }: PageProps) {
  const { username } = await params;
  const user = getUserByUsername(username);

  if (!user) {
    notFound();
  }

  const options = getProfileOptions(user);
  const themeClass =
    options.theme === "dark"
      ? "theme-dark bg-[#121212]"
      : options.theme === "ucc"
        ? "theme-ucc"
        : options.theme === "softsage"
          ? "theme-softsage"
          : options.theme === "warmlinen"
            ? "theme-warmlinen"
              : options.theme === "energysteel"
                ? "theme-energysteel"
        : "bg-(--secondary)";

  return (
    <main className={`flex min-h-screen w-full flex-col items-center px-4 py-6 sm:px-6 ${themeClass}`}>
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-(--card) p-2 shadow-[0_4px_20px_rgba(17,24,39,0.06)] backdrop-blur-sm">
          <Profile
            name={user.name}
            brandName={user.brandName}
            role={user.role}
            intro={user.intro}
            location={user.location}
            availability={user.availability}
            ctaLabel={user.ctaLabel}
            instagramUrl={user.instagramUrl}
            instagramUrls={user.instagramUrls}
            instagramHandle={user.instagramHandle}
            kakaoUrl={user.kakaoUrl}
            imageSrc={user.imageSrc}
            services={user.services}
            reviews={user.reviews}
            options={options}
          />
        </div>
      </div>
    </main>
  );
}
