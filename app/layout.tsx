import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSiteUrl } from "@/lib/site-url";
import NavigationProgress from "@/components/NavigationProgress";
import "./globals.css";

const SITE = getSiteUrl();

export const metadata: Metadata = {
  title: {
    default: "InstaLink — 나만의 링크 페이지를 1분 만에",
    template: "%s | InstaLink",
  },
  description:
    "포트폴리오·예약·후기·카카오 상담을 한 페이지에. 무료로 시작하세요. PT·필라테스·미용·카페 소상공인용.",
  keywords: [
    "인스타 링크 페이지",
    "링크트리 대안",
    "소상공인 홈페이지",
    "카카오 상담 연결",
    "포트폴리오 링크",
    "무료 링크 페이지",
    "인스타그램 바이오 링크",
  ],
  authors: [{ name: "InstaLink" }],
  metadataBase: new URL(SITE),
  openGraph: {
    type: "website",
    siteName: "InstaLink",
    title: "나만의 링크 페이지를 1분 만에 — InstaLink",
    description:
      "포트폴리오 + 예약 + 후기 + 카카오 상담을 한 페이지에. 무료로 시작하는 소상공인 링크 페이지.",
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
    title: "나만의 링크 페이지를 1분 만에 — InstaLink",
    description: "포트폴리오·예약·카카오 상담을 한 페이지에. 무료로 시작하세요.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <NavigationProgress />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
