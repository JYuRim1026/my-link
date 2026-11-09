"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  UserCog,
  CheckCircle2,
  XCircle,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";
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

const editProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, "닉네임(displayName)은 최소 2자 이상 입력해주세요.")
    .max(20, "닉네임(displayName)은 최대 20자까지 입력 가능합니다.")
    .regex(
      /^[a-zA-Z0-9가-힣._-]+$/,
      "닉네임은 한글, 영문, 숫자, 밑줄(_), 하이픈(-), 마침표(.)만 사용할 수 있습니다."
    ),
  role: z
    .string()
    .min(1, "역할/직함(Role)을 입력해주세요.")
    .max(40, "역할/직함은 최대 40자까지 입력 가능합니다."),
  bio: z
    .string()
    .min(1, "자기소개(Bio)를 입력해주세요.")
    .max(120, "자기소개는 최대 120자까지 입력 가능합니다."),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export function EditProfileDialog() {
  const user = useLinkStore((state) => state.user);
  const checkDisplayNameDuplicate = useLinkStore(
    (state) => state.checkDisplayNameDuplicate
  );
  const updateProfile = useLinkStore((state) => state.updateProfile);

  const [open, setOpen] = React.useState(false);
  const [isCheckingDup, setIsCheckingDup] = React.useState(false);
  // 'idle' | 'available' | 'duplicate'
  const [dupStatus, setDupStatus] = React.useState<
    "idle" | "available" | "duplicate"
  >("idle");
  const [checkedName, setCheckedName] = React.useState("");

  const currentDisplayName = user?.displayName || user?.name || "";
  const currentRole = user?.role || "Backend & Server Engineer";
  const currentBio =
    user?.bio ||
    "안정적인 백엔드 시스템과 99.9% 업타임의 서버 아키텍처를 구축하는 개발자입니다.";

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      displayName: currentDisplayName,
      role: currentRole,
      bio: currentBio,
    },
    mode: "onChange",
  });

  const watchedDisplayName = form.watch("displayName");
  const watchedRole = form.watch("role");
  const watchedBio = form.watch("bio");
  const isSubmitting = form.formState.isSubmitting;

  // 모달이 열릴 때 현재 유저 정보로 초기화
  React.useEffect(() => {
    if (open && user) {
      const initName = user.displayName || user.name || "";
      form.reset({
        displayName: initName,
        role: user.role || "Backend & Server Engineer",
        bio:
          user.bio ||
          "안정적인 백엔드 시스템과 99.9% 업타임의 서버 아키텍처를 구축하는 개발자입니다.",
      });
      setDupStatus("available");
      setCheckedName(initName);
    }
  }, [open, user, form]);

  // displayName 입력값이 바뀌면 중복 확인 상태 리셋 (단, 기존 본인 닉네임과 같으면 available)
  React.useEffect(() => {
    const trimmed = (watchedDisplayName || "").trim();
    if (!trimmed) {
      setDupStatus("idle");
      return;
    }
    if (trimmed === currentDisplayName) {
      setDupStatus("available");
      setCheckedName(trimmed);
    } else if (trimmed !== checkedName) {
      setDupStatus("idle");
    }
  }, [watchedDisplayName, currentDisplayName, checkedName]);

  // [중복 확인] 버튼 핸들러
  const handleCheckDuplicate = async () => {
    const isValid = await form.trigger("displayName");
    if (!isValid) return;

    const targetName = watchedDisplayName.trim();
    if (targetName === currentDisplayName) {
      setDupStatus("available");
      setCheckedName(targetName);
      toast.success("현재 사용 중인 본인의 닉네임입니다.");
      return;
    }

    setIsCheckingDup(true);
    try {
      const isDup = await checkDisplayNameDuplicate(targetName);
      setCheckedName(targetName);
      if (isDup) {
        setDupStatus("duplicate");
        form.setError("displayName", {
          type: "manual",
          message: "이미 다른 사용자가 사용 중인 displayName입니다.",
        });
        toast.error("이미 사용 중인 닉네임(displayName)입니다.");
      } else {
        setDupStatus("available");
        form.clearErrors("displayName");
        toast.success(`"${targetName}" 닉네임은 사용 가능합니다!`);
      }
    } catch {
      toast.error("중복 확인 중 오류가 발생했습니다.");
    } finally {
      setIsCheckingDup(false);
    }
  };

  const onSubmit = async (data: EditProfileFormValues) => {
    const trimmedName = data.displayName.trim();
    const trimmedRole = data.role.trim();
    const trimmedBio = data.bio.trim();

    // 변경된 사항이 하나도 없는 경우 Firestore 업데이트 없이 종료
    const isUnchanged =
      trimmedName === currentDisplayName &&
      trimmedRole === currentRole &&
      trimmedBio === currentBio;

    if (isUnchanged) {
      toast.info("변경된 사항이 없습니다.");
      setOpen(false);
      return;
    }

    // 기존 본인 닉네임이 아닌데 아직 중복 확인을 안 한 경우 자동으로 확인 진행
    if (trimmedName !== currentDisplayName && dupStatus !== "available") {
      setIsCheckingDup(true);
      const isDup = await checkDisplayNameDuplicate(trimmedName);
      setIsCheckingDup(false);
      setCheckedName(trimmedName);

      if (isDup) {
        setDupStatus("duplicate");
        form.setError("displayName", {
          type: "manual",
          message: "이미 다른 사용자가 사용 중인 displayName입니다.",
        });
        toast.error("이미 사용 중인 닉네임(displayName)입니다.");
        return;
      }
      setDupStatus("available");
    }

    if (dupStatus === "duplicate") {
      form.setError("displayName", {
        type: "manual",
        message: "이미 다른 사용자가 사용 중인 displayName입니다.",
      });
      return;
    }

    try {
      await updateProfile({
        displayName: trimmedName,
        role: data.role.trim(),
        bio: data.bio.trim(),
      });
      setOpen(false);
    } catch (err) {
      if (err instanceof Error && err.message === "DUPLICATE_DISPLAY_NAME") {
        setDupStatus("duplicate");
        form.setError("displayName", {
          type: "manual",
          message: "이미 다른 사용자가 사용 중인 displayName입니다.",
        });
      }
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (isSubmitting) return;
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="amber"
          size="lg"
          className="shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <UserCog className="w-4 h-4 text-[#21242e]" />
          <span>프로필 수정</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        {/* 프로필 저장 중 로딩 오버레이 */}
        {isSubmitting && (
          <div className="absolute inset-0 z-50 bg-[#21242e]/60 backdrop-blur-[1px] rounded-[6px] flex flex-col items-center justify-center gap-2 text-white">
            <div className="bg-[#21242e] border-2 border-white px-4 py-3 rounded-[4px] shadow-xl flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#f68d1f]" />
              <span className="text-xs font-bold uppercase tracking-[0.5px] text-[#ecab37]">
                프로필 정보 저장 및 동기화 중...
              </span>
            </div>
          </div>
        )}

        <DialogHeader>
          <DialogTitle>
            <UserCog className="w-4 h-4 text-[#f68d1f]" />
            <span>마이페이지 프로필 수정 (EDIT PROFILE)</span>
          </DialogTitle>
          <DialogDescription>
            닉네임(displayName), 역할 배지, 자기소개를 수정하고 중복 여부를 확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3.5 mt-1"
            noValidate
          >
            {/* 1. 닉네임 (displayName) + 중복 확인 버튼 */}
            <FormField
              control={form.control}
              name="displayName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>닉네임 (displayName) *</FormLabel>
                    <span className="text-[10px] text-[#3d4f97]">
                      {(watchedDisplayName || "").length}/20자
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FormControl>
                      <Input
                        placeholder="예: mylink_dev"
                        className={
                          fieldState.error
                            ? "border-[#e60012] bg-red-50/50"
                            : dupStatus === "available"
                            ? "border-[#16a34a] bg-green-50/30"
                            : ""
                        }
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="carbon"
                      size="default"
                      disabled={
                        isSubmitting ||
                        isCheckingDup ||
                        !(watchedDisplayName || "").trim()
                      }
                      onClick={handleCheckDuplicate}
                      className="h-9 px-3 shrink-0 gap-1 cursor-pointer"
                    >
                      {isCheckingDup ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ecab37]" />
                          <span>확인 중</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-3.5 h-3.5 text-[#ecab37]" />
                          <span>중복 확인</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {/* 중복 확인 결과 메시지 */}
                  {!fieldState.error && dupStatus === "available" && (
                    <p className="text-[10px] font-bold text-[#15803d] mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {watchedDisplayName.trim() === currentDisplayName
                          ? "현재 사용 중인 본인의 닉네임입니다."
                          : "사용 가능한 닉네임(displayName)입니다!"}
                      </span>
                    </p>
                  )}
                  {dupStatus === "duplicate" && !fieldState.error && (
                    <p className="text-[10px] font-bold text-[#e60012] mt-0.5 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>이미 다른 사용자가 사용 중인 displayName입니다.</span>
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 2. 역할 / 직함 (Role) */}
            <FormField
              control={form.control}
              name="role"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>역할 / 직함 배지 (ROLE) *</FormLabel>
                    <span className="text-[10px] text-[#3d4f97]">
                      {(watchedRole || "").length}/40자
                    </span>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="예: Backend & Server Engineer"
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

            {/* 3. 자기소개 (Bio) */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>자기소개 (BIO) *</FormLabel>
                    <span className="text-[10px] text-[#3d4f97]">
                      {(watchedBio || "").length}/120자
                    </span>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="자신을 소개하는 한 줄 문구를 입력하세요"
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={() => handleOpenChange(false)}
                className="cursor-pointer"
              >
                취소 (CANCEL)
              </Button>
              <Button
                type="submit"
                variant="signal"
                size="sm"
                disabled={isSubmitting || isCheckingDup}
                className="gap-1 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>저장 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>저장하기 (SAVE)</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
