"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [copied, setCopied] = useState(false);

  const links = [
    {
      id: "github",
      title: "GitHub 저장소",
      description: "오픈소스 프로젝트 및 소스코드 저장소",
      url: "https://github.com",
      badge: "DEV",
      bgColor: "bg-[#FEF9C3]", // Warm Yellow
      iconBg: "bg-black text-yellow-300",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      ),
    },
    {
      id: "blog",
      title: "기술 블로그",
      description: "서버 아키텍처 및 백엔드 지식 기록",
      url: "https://velog.io",
      badge: "LOG",
      bgColor: "bg-[#E0F2FE]", // Soft Cyan
      iconBg: "bg-[#0284C7] text-white",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
    },
    {
      id: "server-architecture",
      title: "서버 아키텍처 & API Docs",
      description: "대용량 트래픽 처리 및 분산 시스템 구조",
      url: "#",
      badge: "SYS",
      bgColor: "bg-[#F3E8FF]", // Soft Purple
      iconBg: "bg-[#7E22CE] text-white",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
    },
    {
      id: "portfolio",
      title: "프로젝트 포트폴리오",
      description: "주요 서비스 구현 사례 및 성과 리포트",
      url: "#",
      badge: "WORK",
      bgColor: "bg-[#DCFCE7]", // Soft Green
      iconBg: "bg-[#15803D] text-white",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: "contact",
      title: "이메일 문의하기",
      description: "프로젝트 외주, 협업 및 기술 문의",
      url: "mailto:contact@example.com",
      badge: "MAIL",
      bgColor: "bg-[#FFE4E6]", // Soft Pink
      iconBg: "bg-[#BE123C] text-white",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const techStack = [
    { name: "Node.js", color: "bg-[#A3E635]" },
    { name: "Python", color: "bg-[#FDE047]" },
    { name: "FastAPI", color: "bg-[#67E8F9]" },
    { name: "Docker", color: "bg-[#93C5FD]" },
    { name: "PostgreSQL", color: "bg-[#C084FC]" },
    { name: "Redis", color: "bg-[#FCA5A5]" },
    { name: "Kubernetes", color: "bg-[#A7F3D0]" },
    { name: "AWS", color: "bg-[#FDBA74]" },
  ];

  const stats = [
    { label: "UPTIME", value: "99.9%", bg: "bg-[#F472B6]" },
    { label: "PROJECTS", value: "25+", bg: "bg-[#FACC15]" },
    { label: "ROLE", value: "BACKEND", bg: "bg-[#38BDF8]" },
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@example.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-black flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden selection:bg-black selection:text-yellow-300">
      
      {/* Background Neobrutalist Grid / Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Outer Neobrutalist Window Card */}
      <main className="w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-white border-4 border-black rounded-3xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative z-10 my-4">
        
        {/* Retro Window Top Title Bar */}
        <div className="bg-[#FACC15] border-b-4 border-black p-3.5 flex items-center justify-between font-mono font-black text-xs sm:text-sm tracking-wider select-none">
          <div className="flex items-center gap-2">
            {/* Retro Window Control Buttons */}
            <div className="w-3.5 h-3.5 rounded-full bg-[#EF4444] border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#F59E0B] border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" />
            <span className="ml-2 font-black uppercase text-black">MYLINK.EXE — PROFILE_DEV</span>
          </div>

          <div className="bg-black text-white px-2.5 py-0.5 rounded border border-black font-extrabold text-[10px] uppercase">
            v2.0
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-8">
          
          {/* Top Marquee Ribbon */}
          <div className="bg-[#A3E635] border-3 border-black p-2.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono font-black text-xs sm:text-sm text-black flex items-center justify-between gap-2 mb-6 overflow-hidden">
            <span className="truncate">⚡ SERVER DEVELOPER • BACKEND ARCHITECT • INFRA ⚡</span>
            <span className="bg-black text-[#A3E635] px-2 py-0.5 rounded text-[10px] font-black uppercase shrink-0">
              OK
            </span>
          </div>

          {/* Profile Header (Avatar + Info) */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
            
            {/* Avatar Box with Offset Shadow */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-[#38BDF8] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl overflow-hidden relative rotate-[-2deg] hover:rotate-0 transition-transform duration-200">
                <Image
                  src="/avatar.jpg"
                  alt="Developer Avatar"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>

              {/* Status Sticker Badge */}
              <div className="absolute -bottom-2 -right-2 bg-[#A3E635] border-2 border-black font-mono font-black text-[10px] px-2.5 py-0.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-3 flex items-center gap-1.5 text-black">
                <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse" />
                ONLINE
              </div>
            </div>

            {/* Name & Bio Area */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black uppercase">
                  마이링크 <span className="bg-[#FACC15] px-2 py-0.5 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">MyLink</span>
                </h1>
              </div>

              <div className="mt-2 inline-block bg-[#F472B6] border-2 border-black px-3 py-1 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-mono font-black text-xs uppercase text-black">
                🎯 BACKEND & SERVER ENGINEER
              </div>

              {/* Neobrutalist Bio Text Banner */}
              <div className="mt-3 bg-[#FEF9C3] border-3 border-black p-3.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-sm text-slate-900 leading-snug">
                💬 안정적인 백엔드 시스템과 서버 아키텍처를 구축하는 개발자입니다.
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <button
              onClick={handleCopyEmail}
              className="bg-[#38BDF8] hover:bg-[#0284C7] hover:text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] border-3 border-black font-mono font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copied ? "COPIED TO CLIPBOARD!" : "COPY EMAIL"}
            </button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C084FC] hover:bg-[#9333EA] hover:text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] border-3 border-black font-mono font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GITHUB
            </a>
          </div>

          {/* Tech Stack Matrix Tags */}
          <div className="mt-6">
            <h2 className="font-mono font-black text-xs tracking-wider uppercase text-slate-700 mb-2.5 flex items-center gap-1.5">
              <span>🛠 TECH_STACK</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech.name}
                  className={`${tech.color} border-2 border-black font-mono font-black text-xs px-3 py-1 rounded-lg shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-black cursor-default`}
                >
                  #{tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* Neobrutalist Stats Block */}
          <div className="grid grid-cols-3 gap-3 my-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`${stat.bg} border-3 border-black p-3.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center flex flex-col items-center justify-center`}
              >
                <span className="font-black text-xl sm:text-2xl text-black leading-none">
                  {stat.value}
                </span>
                <span className="font-mono font-black text-[10px] sm:text-xs text-black mt-1 uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Links Section */}
          <section className="mt-6 space-y-3" aria-label="네오 브루탈리즘 링크 목록">
            <h2 className="font-mono font-black text-xs tracking-wider uppercase text-slate-700 mb-3 flex items-center justify-between">
              <span>🔗 FEATURED_LINKS</span>
              <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-bold">5 ITEMS</span>
            </h2>

            <div className="grid grid-cols-1 gap-3.5">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.url.startsWith("http") ? "_blank" : undefined}
                  rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`${link.bgColor} border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all rounded-2xl p-4 flex items-center justify-between text-black group`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className={`p-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${link.iconBg} shrink-0`}>
                      {link.icon}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm sm:text-base text-black group-hover:underline decoration-2">
                          {link.title}
                        </span>
                        <span className="bg-black text-white font-mono font-black text-[10px] px-2 py-0.5 rounded border border-black uppercase">
                          {link.badge}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 mt-0.5 line-clamp-1">
                        {link.description}
                      </p>
                    </div>
                  </div>

                  <div className="bg-black text-white p-2 rounded-xl border-2 border-black group-hover:bg-[#FACC15] group-hover:text-black transition-colors shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Neobrutalist Footer */}
          <footer className="mt-8 bg-[#FACC15] border-3 border-black p-3.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono text-xs text-black font-black text-center flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>🚀 NEXT.JS 16 • NEO-BRUTALISM</span>
            <span>© {new Date().getFullYear()} MYLINK</span>
          </footer>

        </div>
      </main>
    </div>
  );
}
