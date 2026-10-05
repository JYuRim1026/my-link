"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useProfileStore, ThemePreset } from "@/store/useProfileStore";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState("option1");

  const { user, theme, links, incrementClick, setTheme, resetToDefault } =
    useProfileStore();

  // Hydration fix for LocalStorage Zustand store
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#7a8aba] flex items-center justify-center text-white font-mono">
        Loading MyLink Profile...
      </div>
    );
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkClick = (id: string, url: string) => {
    incrementClick(id);
    if (url && url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative selection:bg-[#f68d1f] selection:text-white overflow-x-hidden">
      
      {/* 🛠️ LIVE DEMO QUICK BAR (테마 시연 & LocalStorage 상태 제어 바) */}
      <header className="w-full bg-[#21242e] text-white py-2 px-3 flex flex-wrap items-center justify-between gap-2 border-b-2 border-black z-50 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="bg-[#e60012] text-white px-2 py-0.5 font-black rounded text-[10px]">
            DEMO MODE
          </span>
          <span className="font-bold hidden sm:inline">
            LocalStorage Sync Active
          </span>
        </div>

        {/* Theme Preset Switcher */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 text-[11px] hidden md:inline">THEME:</span>
          {(["nintendo2001", "neobrutalism", "minimal"] as ThemePreset[]).map(
            (t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded transition-colors ${
                  theme === t
                    ? "bg-[#f68d1f] text-white font-black"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {t === "nintendo2001"
                  ? "Nintendo '01"
                  : t === "neobrutalism"
                  ? "Neo-Brutal"
                  : "Minimal"}
              </button>
            )
          )}
          <button
            onClick={resetToDefault}
            className="ml-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-[10px] px-2 py-1 rounded"
            title="Reset LocalStorage"
          >
            Reset
          </button>
        </div>
      </header>

      {/* 🎮 RENDER THEME 1: NINTENDO 2001 HARDWARE THEME */}
      {theme === "nintendo2001" && (
        <div className="w-full min-h-[calc(100vh-40px)] bg-[#7a8aba] text-[#21242e] font-sans p-1.5 sm:p-4 md:p-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-[840px] bg-[#7a8aba] border-t-4 border-l-4 border-white/70 border-b-4 border-r-4 border-[#3d4f97] shadow-2xl p-1.5 sm:p-4 relative my-2 sm:my-4 rounded-none overflow-hidden">
            
            {/* Masthead Header Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-2 px-1 sm:px-2 w-full">
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white bg-[#e60012] p-0.5 shadow-md shrink-0 overflow-hidden relative">
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
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

              {/* Search Module */}
              <div className="flex items-center gap-1 bg-[#9fbee7] border-t-2 border-l-2 border-[#3d4f97] border-b-2 border-r-2 border-white p-1 rounded-sm w-full sm:w-auto justify-between sm:justify-start">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase text-[#3d4f97] px-0.5 shrink-0">
                  SEARCH:
                </span>
                <input
                  type="text"
                  placeholder="Search profile..."
                  className="flex-1 min-w-[70px] sm:w-36 bg-white border border-[#3d4f97] text-[11px] sm:text-xs px-1.5 py-0.5 text-[#21242e] focus:outline-none"
                />
                <button className="bg-[#ecab37] hover:bg-[#e48600] border-t border-l border-white border-b-2 border-r-2 border-[#3d4f97] text-[#21242e] font-black text-[10px] sm:text-[11px] px-2 py-0.5 uppercase shadow-sm shrink-0">
                  GO
                </button>
              </div>
            </div>

            {/* Primary Carbon Navigation Bar */}
            <div className="bg-[#21242e] bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:6px_6px] border-t-2 border-l-2 border-white/40 border-b-2 border-r-2 border-black p-2 flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-md w-full">
              <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                <div className="bg-white rounded-full px-2.5 py-0.5 sm:py-1 border-2 border-[#e60012] flex items-center justify-center shadow-inner shrink-0">
                  <span className="text-[#e60012] font-black italic tracking-tighter text-sm sm:text-lg">
                    Nintendo<span className="text-[#21242e] not-italic text-[10px] sm:text-xs ml-1 font-bold">® MyLink</span>
                  </span>
                </div>
              </div>

              <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 sm:gap-5 font-black text-[11px] sm:text-sm tracking-tight sm:tracking-widest text-[#e48600] overflow-x-auto whitespace-nowrap py-0.5 px-1">
                <a href="#" className="hover:text-white transition-colors">GAMES</a>
                <a href="#" className="hover:text-white transition-colors">SYSTEMS</a>
                <a href="#" className="hover:text-white transition-colors">NEWS</a>
                <a href="#" className="hover:text-white transition-colors">NSIDER</a>
                <a href="#" className="hover:text-white transition-colors">DOWNLOADS</a>
              </div>
            </div>

            {/* Main Content */}
            <div className="mt-2.5 flex flex-col md:flex-row gap-2.5 sm:gap-3 w-full">
              <div className="flex-1 space-y-2.5 sm:space-y-3 min-w-0 w-full">
                
                {/* Hero Panel */}
                <div className="bg-[#acace7] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#3d4f97] p-3 sm:p-5 relative overflow-hidden shadow-sm w-full">
                  <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-center sm:text-left min-w-0 flex-1">
                      <span className="bg-[#ecab37] text-[#21242e] border border-black font-black text-[9px] sm:text-[10px] px-2 py-0.5 uppercase tracking-wider rounded-xs inline-block">
                        {user.role}
                      </span>
                      <h1
                        className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase mt-1.5 mb-1 break-words leading-tight"
                        style={{
                          textShadow: "2px 2px 0px #21242e, -1px -1px 0 #21242e, 1px -1px 0 #21242e, -1px 1px 0 #21242e, 1px 1px 0 #21242e",
                        }}
                      >
                        {user.name}
                      </h1>
                      <p className="text-[11px] sm:text-xs font-bold text-[#21242e] max-w-md leading-normal">
                        {user.bio}
                      </p>
                    </div>

                    <button
                      onClick={handleCopyEmail}
                      className="group flex flex-col items-center gap-1 shrink-0 mt-1 sm:mt-0"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#f68d1f] hover:bg-[#e48600] border-2 border-white shadow-md flex items-center justify-center text-white transition-transform group-hover:scale-105">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-black uppercase text-[#21242e] tracking-wider">
                        {copied ? "COPIED!" : "COPY EMAIL"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Links Stack */}
                <div className="bg-[#8ba1d4] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#3d4f97] p-2.5 sm:p-3 w-full">
                  <div className="bg-[#7a8aba] border-b-2 border-[#3d4f97] pb-1 mb-2 flex items-center justify-between">
                    <span className="text-[#21242e] font-black text-xs uppercase tracking-wider truncate">
                      ≡ FEATURED LINKS (LOCALSTORAGE)
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-white uppercase shrink-0">
                      {links.length} LINKS
                    </span>
                  </div>

                  <div className="space-y-1.5 w-full">
                    {links.map((row) => (
                      <div
                        key={row.id}
                        onClick={() => handleLinkClick(row.id, row.url)}
                        className="bg-[#dedede] hover:bg-white border-t border-l border-white border-b border-r border-[#3d4f97] p-2 flex items-center justify-between gap-2 text-[#21242e] group cursor-pointer transition-colors w-full min-w-0"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="bg-[#21242e] text-[#ecab37] font-black text-[9px] px-1.5 py-0.5 rounded-xs shrink-0">
                            {row.badge}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h2 className="text-xs font-bold text-[#3d4f97] group-hover:text-[#e60012] group-hover:underline truncate">
                              {row.title}
                            </h2>
                            <p className="text-[10px] sm:text-[11px] text-[#21242e] truncate">
                              {row.description}
                            </p>
                          </div>
                        </div>

                        {/* Click Counter Pill & Chevron */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[9px] font-mono font-bold bg-[#9fbee7] text-[#21242e] px-1.5 py-0.5 rounded border border-[#3d4f97]">
                            {row.clicks} Clicks
                          </span>
                          <div className="w-5 h-5 bg-[#f68d1f] text-white rounded-xs flex items-center justify-center group-hover:bg-[#e60012]">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="mt-3 bg-[#21242e] text-center p-2 text-[10px] text-[#9fbee7] font-mono">
              © MyLink LocalStorage Profile Engine. Powered by Zustand Persist.
            </div>
          </div>
        </div>
      )}

      {/* 🟨 RENDER THEME 2: NEO-BRUTALISM THEME */}
      {theme === "neobrutalism" && (
        <div className="w-full min-h-[calc(100vh-40px)] bg-[#FFFDF5] text-black font-sans p-4 sm:p-6 flex flex-col items-center justify-center">
          <main className="w-full max-w-xl bg-white border-4 border-black rounded-3xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-[#38BDF8] border-4 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black uppercase text-black">
                  {user.name}
                </h1>
                <div className="bg-[#F472B6] border-2 border-black px-2 py-0.5 font-mono font-black text-xs inline-block mt-1">
                  {user.role}
                </div>
              </div>
            </div>

            <div className="bg-[#FEF9C3] border-3 border-black p-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-sm mb-6">
              💬 {user.bio}
            </div>

            <div className="space-y-3">
              {links.map((link) => (
                <div
                  key={link.id}
                  onClick={() => handleLinkClick(link.id, link.url)}
                  className="bg-[#FEF9C3] border-3 border-black p-3.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-black text-white font-mono text-[10px] px-2 py-0.5 rounded font-black">
                        {link.badge}
                      </span>
                      <span className="font-black text-sm text-black">
                        {link.title}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-700 mt-1">
                      {link.description}
                    </p>
                  </div>
                  <span className="bg-[#A3E635] border-2 border-black font-mono text-xs font-black px-2 py-1">
                    {link.clicks} Clicks
                  </span>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}

      {/* ⚪ RENDER THEME 3: MINIMAL MODERN THEME */}
      {theme === "minimal" && (
        <div className="w-full min-h-[calc(100vh-40px)] bg-slate-950 text-white font-sans p-6 flex flex-col items-center justify-center">
          <main className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-24 h-24 mx-auto rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-pink-500 mb-4">
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={96}
                height={96}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h1 className="text-2xl font-extrabold text-white">{user.name}</h1>
            <p className="text-xs text-indigo-400 font-semibold mt-1">
              {user.role}
            </p>
            <p className="text-xs text-slate-300 mt-2 mb-6">{user.bio}</p>

            <div className="space-y-3">
              {links.map((link) => (
                <div
                  key={link.id}
                  onClick={() => handleLinkClick(link.id, link.url)}
                  className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-3.5 rounded-2xl cursor-pointer transition-all flex items-center justify-between text-left"
                >
                  <div>
                    <h2 className="font-bold text-sm text-white">
                      {link.title}
                    </h2>
                    <p className="text-xs text-slate-400">{link.description}</p>
                  </div>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded-full font-mono">
                    {link.clicks}
                  </span>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}

    </div>
  );
}
