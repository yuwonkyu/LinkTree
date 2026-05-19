"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Profile, BusinessHours } from "@/lib/types";
import { PLAN_LIMITS, toPlanKey } from "@/lib/plan-limits";
import {
  toInstagramUrl, normalizeExternalHref, getAutoTextColor,
  groupBusinessHours, DAYS_KR,
} from "@/lib/profile-utils";
import { IconClock, IconPin, IconParking, IconInstagram } from "./profile/icons";
import ProfileActions from "./profile/ProfileActions";
import ProfileSections from "./profile/ProfileSections";
import ProfileLightbox from "./profile/ProfileLightbox";

type ProfilePageProps = { profile: Profile };

const DEFAULT_SECTION_ORDER = ["services", "gallery", "reviews"];

export default function ProfilePage({ profile }: ProfilePageProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const galleryLayout = profile.gallery_layout ?? "grid3";
  const gridCols = galleryLayout === "grid2" ? "grid-cols-2" : "grid-cols-3";
  const imgSizes =
    galleryLayout === "grid2"
      ? "(max-width: 480px) 45vw, 210px"
      : "(max-width: 480px) 30vw, 150px";

  const btnColor = profile.button_color?.trim() || null;
  const btnTextColor = btnColor
    ? profile.button_text_color?.trim() || getAutoTextColor(btnColor)
    : null;

  const sectionOrder: string[] =
    Array.isArray(profile.section_order) && profile.section_order.length > 0
      ? profile.section_order
      : DEFAULT_SECTION_ORDER;

  const limits = PLAN_LIMITS[toPlanKey(profile.plan)];

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const gallery = profile.gallery;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeLightbox(); return; }
      if (!gallery) return;
      if (e.key === "ArrowRight")
        setLightboxIdx((i) => i !== null ? (i < gallery.length - 1 ? i + 1 : 0) : 0);
      if (e.key === "ArrowLeft")
        setLightboxIdx((i) => i !== null ? (i > 0 ? i - 1 : gallery.length - 1) : 0);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIdx, closeLightbox, profile.gallery]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    touchStartX.current = null;
    touchStartY.current = null;
    if (!profile.gallery || Math.abs(dx) <= Math.abs(dy) || Math.abs(dx) < 50) return;
    if (dx > 0)
      setLightboxIdx((i) => i !== null ? (i < profile.gallery!.length - 1 ? i + 1 : 0) : 0);
    else
      setLightboxIdx((i) => i !== null ? (i > 0 ? i - 1 : profile.gallery!.length - 1) : 0);
  }

  const instagramHandle = profile.instagram_id.startsWith("@")
    ? profile.instagram_id
    : `@${profile.instagram_id}`;
  const instagramUrl = toInstagramUrl(profile.instagram_id);

  const kakaoUrl         = normalizeExternalHref(profile.kakao_url);
  const kakaoBookingUrl  = normalizeExternalHref(profile.kakao_booking_url);
  const kakaoChannelUrl  = normalizeExternalHref(profile.kakao_channel_url);
  const naverBookingUrl  = normalizeExternalHref(profile.naver_booking_url);
  const instagramDmUrl   = normalizeExternalHref(profile.instagram_dm_url);

  const hasBusinessInfo =
    profile.hours || profile.business_hours || profile.location ||
    profile.parking_info || profile.instagram_id;

  return (
    <>
      <section className="rounded-xl p-6 backdrop-blur sm:p-8">
        {/* ── 프로필 헤더 ── */}
        <div className="flex items-center gap-4">
          <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-full ring-2 ring-black/8 sm:h-20 sm:w-20">
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
            <h1 className="profile-name font-display font-bold leading-tight text-foreground wrap-break-word">
              {profile.name}
            </h1>
            <p className="profile-role mt-1 font-medium text-(--muted) wrap-break-word">
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
          <p className="mt-5 rounded-xl bg-black/[0.035] px-4 py-3.5 text-sm leading-6 text-(--muted) whitespace-pre-wrap break-keep">
            {profile.description}
          </p>
        )}

        {/* ── CTA + 추가 링크 ── */}
        <ProfileActions
          kakaoUrl={kakaoUrl}
          kakaoBookingUrl={kakaoBookingUrl}
          kakaoChannelUrl={kakaoChannelUrl}
          naverBookingUrl={naverBookingUrl}
          instagramDmUrl={instagramDmUrl}
          phoneUrl={profile.phone_url}
          profileId={profile.id}
          btnColor={btnColor}
          btnTextColor={btnTextColor}
          customLinks={profile.custom_links}
          plan={profile.plan}
        />

        {/* ── 서비스 · 갤러리 · 후기 (동적 순서) ── */}
        <ProfileSections
          profile={profile}
          limits={limits}
          sectionOrder={sectionOrder}
          gridCols={gridCols}
          imgSizes={imgSizes}
          setLightboxIdx={setLightboxIdx}
        />

        {/* ── 라이트박스 ── */}
        {lightboxIdx !== null && profile.gallery && (
          <ProfileLightbox
            gallery={profile.gallery}
            lightboxIdx={lightboxIdx}
            setLightboxIdx={setLightboxIdx}
            closeLightbox={closeLightbox}
            handleTouchStart={handleTouchStart}
            handleTouchEnd={handleTouchEnd}
          />
        )}

        {/* ── 운영 정보 ── */}
        {hasBusinessInfo && (
          <>
            <div className="my-6 h-px bg-black/20" />
            <div className="space-y-2.5">
              {profile.business_hours &&
                Object.values(profile.business_hours).some(Boolean) &&
                (() => {
                  const grouped = groupBusinessHours(profile.business_hours as BusinessHours);
                  return (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <IconClock />
                        <div className="flex gap-1">
                          {DAYS_KR.map(({ key, short }) => {
                            const isOpen = !!(profile.business_hours as BusinessHours)[key as keyof BusinessHours];
                            return (
                              <span
                                key={key}
                                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                                  isOpen
                                    ? "bg-foreground text-background"
                                    : "bg-black/5 text-(--muted) opacity-40"
                                }`}
                              >
                                {short}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      {grouped.length > 0 && (
                        <div className="ml-5 flex flex-col gap-0.5">
                          {grouped.map(({ days, hours }) => (
                            <span key={days} className="text-xs text-(--muted)">
                              {days} {hours}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              {profile.hours && !profile.business_hours && (
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
                    onClick={() => {
                      if (profile.id) {
                        fetch("/api/track/click", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ profileId: profile.id, linkType: "instagram" }),
                        }).catch(() => {});
                      }
                    }}
                    className="hover:underline"
                  >
                    {instagramHandle}
                  </a>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {/* ── 바이럴 배지 ── */}
      {profile.plan !== "pro" && (
        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-xs text-black/30 transition-opacity hover:text-black/50 dark:text-white/25 dark:hover:text-white/40"
          aria-label="인스타링크로 무료 링크페이지 만들기"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          인스타링크로 무료 링크페이지 만들기
        </Link>
      )}
    </>
  );
}
