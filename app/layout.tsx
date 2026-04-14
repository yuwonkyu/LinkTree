import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kku-ui.vercel.app"),
  title: "Sample link",
  description: "인스타그램 링크용 예약 페이지",
  openGraph: {
    title: "Sample link",
    description: "인스타그램 링크용 예약 페이지",
    images: [
      {
        url: "/sampleop.png",
        width: 1200,
        height: 630,
        alt: "Sample link Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sample link",
    description: "인스타그램 링크용 예약 페이지",
    images: ["/sampleop.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
