import type { Metadata } from "next";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSiteUrl } from "@/lib/site-url";
import NavigationProgress from "@/components/NavigationProgress";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-PZQ8BD866G";

const SITE = getSiteUrl();

export const metadata: Metadata = {
  title: {
    default: "인스타링크 — 인스타 바이오 링크 페이지 만들기 | InstaLink",
    template: "%s | InstaLink",
  },
  description:
    "PT·필라테스·미용·카페 소상공인 인스타 바이오 링크 페이지. 서비스·가격·후기·카카오 상담 한 페이지에. 무료 시작.",
  keywords: [
    // 핵심 서비스 키워드
    "인스타 링크 페이지",
    "인스타그램 바이오 링크",
    "링크인바이오",
    "바이오링크",
    "멀티링크",
    // 경쟁 서비스 대안
    "링크트리 대안",
    "링크트리 한국",
    "리틀리 대안",
    // 타겟 고객
    "소상공인 홈페이지",
    "소상공인 무료 홈페이지",
    "1인 사업자 링크 페이지",
    // 기능 키워드
    "카카오 상담 연결",
    "카카오 예약 링크",
    "포트폴리오 링크",
    "무료 링크 페이지",
    // 직종별
    "PT 트레이너 링크 페이지",
    "필라테스 강사 링크",
    "헤어샵 인스타 링크",
    "카페 인스타 프로필",
    // 행동 키워드
    "인스타 프로필 링크 만들기",
    "링크 페이지 무료 만들기",
  ],
  authors: [{ name: "InstaLink" }],
  verification: {
    google: "XdM9zh2wbDIGWYZDlaBjiPCaU7CL4jx4QaVIceeAQZ0",
    other: {
      "naver-site-verification": "5c196548a376539e03ab4d1a31ca6e90f5d00454",
    },
  },
  metadataBase: new URL(SITE),
  alternates: {
    canonical: SITE,
  },
  openGraph: {
    type: "website",
    siteName: "InstaLink",
    title: "인스타 바이오 링크 페이지를 1분 만에 — InstaLink",
    description:
      "서비스 소개 + 가격 + 후기 + 카카오 상담을 한 페이지에. 소상공인·1인 사업자 무료 인스타 링크 페이지.",
    images: [
      {
        url: "/instalink_OG.png",
        width: 1920,
        height: 1080,
        alt: "InstaLink — 인스타 바이오 링크 페이지 서비스",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "인스타 바이오 링크 페이지를 1분 만에 — InstaLink",
    description: "서비스·가격·카카오 상담을 한 페이지에. 소상공인 무료 링크 페이지.",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "InstaLink",
  alternateName: ["인스타링크", "인스타 링크", "인스타링크 InstaLink"],
  url: SITE,
  description:
    "인스타그램 바이오 링크 페이지를 1분 만에 만드는 소상공인 전용 서비스. PT·필라테스·미용·카페 사장님 무료 사용 가능.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE}/{slug}`,
    },
    "query-input": "required name=slug",
  },
  publisher: {
    "@type": "Organization",
    name: "InstaLink",
    alternateName: ["인스타링크", "인스타 링크"],
    url: SITE,
    logo: {
      "@type": "ImageObject",
      url: `${SITE}/favicon.png`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        {/* jsDelivr CDN 연결을 미리 열어 폰트 TTFB를 줄임 */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        {/* Pretendard Variable woff2 선인출 — FCP/LCP 개선 */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-full flex-col">
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        {/* WebSite 구조화 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
          }}
        />
        <NavigationProgress />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
