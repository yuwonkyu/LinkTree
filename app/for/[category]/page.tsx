import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";
import { PLAN_META } from "@/lib/types";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";

// ── 카테고리 데이터 ────────────────────────────────────────────
type CategoryMeta = {
  label: string;
  headline: string;
  subheadline: string;
  painPoint: string;
  benefit: string;
  services: string[];
  sampleSlug?: string;
  keywords: string[];
};

const CATEGORIES: Record<string, CategoryMeta> = {
  pt: {
    label: "PT 트레이너",
    headline: "PT 트레이너를 위한 인스타 링크 페이지",
    subheadline: "서비스·가격·후기·카카오 상담을 한 페이지에 담아 신규 회원 전환을 높이세요.",
    painPoint: "인스타 바이오 링크가 단순 카카오 링크뿐이라 고객이 이탈하고 있지 않으신가요?",
    benefit: "PT 1회·10회·20회 패키지 가격을 한눈에 보여주고 카카오로 바로 상담 연결",
    services: ["PT 1회", "PT 10회 패키지", "PT 20회 패키지", "체성분 분석", "식단 관리"],
    keywords: ["PT 트레이너 링크 페이지", "헬스 트레이너 인스타 링크", "퍼스널 트레이닝 홈페이지"],
  },
  pilates: {
    label: "필라테스 강사",
    headline: "필라테스 강사를 위한 인스타 링크 페이지",
    subheadline: "그룹·개인 레슨 일정과 가격을 정리하고 네이버·카카오 예약까지 연결하세요.",
    painPoint: "수강 문의가 DM으로 분산되어 관리가 어렵지 않으신가요?",
    benefit: "레슨 종류별 가격 공개 + 네이버 예약 버튼으로 즉시 예약 전환",
    services: ["그룹 필라테스", "개인 레슨 1회", "개인 레슨 10회 패키지", "소도구 클래스"],
    keywords: ["필라테스 강사 링크", "필라테스 인스타 프로필", "필라테스 예약 링크"],
  },
  yoga: {
    label: "요가 강사",
    headline: "요가 강사를 위한 인스타 링크 페이지",
    subheadline: "클래스 일정, 가격, 후기를 한 페이지에 정리하고 신규 수강생을 유치하세요.",
    painPoint: "인스타 프로필 링크 하나로 클래스 안내부터 예약까지 해결하고 싶지 않으신가요?",
    benefit: "클래스 종류별 안내 + 카카오 문의 버튼으로 수강 전환율 향상",
    services: ["하타 요가", "빈야사 플로우", "아침 요가 클래스", "명상 클래스"],
    keywords: ["요가 강사 링크", "요가 인스타 프로필 링크", "요가 클래스 예약"],
  },
  salon: {
    label: "미용실·헤어샵",
    headline: "미용실·헤어샵을 위한 인스타 링크 페이지",
    subheadline: "시술 메뉴와 가격을 정리하고 카카오·네이버 예약으로 고객을 유입하세요.",
    painPoint: "시술 가격을 DM으로 일일이 답변하느라 지치지 않으셨나요?",
    benefit: "시술 메뉴별 가격 공개 + 예약 버튼으로 문의 없이 바로 예약",
    services: ["컷", "펌", "염색", "클리닉 트리트먼트", "두피 케어"],
    keywords: ["미용실 인스타 링크", "헤어샵 링크 페이지", "미용실 예약 링크"],
  },
  nail: {
    label: "네일 아티스트",
    headline: "네일 아티스트를 위한 인스타 링크 페이지",
    subheadline: "젤 네일·아트 메뉴와 가격을 한 페이지에 정리하고 예약을 자동화하세요.",
    painPoint: "인스타 DM으로 들어오는 가격 문의에 매번 답하느라 시간을 낭비하고 있지 않으신가요?",
    benefit: "시술별 가격표 공개 + 포트폴리오 링크 + 카카오 예약 버튼",
    services: ["기본 젤 네일", "아트 추가", "발 젤 네일", "네일 제거", "케어 + 네일"],
    keywords: ["네일 아티스트 링크", "네일샵 인스타 프로필", "네일 예약 링크"],
  },
  cafe: {
    label: "카페·베이커리",
    headline: "카페·베이커리를 위한 인스타 링크 페이지",
    subheadline: "메뉴와 위치, 영업시간을 한 페이지에 담아 인스타 방문자를 실제 고객으로 전환하세요.",
    painPoint: "인스타 팔로워는 많은데 실제 방문으로 이어지지 않아 고민이신가요?",
    benefit: "메뉴·가격·위치·영업시간 한눈에 + 카카오 문의 버튼",
    services: ["아메리카노", "라떼", "시그니처 음료", "브런치 세트", "케이크 조각"],
    keywords: ["카페 인스타 링크", "카페 프로필 링크", "베이커리 링크 페이지"],
  },
  freelancer: {
    label: "프리랜서·크리에이터",
    headline: "프리랜서·크리에이터를 위한 인스타 링크 페이지",
    subheadline: "서비스 포트폴리오와 가격을 정리하고 클라이언트 문의를 한 곳에서 받으세요.",
    painPoint: "링크트리 기본 페이지로는 서비스 설명이 부족해 문의 전환이 낮지 않으신가요?",
    benefit: "서비스별 가격·기간 안내 + 카카오·인스타 문의 버튼",
    services: ["기본 패키지", "스탠다드 패키지", "프리미엄 패키지", "단건 의뢰"],
    keywords: ["프리랜서 링크 페이지", "크리에이터 인스타 프로필", "포트폴리오 링크"],
  },
};

