import Link from "next/link";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import DonationSection from "@/components/landing/DonationSection";
import { PLAN_META, type Plan } from "@/lib/types";
import { PLAN_FEATURE_ROWS } from "@/lib/plan-features";

// ── 정적 데이터 ────────────────────────────────────────────
const THEME_EXAMPLES = [
  {
    slug: "/sample",
    theme: "라이트",
    industry: "PT 트레이너",
    bg: "#ffffff",
    accent: "#111827",
    fg: "#111827",
    muted: "#6b7280",
    card: "#f5f5f5",
  },
  {
    slug: "/sample2",
    theme: "다크",
    industry: "필라테스 강사",
    bg: "#121212",
    accent: "#FEE500",
    fg: "#f3f4f6",
    muted: "#cbd5e1",
    card: "#1e1e1e",
  },
  {
    slug: "/sample3",
    theme: "웜리넨",
    industry: "헤어 디자이너",
    bg: "#f8f2e9",
    accent: "#b58458",
    fg: "#3a2c22",
    muted: "#725b49",
    card: "#fff9f0",
  },
];

const TARGETS = [
  { emoji: "🏪", label: "소상공인" },
  { emoji: "🏋️", label: "PT 트레이너" },
  { emoji: "🧘", label: "필라테스 강사" },
  { emoji: "✂️", label: "헤어 디자이너" },
  { emoji: "💅", label: "네일 아티스트" },
  { emoji: "☕", label: "카페 사장님" },
  { emoji: "🐾", label: "펫샵 원장님" },
  { emoji: "💆", label: "피부관리사" },
];

const FEATURES = [
  {
    emoji: "📋",
    title: "서비스 목록 + 가격 한눈에",
    desc: "고객이 제일 먼저 궁금해하는 것, 바로 \"얼마예요?\". 서비스별 가격을 깔끔하게 정리해 물어보기 전에 미리 답합니다.",
  },
  {
    emoji: "🖼️",
    title: "포트폴리오·갤러리 통합",
    desc: "작업물·매장 사진을 갤러리로 올리면 고객 신뢰도가 올라갑니다. 클릭하면 크게 볼 수 있어요.",
  },
  {
    emoji: "📅",
    title: "카카오·네이버 예약 바로 연결",
    desc: "카카오 예약, 네이버 예약, 오픈채팅까지 버튼 하나로 연결. 예약 과정의 마찰을 없애세요.",
  },
  {
    emoji: "⭐",
    title: "실제 후기로 신뢰 쌓기",
    desc: "\"좋았어요\" 한마디가 열 번의 설명보다 낫습니다. 후기를 한 화면에 모아 처음 오는 고객도 안심하게 만드세요.",
  },
  {
    emoji: "🎨",
    title: "UI 커스터마이징 — 내 브랜드 색으로",
    desc: "라이트·다크·따뜻한 리넨 등 6가지 테마. Pro 플랜은 버튼 색상도 브랜드 컬러로 맞출 수 있어요.",
  },
  {
    emoji: "📊",
    title: "방문자 통계 한눈에",
    desc: "오늘 몇 명이 내 페이지를 봤는지, 어떤 링크를 클릭했는지 대시보드에서 바로 확인합니다.",
  },
];

const TESTIMONIALS = [
  {
    text: "링크트리는 그냥 링크 모음인데, InstaLink는 진짜 내 가게 소개 페이지예요. 고객들이 \"홈페이지 있어요?\" 하면 이거 보내줘요.",
    author: "박○○ PT 트레이너",
    location: "강남",
  },
  {
    text: "카카오 버튼 달고 나서 DM으로 가격 묻는 사람이 확 줄었어요. 다들 페이지 보고 바로 상담 신청해요.",
    author: "이○○ 헤어 디자이너",
    location: "홍대",
  },
  {
    text: "설정 5분이면 끝나요. 사진 올리고 가격 입력하면 끝. 이걸 왜 이제 알았지 싶어요.",
    author: "김○○ 필라테스 원장",
    location: "성수",
  },
];

