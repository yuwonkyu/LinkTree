"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { saveProfile, type SaveProfilePayload } from "./actions";
import type { Profile, Service, Review, Theme } from "@/lib/types";

// ─── 테마 목록 ──────────────────────────────────
const THEMES: { id: Theme; label: string; bg: string; fg: string; accent: string }[] = [
  { id: "light",       label: "라이트",      bg: "#ffffff",  fg: "#111827", accent: "#111827" },
  { id: "dark",        label: "다크",        bg: "#121212",  fg: "#f3f4f6", accent: "#f3f4f6" },
  { id: "ucc",         label: "UCC",         bg: "#0d0221",  fg: "#f8f7ff", accent: "#ffd60a" },
  { id: "softsage",    label: "소프트세이지", bg: "#f4f8f5",  fg: "#23352d", accent: "#6f9680" },
  { id: "warmlinen",   label: "웜리넨",      bg: "#f8f2e9",  fg: "#3a2c22", accent: "#b58458" },
  { id: "energysteel", label: "에너지스틸",  bg: "#0f172a",  fg: "#e2e8f0", accent: "#a3e635" },
];

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
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${base} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={base}
        />
      )}
    </div>
  );
}

// ─── 메인 컴포넌트 ──────────────────────────────
type Props = { profile: Profile; plan?: string };

