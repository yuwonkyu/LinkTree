import Image from "next/image";
import type { CustomLink } from "@/lib/types";
import { IconInstagram } from "./icons";
import { trackClick, normalizeExternalHref } from "@/lib/profile-utils";

type CtaItem = {
  key: string;
  href: string;
  onClick?: () => void;
  style: React.CSSProperties;
  icon: React.ReactNode;
  label: React.ReactNode;
};

type Props = {
  kakaoUrl: string | null;
  kakaoBookingUrl: string | null;
  kakaoChannelUrl: string | null;
  naverBookingUrl: string | null;
  instagramDmUrl: string | null;
  phoneUrl?: string | null;
  profileId: string;
  btnColor: string | null;
  btnTextColor: string | null;
  customLinks?: CustomLink[] | null;
  plan?: string | null;
};

const FREE_LINK_LIMIT = 2;

export default function ProfileActions({
  kakaoUrl, kakaoBookingUrl, kakaoChannelUrl, naverBookingUrl, instagramDmUrl,
  phoneUrl, profileId, btnColor, btnTextColor, customLinks, plan,
}: Props) {
  const hasCta = !!(kakaoUrl || kakaoBookingUrl || kakaoChannelUrl || naverBookingUrl || instagramDmUrl || phoneUrl);
  const isFree = !plan || plan === "free";

  return (
    <>
      {hasCta && <CtaButtons
        kakaoUrl={kakaoUrl}
        kakaoBookingUrl={kakaoBookingUrl}
        kakaoChannelUrl={kakaoChannelUrl}
        naverBookingUrl={naverBookingUrl}
        instagramDmUrl={instagramDmUrl}
        phoneUrl={phoneUrl}
        profileId={profileId}
        btnColor={btnColor}
        btnTextColor={btnTextColor}
      />}
      <CustomLinksSection
        customLinks={customLinks}
        btnColor={btnColor}
        btnTextColor={btnTextColor}
        isFree={isFree}
        hasCtaAbove={hasCta}
      />
    </>
  );
}

// ── CTA 버튼 ─────────────────────────────────────────────────

type CtaButtonsProps = {
  kakaoUrl: string | null;
  kakaoBookingUrl: string | null;
  kakaoChannelUrl: string | null;
  naverBookingUrl: string | null;
  instagramDmUrl: string | null;
  phoneUrl?: string | null;
  profileId: string;
  btnColor: string | null;
  btnTextColor: string | null;
};

function CtaButtons({
  kakaoUrl, kakaoBookingUrl, kakaoChannelUrl, naverBookingUrl, instagramDmUrl,
  phoneUrl, profileId, btnColor, btnTextColor,
}: CtaButtonsProps) {
  const phoneStyle: React.CSSProperties = btnColor
    ? { backgroundColor: btnColor, color: btnTextColor || "#fff", border: "none" }
    : { backgroundColor: "#fff", color: "#111827", border: "1px solid rgba(0,0,0,0.1)" };

  const allCtas: CtaItem[] = [
    kakaoUrl && {
      key: "kakao",
      href: kakaoUrl,
      onClick: () => trackClick(profileId, "kakao"),
      style: { backgroundColor: "#FEE500", color: "#000" },
      icon: <Image src="/kakaosimbol.svg" alt="" width={24} height={24} className="h-[1.5em] w-[1.5em] shrink-0" />,
      label: <span className="whitespace-nowrap">카카오톡으로 무료 상담 받기</span>,
    },
    kakaoBookingUrl && {
      key: "kakao_booking",
      href: kakaoBookingUrl,
      onClick: () => trackClick(profileId, "kakao"),
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
    phoneUrl && {
      key: "phone",
      href: `tel:${phoneUrl.replace(/[^0-9+]/g, "")}`,
      onClick: () => trackClick(profileId, "phone"),
      style: phoneStyle,
      icon: (
        <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.48 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.86a16 16 0 0 0 6 6l.92-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      label: <span className="whitespace-nowrap">전화 연결 {phoneUrl}</span>,
    },
  ].filter(Boolean) as CtaItem[];

  const [primary, ...secondary] = allCtas;

  return (
    <div className="mt-5 flex flex-col gap-2">
      <a
        href={primary.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={primary.onClick}
        className="flex min-h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-3 text-[14.5px] font-bold shadow-[0_4px_18px_rgba(17,24,39,0.18)] active:translate-y-px"
        style={primary.style}
      >
        {primary.icon}
        {primary.label}
      </a>
      {secondary.length > 0 && (
        <div className={`grid gap-2 ${secondary.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
          {secondary.map((cta) => (
            <a
              key={cta.key}
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={cta.onClick}
              className="flex min-h-11 w-full items-center justify-center gap-1.5 overflow-hidden rounded-xl px-2 text-[13px] font-semibold shadow-[0_2px_8px_rgba(17,24,39,0.10)] active:translate-y-px"
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
}

// ── 추가 링크 ─────────────────────────────────────────────────

type CustomLinksSectionProps = {
  customLinks?: CustomLink[] | null;
  btnColor: string | null;
  btnTextColor: string | null;
  isFree: boolean;
  hasCtaAbove: boolean;
};

function CustomLinksSection({
  customLinks, btnColor, btnTextColor, isFree, hasCtaAbove,
}: CustomLinksSectionProps) {
  if (!customLinks?.length) return null;

  const visibleLinksRaw = isFree ? customLinks.slice(0, FREE_LINK_LIMIT) : customLinks;
  const visibleLinks = visibleLinksRaw
    .map((link) => {
      const href = normalizeExternalHref(link.url);
      if (!href) return null;
      return { ...link, url: href };
    })
    .filter((link): link is CustomLink => link !== null);

  const hiddenCount = isFree
    ? Math.max(0, customLinks.length - FREE_LINK_LIMIT)
    : 0;

  return (
    <div className={`relative z-10 flex flex-col gap-2 ${hasCtaAbove ? "mt-6" : "mt-5"}`}>
      {visibleLinks.map((link, idx) => (
        <a
          key={idx}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors active:translate-y-px"
          style={
            btnColor
              ? { backgroundColor: btnColor, color: btnTextColor || "#fff", border: "none" }
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
}