const FAQS = [
  {
    q: "무료 플랜은 정말 무료인가요?",
    a: "네, 카드 등록 없이 영원히 무료로 사용할 수 있습니다. 기본 프로필 페이지를 무제한으로 운영할 수 있어요.",
  },
  {
    q: "카카오 상담 버튼 연결이 가능한가요?",
    a: "Basic 플랜부터 카카오 오픈채팅 링크를 연결할 수 있어요. 버튼 하나로 고객이 바로 상담 신청할 수 있습니다.",
  },
  {
    q: "모바일에서도 쉽게 수정할 수 있나요?",
    a: "물론입니다! 대시보드는 모바일 최적화가 되어 있어, 스마트폰에서도 언제든지 내용을 수정할 수 있어요.",
  },
  {
    q: "나중에 요금제를 변경할 수 있나요?",
    a: "언제든지 업그레이드하거나 다운그레이드할 수 있습니다. 구독을 취소해도 잔여 결제 기간 동안은 기존 플랜이 유지됩니다.",
  },
];

const PLANS: Plan[] = ["free", "basic", "pro"];

// ── 서브 컴포넌트 ────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg className="mx-auto h-5 w-5 text-foreground" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function DashIcon() {
  return <span className="mx-auto block h-0.5 w-4 rounded bg-black/15" />;
}

function CellValue({ v }: { v: string | boolean }) {
  if (v === true)  return <CheckIcon />;
  if (v === false) return <DashIcon />;
  return <span className="text-xs font-medium">{v}</span>;
}

