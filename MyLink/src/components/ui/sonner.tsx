"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-[#21242e] text-white border-t-2 border-l-2 border-white/60 border-b-2 border-r-2 border-black shadow-2xl rounded-[4px] font-sans text-xs font-bold tracking-[0.3px]",
          description: "text-[#9fbee7] text-[11px] font-normal",
          actionButton:
            "bg-[#f68d1f] text-white font-bold uppercase rounded-[2px]",
          cancelButton:
            "bg-[#8ba1d4] text-[#21242e] font-bold uppercase rounded-[2px]",
          success: "!border-[#ecab37] !text-[#ecab37]",
          error: "!border-[#e60012] !bg-[#e60012] !text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
