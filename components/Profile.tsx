import Image from "next/image";
import type { ReviewItem, ServiceItem } from "@/data/mockData";

type ProfileProps = {
  brandName: string;
  name: string;
  role: string;
  intro: string;
  location: string;
  availability: string;
  ctaLabel: string;
  ctaBackgroundColor: string;
  showReviews: boolean;
  showLocation: boolean;
  showEditableFrame: boolean;
  serviceFooterLabel: string | false;
  instagramUrl: string;
  instagramHandle: string;
  imageSrc: string;
  services: ServiceItem[];
  reviews: ReviewItem[];
  kakaoUrl?: string;
};

export default function Profile({
  brandName,
  name,
  role,
  intro,
  location,
  availability,
  ctaLabel,
  ctaBackgroundColor,
  showReviews,
  showLocation,
  showEditableFrame,
  serviceFooterLabel,
  instagramUrl,
  instagramHandle,
  imageSrc,
  services,
  reviews,
  kakaoUrl = "https://open.kakao.com/o/sample",
}: ProfileProps) {
  // editable-frame 클래스 적용 헬퍼
  const ef = (base: string) => `${showEditableFrame ? "editable-frame " : ""}${base}`;

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
          <p className={ef("profile-brand mb-2 inline-flex px-2 py-1 font-semibold tracking-[0.08em] text-(--third) uppercase")}>{brandName}</p>
          <h1 className={ef("profile-name font-display font-bold leading-none text-foreground")}>{name}</h1>
          <p className={ef("profile-role mt-2 font-medium text-(--muted)")}>{role}</p>
        </div>
      </div>

      <p className={ef("mt-5 text-sm leading-6 text-(--muted) whitespace-pre-line")}>{intro}</p>

      <div className="mt-5">
        <a
          href={kakaoUrl}
          target="_blank"
          rel="noreferrer"
          className="reserve-button flex min-h-12 w-full items-center justify-center overflow-hidden rounded-xl px-2 text-sm font-semibold text-black! shadow-[0_4px_10px_rgba(17,24,39,0.12)] active:translate-y-px"
          style={{ backgroundColor: ctaBackgroundColor }}
        >
          <span className="reserve-button__content">
            <Image src="/kakaosimbol.svg" alt="" width={18} height={18} className="h-4.5 w-4.5 shrink-0" />
            <Image src="/kakaoText.svg" alt="Kakao" width={74} height={18} className="h-4.5 w-auto shrink-0" style={{ width: "auto" }} />
            <span className="text-black! whitespace-nowrap">{ctaLabel}</span>
          </span>
        </a>
      </div>

      <div className="my-7 h-px bg-black/20" />

      <section className={ef("")}>
        <h2 className="text-base font-bold text-foreground">서비스</h2>
        <ul className="mt-4 space-y-3">
          {services.map((service) => (
            <li
              key={service.name + service.price}
              className="flex items-center justify-between gap-3 text-base"
            >
              <span className="font-medium text-foreground">{service.name}</span>
              <span className="font-semibold text-foreground">{service.price}</span>
            </li>
          ))}
        </ul>
        {serviceFooterLabel && (
          <p className="mt-3 text-right text-xs text-(--muted)">{serviceFooterLabel}</p>
        )}
      </section>

      {showReviews && (
        <>
          <div className="my-7 h-px bg-black/20" />
          <section className={ef("")}>
            <h2 className="text-base font-bold text-foreground">후기</h2>
            <ul className="mt-4 space-y-3 ">
              {reviews.map((review, idx) => (
                <li key={review.author + idx} className="rounded-2xl text-base   p-4">
                  <p className="text-left text-sm leading-6 text-(--muted) ">“{review.content}”</p>
                  <p className="mt-2 text-right text-xs font-semibold text-foreground ">{review.author}</p>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {showLocation && (
        <>
          <div className="my-7 h-px bg-black/20" />
          <p className={ef("text-sm font-medium text-(--muted) mt-0.5")}>운영시간 : {availability}</p>
          <p className={ef("text-sm font-medium text-(--muted)")}>위치 : {location}</p>
        </>
      )}

      <div className="text-foreground flex items-center gap-2 mt-6">
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className=" inline-flex items-center gap-1 text-sm font-semibold hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"/></svg>
          <span>{instagramHandle}</span>
        </a>
      </div>
    </section>
  );
}
