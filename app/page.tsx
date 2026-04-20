import Link from "next/link";

const plans = [
  { name: "Free", price: "0원", description: "기본 페이지" },
  { name: "Basic", price: "29,000원/월", description: "AI 추천, 방문자 통계" },
  { name: "Pro", price: "49,000원/월", description: "모든 기능" },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-(--secondary) text-foreground">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="text-base font-bold tracking-tight">
            InstaLink
          </Link>
          <nav className="flex items-center gap-2 text-sm font-medium">
            <Link
              href="/auth/login"
              className="rounded-lg px-3 py-1.5 text-(--muted) transition hover:text-foreground"
            >
              로그인
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border border-black/10 px-3 py-1.5 transition hover:bg-white"
            >
              대시보드
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-14 sm:px-6">
        <div className="rounded-3xl bg-(--card) px-6 py-10 shadow-[0_4px_20px_rgba(17,24,39,0.06)] sm:px-10 sm:py-14">
          <p className="text-sm font-semibold text-(--muted)">소상공인용 인스타 링크 SaaS</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
            인스타 하나로 고객을 내 가게로
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-(--muted) sm:text-base">
            링크트리 대신 서비스 소개, 후기, 카카오 문의까지 한 페이지에 담아
            신규 고객의 문의 전환을 높이세요.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/auth/signup"
              className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-85"
            >
              무료로 시작하기
            </Link>
            <Link
              href="/sample-gym"
              className="rounded-xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold transition hover:bg-black/5"
            >
              예시 보기
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
        <h2 className="text-xl font-bold">핵심 기능</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
            <h3 className="text-base font-semibold">📋 서비스 목록 + 가격 한눈에</h3>
            <p className="mt-2 text-sm leading-6 text-(--muted)">
              고객이 궁금해하는 서비스와 가격 정보를 깔끔하게 정리해 전달합니다.
            </p>
          </article>
          <article className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
            <h3 className="text-base font-semibold">⭐ 실제 후기 자동 진열</h3>
            <p className="mt-2 text-sm leading-6 text-(--muted)">
              사회적 증거를 한 화면에서 보여줘 신뢰도를 빠르게 높입니다.
            </p>
          </article>
          <article className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
            <h3 className="text-base font-semibold">💬 카카오로 바로 문의</h3>
            <p className="mt-2 text-sm leading-6 text-(--muted)">
              상담 버튼 클릭 한 번으로 카카오 문의까지 자연스럽게 연결됩니다.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="text-xl font-bold">플랜 비교</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-black/5 bg-(--card) shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-black/5">
                <th className="px-4 py-3 font-semibold text-foreground">플랜</th>
                <th className="px-4 py-3 font-semibold text-foreground">가격</th>
                <th className="px-4 py-3 font-semibold text-foreground">제공 기능</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.name} className="border-t border-black/5">
                  <td className="px-4 py-3 font-medium text-foreground">{plan.name}</td>
                  <td className="px-4 py-3 text-(--muted)">{plan.price}</td>
                  <td className="px-4 py-3 text-(--muted)">{plan.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="border-t border-black/5 px-4 py-8 text-center text-sm text-(--muted) sm:px-6">
        © 2025 InstaLink
      </footer>
    </main>
  );
}
