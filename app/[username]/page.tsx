import { notFound } from "next/navigation";
import { users } from "@/data/users";
import Profile from "@/components/Profile";

type PageProps = {
  params: {
    username: string;
  };
};

export default async function UsernamePage({ params }: PageProps) {
  const { username } = await params;
  const user = users.find(u => u.username === username);

  if (!user) {
    notFound();
  }

  const isDarkTheme = user.options?.theme === "dark";

  return (
    <main className={`flex min-h-screen w-full flex-col items-center px-4 py-6 sm:px-6 ${isDarkTheme ? "theme-dark bg-[#121212]" : "bg-(--secondary)"}`}>
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-(--card) p-2 shadow-[0_4px_20px_rgba(17,24,39,0.06)] backdrop-blur-sm">
          <Profile
            brandName={user.brandName}
            name={user.name}
            role={user.role}
            intro={user.intro}
            location={user.location}
            availability={user.availability}
            ctaLabel={user.ctaLabel}
            ctaBackgroundColor={user.options?.highlightColor ?? "#FEE500"}
            showReviews={user.options?.showReviews ?? true}
            showLocation={user.options?.showLocation ?? true}
            showEditableFrame={user.options?.showEditableFrame ?? true}
            serviceFooterLabel={user.options?.serviceFooterLabel ?? false}
            instagramUrl={user.instagramUrl}
            instagramHandle={user.instagramHandle}
            imageSrc={user.imageSrc}
            services={user.services}
            reviews={user.reviews}
          />
        </div>
      </div>
    </main>
  );
}
       