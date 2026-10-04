"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [selectedPoll, setSelectedPoll] = useState("option1");
  const [copied, setCopied] = useState(false);

  const newsRows = [
    {
      id: 1,
      title: "GitHub 저장소 - 오픈소스 프로젝트 및 백엔드 파이프라인",
      url: "https://github.com",
      category: "DEV",
      desc: "대용량 트래픽 및 Microservices 아키텍처 소스코드",
    },
    {
      id: 2,
      title: "기술 블로그 - 분산 서버 설계 및 대용량 트래픽 처리 노하우",
      url: "https://velog.io",
      category: "BLOG",
      desc: "Node.js, Python FastAPI, Docker, K8s 시스템 구축 일지",
    },
    {
      id: 3,
      title: "서버 아키텍처 & REST / gRPC API 명세서",
      url: "#",
      category: "SYS",
      desc: "오토스케일링 및 99.9% 업타임 클라우드 인프라 문서",
    },
    {
      id: 4,
      title: "프로젝트 포트폴리오 - 주요 시스템 구축 사례 모음",
      url: "#",
      category: "WORK",
      desc: "성능 최적화, DB 튜닝, 캐싱 전략 및 모니터링 시스템",
    },
  ];

  const featuredSites = [
    { name: "Pokémon Online", url: "www.pokemon.com", img: "/avatar.jpg" },
    { name: "GitHub Repo", url: "github.com", img: "/avatar.jpg" },
    { name: "Velog Blog", url: "velog.io", img: "/avatar.jpg" },
    { name: "Nintendo 64", url: "nintendo.com", img: "/avatar.jpg" },
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@example.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#7a8aba] text-[#21242e] font-sans p-2 sm:p-4 md:p-6 flex flex-col items-center justify-center selection:bg-[#f68d1f] selection:text-white">
      
      {/* Outer Console Hardware Faceplate Container */}
      <div className="w-full max-w-[840px] bg-[#7a8aba] border-t-4 border-l-4 border-white/70 border-b-4 border-r-4 border-[#3d4f97] shadow-2xl p-2 sm:p-4 relative my-4 rounded-none">
        
        {/* Masthead Header Row: Mario Mascot & Speech Bubble + Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-2 px-2">
          
          {/* Mascot + Speech Bubble */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-white bg-[#e60012] p-0.5 shadow-md shrink-0 overflow-hidden relative">
              <Image
                src="/avatar.jpg"
                alt="Mario Mascot"
                width={48}
                height={48}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Speech Bubble */}
            <div className="relative bg-white border-2 border-[#3d4f97] rounded-xl px-3 py-1.5 shadow-sm text-xs font-bold text-[#21242e] flex items-center gap-1">
              <span className="text-[#e60012] font-black">MARIO:</span>
              "Welcome to Nintendo.com / MyLink! 🎮"
              {/* Bubble Tail */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-r-8 border-r-white border-b-4 border-b-transparent" />
            </div>
          </div>

          {/* Search Module */}
          <div className="flex items-center gap-1.5 bg-[#9fbee7] border-t-2 border-l-2 border-[#3d4f97] border-b-2 border-r-2 border-white p-1 rounded-sm">
            <span className="text-[11px] font-bold uppercase text-[#3d4f97] px-1">SEARCH:</span>
            <input
              type="text"
              placeholder="Search MyLink..."
              className="w-28 sm:w-36 bg-white border border-[#3d4f97] text-xs px-2 py-0.5 text-[#21242e] focus:outline-none"
            />
            <select className="bg-white border border-[#3d4f97] text-[11px] font-bold px-1 py-0.5 text-[#21242e]">
              <option>ALL</option>
              <option>GAMES</option>
              <option>SYSTEMS</option>
            </select>
            <button className="bg-[#ecab37] hover:bg-[#e48600] border-t border-l border-white border-b-2 border-r-2 border-[#3d4f97] text-[#21242e] font-black text-[11px] px-2.5 py-0.5 uppercase shadow-sm">
              GO
            </button>
          </div>
        </div>

        {/* Command Layer 1: Primary Carbon Navigation Bar */}
        <div className="bg-[#21242e] bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:6px_6px] border-t-2 border-l-2 border-white/40 border-b-2 border-r-2 border-black p-2 flex flex-wrap items-center justify-between gap-3 shadow-md">
          
          {/* Racetrack Logo Pill */}
          <div className="bg-white rounded-full px-3 py-1 border-2 border-[#e60012] flex items-center justify-center shadow-inner">
            <span className="text-[#e60012] font-black italic tracking-tighter text-base sm:text-lg">
              Nintendo<span className="text-[#21242e] not-italic text-xs ml-1 font-bold">® MyLink</span>
            </span>
          </div>

          {/* Section Words in Nav Gold */}
          <div className="flex items-center gap-3 sm:gap-5 font-black text-xs sm:text-sm tracking-widest text-[#e48600]">
            <a href="#" className="hover:text-white transition-colors">GAMES</a>
            <a href="#" className="hover:text-white transition-colors">SYSTEMS</a>
            <a href="#" className="hover:text-white transition-colors">NEWS</a>
            <a href="#" className="hover:text-white transition-colors">NSIDER</a>
            <a href="#" className="hover:text-white transition-colors">DOWNLOADS</a>
          </div>

          {/* Utility Chips in Amber */}
          <div className="flex items-center gap-1.5">
            <button className="bg-[#ecab37] hover:bg-[#e48600] text-[#21242e] border-t border-l border-white border-b border-r border-black font-black text-[10px] sm:text-[11px] px-2.5 py-1 uppercase rounded-xs">
              CODE BANK
            </button>
            <button className="bg-[#ecab37] hover:bg-[#e48600] text-[#21242e] border-t border-l border-white border-b border-r border-black font-black text-[10px] sm:text-[11px] px-2.5 py-1 uppercase rounded-xs">
              GAME FINDER
            </button>
          </div>
        </div>

        {/* Command Layer 2: Secondary Pale-Sky Subnav Strip */}
        <div className="bg-[#9fbee7] border-b-2 border-[#3d4f97] px-3 py-1 flex items-center justify-center sm:justify-start gap-4 text-[11px] font-bold text-[#3d4f97] uppercase tracking-wider overflow-x-auto">
          <span>PARENTS</span>
          <span className="text-white/60">|</span>
          <span>CUSTOMER SERVICE</span>
          <span className="text-white/60">|</span>
          <span>CORPORATE</span>
          <span className="text-white/60">|</span>
          <span>GLOBAL</span>
          <span className="text-white/60">|</span>
          <span>PRIVACY</span>
          <span className="text-white/60">|</span>
          <span>STORE</span>
          <span className="text-white/60">|</span>
          <span>CONTACT</span>
        </div>

        {/* Main Body Grid Container */}
        <div className="mt-3 flex flex-col md:flex-row gap-3">
          
          {/* Left Rotated Section Tabs Rail (Desktop) */}
          <div className="hidden md:flex flex-col gap-1 w-7 shrink-0 pt-2">
            {["TOP TEN", "TOP RENTALS", "PLAYER'S CHOICE", "ESRB RATINGS"].map((tab) => (
              <div
                key={tab}
                className="bg-[#21242e] text-[#9fbee7] border-l-2 border-t-2 border-white/40 border-b-2 border-r-2 border-[#3d4f97] py-3 px-1 text-[10px] font-black uppercase tracking-widest text-center shadow-sm select-none cursor-pointer hover:bg-[#3d4f97] hover:text-white transition-colors"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Center/Main Column: Hero + Content Split */}
          <div className="flex-1 space-y-3">
            
            {/* Hero Panel: Full-Bleed Lavender Plate with Box-Art Wordmark */}
            <div className="bg-[#acace7] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#3d4f97] p-4 sm:p-6 relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2)_0%,transparent_100%)] pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Hero Box-Art Typography & Info */}
                <div className="text-center sm:text-left">
                  <span className="bg-[#ecab37] text-[#21242e] border border-black font-black text-[10px] px-2 py-0.5 uppercase tracking-wider rounded-xs">
                    FEATURED HARDWARE & BACKEND
                  </span>

                  {/* Outlined Box-Art Display Title */}
                  <h1
                    className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase mt-2 mb-1"
                    style={{
                      textShadow: "3px 3px 0px #21242e, -1px -1px 0 #21242e, 1px -1px 0 #21242e, -1px 1px 0 #21242e, 1px 1px 0 #21242e",
                    }}
                  >
                    MYLINK BACKEND SERVER
                  </h1>

                  <p className="text-xs sm:text-sm font-bold text-[#21242e] max-w-md">
                    안정적인 백엔드 시스템과 99.9% 업타임의 서버 아키텍처.
                    Node.js, Python, Docker 기반 인프라.
                  </p>
                </div>

                {/* Call To Action Round Orange Arrow */}
                <button
                  onClick={handleCopyEmail}
                  className="group flex flex-col items-center gap-1 shrink-0"
                >
                  <div className="w-12 h-12 rounded-full bg-[#f68d1f] hover:bg-[#e48600] border-2 border-white shadow-md flex items-center justify-center text-white transition-transform group-hover:scale-110">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black uppercase text-[#21242e] tracking-wider">
                    {copied ? "COPIED!" : "COPY EMAIL"}
                  </span>
                </button>

              </div>
            </div>

            {/* Content & Action Rail 2-Column Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              
              {/* Content Column (2 Cols) */}
              <div className="lg:col-span-2 space-y-3">
                
                {/* Official News Section Panel */}
                <div className="bg-[#8ba1d4] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#3d4f97] p-3">
                  
                  {/* Panel Header Strip */}
                  <div className="bg-[#7a8aba] border-b-2 border-[#3d4f97] pb-1.5 mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#21242e] font-black text-xs uppercase tracking-wider">
                        ≡ OFFICIAL NEWS & LINKS
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase">4 UPDATES</span>
                  </div>

                  {/* News Rows Stack sitting on Platinum Gray */}
                  <div className="space-y-1.5">
                    {newsRows.map((row) => (
                      <a
                        key={row.id}
                        href={row.url}
                        target={row.url.startsWith("http") ? "_blank" : undefined}
                        rel={row.url.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="bg-[#dedede] hover:bg-white border-t border-l border-white border-b border-r border-[#3d4f97] p-2 flex items-center justify-between gap-2 text-[#21242e] group transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="bg-[#21242e] text-[#ecab37] font-black text-[9px] px-1.5 py-0.5 rounded-xs shrink-0">
                            {row.category}
                          </span>
                          <div>
                            <h2 className="text-xs font-bold text-[#3d4f97] group-hover:text-[#e60012] group-hover:underline">
                              {row.title}
                            </h2>
                            <p className="text-[11px] text-[#21242e] line-clamp-1">{row.desc}</p>
                          </div>
                        </div>

                        {/* Trailing Signal Orange Chevron Chip */}
                        <div className="w-5 h-5 bg-[#f68d1f] text-white rounded-xs flex items-center justify-center shrink-0 group-hover:bg-[#e60012]">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </a>
                    ))}
                  </div>

                </div>

                {/* Featured Sites 2x2 Grid */}
                <div className="bg-[#8ba1d4] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#3d4f97] p-3">
                  <div className="bg-[#7a8aba] border-b-2 border-[#3d4f97] pb-1.5 mb-2.5">
                    <span className="text-[#21242e] font-black text-xs uppercase tracking-wider">
                      ≡ FEATURED SITES & MODULES
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {featuredSites.map((site) => (
                      <div
                        key={site.name}
                        className="bg-[#21242e] p-1.5 border-t border-l border-white/20 border-b border-r border-black flex items-center gap-2"
                      >
                        <div className="w-10 h-10 bg-[#7a8aba] border border-white shrink-0 overflow-hidden">
                          <Image
                            src={site.img}
                            alt={site.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold text-white truncate">{site.name}</div>
                          <div className="text-[10px] text-[#9fbee7] font-mono truncate">{site.url}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Player's Poll Panel in Raised Light Periwinkle */}
                <div className="bg-[#8ba1d4] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#3d4f97] p-3">
                  <div className="bg-[#3d4f97] text-white px-2 py-1 text-xs font-black uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>PLAYER'S POLL — TECH STACK FAVORITE</span>
                    <span className="text-[#ecab37] text-[10px]">VOTE NOW</span>
                  </div>

                  <p className="text-xs font-bold text-[#21242e] mb-2.5">
                    Q: 가장 선호하는 백엔드 서버 기술 스택은 무엇인가요?
                  </p>

                  <div className="space-y-1.5 text-xs font-bold text-[#21242e] bg-[#9fbee7] p-2.5 border border-[#3d4f97] mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="poll"
                        value="option1"
                        checked={selectedPoll === "option1"}
                        onChange={() => setSelectedPoll("option1")}
                        className="accent-[#f68d1f]"
                      />
                      <span>Node.js / Express / Next.js (JavaScript/TS)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="poll"
                        value="option2"
                        checked={selectedPoll === "option2"}
                        onChange={() => setSelectedPoll("option2")}
                        className="accent-[#f68d1f]"
                      />
                      <span>Python FastAPI / Django / Flask</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="poll"
                        value="option3"
                        checked={selectedPoll === "option3"}
                        onChange={() => setSelectedPoll("option3")}
                        className="accent-[#f68d1f]"
                      />
                      <span>Docker & Kubernetes Cloud Infra</span>
                    </label>
                  </div>

                  <button className="w-full bg-[#f68d1f] hover:bg-[#e48600] border-t border-l border-white border-b-2 border-r-2 border-black text-white font-black text-xs py-1.5 uppercase shadow-sm">
                    SUBMIT VOTE
                  </button>
                </div>

              </div>

              {/* Right Action Rail (1 Col) */}
              <div className="space-y-3">
                
                {/* Carbon Action Buttons Stack */}
                <div className="space-y-1.5">
                  {[
                    { label: "LOGIN / MEMBER REGISTRATION", icon: "👤" },
                    { label: "SUBSCRIBE NEWSLETTER", icon: "📬" },
                    { label: "SERVER SYSTEM STATUS", icon: "⚙️" },
                    { label: "TECHNICAL HELP & SUPPORT", icon: "❓" },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      className="w-full bg-[#21242e] hover:bg-[#3d4f97] text-white border-t border-l border-white/40 border-b-2 border-r-2 border-black p-2 text-left font-black text-[11px] uppercase tracking-wider flex items-center gap-2 shadow-sm"
                    >
                      <span>{btn.icon}</span>
                      <span className="truncate">{btn.label}</span>
                    </button>
                  ))}
                </div>

                {/* "What Is" Info Box */}
                <div className="bg-white border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#3d4f97] p-3">
                  <div className="bg-[#ecab37] text-[#21242e] px-2 py-0.5 text-[11px] font-black uppercase mb-2 inline-block">
                    WHAT IS — MYLINK SERVER
                  </div>
                  <p className="text-xs text-[#21242e] leading-relaxed">
                    마이링크는 안정적인 인프라와 백엔드 서비스를 한곳에 모아 관리하는 최신 개발자용 포털 링크 시스템입니다.
                  </p>
                </div>

                {/* Side Promo Card: Pale Lavender */}
                <div className="bg-[#acace7] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#3d4f97] p-3 text-center">
                  <div className="text-xs font-black text-[#21242e] uppercase mb-1">
                    GAME BOY ADVANCE™
                  </div>
                  <div className="w-full h-24 bg-[#7a8aba] border border-white my-2 flex items-center justify-center text-white text-xs font-bold">
                    [ 32-BIT POWER ]
                  </div>
                  <span className="bg-[#f68d1f] text-white text-[10px] font-black px-2 py-0.5 uppercase">
                    PLAY IT NOW
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Command Layer 3: Footer Bar */}
        <div className="mt-4 bg-[#21242e] bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:6px_6px] border-t-2 border-l-2 border-white/40 border-b-2 border-r-2 border-black p-3 text-center flex flex-col sm:flex-row items-center justify-between gap-2">
          
          <div className="text-[10px] text-[#9fbee7] font-mono">
            © 1997–2001 Nintendo / MyLink. All rights reserved. Game Boy & GameCube are trademarks of Nintendo.
          </div>

          {/* ESRB Privacy-Certified Amber Badge */}
          <div className="bg-[#ecab37] border border-black text-[#21242e] px-2 py-0.5 text-[10px] font-black uppercase rounded-xs shrink-0">
            ESRB — PRIVACY CERTIFIED
          </div>

        </div>

      </div>

    </div>
  );
}