// ── 페이지 ────────────────────────────────────────────────────
export default function Page() {
  return (
    <main className="min-h-screen bg-(--secondary) pb-20 text-foreground sm:pb-0">
      <LandingHeader wide />

      {/* 히어로 */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-4 pt-14 sm:px-6">
        <div className="rounded-3xl bg-(--card) px-6 py-12 shadow-[0_4px_20px_rgba(17,24,39,0.06)] sm:px-12 sm:py-16">
          <div className="flex flex-wrap items-center gap-2">
            <p className="inline-block rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-(--muted)">
              PT · 필라테스 · 미용 · 카페 소상공인용
            </p>
            <p className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
              ✓ 무료로 시작 가능
            </p>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            나만의 링크 페이지를
            <br />
            <span className="text-(--muted)">1분 만에 만드세요</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-(--muted) sm:text-base">
            링크트리는 그냥 링크 목록이에요.
            <br />
            InstaLink는{" "}
            <strong className="font-semibold text-foreground">
              포트폴리오 + 예약 + 후기 + 카카오 상담
            </strong>
            까지 한 페이지에 담아 고객을 직접 문의로 이끕니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/auth/signup"
              className="rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-white transition hover:opacity-85"
            >
              지금 무료로 시작하기 →
            </Link>
            <Link
              href="/sample"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold transition hover:bg-black/5"
            >
              예시 페이지 보기
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
            {["카드 등록 없음", "가입만 하면 바로 사용", "즉시 공유 가능", "영원히 무료 플랜 제공"].map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-xs text-(--muted)">
                <span className="text-green-500 font-bold">✔</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 테마별 예시 미리보기 */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
        <p className="text-center text-sm font-semibold text-(--muted)">테마별 예시 페이지</p>
        <p className="mt-1 text-center text-xs text-(--muted)">내 업종·분위기에 맞는 테마를 골라보세요</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {THEME_EXAMPLES.map((ex) => (
            <a
              key={ex.slug}
              href={ex.slug}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 shadow-[0_2px_12px_rgba(17,24,39,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(17,24,39,0.12)]"
              style={{ background: ex.bg }}
            >
              <div className="p-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 shrink-0 rounded-full" style={{ background: ex.muted, opacity: 0.35 }} />
                  <div className="flex flex-col gap-1">
                    <div className="h-2 w-20 rounded-full" style={{ background: ex.fg, opacity: 0.7 }} />
                    <div className="h-1.5 w-14 rounded-full" style={{ background: ex.accent, opacity: 0.6 }} />
                  </div>
                </div>
                <div className="mt-3 h-6 w-full rounded-lg" style={{ background: ex.accent, opacity: 0.85 }} />
                <div className="mt-2.5 flex flex-col gap-1.5">
                  {[{ w: "w-16" }, { w: "w-14" }].map((row, i) => (
                    <div key={i} className="flex justify-between rounded-lg px-2 py-1.5" style={{ background: ex.card }}>
                      <div className={`h-1.5 ${row.w} rounded-full self-center`} style={{ background: ex.fg, opacity: 0.5 }} />
                      <div className="h-1.5 w-10 rounded-full self-center" style={{ background: ex.fg, opacity: 0.7 }} />
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="flex items-center justify-between border-t px-4 py-2.5"
                style={{ borderColor: `${ex.fg}15`, background: ex.card }}
              >
                <div>
                  <p className="text-xs font-bold" style={{ color: ex.fg }}>{ex.theme}</p>
                  <p className="text-[11px]" style={{ color: ex.muted }}>{ex.industry}</p>
                </div>
                <span
                  className="text-xs font-semibold opacity-60 transition group-hover:opacity-100"
                  style={{ color: ex.accent }}
                >
                  보기 →
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 타겟 섹션 */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
        <p className="text-center text-sm font-semibold text-(--muted)">이런 분들이 쓰고 있어요</p>
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-8">
          {TARGETS.map((t) => (
            <div
              key={t.label}
              className="flex flex-col items-center gap-2 rounded-2xl bg-(--card) p-4 shadow-[0_2px_12px_rgba(17,24,39,0.05)]"
            >
              <span className="text-2xl">{t.emoji}</span>
              <span className="text-center text-xs font-medium leading-tight">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Before / After */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6">
        <div className="rounded-3xl bg-(--card) px-6 py-10 shadow-[0_4px_20px_rgba(17,24,39,0.06)] sm:px-10">
          <h2 className="text-xl font-bold sm:text-2xl">바이오 링크, 이렇게 달라요</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-(--muted)">
                Before — 링크트리
              </p>
              <ul className="space-y-2 text-sm text-(--muted)">
                <li>🔗 인스타 링크</li>
                <li>🔗 예약 링크</li>
                <li>🔗 블로그 링크</li>
                <li className="pt-2 text-xs opacity-60">→ 고객이 어디를 눌러야 할지 모름</li>
                <li className="text-xs opacity-60">→ 가격 물어보는 DM 계속 옴</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-foreground">
                After — InstaLink
              </p>
              <ul className="space-y-2 text-sm">
                <li>✅ 서비스 + 가격 한눈에</li>
                <li>✅ 실제 후기 바로 확인</li>
                <li>✅ 카카오 상담 버튼 한 번에</li>
                <li className="pt-2 text-xs text-(--muted)">→ 고객이 보고 바로 상담 신청</li>
                <li className="text-xs text-(--muted)">→ 가격 DM 대신 예약 DM이 옴</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 기능 소개 */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6">
        <h2 className="text-xl font-bold sm:text-2xl">꼭 필요한 것만 담았어요</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="rounded-2xl bg-(--card) p-6 shadow-[0_4px_20px_rgba(17,24,39,0.06)]"
            >
              <span className="text-2xl">{f.emoji}</span>
              <h3 className="mt-3 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-(--muted)">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 요금제 */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6">
        <h2 className="text-xl font-bold sm:text-2xl">요금제</h2>
        <p className="mt-1 text-sm text-(--muted)">처음엔 무료로, 성장하면 그때 올리세요.</p>

        {/* 플랜 카드 */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {PLANS.map((plan) => {
            const meta = PLAN_META[plan];
            const isHighlight = plan === "basic";
            const isFree      = plan === "free";
            return (
              <div
                key={plan}
                className={`relative rounded-2xl p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)] ${
                  isHighlight
                    ? "border-2 border-foreground bg-foreground text-white shadow-[0_8px_30px_rgba(17,24,39,0.18)]"
                    : "border border-black/5 bg-(--card)"
                }`}
              >
                {isHighlight && (
                  <span className="absolute -top-3 left-4 rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-bold text-white">
                    가장 인기
                  </span>
                )}
                {/* 플랜명 */}
                <p className={`text-xs font-bold uppercase tracking-widest ${isHighlight ? "opacity-60" : "text-(--muted)"}`}>
                  {meta.label}
                </p>
                {/* 가격 */}
                <p className="mt-1.5 text-2xl font-extrabold">
                  {meta.price === 0 ? "₩0" : `₩${meta.price.toLocaleString()}`}
                  {meta.price > 0 && <span className={`ml-1 text-sm font-normal ${isHighlight ? "opacity-60" : "text-(--muted)"}`}>/월</span>}
                </p>
                <p className={`mt-0.5 text-xs ${isHighlight ? "opacity-60" : "text-(--muted)"}`}>
                  {meta.price === 0 ? "영원히 무료 · 카드 등록 없음" : "언제든 해지 가능"}
                </p>
                {/* CTA */}
                <Link
                  href="/auth/signup"
                  className={`mt-4 block rounded-xl py-2.5 text-center text-sm font-bold transition ${
                    isHighlight
                      ? "bg-white text-foreground hover:opacity-90"
                      : isFree
                        ? "border-2 border-foreground bg-foreground text-white hover:opacity-85"
                        : "border border-black/10 hover:bg-black/5"
                  }`}
                >
                  {isFree ? "무료로 시작하기" : isHighlight ? "이 플랜으로 시작하기" : "Pro 시작하기"}
                </Link>
              </div>
            );
          })}
        </div>

        {/* 기능 비교 테이블 */}
        <div className="mt-3 overflow-hidden rounded-2xl border border-black/5 bg-(--card) shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/5">
                <th className="px-4 py-3 text-left font-semibold text-(--muted)">기능</th>
                {PLANS.map((plan) => (
                  <th key={plan} className={`px-4 py-3 text-center font-semibold ${plan === "basic" ? "text-foreground" : "text-(--muted)"}`}>
                    {PLAN_META[plan].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLAN_FEATURE_ROWS.map((row) => (
                <tr key={row.label} className="border-t border-black/5">
                  <td className="px-4 py-2.5 text-left text-(--muted)">{row.label}</td>
                  <td className="px-4 py-2.5 text-center"><CellValue v={row.free} /></td>
                  <td className="px-4 py-2.5 text-center"><CellValue v={row.basic} /></td>
                  <td className="px-4 py-2.5 text-center"><CellValue v={row.pro} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 후기 */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6">
        <h2 className="text-xl font-bold sm:text-2xl">실제 사용자 후기</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.author}
              className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]"
            >
              <p className="text-sm leading-6 text-(--muted)">&#8220;{t.text}&#8221;</p>
              <footer className="mt-3 text-xs font-semibold">
                {t.author} · {t.location}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6">
        <h2 className="text-xl font-bold sm:text-2xl">자주 묻는 질문</h2>
        <div className="mt-4 flex flex-col divide-y divide-black/5 overflow-hidden rounded-2xl bg-(--card) shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group px-6 py-4">
              <summary className="flex cursor-pointer select-none list-none items-center justify-between gap-4 text-sm font-semibold">
                {faq.q}
                <span className="shrink-0 text-(--muted) transition-transform group-open:rotate-180">▾</span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-(--muted)">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 후원 */}
      <DonationSection />

      {/* 최종 CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <div className="rounded-3xl bg-foreground px-6 py-12 text-center text-white shadow-[0_8px_40px_rgba(17,24,39,0.2)] sm:px-12 sm:py-16">
          <p className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
            🎁 무료 플랜 — 카드 등록 없음
          </p>
          <h2 className="mt-4 text-2xl font-extrabold sm:text-4xl">
            지금 무료로 시작하세요
          </h2>
          <p className="mt-4 text-sm leading-7 opacity-70 sm:text-base">
            가입만 하면 바로 내 링크 페이지가 만들어집니다.
            <br />
            5분 안에 인스타 바이오에 붙여보세요.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup"
              className="w-full rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-foreground transition hover:opacity-90 sm:w-auto"
            >
              무료로 내 페이지 만들기 →
            </Link>
            <Link
              href="/sample"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-xl border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              예시 페이지 먼저 보기
            </Link>
          </div>
          <p className="mt-4 text-xs opacity-50">회원가입 없이 예시 페이지를 바로 확인할 수 있어요.</p>
        </div>
      </section>

      <LandingFooter />

      {/* 모바일 Sticky CTA — 모바일에서만 표시 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 sm:hidden">
        <Link
          href="/auth/signup"
          className="flex w-full items-center justify-center rounded-xl bg-foreground py-3.5 text-sm font-bold text-white shadow-[0_4px_24px_rgba(17,24,39,0.3)] transition hover:opacity-85 active:opacity-70"
        >
          무료로 시작하기 →
        </Link>
      </div>
    </main>
  );
}
