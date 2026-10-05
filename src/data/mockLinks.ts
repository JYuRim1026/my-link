export interface LinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  badge: string;
  iconName: string;
  color: string;
  enabled: boolean;
  clicks: number;
}

export const MOCK_LINKS: LinkItem[] = [
  {
    id: "link-github",
    title: "GitHub - 오픈소스 & 시스템 아키텍처",
    description: "대용량 트래픽 처리, 백엔드 파이프라인 및 오픈소스 프로젝트 코드베이스",
    url: "https://github.com",
    badge: "DEV",
    iconName: "Github",
    color: "#21242e",
    enabled: true,
    clicks: 342,
  },
  {
    id: "link-blog",
    title: "Velog - 개발 및 서버 아키텍처 블로그",
    description: "Node.js, Python FastAPI, Docker, K8s 시스템 구축 및 성능 최적화 일지",
    url: "https://velog.io",
    badge: "BLOG",
    iconName: "BookOpen",
    color: "#206479",
    enabled: true,
    clicks: 218,
  },
  {
    id: "link-api-docs",
    title: "REST & gRPC API 명세서 (Docs)",
    description: "실시간 마이크로서비스 API 아키텍처 및 OpenAPI/Swagger 명세",
    url: "https://swagger.io",
    badge: "SYS",
    iconName: "FileCode",
    color: "#3d4f97",
    enabled: true,
    clicks: 156,
  },
  {
    id: "link-portfolio",
    title: "2026 개발자 포트폴리오 & 프로젝트 모음",
    description: "대용량 트래픽 분산 처리, DB 튜닝, 오토스케일링 인프라 구축 사례",
    url: "https://notion.so",
    badge: "WORK",
    iconName: "Briefcase",
    color: "#ecab37",
    enabled: true,
    clicks: 289,
  },
  {
    id: "link-youtube",
    title: "개발자 코딩 & 테크 유튜브 채널",
    description: "백엔드 개발 라이브 코딩, 개발자 서적 리뷰 및 테크 세션 영상",
    url: "https://youtube.com",
    badge: "VIDEO",
    iconName: "Youtube",
    color: "#e60012",
    enabled: true,
    clicks: 195,
  },
  {
    id: "link-coffee",
    title: "Buy Me a Coffee (개발 후원)",
    description: "오픈소스 프로젝트 지속적인 개발 및 서버 유지를 위한 소정의 후원",
    url: "https://buymeacoffee.com",
    badge: "SUPPORT",
    iconName: "Coffee",
    color: "#f68d1f",
    enabled: true,
    clicks: 94,
  },
];
