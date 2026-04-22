"use client";

import Image from "next/image";
import type { Profile } from "@/lib/types";

type ProfilePageProps = {
  profile: Profile;
};

function toInstagramUrl(instagramId: string) {
  const cleaned = instagramId.replace(/^@/, "").trim();
  return `https://instagram.com/${cleaned}`;
}

function trackClick(profileId: string, linkType: "kakao" | "instagram") {
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

export default function ProfilePage({ profile }: ProfilePageProps) {
  const instagramHandle = profile.instagram_id.startsWith("@")
    ? profile.instagram_id
    : `@${profile.instagram_id}`;
  const instagramUrl = toInstagramUrl(profile.instagram_id);

  const hasCta = profile.kakao_url || profile.kakao_booking_url || profile.naver_booking_url;

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

      {/* ── 소개 ── */}
      {profile.description && (
        <p className="mt-5 rounded-xl bg-black/[0.035] px-4 py-3.5 text-sm leading-6 text-(--muted) whitespace-pre-line break-words">
          {profile.description}
        </p>
      )}

      {/* ── CTA 버튼 ── */}
      {hasCta && (
        <div className="mt-5 flex flex-col gap-2">
          {profile.kakao_booking_url && (
            <a
              href={profile.kakao_booking_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(profile.id, "kakao")}
              className="flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-2 text-sm font-semibold text-black! shadow-[0_4px_14px_rgba(17,24,39,0.14)] active:translate-y-px"
              style={{ backgroundColor: "#FEE500" }}
            >
              <Image src="/kakaosimbol.svg" alt="" width={18} height={18} className="h-4.5 w-4.5 shrink-0" />
              <span className="text-black! whitespace-nowrap">카카오로 예약하기</span>
            </a>
          )}
          {profile.naver_booking_url && (
            <a
              href={profile.naver_booking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-2 text-sm font-semibold text-white! shadow-[0_4px_14px_rgba(17,24,39,0.14)] active:translate-y-px"
              style={{ backgroundColor: "#03C75A" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" fill="#fff" />
              </svg>
              <span className="whitespace-nowrap">네이버로 예약하기</span>
            </a>
          )}
          {profile.kakao_url && (
            <a
              href={profile.kakao_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(profile.id, "kakao")}
              className="reserve-button flex min-h-12 w-full items-center justify-center overflow-hidden rounded-xl px-2 text-sm font-semibold text-black! shadow-[0_4px_14px_rgba(17,24,39,0.14)] active:translate-y-px"
              style={{ backgroundColor: "#FEE500" }}
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
                <span className="text-black! whitespace-nowrap">무료 상담 받기 (카카오톡)</span>
              </span>
            </a>
          )}
        </div>
      )}

      {/* ── 추가 링크 ── */}
      {profile.custom_links && profile.custom_links.length > 0 && (
        <div className={`flex flex-col gap-2 ${hasCta ? "mt-6" : "mt-5"}`}>
          {profile.custom_links.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/60 px-4 text-sm font-medium text-foreground backdrop-blur hover:bg-white/80 transition-colors active:translate-y-px"
            >
              🔗 {link.label}
            </a>
          ))}
        </div>
      )}

      {/* ── 서비스 ── */}
      {profile.services.length > 0 && (
        <>
          <div className="my-6 h-px bg-black/20" />
          <section>
            <SectionLabel>서비스 &amp; 가격</SectionLabel>
            <ul className="space-y-2">
              {profile.services.map((service) => (
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
          </section>
        </>
      )}

      {/* ── 후기 ── */}
      {profile.reviews.length > 0 && (
        <>
          <div className="my-6 h-px bg-black/20" />
          <section>
            <SectionLabel>고객 후기</SectionLabel>
            <ul className="space-y-2">
              {profile.reviews.map((review, idx) => (
                <li key={review.author + idx} className="rounded-xl bg-black/[0.035] px-4 py-4">
                  <p className="text-sm leading-6 text-foreground">
                    &#8220;{review.text}&#8221;
                  </p>
                  <p className="mt-2 text-[11px] font-semibold text-(--muted)">— {review.author}</p>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {/* ── 운영정보 ── */}
      {(profile.hours || profile.location || profile.instagram_id) && (
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
  );
}
