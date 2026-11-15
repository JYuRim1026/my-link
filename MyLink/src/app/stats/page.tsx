"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  Pie,
  PieChart,
  LabelList,
} from "recharts";
import {
  BarChart3,
  MousePointerClick,
  Link2,
  Trophy,
  TrendingUp,
  ArrowLeft,
  Loader2,
  PieChart as PieChartIcon,
  Sparkles,
  ExternalLink,
  Award,
  Activity,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { useUser } from "@/hooks/useUser";
import { useLinksQuery } from "@/hooks/useLinks";

// 고도화된 차트 컬러 팔레트 (Nintendo Console Signal Red, Amber, Gold, Indigo, Teal, Emerald)
const CHART_PALETTE = [
  { solid: "#e60012", gradStart: "#ff3b4b", gradEnd: "#b8000e", label: "Signal Red" },
  { solid: "#f68d1f", gradStart: "#ffb347", gradEnd: "#d97200", label: "Action Amber" },
  { solid: "#ecab37", gradStart: "#ffd46b", gradEnd: "#c68814", label: "Gold Accent" },
  { solid: "#3d4f97", gradStart: "#6378c7", gradEnd: "#28356b", label: "Chrome Indigo" },
  { solid: "#206479", gradStart: "#3693af", gradEnd: "#144554", label: "Console Teal" },
  { solid: "#16a34a", gradStart: "#4ade80", gradEnd: "#15803d", label: "LED Green" },
];

const barChartConfig = {
  clicks: {
    label: "클릭 수",
    color: "#f68d1f",
  },
} satisfies ChartConfig;

export default function StatsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const { data: links = [], isLoading: linksLoading } = useLinksQuery();
  const hasRedirected = React.useRef(false);

  // 로그인 필수 가드: 비로그인 시 메인 페이지(/)로 리다이렉트
  React.useEffect(() => {
    if (!authLoading && !user && !hasRedirected.current) {
      hasRedirected.current = true;
      toast.error("통계 페이지(/stats)는 로그인 후 이용할 수 있습니다.");
      router.replace("/");
    }
  }, [authLoading, user, router]);

  // 1. 핵심 통계 수치 계산
  const totalClicks = React.useMemo(
    () => links.reduce((sum, item) => sum + Number(item.clicks ?? 0), 0),
    [links]
  );

  const totalLinks = links.length;
  const customLinksCount = React.useMemo(
    () => links.filter((item) => !item.id.startsWith("link-")).length,
    [links]
  );
  const activeClickedLinksCount = React.useMemo(
    () => links.filter((item) => Number(item.clicks ?? 0) > 0).length,
    [links]
  );

  const averageClicks =
    totalLinks > 0 ? Math.round((totalClicks / totalLinks) * 10) / 10 : 0;

  // 클릭 수 내림차순 정렬
  const sortedLinks = React.useMemo(
    () =>
      [...links].sort(
        (a, b) => Number(b.clicks ?? 0) - Number(a.clicks ?? 0)
      ),
    [links]
  );

  const topLink = sortedLinks[0] || null;
  const topLinkShare =
    topLink && totalClicks > 0
      ? Math.round((Number(topLink.clicks ?? 0) / totalClicks) * 1000) / 10
      : 0;

  // 2. 막대 차트용 데이터 (링크별 클릭 수 + 점유율 + 그라디언트 ID)
  const linkChartData = React.useMemo(
    () =>
      sortedLinks.map((item, index) => {
        const clicks = Number(item.clicks ?? 0);
        const share =
          totalClicks > 0 ? Math.round((clicks / totalClicks) * 1000) / 10 : 0;
        const palette = CHART_PALETTE[index % CHART_PALETTE.length];
        return {
          rank: index + 1,
          name:
            item.title.length > 10
              ? `${item.title.slice(0, 10)}…`
              : item.title,
          fullTitle: item.title,
          badge: item.badge,
          url: item.url,
          clicks,
          share,
          fill: `url(#barGrad-${index % CHART_PALETTE.length})`,
          solidColor: palette.solid,
        };
      }),
    [sortedLinks, totalClicks]
  );

  // 3. 도넛/파이 차트용 데이터 (카테고리 배지별 클릭 합산)
  const badgeChartData = React.useMemo(() => {
    const map: Record<string, { clicks: number; count: number }> = {};
    for (const item of links) {
      const badge = item.badge || "ETC";
      if (!map[badge]) map[badge] = { clicks: 0, count: 0 };
      map[badge].clicks += Number(item.clicks ?? 0);
      map[badge].count += 1;
    }
    return Object.entries(map)
      .sort((a, b) => b[1].clicks - a[1].clicks)
      .map(([badge, stat], idx) => {
        const palette = CHART_PALETTE[idx % CHART_PALETTE.length];
        const share =
          totalClicks > 0
            ? Math.round((stat.clicks / totalClicks) * 1000) / 10
            : 0;
        return {
          badge,
          clicks: stat.clicks,
          count: stat.count,
          share,
          fill: palette.solid,
        };
      });
  }, [links, totalClicks]);

  const badgeChartConfig = React.useMemo(() => {
    const cfg: ChartConfig = {
      clicks: { label: "클릭 수" },
    };
    badgeChartData.forEach((item) => {
      cfg[item.badge] = {
        label: `${item.badge} (${item.share}%)`,
        color: item.fill,
      };
    });
    return cfg;
  }, [badgeChartData]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#7a8aba] text-[#21242e] font-sans p-2 sm:p-4 md:p-6 flex flex-col items-center justify-center w-full">
        <div className="w-full max-w-[880px] bg-[#7a8aba] border-t-4 border-l-4 border-white/70 border-b-4 border-r-4 border-[#3d4f97] shadow-2xl p-4">
          <Card className="w-full">
            <CardContent className="p-12 flex flex-col items-center justify-center gap-3 text-center">
              <Loader2 className="w-7 h-7 animate-spin text-[#f68d1f]" />
              <p className="text-xs sm:text-sm font-bold text-[#21242e]">
                {authLoading
                  ? "로그인 세션을 확인하고 통계 데이터를 불러오는 중입니다..."
                  : "로그인이 필요한 페이지입니다. 메인 페이지로 이동합니다..."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const displayUserName = user.displayName || user.name || "마이링크";
  const personalPagePath = `/${encodeURIComponent(displayUserName)}`;

  return (
    <div className="min-h-screen bg-[#7a8aba] text-[#21242e] font-sans p-2 sm:p-4 md:p-6 flex flex-col items-center justify-center selection:bg-[#f68d1f] selection:text-white w-full overflow-x-hidden">
      <div className="w-full max-w-[880px] bg-[#7a8aba] border-t-4 border-l-4 border-white/70 border-b-4 border-r-4 border-[#3d4f97] shadow-2xl p-2.5 sm:p-5 relative my-2 sm:my-4 rounded-none overflow-hidden">
        {/* 상단 공통 헤더 */}
        <ProfileHeader
          avatarUrl={user.photoURL || "/avatar.jpg"}
          name={displayUserName}
          statusText="STATS ANALYTICS"
        />

        <div className="mt-4 space-y-4 w-full">
          {/* 1. 개선된 그라디언트 헤더 배너 */}
          <div className="relative overflow-hidden rounded-[6px] border-t-2 border-l-2 border-white/80 border-b-2 border-r-2 border-black bg-gradient-to-br from-[#21242e] via-[#3d4f97] to-[#206479] p-4 sm:p-6 text-white shadow-lg">
            {/* 도트 매트릭스 패턴 오버레이 */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:8px_8px]" />
            {/* 우측 상단 장식 글로우 */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#f68d1f]/20 blur-2xl" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <Badge variant="signal" className="gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>LIVE ANALYTICS</span>
                  </Badge>
                  <Badge variant="amber">@{displayUserName}</Badge>
                </div>

                <h1
                  className="text-xl sm:text-3xl font-black tracking-tight text-white uppercase"
                  style={{
                    textShadow: "2px 2px 0px #21242e",
                  }}
                >
                  📊 링크 클릭 통계 & 성과 리포트
                </h1>
                <p className="text-xs sm:text-sm font-medium text-[#9fbee7] max-w-xl leading-relaxed">
                  모든 링크의 누적 클릭 수 합산, 최고 인기 링크(TOP 1), 그리고 카테고리별 참여 비중을 실시간 데이터로 분석합니다.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 shrink-0">
                <Link href={personalPagePath}>
                  <Button
                    type="button"
                    variant="amber"
                    size="default"
                    className="gap-1.5 cursor-pointer shadow-md"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#21242e]" />
                    <span>내 웹페이지</span>
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    className="gap-1.5 cursor-pointer shadow-md"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>마이페이지 홈</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* 2. 주요 지표 카드 4종 (그라디언트 & 최고 인기 링크 강조) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 카드 1: 총 클릭 수 (모든 링크 합산) */}
            <div className="relative overflow-hidden rounded-[6px] bg-gradient-to-b from-[#2a2f3d] to-[#1b1e26] text-white border-t-2 border-l-2 border-white/40 border-b-2 border-r-2 border-black p-4 flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#9fbee7]">
                  총 클릭 수 (전체 합산)
                </span>
                <div className="p-2 rounded-[4px] bg-gradient-to-br from-[#e60012] to-[#b8000e] text-white border border-white/30 shadow-xs">
                  <MousePointerClick className="w-4 h-4" />
                </div>
              </div>
              <div className="my-2.5 flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-[#ecab37] tracking-tight">
                  {totalClicks.toLocaleString()}
                </span>
                <Badge variant="signal" className="text-[9px] px-1.5 py-0">
                  TOTAL
                </Badge>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#9fbee7] border-t border-white/10 pt-2 font-mono">
                <span>클릭 발생 링크</span>
                <span className="font-bold text-white">
                  {activeClickedLinksCount} / {totalLinks}개
                </span>
              </div>
            </div>

            {/* 카드 2: 최고 인기 링크 (TOP 1) */}
            <div className="relative overflow-hidden rounded-[6px] bg-gradient-to-b from-[#3d4f97] to-[#232f63] text-white border-t-2 border-l-2 border-white/50 border-b-2 border-r-2 border-black p-4 flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ecab37]">
                  최고 인기 링크 (TOP 1)
                </span>
                <div className="p-2 rounded-[4px] bg-gradient-to-br from-[#ecab37] to-[#d97200] text-[#21242e] border border-black shadow-xs">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
              <div className="my-2">
                <div className="flex items-center gap-1.5 mb-1">
                  {topLink && (
                    <Badge variant="amber" className="text-[9px] px-1.5 py-0">
                      {topLink.badge}
                    </Badge>
                  )}
                  <span className="text-[10px] font-mono text-[#9fbee7]">
                    점유율 {topLinkShare}%
                  </span>
                </div>
                <p
                  className="text-xs sm:text-sm font-black text-white truncate"
                  title={topLink?.title}
                >
                  {topLink ? topLink.title : "등록된 링크 없음"}
                </p>
              </div>
              <div className="flex items-center justify-between text-[10px] border-t border-white/15 pt-2 font-mono">
                <span className="text-[#9fbee7]">최다 조회수</span>
                <span className="inline-flex items-center gap-1 font-black text-[#ecab37] text-xs">
                  <MousePointerClick className="w-3 h-3 text-[#f68d1f]" />
                  <span>{Number(topLink?.clicks ?? 0).toLocaleString()}</span>
                </span>
              </div>
            </div>

            {/* 카드 3: 링크당 평균 클릭 수 */}
            <div className="relative overflow-hidden rounded-[6px] bg-gradient-to-b from-[#2a2f3d] to-[#1b1e26] text-white border-t-2 border-l-2 border-white/40 border-b-2 border-r-2 border-black p-4 flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#9fbee7]">
                  링크당 평균 클릭
                </span>
                <div className="p-2 rounded-[4px] bg-gradient-to-br from-[#f68d1f] to-[#c66900] text-white border border-white/30 shadow-xs">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="my-2.5 flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-white tracking-tight">
                  {averageClicks.toLocaleString()}
                </span>
                <span className="text-[10px] font-mono text-[#ecab37]">
                  AVG / LINK
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#9fbee7] border-t border-white/10 pt-2 font-mono">
                <span>산출 기준</span>
                <span className="font-bold text-white">
                  총 {totalClicks.toLocaleString()} ÷ {totalLinks}개
                </span>
              </div>
            </div>

            {/* 카드 4: 등록된 전체 링크 & 카테고리 */}
            <div className="relative overflow-hidden rounded-[6px] bg-gradient-to-b from-[#2a2f3d] to-[#1b1e26] text-white border-t-2 border-l-2 border-white/40 border-b-2 border-r-2 border-black p-4 flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#9fbee7]">
                  등록된 총 링크 수
                </span>
                <div className="p-2 rounded-[4px] bg-gradient-to-br from-[#206479] to-[#144554] text-[#ecab37] border border-white/30 shadow-xs">
                  <Link2 className="w-4 h-4" />
                </div>
              </div>
              <div className="my-2.5 flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-white tracking-tight">
                  {totalLinks.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-[#9fbee7]">LINKS</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#9fbee7] border-t border-white/10 pt-2 font-mono">
                <span>직접 추가한 링크</span>
                <span className="font-bold text-[#ecab37]">
                  {customLinksCount}개 ({badgeChartData.length}개 태그)
                </span>
              </div>
            </div>
          </div>

          {/* 3. 고도화된 차트 섹션 (BarChart with Gradients + PieChart with Rich Tooltips) */}
          {linksLoading ? (
            <Card className="w-full">
              <CardContent className="p-12 flex flex-col items-center justify-center gap-2.5">
                <Loader2 className="w-6 h-6 animate-spin text-[#f68d1f]" />
                <span className="text-xs font-bold">
                  차트 데이터를 시각화하는 중입니다...
                </span>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
              {/* 좌측 (2칸): 링크별 클릭 수 비교 막대 차트 (그라디언트 & 커스텀 툴팁 적용) */}
              <Card className="w-full lg:col-span-2">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                  <div>
                    <CardTitle className="flex items-center gap-1.5 text-xs sm:text-sm">
                      <BarChart3 className="w-4 h-4 text-[#e60012]" />
                      <span>링크별 클릭 성과 비교 (CLICK BAR CHART)</span>
                    </CardTitle>
                    <CardDescription className="mt-0.5">
                      막대에 마우스를 올리면 전체 제목, 배지 태그, 클릭 점유율(%)을 확인할 수 있습니다.
                    </CardDescription>
                  </div>
                  <Badge variant="amber" className="gap-1 font-mono shrink-0">
                    <MousePointerClick className="w-3 h-3" />
                    <span>{totalClicks.toLocaleString()}</span>
                  </Badge>
                </CardHeader>

                <CardContent>
                  <div className="bg-gradient-to-b from-[#e8ecf7] to-[#d5dced] border-2 border-[#3d4f97] p-3 sm:p-4 rounded-[4px] shadow-inner">
                    <ChartContainer
                      config={barChartConfig}
                      className="h-[290px] w-full aspect-auto"
                    >
                      <BarChart
                        data={linkChartData}
                        margin={{ top: 22, right: 14, left: 0, bottom: 28 }}
                      >
                        <defs>
                          {CHART_PALETTE.map((p, idx) => (
                            <linearGradient
                              key={`grad-${idx}`}
                              id={`barGrad-${idx}`}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor={p.gradStart}
                                stopOpacity={1}
                              />
                              <stop
                                offset="100%"
                                stopColor={p.gradEnd}
                                stopOpacity={0.95}
                              />
                            </linearGradient>
                          ))}
                        </defs>
                        <CartesianGrid
                          vertical={false}
                          strokeDasharray="3 3"
                          stroke="#3d4f97"
                          strokeOpacity={0.25}
                        />
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          axisLine={{ stroke: "#3d4f97", strokeWidth: 1.5 }}
                          angle={-18}
                          textAnchor="end"
                          height={54}
                          interval={0}
                          fontSize={10}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={{ stroke: "#3d4f97", strokeWidth: 1.5 }}
                          fontSize={10}
                          allowDecimals={false}
                        />
                        <ChartTooltip
                          cursor={{ fill: "#3d4f97", opacity: 0.12 }}
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            const item = payload[0].payload as {
                              rank: number;
                              fullTitle: string;
                              badge: string;
                              clicks: number;
                              share: number;
                              solidColor: string;
                            };
                            return (
                              <div className="bg-[#21242e] text-white border-2 border-white shadow-2xl rounded-[4px] p-3 text-xs font-mono space-y-2 min-w-[190px] max-w-[260px]">
                                <div className="flex items-center justify-between gap-2 border-b border-white/20 pb-1.5">
                                  <span className="inline-flex items-center gap-1 font-black text-[#ecab37]">
                                    <span>#{item.rank}위</span>
                                  </span>
                                  <span
                                    className="px-1.5 py-0.5 text-[9px] font-black rounded-[2px] text-white border border-white/40"
                                    style={{ backgroundColor: item.solidColor }}
                                  >
                                    {item.badge}
                                  </span>
                                </div>
                                <p className="font-sans font-bold text-white text-xs leading-snug break-words">
                                  {item.fullTitle}
                                </p>
                                <div className="flex items-center justify-between pt-1 border-t border-white/15 text-[11px]">
                                  <span className="text-[#9fbee7]">클릭 조회수</span>
                                  <span className="inline-flex items-center gap-1 font-black text-[#ecab37]">
                                    <MousePointerClick className="w-3 h-3 text-[#f68d1f]" />
                                    <span>{item.clicks.toLocaleString()}</span>
                                    <span className="text-[10px] text-[#9fbee7]">
                                      ({item.share}%)
                                    </span>
                                  </span>
                                </div>
                              </div>
                            );
                          }}
                        />
                        <Bar
                          dataKey="clicks"
                          name="clicks"
                          radius={[4, 4, 0, 0]}
                          stroke="#21242e"
                          strokeWidth={1.5}
                        >
                          <LabelList
                            dataKey="clicks"
                            position="top"
                            fill="#21242e"
                            fontSize={10}
                            fontWeight={800}
                            formatter={(val: unknown) =>
                              typeof val === "number"
                                ? val.toLocaleString()
                                : String(val ?? "")
                            }
                          />
                          {linkChartData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              {/* 우측 (1칸): 카테고리 배지별 클릭 분포 도넛 차트 */}
              <Card className="w-full">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-1.5 text-xs sm:text-sm">
                    <PieChartIcon className="w-4 h-4 text-[#3d4f97]" />
                    <span>카테고리별 점유율 (DONUT)</span>
                  </CardTitle>
                  <CardDescription className="mt-0.5">
                    배지 태그별 누적 클릭 비중 분석
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-2.5">
                  <div className="bg-gradient-to-b from-[#e8ecf7] to-[#d5dced] border-2 border-[#3d4f97] p-3 rounded-[4px] shadow-inner">
                    <ChartContainer
                      config={badgeChartConfig}
                      className="h-[220px] w-full aspect-auto"
                    >
                      <PieChart>
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            const item = payload[0].payload as {
                              badge: string;
                              clicks: number;
                              count: number;
                              share: number;
                              fill: string;
                            };
                            return (
                              <div className="bg-[#21242e] text-white border-2 border-white shadow-xl rounded-[4px] p-2.5 text-xs font-mono space-y-1.5 min-w-[160px]">
                                <div className="flex items-center justify-between border-b border-white/20 pb-1">
                                  <span className="flex items-center gap-1.5 font-black text-[#ecab37]">
                                    <span
                                      className="w-2.5 h-2.5 rounded-[2px] border border-white"
                                      style={{ backgroundColor: item.fill }}
                                    />
                                    {item.badge}
                                  </span>
                                  <span className="text-[10px] text-[#9fbee7]">
                                    {item.count}개 링크
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-[#9fbee7]">합산 클릭</span>
                                  <span className="font-black text-white">
                                    {item.clicks.toLocaleString()} ({item.share}%)
                                  </span>
                                </div>
                              </div>
                            );
                          }}
                        />
                        <Pie
                          data={badgeChartData}
                          dataKey="clicks"
                          nameKey="badge"
                          innerRadius={44}
                          outerRadius={76}
                          paddingAngle={3}
                          stroke="#21242e"
                          strokeWidth={1.5}
                        >
                          {badgeChartData.map((entry, idx) => (
                            <Cell key={`pie-${idx}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartLegend
                          content={<ChartLegendContent nameKey="badge" />}
                        />
                      </PieChart>
                    </ChartContainer>
                  </div>

                  {/* 카테고리별 미니 요약 표 */}
                  <div className="space-y-1">
                    {badgeChartData.slice(0, 4).map((cat) => (
                      <div
                        key={cat.badge}
                        className="flex items-center justify-between bg-[#21242e] text-white px-2.5 py-1.5 rounded-[3px] border border-black text-[11px] font-mono"
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-[2px] border border-white/60"
                            style={{ backgroundColor: cat.fill }}
                          />
                          <span className="font-bold text-[#ecab37]">
                            {cat.badge}
                          </span>
                          <span className="text-[10px] text-[#9fbee7]">
                            ({cat.count}개)
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-[#9fbee7]">
                            {cat.share}%
                          </span>
                          <span className="font-black text-white">
                            {cat.clicks.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 4. 링크별 상세 통계 리스트 (순위, 점유율 게이지 바, URL, 클릭 수) */}
          <Card className="w-full">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <div>
                <CardTitle className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <Award className="w-4 h-4 text-[#e60012]" />
                  <span>링크별 상세 통계 리스트 (DETAILED LINK STATS)</span>
                </CardTitle>
                <CardDescription className="mt-0.5">
                  전체 링크의 클릭 순위, 전체 대비 클릭 점유율(%), 연결 URL 및 누적 조회수 상세 내역입니다.
                </CardDescription>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge variant="signal">{sortedLinks.length} LINKS</Badge>
                <Badge variant="amber" className="gap-1 font-mono">
                  <Activity className="w-3 h-3" />
                  <span>{totalClicks.toLocaleString()}</span>
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-2.5">
              {sortedLinks.map((link, index) => {
                const clicks = Number(link.clicks ?? 0);
                const ratio =
                  totalClicks > 0
                    ? Math.round((clicks / totalClicks) * 1000) / 10
                    : 0;
                const palette = CHART_PALETTE[index % CHART_PALETTE.length];

                return (
                  <div
                    key={link.id}
                    className="bg-gradient-to-r from-[#e6eaf5] to-[#d8dfef] hover:from-white hover:to-white border-t border-l border-white border-b-2 border-r-2 border-[#3d4f97] p-3 sm:p-3.5 rounded-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all shadow-xs"
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      {/* 순위 배지 */}
                      <div
                        className={`w-8 h-8 rounded-[4px] font-mono text-xs font-black flex flex-col items-center justify-center border-2 border-black shrink-0 shadow-xs ${
                          index === 0
                            ? "bg-gradient-to-b from-[#ff3b4b] to-[#e60012] text-white"
                            : index === 1
                            ? "bg-gradient-to-b from-[#ffb347] to-[#f68d1f] text-[#21242e]"
                            : index === 2
                            ? "bg-gradient-to-b from-[#ffd46b] to-[#ecab37] text-[#21242e]"
                            : "bg-[#21242e] text-[#9fbee7]"
                        }`}
                      >
                        <span>#{index + 1}</span>
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="default">{link.badge}</Badge>
                          <h3 className="text-xs sm:text-sm font-black text-[#21242e] truncate">
                            {link.title}
                          </h3>
                          {index === 0 && clicks > 0 && (
                            <Badge variant="amber" className="text-[9px] px-1.5 py-0">
                              🔥 BEST
                            </Badge>
                          )}
                        </div>

                        <p className="text-[11px] font-mono text-[#3d4f97] truncate">
                          {link.url}
                        </p>

                        {/* 점유율 프로그레스 바 */}
                        <div className="flex items-center gap-2 pt-0.5">
                          <div className="flex-1 bg-white/90 border border-[#3d4f97] h-2.5 rounded-[3px] overflow-hidden shadow-inner">
                            <div
                              className="h-full transition-all duration-500 rounded-r-[2px]"
                              style={{
                                width: `${Math.max(clicks > 0 ? 4 : 0, Math.min(100, ratio))}%`,
                                backgroundColor: palette.solid,
                              }}
                            />
                          </div>
                          <span className="text-[10px] font-mono font-extrabold text-[#21242e] w-11 text-right shrink-0">
                            {ratio}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 우측: 클릭 조회수 배지 (아이콘 + 숫자) & 새 탭 열기 */}
                    <div className="flex items-center justify-end gap-2 shrink-0 border-t sm:border-t-0 border-[#3d4f97]/20 pt-2 sm:pt-0">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-black bg-[#21242e] text-[#ecab37] px-3 py-1.5 rounded-[3px] border border-black shadow-xs"
                        title="누적 클릭 조회수"
                      >
                        <MousePointerClick className="w-3.5 h-3.5 text-[#f68d1f]" />
                        <span>{clicks.toLocaleString()}</span>
                      </span>

                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex"
                        title="링크 새 탭으로 확인"
                      >
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          className="px-2.5 py-1.5 cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </a>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Footer Bar */}
        <div className="mt-4 bg-[#21242e] bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:6px_6px] border-t-2 border-l-2 border-white/40 border-b-2 border-r-2 border-black p-2.5 text-center flex flex-col sm:flex-row items-center justify-between gap-2 w-full">
          <div className="text-[9px] sm:text-[10px] text-[#9fbee7] font-mono">
            © 1997–2001 Nintendo / MyLink. Powered by shadcn/ui & Next.js 16.
          </div>
          <Badge variant="amber">ESRB — PRIVACY CERTIFIED</Badge>
        </div>
      </div>
    </div>
  );
}
