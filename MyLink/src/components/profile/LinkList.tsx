"use client";

import { Loader2, RefreshCw, MousePointerClick } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkCardItem } from "./LinkCardItem";
import { AddLinkDialog } from "./AddLinkDialog";
import { useLinkStore } from "@/store/useLinkStore";
import { useLinksQuery, useIncrementLinkClickMutation } from "@/hooks/useLinks";

interface LinkListProps {
  onLinkClick?: (id: string, url: string) => void;
}

export function LinkList({ onLinkClick }: LinkListProps = {}) {
  const {
    data: links = [],
    isLoading,
    isFetching,
    error: queryError,
  } = useLinksQuery();

  const incrementLinkClickMutation = useIncrementLinkClickMutation();

  const storeLoading = useLinkStore((state) => state.isLoading);
  const storeError = useLinkStore((state) => state.error);

  const isBusy = isLoading || isFetching || storeLoading;
  const errorMsg =
    storeError ||
    (queryError ? "Firestore에서 링크 목록을 불러오는 중 오류가 발생했습니다." : null);

  const totalClicks = links.reduce((sum, item) => sum + (item.clicks || 0), 0);

  const handleCardClick = (id: string, url: string) => {
    const clickedLink = links.find((item) => item.id === id);
    incrementLinkClickMutation.mutate({
      id,
      targetUid: clickedLink?.ownerUid,
    });
    if (onLinkClick) {
      onLinkClick(id, url);
    } else if (url && url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <CardTitle>≡ FEATURED LINK LIST</CardTitle>
          <Badge variant="signal">{links.length} ITEMS</Badge>
          <Badge variant="amber" className="gap-1 font-mono">
            <MousePointerClick className="w-3 h-3" />
            <span>{totalClicks.toLocaleString()}</span>
          </Badge>
          {isBusy && (
            <Badge variant="amber" className="gap-1 animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>목록 갱신 중...</span>
            </Badge>
          )}
        </div>
        <AddLinkDialog />
      </CardHeader>

      <CardContent className="space-y-2 relative">
        {errorMsg && (
          <div className="p-2 rounded-[2px] bg-[#ecab37] text-[#21242e] border border-black text-[11px] font-bold">
            ℹ️ {errorMsg}
          </div>
        )}

        {/* 최초 로드 시 (기존 링크가 아직 없을 때) */}
        {isBusy && links.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#21242e] bg-[#dedede] border-2 border-[#3d4f97] rounded-xs font-mono flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#f68d1f]" />
            <span className="font-bold">Firestore에서 링크 목록을 불러오는 중입니다...</span>
          </div>
        ) : links.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#21242e]/70 bg-[#dedede] border border-[#3d4f97] rounded-xs font-mono">
            등록된 링크가 없습니다. 상단의 [+ 링크 추가] 버튼을 눌러 신규 링크를 추가해 보세요!
          </div>
        ) : (
          <div className="relative space-y-2">
            {/* 업데이트/갱신 도중 오버레이 로딩 표시 */}
            {isBusy && (
              <div className="absolute inset-0 z-10 bg-[#21242e]/40 backdrop-blur-[1px] flex items-center justify-center rounded-xs">
                <div className="bg-[#21242e] text-[#ecab37] border-2 border-white px-3 py-1.5 rounded-[2px] shadow-lg flex items-center gap-2 text-xs font-bold uppercase tracking-[0.5px]">
                  <Loader2 className="w-4 h-4 animate-spin text-[#f68d1f]" />
                  <span>링크 목록 업데이트 중...</span>
                </div>
              </div>
            )}

            {links.map((link) => (
              <LinkCardItem
                key={link.id}
                link={link}
                onLinkClick={handleCardClick}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
