import Image from "next/image";
import type { Profile } from "@/lib/types";

type ProfilePageProps = {
  profile: Profile;
};

function toInstagramUrl(instagramId: string) {
  const cleaned = instagramId.replace(/^@/, "").trim();
  return `https://instagram.com/${cleaned}`;
}

export default function ProfilePage({ profile }: ProfilePageProps) {
  const instagramHandle = profile.instagram_id.startsWith("@")
    ? profile.instagram_id
    : `@${profile.instagram_id}`;
  const instagramUrl = toInstagramUrl(profile.instagram_id);

  return (
    <section className="rounded-xl p-8 backdrop-blur">
      <div className="flex items-start gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden">
          <Image
            src={profile.image_url ? profile.image_url : "/user_img.svg"}
            alt={profile.name}
            fill
            sizes="96px"
            className="object-cover"
            priority
          />
        </div>
        <div className="profile-header-copy min-w-0 flex-1">
          <p className="profile-brand mb-2 inline-flex px-2 py-1 font-semibold tracking-[0.08em] text-(--third) uppercase">
            {profile.shop_name}
          </p>
          <h1 className="profile-name font-display font-bold leading-none text-foreground">
            {profile.name}
          </h1>
          <p className="profile-role mt-2 font-medium text-(--muted)">
            {profile.tagline}
          </p>
        </div>
      </div>

      {profile.description && (
        <p className="mt-5 text-sm leading-6 text-(--muted) whitespace-pre-line">
          {profile.description}
        </p>
      )}

      {profile.kakao_url && (
        <div className="mt-5">
          <a
            href={profile.kakao_url}
            target="_blank"
            rel="noopener noreferrer"
            className="reserve-button flex min-h-12 w-full items-center justify-center overflow-hidden rounded-xl px-2 text-sm font-semibold text-black! shadow-[0_4px_10px_rgba(17,24,39,0.12)] active:translate-y-px"
            style={{ backgroundColor: "#FEE500" }}
          >
            <span className="reserve-button__content">
              <Image
                src="/kakaosimbol.svg"
                alt=""
                width={18}
                height={18}
                className="h-4.5 w-4.5 shrink-0"
              />
              <Image
                src="/kakaoText.svg"
                alt="Kakao"
                width={74}
                height={18}
                className="h-4.5 w-auto shrink-0"
                style={{ width: "auto" }}
              />
              <span className="text-black! whitespace-nowrap">
                무료 상담 받기 (카카오톡)
              </span>
            </span>
          </a>
        </div>
      )}

      {profile.services.length > 0 && (
        <>
          <div className="my-7 h-px bg-black/20" />
          <section>
            <h2 className="text-base font-bold text-foreground">서비스</h2>
            <ul className="mt-4 space-y-3 ">
              {profile.services.map((service) => (
                <li
                  key={service.name + service.price}
                  className="flex items-start justify-between gap-3 text-base"
                >
                  <span className="font-medium text-foreground">
                    {service.name}
                  </span>
                  <div className="flex flex-col items-end text-right">
                    <span className="font-semibold text-foreground">
                      {service.price}
                    </span>
                    {service.note && (
                      <span className="mt-1 text-xs text-(--muted)">
                        {service.note}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {profile.reviews.length > 0 && (
        <>
          <div className="my-7 h-px bg-black/20" />
          <section>
            <h2 className="text-base font-bold text-foreground">후기</h2>
            <ul className="mt-4 space-y-3 ">
              {profile.reviews.map((review, idx) => (
                <li key={review.author + idx} className="rounded-2xl text-base p-4">
                  <p className="text-left text-sm leading-6 text-(--muted) ">
                    “{review.text}”
                  </p>
                  <p className="mt-2 text-right text-xs font-semibold text-foreground ">
                    {review.author}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <>
        <div className="my-7 h-px bg-black/20" />
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            {profile.hours && (
              <p className="text-sm font-medium text-(--muted)">
                운영시간 : {profile.hours}
              </p>
            )}
            {profile.location && (
              <p className="text-sm font-medium text-(--muted)">
                위치 : {profile.location}
              </p>
            )}
          </div>
          {profile.instagram_id && (
            <div className="flex flex-col items-end gap-2 text-sm font-medium text-(--muted)">
              <div className="inline-flex items-center gap-1 text-sm font-semibold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
                  />
                </svg>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {instagramHandle}
                </a>
              </div>
            </div>
          )}
        </div>
      </>
    </section>
  );
}