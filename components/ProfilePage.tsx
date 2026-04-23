"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { Profile } from "@/lib/types";
import { PLAN_LIMITS, toPlanKey } from "@/lib/plan-limits";

type ProfilePageProps = {
  profile: Profile;
  showWatermark?: boolean;
};

function toInstagramUrl(instagramId: string) {
  const cleaned = instagramId.replace(/^@/, "").trim();
  return `https://instagram.com/${cleaned}`;
}

function trackClick(profileId: string, linkType: "kakao" | "instagram" | "phone") {
  fetch("/api/track/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileId, linkType }),
  }).catch(() => {});
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-(--muted)">
      {children}
    </h2>
  );
}

function IconParking() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </svg>
  );
}

// "2025-03" → "2025년 3월"
function formatReviewDate(d: string) {
  const [y, m] = d.split("-");
  if (!y || !m) return d;
  return `${y}년 ${parseInt(m)}월`;
}

function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" />
    </svg>
  );
}

const DEFAULT_SECTION_ORDER = ["services", "gallery", "reviews"];

export default function ProfilePage({ profile, showWatermark = false }: ProfilePageProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const sectionOrder: string[] =
    Array.isArray(profile.section_order) && profile.section_order.length > 0
      ? profile.section_order
      : DEFAULT_SECTION_ORDER;

  // Pro 버튼 컬러: 커스텀 링크 + 전화 버튼 accent
  const btnColor = profile.button_color?.trim() || null;

  // 플랜별 공개 표시 제한
  const planKey = toPlanKey(profile.plan);
  const limits  = PLAN_LIMITS[planKey];

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);

  // 라이트박스 열릴 때 body 스크롤 잠금 + ESC 키 닫기
  useEffect(() => {
    if (lightboxIdx === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeLightbox(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIdx, closeLightbox]);

  const instagramHandle = profile.instagram_id.startsWith("@")
    ? profile.instagram_id
    : `@${profile.instagram_id}`;
  const instagramUrl = toInstagramUrl(profile.instagram_id);

  const hasCta =
    profile.kakao_url ||
    profile.kakao_booking_url ||
    profile.naver_booking_url ||
    profile.phone_url ||
    profile.instagram_dm_url ||
    profile.kakao_channel_url;

  return (
    <section className="rounded-xl p-6 backdrop-blur sm:p-8">

      {/* ── 프로필 헤더 ── */}
      <div className="flex items-center gap-4">
        <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full ring-2 ring-black/8 sm:h-20 sm:w-20">
          <Image
            src={profile.image_url || "/user_img.svg"}
            alt={profile.name}
            fill
            sizes="(max-width: 640px) 72px, 80px"
            quality={90}
            className="object-cover"
            priority
          />
        </div>
        <div className="profile-header-copy min-w-0 flex-1 overflow-hidden">
          <p className="profile-brand mb-1 inline-flex px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] text-(--third) uppercase">
            {profile.shop_name}
          </p>
          <h1 className="profile-name font-display font-bold leading-tight text-foreground break-words">
            {profile.name}
          </h1>
          <p className="profile-role mt-1 font-medium text-(--muted) break-words">
            {profile.tagline}
          </p>
        </div>
      </div>

      {/* ── 예약 상태 배지 ── */}
      {profile.is_available === false && (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          현재 예약 마감
        </div>
      )}
      {profile.is_available === true && (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          예약 가능
        </div>
      )}

      {/* ── 소개 ── */}
      {profile.description && (
        <p className="mt-5 rounded-xl bg-black/[0.035] px-4 py-3.5 text-sm leading-6 text-(--muted) whitespace-pre-line break-words">
          {profile.description}
        </p>
      )}

      {/* ── CTA 버튼 ── 순서: 카카오 계열 → 네이버 → 인스타 → 전화 */}
      {hasCta && (
        <div className="mt-5 flex flex-col gap-2">
          {/* 카카오 예약 */}
          {profile.kakao_booking_url && (
            <a
              href={profile.kakao_booking_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(profile.id, "kakao")}
              className="flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-2 text-sm font-semibold shadow-[0_4px_14px_rgba(17,24,39,0.14)] active:translate-y-px"
              style={{ backgroundColor: "#FEE500", color: "#000" }}
            >
              <Image src="/kakaosimbol.svg" alt="" width={18} height={18} className="h-4.5 w-4.5 shrink-0" />
              <span className="whitespace-nowrap">카카오로 예약하기</span>
            </a>
          )}
          {/* 카카오 오픈채팅 상담 */}
          {profile.kakao_url && (
            <a
              href={profile.kakao_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(profile.id, "kakao")}
              className="reserve-button flex min-h-12 w-full items-center justify-center overflow-hidden rounded-xl px-2 text-sm font-semibold shadow-[0_4px_14px_rgba(17,24,39,0.14)] active:translate-y-px"
              style={{ backgroundColor: "#FEE500", color: "#000" }}
            >
              <span className="reserve-button__content">
                <Image src="/kakaosimbol.svg" alt="" width={18} height={18} className="h-4.5 w-4.5 shrink-0" />
                <Image
                  src="/kakaoText.svg"
                  alt="Kakao"
                  width={74}
                  height={18}
                  className="h-4.5 w-auto shrink-0"
                  style={{ width: "auto" }}
                />
                <span className="whitespace-nowrap">무료 상담 받기 (카카오톡)</span>
              </span>
            </a>
          )}
          {/* 카카오채널 */}
          {profile.kakao_channel_url && (
            <a
              href={profile.kakao_channel_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-2 text-sm font-semibold shadow-[0_4px_14px_rgba(17,24,39,0.14)] active:translate-y-px"
              style={{ backgroundColor: "#FEE500", color: "#000" }}
            >
              <Image src="/kakaosimbol.svg" alt="" width={18} height={18} className="h-4.5 w-4.5 shrink-0" />
              <span className="whitespace-nowrap">카카오채널 문의</span>
            </a>
          )}
          {/* 네이버 예약 */}
          {profile.naver_booking_url && (
            <a
              href={profile.naver_booking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-2 text-sm font-semibold shadow-[0_4px_14px_rgba(17,24,39,0.14)] active:translate-y-px"
              style={{ backgroundColor: "#03C75A", color: "#fff" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" fill="#fff" />
              </svg>
              <span className="whitespace-nowrap">네이버로 예약하기</span>
            </a>
          )}
          {/* 인스타그램 DM */}
          {profile.instagram_dm_url && (
            <a
              href={profile.instagram_dm_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-2 text-sm font-semibold shadow-[0_4px_14px_rgba(17,24,39,0.14)] active:translate-y-px"
              style={{ background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", color: "#fff" }}
            >
              <IconInstagram />
              <span className="whitespace-nowrap">인스타그램 DM 보내기</span>
            </a>
          )}
          {/* 전화 연결 */}
          {profile.phone_url && (
            <a
              href={`tel:${profile.phone_url.replace(/[^0-9+]/g, "")}`}
              onClick={() => trackClick(profile.id, "phone")}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-2 text-sm font-semibold shadow-[0_4px_14px_rgba(17,24,39,0.08)] active:translate-y-px"
              style={btnColor
                ? { backgroundColor: btnColor, color: "#fff", border: "none" }
                : { backgroundColor: "#fff", color: "#111827", border: "1px solid rgba(0,0,0,0.1)" }
              }
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.48 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.86a16 16 0 0 0 6 6l.92-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className="whitespace-nowrap">전화 연결 {profile.phone_url}</span>
            </a>
          )}
        </div>
      )}

      {/* ── 추가 링크 ── */}
      {profile.custom_links && profile.custom_links.length > 0 && (() => {
        const FREE_LINK_LIMIT = 2;
        const isFree = !profile.plan || profile.plan === "free";
        const visibleLinks = isFree
          ? profile.custom_links!.slice(0, FREE_LINK_LIMIT)
          : profile.custom_links!;
        const hiddenCount = isFree
          ? Math.max(0, profile.custom_links!.length - FREE_LINK_LIMIT)
          : 0;
        return (
          <div className={`relative z-10 flex flex-col gap-2 ${hasCta ? "mt-6" : "mt-5"}`}>
            {visibleLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors active:translate-y-px"
                style={btnColor
                  ? { backgroundColor: btnColor, color: "#fff", border: "none" }
                  : { backgroundColor: "#fff", color: "#111827", border: "1px solid rgba(0,0,0,0.1)" }
                }
              >
                🔗 {link.label}
              </a>
            ))}
            {hiddenCount > 0 && (
              <div className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-black/10 py-3 text-xs text-(--muted)">
                <span>🔒</span>
                <span>링크 {hiddenCount}개 더 보려면 업그레이드가 필요합니다</span>
              </div>
            )}
          </div>
        );
      })()}

      {/* ── 동적 섹션 순서: 서비스 · 갤러리 · 후기 ── */}
      {sectionOrder.map((sectionKey) => {
        if (sectionKey === "gallery") {
          // Free: 갤러리 전체 숨김
          if (limits.gallery === 0) return null;
          if (!profile.gallery || profile.gallery.length === 0) return null;
          const visibleGallery = limits.gallery === Infinity
            ? profile.gallery
            : profile.gallery.slice(0, limits.gallery);
          const hiddenGallery  = Math.max(0, profile.gallery.length - visibleGallery.length);
          return (
            <div key="gallery">
              <div className="my-6 h-px bg-black/20" />
              <section>
                <SectionLabel>포트폴리오 · 갤러리</SectionLabel>
                <div className="grid grid-cols-3 gap-1.5">
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
                        sizes="(max-width: 480px) 30vw, 150px"
                        className="object-cover transition-transform hover:scale-105"
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
          const visibleServices = limits.services === Infinity
            ? profile.services
            : profile.services.slice(0, limits.services);
          const hiddenServices  = Math.max(0, profile.services.length - visibleServices.length);
          return (
            <div key="services">
              <div className="my-6 h-px bg-black/20" />
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
          const visibleReviews = limits.reviews === Infinity
            ? profile.reviews
            : profile.reviews.slice(0, limits.reviews);
          const hiddenReviews  = Math.max(0, profile.reviews.length - visibleReviews.length);
          return (
            <div key="reviews">
              <div className="my-6 h-px bg-black/20" />
              <section>
                <SectionLabel>고객 후기</SectionLabel>
                <ul className="space-y-2">
                  {visibleReviews.map((review, idx) => (
                    <li key={review.author + idx} className="rounded-xl bg-black/[0.035] px-4 py-4">
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
              </section>
            </div>
          );
        }

        return null;
      })}

      {/* 라이트박스 — 배경 클릭·ESC로 닫힘, 뒤 스크롤 잠금 */}
      {lightboxIdx !== null && profile.gallery && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4"
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute -right-1 -top-10 z-10 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/25"
              aria-label="닫기"
            >
              ✕ 닫기
            </button>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src={profile.gallery[lightboxIdx].url}
                alt={profile.gallery[lightboxIdx].caption ?? ""}
                fill
                sizes="480px"
                className="object-contain"
                priority
              />
            </div>
            {profile.gallery[lightboxIdx].caption && (
              <p className="mt-2 text-center text-sm text-white/80">
                {profile.gallery[lightboxIdx].caption}
              </p>
            )}
            {profile.gallery.length > 1 && (
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIdx((i) =>
                      i !== null && i > 0 ? i - 1 : profile.gallery!.length - 1
                    )
                  }
                  className="rounded-full bg-white/20 px-4 py-2 text-sm text-white hover:bg-white/30"
                >
                  ‹ 이전
                </button>
                <span className="text-xs text-white/60">
                  {lightboxIdx + 1} / {profile.gallery.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIdx((i) =>
                      i !== null && i < profile.gallery!.length - 1 ? i + 1 : 0
                    )
                  }
                  className="rounded-full bg-white/20 px-4 py-2 text-sm text-white hover:bg-white/30"
                >
                  다음 ›
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 운영정보 ── */}
      {(profile.hours || profile.location || profile.parking_info || profile.instagram_id) && (
        <>
          <div className="my-6 h-px bg-black/20" />
          <div className="space-y-2.5">
            {profile.hours && (
              <div className="flex items-center gap-2 text-sm text-(--muted)">
                <IconClock />
                <span>{profile.hours}</span>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center gap-2 text-sm text-(--muted)">
                <IconPin />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.parking_info && (
              <div className="flex items-center gap-2 text-sm text-(--muted)">
                <IconParking />
                <span>{profile.parking_info}</span>
              </div>
            )}
            {profile.instagram_id && (
              <div className="flex items-center gap-2 text-sm text-(--muted)">
                <IconInstagram />
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick(profile.id, "instagram")}
                  className="hover:underline"
                >
                  {instagramHandle}
                </a>
              </div>
            )}
          </div>
        </>
      )}
      {/* ── 워터마크 (무료 플랜) ── */}
      {showWatermark && (
        <div className="mt-6 border-t border-black/8 pt-4 text-center">
          <a
            href="https://kku-ui.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-(--muted) hover:text-foreground transition-colors"
          >
            <span>⚡</span>
            <span>
              <span className="font-semibold text-foreground">InstaLink</span>로 만든 페이지
            </span>
          </a>
        </div>
      )}
    </section>
  );
}
