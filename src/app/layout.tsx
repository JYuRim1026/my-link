import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function resolveMetadataBase(): URL {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
  try {
    const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    return new URL(normalized);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: {
    default: "마이링크 | MyLink",
    template: "%s | 마이링크 (MyLink)",
  },
  description:
    "안정적인 백엔드 시스템과 서버 아키텍처를 구축하는 개발자의 마이링크(MyLink)",
  openGraph: {
    title: "마이링크 | MyLink",
    description:
      "안정적인 백엔드 시스템과 서버 아키텍처를 구축하는 개발자의 마이링크(MyLink)",
    siteName: "마이링크 (MyLink)",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "마이링크 | MyLink",
    description:
      "안정적인 백엔드 시스템과 서버 아키텍처를 구축하는 개발자의 마이링크(MyLink)",
  },
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      translate="no"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased notranslate`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
