"use client";

import * as React from "react";
import { Lock, LogIn, ShieldCheck, Database, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { LinkList } from "@/components/profile/LinkList";
import { useLinkStore, UserProfile } from "@/store/useLinkStore";
import { useUser } from "@/hooks/useUser";

// 비로그인 시 표시되는 LandingPage 컴포넌트
function LandingPage({
  error,
  isLoggingIn,
  onGoogleLogin,
}: {
  error: string | null;
  isLoggingIn: boolean;
  onGoogleLogin: () => void;
}) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-[#e60012]" />
          <span>로그인이 필요한 서비스입니다 (LANDING PAGE)</span>
        </CardTitle>
        <Badge variant="amber">GUEST MODE</Badge>
      </CardHeader>

      <CardContent>
        <div className="bg-[#dedede] border-2 border-[#3d4f97] p-6 sm:p-8 text-center space-y-4 rounded-[3px] shadow-inner">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#21242e] border-2 border-white flex items-center justify-center shadow-md">
            <Lock className="w-6 h-6 text-[#ecab37]" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-base sm:text-lg font-black text-[#21242e]">
              Google 로그인 이후에 마이링크를 사용할 수 있습니다!
            </h2>
            <p className="text-xs sm:text-sm text-[#3d4f97] font-bold max-w-md mx-auto leading-relaxed">
              우측 상단 또는 아래의 [Google 계정으로 로그인] 버튼을 눌러 로그인하시면,
              회원님만의 개인화된 경로(
              <code className="bg-white px-1.5 py-0.5 rounded border border-[#3d4f97] text-[#e60012]">
                users/&#123;uid&#125;/links
              </code>
              )로 링크를 안전하게 조회·추가·수정·삭제하실 수 있습니다.
            </p>
          </div>

          {error && (
            <div className="p-2.5 max-w-md mx-auto rounded-[2px] bg-[#e60012] text-white text-xs font-bold">
              ⚠️ {error}
            </div>
          )}

          <div className="pt-2">
            <Button
              type="button"
              variant="signal"
              size="lg"
              disabled={isLoggingIn}
              onClick={onGoogleLogin}
              className="gap-2 cursor-pointer shadow-md"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Google 로그인 진행 중...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Google 계정으로 로그인하기</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 로그인 완료 시 표시되는 MyPage 컴포넌트
function MyPage({
  user,
  profileUser,
}: {
  user: UserProfile;
  profileUser: {
    name: string;
    role: string;
    bio: string;
    email: string;
  };
}) {
  return (
    <>
      <ProfileHero
        name={profileUser.name}
        role={profileUser.role}
        bio={profileUser.bio}
        email={profileUser.email}
      />

      {/* 현재 개인화된 Firestore 경로 및 유저 정보 안내 바 */}
      <div className="bg-[#21242e] text-white border-t border-l border-white/40 border-b-2 border-r-2 border-black px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck className="w-4 h-4 text-[#ecab37] shrink-0" />
          <span className="font-bold text-[#ecab37] shrink-0">로그인 유저:</span>
          <span className="truncate font-mono text-[#9fbee7]">
            {user.displayName || user.name} ({user.email})
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Database className="w-3.5 h-3.5 text-[#f68d1f]" />
          <span className="text-[10px] font-mono bg-[#3d4f97] text-white px-2 py-0.5 rounded-[2px] border border-white/30">
            경로: users/{user.uid}/links
          </span>
        </div>
      </div>

      {/* 개인화된 링크 리스트 */}
      <LinkList />
    </>
  );
}

export default function LinkListPage() {
  const { user, loading: authLoading, loginWithGoogle } = useUser();
  const error = useLinkStore((state) => state.error);

  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
    } catch {
      // 에러는 store.error에 반영됨
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 로그인 유저의 프로필 정보(displayName, role, bio)를 반영
  const profileUser = {
    name: user?.displayName || user?.name || "마이링크 (MyLink)",
    role: user?.role || "Backend & Server Engineer",
    bio:
      user?.bio ||
      "안정적인 백엔드 시스템과 99.9% 업타임의 서버 아키텍처를 구축하는 개발자입니다.",
    avatarUrl: user?.photoURL || "/avatar.jpg",
    email: user?.email || "contact@example.com",
    statusText: user ? "ONLINE" : "OFFLINE (GUEST)",
  };

  return (
    <div className="min-h-screen bg-[#7a8aba] text-[#21242e] font-sans p-2 sm:p-4 md:p-6 flex flex-col items-center justify-center selection:bg-[#f68d1f] selection:text-white w-full overflow-x-hidden">
      {/* Outer Console Hardware Frame */}
      <div className="w-full max-w-[840px] bg-[#7a8aba] border-t-4 border-l-4 border-white/70 border-b-4 border-r-4 border-[#3d4f97] shadow-2xl p-2 sm:p-4 relative my-2 sm:my-4 rounded-none overflow-hidden">
        {/* 전역 헤더 컴포넌트 (Google 로그인 & 로그아웃 포함) */}
        <ProfileHeader
          avatarUrl={profileUser.avatarUrl}
          name={profileUser.name}
          statusText={profileUser.statusText}
        />

        {/* 로그인 여부에 따른 메인 화면 분기 처리 (LandingPage vs MyPage) */}
        <div className="mt-3 space-y-3 w-full">
          {authLoading ? (
            <Card className="w-full">
              <CardContent className="p-10 flex flex-col items-center justify-center gap-3 text-center">
                <Loader2 className="w-7 h-7 animate-spin text-[#f68d1f]" />
                <p className="text-xs sm:text-sm font-bold text-[#21242e]">
                  사용자 인증 정보를 확인하는 중입니다...
                </p>
              </CardContent>
            </Card>
          ) : user ? (
            <MyPage user={user} profileUser={profileUser} />
          ) : (
            <LandingPage
              error={error}
              isLoggingIn={isLoggingIn}
              onGoogleLogin={handleGoogleLogin}
            />
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
