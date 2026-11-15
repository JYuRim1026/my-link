import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProfileLink {
  id: string;
  title: string;
  description: string;
  url: string;
  badge: string;
  enabled: boolean;
  clicks: number;
}

export interface UserProfile {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  email: string;
  statusText: string;
}

export type ThemePreset = "nintendo2001" | "neobrutalism" | "minimal";

interface ProfileStore {
  user: UserProfile;
  theme: ThemePreset;
  links: ProfileLink[];
  
  // Actions for Profile Page Demonstration
  incrementClick: (id: string) => void;
  setTheme: (theme: ThemePreset) => void;
  updateUser: (user: Partial<UserProfile>) => void;
  resetToDefault: () => void;
}

const defaultUser: UserProfile = {
  name: "마이링크 (MyLink)",
  role: "Backend & Server Engineer",
  bio: "안정적인 백엔드 시스템과 99.9% 업타임의 서버 아키텍처를 구축하는 개발자입니다.",
  avatarUrl: "/avatar.jpg",
  email: "contact@example.com",
  statusText: "ONLINE",
};

const defaultLinks: ProfileLink[] = [
  {
    id: "link-1",
    title: "GitHub 저장소 - 오픈소스 프로젝트 및 백엔드 파이프라인",
    description: "대용량 트래픽 및 Microservices 아키텍처 소스코드",
    url: "https://github.com",
    badge: "DEV",
    enabled: true,
    clicks: 142,
  },
  {
    id: "link-2",
    title: "기술 블로그 - 분산 서버 설계 및 대용량 트래픽 처리 노하우",
    description: "Node.js, Python FastAPI, Docker, K8s 시스템 구축 일지",
    url: "https://velog.io",
    badge: "BLOG",
    enabled: true,
    clicks: 89,
  },
  {
    id: "link-3",
    title: "서버 아키텍처 & REST / gRPC API 명세서",
    description: "오토스케일링 및 99.9% 업타임 클라우드 인프라 문서",
    url: "#",
    badge: "SYS",
    enabled: true,
    clicks: 64,
  },
  {
    id: "link-4",
    title: "프로젝트 포트폴리오 - 주요 시스템 구축 사례 모음",
    description: "성능 최적화, DB 튜닝, 캐싱 전략 및 모니터링 시스템",
    url: "#",
    badge: "WORK",
    enabled: true,
    clicks: 110,
  },
];

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      user: defaultUser,
      theme: "nintendo2001",
      links: defaultLinks,

      incrementClick: (id: string) =>
        set((state) => ({
          links: state.links.map((link) =>
            link.id === id ? { ...link, clicks: link.clicks + 1 } : link
          ),
        })),

      setTheme: (theme: ThemePreset) => set({ theme }),

      updateUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),

      resetToDefault: () =>
        set({
          user: defaultUser,
          theme: "nintendo2001",
          links: defaultLinks,
        }),
    }),
    {
      name: "mylink_profile_storage", // LocalStorage Key
    }
  )
);
