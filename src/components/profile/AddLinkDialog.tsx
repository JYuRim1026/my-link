"use client";

import * as React from "react";
import { Plus, Link as LinkIcon, Sparkles, AlertCircle } from "lucide-react";
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

interface FormErrors {
  title?: string;
  url?: string;
  description?: string;
  badge?: string;
}

export function AddLinkDialog() {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [badge, setBadge] = React.useState("DEV");

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const addLink = useLinkStore((state) => state.addLink);

  // Validate single field or all fields
  const validate = React.useCallback(
    (fieldValues: {
      title?: string;
      url?: string;
      description?: string;
      badge?: string;
    }): FormErrors => {
      const newErrors: FormErrors = {};

      // Title Validation
      if ("title" in fieldValues) {
        const val = fieldValues.title?.trim() ?? "";
        if (!val) {
          newErrors.title = "링크 제목을 입력해주세요.";
        } else if (val.length > 50) {
          newErrors.title = "링크 제목은 최대 50자까지 입력 가능합니다.";
        }
      }

      // URL Validation
      if ("url" in fieldValues) {
        const val = fieldValues.url?.trim() ?? "";
        const urlPattern =
          /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=#]*)?$/i;

        if (!val) {
          newErrors.url = "URL 주소를 입력해주세요.";
        } else if (!urlPattern.test(val)) {
          newErrors.url =
            "올바른 URL 형식(예: https://example.com 또는 example.com)을 입력해주세요.";
        }
      }

      // Description Validation
      if ("description" in fieldValues) {
        const val = fieldValues.description?.trim() ?? "";
        if (val.length > 100) {
          newErrors.description = "설명은 최대 100자까지 입력 가능합니다.";
        }
      }

      // Badge Validation
      if ("badge" in fieldValues) {
        const val = fieldValues.badge?.trim() ?? "";
        if (!val) {
          newErrors.badge = "배지 태그를 입력하거나 선택해주세요.";
        } else if (val.length > 15) {
          newErrors.badge = "배지 태그는 최대 15자까지 입력 가능합니다.";
        }
      }

      return newErrors;
    },
    []
  );

  // Field change handlers with real-time validation
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (touched.title) {
      const fieldErrors = validate({ title: val });
      setErrors((prev) => ({ ...prev, title: fieldErrors.title }));
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrl(val);
    if (touched.url) {
      const fieldErrors = validate({ url: val });
      setErrors((prev) => ({ ...prev, url: fieldErrors.url }));
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDescription(val);
    if (touched.description) {
      const fieldErrors = validate({ description: val });
      setErrors((prev) => ({ ...prev, description: fieldErrors.description }));
    }
  };

  const handleBadgeChange = (val: string) => {
    setBadge(val);
    if (touched.badge) {
      const fieldErrors = validate({ badge: val });
      setErrors((prev) => ({ ...prev, badge: fieldErrors.badge }));
    }
  };

  // On blur validation trigger
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const currentValues = { title, url, description, badge };
    const fieldErrors = validate({ [field]: currentValues[field as keyof typeof currentValues] });
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field as keyof FormErrors] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ title: true, url: true, description: true, badge: true });

    // Validate all fields
    const allErrors = validate({ title, url, description, badge });
    setErrors(allErrors);

    // Stop if there are any errors
    if (Object.keys(allErrors).length > 0) {
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
      badge: badge.trim().toUpperCase(),
    });

    // Reset Form & Errors
    setTitle("");
    setUrl("");
    setDescription("");
    setBadge("DEV");
    setErrors({});
    setTouched({});
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset errors and fields on modal close
      setTitle("");
      setUrl("");
      setDescription("");
      setBadge("DEV");
      setErrors({});
      setTouched({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-1" noValidate>
          {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
            <div className="p-2.5 rounded-[2px] bg-[#e60012] text-white text-[11px] font-bold uppercase tracking-[0.5px] flex items-center gap-2 shadow-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>입력 항목을 확인해주세요. 오류가 있습니다.</span>
            </div>
          )}

          {/* Title Field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.5px]">
              <label className="text-[#21242e]">링크 제목 *</label>
              <span className="text-[10px] text-[#3d4f97]">{title.length}/50자</span>
            </div>
            <Input
              placeholder="예: GitHub - 오픈소스 파이프라인"
              value={title}
              onChange={handleTitleChange}
              onBlur={() => handleBlur("title")}
              className={errors.title ? "border-[#e60012] bg-red-50/50" : ""}
            />
            {errors.title && (
              <p className="text-[10px] font-bold text-[#e60012] mt-0.5 flex items-center gap-1">
                <span>⚠️</span> {errors.title}
              </p>
            )}
          </div>

          {/* URL Field */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#21242e] block">
              URL 주소 *
            </label>
            <Input
              placeholder="https://github.com/my-profile"
              value={url}
              onChange={handleUrlChange}
              onBlur={() => handleBlur("url")}
              className={errors.url ? "border-[#e60012] bg-red-50/50" : ""}
            />
            {errors.url && (
              <p className="text-[10px] font-bold text-[#e60012] mt-0.5 flex items-center gap-1">
                <span>⚠️</span> {errors.url}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.5px]">
              <label className="text-[#21242e]">설명 (선택)</label>
              <span className="text-[10px] text-[#3d4f97]">{description.length}/100자</span>
            </div>
            <Input
              placeholder="링크에 대한 간단한 상세 설명 입력"
              value={description}
              onChange={handleDescriptionChange}
              onBlur={() => handleBlur("description")}
              className={errors.description ? "border-[#e60012] bg-red-50/50" : ""}
            />
            {errors.description && (
              <p className="text-[10px] font-bold text-[#e60012] mt-0.5 flex items-center gap-1">
                <span>⚠️</span> {errors.description}
              </p>
            )}
          </div>

          {/* Badge Field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.5px]">
              <label className="text-[#21242e]">카테고리 배지 태그 *</label>
              <span className="text-[10px] text-[#3d4f97]">PRESET CHIPS</span>
            </div>

            {/* Badge Presets */}
            <div className="flex flex-wrap gap-1 mb-1.5">
              {BADGE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleBadgeChange(preset)}
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
              onChange={(e) => handleBadgeChange(e.target.value)}
              onBlur={() => handleBlur("badge")}
              className={errors.badge ? "border-[#e60012] bg-red-50/50" : ""}
            />
            {errors.badge && (
              <p className="text-[10px] font-bold text-[#e60012] mt-0.5 flex items-center gap-1">
                <span>⚠️</span> {errors.badge}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenChange(false)}
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
