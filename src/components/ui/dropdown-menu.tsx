"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = React.createContext<
  DropdownMenuContextType | undefined
>(undefined);

export function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error(
      "useDropdownMenu must be used within a <DropdownMenu> component"
    );
  }
  return context;
}

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // 바깥 영역 클릭 또는 ESC 키 입력 시 닫기
  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
  asChild,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { open, setOpen } = useDropdownMenu();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<{ onClick?: React.MouseEventHandler }>,
      {
        onClick: (e: React.MouseEvent) => {
          (
            children.props as { onClick?: React.MouseEventHandler }
          )?.onClick?.(e);
          setOpen(!open);
        },
      }
    );
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  children,
  className,
  align = "end",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "end";
}) {
  const { open } = useDropdownMenu();

  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute z-50 mt-1.5 w-72 rounded-[4px] bg-[#8ba1d4] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#3d4f97] p-2.5 text-[#21242e] shadow-2xl animate-in fade-in-0 zoom-in-95",
        align === "end" ? "right-0" : "left-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-2 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#3d4f97]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return (
    <div
      className={cn("my-2 h-[2px] bg-[#3d4f97]/40 border-b border-white/50", className)}
    />
  );
}

export function DropdownMenuItem({
  children,
  className,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const { setOpen } = useDropdownMenu();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        onClick?.();
        setOpen(false);
      }}
      className={cn(
        "w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-bold text-left rounded-[2px] transition-colors cursor-pointer select-none hover:bg-[#21242e] hover:text-[#ecab37] disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
    >
      {children}
    </button>
  );
}
