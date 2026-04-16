import Image from "next/image";
import type { ProfileOptions, ServiceItem, ReviewItem } from "@/data/mockData";

type ProfileProps = {
  name: string;
  brandName: string;
  role: string;
  intro: string;
  location: string;
  availability: string;
  ctaLabel: string;
  instagramUrl: string;
  instagramUrls?: string[];
  links?: Array<{ label: string; url: string }>;
  instagramHandle: string;
  imageSrc: string;
  services: ServiceItem[];
  reviews: ReviewItem[];
  options: ProfileOptions;
  kakaoUrl?: string;
};

const Profile = ({
  name,
  brandName,
  role,
  intro,
  location,
  availability,
  ctaLabel,
  instagramUrl,
  instagramUrls,
  links,
  instagramHandle,
  imageSrc,
  services,
  reviews,
  options,
  kakaoUrl = "https://open.kakao.com/o/sample",
}: ProfileProps) => {
  // editable-frame 클래스 적용 헬퍼
  const ef = (base: string) =>
    `${options.showEditableFrame ? "editable-frame " : ""}${base}`;

  const socialLinks = instagramUrls?.length ? instagramUrls : [instagramUrl];
  const validLinks = socialLinks.filter(Boolean);
  const toInstagramHandle = (url: string) => {
    const match = url.match(/instagram\.com\/([^/?#]+)/i);
    return match?.[1] ? `@${match[1]}` : instagramHandle;
  };
  const toThreadsHandle = (url: string) => {
    const match = url.match(/threads\.com\/@?([^/?#]+)/i);
    return match?.[1] ? `@${match[1]}` : "@threads";
  };
  const getSocialMeta = (url: string) => {
    if (/threads\.com/i.test(url)) {
      return {
        type: "threads" as const,
        handle: toThreadsHandle(url),
      };
    }

    return {
      type: "instagram" as const,
      handle: toInstagramHandle(url),
    };
  };

  const hasCTAData = Boolean(ctaLabel && kakaoUrl);
  const hasServicesData = services.length > 0;
  const hasReviewsData = reviews.length > 0;
  const validExternalLinks = (links ?? []).filter((link) =>
    Boolean(link?.label && link?.url),
  );
  const hasInstagramData = validLinks.length > 0;
  const hasExternalLinksData = validExternalLinks.length > 0;
  const hasLocationData = Boolean(location || availability);

  const showCTA = (options.showCTA ?? true) && hasCTAData;
  const showServices = (options.showServices ?? true) && hasServicesData;
  const showReviews = (options.showReviews ?? true) && hasReviewsData;
  const showExternalLinks =
    (options.showExternalLinks ?? true) && hasExternalLinksData;
  const showInstagram = (options.showInstagram ?? true) && hasInstagramData;
  const showLocation = (options.showLocation ?? true) && hasLocationData;

  return (
    <section className="rounded-xl p-8 backdrop-blur">
      <div className="flex items-start gap-4">
        <div className={ef("relative h-24 w-24 shrink-0 overflow-hidden")}>
          <Image
            src={imageSrc ? imageSrc : "/user_img.svg"}
            alt={name}
            fill
            sizes="96px"
            className="object-cover"
            priority
          />
        </div>
        <div className="profile-header-copy min-w-0 flex-1">
          <p
            className={ef(
              "profile-brand mb-2 inline-flex px-2 py-1 font-semibold tracking-[0.08em] text-(--third) uppercase",
            )}
          >
            {brandName}
          </p>
          <h1
            className={ef(
              "profile-name font-display font-bold leading-none text-foreground",
            )}
          >
            {name}
          </h1>
          <p className={ef("profile-role mt-2 font-medium text-(--muted)")}>
            {role}
          </p>
        </div>
      </div>

      <p
        className={ef(
          "mt-5 text-sm leading-6 text-(--muted) whitespace-pre-line",
        )}
      >
        {intro}
      </p>

      {showCTA && (
        <div className="mt-5">
          <a
            href={kakaoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="reserve-button flex min-h-12 w-full items-center justify-center overflow-hidden rounded-xl px-2 text-sm font-semibold text-black! shadow-[0_4px_10px_rgba(17,24,39,0.12)] active:translate-y-px"
            style={{ backgroundColor: options.highlightColor }}
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
              <span className="text-black! whitespace-nowrap">{ctaLabel}</span>
            </span>
          </a>
        </div>
      )}

      {showServices && (
        <>
          <div className="my-7 h-px bg-black/20" />
          <section className={ef("")}>
            <h2 className="text-base font-bold text-foreground">서비스</h2>
            <ul className="mt-4 space-y-3 ">
              {services.map((service) => (
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
            {options.serviceFooterLabel && (
              <p className="mt-3 text-right text-xs text-(--muted)">
                {options.serviceFooterLabel}
              </p>
            )}
          </section>
        </>
      )}

      {showExternalLinks && (
        <>
          <div className="my-7 h-px bg-black/20" />
          <div
            className={`text-foreground flex flex-col gap-2 ${ef("text-sm font-medium text-(--muted)")}`}
          >
            {validExternalLinks.map((link, idx) => (
              <div
                key={`${link.url}-${idx}`}
                className="inline-flex items-center gap-1 text-sm font-semibold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M10.59 13.41a1.996 1.996 0 0 0 2.82 0l3.59-3.59a2 2 0 0 0-2.83-2.82l-1.29 1.29a1 1 0 1 0 1.41 1.41l1.3-1.29a.001.001 0 0 1 .01 0a.001.001 0 0 1 0 .01l-3.59 3.59a.001.001 0 0 1-.01 0a1 1 0 1 0-1.41 1.41m2.82-2.82a1 1 0 0 0-1.41 0l-1.29 1.29a1 1 0 1 0 1.41 1.41l1.29-1.29a1 1 0 0 0 0-1.41m-3-3a1.996 1.996 0 0 0-2.82 0L4 11.17a2 2 0 1 0 2.83 2.82l1.29-1.29a1 1 0 1 0-1.41-1.41l-1.3 1.29a.001.001 0 0 1-.01 0a.001.001 0 0 1 0-.01l3.59-3.59a.001.001 0 0 1 .01 0a1 1 0 0 0 1.41-1.41"
                  />
                </svg>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {link.label}
                </a>
              </div>
            ))}
          </div>
        </>
      )}

      {showReviews && (
        <>
          <div className="my-7 h-px bg-black/20" />
          <section className={ef("")}>
            <h2 className="text-base font-bold text-foreground">후기</h2>
            <ul className="mt-4 space-y-3 ">
              {reviews.map((review, idx) => (
                <li
                  key={review.author + idx}
                  className="rounded-2xl text-base   p-4"
                >
                  <p className="text-left text-sm leading-6 text-(--muted) ">
                    “{review.content}”
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

      {(showLocation || showInstagram) && (
        <>
          <div className="my-7 h-px bg-black/20" />
          <div className="flex items-center justify-between gap-4">
            {showLocation && (
              <div className="flex flex-col gap-0.5">
                {availability && (
                  <p className={ef("text-sm font-medium text-(--muted)")}>
                    운영시간 : {availability}
                  </p>
                )}
                {location && (
                  <p className={ef("text-sm font-medium text-(--muted)")}>
                    위치 : {location}
                  </p>
                )}
              </div>
            )}
            {showInstagram && (
              <div
                className={`text-foreground flex flex-col items-end gap-2 ${ef("text-sm font-medium text-(--muted)")}`}
              >
                {validLinks.map((url, idx) => {
                  const social = getSocialMeta(url);

                  return (
                    <div
                      key={`${url}-${idx}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold"
                    >
                      {social.type === "threads" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 192 192"
                        >
                          <path
                            fill="currentColor"
                            d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"
                          />
                        </svg>
                      ) : (
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
                      )}
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {social.handle}
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default Profile;
