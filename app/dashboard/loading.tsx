/**
 * /dashboard 경로의 스트리밍 로딩 UI
 * Supabase 쿼리 완료 전에 즉시 스켈레톤을 표시 → FCP 개선
 */
export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* 인사말 스켈레톤 */}
      <div>
        <div className="h-7 w-48 rounded-lg bg-black/[0.07]" />
        <div className="mt-2 h-4 w-36 rounded-lg bg-black/5" />
      </div>

      {/* 카드 스켈레톤 × 3 */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]"
        >
          <div className="mb-3 h-4 w-24 rounded bg-black/[0.07]" />
          <div className="h-6 w-40 rounded bg-black/5" />
          <div className="mt-2 h-4 w-32 rounded bg-black/4" />
          <div className="mt-4 flex gap-2">
            <div className="h-9 w-28 rounded-xl bg-black/[0.07]" />
            <div className="h-9 w-24 rounded-xl bg-black/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
