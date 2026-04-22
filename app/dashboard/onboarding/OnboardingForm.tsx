"use client";

import { useState, useTransition } from "react";
import { saveOnboarding } from "./actions";
import type { Service } from "@/lib/types";

const CATEGORIES = [
  { id: "PT/헬스",              label: "PT / 헬스",                emoji: "🏋️" },
  { id: "필라테스/요가",        label: "필라테스 / 요가",            emoji: "🧘" },
  { id: "미용실/네일",          label: "미용실 / 네일",              emoji: "✂️" },
  { id: "카페",                 label: "카페 / 음료",                emoji: "☕" },
  { id: "프리랜서/크리에이터",  label: "프리랜서 / 크리에이터",      emoji: "🎨" },
  { id: "기타",                 label: "기타",                       emoji: "📌" },
];

type TemplateData = {
  tagline: string;
  description: string;
  services: Service[];
};

const TEMPLATES: Record<string, TemplateData> = {
  "PT/헬스": {
    tagline: "여성 전문 1:1 PT · 체형교정 · 다이어트",
    description: "✔ 여성 전문 1:1 맞춤 PT\n✔ 체형교정 · 다이어트 · 근력 향상\n✔ 식단 + 운동 통합 관리\n✔ 첫 상담 무료 — 카카오로 문의하세요",
    services: [
      { name: "PT 1회", price: "80,000원" },
      { name: "PT 10회 패키지", price: "700,000원", note: "회당 70,000원" },
      { name: "PT 20회 패키지", price: "1,200,000원", note: "회당 60,000원" },
    ],
  },
  "필라테스/요가": {
    tagline: "소규모 프라이빗 필라테스 스튜디오",
    description: "✔ 소그룹(4명 이하) & 1:1 프라이빗 수업\n✔ 척추 측만 · 거북목 · 체형교정 전문\n✔ 임산부 · 산후 필라테스 가능\n✔ 카카오로 체험 수업 신청하세요",
    services: [
      { name: "그룹 필라테스 1회", price: "25,000원" },
      { name: "그룹 10회 패키지", price: "220,000원", note: "회당 22,000원" },
      { name: "1:1 개인 레슨 1회", price: "80,000원" },
    ],
  },
  "미용실/네일": {
    tagline: "트렌드 컬러 전문 — 당신만의 헤어 스타일",
    description: "✔ 트렌드 컬러 · 펌 · 케라틴 트리트먼트 전문\n✔ 두피 케어 · 클리닉 서비스 운영\n✔ 예약제 운영 — 대기 없이 편안하게\n✔ SNS 참고 사진 지참 환영",
    services: [
      { name: "커트", price: "30,000원" },
      { name: "펌", price: "80,000원~" },
      { name: "염색 (탈색 제외)", price: "70,000원~" },
      { name: "젤 네일 (손)", price: "40,000원~" },
    ],
  },
  "카페": {
    tagline: "직접 로스팅하는 스페셜티 커피 한 잔",
    description: "✔ 매주 직접 로스팅하는 스페셜티 원두\n✔ 시즌 한정 디저트 & 브런치 메뉴 운영\n✔ 노트북 작업 & 소모임 환영\n✔ 대용량 사이즈 · 오트밀크 변경 가능",
    services: [
      { name: "아메리카노", price: "4,500원" },
      { name: "카페라떼", price: "5,500원" },
      { name: "핸드드립", price: "7,000원~" },
      { name: "케이크 (조각)", price: "6,500원" },
    ],
  },
  "프리랜서/크리에이터": {
    tagline: "브랜드 디자인 & 콘텐츠 제작 전문",
    description: "✔ 브랜드 로고 · 상세페이지 · SNS 콘텐츠 디자인\n✔ 유튜브 · 릴스 영상 편집 전문\n✔ 런칭 3일 내 시안 1차 전달\n✔ 수정 2회 무료 포함",
    services: [
      { name: "SNS 콘텐츠 디자인 (1건)", price: "30,000원~" },
      { name: "로고 디자인", price: "150,000원~" },
      { name: "상세페이지 제작", price: "200,000원~" },
    ],
  },
  "기타": {
    tagline: "",
    description: "",
    services: [],
  },
};

