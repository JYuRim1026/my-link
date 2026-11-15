import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ displayName: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedDisplayName = decodeURIComponent(
    resolvedParams?.displayName || ""
  ).trim();

  const title = decodedDisplayName
    ? `${decodedDisplayName}님의 마이링크`
    : "사용자 공개 프로필";
  const description = decodedDisplayName
    ? `${decodedDisplayName}님의 개발자 프로필과 추천 링크 카트리지를 마이링크(MyLink)에서 확인해보세요.`
    : "개발자 프로필과 추천 링크 카트리지를 마이링크(MyLink)에서 확인해보세요.";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | MyLink`,
      description,
      type: "profile",
      locale: "ko_KR",
      siteName: "마이링크 (MyLink)",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | MyLink`,
      description,
    },
  };
}

export default function DisplayNameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
