import Section from "@/components/edit/Section";
import GalleryManager from "@/components/dashboard/GalleryManager";
import ReviewManager from "@/components/dashboard/ReviewManager";
import type { GalleryImage, Review } from "@/lib/types";

export type ContentTabProps = {
  gallery: GalleryImage[];
  setGallery: (v: GalleryImage[]) => void;
  galleryLimit?: number;
  reviews: Review[];
  setReviews: (v: Review[]) => void;
  reviewsLimit?: number;
  profileSlug?: string;
};

export default function ContentTab({
  gallery, setGallery, galleryLimit,
  reviews, setReviews, reviewsLimit,
  profileSlug,
}: ContentTabProps) {
  return (
    <>
      <Section title="포트폴리오 · 갤러리 (선택)">
        <GalleryManager images={gallery} onChange={setGallery} limit={galleryLimit} />
      </Section>

      <Section title="고객 후기">
        <ReviewManager
          reviews={reviews}
          onChange={setReviews}
          limit={reviewsLimit}
          reviewUrl={profileSlug ? `/${profileSlug}/review` : undefined}
        />
      </Section>
    </>
  );
}
