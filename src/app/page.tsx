"use client";

import { Badge } from "@/components/ui/badge";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { LinkList } from "@/components/profile/LinkList";

export default function LinkListPage() {
  const profileUser = {
    name: "마이링크 (MyLink)",
    role: "Backend & Server Engineer",
    bio: "안정적인 백엔드 시스템과 99.9% 업타임의 서버 아키텍처를 구축하는 개발자입니다.",
    avatarUrl: "/avatar.jpg",
    email: "contact@example.com",
    statusText: "ONLINE",
  };

  return (
    <div className="min-h-screen bg-[#7a8aba] text-[#21242e] font-sans p-2 sm:p-4 md:p-6 flex flex-col items-center justify-center selection:bg-[#f68d1f] selection:text-white w-full overflow-x-hidden">
      
      {/* Outer Console Hardware Frame */}
      <div className="w-full max-w-[840px] bg-[#7a8aba] border-t-4 border-l-4 border-white/70 border-b-4 border-r-4 border-[#3d4f97] shadow-2xl p-2 sm:p-4 relative my-2 sm:my-4 rounded-none overflow-hidden">
        
        {/* Reusable Profile Header */}
        <ProfileHeader
          avatarUrl={profileUser.avatarUrl}
          name={profileUser.name}
          statusText={profileUser.statusText}
        />

        {/* Main Body Layout */}
        <div className="mt-3 space-y-3 w-full">
          
          {/* Reusable Profile Hero */}
          <ProfileHero
            name={profileUser.name}
            role={profileUser.role}
            bio={profileUser.bio}
            email={profileUser.email}
          />

          {/* Reusable Link List with AddLinkDialog & Zustand Store */}
          <LinkList />

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
