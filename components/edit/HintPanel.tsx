import { CATEGORIES, TEMPLATES } from "@/data/templates";

export default function HintPanel({
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
          className="flex-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-foreground outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
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

      {/* AI 추천 (Pro 전용) */}
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
