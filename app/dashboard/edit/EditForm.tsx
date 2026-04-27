"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { saveProfile, type SaveProfilePayload } from "./actions";
import type { Profile, Service, Review, Theme, CustomLink, GalleryImage } from "@/lib/types";
import { PLAN_LIMITS, toPlanKey } from "@/lib/plan-limits";
import ThemeSelector   from "@/components/dashboard/ThemeSelector";
import ServiceManager  from "@/components/dashboard/ServiceManager";
import ReviewManager   from "@/components/dashboard/ReviewManager";
import LinkManager     from "@/components/dashboard/LinkManager";
import GalleryManager  from "@/components/dashboard/GalleryManager";

// ─── 업종별 예시 템플릿 ──────────────────────────────────────
const CATEGORIES = ["PT/헬스", "필라테스/요가", "미용실/네일", "카페", "프리랜서/크리에이터"];

type TemplateSet = { taglines: string[]; descriptions: string[]; services: Service[] };

const TEMPLATES: Record<string, TemplateSet> = {
  "PT/헬스": {
    taglines: [
      "여성 전문 1:1 PT · 체형교정 · 다이어트",
      "결과로 증명하는 1:1 맞춤 퍼스널트레이닝",
      "6주 바디 체인지 — 맞춤 PT 전문 트레이너",
    ],
    descriptions: [
      "✔ 여성 전문 1:1 맞춤 PT\n✔ 체형교정 · 다이어트 · 근력 향상\n✔ 식단 + 운동 통합 관리\n✔ 첫 상담 무료 — 카카오로 문의하세요",
      "✔ 경력 10년 이상 전문 트레이너\n✔ 개인 맞춤 운동 프로그램 설계\n✔ 체형 분석 · 자세 교정 전문\n✔ 소규모 운영으로 밀착 케어",
    ],
    services: [
      { name: "PT 1회", price: "80,000원" },
      { name: "PT 10회 패키지", price: "700,000원", note: "회당 70,000원" },
      { name: "PT 20회 패키지", price: "1,200,000원", note: "회당 60,000원" },
      { name: "인바디 측정", price: "무료" },
    ],
  },
  "필라테스/요가": {
    taglines: [
      "소규모 프라이빗 필라테스 스튜디오",
      "호흡부터 다시 — 필라테스로 건강하게",
      "정원 4명 소그룹 · 1:1 개인 필라테스",
    ],
    descriptions: [
      "✔ 소그룹(4명 이하) & 1:1 프라이빗 수업\n✔ 척추 측만 · 거북목 · 체형교정 전문\n✔ 임산부 · 산후 필라테스 가능\n✔ 카카오로 체험 수업 신청하세요",
      "✔ 기구 · 매트 필라테스 전 과정 운영\n✔ 개인 체형 분석 후 맞춤 수업 설계\n✔ 편안한 분위기의 여성 전용 스튜디오\n✔ 당일 예약 가능 (카카오 문의)",
    ],
    services: [
      { name: "그룹 필라테스 1회", price: "25,000원" },
      { name: "그룹 10회 패키지", price: "220,000원", note: "회당 22,000원" },
      { name: "1:1 듀엣 1회", price: "50,000원" },
      { name: "1:1 개인 레슨 1회", price: "80,000원" },
    ],
  },
  "미용실/네일": {
    taglines: [
      "트렌드 컬러 전문 — 당신만의 헤어 스타일",
      "섬세한 케어로 만드는 나만의 스타일",
      "헤어 · 네일 · 케어 토털 뷰티 살롱",
    ],
    descriptions: [
      "✔ 트렌드 컬러 · 펌 · 케라틴 트리트먼트 전문\n✔ 두피 케어 · 클리닉 서비스 운영\n✔ 예약제 운영 — 대기 없이 편안하게\n✔ SNS 참고 사진 지참 환영",
      "✔ 젤 · 아크릴 · 아트 네일 전 과정\n✔ 내추럴 & 화려한 디자인 모두 가능\n✔ 당일 예약 가능 (카카오 문의)\n✔ 재방문 고객 할인 혜택 제공",
    ],
    services: [
      { name: "커트", price: "30,000원" },
      { name: "펌", price: "80,000원~" },
      { name: "염색 (탈색 제외)", price: "70,000원~" },
      { name: "젤 네일 (손)", price: "40,000원~" },
    ],
  },
  "카페": {
    taglines: [
      "직접 로스팅하는 스페셜티 커피 한 잔",
      "동네 감성 카페 · 매일 오전 8시 오픈",
      "커피 한 잔, 조용한 공간, 잠깐의 쉼",
    ],
    descriptions: [
      "✔ 매주 직접 로스팅하는 스페셜티 원두\n✔ 시즌 한정 디저트 & 브런치 메뉴 운영\n✔ 노트북 작업 & 소모임 환영\n✔ 대용량 사이즈 · 오트밀크 변경 가능",
      "✔ 에티오피아 · 콜롬비아 싱글 오리진 상시\n✔ 핸드드립 · 에스프레소 · 콜드브루 전문\n✔ 주차 1대 · 반려동물 동반 가능\n✔ 텀블러 지참 시 300원 할인",
    ],
    services: [
      { name: "아메리카노", price: "4,500원" },
      { name: "카페라떼", price: "5,500원" },
      { name: "핸드드립", price: "7,000원~" },
      { name: "케이크 (조각)", price: "6,500원" },
    ],
  },
  "프리랜서/크리에이터": {
    taglines: [
      "브랜드 디자인 & 콘텐츠 제작 전문",
      "기획부터 편집까지 — 원스톱 크리에이터",
      "당신의 아이디어를 결과물로 만듭니다",
    ],
    descriptions: [
      "✔ 브랜드 로고 · 상세페이지 · SNS 콘텐츠 디자인\n✔ 유튜브 · 릴스 영상 편집 전문\n✔ 런칭 3일 내 시안 1차 전달\n✔ 수정 2회 무료 포함",
      "✔ 스마트스토어 · 쿠팡 상세페이지 제작\n✔ 인스타그램 피드 통합 디자인\n✔ 빠른 납기 · 합리적인 가격\n✔ 포트폴리오 확인 후 상담 진행",
    ],
    services: [
      { name: "SNS 콘텐츠 디자인 (1건)", price: "30,000원~" },
      { name: "로고 디자인", price: "150,000원~" },
      { name: "상세페이지 제작", price: "200,000원~" },
      { name: "영상 편집 (1분)", price: "80,000원~" },
    ],
  },
};

