"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkItem } from "@/data/mockLinks";
import { LinkCardItem } from "./LinkCardItem";

interface LinkListProps {
  links: LinkItem[];
  onLinkClick: (id: string, url: string) => void;
}

export function LinkList({ links, onLinkClick }: LinkListProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>≡ FEATURED LINK LIST (MOCK DATA)</CardTitle>
        <Badge variant="signal">{links.length} ITEMS</Badge>
      </CardHeader>

      <CardContent className="space-y-2">
        {links.map((link) => (
          <LinkCardItem key={link.id} link={link} onLinkClick={onLinkClick} />
        ))}
      </CardContent>
    </Card>
  );
}
