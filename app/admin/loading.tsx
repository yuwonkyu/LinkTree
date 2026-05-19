/**
 * /admin 경로의 스트리밍 로딩 UI
 * 다수의 Supabase 쿼리 완료 전에 즉시 스켈레톤을 표시 → FCP 개선
 */
export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-(--secondary)">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="h-5 w-32 rounded bg-black/[0.07] animate-pulse" />
          <div className="h-5 w-20 rounded bg-black/5 animate-pulse" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 flex flex-col gap-6 animate-pulse">
        {/* 매출 요약 카드 4개 */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl bg-white p-4 shadow-[0_2px_12px_rgba(17,24,39,0.06)]">
              <div className="h-3 w-16 rounded bg-black/6" />
              <div className="mt-2 h-7 w-20 rounded bg-black/8" />
            </div>
          ))}
        </div>

        {/* 회원 통계 블록 */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(17,24,39,0.06)]">
          <div className="grid grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 rounded bg-black/6" />
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="rounded-xl bg-(--secondary) p-3">
                      <div className="h-3 w-16 rounded bg-black/6" />
                      <div className="mt-1 h-5 w-10 rounded bg-black/8" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 테이블 스켈레톤 */}
        <div className="rounded-2xl bg-white shadow-[0_2px_12px_rgba(17,24,39,0.06)] overflow-hidden">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="h-4 w-40 rounded bg-black/6" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 border-b border-gray-50 px-4 py-3">
              <div className="h-4 w-20 rounded bg-black/5" />
              <div className="h-4 w-24 rounded bg-black/5" />
              <div className="h-4 w-12 rounded bg-black/5" />
              <div className="h-4 w-16 rounded bg-black/5" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
