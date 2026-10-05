"use client";

import * as React from "react";
import { Plus, Link as LinkIcon, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLinkStore } from "@/store/useLinkStore";

const BADGE_PRESETS = ["DEV", "BLOG", "SYS", "WORK", "VIDEO", "SUPPORT"];

export function AddLinkDialog() {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [badge, setBadge] = React.useState("DEV");
  const [error, setError] = React.useState("");

  const addLink = useLinkStore((state) => state.addLink);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("링크 제목을 입력해주세요.");
      return;
    }

    if (!url.trim()) {
      setError("URL 주소를 입력해주세요.");
      return;
    }

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    addLink({
      title: title.trim(),
      url: formattedUrl,
      description: description.trim(),
      badge: badge.toUpperCase(),
    });

    // Reset Form & Close
    setTitle("");
    setUrl("");
    setDescription("");
    setBadge("DEV");
    setError("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="signal" size="sm" className="gap-1.5 cursor-pointer shadow-md">
          <Plus className="w-3.5 h-3.5" />
          <span>링크 추가 (ADD LINK)</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            <LinkIcon className="w-4 h-4 text-[#f68d1f]" />
            <span>새 링크 추가 (NEW LINK)</span>
          </DialogTitle>
          <DialogDescription>
            마이링크 프로필 리스트에 노출할 신규 외부 링크를 입력하세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 mt-1">
          {error && (
            <div className="p-2 rounded-[2px] bg-[#e60012] text-white text-[11px] font-bold uppercase tracking-[0.5px]">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#21242e] flex items-center gap-1">
              <span>링크 제목 *</span>
            </label>
            <Input
              placeholder="예: GitHub - 오픈소스 파이프라인"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#21242e]">
              <span>URL 주소 *</span>
            </label>
            <Input
              placeholder="https://github.com/my-profile"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#21242e]">
              <span>설명 (선택)</span>
            </label>
            <Input
              placeholder="링크에 대한 간단한 상세 설명 입력"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#21242e] flex items-center justify-between">
              <span>카테고리 배지 태그</span>
              <span className="text-[10px] text-[#3d4f97] font-semibold">PRESET</span>
            </label>

            {/* Badge Presets */}
            <div className="flex flex-wrap gap-1 mb-1.5">
              {BADGE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setBadge(preset)}
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-[2px] border transition-colors cursor-pointer ${
                    badge === preset
                      ? "bg-[#ecab37] text-[#21242e] border-black font-extrabold"
                      : "bg-[#21242e] text-[#9fbee7] border-[#3d4f97] hover:bg-[#3d4f97] hover:text-white"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            <Input
              placeholder="커스텀 배지명 입력 (예: DESIGN)"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              취소 (CANCEL)
            </Button>
            <Button type="submit" variant="signal" size="sm" className="gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>추가하기 (SUBMIT)</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
