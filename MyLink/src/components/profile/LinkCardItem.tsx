"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Code,
  BookOpen,
  FileCode,
  Briefcase,
  Video,
  Coffee,
  ExternalLink,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
  MousePointerClick,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { LinkItem } from "@/data/mockLinks";
import { useUpdateLinkMutation } from "@/hooks/useLinks";
import { DeleteLinkDialog } from "./DeleteLinkDialog";

const BADGE_PRESETS = ["DEV", "BLOG", "SYS", "WORK", "VIDEO", "SUPPORT"];

// 추가 다이얼로그와 100% 동일한 Zod 입력 검증 스키마
const editLinkSchema = z.object({
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

type EditLinkFormValues = z.infer<typeof editLinkSchema>;

interface LinkCardItemProps {
  link: LinkItem;
  onLinkClick: (id: string, url: string) => void;
}

export function LinkCardItem({ link, onLinkClick }: LinkCardItemProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const updateLinkMutation = useUpdateLinkMutation();

  const form = useForm<EditLinkFormValues>({
    resolver: zodResolver(editLinkSchema),
    defaultValues: {
      title: link.title,
      url: link.url,
      description: link.description || "",
      badge: link.badge || "DEV",
    },
    mode: "onChange",
  });

  const titleValue = form.watch("title");
  const descriptionValue = form.watch("description");
  const badgeValue = form.watch("badge");
  const isSubmitting = form.formState.isSubmitting || updateLinkMutation.isPending;

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

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    form.reset({
      title: link.title,
      url: link.url,
      description: link.description || "",
      badge: link.badge || "DEV",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    form.reset();
    setIsEditing(false);
  };

  const onEditSubmit = async (data: EditLinkFormValues) => {
    let formattedUrl = data.url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      await updateLinkMutation.mutateAsync({
        id: link.id,
        updatedData: {
          title: data.title.trim(),
          url: formattedUrl,
          description: data.description?.trim() ?? "",
          badge: data.badge.trim().toUpperCase(),
        },
      });
      setIsEditing(false);
    } catch {
      // 에러 발생 시 인라인 편집 창 유지
    }
  };

  // 인라인 편집 모드 UI
  if (isEditing) {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#f0f4ff] border-2 border-[#f68d1f] p-3 sm:p-4 text-[#21242e] shadow-md w-full rounded-[3px] space-y-3"
      >
        <div className="flex items-center justify-between border-b-2 border-[#3d4f97] pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.5px] text-[#3d4f97]">
            <Pencil className="w-3.5 h-3.5 text-[#f68d1f]" />
            <span>링크 인라인 수정 (INLINE EDIT)</span>
          </div>
          <Badge variant="amber">EDIT MODE</Badge>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onEditSubmit)}
            className="space-y-3"
            noValidate
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 제목 필드 */}
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
                        placeholder="링크 제목 입력"
                        className={
                          fieldState.error ? "border-[#e60012] bg-red-50/50" : ""
                        }
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* URL 필드 */}
              <FormField
                control={form.control}
                name="url"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>URL 주소 *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        className={
                          fieldState.error ? "border-[#e60012] bg-red-50/50" : ""
                        }
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 설명 필드 */}
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
                      placeholder="링크에 대한 간단한 설명 입력"
                      className={
                        fieldState.error ? "border-[#e60012] bg-red-50/50" : ""
                      }
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 배지 태그 필드 */}
            <FormField
              control={form.control}
              name="badge"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>카테고리 배지 태그 *</FormLabel>
                    <span className="text-[10px] text-[#3d4f97]">PRESET CHIPS</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {BADGE_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() =>
                          form.setValue("badge", preset, { shouldValidate: true })
                        }
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
                      placeholder="커스텀 배지명 입력"
                      className={
                        fieldState.error ? "border-[#e60012] bg-red-50/50" : ""
                      }
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 인라인 편집 하단 액션 버튼 */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#3d4f97]/30">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={handleCancelEdit}
                className="gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>취소</span>
              </Button>
              <Button
                type="submit"
                variant="signal"
                size="sm"
                disabled={isSubmitting}
                className="gap-1 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>저장 중...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>저장하기</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <>
      <div
        onClick={() => onLinkClick(link.id, link.url)}
        className="bg-[#dedede] hover:bg-white border-t border-l border-white border-b border-r border-[#3d4f97] p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[#21242e] group cursor-pointer transition-all shadow-xs w-full min-w-0"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="p-2 rounded-xs bg-[#21242e] text-[#ecab37] border border-black group-hover:bg-[#e60012] group-hover:text-white transition-colors shrink-0">
            {renderIcon(link.iconName || "ExternalLink")}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <Badge variant="default">{link.badge}</Badge>
              <h2 className="text-xs sm:text-sm font-bold text-[#3d4f97] group-hover:text-[#e60012] group-hover:underline truncate">
                {link.title}
              </h2>
            </div>
            <p className="text-[10px] sm:text-xs text-[#21242e] truncate">
              {link.description}
            </p>
            {link.updatedAt && (
              <p className="text-[10px] font-mono text-[#3d4f97]/80 mt-0.5">
                🕒 수정됨: {link.updatedAt}
              </p>
            )}
          </div>
        </div>

        {/* 우측: 항상 표시되는 조회/클릭 수(아이콘+숫자만, 0 포함) + [수정] [삭제] [이동] 버튼 */}
        <div
          className="flex items-center justify-end gap-1.5 shrink-0 flex-wrap"
          onClick={(e) => e.stopPropagation()}
        >
          <span
            className="inline-flex items-center gap-1 text-xs font-mono font-bold bg-[#21242e] text-[#ecab37] px-2.5 py-1 rounded-[2px] border border-black shadow-2xs"
            title="클릭 조회수"
          >
            <MousePointerClick className="w-3.5 h-3.5 text-[#f68d1f]" />
            <span>{Number(link.clicks ?? 0).toLocaleString()}</span>
          </span>

          {/* 항상 표시되는 수정 버튼 */}
          <Button
            type="button"
            variant="amber"
            size="sm"
            onClick={handleStartEdit}
            className="gap-1 px-2 py-1 cursor-pointer"
            title="링크 수정"
          >
            <Pencil className="w-3 h-3" />
            <span>수정</span>
          </Button>

          {/* 항상 표시되는 삭제 버튼 */}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
            className="gap-1 px-2 py-1 cursor-pointer"
            title="링크 삭제"
          >
            <Trash2 className="w-3 h-3" />
            <span>삭제</span>
          </Button>

          {/* 외부 링크 이동 버튼 */}
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onLinkClick(link.id, link.url);
            }}
            className="px-2 py-1 cursor-pointer"
            title="새 탭으로 링크 열기"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      <DeleteLinkDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        linkId={link.id}
        linkTitle={link.title}
      />
    </>
  );
}
