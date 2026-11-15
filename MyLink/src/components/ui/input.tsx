import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Nintendo 2001 Console Hardware Input Component (shadcn/ui base)
 * Spec mapping from design.md:
 * - White background surface with recessed inset shadow look
 * - Chrome Indigo (#3d4f97) 2px border
 * - Focus ring in Signal Orange (#f68d1f)
 * - Carbon Navy (#21242e) text
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-[3px] border-2 border-[#3d4f97] bg-white px-3 py-1 text-xs text-[#21242e] placeholder:text-[#60619c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f68d1f] disabled:cursor-not-allowed disabled:opacity-50 font-sans shadow-inner transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
