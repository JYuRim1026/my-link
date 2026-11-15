import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Nintendo 2001 Console Hardware Badge Component (shadcn/ui base)
 * Spec mapping from design.md:
 * - Logo Pill: White background, Nintendo Red (#e60012) text/border, rounded-full ({rounded.full})
 * - Amber Chip: Amber (#ecab37) background, Carbon Navy (#21242e) text, rounded-[2px] ({rounded.xs})
 * - Category Badge: Carbon (#21242e) background, Amber text, Chrome Indigo (#3d4f97) border
 * - Signal Badge: Signal Orange (#f68d1f) background, White text
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center font-bold uppercase text-[10px] tracking-[0.5px] select-none shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#21242e] text-[#ecab37] px-1.5 py-0.5 rounded-[2px] border border-[#3d4f97]",
        amber:
          "bg-[#ecab37] text-[#21242e] border border-black px-2 py-0.5 rounded-[2px]",
        pill:
          "bg-white text-[#e60012] border-2 border-[#e60012] px-2.5 py-0.5 rounded-full italic font-black text-xs sm:text-sm",
        signal:
          "bg-[#f68d1f] text-white border border-white px-2 py-0.5 rounded-[2px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
