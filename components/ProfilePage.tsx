"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Profile, BusinessHours } from "@/lib/types";
import { PLAN_LIMITS, toPlanKey } from "@/lib/plan-limits";

type ProfilePageProps = {
  profile: Profile;
};

function toInstagramUrl(instagramId: string) {
  const cleaned = instagramId.replace(/^@/, "").trim();
  return `https://instagram.com/${cleaned}`;
}

function normalizeExternalHref(raw?: string | null): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

function trackClick(
  profileId: string,
  linkType: "kakao" | "instagram" | "phone",
) {
  if (!profileId) return; // 데모/미리보기 — DB 없는 임시 프로필은 추적 생략
  fetch("/api/track/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileId, linkType }),
  }).catch(() => {});
}

// ── 버튼 배경색 → 자동 텍스트 색상 (WCAG 상대 휘도 기준) ──────────────
function getAutoTextColor(hex: string): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "#ffffff";
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const lin = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return luminance > 0.179 ? "#111827" : "#ffffff";
}

// ── 영업일 헬퍼 ──────────────────────────────────────────────
const DAYS_KR = [
  { key: "mon", short: "월" },
  { key: "tue", short: "화" },
  { key: "wed", short: "수" },
  { key: "thu", short: "목" },
  { key: "fri", short: "금" },
  { key: "sat", short: "토" },
  { key: "sun", short: "일" },
] as const;

/** 연속된 같은 시간 요일을 묶어서 표시용 배열로 변환 */
function groupBusinessHours(
  bh: BusinessHours,
): { days: string; hours: string }[] {
  const result: { days: string; hours: string }[] = [];
  let i = 0;
  while (i < DAYS_KR.length) {
    const h = bh[DAYS_KR[i].key as keyof BusinessHours];
    if (!h?.trim()) {
      i++;
      continue;
    }
    let j = i + 1;
    while (
      j < DAYS_KR.length &&
      bh[DAYS_KR[j].key as keyof BusinessHours] === h
    )
      j++;
    const dayStr =
      j - i === 1
        ? `${DAYS_KR[i].short}`
        : `${DAYS_KR[i].short}~${DAYS_KR[j - 1].short}`;
    result.push({ days: dayStr, hours: h! });
    i = j;
  }
  return result;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-(--muted)">
      {children}
    </h2>
  );
}

function IconParking() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
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
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconInstagram({ size = "14" }: { size?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <path
        fill="currentColor"
        d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
      />
    </svg>
  );
}

const DEFAULT_SECTION_ORDER = ["services", "gallery", "reviews"];

