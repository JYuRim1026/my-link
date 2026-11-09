"use client";

import * as React from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLinkStore } from "@/store/useLinkStore";

interface DeleteLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  linkId: string;
  linkTitle: string;
}

export function DeleteLinkDialog({
  open,
  onOpenChange,
  linkId,
  linkTitle,
}: DeleteLinkDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const deleteLink = useLinkStore((state) => state.deleteLink);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteLink(linkId);
      onOpenChange(false);
    } catch {
      // 에러는 store의 error 상태에 표시됨
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (isDeleting) return;
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        {/* 삭제 및 목록 갱신 도중 모달 내부 오버레이 로딩 표시 */}
        {isDeleting && (
          <div className="absolute inset-0 z-50 bg-[#21242e]/60 backdrop-blur-[1px] rounded-[6px] flex flex-col items-center justify-center gap-2 text-white">
            <div className="bg-[#21242e] border-2 border-white px-4 py-3 rounded-[4px] shadow-xl flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#e60012]" />
              <span className="text-xs font-bold uppercase tracking-[0.5px] text-[#ecab37]">
                링크 삭제 및 목록 갱신 중...
              </span>
            </div>
          </div>
        )}

        <DialogHeader>
          <DialogTitle className="text-[#21242e] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#e60012]" />
            <span>정말 삭제하시겠습니까?</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-1">
          {/* 삭제 대상 링크 이름 표시 */}
          <div className="p-2.5 bg-white border-2 border-[#3d4f97] rounded-[3px] shadow-inner">
            <p className="text-[10px] font-bold uppercase text-[#3d4f97] mb-0.5">
              삭제할 링크 이름
            </p>
            <p className="text-xs sm:text-sm font-bold text-[#21242e] break-all">
              {linkTitle}
            </p>
          </div>

          {/* 빨간색 경고 문구 */}
          <p className="text-xs font-bold text-[#e60012] flex items-center gap-1">
            <span>⚠️</span>
            <span>이 작업은 되돌릴 수 없습니다.</span>
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isDeleting}
            onClick={() => handleOpenChange(false)}
            className="cursor-pointer"
          >
            취소
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={isDeleting}
            onClick={handleConfirmDelete}
            className="gap-1 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>삭제 중...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>삭제하기</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