type PageProps = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORIES[category];
  if (!meta) return { title: "Not Found" };

  const SITE = getSiteUrl();
  return {
    title: meta.headline,
    description: meta.subheadline,
    keywords: meta.keywords.join(", "),
    alternates: { canonical: `${SITE}/for/${category}` },
    openGraph: {
      type: "website",
      url: `${SITE}/for/${category}`,
      title: meta.headline,
      description: meta.subheadline,
      siteName: "InstaLink",
    },
    twitter: { card: "summary_large_image", title: meta.headline, description: meta.subheadline },
  };
}

export default async function CategoryLandingPage({ params }: PageProps) {
  const { category } = await params;
  const meta = CATEGORIES[category];
  if (!meta) notFound();

  const SITE = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "InstaLink",
    applicationCategory: "BusinessApplication",
    description: meta.headline,
    url: `${SITE}/for/${category}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
      description: `무료로 시작, Basic ${PLAN_META.basic.price.toLocaleString()}원/월, Pro ${PLAN_META.pro.price.toLocaleString()}원/월`,
    },
  };

  const otherCategories = Object.entries(CATEGORIES).filter(([key]) => key !== category);

  return (
    <main className="min-h-screen bg-(--secondary) text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
        }}
      />

      <LandingHeader wide={false} />

      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        {/* 히어로 */}
        <section className="rounded-3xl bg-(--card) px-6 py-10 shadow-[0_4px_20px_rgba(17,24,39,0.06)] sm:px-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-(--muted)">
            {meta.label} 전용
          </p>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {meta.headline}
          </h1>
          <p className="mt-4 text-sm leading-7 text-(--muted) sm:text-base">
            {meta.subheadline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/auth/signup"
              className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-80"
            >
              무료로 시작하기
            </Link>
            {meta.sampleSlug && (
              <Link
                href={`/${meta.sampleSlug}`}
                className="rounded-xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold transition hover:bg-black/5"
              >
                예시 보기
              </Link>
            )}
          </div>
        </section>

        {/* 페인 포인트 */}
        <section className="mt-6 rounded-2xl bg-(--card) px-6 py-6 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <p className="text-base font-semibold text-foreground">혹시 이런 고민 있으신가요?</p>
          <p className="mt-2 text-sm leading-7 text-(--muted)">{meta.painPoint}</p>
          <div className="mt-4 rounded-xl bg-(--secondary) px-4 py-3">
            <p className="text-sm font-medium text-foreground">InstaLink 해결책</p>
            <p className="mt-1 text-sm text-(--muted)">{meta.benefit}</p>
          </div>
        </section>

        {/* 서비스 목록 예시 */}
        <section className="mt-6 rounded-2xl bg-(--card) px-6 py-6 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <h2 className="text-base font-bold text-foreground">
            이런 서비스 목록을 바로 만들 수 있어요
          </h2>
          <ul className="mt-4 space-y-2">
            {meta.services.map((service) => (
              <li key={service} className="flex items-center gap-2 text-sm text-(--muted)">
                <span className="text-green-500">✓</span>
                {service}
              </li>
            ))}
          </ul>
        </section>

        {/* 요금제 */}
        <section className="mt-6 rounded-2xl bg-(--card) px-6 py-6 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <h2 className="text-base font-bold text-foreground">간단한 요금제</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {(["free", "basic", "pro"] as const).map((plan) => {
              const m = PLAN_META[plan];
              return (
                <div key={plan} className="rounded-xl bg-(--secondary) p-4">
                  <p className="text-sm font-bold text-foreground">{m.label}</p>
                  <p className="mt-1 text-base font-bold text-foreground">
                    {m.price === 0 ? "무료" : `${m.price.toLocaleString()}원/월`}
                  </p>
                  <p className="mt-1 text-xs text-(--muted)">
                    {m.features.slice(0, 2).join(", ")}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-6 rounded-2xl bg-foreground px-6 py-8 text-center text-white shadow-[0_4px_20px_rgba(17,24,39,0.12)]">
          <h2 className="text-lg font-bold">지금 바로 무료로 만들어보세요</h2>
          <p className="mt-2 text-sm opacity-75">신용카드 불필요 · 5분 설정 · 언제든지 취소</p>
          <Link
            href="/auth/signup"
            className="mt-5 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-white/90"
          >
            무료로 시작하기 →
          </Link>
        </section>

        {/* 다른 업종 */}
        <section className="mt-6 rounded-2xl bg-(--card) px-6 py-6 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <h2 className="mb-4 text-sm font-semibold text-(--muted)">다른 업종도 확인해보세요</h2>
          <div className="flex flex-wrap gap-2">
            {otherCategories.map(([key, c]) => (
              <Link
                key={key}
                href={`/for/${key}`}
                className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-(--secondary)"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <LandingFooter />
    </main>
  );
}
