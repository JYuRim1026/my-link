"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType | undefined>(
  undefined
);

export function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a Dialog");
  }
  return context;
}

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open: openProp, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setInternalOpen(value);
      }
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export interface DialogTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function DialogTrigger({
  children,
  className,
  asChild,
  ...props
}: DialogTriggerProps) {
  const { setOpen } = useDialog();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<{ onClick?: React.MouseEventHandler }>,
      {
        onClick: (e: React.MouseEvent) => {
          (children.props as { onClick?: React.MouseEventHandler })?.onClick?.(e);
          setOpen(true);
        },
      }
    );
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

export function DialogContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open, setOpen } = useDialog();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0"
        onClick={() => setOpen(false)}
      />

      {/* Dialog Body Panel - Nintendo 2001 Bevel Metal Plate */}
      <div
        className={cn(
          "relative z-50 w-full max-w-md rounded-[6px] bg-[#8ba1d4] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#3d4f97] p-5 shadow-2xl text-[#21242e] animate-in fade-in-0 zoom-in-95",
          className
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 inline-flex items-center justify-center h-6 w-6 rounded-[2px] bg-[#21242e] text-white hover:bg-[#e60012] border border-white transition-colors cursor-pointer select-none"
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">닫기</span>
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1 text-left pb-3 mb-3 border-b-2 border-[#3d4f97]",
        className
      )}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-xs sm:text-sm font-bold uppercase tracking-[0.5px] text-[#21242e] flex items-center gap-2",
        className
      )}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-[11px] text-[#21242e]/80", className)}
      {...props}
    />
  );
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 pt-3 mt-4 border-t border-[#3d4f97]/40",
        className
      )}
      {...props}
    />
  );
}

export function DialogClose({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useDialog();

  return (
    <button
      type="button"
      onClick={() => setOpen(false)}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}
