"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { saveProfile, type SaveProfilePayload } from "./actions";
import type { Profile, Service, Review, Theme } from "@/lib/types";
import ThemeSelector from "@/components/dashboard/ThemeSelector";
import ServiceManager from "@/components/dashboard/ServiceManager";
import ReviewManager  from "@/components/dashboard/ReviewManager";

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

// ─── 메인 컴포넌트 ──────────────────────────────
type Props = { profile: Profile; plan?: string };

export default function EditForm({ profile, plan }: Props) {
  const isPaidPlan = plan === "basic" || plan === "pro";

  // 기본 정보
  const [name,            setName]      = useState(profile.name ?? "");
  const [shopName,        setShopName]  = useState(profile.shop_name ?? "");
  const [tagline,         setTagline]   = useState(profile.tagline ?? "");
  const [description,     setDesc]      = useState(profile.description ?? "");
  const [kakaoUrl,        setKakaoUrl]  = useState(profile.kakao_url ?? "");
  const [kakaoBookingUrl, setKakaoBk]   = useState(profile.kakao_booking_url ?? "");
  const [naverBookingUrl, setNaverBk]   = useState(profile.naver_booking_url ?? "");
  const [instagramId,     setInstaId]   = useState(profile.instagram_id ?? "");
  const [location,        setLocation]  = useState(profile.location ?? "");
  const [hours,           setHours]     = useState(profile.hours ?? "");
  const [imageUrl,        setImageUrl]  = useState(profile.image_url ?? "");

  // 테마 · 서비스 · 후기
  const [theme,    setTheme]    = useState<Theme>(profile.theme ?? "light");
  const [services, setServices] = useState<Service[]>(profile.services ?? []);
  const [reviews,  setReviews]  = useState<Review[]>(profile.reviews ?? []);

  // AI · 저장
  const [category,  setCategory]  = useState("PT/헬스");
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // ── AI 추천 ──
  async function aiSuggest(type: "tagline" | "description" | "services") {
    if (!isPaidPlan) {
      alert("AI 추천은 Basic/Pro 플랜 전용 기능입니다.\n/billing 에서 업그레이드하세요.");
      return;
    }
    setAiLoading(type);
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, shopName, category, existing: type === "description" ? description : undefined }),
      });
      const { result, error } = await res.json();
      if (error) { alert(error); return; }
      if (type === "tagline")  setTagline(result.split("\n")[0] ?? result);
      if (type === "description") setDesc(result);
      if (type === "services" && Array.isArray(result)) setServices(result);
    } catch {
      alert("AI 추천 실패. 잠시 후 다시 시도해주세요.");
    } finally {
      setAiLoading(null);
    }
  }

  // ── 저장 ──
  function handleSave() {
    setSaveError(null);
    const payload: SaveProfilePayload = {
      name, shop_name: shopName, tagline, description,
      kakao_url: kakaoUrl, kakao_booking_url: kakaoBookingUrl,
      naver_booking_url: naverBookingUrl, instagram_id: instagramId,
      location, hours, image_url: imageUrl, theme, services, reviews,
    };
    startTransition(async () => {
      try {
        await saveProfile(payload);
      } catch (e) {
        setSaveError(e instanceof Error ? e.message : "저장 중 오류가 발생했습니다.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {saveError && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{saveError}</div>
      )}

      {/* ── 기본 정보 ── */}
      <Section title="기본 정보">
        <div className="flex flex-col gap-3">
          {/* 업종 선택 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-(--muted)">업종 (AI 추천용)</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-gray-200 bg-(--secondary) px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-gray-400">
              {["PT/헬스", "필라테스/요가", "미용실/네일", "카페", "프리랜서/크리에이터"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <Field label="이름" value={name} onChange={setName} placeholder="김지수 트레이너" />
          <Field label="브랜드명 / 상호" value={shopName} onChange={setShopName} placeholder="FIT WITH JI" />

          {/* 태그라인 + AI */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-(--muted)">한 줄 소개 (태그라인)</label>
              <button type="button" onClick={() => aiSuggest("tagline")} disabled={aiLoading === "tagline"}
                className="text-xs font-medium text-blue-500 hover:text-blue-700 disabled:opacity-50">
                {aiLoading === "tagline" ? "생성 중…" : "✨ AI 추천"}
              </button>
            </div>
            <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)}
              placeholder="다이어트 · 체형교정 · 여성 전문 PT"
              className="rounded-xl border border-gray-200 bg-(--secondary) px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors" />
          </div>

          {/* 상세 소개 + AI */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-(--muted)">상세 소개</label>
              <button type="button" onClick={() => aiSuggest("description")} disabled={aiLoading === "description"}
                className="text-xs font-medium text-blue-500 hover:text-blue-700 disabled:opacity-50">
                {aiLoading === "description" ? "생성 중…" : "✨ AI 작성"}
              </button>
            </div>
            <textarea rows={3} value={description} onChange={(e) => setDesc(e.target.value)}
              placeholder="✔ 여성 전문 1:1 PT&#10;✔ 식단 + 운동 통합 관리"
              className="resize-none rounded-xl border border-gray-200 bg-(--secondary) px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors" />
          </div>

          <Field label="위치"           value={location}  onChange={setLocation}  placeholder="서울 서초구 방배동" />
          <Field label="운영시간"        value={hours}     onChange={setHours}     placeholder="평일 07:00 ~ 21:00" />
          <Field label="인스타그램 ID"   value={instagramId} onChange={setInstaId} placeholder="fitwithji" />
          <Field label="카카오 오픈채팅 URL"     value={kakaoUrl}        onChange={setKakaoUrl}  placeholder="https://open.kakao.com/o/..." />
          <Field label="카카오 예약 URL (선택)" value={kakaoBookingUrl} onChange={setKakaoBk}   placeholder="https://pf.kakao.com/..." />
          <Field label="네이버 예약 URL (선택)" value={naverBookingUrl} onChange={setNaverBk}   placeholder="https://booking.naver.com/..." />
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
            onSuccess={(result) => {
              if (result.event === "success" && typeof result.info === "object" && result.info !== null && "secure_url" in result.info) {
                setImageUrl(result.info.secure_url as string);
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
        </div>
      </Section>

      {/* ── 테마 ── */}
      <Section title="테마">
        <ThemeSelector selected={theme} onChange={setTheme} />
      </Section>

      {/* ── 서비스 ── */}
      <Section title="서비스">
        <ServiceManager
          services={services}
          isPaidPlan={isPaidPlan}
          aiLoading={aiLoading}
          onAISuggest={() => aiSuggest("services")}
          onChange={setServices}
        />
      </Section>

      {/* ── 후기 ── */}
      <Section title="후기">
        <ReviewManager reviews={reviews} onChange={setReviews} />
      </Section>

      {/* ── 저장 버튼 ── */}
      <div className="flex gap-3 pb-8">
        <button type="button" onClick={handleSave} disabled={isPending}
          className="flex-1 rounded-xl bg-foreground py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-50">
          {isPending ? "저장 중…" : "저장하고 페이지 공개하기"}
        </button>
        <a href="/dashboard"
          className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-(--muted) hover:bg-(--secondary) transition-colors">
          취소
        </a>
      </div>
    </div>
  );
}