export default function ProfilePage({ profile }: ProfilePageProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  // 스와이프 추적
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // 갤러리 레이아웃
  const galleryLayout = profile.gallery_layout ?? "grid3";
  const gridCols = galleryLayout === "grid2" ? "grid-cols-2" : "grid-cols-3";
  const imgSizes =
    galleryLayout === "grid2"
      ? "(max-width: 480px) 45vw, 210px"
      : "(max-width: 480px) 30vw, 150px";

  // 버튼 컬러: 텍스트는 명시값 → 자동대비 순으로 결정
  const btnColor = profile.button_color?.trim() || null;
  const btnTextColor = btnColor
    ? profile.button_text_color?.trim() || getAutoTextColor(btnColor)
    : null;

  const sectionOrder: string[] =
    Array.isArray(profile.section_order) && profile.section_order.length > 0
      ? profile.section_order
      : DEFAULT_SECTION_ORDER;

  // 플랜별 공개 표시 제한
  const planKey = toPlanKey(profile.plan);
  const limits = PLAN_LIMITS[planKey];

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);

  // 라이트박스 열릴 때 body 스크롤 잠금 + ESC/화살표 키 닫기·탐색
  useEffect(() => {
    if (lightboxIdx === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const gallery = profile.gallery;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
        return;
      }
      if (!gallery) return;
      if (e.key === "ArrowRight") {
        setLightboxIdx((i) =>
          i !== null ? (i < gallery.length - 1 ? i + 1 : 0) : 0,
        );
      }
      if (e.key === "ArrowLeft") {
        setLightboxIdx((i) =>
          i !== null ? (i > 0 ? i - 1 : gallery.length - 1) : 0,
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIdx, closeLightbox, profile.gallery]);

  // 모바일 스와이프 핸들러
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
    if (!profile.gallery || Math.abs(dx) <= Math.abs(dy) || Math.abs(dx) < 50)
      return;
    if (dx > 0) {
      setLightboxIdx((i) =>
        i !== null ? (i < profile.gallery!.length - 1 ? i + 1 : 0) : 0,
      );
    } else {
      setLightboxIdx((i) =>
        i !== null ? (i > 0 ? i - 1 : profile.gallery!.length - 1) : 0,
      );
    }
  }

  const instagramHandle = profile.instagram_id.startsWith("@")
    ? profile.instagram_id
    : `@${profile.instagram_id}`;
  const instagramUrl = toInstagramUrl(profile.instagram_id);

  const kakaoUrl = normalizeExternalHref(profile.kakao_url);
  const kakaoBookingUrl = normalizeExternalHref(profile.kakao_booking_url);
  const kakaoChannelUrl = normalizeExternalHref(profile.kakao_channel_url);
  const naverBookingUrl = normalizeExternalHref(profile.naver_booking_url);
  const instagramDmUrl = normalizeExternalHref(profile.instagram_dm_url);

  const hasCta =
    kakaoUrl ||
    kakaoBookingUrl ||
    naverBookingUrl ||
    profile.phone_url ||
    instagramDmUrl ||
    kakaoChannelUrl;

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

        {/* ── CTA 버튼 ── 1번: 대형 메인, 2번~: 2열 소형 */}
        {hasCta && (() => {
          type CtaItem = {
            key: string;
            href: string;
            onClick?: () => void;
            style: React.CSSProperties;
            icon: React.ReactNode;
            label: React.ReactNode;
            extraClass?: string;
          };

          const phoneStyle: React.CSSProperties = btnColor
            ? { backgroundColor: btnColor, color: btnTextColor || "#fff", border: "none" }
            : { backgroundColor: "#fff", color: "#111827", border: "1px solid rgba(0,0,0,0.1)" };

          const allCtas: CtaItem[] = [
            kakaoUrl && {
              key: "kakao",
              href: kakaoUrl,
              onClick: () => trackClick(profile.id, "kakao"),
              style: { backgroundColor: "#FEE500", color: "#000" },
              icon: <Image src="/kakaosimbol.svg" alt="" width={24} height={24} className="h-[1.5em] w-[1.5em] shrink-0" />,
              label: <span className="whitespace-nowrap">카카오톡으로 무료 상담 받기</span>,
            },
            kakaoBookingUrl && {
              key: "kakao_booking",
              href: kakaoBookingUrl,
              onClick: () => trackClick(profile.id, "kakao"),
              style: { backgroundColor: "#FEE500", color: "#000" },
              icon: <Image src="/kakaosimbol.svg" alt="" width={24} height={24} className="h-[1.5em] w-[1.5em] shrink-0" />,
              label: <span className="whitespace-nowrap">카카오로 예약하기</span>,
            },
            kakaoChannelUrl && {
              key: "kakao_channel",
              href: kakaoChannelUrl,
              style: { backgroundColor: "#FEE500", color: "#000" },
              icon: <Image src="/kakaosimbol.svg" alt="" width={24} height={24} className="h-[1.5em] w-[1.5em] shrink-0" />,
              label: <span className="whitespace-nowrap">카카오채널 문의</span>,
            },
            naverBookingUrl && {
              key: "naver",
              href: naverBookingUrl,
              style: { backgroundColor: "#03C75A", color: "#fff" },
              icon: (
                <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
                  <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" fill="#fff" />
                </svg>
              ),
              label: <span className="whitespace-nowrap">네이버로 예약하기</span>,
            },
            instagramDmUrl && {
              key: "instagram_dm",
              href: instagramDmUrl,
              style: { background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", color: "#fff" },
              icon: <IconInstagram size="1.5em" />,
              label: <span className="whitespace-nowrap">인스타그램 DM 보내기</span>,
            },
            profile.phone_url && {
              key: "phone",
              href: `tel:${profile.phone_url.replace(/[^0-9+]/g, "")}`,
              onClick: () => trackClick(profile.id, "phone"),
              style: phoneStyle,
              icon: (
                <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.48 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.86a16 16 0 0 0 6 6l.92-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              ),
              label: <span className="whitespace-nowrap">전화 연결 {profile.phone_url}</span>,
            },
          ].filter(Boolean) as CtaItem[];

          const [primary, ...secondary] = allCtas;

          return (
            <div className="mt-5 flex flex-col gap-2">
              {/* 메인 CTA — 크고 눈에 띄게 */}
              <a
                href={primary.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={primary.onClick}
                className={`flex min-h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-3 text-[14.5px] font-bold shadow-[0_4px_18px_rgba(17,24,39,0.18)] active:translate-y-px ${primary.extraClass ?? ""}`}
                style={primary.style}
              >
                {primary.icon}
                {primary.label}
              </a>

              {/* 보조 CTA — 2열 소형 */}
              {secondary.length > 0 && (
                <div className={`grid gap-2 ${secondary.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                  {secondary.map((cta) => (
                    <a
                      key={cta.key}
                      href={cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={cta.onClick}
                      className={`flex min-h-11 w-full items-center justify-center gap-1.5 overflow-hidden rounded-xl px-2 text-[13px] font-semibold shadow-[0_2px_8px_rgba(17,24,39,0.10)] active:translate-y-px ${cta.extraClass ?? ""}`}
                      style={cta.style}
                    >
                      {cta.icon}
                      {cta.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* ── 추가 링크 ── */}
        {profile.custom_links &&
          profile.custom_links.length > 0 &&
          (() => {
            const FREE_LINK_LIMIT = 2;
            const isFree = !profile.plan || profile.plan === "free";
            const visibleLinksRaw = isFree
              ? profile.custom_links!.slice(0, FREE_LINK_LIMIT)
              : profile.custom_links!;
            const visibleLinks = visibleLinksRaw
              .map((link) => {
                const href = normalizeExternalHref(link.url);
                if (!href) return null;
                return { ...link, url: href };
              })
              .filter((link): link is { label: string; url: string } => link !== null);
            const hiddenCount = isFree
              ? Math.max(0, profile.custom_links!.length - FREE_LINK_LIMIT)
              : 0;
            return (
              <div
                className={`relative z-10 flex flex-col gap-2 ${hasCta ? "mt-6" : "mt-5"}`}
              >
                {visibleLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors active:translate-y-px"
                    style={
                      btnColor
                        ? {
                            backgroundColor: btnColor,
                            color: btnTextColor || "#fff",
                            border: "none",
                          }
                        : {
                            backgroundColor: "#fff",
                            color: "#111827",
                            border: "1px solid rgba(0,0,0,0.1)",
                          }
                    }
                  >
                    🔗 {link.label}
                  </a>
                ))}
                {hiddenCount > 0 && (
                  <div className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-black/10 py-3 text-xs text-(--muted)">
                    <span>🔒</span>
                    <span>
                      링크 {hiddenCount}개 더 보려면 업그레이드가 필요합니다
                    </span>
                  </div>
                )}
              </div>
            );
          })()}

        {/* ── 동적 섹션 순서: 서비스 · 갤러리 · 후기 ── */}
        {sectionOrder.map((sectionKey) => {
          if (sectionKey === "gallery") {
            if (!profile.gallery || profile.gallery.length === 0) return null;
            const visibleGallery =
              limits.gallery === Infinity
                ? profile.gallery
                : profile.gallery.slice(0, limits.gallery);
            const hiddenGallery = Math.max(
              0,
              profile.gallery.length - visibleGallery.length,
            );
            return (
              <div key="gallery">
                <div className="my-6 h-px bg-black/20" />
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
            const hiddenServices = Math.max(
              0,
              profile.services.length - visibleServices.length,
            );
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
                        <span className="text-sm font-medium text-foreground">
                          {service.name}
                        </span>
                        <div className="flex flex-col items-end text-right">
                          <span className="text-sm font-bold text-foreground">
                            {service.price}
                          </span>
                          {service.note && (
                            <span className="mt-0.5 text-[11px] text-(--muted)">
                              {service.note}
                            </span>
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
            const hiddenReviews = Math.max(
              0,
              profile.reviews.length - visibleReviews.length,
            );
            return (
              <div key="reviews">
                <div className="my-6 h-px bg-black/20" />
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
                          <p className="text-[11px] font-semibold text-(--muted)">
                            — {review.author}
                          </p>
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

        {/* 라이트박스 — 배경 클릭·ESC·화살표 키·스와이프로 제어 */}
        {lightboxIdx !== null && profile.gallery && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4"
            onClick={closeLightbox}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="relative w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 닫기 버튼 */}
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute -right-1 -top-10 z-10 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/25"
                aria-label="닫기"
              >
                ✕ 닫기
              </button>

              {/* 이미지 — 세로/가로 모두 자연스럽게 표시 */}
              <div
                className="relative w-full overflow-hidden rounded-2xl bg-black/30"
                style={{ height: "clamp(240px, 60svh, 480px)" }}
              >
                <Image
                  src={profile.gallery[lightboxIdx].url}
                  alt={profile.gallery[lightboxIdx].caption ?? ""}
                  fill
                  sizes="(max-width: 640px) 90vw, 480px"
                  className="object-contain"
                  priority
                />
              </div>

              {/* 캡션 */}
              {profile.gallery[lightboxIdx].caption && (
                <p className="mt-2 text-center text-sm text-white/80">
                  {profile.gallery[lightboxIdx].caption}
                </p>
              )}

              {/* 페이지 인디케이터 + 이전/다음 */}
              {profile.gallery.length > 1 && (
                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIdx((i) =>
                        i !== null && i > 0
                          ? i - 1
                          : profile.gallery!.length - 1,
                      );
                    }}
                    className="rounded-full bg-white/20 px-4 py-2 text-sm text-white hover:bg-white/35 transition-colors"
                  >
                    ‹ 이전
                  </button>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-white/60">
                      {lightboxIdx + 1} / {profile.gallery.length}
                    </span>
                    {/* 도트 인디케이터 (최대 9개) */}
                    {profile.gallery.length <= 9 && (
                      <div className="flex gap-1">
                        {profile.gallery.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxIdx(i);
                            }}
                            className={`h-1.5 rounded-full transition-all ${
                              i === lightboxIdx
                                ? "w-4 bg-white"
                                : "w-1.5 bg-white/40"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIdx((i) =>
                        i !== null && i < profile.gallery!.length - 1
                          ? i + 1
                          : 0,
                      );
                    }}
                    className="rounded-full bg-white/20 px-4 py-2 text-sm text-white hover:bg-white/35 transition-colors"
                  >
                    다음 ›
                  </button>
                </div>
              )}

              {/* 스와이프 힌트 (모바일, 첫 진입시) */}
              {profile.gallery.length > 1 && (
                <p className="mt-2 text-center text-[10px] text-white/30 select-none">
                  ← 스와이프하여 이동 →
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── 운영정보 ── */}
        {(profile.hours ||
          profile.business_hours ||
          profile.location ||
          profile.parking_info ||
          profile.instagram_id) && (
          <>
            <div className="my-6 h-px bg-black/20" />
            <div className="space-y-2.5">
              {/* 요일별 영업일 (structured) */}
              {profile.business_hours &&
                Object.values(profile.business_hours).some(Boolean) &&
                (() => {
                  const grouped = groupBusinessHours(
                    profile.business_hours as BusinessHours,
                  );
                  return (
                    <div className="flex flex-col gap-1.5">
                      {/* 요일 뱃지 행 */}
                      <div className="flex items-center gap-1.5">
                        <IconClock />
                        <div className="flex gap-1">
                          {DAYS_KR.map(({ key, short }) => {
                            const isOpen = !!(
                              profile.business_hours as BusinessHours
                            )[key as keyof BusinessHours];
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
                      {/* 시간 그룹 표시 */}
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
              {/* 기존 텍스트 운영시간 (structured 없을 때만 표시) */}
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
      </section>

      {/* ── 바이럴 배지: Pro 플랜만 숨길 수 있음 ── */}
      {profile.plan !== "pro" && (
        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-xs text-black/30 transition-opacity hover:text-black/50 dark:text-white/25 dark:hover:text-white/40"
          aria-label="인스타링크로 무료 링크페이지 만들기"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          인스타링크로 무료 링크페이지 만들기
        </Link>
      )}
    </>
  );
}
