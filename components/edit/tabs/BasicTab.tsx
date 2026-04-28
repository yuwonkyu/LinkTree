"use client";

import { useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import Section from "@/components/edit/Section";
import Field from "@/components/edit/Field";
import HintPanel from "@/components/edit/HintPanel";

// ── 최근 이미지 (localStorage) ──────────────────────────
const RECENT_IMG_KEY = "instalink_recent_images";

function getRecentImages(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_IMG_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function pushRecentImage(url: string): string[] {
  const next = [url, ...getRecentImages().filter((u) => u !== url)].slice(0, 3);
  localStorage.setItem(RECENT_IMG_KEY, JSON.stringify(next));
  return next;
}

// ── Props ────────────────────────────────────────────────
export type BasicTabProps = {
  name: string;          setName: (v: string) => void;
  shopName: string;      setShopName: (v: string) => void;
  tagline: string;       setTagline: (v: string) => void;
  description: string;   setDesc: (v: string) => void;
  location: string;      setLocation: (v: string) => void;
  hours: string;         setHours: (v: string) => void;
  parkingInfo: string;   setParkingInfo: (v: string) => void;
  instagramId: string;   setInstaId: (v: string) => void;
  kakaoUrl: string;         setKakaoUrl: (v: string) => void;
  kakaoBookingUrl: string;  setKakaoBk: (v: string) => void;
  naverBookingUrl: string;  setNaverBk: (v: string) => void;
  phoneUrl: string;         setPhoneUrl: (v: string) => void;
  instaDmUrl: string;       setInstaDmUrl: (v: string) => void;
  kakaoChanUrl: string;     setKakaoChan: (v: string) => void;
  imageUrl: string;      setImageUrl: (v: string) => void;
  category: string;      setCategory: (v: string) => void;
  isProPlan: boolean;
  aiLoading: string | null;
  onAISuggest: (type: "tagline" | "description" | "services") => void;
};

export default function BasicTab({
  name, setName, shopName, setShopName,
  tagline, setTagline, description, setDesc,
  location, setLocation, hours, setHours,
  parkingInfo, setParkingInfo, instagramId, setInstaId,
  kakaoUrl, setKakaoUrl, kakaoBookingUrl, setKakaoBk,
  naverBookingUrl, setNaverBk, phoneUrl, setPhoneUrl,
  instaDmUrl, setInstaDmUrl, kakaoChanUrl, setKakaoChan,
  imageUrl, setImageUrl,
  category, setCategory,
  isProPlan, aiLoading, onAISuggest,
}: BasicTabProps) {
  const [showTaglineHints, setShowTaglineHints] = useState(false);
  const [showDescHints,    setShowDescHints]    = useState(false);
  const [recentImages, setRecentImages] = useState<string[]>(getRecentImages);

  return (
    <>
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
              className="rounded-xl border border-gray-200 bg-(--secondary) px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-colors"
            />
            {showTaglineHints && (
              <HintPanel
                type="taglines"
                category={category}
                onCategoryChange={setCategory}
                onSelect={(v) => { setTagline(v); setShowTaglineHints(false); }}
                isProPlan={isProPlan}
                aiLoading={aiLoading}
                onAISuggest={() => onAISuggest("tagline")}
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
              placeholder={"✔ 여성 전문 1:1 PT\n✔ 식단 + 운동 통합 관리"}
              className="resize-none rounded-xl border border-gray-200 bg-(--secondary) px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-colors"
            />
            {showDescHints && (
              <HintPanel
                type="descriptions"
                category={category}
                onCategoryChange={setCategory}
                onSelect={(v) => { setDesc(v); setShowDescHints(false); }}
                isProPlan={isProPlan}
                aiLoading={aiLoading}
                onAISuggest={() => onAISuggest("description")}
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
              if (
                result.event === "success" &&
                typeof result.info === "object" &&
                result.info !== null &&
                "secure_url" in result.info
              ) {
                const url = result.info.secure_url as string;
                setImageUrl(url);
                setRecentImages(pushRecentImage(url));
              }
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="w-fit rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-foreground hover:bg-(--secondary) transition-colors"
              >
                {imageUrl ? "이미지 변경" : "이미지 업로드"}
              </button>
            )}
          </CldUploadWidget>
          {imageUrl && (
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="w-fit text-xs text-red-400 hover:text-red-600"
            >
              이미지 제거
            </button>
          )}

          {/* 최근 업로드 썸네일 */}
          {recentImages.filter((u) => u !== imageUrl).length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-(--muted)">최근 업로드</p>
              <div className="flex gap-2">
                {recentImages
                  .filter((u) => u !== imageUrl)
                  .map((url) => (
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
    </>
  );
}
