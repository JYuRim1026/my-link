"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { toast } from "sonner";
import {
  Code,
  BookOpen,
  FileCode,
  Briefcase,
  Video,
  Coffee,
  ExternalLink,
  Copy,
  Check,
  Share2,
  Database,
  Loader2,
  UserCheck,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { useUser } from "@/hooks/useUser";
import { usePublicProfileQuery } from "@/hooks/usePublicProfile";

export default function PublicUserProfilePage() {
  const params = useParams<{ displayName: string }>();
  const rawDisplayName = params?.displayName || "";
  const decodedDisplayName = decodeURIComponent(rawDisplayName);

  // 현재 접속자의 로그인 세션 상태 (헤더 표시용)
  useUser();

  // displayName으로 대상 유저 및 users/{userId}/links 조회
  const { data, isLoading, isError } = usePublicProfileQuery(rawDisplayName);

  const [copiedEmail, setCopiedEmail] = React.useState(false);
  const [copiedPageUrl, setCopiedPageUrl] = React.useState(false);

  // 해당 displayName을 가진 유저가 없으면 404 페이지 호출
  if (!isLoading && data && !data.found) {
    notFound();
  }

  const renderIcon = (iconName: string) => {
    const props = { className: "w-4 h-4 shrink-0" };
    switch (iconName) {
      case "Github":
        return <Code {...props} />;
      case "BookOpen":
        return <BookOpen {...props} />;
      case "FileCode":
        return <FileCode {...props} />;
      case "Briefcase":
        return <Briefcase {...props} />;
      case "Youtube":
        return <Video {...props} />;
      case "Coffee":
        return <Coffee {...props} />;
      default:
        return <ExternalLink {...props} />;
    }
  };

  const handleCopyEmail = (email: string) => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    toast.success("이메일 주소가 클립보드에 복사되었습니다!", {
      description: email,
    });
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyShareUrl = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopiedPageUrl(true);
    toast.success("개인 웹페이지 주소가 복사되었습니다!", {
      description: window.location.href,
    });
    setTimeout(() => setCopiedPageUrl(false), 2000);
  };

  const handleOpenLinkNewTab = (url: string) => {
    if (url && url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const profile = data?.profile;
  const links = data?.links || [];

  return (
    <div className="min-h-screen bg-[#7a8aba] text-[#21242e] font-sans p-2 sm:p-4 md:p-6 flex flex-col items-center justify-center selection:bg-[#f68d1f] selection:text-white w-full overflow-x-hidden">
      {/* Outer Console Hardware Frame */}
      <div className="w-full max-w-[840px] bg-[#7a8aba] border-t-4 border-l-4 border-white/70 border-b-4 border-r-4 border-[#3d4f97] shadow-2xl p-2 sm:p-4 relative my-2 sm:my-4 rounded-none overflow-hidden">
        {/* 전역 헤더 컴포넌트 */}
        <ProfileHeader
          avatarUrl={profile?.photoURL || "/avatar.jpg"}
          name={profile?.displayName || decodedDisplayName}
          statusText="PUBLIC PROFILE"
        />

        <div className="mt-3 space-y-3 w-full">
          {isLoading ? (
            <Card className="w-full">
              <CardContent className="p-10 flex flex-col items-center justify-center gap-3 text-center">
                <Loader2 className="w-7 h-7 animate-spin text-[#f68d1f]" />
                <p className="text-xs sm:text-sm font-bold text-[#21242e]">
                  &ldquo;{decodedDisplayName}&rdquo;님의 프로필과 링크 목록을 불러오는 중입니다...
                </p>
              </CardContent>
            </Card>
          ) : isError || !profile ? (
            <Card className="w-full">
              <CardContent className="p-8 text-center space-y-3">
                <p className="text-xs sm:text-sm font-bold text-[#e60012]">
                  프로필 정보를 불러오는 중 오류가 발생했습니다.
                </p>
                <Link href="/">
                  <Button variant="signal" size="sm" className="cursor-pointer">
                    메인 페이지로 돌아가기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* 1. 상단: 프로필 카드 (이름, 역할 배지, 소개글, 아바타, 공유/이메일 복사) */}
              <div className="bg-[#acace7] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#3d4f97] p-3.5 sm:p-5 relative overflow-hidden shadow-sm w-full">
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-3.5 text-center sm:text-left min-w-0 flex-1">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white bg-[#21242e] p-0.5 shadow-md shrink-0 overflow-hidden">
                      <Image
                        src={profile.photoURL || "/avatar.jpg"}
                        alt={profile.displayName || profile.name}
                        width={80}
                        height={80}
                        unoptimized
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap mb-1">
                        <Badge variant="amber">
                          {profile.role || "Backend & Server Engineer"}
                        </Badge>
                        <Badge variant="pill">/{profile.displayName}</Badge>
                      </div>

                      <h1
                        className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase mt-1 mb-1 break-words leading-tight"
                        style={{
                          textShadow:
                            "2px 2px 0px #21242e, -1px -1px 0 #21242e, 1px -1px 0 #21242e, -1px 1px 0 #21242e, 1px 1px 0 #21242e",
                        }}
                      >
                        {profile.displayName || profile.name}
                      </h1>

                      <p className="text-[11px] sm:text-xs font-bold text-[#21242e] max-w-lg leading-normal">
                        {profile.bio}
                      </p>
                    </div>
                  </div>

                  {/* 우측 액션 버튼: [주소 공유] + [COPY EMAIL] */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="amber"
                      size="lg"
                      onClick={handleCopyShareUrl}
                      className="shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedPageUrl ? (
                        <>
                          <Check className="w-4 h-4 text-[#21242e]" />
                          <span>URL COPIED!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4 text-[#21242e]" />
                          <span>페이지 공유</span>
                        </>
                      )}
                    </Button>

                    {profile.email && (
                      <Button
                        type="button"
                        variant="default"
                        size="lg"
                        onClick={() => handleCopyEmail(profile.email)}
                        className="shrink-0 flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedEmail ? (
                          <>
                            <Check className="w-4 h-4 text-white" />
                            <span>COPIED!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-white" />
                            <span>COPY EMAIL</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* 검색된 유저 정보 및 Firestore 경로 상태 바 */}
              <div className="bg-[#21242e] text-white border-t border-l border-white/40 border-b-2 border-r-2 border-black px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <UserCheck className="w-4 h-4 text-[#ecab37] shrink-0" />
                  <span className="font-bold text-[#ecab37] shrink-0">
                    개인 웹페이지:
                  </span>
                  <span className="truncate font-mono text-[#9fbee7]">
                    @{profile.displayName} {profile.email ? `(${profile.email})` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Database className="w-3.5 h-3.5 text-[#f68d1f]" />
                  <span className="text-[10px] font-mono bg-[#3d4f97] text-white px-2 py-0.5 rounded-[2px] border border-white/30">
                    경로: users/{data.userId}/links
                  </span>
                </div>
              </div>

              {/* 2. 하단: 링크 목록 (클릭 시 새 탭으로 열기) */}
              <Card className="w-full">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle>
                      ≡ {profile.displayName?.toUpperCase()}&apos;S LINK LIST
                    </CardTitle>
                    <Badge variant="signal">{links.length} ITEMS</Badge>
                  </div>

                  <Link href="/">
                    <Button
                      type="button"
                      variant="carbon"
                      size="sm"
                      className="gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-[#ecab37]" />
                      <span>마이페이지(관리)로 이동</span>
                    </Button>
                  </Link>
                </CardHeader>

                <CardContent className="space-y-2">
                  {links.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#21242e]/70 bg-[#dedede] border border-[#3d4f97] rounded-xs font-mono">
                      아직 등록된 링크가 없습니다.
                    </div>
                  ) : (
                    links.map((link) => (
                      <div
                        key={link.id}
                        onClick={() => handleOpenLinkNewTab(link.url)}
                        className="bg-[#dedede] hover:bg-white border-t border-l border-white border-b border-r border-[#3d4f97] p-2.5 sm:p-3 flex items-center justify-between gap-2.5 text-[#21242e] group cursor-pointer transition-all shadow-xs w-full min-w-0"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="p-2 rounded-xs bg-[#21242e] text-[#ecab37] border border-black group-hover:bg-[#e60012] group-hover:text-white transition-colors shrink-0">
                            {renderIcon(link.iconName || "ExternalLink")}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <Badge variant="default">{link.badge}</Badge>
                              <h2 className="text-xs sm:text-sm font-bold text-[#3d4f97] group-hover:text-[#e60012] group-hover:underline truncate">
                                {link.title}
                              </h2>
                            </div>
                            <p className="text-[10px] sm:text-xs text-[#21242e] truncate">
                              {link.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-mono font-bold bg-[#9fbee7] text-[#21242e] px-2 py-0.5 rounded-xs border border-[#3d4f97] hidden sm:inline-block">
                            NEW TAB ↗
                          </span>
                          <Button
                            type="button"
                            variant="default"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenLinkNewTab(link.url);
                            }}
                            className="px-2 py-1 cursor-pointer"
                            title="새 탭으로 링크 열기"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Footer Bar */}
        <div className="mt-3 bg-[#21242e] bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:6px_6px] border-t-2 border-l-2 border-white/40 border-b-2 border-r-2 border-black p-2.5 text-center flex flex-col sm:flex-row items-center justify-between gap-2 w-full">
          <div className="text-[9px] sm:text-[10px] text-[#9fbee7] font-mono">
            © 1997–2001 Nintendo / MyLink. Powered by shadcn/ui & Next.js 16.
          </div>
          <Badge variant="amber">ESRB — PRIVACY CERTIFIED</Badge>
        </div>
      </div>
    </div>
  );
}
