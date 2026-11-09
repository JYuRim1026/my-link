"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LogIn,
  LogOut,
  Loader2,
  ChevronDown,
  Copy,
  Check,
  Link2,
  MousePointerClick,
  Share2,
  Pencil,
  RefreshCw,
  Database,
  Globe,
  LayoutDashboard,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useLinkStore } from "@/store/useLinkStore";
import { useUpdateProfileMutation } from "@/hooks/useUser";

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
  const router = useRouter();
  const user = useLinkStore((state) => state.user);
  const links = useLinkStore((state) => state.links);
  const authLoading = useLinkStore((state) => state.authLoading);
  const loginWithGoogle = useLinkStore((state) => state.loginWithGoogle);
  const logout = useLinkStore((state) => state.logout);
  const updateProfileMutation = useUpdateProfileMutation();

  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const [copiedUid, setCopiedUid] = React.useState(false);
  const [copiedShareUrl, setCopiedShareUrl] = React.useState(false);

  // 드롭다운 내 닉네임(displayName) 인라인 수정 상태
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [isSavingName, setIsSavingName] = React.useState(false);

  const displayUserName = user?.displayName || user?.name || name;
  const personalPagePath = `/${encodeURIComponent(displayUserName)}`;

  // 통계 계산 (총 링크 수, 직접 추가한 개인화 링크 수, 총 누적 클릭 수)
  const totalLinksCount = links.length;
  const customLinksCount = links.filter(
    (item) => !item.id.startsWith("link-")
  ).length;
  const totalClicksCount = links.reduce(
    (acc, item) => acc + (item.clicks || 0),
    0
  );

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

  const handleCopyUid = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.uid);
    setCopiedUid(true);
    toast.success("고유 UID가 클립보드에 복사되었습니다!", {
      description: user.uid,
    });
    setTimeout(() => setCopiedUid(false), 1800);
  };

  const handleCopyProfileUrl = () => {
    if (typeof window === "undefined") return;
    const shareUrl = `${window.location.origin}${personalPagePath}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShareUrl(true);
    toast.success("내 개인 웹페이지 주소가 복사되었습니다!", {
      description: shareUrl,
    });
    setTimeout(() => setCopiedShareUrl(false), 1800);
  };

  const handleSaveDisplayName = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;

    // 변경 사항이 없으면 업데이트하지 않고 바로 닫기
    if (trimmed === displayUserName) {
      toast.info("변경된 사항이 없습니다.");
      setIsEditingName(false);
      return;
    }

    // 낙관적 업데이트(Optimistic Update) 적용: 즉시 폼을 닫고 UI에 반영하며 실패 시 자동 롤백
    setIsEditingName(false);
    setIsSavingName(false);
    updateProfileMutation.mutate({ displayName: trimmed });
  };

  return (
    <header className="w-full space-y-2">
      {/* Masthead Header Row: Mascot & Speech Bubble + Profile Dropdown */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-2 px-1 sm:px-2 w-full">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white bg-[#e60012] p-0.5 shadow-md shrink-0 overflow-hidden relative">
            <Image
              src={user?.photoURL || avatarUrl}
              alt={displayUserName}
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
                ? `"Welcome, ${displayUserName}! 🎮"`
                : `"Welcome to MyLink Profile! 🎮"`}
            </span>
          </div>
        </div>

        {/* 우측 상태 배지 & 내 페이지 바로가기 버튼 & 프로필 드롭다운 메뉴 / 구글 로그인 버튼 */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end w-full sm:w-auto">
          <Badge variant="amber">{statusText}</Badge>

          {user && (
            <>
              <Link href="/">
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="gap-1 px-2.5 py-1 cursor-pointer shadow-sm"
                  title="마이페이지(링크 관리 홈) 바로가기"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-white" />
                  <span>마이페이지</span>
                </Button>
              </Link>

              <Link href={personalPagePath}>
                <Button
                  type="button"
                  variant="amber"
                  size="sm"
                  className="gap-1 px-2.5 py-1 cursor-pointer shadow-sm"
                  title={`내 개인 웹페이지 (${personalPagePath}) 바로가기`}
                >
                  <Globe className="w-3.5 h-3.5 text-[#21242e]" />
                  <span>내 페이지 바로가기</span>
                </Button>
              </Link>
            </>
          )}

          {authLoading || isLoggingIn ? (
            <Button variant="carbon" size="sm" disabled className="gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>인증 중...</span>
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="carbon"
                  size="sm"
                  className="gap-1.5 px-2.5 py-1 cursor-pointer shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] inline-block" />
                  <span className="max-w-[140px] truncate font-mono text-[11px] text-[#ecab37]">
                    {displayUserName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-white" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-80">
                {/* 1. 유저 기본 정보 섹션 */}
                <DropdownMenuLabel>👤 내 계정 정보 (ACCOUNT PROFILE)</DropdownMenuLabel>
                <div className="bg-[#dedede] border-2 border-[#3d4f97] p-2.5 rounded-[3px] space-y-2 shadow-inner">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full border-2 border-[#3d4f97] bg-white overflow-hidden shrink-0">
                      <Image
                        src={user.photoURL || avatarUrl}
                        alt={displayUserName}
                        width={40}
                        height={40}
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-black text-[#21242e] truncate">
                          {displayUserName}
                        </p>
                        <Badge variant="signal" className="text-[9px] px-1 py-0">
                          PRO
                        </Badge>
                      </div>
                      <p className="text-[11px] font-mono text-[#3d4f97] truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* 닉네임(displayName) 인라인 변경 폼 */}
                  {isEditingName ? (
                    <form
                      onSubmit={handleSaveDisplayName}
                      className="pt-1.5 border-t border-[#3d4f97]/30 space-y-1.5"
                    >
                      <label className="text-[10px] font-bold text-[#3d4f97] block">
                        새 닉네임 (displayName) 입력
                      </label>
                      <div className="flex items-center gap-1">
                        <Input
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="닉네임 입력"
                          className="h-7 text-xs px-2"
                          disabled={isSavingName}
                        />
                        <Button
                          type="submit"
                          variant="signal"
                          size="sm"
                          disabled={isSavingName}
                          className="h-7 px-2 cursor-pointer"
                        >
                          {isSavingName ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            "저장"
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isSavingName}
                          onClick={() => setIsEditingName(false)}
                          className="h-7 px-2 cursor-pointer"
                        >
                          취소
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between pt-1.5 border-t border-[#3d4f97]/30 text-[10px] font-mono">
                      <span className="text-[#21242e] truncate">
                        UID: <strong>{user.uid.slice(0, 10)}...</strong>
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handleCopyUid}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#9fbee7] hover:bg-white text-[#21242e] border border-[#3d4f97] rounded-[2px] font-bold cursor-pointer transition-colors"
                        >
                          {copiedUid ? (
                            <>
                              <Check className="w-2.5 h-2.5 text-[#e60012]" />
                              <span>복사됨!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-2.5 h-2.5" />
                              <span>UID 복사</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewName(displayUserName);
                            setIsEditingName(true);
                          }}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#ecab37] hover:bg-[#e48600] text-[#21242e] border border-black rounded-[2px] font-bold cursor-pointer transition-colors"
                        >
                          <Pencil className="w-2.5 h-2.5" />
                          <span>닉네임 수정</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <DropdownMenuSeparator />

                {/* 2. 내 마이링크 요약 통계 (미니 대시보드) */}
                <DropdownMenuLabel>📊 내 마이링크 요약 통계 (STATS)</DropdownMenuLabel>
                <div className="grid grid-cols-2 gap-1.5 px-0.5">
                  <div className="bg-[#21242e] text-white border border-black p-2 rounded-[3px] flex items-center gap-2">
                    <div className="p-1.5 rounded-[2px] bg-[#3d4f97] text-[#ecab37]">
                      <Link2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[9px] text-[#9fbee7] uppercase font-bold">
                        등록된 총 링크
                      </p>
                      <p className="text-xs font-black text-white">
                        {totalLinksCount}개{" "}
                        <span className="text-[10px] font-normal text-[#ecab37]">
                          (추가 {customLinksCount})
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#21242e] text-white border border-black p-2 rounded-[3px] flex items-center gap-2">
                    <div className="p-1.5 rounded-[2px] bg-[#f68d1f] text-white">
                      <MousePointerClick className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[9px] text-[#9fbee7] uppercase font-bold">
                        누적 클릭 수
                      </p>
                      <p className="text-xs font-black text-[#ecab37]">
                        {totalClicksCount.toLocaleString()} Clicks
                      </p>
                    </div>
                  </div>
                </div>

                {/* Firestore 경로 표시 */}
                <div className="mt-1.5 px-2 py-1 bg-[#7a8aba] border border-[#3d4f97] rounded-[2px] flex items-center gap-1.5 text-[10px] font-mono text-white">
                  <Database className="w-3 h-3 text-[#ecab37] shrink-0" />
                  <span className="truncate">users/{user.uid}/links</span>
                </div>

                <DropdownMenuSeparator />

                {/* 3. 빠른 액션 & 4. 계정 제어 */}
                <div className="space-y-1">
                  <DropdownMenuItem
                    onClick={() => router.push(personalPagePath)}
                    className="bg-[#ecab37] text-[#21242e] hover:bg-[#e48600] hover:text-[#21242e] border border-black justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-[#21242e]" />
                      <span>내 개인 웹페이지 이동 ({personalPagePath})</span>
                    </span>
                    <ExternalLink className="w-3 h-3 text-[#21242e]" />
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push("/")}
                    className="bg-white/80 border border-[#3d4f97]"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#3d4f97]" />
                    <span>마이페이지 (링크 관리 홈) 이동</span>
                  </DropdownMenuItem>

                  <button
                    type="button"
                    onClick={handleCopyProfileUrl}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-bold rounded-[2px] bg-white/80 hover:bg-[#21242e] hover:text-[#ecab37] border border-[#3d4f97] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Share2 className="w-3.5 h-3.5 text-[#3d4f97]" />
                      <span>내 개인 웹페이지 주소 복사</span>
                    </span>
                    {copiedShareUrl && (
                      <span className="text-[10px] text-[#e60012] font-black">
                        COPIED!
                      </span>
                    )}
                  </button>

                  <DropdownMenuItem
                    onClick={handleGoogleLogin}
                    className="bg-white/80 border border-[#3d4f97]"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#f68d1f]" />
                    <span>다른 Google 계정으로 전환</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={logout}
                    className="bg-[#e60012] text-white hover:bg-[#b8000e] hover:text-white border border-black mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>로그아웃 (SIGN OUT)</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
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
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Badge variant="pill">Nintendo® MyLink</Badge>
          </Link>
          {user && (
            <span className="text-[10px] font-mono text-[#9fbee7]">
              {displayUserName} ({user.email})
            </span>
          )}
        </div>

        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 sm:gap-4 font-black text-[11px] sm:text-xs tracking-wider text-[#e48600] overflow-x-auto whitespace-nowrap py-0.5 px-1">
          <Link href="/" className="hover:text-white transition-colors">
            MYPAGE (홈)
          </Link>
          {user && (
            <Link
              href={personalPagePath}
              className="text-[#ecab37] hover:text-white transition-colors underline underline-offset-2"
            >
              내 웹페이지 ({personalPagePath})
            </Link>
          )}
          <a href="#" className="hover:text-white transition-colors">GAMES</a>
          <a href="#" className="hover:text-white transition-colors">SYSTEMS</a>
          <a href="#" className="hover:text-white transition-colors">NEWS</a>
        </div>
      </div>
    </header>
  );
}
