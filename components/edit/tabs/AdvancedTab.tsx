import Section from "@/components/edit/Section";
import type { GalleryLayout } from "@/lib/types";

export type AdvancedTabProps = {
  isProPlan: boolean;
  sectionOrder: string[];        setSectionOrder: (v: string[]) => void;
  galleryLayout: GalleryLayout;  setGalleryLayout: (v: GalleryLayout) => void;
  buttonColor: string;           setButtonColor: (v: string) => void;
  buttonTextColor: string;       setButtonTextColor: (v: string) => void;
};

const SECTION_LABEL: Record<string, string> = {
  services: "서비스 & 가격",
  gallery:  "포트폴리오 · 갤러리",
  reviews:  "고객 후기",
};

export default function AdvancedTab({
  isProPlan,
  sectionOrder, setSectionOrder,
  galleryLayout, setGalleryLayout,
  buttonColor, setButtonColor,
  buttonTextColor, setButtonTextColor,
}: AdvancedTabProps) {
  if (!isProPlan) return null;

  return (
    <>
      {/* ── 섹션 순서 ── */}
      <Section title="섹션 순서 (Pro)">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-(--muted)">↑ ↓ 버튼으로 공개 페이지의 섹션 순서를 조정하세요.</p>
          {sectionOrder.map((key, idx) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-xl bg-(--secondary) px-4 py-2.5"
            >
              <span className="text-sm font-medium text-foreground">
                {SECTION_LABEL[key] ?? key}
              </span>
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
          ))}
        </div>
      </Section>

      {/* ── 갤러리 레이아웃 ── */}
      <Section title="갤러리 레이아웃 (Pro)">
        <p className="mb-3 text-xs text-(--muted)">고객 페이지에서 갤러리를 표시할 방식을 선택하세요.</p>
        <div className="grid grid-cols-2 gap-2">
          {(["grid3", "grid2"] as GalleryLayout[]).map((layout) => (
            <button
              key={layout}
              type="button"
              onClick={() => setGalleryLayout(layout)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-colors ${
                galleryLayout === layout
                  ? "border-foreground bg-foreground/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className={`grid w-full gap-0.5 ${layout === "grid2" ? "grid-cols-2" : "grid-cols-3"}`}>
                {Array.from({ length: layout === "grid2" ? 4 : 6 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-sm bg-gray-200" />
                ))}
              </div>
              <span className="text-xs font-semibold text-foreground">
                {layout === "grid3" ? "3열 (기본)" : "2열 (큰 사진)"}
              </span>
              <span className="text-[10px] text-(--muted)">
                {layout === "grid3" ? "더 많은 사진 표시" : "사진이 크게 표시됨"}
              </span>
            </button>
          ))}
        </div>
      </Section>

      {/* ── 버튼 컬러 커스텀 ── */}
      <Section title="버튼 컬러 커스텀 (Pro)">
        <div className="flex flex-col gap-4">
          {/* 배경색 */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-(--muted)">버튼 배경색</p>
            <p className="text-xs text-(--muted)">커스텀 링크·전화 버튼의 배경 컬러를 선택하세요.</p>
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

          {/* 텍스트색 */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-(--muted)">버튼 텍스트 색</p>
            <p className="text-xs text-(--muted)">배경색에 맞게 텍스트 색을 선택하세요. (기본: 흰색)</p>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={buttonTextColor || "#ffffff"}
                onChange={(e) => setButtonTextColor(e.target.value)}
                className="h-10 w-12 cursor-pointer rounded-lg border border-gray-200 p-0.5"
              />
              <span className="text-sm font-mono text-foreground">{buttonTextColor || "#ffffff"}</span>
              {buttonTextColor && (
                <button
                  type="button"
                  onClick={() => setButtonTextColor("")}
                  className="text-xs text-(--muted) hover:text-foreground"
                >
                  초기화 (흰색)
                </button>
              )}
            </div>
            {buttonColor && (
              <div
                className="flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold"
                style={{ backgroundColor: buttonColor, color: buttonTextColor || "#ffffff" }}
              >
                버튼 미리보기
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
