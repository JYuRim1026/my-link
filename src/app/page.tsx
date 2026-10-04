"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [copied, setCopied] = useState(false);

  const links = [
    {
      id: "github",
      title: "GitHub 저장소",
      description: "프로젝트 코드 및 오픈소스 활동 확인",
      url: "https://github.com",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      ),
      badge: "개발",
      color: "from-zinc-700 to-zinc-900 dark:from-zinc-800 dark:to-zinc-950",
    },
    {
      id: "blog",
      title: "기술 블로그",
      description: "백엔드 지식과 서버 시스템 개발 일지",
      url: "https://velog.io",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      badge: "기록",
      color: "from-emerald-600 to-teal-700",
    },
    {
      id: "server-architecture",
      title: "서버 아키텍처 & API",
      description: "분산 시스템 설계 및 REST/gRPC API 명세",
      url: "#",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
      badge: "서버",
      color: "from-indigo-600 to-blue-700",
    },
    {
      id: "portfolio",
      title: "프로젝트 포트폴리오",
      description: "대용량 트래픽 처리 및 클라우드 구축 사례",
      url: "#",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      badge: "작업물",
      color: "from-purple-600 to-indigo-700",
    },
    {
      id: "contact",
      title: "이메일 문의",
      description: "프로젝트 협업 및 백엔드 컨설팅 문의",
      url: "mailto:contact@example.com",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      badge: "연락처",
      color: "from-rose-600 to-pink-700",
    },
  ];

  const techStack = [
    "Node.js",
    "Python",
    "FastAPI",
    "Docker",
    "PostgreSQL",
    "Redis",
    "Kubernetes",
    "AWS",
  ];

  const stats = [
    { label: "시스템 업타임", value: "99.9%" },
    { label: "프로젝트 경험", value: "25+" },
    { label: "주요 분야", value: "Backend" },
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@example.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px] pointer-events-none" />

      {/* Main Container Card */}
      <main className="w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 shadow-2xl rounded-3xl overflow-hidden relative z-10 transition-all duration-300">
        
        {/* Top Banner Header */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(#rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
          
          {/* Status Badge Top Right */}
          <div className="absolute top-4 right-4 bg-slate-950/60 backdrop-blur-md border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-2 text-xs font-medium text-emerald-400 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            SERVER: ONLINE
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          
          {/* Avatar Container */}
          <div className="-mt-16 sm:-mt-20 mb-5 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 shadow-xl shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-full overflow-hidden relative bg-slate-950">
                  <Image
                    src="/avatar.jpg"
                    alt="Server Developer Avatar"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Active" />
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleCopyEmail}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-200 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copied ? "이메일 복사됨!" : "이메일 복사"}
              </button>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-200 transition-all shadow-sm active:scale-95"
                title="GitHub Profile"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Name & Title */}
          <div className="text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                마이링크 (MyLink)
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Backend / Server Engineer
              </span>
            </div>

            {/* Profile Intro Text */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              안정적인 백엔드 시스템과 서버 아키텍처를 구축하는 개발자입니다.
            </p>
          </div>

          {/* Tech Stack Badges */}
          <div className="mt-5 flex flex-wrap gap-1.5 justify-center sm:justify-start">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60 font-mono hover:border-indigo-500/50 hover:text-indigo-300 transition-colors"
              >
                #{tech}
              </span>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 my-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center justify-center">
                <span className="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                  {stat.value}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Links Section */}
          <section className="space-y-3" aria-label="주요 링크 목록">
            <h2 className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-3 px-1">
              Links & Contact
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.url.startsWith("http") ? "_blank" : undefined}
                  rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group relative flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${link.color} text-white shadow-md shadow-slate-950/50 group-hover:scale-105 transition-transform`}>
                      {link.icon}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm sm:text-base text-white group-hover:text-indigo-300 transition-colors">
                          {link.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 font-medium">
                          {link.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {link.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
            <p className="font-mono text-slate-400">Next.js 16 • TypeScript • Tailwind CSS</p>
            <p className="mt-1">© {new Date().getFullYear()} 마이링크 (MyLink). All rights reserved.</p>
          </footer>

        </div>
      </main>
    </div>
  );
}