type Step = 1 | 2 | 3;

type Props = {
  defaultName: string;
};

export default function OnboardingForm({ defaultName }: Props) {
  const [step, setStep]           = useState<Step>(1);
  const [category, setCategory]   = useState("");
  const [name, setName]           = useState(defaultName);
  const [shopName, setShopName]   = useState(defaultName);
  const [tagline, setTagline]     = useState("");
  const [kakaoUrl, setKakaoUrl]   = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError]         = useState<string | null>(null);

  function handleCategorySelect(catId: string) {
    setCategory(catId);
    const tmpl = TEMPLATES[catId];
    if (tmpl?.tagline) setTagline(tmpl.tagline);
    setStep(2);
  }

  function handleSave() {
    setError(null);
    const tmpl = TEMPLATES[category] ?? { tagline: "", description: "", services: [] };
    startTransition(async () => {
      try {
        await saveOnboarding({
          name: name.trim() || defaultName,
          shop_name: shopName.trim() || name.trim() || defaultName,
          tagline: tagline.trim(),
          description: tmpl.description,
          kakao_url: kakaoUrl.trim(),
          services: tmpl.services,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
      }
    });
  }

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

  const inputCls =
    "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-(--muted) outline-none focus:border-gray-400 transition-colors";

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* 헤더 */}
      <div className="mb-6">
        <p className="text-xs font-medium text-(--muted) mb-2">Step {step} / 3</p>
        <div className="h-1.5 w-full rounded-full bg-gray-100">
          <div
            className="h-1.5 rounded-full bg-foreground transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step 1 — 업종 선택 */}
      {step === 1 && (
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">어떤 업종으로 운영하시나요?</h2>
          <p className="text-sm text-(--muted) mb-5">업종에 맞는 예시 내용이 자동으로 채워집니다.</p>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className="flex flex-col items-center gap-2 rounded-2xl border-2 border-gray-100 bg-white px-4 py-5 text-center hover:border-foreground hover:bg-(--secondary) transition-all active:scale-95"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-semibold text-foreground leading-tight">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — 기본 정보 */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-1">기본 정보를 확인해주세요</h2>
            <p className="text-sm text-(--muted)">나중에 대시보드에서 자유롭게 수정할 수 있어요.</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">이름 / 닉네임</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동 트레이너"
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">브랜드명 / 상호명</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="길동 PT 스튜디오"
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">한줄 소개</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="나를 한 줄로 표현해보세요"
              className={inputCls}
            />
            {TEMPLATES[category]?.tagline && (
              <p className="text-xs text-(--muted)">✨ 업종 예시가 자동 채워졌어요. 자유롭게 수정하세요.</p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-(--muted) hover:bg-(--secondary) transition-colors"
            >
              ← 이전
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!name.trim()}
              className="flex-[2] rounded-xl bg-foreground py-2.5 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-40 transition-opacity"
            >
              다음 →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — 카카오 링크 */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-1">카카오 오픈채팅 링크</h2>
            <p className="text-sm text-(--muted)">고객이 바로 문의할 수 있는 버튼이 생겨요.</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">카카오 오픈채팅 URL</label>
            <input
              type="url"
              value={kakaoUrl}
              onChange={(e) => setKakaoUrl(e.target.value)}
              placeholder="https://open.kakao.com/o/..."
              className={inputCls}
            />
          </div>

          <div className="rounded-xl bg-(--secondary) px-4 py-3 text-xs text-(--muted) leading-relaxed">
            💡 카카오톡 앱 → 채팅 탭 → 오픈채팅 만들기 → 링크 복사
            <br />
            <span className="mt-1 block">없으면 비워두고 나중에 추가할 수 있어요.</span>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={isPending}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-(--muted) hover:bg-(--secondary) transition-colors disabled:opacity-50"
            >
              ← 이전
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="flex-[2] rounded-xl bg-foreground py-2.5 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-60 transition-opacity"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  저장 중…
                </span>
              ) : (
                "내 페이지 완성하기 🎉"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
