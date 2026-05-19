"use client";

import Link from "next/link";
import { useState, useTransition, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { saveProfile, type SaveProfilePayload } from "./actions";
import type { Profile, Service, Review, Theme, CustomLink, GalleryImage, BusinessHours, GalleryLayout } from "@/lib/types";
import { PLAN_LIMITS, toPlanKey } from "@/lib/plan-limits";
import { getFirstServiceValidationIssue, getServiceValidationMessage } from "@/lib/service-validation";
// BasicTab은 초기 화면에서 즉시 필요 → 정적 임포트 유지
import BasicTab from "@/components/edit/tabs/BasicTab";
import SaveSuccessModal from "@/components/edit/SaveSuccessModal";
import SaveErrorModal from "@/components/edit/SaveErrorModal";
// 나머지 탭은 클릭 시점에만 필요 → 동적 임포트로 초기 번들에서 분리
const DesignTab   = dynamic(() => import("@/components/edit/tabs/DesignTab"),   { loading: () => <TabLoading /> });
const ServiceTab  = dynamic(() => import("@/components/edit/tabs/ServiceTab"),  { loading: () => <TabLoading /> });
const ContentTab  = dynamic(() => import("@/components/edit/tabs/ContentTab"),  { loading: () => <TabLoading /> });
const AdvancedTab = dynamic(() => import("@/components/edit/tabs/AdvancedTab"), { loading: () => <TabLoading /> });

function TabLoading() {
  return (
    <div className="flex items-center justify-center py-12 text-sm text-(--muted)">
      불러오는 중...
    </div>
  );
}

// ── 타입 & 상수 ──────────────────────────────────────────
type TabKey = "page" | "service" | "content" | "settings";

const TAB_LIST = [
  { key: "page",     label: "내 페이지",   icon: "🏠" },
  { key: "service",  label: "서비스·메뉴", icon: "🔗" },
  { key: "content",  label: "사진·후기",   icon: "🖼️" },
  { key: "settings", label: "설정",        icon: "⚙️" },
] as const;

const DEFAULT_SECTION_ORDER = ["services", "gallery", "reviews"];

// ── 메인 컴포넌트 ──────────────────────────────────────────
type Props = { profile: Profile; plan?: string };

export default function EditForm({ profile, plan }: Props) {
  const planKey    = toPlanKey(plan);
  const limits     = PLAN_LIMITS[planKey];
  const isPaidPlan = planKey === "basic" || planKey === "pro";
  const isProPlan  = planKey === "pro";

  // ── 기본 정보 상태 ──
  const [name,            setName]         = useState(profile.name ?? "");
  const [shopName,        setShopName]     = useState(profile.shop_name ?? "");
  const [tagline,         setTagline]      = useState(profile.tagline ?? "");
  const [description,     setDesc]         = useState(profile.description ?? "");
  const [kakaoUrl,        setKakaoUrl]     = useState(profile.kakao_url ?? "");
  const [kakaoBookingUrl, setKakaoBk]      = useState(profile.kakao_booking_url ?? "");
  const [naverBookingUrl, setNaverBk]      = useState(profile.naver_booking_url ?? "");
  const [phoneUrl,        setPhoneUrl]     = useState(profile.phone_url ?? "");
  const [instaDmUrl,      setInstaDmUrl]   = useState(profile.instagram_dm_url ?? "");
  const [kakaoChanUrl,    setKakaoChan]    = useState(profile.kakao_channel_url ?? "");
  const [instagramId,     setInstaId]      = useState(profile.instagram_id ?? "");
  const [location,        setLocation]     = useState(profile.location ?? "");
  const [hours,           setHours]        = useState(profile.hours ?? "");
  const [imageUrl,        setImageUrl]     = useState(profile.image_url ?? "");
  const [parkingInfo,     setParkingInfo]  = useState(profile.parking_info ?? "");

  // ── 테마 · 콘텐츠 상태 ──
  const [theme,       setTheme]       = useState<Theme>(profile.theme ?? "light");
  const [services,    setServices]    = useState<Service[]>(profile.services ?? []);
  const [reviews,     setReviews]     = useState<Review[]>(profile.reviews ?? []);
  const [customLinks, setCustomLinks] = useState<CustomLink[]>(profile.custom_links ?? []);
  const [gallery,     setGallery]     = useState<GalleryImage[]>(profile.gallery ?? []);

  // ── Pro 전용 상태 ──
  const [sectionOrder,    setSectionOrder]    = useState<string[]>(profile.section_order ?? [...DEFAULT_SECTION_ORDER]);
  const [buttonColor,     setButtonColor]     = useState(profile.button_color ?? "");
  const [buttonTextColor, setButtonTextColor] = useState(profile.button_text_color ?? "");
  const [galleryLayout,   setGalleryLayout]   = useState<GalleryLayout>(profile.gallery_layout ?? "grid3");

  // ── Basic+ 상태 ──
  const [businessHours, setBusinessHours] = useState<BusinessHours>(profile.business_hours ?? {});

  // ── UI 상태 ──
  const [category,       setCategory]       = useState("카페");
  const [activeTab,      setActiveTab]      = useState<TabKey>("page");
  const [tabGuideShown,  setTabGuideShown]  = useState(true);
  const [aiLoading,  setAiLoading]  = useState<string | null>(null);
  const [saveError,  setSaveError]  = useState<string | null>(null);
  const [invalidServiceIndex, setInvalidServiceIndex] = useState<number | null>(null);
  const [isPending,  startTransition] = useTransition();

  const isFirstRender = useRef(true);
  const [isDirty,      setIsDirty]      = useState(false);
  const [saveStatus,   setSaveStatus]   = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [showPostSave, setShowPostSave] = useState(false);
  const [showSaveErrorModal, setShowSaveErrorModal] = useState(false);
  const [aiNotice,     setAiNotice]     = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 변경 감지
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setIsDirty(true);
  }, [
    name, shopName, tagline, description, kakaoUrl, kakaoBookingUrl,
    naverBookingUrl, phoneUrl, instaDmUrl, kakaoChanUrl, instagramId,
    location, hours, imageUrl, theme, services, reviews, customLinks,
    gallery, parkingInfo, sectionOrder, buttonColor, buttonTextColor,
    galleryLayout, businessHours,
  ]);

  useEffect(() => {
    setInvalidServiceIndex(null);
  }, [services]);

  function focusTabByErrorMessage(message: string) {
    if (message.includes("서비스")) {
      setActiveTab("service");
      return;
    }
    if (message.includes("추가 링크")) {
      setActiveTab("service");
      return;
    }
    if (
      message.includes("URL") ||
      message.includes("카카오") ||
      message.includes("인스타그램") ||
      message.includes("네이버") ||
      message.includes("전화") ||
      message.includes("로그인")
    ) {
      setActiveTab("page");
    }
  }

  // ── 클라이언트 URL 검증 ─────────────────────────────────
  // 서버 액션이 throw하면 프로덕션에서 메시지가 가려지므로, 저장 직전 친절한 안내를 먼저 띄운다.
  function validateUrlsBeforeSave(): string | null {
    type UrlCheck = {
      label: string;
      value: string;
      requireKakao?: boolean;
      requireNaver?: boolean;
      example: string;
    };

    const checks: UrlCheck[] = [
      { label: "카카오 오픈채팅 URL", value: kakaoUrl,        requireKakao: true, example: "https://open.kakao.com/o/예시" },
      { label: "카카오 예약 URL",     value: kakaoBookingUrl, requireKakao: true, example: "https://pf.kakao.com/_예시" },
      { label: "카카오채널 URL",       value: kakaoChanUrl,    requireKakao: true, example: "https://pf.kakao.com/_채널아이디" },
      { label: "네이버 예약 URL",     value: naverBookingUrl, requireNaver: true, example: "https://booking.naver.com/..." },
      { label: "인스타 DM URL",       value: instaDmUrl,                          example: "https://ig.me/m/아이디" },
    ];

    for (const c of checks) {
      const v = c.value?.trim();
      if (!v) continue;

      let parsed: URL;
      try {
        parsed = new URL(v);
      } catch {
        return `[${c.label}] 입력하신 "${v}"는 올바른 주소가 아닙니다. 전체 주소를 https:// 부터 그대로 복사해 붙여넣어 주세요.\n예시: ${c.example}`;
      }

      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return `[${c.label}] http:// 또는 https:// 로 시작하는 주소만 사용할 수 있습니다.\n예시: ${c.example}`;
      }

      if (c.requireKakao) {
        const host = parsed.hostname.toLowerCase();
        if (host !== "open.kakao.com" && host !== "pf.kakao.com") {
          return `[${c.label}] 이 칸에는 카카오 주소만 넣을 수 있어요. (open.kakao.com 또는 pf.kakao.com)\n현재 입력: "${v}"\n예시: ${c.example}`;
        }
      }

      if (c.requireNaver) {
        const host = parsed.hostname.toLowerCase();
        if (!host.endsWith("naver.com")) {
          return `[${c.label}] 네이버 예약 페이지 주소(booking.naver.com)를 넣어주세요.\n현재 입력: "${v}"\n예시: ${c.example}`;
        }
      }
    }

    // 추가 링크
    for (let i = 0; i < (customLinks ?? []).length; i++) {
      const link = customLinks[i];
      const v = link?.url?.trim();
      if (!v) continue;
      try {
        const u = new URL(v);
        if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error();
      } catch {
        const labelText = link.label?.trim() || "(이름 없음)";
        return `[추가 링크 ${i + 1}번 — "${labelText}"] "${v}"는 올바른 주소가 아닙니다.\nhttps:// 부터 시작하는 전체 주소를 입력해주세요.`;
      }
    }

    // 인스타그램 ID
    if (instagramId && !/^[a-zA-Z0-9_.]{1,30}$/.test(instagramId.trim())) {
      return `[인스타그램 ID] "${instagramId}"는 사용할 수 없습니다.\n@를 빼고 영문, 숫자, 밑줄(_), 점(.)만 입력해주세요. (예: fitwithji)`;
    }

    return null;
  }

  function openSaveError(message: string) {
    setSaveError(message);
    setSaveStatus("error");
    setShowSaveErrorModal(true);
    focusTabByErrorMessage(message);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── AI 추천 ──────────────────────────────────────────────
  async function aiSuggest(type: "tagline" | "description" | "services") {
    if (!isProPlan) {
      alert("AI 추천은 Pro 플랜 전용 기능입니다.\n/billing 에서 업그레이드하세요.");
      return;
    }
    setAiLoading(type);
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type, shopName, category,
          existing: type === "description" ? description : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        const msg =
          typeof json.error === "string"
            ? json.error
            : (json.error?.message ?? `오류가 발생했습니다. (${res.status})`);
        alert(msg);
        return;
      }
      const { result } = json;
      if (type === "tagline")     setTagline(result.split("\n")[0] ?? result);
      if (type === "description") setDesc(result);
      if (type === "services" && Array.isArray(result)) setServices(result);
      setAiNotice(true);
    } catch {
      alert("AI 추천 실패. 잠시 후 다시 시도해주세요.");
    } finally {
      setAiLoading(null);
    }
  }

  // ── 저장 ─────────────────────────────────────────────────
  function handleSave() {
    setSaveError(null);
    setSaveStatus("saving");
    setInvalidServiceIndex(null);
    setShowSaveErrorModal(false);

    const serviceIssue = getFirstServiceValidationIssue(services);
    const serviceValidationMessage = getServiceValidationMessage(services);
    if (serviceValidationMessage) {
      setInvalidServiceIndex(serviceIssue?.index ?? null);
      openSaveError(serviceValidationMessage);
      return;
    }

    const urlValidationMessage = validateUrlsBeforeSave();
    if (urlValidationMessage) {
      openSaveError(urlValidationMessage);
      return;
    }

    const payload: SaveProfilePayload = {
      name, shop_name: shopName, tagline, description,
      kakao_url: kakaoUrl, kakao_booking_url: kakaoBookingUrl,
      naver_booking_url: naverBookingUrl,
      phone_url: phoneUrl, instagram_dm_url: instaDmUrl, kakao_channel_url: kakaoChanUrl,
      instagram_id: instagramId,
      location, hours, image_url: imageUrl, theme, services, reviews,
      custom_links: customLinks,
      gallery,
      parking_info: parkingInfo,
      section_order:     isProPlan  ? sectionOrder    : undefined,
      button_color:      isProPlan  ? buttonColor     : undefined,
      button_text_color: isProPlan  ? buttonTextColor : undefined,
      gallery_layout:    isProPlan  ? galleryLayout   : undefined,
      business_hours:    isPaidPlan ? businessHours   : undefined,
    };
    startTransition(async () => {
      try {
        await saveProfile(payload);
        setIsDirty(false);
        setSaveStatus("saved");
        setShowPostSave(true);
        window.dispatchEvent(new CustomEvent("profile-saved"));
        setAiNotice(false);
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => setSaveStatus("idle"), 3000);
      } catch (e) {
        const digestMessage =
          typeof e === "object" &&
          e !== null &&
          "digest" in e &&
          typeof e.digest === "string"
            ? e.digest
            : null;

        if (digestMessage?.includes("NEXT_REDIRECT")) {
          openSaveError("로그인이 만료되었거나 권한이 없습니다. 다시 로그인 후 저장해주세요.");
          return;
        }

        const msg = e instanceof Error ? e.message : "저장 중 오류가 발생했습니다.";
        openSaveError(msg);
      }
    });
  }

  // ── 렌더 ──────────────────────────────────────────────────
  const allTabs = TAB_LIST as readonly { key: TabKey; label: string; icon: string }[];

  return (
    <div className="flex flex-col gap-5">

      {/* ── 저장 후 모달 ── */}
      {showPostSave && (
        <SaveSuccessModal slug={profile.slug} onClose={() => setShowPostSave(false)} />
      )}

      {/* ── 저장 실패 모달 ── */}
      {showSaveErrorModal && saveError && (
        <SaveErrorModal error={saveError} onClose={() => setShowSaveErrorModal(false)} />
      )}

      {/* ── 탭 가이드 배너 ── */}
      {tabGuideShown && (
        <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
          <span className="mt-0.5 text-lg leading-none">💡</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-indigo-800">탭을 하나씩 채워주세요!</p>
            <p className="mt-0.5 text-xs text-indigo-700 leading-relaxed">
              <span className="font-semibold">🏠 내 페이지</span> → <span className="font-semibold">🔗 서비스·메뉴</span> → <span className="font-semibold">🖼️ 사진·후기</span> 순서로 진행하면 빠르게 완성할 수 있어요.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTabGuideShown(false)}
            className="shrink-0 text-indigo-300 hover:text-indigo-500 text-sm leading-none"
            aria-label="가이드 닫기"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── 탭 바 ── */}
      <div className="sticky top-0 z-30 -mx-1 overflow-x-auto">
        <div className="flex min-w-max gap-0.5 rounded-2xl bg-(--secondary) p-1">
          {allTabs.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                activeTab === key
                  ? "bg-white text-foreground shadow-sm"
                  : "text-(--muted) hover:text-foreground"
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 미저장 변경 배너 ── */}
      {isDirty && (
        <div className="sticky top-0 z-40 -mx-1 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            <p className="text-xs font-semibold text-amber-800">저장되지 않은 변경사항이 있습니다</p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="rounded-lg bg-amber-400 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-500 disabled:opacity-60 transition-colors"
          >
            {isPending ? "저장 중…" : "지금 저장"}
          </button>
        </div>
      )}

      {/* ── AI 생성 안내 ── */}
      {aiNotice && (
        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
          <span className="text-lg leading-none">✨</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-blue-800">AI가 자동 생성한 내용입니다</p>
            <p className="mt-0.5 text-xs text-blue-700">
              실제 운영 전 반드시 내용을 직접 확인하고 수정해주세요. AI 내용을 그대로 사용하면 고객에게 부정확한 정보가 전달될 수 있습니다.
            </p>
          </div>
          <button type="button" onClick={() => setAiNotice(false)} className="shrink-0 text-blue-400 hover:text-blue-600 text-sm">✕</button>
        </div>
      )}

      {saveError && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 whitespace-pre-wrap break-keep">{saveError}</div>
      )}

      {/* ══ 탭 콘텐츠 ══ */}

      {/* 🏠 내 페이지 — 기본 정보 + 디자인 합침 */}
      <div className={activeTab === "page" ? "flex flex-col gap-4" : "hidden"}>
        <BasicTab
          name={name} setName={setName}
          shopName={shopName} setShopName={setShopName}
          tagline={tagline} setTagline={setTagline}
          description={description} setDesc={setDesc}
          location={location} setLocation={setLocation}
          hours={hours} setHours={setHours}
          parkingInfo={parkingInfo} setParkingInfo={setParkingInfo}
          instagramId={instagramId} setInstaId={setInstaId}
          kakaoUrl={kakaoUrl} setKakaoUrl={setKakaoUrl}
          kakaoBookingUrl={kakaoBookingUrl} setKakaoBk={setKakaoBk}
          naverBookingUrl={naverBookingUrl} setNaverBk={setNaverBk}
          phoneUrl={phoneUrl} setPhoneUrl={setPhoneUrl}
          instaDmUrl={instaDmUrl} setInstaDmUrl={setInstaDmUrl}
          kakaoChanUrl={kakaoChanUrl} setKakaoChan={setKakaoChan}
          imageUrl={imageUrl} setImageUrl={setImageUrl}
          category={category} setCategory={setCategory}
          isProPlan={isProPlan}
          aiLoading={aiLoading}
          onAISuggest={aiSuggest}
        />
        <DesignTab theme={theme} setTheme={setTheme} plan={plan} />
      </div>

      {/* 🔗 서비스·메뉴 */}
      <div className={activeTab === "service" ? "flex flex-col gap-4" : "hidden"}>
        <ServiceTab
          services={services} setServices={setServices}
          servicesLimit={limits.services === Infinity ? undefined : limits.services}
          invalidServiceIndex={invalidServiceIndex}
          customLinks={customLinks} setCustomLinks={setCustomLinks}
          businessHours={businessHours} setBusinessHours={setBusinessHours}
          isPaidPlan={isPaidPlan} isProPlan={isProPlan}
          category={category} setCategory={setCategory}
          aiLoading={aiLoading} onAISuggest={aiSuggest}
        />
      </div>

      {/* 🖼️ 사진·후기 */}
      <div className={activeTab === "content" ? "flex flex-col gap-4" : "hidden"}>
        <ContentTab
          gallery={gallery} setGallery={setGallery}
          galleryLimit={limits.gallery === Infinity ? undefined : limits.gallery}
          reviews={reviews} setReviews={setReviews}
          reviewsLimit={limits.reviews === Infinity ? undefined : limits.reviews}
          profileSlug={profile.slug}
        />
      </div>

      {/* ⚙️ 설정 — 모든 플랜, Pro 전용 기능만 내부 게이트 */}
      <div className={activeTab === "settings" ? "flex flex-col gap-4" : "hidden"}>
        <AdvancedTab
          isProPlan={isProPlan}
          sectionOrder={sectionOrder} setSectionOrder={setSectionOrder}
          galleryLayout={galleryLayout} setGalleryLayout={setGalleryLayout}
          buttonColor={buttonColor} setButtonColor={setButtonColor}
          buttonTextColor={buttonTextColor} setButtonTextColor={setButtonTextColor}
        />
      </div>

      {/* ── 저장 버튼 ── */}
      <div className="flex flex-col gap-2 pb-8">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all disabled:opacity-50 ${
              saveStatus === "saved" ? "bg-green-500" :
              saveStatus === "error" ? "bg-red-500"   :
              "bg-foreground hover:opacity-80"
            }`}
          >
            {isPending ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                저장 중…
              </>
            ) : saveStatus === "saved" ? (
              <>✓ 저장됨</>
            ) : saveStatus === "error" ? (
              <>다시 저장하기</>
            ) : (
              "저장하고 페이지 공개하기"
            )}
          </button>
          <Link
            href="/dashboard"
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-(--muted) hover:bg-(--secondary) transition-colors"
          >
            취소
          </Link>
        </div>
        {saveStatus === "saved" && !showPostSave && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-green-600">✓ 변경사항이 페이지에 즉시 반영됐습니다.</p>
            {profile.slug && (
              <a
                href={`/${profile.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                완성페이지 보기 →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
