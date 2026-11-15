"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditProfileDialog } from "./EditProfileDialog";

interface ProfileHeroProps {
  name: string;
  role: string;
  bio: string;
  email: string;
}

export function ProfileHero({ name, role, bio, email }: ProfileHeroProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    toast.success("이메일 주소가 클립보드에 복사되었습니다!", {
      description: email,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#acace7] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#3d4f97] p-3.5 sm:p-5 relative overflow-hidden shadow-sm w-full">
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-center sm:text-left min-w-0 flex-1">
          <Badge variant="amber" className="mb-1">
            {role}
          </Badge>
          <h1
            className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase mt-1 mb-1 break-words leading-tight"
            style={{
              textShadow:
                "2px 2px 0px #21242e, -1px -1px 0 #21242e, 1px -1px 0 #21242e, -1px 1px 0 #21242e, 1px 1px 0 #21242e",
            }}
          >
            {name}
          </h1>
          <p className="text-[11px] sm:text-xs font-bold text-[#21242e] max-w-md leading-normal">
            {bio}
          </p>
        </div>

        {/* 우측 액션 버튼 영역: [프로필 수정] + [COPY EMAIL] */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 shrink-0">
          <EditProfileDialog />

          <Button
            variant="default"
            size="lg"
            onClick={handleCopyEmail}
            className="shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
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
        </div>
      </div>
    </div>
  );
}
