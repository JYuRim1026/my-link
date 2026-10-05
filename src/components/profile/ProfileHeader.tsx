import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  avatarUrl: string;
  name: string;
  statusText: string;
}

export function ProfileHeader({
  avatarUrl,
  name,
  statusText,
}: ProfileHeaderProps) {
  return (
    <header className="w-full space-y-2">
      {/* Masthead Header Row: Mascot & Speech Bubble */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-2 px-1 sm:px-2 w-full">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white bg-[#e60012] p-0.5 shadow-md shrink-0 overflow-hidden relative">
            <Image
              src={avatarUrl}
              alt={name}
              width={48}
              height={48}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div className="relative bg-white border-2 border-[#3d4f97] rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-sm text-[11px] sm:text-xs font-bold text-[#21242e] flex items-center gap-1 flex-1 sm:flex-initial leading-tight">
            <span className="text-[#e60012] font-black shrink-0">MARIO:</span>
            <span className="truncate">"Welcome to MyLink Profile! 🎮"</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant="amber">{statusText}</Badge>
          <Badge variant="pill">MyLink v2.0</Badge>
        </div>
      </div>

      {/* Primary Carbon Navigation Bar */}
      <div className="bg-[#21242e] bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:6px_6px] border-t-2 border-l-2 border-white/40 border-b-2 border-r-2 border-black p-2 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md w-full">
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <Badge variant="pill">Nintendo® MyLink</Badge>
        </div>

        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 sm:gap-4 font-black text-[11px] sm:text-xs tracking-wider text-[#e48600] overflow-x-auto whitespace-nowrap py-0.5 px-1">
          <a href="#" className="hover:text-white transition-colors">GAMES</a>
          <a href="#" className="hover:text-white transition-colors">SYSTEMS</a>
          <a href="#" className="hover:text-white transition-colors">NEWS</a>
          <a href="#" className="hover:text-white transition-colors">NSIDER</a>
          <a href="#" className="hover:text-white transition-colors">DOWNLOADS</a>
        </div>
      </div>
    </header>
  );
}
