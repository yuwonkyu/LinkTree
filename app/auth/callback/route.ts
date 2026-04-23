import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // next 파라미터는 반드시 로컬 경로여야 함 (오픈 리다이렉트 방지)
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next = rawNext.startsWith("/") ? rawNext : "/dashboard";

  if (code) {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 인증 성공 → 대시보드 또는 next 파라미터로 이동
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 인증 실패 → 로그인 페이지로
  return NextResponse.redirect(`${origin}/auth/login?error=인증에 실패했습니다. 다시 시도해주세요.`);
}