export default function EditForm({ profile, plan }: Props) {
  const isPaidPlan = plan === "basic" || plan === "pro";
  // 기본 정보
  const [name, setName]             = useState(profile.name ?? "");
  const [shopName, setShopName]     = useState(profile.shop_name ?? "");
  const [tagline, setTagline]       = useState(profile.tagline ?? "");
  const [description, setDesc]      = useState(profile.description ?? "");
  const [kakaoUrl, setKakaoUrl]     = useState(profile.kakao_url ?? "");
  const [instagramId, setInstaId]   = useState(profile.instagram_id ?? "");
  const [location, setLocation]     = useState(profile.location ?? "");
  const [hours, setHours]           = useState(profile.hours ?? "");
  const [imageUrl, setImageUrl]     = useState(profile.image_url ?? "");

  // 테마
  const [theme, setTheme]           = useState<Theme>(profile.theme ?? "light");

  // 서비스
  const [services, setServices]     = useState<Service[]>(profile.services ?? []);
  const [newSvcName, setNewSvcName] = useState("");
  const [newSvcPrice, setNewSvcPrice] = useState("");
  const [newSvcNote, setNewSvcNote] = useState("");

  // 후기
  const [reviews, setReviews]       = useState<Review[]>(profile.reviews ?? []);
  const [newRevText, setNewRevText] = useState("");
  const [newRevAuthor, setNewRevAuthor] = useState("");

  const [isPending, startTransition] = useTransition();
  const [aiLoading, setAiLoading]   = useState<string | null>(null);
  const [category, setCategory]     = useState("PT/헬스");

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
      if (type === "tagline") setTagline(result.split("\n")[0] ?? result);
      if (type === "description") setDesc(result);
      if (type === "services" && Array.isArray(result)) setServices(result);
    } catch {
      alert("AI 추천 실패. 잠시 후 다시 시도해주세요.");
    } finally {
      setAiLoading(null);
    }
  }
  const [saveError, setSaveError]   = useState<string | null>(null);

  // ── 서비스 추가 ──
  function addService() {
    if (!newSvcName.trim() || !newSvcPrice.trim()) return;
    setServices((prev) => [
      ...prev,
      { name: newSvcName.trim(), price: newSvcPrice.trim(), note: newSvcNote.trim() || undefined },
    ]);
    setNewSvcName(""); setNewSvcPrice(""); setNewSvcNote("");
  }

  function removeService(idx: number) {
    setServices((prev) => prev.filter((_, i) => i !== idx));
  }

  // ── 후기 추가 ──
  function addReview() {
    if (!newRevText.trim() || !newRevAuthor.trim()) return;
    setReviews((prev) => [...prev, { text: newRevText.trim(), author: newRevAuthor.trim() }]);
    setNewRevText(""); setNewRevAuthor("");
  }

  function removeReview(idx: number) {
    setReviews((prev) => prev.filter((_, i) => i !== idx));
  }

  // ── 저장 ──
  function handleSave() {
    setSaveError(null);
    const payload: SaveProfilePayload = {
      name, shop_name: shopName, tagline, description,
      kakao_url: kakaoUrl, instagram_id: instagramId,
      location, hours, image_url: imageUrl,
      theme, services, reviews,
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
      {/* 저장 오류 */}
      {saveError && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{saveError}</div>
      )}

      {/* ── 기본 정보 ── */}
      <Section title="기본 정보">
        <div className="flex flex-col gap-3">
          {/* 업종 선택 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-(--muted)">업종 (AI 추천용)</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-gray-200 bg-(--secondary) px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-gray-400"
            >
              {["PT/헬스","필라테스/요가","미용실/네일","카페","프리랜서/크리에이터"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <Field label="이름" value={name} onChange={setName} placeholder="뀨 PT" />
          <Field label="브랜드명 / 상호" value={shopName} onChange={setShopName} placeholder="Sample Gym" />

          {/* 태그라인 + AI 버튼 */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-(--muted)">한 줄 소개 (태그라인)</label>
              <button type="button" onClick={() => aiSuggest("tagline")} disabled={aiLoading === "tagline"}
                className="text-xs font-medium text-blue-500 hover:text-blue-700 disabled:opacity-50">
                {aiLoading === "tagline" ? "생성 중…" : "✨ AI 추천"}
              </button>
            </div>
            <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)}
              placeholder="체형교정 · 다이어트 · 1:1 PT"
              className="rounded-xl border border-gray-200 bg-(--secondary) px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors" />
          </div>

          {/* 상세 소개 + AI 버튼 */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-(--muted)">상세 소개</label>
              <button type="button" onClick={() => aiSuggest("description")} disabled={aiLoading === "description"}
                className="text-xs font-medium text-blue-500 hover:text-blue-700 disabled:opacity-50">
                {aiLoading === "description" ? "생성 중…" : "✨ AI 작성"}
              </button>
            </div>
            <textarea rows={3} value={description} onChange={(e) => setDesc(e.target.value)}
              placeholder="✔ 체형교정 전문&#10;✔ 초보자 환영"
              className="resize-none rounded-xl border border-gray-200 bg-(--secondary) px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors" />
          </div>
          <Field label="위치" value={location} onChange={setLocation} placeholder="서울 성수동" />
          <Field label="운영시간" value={hours} onChange={setHours} placeholder="평일 06:00 ~ 22:00" />
          <Field label="인스타그램 ID" value={instagramId} onChange={setInstaId} placeholder="kku._.ui" />
          <Field label="카카오 오픈채팅 URL" value={kakaoUrl} onChange={setKakaoUrl} placeholder="https://open.kakao.com/o/..." />
        </div>
      </Section>

      {/* ── 프로필 이미지 ── */}
      <Section title="프로필 이미지">
        <div className="flex flex-col gap-3">
          {imageUrl && (
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-gray-200">
              <Image src={imageUrl} alt="프로필" fill className="object-cover" sizes="96px" />
            </div>
          )}
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "instalink_unsigned"}
            onSuccess={(result) => {
              if (
                result.event === "success" &&
                typeof result.info === "object" &&
                result.info !== null &&
                "secure_url" in result.info
              ) {
                setImageUrl(result.info.secure_url as string);
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
        </div>
      </Section>

      {/* ── 테마 선택 ── */}
      <Section title="테마">
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
                theme === t.id ? "border-foreground" : "border-transparent hover:border-gray-200"
              }`}
            >
              {/* 미니 프리뷰 */}
              <div
                className="h-10 w-full rounded-lg"
                style={{ background: t.bg, border: `1.5px solid ${t.accent}33` }}
              >
                <div className="mx-2 mt-1.5 h-1.5 w-8 rounded-full" style={{ background: t.fg, opacity: 0.7 }} />
                <div className="mx-2 mt-1 h-1 w-5 rounded-full" style={{ background: t.accent, opacity: 0.8 }} />
              </div>
              <span className="text-xs font-medium text-foreground">{t.label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* ── 서비스 ── */}
      <Section title="서비스">
        <div className="mb-3 flex justify-end">
          <button type="button" onClick={() => aiSuggest("services")} disabled={aiLoading === "services"}
            className="text-xs font-medium text-blue-500 hover:text-blue-700 disabled:opacity-50">
            {aiLoading === "services" ? "생성 중…" : "✨ AI로 서비스 목록 채우기"}
          </button>
        </div>
        {/* 기존 목록 */}
        {services.length > 0 && (
          <ul className="mb-4 flex flex-col gap-2">
            {services.map((svc, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between rounded-xl bg-(--secondary) px-3.5 py-2.5"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{svc.name}</span>
                  {svc.note && <span className="text-xs text-(--muted)">{svc.note}</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">{svc.price}</span>
                  <button
                    type="button"
                    onClick={() => removeService(idx)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* 추가 폼 */}
        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-gray-200 p-3">
          <p className="text-xs font-medium text-(--muted)">서비스 추가</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSvcName}
              onChange={(e) => setNewSvcName(e.target.value)}
              placeholder="서비스명 (예: PT 1회)"
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
            <input
              type="text"
              value={newSvcPrice}
              onChange={(e) => setNewSvcPrice(e.target.value)}
              placeholder="가격 (예: 50,000원)"
              className="w-32 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>
          <input
            type="text"
            value={newSvcNote}
            onChange={(e) => setNewSvcNote(e.target.value)}
            placeholder="메모 (선택)"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
          <button
            type="button"
            onClick={addService}
            disabled={!newSvcName.trim() || !newSvcPrice.trim()}
            className="self-start rounded-lg bg-foreground px-4 py-1.5 text-sm font-medium text-white disabled:opacity-40"
          >
            + 추가
          </button>
        </div>
      </Section>

      {/* ── 후기 ── */}
      <Section title="후기">
        {/* 기존 목록 */}
        {reviews.length > 0 && (
          <ul className="mb-4 flex flex-col gap-2">
            {reviews.map((rev, idx) => (
              <li
                key={idx}
                className="flex items-start justify-between gap-3 rounded-xl bg-(--secondary) px-3.5 py-2.5"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm text-foreground">"{rev.text}"</span>
                  <span className="text-xs font-semibold text-(--muted)">— {rev.author}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeReview(idx)}
                  className="shrink-0 text-xs text-red-400 hover:text-red-600"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* 추가 폼 */}
        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-gray-200 p-3">
          <p className="text-xs font-medium text-(--muted)">후기 추가</p>
          <textarea
            rows={2}
            value={newRevText}
            onChange={(e) => setNewRevText(e.target.value)}
            placeholder="후기 내용"
            className="resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
          <input
            type="text"
            value={newRevAuthor}
            onChange={(e) => setNewRevAuthor(e.target.value)}
            placeholder="작성자 (예: 30대 여성 회원)"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
          <button
            type="button"
            onClick={addReview}
            disabled={!newRevText.trim() || !newRevAuthor.trim()}
            className="self-start rounded-lg bg-foreground px-4 py-1.5 text-sm font-medium text-white disabled:opacity-40"
          >
            + 추가
          </button>
        </div>
      </Section>

      {/* ── 저장 버튼 ── */}
      <div className="flex gap-3 pb-8">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="flex-1 rounded-xl bg-foreground py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {isPending ? "저장 중…" : "저장하고 페이지 공개하기"}
        </button>
        <a
          href="/dashboard"
          className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-(--muted) hover:bg-(--secondary) transition-colors"
        >
          취소
        </a>
      </div>
    </div>
  );
}