// ─── 최근 이미지 (localStorage) ─────────────────
const RECENT_IMG_KEY = "instalink_recent_images";

function getRecentImages(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(RECENT_IMG_KEY) ?? "[]"); }
  catch { return []; }
}

function pushRecentImage(url: string): string[] {
  const next = [url, ...getRecentImages().filter((u) => u !== url)].slice(0, 3);
  localStorage.setItem(RECENT_IMG_KEY, JSON.stringify(next));
  return next;
}

// ─── 섹션 래퍼 ──────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(17,24,39,0.06)]">
      <h2 className="mb-4 text-sm font-semibold text-foreground">{title}</h2>
      {children}
    </div>
  );
}

// ─── 입력 필드 ──────────────────────────────────
function Field({
  label, value, onChange, placeholder, multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const base =
    "w-full rounded-xl border border-gray-200 bg-(--secondary) px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors";
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-(--muted)">{label}</label>
      {multiline ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} className={`${base} resize-none`} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} className={base} />
      )}
    </div>
  );
}

// ─── 예시 선택 패널 (태그라인 / 설명용) ───────────────
function HintPanel({
  type,
  category,
  onCategoryChange,
  onSelect,
  isProPlan,
  aiLoading,
  onAISuggest,
}: {
  type: "taglines" | "descriptions";
  category: string;
  onCategoryChange: (c: string) => void;
  onSelect: (v: string) => void;
  isProPlan: boolean;
  aiLoading: string | null;
  onAISuggest: () => void;
}) {
  const items = TEMPLATES[category]?.[type] ?? [];
  const aiType = type === "taglines" ? "tagline" : "description";

  return (
    <div className="rounded-xl border border-gray-100 bg-(--secondary) p-3">
      {/* 업종 선택 */}
      <div className="mb-2.5 flex items-center gap-2">
        <span className="text-xs text-(--muted)">업종</span>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-foreground outline-none focus:border-gray-400"
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* 예시 목록 */}
      <div className="flex flex-col gap-1.5">
        {items.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => onSelect(text)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-xs text-foreground hover:border-gray-400 transition-colors"
          >
            {text}
          </button>
        ))}
      </div>

      {/* AI 보조 옵션 (Pro 플랜) */}
      {isProPlan && (
        <button
          type="button"
          onClick={onAISuggest}
          disabled={aiLoading === aiType}
          className="mt-2.5 text-xs text-blue-400 hover:text-blue-600 disabled:opacity-50"
        >
          {aiLoading === aiType ? "생성 중…" : "✨ AI로 직접 작성하기"}
        </button>
      )}
    </div>
  );
}

