import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "마이링크 (MyLink) — Nintendo 2001 Console Edition";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

async function loadKoreanFont(): Promise<ArrayBuffer | null> {
  try {
    const cssRes = await fetch(
      "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700;900&display=swap"
    );
    if (!cssRes.ok) return null;
    const cssText = await cssRes.text();
    const match = cssText.match(/src:\s*url\(([^)]+)\)\s*format\(['"]?(?:woff2|truetype|opentype)['"]?\)/);
    if (!match?.[1]) return null;
    const fontRes = await fetch(match[1]);
    if (!fontRes.ok) return null;
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const fontData = await loadKoreanFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#7a8aba",
          padding: "28px",
          fontFamily: fontData ? '"Noto Sans KR", sans-serif' : "sans-serif",
          color: "#21242e",
        }}
      >
        {/* 외곽 콘솔 하드웨어 베벨 프레임 */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#7a8aba",
            borderTop: "6px solid rgba(255,255,255,0.85)",
            borderLeft: "6px solid rgba(255,255,255,0.85)",
            borderRight: "6px solid #3d4f97",
            borderBottom: "6px solid #3d4f97",
            padding: "22px",
          }}
        >
          {/* 1. 상단 닌텐도 콘솔 헤더 바 */}
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#21242e",
              borderTop: "3px solid rgba(255,255,255,0.35)",
              borderLeft: "3px solid rgba(255,255,255,0.35)",
              borderRight: "4px solid #000000",
              borderBottom: "4px solid #000000",
              padding: "16px 24px",
            }}
          >
            {/* 좌측 닌텐도 필 로고 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#ffffff",
                  border: "4px solid #e60012",
                  borderRadius: "999px",
                  padding: "6px 22px",
                }}
              >
                <span
                  style={{
                    color: "#e60012",
                    fontSize: "24px",
                    fontWeight: 900,
                    letterSpacing: "-0.5px",
                  }}
                >
                  Nintendo
                </span>
                <span
                  style={{
                    color: "#21242e",
                    fontSize: "16px",
                    fontWeight: 900,
                    marginLeft: "6px",
                  }}
                >
                  ® MyLink
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#3d4f97",
                  border: "2px solid rgba(255,255,255,0.4)",
                  padding: "6px 14px",
                  color: "#9fbee7",
                  fontSize: "15px",
                  fontWeight: 700,
                }}
              >
                OFFICIAL CONSOLE PORTAL
              </div>
            </div>

            {/* 우측 메뉴 텍스트 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                color: "#f68d1f",
                fontSize: "16px",
                fontWeight: 900,
                letterSpacing: "1px",
              }}
            >
              <span>LINKS</span>
              <span>•</span>
              <span>PROFILE</span>
              <span>•</span>
              <span>STATS</span>
            </div>
          </div>

          {/* 2. 중앙 히어로 패널 (#acace7) */}
          <div
            style={{
              width: "100%",
              flex: 1,
              marginTop: "18px",
              marginBottom: "18px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#acace7",
              borderTop: "4px solid #ffffff",
              borderLeft: "4px solid #ffffff",
              borderRight: "4px solid #3d4f97",
              borderBottom: "4px solid #3d4f97",
              padding: "36px 42px",
            }}
          >
            {/* 좌측 타이틀 & 소개 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                maxWidth: "700px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "#ecab37",
                    color: "#21242e",
                    border: "2px solid #21242e",
                    padding: "5px 14px",
                    fontSize: "16px",
                    fontWeight: 900,
                  }}
                >
                  BACKEND & SERVER ENGINEER
                </div>
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "#21242e",
                    color: "#ecab37",
                    border: "2px solid #000000",
                    padding: "5px 14px",
                    fontSize: "16px",
                    fontWeight: 900,
                  }}
                >
                  NINTENDO &apos;01 EDITION
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  color: "#ffffff",
                  fontSize: "64px",
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: "-1px",
                  textShadow: "4px 4px 0px #21242e",
                  marginBottom: "16px",
                }}
              >
                마이링크 (MYLINK)
              </div>

              <div
                style={{
                  display: "flex",
                  color: "#21242e",
                  fontSize: "24px",
                  fontWeight: 700,
                  lineHeight: 1.4,
                }}
              >
                나만의 개발자 링크 카트리지를 등록하고 실시간 클릭 통계를 분석하는 레트로 콘솔 프로필 포털
              </div>
            </div>

            {/* 우측 피처 카트리지 카드 박스 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                width: "320px",
                backgroundColor: "#8ba1d4",
                borderTop: "3px solid #ffffff",
                borderLeft: "3px solid #ffffff",
                borderRight: "3px solid #3d4f97",
                borderBottom: "3px solid #3d4f97",
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#21242e",
                  color: "#ecab37",
                  padding: "10px 14px",
                  border: "2px solid #000000",
                  fontSize: "16px",
                  fontWeight: 900,
                }}
              >
                <span>[DEV] GITHUB & DOCS</span>
                <span style={{ color: "#ffffff" }}>↗</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#21242e",
                  color: "#9fbee7",
                  padding: "10px 14px",
                  border: "2px solid #000000",
                  fontSize: "16px",
                  fontWeight: 900,
                }}
              >
                <span>[SYS] LIVE ANALYTICS</span>
                <span style={{ color: "#ecab37" }}>/stats</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f68d1f",
                  color: "#ffffff",
                  borderTop: "2px solid #ffffff",
                  borderLeft: "2px solid #ffffff",
                  borderRight: "3px solid #000000",
                  borderBottom: "3px solid #000000",
                  padding: "12px",
                  fontSize: "18px",
                  fontWeight: 900,
                }}
              >
                PRESS START TO EXPLORE ▶
              </div>
            </div>
          </div>

          {/* 3. 하단 콘솔 푸터 바 */}
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#21242e",
              borderTop: "3px solid rgba(255,255,255,0.35)",
              borderLeft: "3px solid rgba(255,255,255,0.35)",
              borderRight: "4px solid #000000",
              borderBottom: "4px solid #000000",
              padding: "12px 24px",
            }}
          >
            <span
              style={{
                color: "#9fbee7",
                fontSize: "16px",
                fontWeight: 700,
              }}
            >
              © 1997–2001 Nintendo / MyLink. Powered by Next.js 16 & Firebase.
            </span>

            <div
              style={{
                display: "flex",
                backgroundColor: "#ecab37",
                color: "#21242e",
                border: "2px solid #000000",
                padding: "4px 14px",
                fontSize: "15px",
                fontWeight: 900,
              }}
            >
              ESRB — PRIVACY CERTIFIED
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      ...(fontData
        ? {
            fonts: [
              {
                name: "Noto Sans KR",
                data: fontData,
                style: "normal",
                weight: 700,
              },
            ],
          }
        : {}),
    }
  );
}
