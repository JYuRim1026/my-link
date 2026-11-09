import Link from "next/link";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#7a8aba] text-[#21242e] font-sans p-2 sm:p-4 md:p-6 flex flex-col items-center justify-center selection:bg-[#f68d1f] selection:text-white w-full overflow-x-hidden">
      <div className="w-full max-w-[680px] bg-[#7a8aba] border-t-4 border-l-4 border-white/70 border-b-4 border-r-4 border-[#3d4f97] shadow-2xl p-3 sm:p-5 relative my-2 sm:my-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#ecab37]" />
              <span>ERROR 404 — USER OR PAGE NOT FOUND</span>
            </CardTitle>
            <Badge variant="signal">404 NOT FOUND</Badge>
          </CardHeader>

          <CardContent>
            <div className="bg-[#dedede] border-2 border-[#3d4f97] p-6 sm:p-8 text-center space-y-4 rounded-[3px] shadow-inner">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#21242e] border-2 border-[#e60012] flex items-center justify-center shadow-md">
                <span className="text-lg font-black text-[#ecab37] font-mono">
                  404
                </span>
              </div>

              <div className="space-y-1.5">
                <h1 className="text-base sm:text-xl font-black text-[#21242e]">
                  존재하지 않는 사용자(displayName)이거나 페이지를 찾을 수 없습니다.
                </h1>
                <p className="text-xs sm:text-sm text-[#3d4f97] font-bold max-w-md mx-auto leading-relaxed">
                  입력하신 <code className="bg-white px-1.5 py-0.5 rounded border border-[#3d4f97] text-[#e60012]">/&#123;displayName&#125;</code> 주소를 다시 확인해 주시거나, 아래 버튼을 눌러 메인 마이페이지로 이동해 주세요.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <Link href="/">
                  <Button
                    type="button"
                    variant="signal"
                    size="lg"
                    className="gap-2 cursor-pointer shadow-md"
                  >
                    <Home className="w-4 h-4" />
                    <span>메인 마이페이지로 이동</span>
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
