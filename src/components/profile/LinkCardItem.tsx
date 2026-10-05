"use client";

import {
  Code,
  BookOpen,
  FileCode,
  Briefcase,
  Video,
  Coffee,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LinkItem } from "@/data/mockLinks";

interface LinkCardItemProps {
  link: LinkItem;
  onLinkClick: (id: string, url: string) => void;
}

export function LinkCardItem({ link, onLinkClick }: LinkCardItemProps) {
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

  return (
    <div
      onClick={() => onLinkClick(link.id, link.url)}
      className="bg-[#dedede] hover:bg-white border-t border-l border-white border-b border-r border-[#3d4f97] p-2.5 sm:p-3 flex items-center justify-between gap-3 text-[#21242e] group cursor-pointer transition-all shadow-xs w-full min-w-0"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="p-2 rounded-xs bg-[#21242e] text-[#ecab37] border border-black group-hover:bg-[#e60012] group-hover:text-white transition-colors shrink-0">
          {renderIcon(link.iconName)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
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

      {/* Right Click Count & Action Button */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[10px] font-mono font-bold bg-[#9fbee7] text-[#21242e] px-2 py-0.5 rounded-xs border border-[#3d4f97] hidden sm:inline-block">
          {link.clicks} Clicks
        </span>
        <Button variant="default" size="sm" className="px-2 py-1">
          <ExternalLink className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
