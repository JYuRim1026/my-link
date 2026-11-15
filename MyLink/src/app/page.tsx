"use client";

import { ShieldCheck, Database, Loader2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { LinkList } from "@/components/profile/LinkList";
import { useUser } from "@/hooks/useUser";

export default function LinkListPage() {
  const { user, loading: authLoading } = useUser();

  // 로그인 유저 또는 비로그인(게스트) 기본 프로필 정보
  const profileUser = {
    name: user?.displayName || user?.name || "마이링크 (MyLink)",
    role: user?.role || "Backend & Server Engineer",
    bio:
      user?.bio ||
      "안정적인 백엔드 시스템과 99.9% 업타임의 서버 아키텍처를 구축하는 개발자입니다.",
    avatarUrl: user?.photoURL || "/avatar.jpg",
    email: user?.email || "contact@example.com",
    statusText: user ? "ONLINE" : "GUEST MODE",
  };

  const activeUid = user?.uid || "anonymous";

  return (
    <div className="min-h-screen bg-[#7a8aba] text-[#21242e] font-sans p-2 sm:p-4 md:p-6 flex flex-col items-center justify-center selection:bg-[#f68d1f] selection:text-white w-full overflow-x-hidden">
      {/* Outer Console Hardware Frame */}
      <div className="w-full max-w-[840px] bg-[#7a8aba] border-t-4 border-l-4 border-white/70 border-b-4 border-r-4 border-[#3d4f97] shadow-2xl p-2 sm:p-4 relative my-2 sm:my-4 rounded-none overflow-hidden">
        {/* 전역 헤더 컴포넌트 (Google 로그인 & 로그아웃 & 내 페이지 바로가기 포함) */}
        <ProfileHeader
          avatarUrl={profileUser.avatarUrl}
          name={profileUser.name}
          statusText={profileUser.statusText}
        />

        {/* 로그인하지 않아도 마이링크 전체 기능을 바로 사용할 수 있도록 렌더링 */}
        <div className="mt-3 space-y-3 w-full">
          {authLoading ? (
            <Card className="w-full">
              <CardContent className="p-10 flex flex-col items-center justify-center gap-3 text-center">
                <Loader2 className="w-7 h-7 animate-spin text-[#f68d1f]" />
                <p className="text-xs sm:text-sm font-bold text-[#21242e]">
                  마이링크 데이터를 불러오는 중입니다...
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <ProfileHero
                name={profileUser.name}
                role={profileUser.role}
                bio={profileUser.bio}
                email={profileUser.email}
              />

              {/* 현재 Firestore 경로 및 접속 모드 안내 바 */}
              <div className="bg-[#21242e] text-white border-t border-l border-white/40 border-b-2 border-r-2 border-black px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  {user ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#ecab37] shrink-0" />
                      <span className="font-bold text-[#ecab37] shrink-0">
                        로그인 유저 (서버 주인):
                      </span>
                      <span className="truncate font-mono text-[#9fbee7]">
                        {user.displayName || user.name} ({user.email})
                      </span>
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 text-[#ecab37] shrink-0" />
                      <span className="font-bold text-[#ecab37] shrink-0">
                        비로그인 모드 (방문자):
                      </span>
                      <span className="truncate font-mono text-[#9fbee7]">
                        로그인 없이도 마이링크 조회 및 클릭이 가능합니다
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Database className="w-3.5 h-3.5 text-[#f68d1f]" />
                  <span className="text-[10px] font-mono bg-[#3d4f97] text-white px-2 py-0.5 rounded-[2px] border border-white/30">
                    경로: users/{activeUid}/links
                  </span>
                </div>
              </div>

              {/* 링크 리스트 */}
              <LinkList />
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
