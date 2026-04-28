"use client";

import Link from "next/link";
import { useState, useTransition, useEffect, useRef } from "react";
import { saveProfile, type SaveProfilePayload } from "./actions";
import type { Profile, Service, Review, Theme, CustomLink, GalleryImage, BusinessHours, GalleryLayout } from "@/lib/types";
import { PLAN_LIMITS, toPlanKey } from "@/lib/plan-limits";
import BasicTab    from "@/components/edit/tabs/BasicTab";
import DesignTab   from "@/components/edit/tabs/DesignTab";
import ServiceTab  from "@/components/edit/tabs/ServiceTab";
import ContentTab  from "@/components/edit/tabs/ContentTab";
import AdvancedTab from "@/components/edit/tabs/AdvancedTab";

// ── 타입 & 상수 ──────────────────────────────────────────
type TabKey = "basic" | "design" | "service" | "content" | "advanced";

const TAB_LIST = [
  { key: "basic",    label: "기본 정보",    icon: "📋" },
  { key: "design",   label: "디자인",       icon: "🎨" },
  { key: "service",  label: "서비스 & 링크", icon: "🔗" },
  { key: "content",  label: "콘텐츠",       icon: "🖼️" },
] as const;

const ADVANCED_TAB = { key: "advanced", label: "고급 설정", icon: "⚙️" } as const;

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
  const [category,   setCategory]   = useState("카페");
  const [activeTab,  setActiveTab]  = useState<TabKey>("basic");
  const [aiLoading,  setAiLoading]  = useState<string | null>(null);
  const [saveError,  setSaveError]  = useState<string | null>(null);
  const [isPending,  startTransition] = useTransition();

  const isFirstRender = useRef(true);
  const [isDirty,      setIsDirty]      = useState(false);
  const [saveStatus,   setSaveStatus]   = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [showPostSave, setShowPostSave] = useState(false);
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
        setAiNotice(false);
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => setSaveStatus("idle"), 3000);
      } catch (e) {
        if (typeof e === "object" && e !== null && "digest" in e) throw e;
        const msg = e instanceof Error ? e.message : "저장 중 오류가 발생했습니다.";
        setSaveError(msg);
        setSaveStatus("error");
      }
    });
  }

  // ── 렌더 ──────────────────────────────────────────────────
  const allTabs = isProPlan
    ? [...TAB_LIST, ADVANCED_TAB] as { key: TabKey; label: string; icon: string }[]
    : [...TAB_LIST]               as { key: TabKey; label: string; icon: string }[];

  return (
    <div className="flex flex-col gap-5">

      {/* ── 저장 후 모달 ── */}
      {showPostSave && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={() => setShowPostSave(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-xl">🎉</span>
              <p className="text-base font-bold text-foreground">저장 완료!</p>
            </div>
            <p className="ml-11 text-sm text-(--muted)">변경사항이 내 페이지에 즉시 반영됐어요.</p>
            <div className="mt-5 flex flex-col gap-2">
              {profile.slug && (
                <a
                  href={`/${profile.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-xl bg-foreground py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-85"
                >
                  완성페이지 보러가기 →
                </a>
              )}
              <Link
                href="/dashboard"
                className="block w-full rounded-xl border border-gray-200 py-2.5 text-center text-sm font-medium text-foreground hover:bg-(--secondary) transition-colors"
              >
                대시보드로 이동
              </Link>
              <button
                type="button"
                onClick={() => setShowPostSave(false)}
                className="w-full py-2 text-xs text-(--muted) hover:text-foreground transition-colors"
              >
                계속 편집하기
              </button>
            </div>
          </div>
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
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{saveError}</div>
      )}

      {/* ══ 탭 콘텐츠 ══ */}
      <div className={activeTab === "basic" ? "flex flex-col gap-4" : "hidden"}>
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
      </div>

      <div className={activeTab === "design" ? "flex flex-col gap-4" : "hidden"}>
        <DesignTab theme={theme} setTheme={setTheme} plan={plan} />
      </div>

      <div className={activeTab === "service" ? "flex flex-col gap-4" : "hidden"}>
        <ServiceTab
          services={services} setServices={setServices}
          servicesLimit={limits.services === Infinity ? undefined : limits.services}
          customLinks={customLinks} setCustomLinks={setCustomLinks}
          businessHours={businessHours} setBusinessHours={setBusinessHours}
          isPaidPlan={isPaidPlan} isProPlan={isProPlan}
          category={category} setCategory={setCategory}
          aiLoading={aiLoading} onAISuggest={aiSuggest}
        />
      </div>

      <div className={activeTab === "content" ? "flex flex-col gap-4" : "hidden"}>
        <ContentTab
          gallery={gallery} setGallery={setGallery}
          galleryLimit={limits.gallery === Infinity ? undefined : limits.gallery}
          reviews={reviews} setReviews={setReviews}
          reviewsLimit={limits.reviews === Infinity ? undefined : limits.reviews}
          profileSlug={profile.slug}
        />
      </div>

      <div className={activeTab === "advanced" ? "flex flex-col gap-4" : "hidden"}>
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
