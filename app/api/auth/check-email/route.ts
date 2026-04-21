import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET /api/auth/check-email?email=xxx
// 이메일 형식 확인 + 중복 여부 반환
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase() ?? "";

  if (!email) {
    return NextResponse.json({ available: false, error: "이메일을 입력해주세요." });
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ available: false, error: "이메일 형식이 올바르지 않습니다." });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Supabase Admin API로 이메일 존재 여부 확인
  const { data } = await supabaseAdmin.auth.admin.getUserByEmail(email);

  return NextResponse.json({ available: !data.user });
}
