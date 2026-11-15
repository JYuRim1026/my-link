import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Nintendo 2001 Console Hardware Button Component (shadcn/ui base)
 * Spec mapping from design.md:
 * - Signal Orange (#f68d1f): Forward / Submit / CTA action ({colors.signal})
 * - Amber (#ecab37): Utility chips, Code Bank, Game Finder ({colors.amber})
 * - Carbon (#21242e): Command layer action buttons with halftone feel ({colors.carbon})
 * - Periwinkle (#8ba1d4): Raised chrome mid panel button ({colors.periwinkle})
 * - Bevel Treatment: Bright top/left highlight edge + hard bottom/right indigo/black shadow edge
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-xs font-bold uppercase tracking-[0.5px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3d4f97] disabled:pointer-events-none disabled:opacity-50 select-none shadow-sm active:translate-y-[1px]",
  {
    variants: {
      variant: {
        default:
          "bg-[#f68d1f] hover:bg-[#e48600] text-white rounded-[2px] border-t border-l border-white border-b-2 border-r-2 border-black",
        signal:
          "bg-[#f68d1f] hover:bg-[#e48600] text-white rounded-[2px] border-t border-l border-white border-b-2 border-r-2 border-black",
        amber:
          "bg-[#ecab37] hover:bg-[#e48600] text-[#21242e] rounded-[2px] border-t border-l border-white border-b-2 border-r-2 border-[#3d4f97]",
        carbon:
          "bg-[#21242e] hover:bg-[#3d4f97] text-white rounded-none border-t border-l border-white/40 border-b-2 border-r-2 border-black",
        periwinkle:
          "bg-[#8ba1d4] hover:bg-[#7a8aba] text-[#21242e] rounded-[4px] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#3d4f97]",
        destructive:
          "bg-[#e60012] hover:bg-[#b8000e] text-white rounded-[2px] border-t border-l border-white border-b-2 border-r-2 border-black",
        outline:
          "border-2 border-[#3d4f97] bg-white text-[#21242e] hover:bg-[#9fbee7] rounded-[2px]",
      },
      size: {
        default: "h-7 px-3 py-1 text-[11px]",
        sm: "h-6 px-2 py-0.5 text-[10px]",
        lg: "h-9 px-4 py-1.5 text-xs sm:text-sm",
        icon: "h-8 w-8 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
