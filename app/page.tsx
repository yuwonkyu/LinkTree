import { redirect } from "next/navigation";
import Profile from "@/components/Profile";
import { getProfileOptions, getUserByUsername } from "@/data/users";

export default function Home() {
  const user = getUserByUsername("kku");

  if (!user) {
    redirect("/sample");
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
    <main
      className={`kku-home flex min-h-screen w-full flex-col items-center px-4 py-6 sm:px-6 ${themeClass}`}
    >
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
            links={user.links}
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
