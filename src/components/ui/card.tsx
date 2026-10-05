import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Nintendo 2001 Console Hardware Card / Panel Component (shadcn/ui base)
 * Spec mapping from design.md:
 * - Level 1 Plate: Raised mid panel in Light Periwinkle (#8ba1d4)
 * - Bevel Treatment: Bright top/left highlight edge (border-white) + Chrome Indigo (#3d4f97) shadow line beneath
 * - Rounded Scale: rounded-[6px] for content panels ({rounded.md})
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-[#8ba1d4] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#3d4f97] p-3 text-[#21242e] shadow-sm rounded-[6px]",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-[#7a8aba] border-b-2 border-[#3d4f97] pb-1.5 mb-2 flex items-center justify-between font-bold text-xs uppercase tracking-[0.5px] text-[#21242e]",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xs font-bold uppercase text-[#21242e] tracking-[0.5px]", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
));
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };
