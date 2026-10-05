"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLinkStore } from "@/store/useLinkStore";

const BADGE_PRESETS = ["DEV", "BLOG", "SYS", "WORK", "VIDEO", "SUPPORT"];

// Zod Schema Definition
const addLinkSchema = z.object({
  title: z
    .string()
    .min(1, "링크 제목을 입력해주세요.")
    .max(50, "링크 제목은 최대 50자까지 입력 가능합니다."),
  url: z
    .string()
    .min(1, "URL 주소를 입력해주세요.")
    .regex(
      /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=#]*)?$/i,
      "올바른 URL 형식(예: https://example.com 또는 example.com)을 입력해주세요."
    ),
  description: z
    .string()
    .max(100, "설명은 최대 100자까지 입력 가능합니다.")
    .optional()
    .or(z.literal("")),
  badge: z
    .string()
    .min(1, "배지 태그를 입력하거나 선택해주세요.")
    .max(15, "배지 태그는 최대 15자까지 입력 가능합니다."),
});

type AddLinkFormValues = z.infer<typeof addLinkSchema>;

export function AddLinkDialog() {
  const [open, setOpen] = React.useState(false);
  const addLink = useLinkStore((state) => state.addLink);

  const form = useForm<AddLinkFormValues>({
    resolver: zodResolver(addLinkSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
      badge: "DEV",
    },
    mode: "onChange",
  });

  const titleValue = form.watch("title");
  const descriptionValue = form.watch("description");
  const badgeValue = form.watch("badge");

  const onSubmit = (data: AddLinkFormValues) => {
    let formattedUrl = data.url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    addLink({
      title: data.title.trim(),
      url: formattedUrl,
      description: data.description?.trim() ?? "",
      badge: data.badge.trim().toUpperCase(),
    });

    // Reset Form & Close
    form.reset({
      title: "",
      url: "",
      description: "",
      badge: "DEV",
    });
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
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
            <span>새 링크 추가 (NEW LINK - ZOD & RHF)</span>
          </DialogTitle>
          <DialogDescription>
            마이링크 프로필 리스트에 노출할 신규 외부 링크를 입력하세요.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5 mt-1" noValidate>
            {Object.keys(form.formState.errors).length > 0 && form.formState.isSubmitted && (
              <div className="p-2.5 rounded-[2px] bg-[#e60012] text-white text-[11px] font-bold uppercase tracking-[0.5px] flex items-center gap-2 shadow-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>입력 양식에 오류가 있습니다. 아래 항목을 확인해주세요.</span>
              </div>
            )}

            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>링크 제목 *</FormLabel>
                    <span className="text-[10px] text-[#3d4f97]">
                      {(titleValue || "").length}/50자
                    </span>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="예: GitHub - 오픈소스 파이프라인"
                      className={fieldState.error ? "border-[#e60012] bg-red-50/50" : ""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* URL Field */}
            <FormField
              control={form.control}
              name="url"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>URL 주소 *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/my-profile"
                      className={fieldState.error ? "border-[#e60012] bg-red-50/50" : ""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>설명 (선택)</FormLabel>
                    <span className="text-[10px] text-[#3d4f97]">
                      {(descriptionValue || "").length}/100자
                    </span>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="링크에 대한 간단한 상세 설명 입력"
                      className={fieldState.error ? "border-[#e60012] bg-red-50/50" : ""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Badge Field */}
            <FormField
              control={form.control}
              name="badge"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>카테고리 배지 태그 *</FormLabel>
                    <span className="text-[10px] text-[#3d4f97]">PRESET CHIPS</span>
                  </div>

                  {/* Badge Presets */}
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {BADGE_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => form.setValue("badge", preset, { shouldValidate: true })}
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-[2px] border transition-colors cursor-pointer ${
                          badgeValue === preset
                            ? "bg-[#ecab37] text-[#21242e] border-black font-extrabold"
                            : "bg-[#21242e] text-[#9fbee7] border-[#3d4f97] hover:bg-[#3d4f97] hover:text-white"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  <FormControl>
                    <Input
                      placeholder="커스텀 배지명 입력 (예: DESIGN)"
                      className={fieldState.error ? "border-[#e60012] bg-red-50/50" : ""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
        </Form>
      </DialogContent>
    </Dialog>
  );
}
