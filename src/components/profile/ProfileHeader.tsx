"use client";

import * as React from "react";
import Image from "next/image";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLinkStore } from "@/store/useLinkStore";

interface ProfileHeaderProps {
  avatarUrl: string;
  name: string;
  statusText: string;
}

export function ProfileHeader({
  avatarUrl,
  name,
  statusText,
}: ProfileHeaderProps) {
  const user = useLinkStore((state) => state.user);
  const authLoading = useLinkStore((state) => state.authLoading);
  const loginWithGoogle = useLinkStore((state) => state.loginWithGoogle);
  const logout = useLinkStore((state) => state.logout);

  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
    } catch {
      // 에러 처리는 store에서 수행
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <header className="w-full space-y-2">
      {/* Masthead Header Row: Mascot & Speech Bubble + Google Auth Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-2 px-1 sm:px-2 w-full">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white bg-[#e60012] p-0.5 shadow-md shrink-0 overflow-hidden relative">
            <Image
              src={user?.photoURL || avatarUrl}
              alt={user?.name || name}
              width={48}
              height={48}
              unoptimized
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div className="relative bg-white border-2 border-[#3d4f97] rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-sm text-[11px] sm:text-xs font-bold text-[#21242e] flex items-center gap-1 flex-1 sm:flex-initial leading-tight min-w-0">
            <span className="text-[#e60012] font-black shrink-0">MARIO:</span>
            <span className="truncate">
              {user
                ? `"Welcome, ${user.name}! 🎮"`
                : `"Welcome to MyLink Profile! 🎮"`}
            </span>
          </div>
        </div>

        {/* 우측 상태 배지 & 구글 소셜 로그인/로그아웃 버튼 */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end w-full sm:w-auto">
          <Badge variant="amber">{statusText}</Badge>
          <Badge variant="pill">MyLink v2.0</Badge>

          {authLoading || isLoggingIn ? (
            <Button variant="carbon" size="sm" disabled className="gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>인증 중...</span>
            </Button>
          ) : user ? (
            <div className="flex items-center gap-1.5">
              {/* 이메일 앞부분에 displayName 표시 */}
              <span className="text-[10px] font-bold text-[#21242e] bg-[#9fbee7] border border-[#3d4f97] px-2 py-0.5 rounded-[2px]">
                {user.name} ({user.email})
              </span>
              <Button
                type="button"
                variant="carbon"
                size="sm"
                onClick={logout}
                className="gap-1 cursor-pointer"
                title="로그아웃"
              >
                <LogOut className="w-3 h-3 text-[#ecab37]" />
                <span>로그아웃</span>
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="signal"
              size="sm"
              onClick={handleGoogleLogin}
              className="gap-1.5 cursor-pointer shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Google 로그인</span>
            </Button>
          )}
        </div>
      </div>

      {/* Primary Carbon Navigation Bar */}
      <div className="bg-[#21242e] bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:6px_6px] border-t-2 border-l-2 border-white/40 border-b-2 border-r-2 border-black p-2 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md w-full">
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <Badge variant="pill">Nintendo® MyLink</Badge>
          {user && (
            <span className="text-[10px] font-mono text-[#9fbee7]">
              UID: {user.uid.slice(0, 8)}...
            </span>
          )}
        </div>

        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 sm:gap-4 font-black text-[11px] sm:text-xs tracking-wider text-[#e48600] overflow-x-auto whitespace-nowrap py-0.5 px-1">
          <a href="#" className="hover:text-white transition-colors">GAMES</a>
          <a href="#" className="hover:text-white transition-colors">SYSTEMS</a>
          <a href="#" className="hover:text-white transition-colors">NEWS</a>
          <a href="#" className="hover:text-white transition-colors">NSIDER</a>
          <a href="#" className="hover:text-white transition-colors">DOWNLOADS</a>
        </div>
      </div>
    </header>
  );
}
