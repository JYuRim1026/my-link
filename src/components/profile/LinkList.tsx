"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkItem, MOCK_LINKS } from "@/data/mockLinks";
import { LinkCardItem } from "./LinkCardItem";
import { AddLinkDialog } from "./AddLinkDialog";
import { useLinkStore } from "@/store/useLinkStore";

interface LinkListProps {
  onLinkClick?: (id: string, url: string) => void;
}

export function LinkList({ onLinkClick }: LinkListProps = {}) {
  const storeLinks = useLinkStore((state) => state.links);
  const incrementClicks = useLinkStore((state) => state.incrementClicks);

  // Hydration safety for Next.js App Router localStorage persistence
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const links = mounted ? storeLinks : MOCK_LINKS;

  const handleCardClick = (id: string, url: string) => {
    incrementClicks(id);
    if (onLinkClick) {
      onLinkClick(id, url);
    } else if (url && url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CardTitle>≡ FEATURED LINK LIST</CardTitle>
          <Badge variant="signal">{links.length} ITEMS</Badge>
        </div>
        <AddLinkDialog />
      </CardHeader>

      <CardContent className="space-y-2">
        {links.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#21242e]/70 bg-[#dedede] border border-[#3d4f97] rounded-xs font-mono">
            등록된 링크가 없습니다. 상단의 [+ 링크 추가] 버튼을 눌러 신규 링크를 추가해 보세요!
          </div>
        ) : (
          links.map((link) => (
            <LinkCardItem
              key={link.id}
              link={link}
              onLinkClick={handleCardClick}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