// ─── 메인 컴포넌트 ──────────────────────────────
type Props = { profile: Profile; plan?: string };

const DEFAULT_SECTION_ORDER = ["services", "gallery", "reviews"];

export default function EditForm({ profile, plan }: Props) {
  const planKey    = toPlanKey(plan);
  const limits     = PLAN_LIMITS[planKey];
  const isPaidPlan = planKey === "basic" || planKey === "pro";
  const isProPlan  = planKey === "pro";

  // 기본 정보
  const [name,            setName]      = useState(profile.name ?? "");
  const [shopName,        setShopName]  = useState(profile.shop_name ?? "");
  const [tagline,         setTagline]   = useState(profile.tagline ?? "");
  const [description,     setDesc]      = useState(profile.description ?? "");
  const [kakaoUrl,        setKakaoUrl]    = useState(profile.kakao_url ?? "");
  const [kakaoBookingUrl, setKakaoBk]     = useState(profile.kakao_booking_url ?? "");
  const [naverBookingUrl, setNaverBk]     = useState(profile.naver_booking_url ?? "");
  const [phoneUrl,        setPhoneUrl]    = useState(profile.phone_url ?? "");
  const [instaDmUrl,      setInstaDmUrl]  = useState(profile.instagram_dm_url ?? "");
  const [kakaoChanUrl,    setKakaoChan]   = useState(profile.kakao_channel_url ?? "");
  const [instagramId,     setInstaId]     = useState(profile.instagram_id ?? "");
  const [location,        setLocation]  = useState(profile.location ?? "");
  const [hours,           setHours]     = useState(profile.hours ?? "");
  const [imageUrl,        setImageUrl]  = useState(profile.image_url ?? "");

  // 테마 · 서비스 · 후기 · 커스텀 링크
  const [theme,        setTheme]       = useState<Theme>(profile.theme ?? "light");
  const [services,     setServices]    = useState<Service[]>(profile.services ?? []);
  const [reviews,      setReviews]     = useState<Review[]>(profile.reviews ?? []);
  const [customLinks,  setCustomLinks] = useState<CustomLink[]>(profile.custom_links ?? []);
  const [gallery,      setGallery]     = useState<GalleryImage[]>(profile.gallery ?? []);
  const [parkingInfo,  setParkingInfo] = useState(profile.parking_info ?? "");

  // Pro 전용: 섹션 순서 + 버튼 컬러
  const [sectionOrder, setSectionOrder] = useState<string[]>(
    profile.section_order ?? [...DEFAULT_SECTION_ORDER]
  );
  const [buttonColor,  setButtonColor]  = useState(profile.button_color ?? "");

  // 업종 (예시/AI 공통)
  const [category, setCategory] = useState("카페");

  // 예시 패널 토글
  const [showTaglineHints, setShowTaglineHints] = useState(false);
  const [showDescHints,    setShowDescHints]    = useState(false);

  // 최근 이미지
  const [recentImages, setRecentImages] = useState<string[]>([]);
  useEffect(() => { setRecentImages(getRecentImages()); }, []);

  // AI · 저장
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // UX: 미저장 변경 추적 · 저장 상태 · 저장 후 모달 · AI 생성 안내
  const isFirstRender = useRef(true);
  const [isDirty, setIsDirty]         = useState(false);
  const [saveStatus, setSaveStatus]   = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [showPostSave, setShowPostSave] = useState(false);
  const [aiNotice, setAiNotice]       = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 어느 필드든 바뀌면 isDirty = true (첫 렌더는 스킵)
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setIsDirty(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, shopName, tagline, description, kakaoUrl, kakaoBookingUrl,
      naverBookingUrl, phoneUrl, instaDmUrl, kakaoChanUrl, instagramId,
      location, hours, imageUrl, theme, services, reviews, customLinks,
      gallery, parkingInfo, sectionOrder, buttonColor]);

  // ── AI 추천 ──
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
        body: JSON.stringify({ type, shopName, category, existing: type === "description" ? description : undefined }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        const msg = typeof json.error === "string" ? json.error : (json.error?.message ?? `오류가 발생했습니다. (${res.status})`);
        alert(msg);
        return;
      }
      const { result } = json;
      if (type === "tagline")     setTagline(result.split("\n")[0] ?? result);
      if (type === "description") setDesc(result);
      if (type === "services" && Array.isArray(result)) setServices(result);
      setAiNotice(true); // AI 생성 안내 표시
    } catch {
      alert("AI 추천 실패. 잠시 후 다시 시도해주세요.");
    } finally {
      setAiLoading(null);
    }
  }

  // ── 저장 ──
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
      section_order: isProPlan ? sectionOrder : undefined,
      button_color:  isProPlan ? buttonColor  : undefined,
    };
    startTransition(async () => {
      try {
        await saveProfile(payload);
        // 저장 성공
        setIsDirty(false);
        setSaveStatus("saved");
        setShowPostSave(true);
        setAiNotice(false);
        // 3초 후 저장 상태 초기화
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => setSaveStatus("idle"), 3000);
      } catch (e) {
        // Next.js redirect()는 내부적으로 특수 예외를 throw함 — 다시 던져야 함
        if (typeof e === "object" && e !== null && "digest" in e) throw e;
        const msg = e instanceof Error ? e.message : "저장 중 오류가 발생했습니다.";
        setSaveError(msg);
        setSaveStatus("error");
      }
    });
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ── 저장 후 모달 ── */}
      {showPostSave && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center" onClick={() => setShowPostSave(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
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
              <a
                href="/dashboard"
                className="block w-full rounded-xl border border-gray-200 py-2.5 text-center text-sm font-medium text-foreground hover:bg-(--secondary) transition-colors"
              >
                대시보드로 이동
              </a>
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
            <p className="mt-0.5 text-xs text-blue-700">실제 운영 전 반드시 내용을 직접 확인하고 수정해주세요. AI 내용을 그대로 사용하면 고객에게 부정확한 정보가 전달될 수 있습니다.</p>
          </div>
          <button type="button" onClick={() => setAiNotice(false)} className="shrink-0 text-blue-400 hover:text-blue-600 text-sm">✕</button>
        </div>
      )}

      {saveError && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{saveError}</div>
      )}

      {/* ── 기본 정보 ── */}
      <Section title="기본 정보">
        <div className="mb-3 rounded-xl bg-blue-50 border border-blue-100 px-3.5 py-3">
          <p className="text-xs font-semibold text-blue-800">💡 TIP</p>
          <p className="mt-0.5 text-xs text-blue-700 leading-relaxed">
            이름과 한 줄 소개는 고객이 제일 먼저 보는 정보예요. 내 전문성과 강점이 한눈에 보이도록 작성해주세요.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Field label="이름 (고객에게 표시됨)" value={name} onChange={setName} placeholder="김지수 트레이너" />
          <Field label="브랜드명 / 상호" value={shopName} onChange={setShopName} placeholder="FIT WITH JI" />

          {/* 태그라인 + 예시 */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-(--muted)">한 줄 소개 (태그라인)</label>
              <button
                type="button"
                onClick={() => { setShowTaglineHints((v) => !v); setShowDescHints(false); }}
                className="text-xs font-medium text-(--muted) hover:text-foreground transition-colors"
              >
                {showTaglineHints ? "닫기" : "📝 예시 보기"}
              </button>
            </div>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="다이어트 · 체형교정 · 여성 전문 PT"
              className="rounded-xl border border-gray-200 bg-(--secondary) px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors"
            />
            {showTaglineHints && (
              <HintPanel
                type="taglines"
                category={category}
                onCategoryChange={setCategory}
                onSelect={(v) => { setTagline(v); setShowTaglineHints(false); }}
                isProPlan={isProPlan}
                aiLoading={aiLoading}
                onAISuggest={() => aiSuggest("tagline")}
              />
            )}
          </div>

          {/* 상세 소개 + 예시 */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-(--muted)">상세 소개</label>
              <button
                type="button"
                onClick={() => { setShowDescHints((v) => !v); setShowTaglineHints(false); }}
                className="text-xs font-medium text-(--muted) hover:text-foreground transition-colors"
              >
                {showDescHints ? "닫기" : "📝 예시 보기"}
              </button>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="✔ 여성 전문 1:1 PT&#10;✔ 식단 + 운동 통합 관리"
              className="resize-none rounded-xl border border-gray-200 bg-(--secondary) px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors"
            />
            {showDescHints && (
              <HintPanel
                type="descriptions"
                category={category}
                onCategoryChange={setCategory}
                onSelect={(v) => { setDesc(v); setShowDescHints(false); }}
                isProPlan={isProPlan}
                aiLoading={aiLoading}
                onAISuggest={() => aiSuggest("description")}
              />
            )}
          </div>

          <Field label="위치"            value={location}    onChange={setLocation}    placeholder="서울 서초구 방배동" />
          <Field label="운영시간"         value={hours}       onChange={setHours}       placeholder="평일 07:00 ~ 21:00" />
          <Field label="주차 안내 (선택)" value={parkingInfo} onChange={setParkingInfo}  placeholder="건물 내 무료 주차 2시간 · 발레파킹 가능" />
          <Field label="인스타그램 ID"    value={instagramId} onChange={setInstaId}     placeholder="fitwithji" />
          <Field label="카카오 오픈채팅 URL"     value={kakaoUrl}        onChange={setKakaoUrl} placeholder="https://open.kakao.com/o/..." />
          <Field label="카카오 예약 URL (선택)" value={kakaoBookingUrl} onChange={setKakaoBk}  placeholder="https://pf.kakao.com/..." />
          <Field label="네이버 예약 URL (선택)" value={naverBookingUrl} onChange={setNaverBk}  placeholder="https://booking.naver.com/..." />
          <Field label="전화 연결 (선택)"        value={phoneUrl}        onChange={setPhoneUrl} placeholder="010-1234-5678" />
          <Field label="인스타 DM URL (선택)"    value={instaDmUrl}      onChange={setInstaDmUrl} placeholder="https://ig.me/m/아이디" />
          <Field label="카카오채널 URL (선택)"   value={kakaoChanUrl}    onChange={setKakaoChan}  placeholder="https://pf.kakao.com/_채널아이디" />
        </div>
      </Section>

      {/* ── 프로필 이미지 ── */}
      <Section title="프로필 이미지">
        <div className="flex flex-col gap-3">
          {imageUrl && (
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-gray-200">
              <Image src={imageUrl} alt="프로필" fill sizes="96px" quality={90} className="object-cover" />
            </div>
          )}
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "instalink_unsigned"}
            options={{ sources: ["local" as const, "camera" as const] }}
            onSuccess={(result) => {
              if (result.event === "success" && typeof result.info === "object" && result.info !== null && "secure_url" in result.info) {
                const url = result.info.secure_url as string;
                setImageUrl(url);
                setRecentImages(pushRecentImage(url));
              }
            }}
          >
            {({ open }) => (
              <button type="button" onClick={() => open()}
                className="w-fit rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-foreground hover:bg-(--secondary) transition-colors">
                {imageUrl ? "이미지 변경" : "이미지 업로드"}
              </button>
            )}
          </CldUploadWidget>
          {imageUrl && (
            <button type="button" onClick={() => setImageUrl("")} className="w-fit text-xs text-red-400 hover:text-red-600">
              이미지 제거
            </button>
          )}

          {/* 최근 업로드 썸네일 */}
          {recentImages.filter((u) => u !== imageUrl).length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-(--muted)">최근 업로드</p>
              <div className="flex gap-2">
                {recentImages.filter((u) => u !== imageUrl).map((url) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setImageUrl(url)}
                    className="relative h-16 w-16 overflow-hidden rounded-xl border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    title="이 이미지로 변경"
                  >
                    <Image src={url} alt="최근 이미지" fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* ── 테마 ── */}
      <Section title="테마">
        <ThemeSelector selected={theme} onChange={setTheme} plan={plan} />
      </Section>

      {/* ── 서비스 ── */}
      <Section title="서비스 &amp; 가격">
        <ServiceManager
          services={services}
          isPaidPlan={isPaidPlan}
          isProPlan={isProPlan}
          limit={limits.services === Infinity ? undefined : limits.services}
          aiLoading={aiLoading}
          onAISuggest={() => aiSuggest("services")}
          onChange={setServices}
          category={category}
          onCategoryChange={setCategory}
          templateServices={TEMPLATES[category]?.services ?? []}
        />
      </Section>

      {/* ── 추가 링크 ── */}
      <Section title="추가 링크 (선택)">
        <LinkManager links={customLinks} onChange={setCustomLinks} />
      </Section>

      {/* ── 갤러리 ── */}
      <Section title="포트폴리오 · 갤러리 (선택)">
        <GalleryManager
          images={gallery}
          onChange={setGallery}
          limit={limits.gallery === Infinity ? undefined : limits.gallery}
        />
      </Section>

      {/* ── 후기 ── */}
      <Section title="고객 후기">
        <ReviewManager
          reviews={reviews}
          onChange={setReviews}
          limit={limits.reviews === Infinity ? undefined : limits.reviews}
          reviewUrl={profile.slug ? `/${profile.slug}/review` : undefined}
        />
      </Section>

      {/* ── Pro: 섹션 순서 ── */}
      {isProPlan && (
        <Section title="섹션 순서 (Pro)">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-(--muted)">↑ ↓ 버튼으로 공개 페이지의 섹션 순서를 조정하세요.</p>
            {sectionOrder.map((key, idx) => {
              const labelMap: Record<string, string> = {
                services: "서비스 & 가격",
                gallery:  "포트폴리오 · 갤러리",
                reviews:  "고객 후기",
              };
              return (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-xl bg-(--secondary) px-4 py-2.5"
                >
                  <span className="text-sm font-medium text-foreground">{labelMap[key] ?? key}</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const next = [...sectionOrder];
                        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                        setSectionOrder(next);
                      }}
                      className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-sm text-foreground disabled:opacity-30 hover:bg-gray-50 transition-colors"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={idx === sectionOrder.length - 1}
                      onClick={() => {
                        const next = [...sectionOrder];
                        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                        setSectionOrder(next);
                      }}
                      className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-sm text-foreground disabled:opacity-30 hover:bg-gray-50 transition-colors"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* ── Pro: 버튼 컬러 ── */}
      {isProPlan && (
        <Section title="버튼 컬러 커스텀 (Pro)">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-(--muted)">
              커스텀 링크·전화 버튼에 적용되는 포인트 컬러를 선택하세요.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={buttonColor || "#111827"}
                onChange={(e) => setButtonColor(e.target.value)}
                className="h-10 w-12 cursor-pointer rounded-lg border border-gray-200 p-0.5"
              />
              <span className="text-sm font-mono text-foreground">{buttonColor || "#111827"}</span>
              {buttonColor && (
                <button
                  type="button"
                  onClick={() => setButtonColor("")}
                  className="text-xs text-(--muted) hover:text-foreground"
                >
                  초기화
                </button>
              )}
            </div>
          </div>
        </Section>
      )}

      {/* ── 저장 버튼 ── */}
      <div className="flex flex-col gap-2 pb-8">
        <div className="flex gap-3">
          <button type="button" onClick={handleSave} disabled={isPending}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all disabled:opacity-50 ${
              saveStatus === "saved"  ? "bg-green-500" :
              saveStatus === "error"  ? "bg-red-500" :
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
          <a href="/dashboard"
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-(--muted) hover:bg-(--secondary) transition-colors">
            취소
          </a>
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
