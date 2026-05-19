import type { Metadata } from "next";
import Link from "next/link";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import DonationSection from "@/components/landing/DonationSection";
import HeroCarousel from "@/components/landing/HeroCarousel";
import { PLAN_META, type Plan } from "@/lib/types";
import { PLAN_FEATURE_ROWS } from "@/lib/plan-features";
import { getSiteUrl } from "@/lib/site-url";
import { THEME_EXAMPLES, TARGETS, FEATURES, TESTIMONIALS, FAQS } from "@/components/landing/data";

const SITE = getSiteUrl();

// 메인 페이지 전용 metadata (layout.tsx 상속 + canonical 명시)
export const metadata: Metadata = {
  alternates: {
    canonical: SITE,
  },
};


const PLANS: Plan[] = ["free", "basic", "pro"];

// ── 서브 컴포넌트 ────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg
      className="mx-auto h-5 w-5 text-foreground"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
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
  if (v === true) return <CheckIcon />;
  if (v === false) return <DashIcon />;
  return <span className="text-xs font-medium">{v}</span>;
}

// ── 페이지 ────────────────────────────────────────────────────
const landingJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "InstaLink",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: SITE,
  description:
    "인스타그램 바이오 링크 페이지를 1분 만에 만드는 소상공인 전용 서비스. 서비스 소개·가격·후기·카카오 상담을 한 페이지에.",
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "KRW",
    },
    {
      "@type": "Offer",
      name: "Basic",
      price: String(PLAN_META.basic.price),
      priceCurrency: "KRW",
      billingIncrement: "P1M",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: String(PLAN_META.pro.price),
      priceCurrency: "KRW",
      billingIncrement: "P1M",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "120",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function Page() {
  return (
    <main className="min-h-screen bg-(--secondary) pb-20 text-foreground sm:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(landingJsonLd).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
        }}
      />
      <LandingHeader wide />

      {/* 히어로 */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-4 pt-14 sm:px-6">
        <div className="rounded-3xl bg-(--card) px-6 py-12 shadow-[0_4px_20px_rgba(17,24,39,0.06)] sm:px-12 sm:py-16">
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-12">
            {/* 좌: 텍스트 영역 */}
            <div className="flex-1 min-w-0">
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
                  href="/demo"
                  className="rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold transition hover:bg-black/5"
                >
                  👁 내 페이지 미리 만들어보기
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
                {[
                  "카드 등록 없음",
                  "가입만 하면 바로 사용",
                  "즉시 공유 가능",
                  "영원히 무료 플랜 제공",
                ].map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 text-xs text-(--muted)"
                  >
                    <span className="text-green-500 font-bold">✔</span>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* 우: 자동 전환 슬라이드 */}
            <div className="shrink-0 flex justify-center md:w-60">
              <HeroCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* 테마별 예시 미리보기 */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
        <p className="text-center text-sm font-semibold text-(--muted)">
          테마별 예시 페이지
        </p>
        <p className="mt-1 text-center text-xs text-(--muted)">
          내 업종·분위기에 맞는 테마를 골라보세요
        </p>
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
              <div className="p-5">
                {/* 프로필 영역 */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold"
                    style={{ background: ex.accent, color: ex.bg }}
                  >
                    {ex.name[0]}
                  </div>
                  <div>
                    <p
                      className="text-sm font-bold leading-tight"
                      style={{ color: ex.fg }}
                    >
                      {ex.name}
                    </p>
                    <p
                      className="mt-0.5 text-[11px] leading-tight"
                      style={{ color: ex.muted }}
                    >
                      {ex.role}
                    </p>
                  </div>
                </div>
                {/* 링크 버튼 미리보기 */}
                <div className="mt-4 flex flex-col gap-2">
                  {ex.links.map((label, i) => (
                    <div
                      key={label}
                      className="flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold"
                      style={
                        i === 0
                          ? { background: ex.accent, color: ex.bg }
                          : {
                              background: ex.card,
                              color: ex.fg,
                              border: `1px solid ${ex.fg}18`,
                            }
                      }
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              {/* 카드 하단 레이블 */}
              <div
                className="flex items-center justify-between border-t px-4 py-2.5"
                style={{ borderColor: `${ex.fg}12`, background: ex.card }}
              >
                <div>
                  <p className="text-xs font-bold" style={{ color: ex.fg }}>
                    {ex.theme}
                  </p>
                  <p className="text-[11px]" style={{ color: ex.muted }}>
                    {ex.industry}
                  </p>
                </div>
                <span
                  className="text-xs font-semibold opacity-50 transition group-hover:opacity-100"
                  style={{ color: ex.accent }}
                >
                  미리보기 →
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 타겟 섹션 */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
        <p className="text-center text-sm font-semibold text-(--muted)">
          이런 분들이 쓰고 있어요
        </p>
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-8">
          {TARGETS.map((t) => (
            <div
              key={t.label}
              className="flex flex-col items-center gap-2 rounded-2xl bg-(--card) p-4 shadow-[0_2px_12px_rgba(17,24,39,0.05)]"
            >
              <span className="text-2xl">{t.emoji}</span>
              <span className="text-center text-xs font-medium leading-tight">
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Before / After */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6">
        <div className="rounded-3xl bg-(--card) px-6 py-10 shadow-[0_4px_20px_rgba(17,24,39,0.06)] sm:px-10">
          <h2 className="text-xl font-bold sm:text-2xl">
            바이오 링크, 이렇게 달라요
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/5 bg-black/2 p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-(--muted)">
                Before — 링크트리
              </p>
              <ul className="space-y-2 text-sm text-(--muted)">
                <li>🔗 인스타 링크</li>
                <li>🔗 예약 링크</li>
                <li>🔗 블로그 링크</li>
                <li className="pt-2 text-xs opacity-60">
                  → 고객이 어디를 눌러야 할지 모름
                </li>
                <li className="text-xs opacity-60">
                  → 가격 물어보는 DM 계속 옴
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-foreground/10 bg-foreground/3 p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-foreground">
                After — InstaLink
              </p>
              <ul className="space-y-2 text-sm">
                <li>✅ 서비스 + 가격 한눈에</li>
                <li>✅ 실제 후기 바로 확인</li>
                <li>✅ 카카오 상담 버튼 한 번에</li>
                <li className="pt-2 text-xs text-(--muted)">
                  → 고객이 보고 바로 상담 신청
                </li>
                <li className="text-xs text-(--muted)">
                  → 가격 DM 대신 예약 DM이 옴
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 기능 소개 */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6">
        <h2 className="text-xl font-bold sm:text-2xl">
          꼭 필요한 것만 담았어요
        </h2>
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
        <p className="mt-1 text-sm text-(--muted)">
          처음엔 무료로, 성장하면 그때 올리세요.
        </p>

        {/* 플랜 카드 */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {PLANS.map((plan) => {
            const meta = PLAN_META[plan];
            const isHighlight = plan === "basic";
            const isFree = plan === "free";
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
                <p
                  className={`text-xs font-bold uppercase tracking-widest ${isHighlight ? "opacity-60" : "text-(--muted)"}`}
                >
                  {meta.label}
                </p>
                {/* 가격 */}
                <p className="mt-1.5 text-2xl font-extrabold">
                  {meta.price === 0 ? "₩0" : `₩${meta.price.toLocaleString()}`}
                  {meta.price > 0 && (
                    <span
                      className={`ml-1 text-sm font-normal ${isHighlight ? "opacity-60" : "text-(--muted)"}`}
                    >
                      /월
                    </span>
                  )}
                </p>
                <p
                  className={`mt-0.5 text-xs ${isHighlight ? "opacity-60" : "text-(--muted)"}`}
                >
                  {meta.price === 0
                    ? "영원히 무료 · 카드 등록 없음"
                    : "언제든 해지 가능"}
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
                  {isFree
                    ? "무료로 시작하기"
                    : isHighlight
                      ? "이 플랜으로 시작하기"
                      : "Pro 시작하기"}
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
                <th className="px-4 py-3 text-left font-semibold text-(--muted)">
                  기능
                </th>
                {PLANS.map((plan) => (
                  <th
                    key={plan}
                    className={`px-4 py-3 text-center font-semibold ${plan === "basic" ? "text-foreground" : "text-(--muted)"}`}
                  >
                    {PLAN_META[plan].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLAN_FEATURE_ROWS.map((row) => (
                <tr key={row.label} className="border-t border-black/5">
                  <td className="px-4 py-2.5 text-left text-(--muted)">
                    {row.label}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <CellValue v={row.free} />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <CellValue v={row.basic} />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <CellValue v={row.pro} />
                  </td>
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
              <p className="text-sm leading-6 text-(--muted)">
                &#8220;{t.text}&#8221;
              </p>
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
                <span className="shrink-0 text-(--muted) transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-(--muted)">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

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
              href="/sample1"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-xl border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              예시 페이지 먼저 보기
            </Link>
          </div>
          <p className="mt-4 text-xs opacity-50">
            회원가입 없이 예시 페이지를 바로 확인할 수 있어요.
          </p>
        </div>
      </section>

      {/* 후원 — 페이지 최하단 */}
      <DonationSection />

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
