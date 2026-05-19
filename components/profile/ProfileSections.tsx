import Image from "next/image";
import type { Profile } from "@/lib/types";
import { formatReviewDate } from "@/lib/profile-utils";

type Limits = { gallery: number; services: number; reviews: number };

type Props = {
  profile: Profile;
  limits: Limits;
  sectionOrder: string[];
  gridCols: string;
  imgSizes: string;
  setLightboxIdx: (idx: number) => void;
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-(--muted)">
      {children}
    </h2>
  );
}

function Divider() {
  return <div className="my-6 h-px bg-black/20" />;
}

export default function ProfileSections({
  profile, limits, sectionOrder, gridCols, imgSizes, setLightboxIdx,
}: Props) {
  return (
    <>
      {sectionOrder.map((sectionKey) => {
        if (sectionKey === "gallery") {
          if (!profile.gallery || profile.gallery.length === 0) return null;
          const visibleGallery =
            limits.gallery === Infinity
              ? profile.gallery
              : profile.gallery.slice(0, limits.gallery);
          const hiddenGallery = Math.max(0, profile.gallery.length - visibleGallery.length);
          return (
            <div key="gallery">
              <Divider />
              <section>
                <SectionLabel>포트폴리오 · 갤러리</SectionLabel>
                <div className={`grid ${gridCols} gap-1.5`}>
                  {visibleGallery.map((img, idx) => (
                    <button
                      key={img.url + idx}
                      type="button"
                      onClick={() => setLightboxIdx(idx)}
                      className="relative aspect-square overflow-hidden rounded-xl bg-black/[0.035] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                    >
                      <Image
                        src={img.url}
                        alt={img.caption ?? `갤러리 ${idx + 1}`}
                        fill
                        sizes={imgSizes}
                        className="object-cover transition-transform hover:scale-105"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
                {hiddenGallery > 0 && (
                  <p className="mt-3 text-center text-xs text-(--muted)">
                    사진 {hiddenGallery}장이 더 있습니다
                  </p>
                )}
              </section>
            </div>
          );
        }

        if (sectionKey === "services") {
          if (!profile.services || profile.services.length === 0) return null;
          const visibleServices =
            limits.services === Infinity
              ? profile.services
              : profile.services.slice(0, limits.services);
          const hiddenServices = Math.max(0, profile.services.length - visibleServices.length);
          return (
            <div key="services">
              <Divider />
              <section>
                <SectionLabel>서비스 &amp; 가격</SectionLabel>
                <ul className="space-y-2">
                  {visibleServices.map((service) => (
                    <li
                      key={service.name + service.price}
                      className="flex items-center justify-between gap-3 rounded-xl bg-black/[0.035] px-4 py-3"
                    >
                      <span className="text-sm font-medium text-foreground">{service.name}</span>
                      <div className="flex flex-col items-end text-right">
                        <span className="text-sm font-bold text-foreground">{service.price}</span>
                        {service.note && (
                          <span className="mt-0.5 text-[11px] text-(--muted)">{service.note}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                {hiddenServices > 0 && (
                  <p className="mt-3 text-center text-xs text-(--muted)">
                    서비스 {hiddenServices}개가 더 있습니다
                  </p>
                )}
              </section>
            </div>
          );
        }

        if (sectionKey === "reviews") {
          if (!profile.reviews || profile.reviews.length === 0) return null;
          const visibleReviews =
            limits.reviews === Infinity
              ? profile.reviews
              : profile.reviews.slice(0, limits.reviews);
          const hiddenReviews = Math.max(0, profile.reviews.length - visibleReviews.length);
          return (
            <div key="reviews">
              <Divider />
              <section>
                <SectionLabel>고객 후기</SectionLabel>
                <ul className="space-y-2">
                  {visibleReviews.map((review, idx) => (
                    <li
                      key={review.author + idx}
                      className="rounded-xl bg-black/[0.035] px-4 py-4"
                    >
                      <p className="text-sm leading-6 text-foreground">
                        &#8220;{review.text}&#8221;
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="text-[11px] font-semibold text-(--muted)">— {review.author}</p>
                        {review.date && (
                          <p className="shrink-0 text-[10px] text-(--muted) opacity-70">
                            {formatReviewDate(review.date)}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                {hiddenReviews > 0 && (
                  <p className="mt-3 text-center text-xs text-(--muted)">
                    후기 {hiddenReviews}개가 더 있습니다
                  </p>
                )}
                <div className="mt-4">
                  <a
                    href={`/${profile.slug}/review`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-(--muted)/25 bg-(--secondary) py-3 text-sm font-semibold text-foreground transition-colors hover:opacity-80 active:scale-[0.99]"
                  >
                    ✍️ 후기 남기기
                  </a>
                </div>
              </section>
            </div>
          );
        }

        return null;
      })}
    </>
  );
}
