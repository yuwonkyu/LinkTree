import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://instalink.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "InstaLink — 소상공인 인스타 링크 페이지",
    template: "%s | InstaLink",
  },
  description:
    "카페·미용실·PT·필라테스 사장님을 위한 인스타 프로필 링크 페이지. 무료로 시작하세요.",
  keywords: ["인스타 링크", "링크트리 대안", "소상공인", "카카오 문의", "링크 페이지"],
  authors: [{ name: "InstaLink" }],
  metadataBase: new URL(SITE),
  openGraph: {
    type: "website",
    siteName: "InstaLink",
    title: "InstaLink — 소상공인 인스타 링크 페이지",
    description: "카페·미용실·PT·필라테스 사장님을 위한 1페이지 링크 사이트",
    images: [
      {
        url: "/sampleop.png",
        width: 1200,
        height: 630,
        alt: "InstaLink Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
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
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
