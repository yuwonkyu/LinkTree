import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET /api/auth/check-email?email=xxx
// 이메일 형식 확인 + 중복 여부 반환
export async function GET(req: NextRequest) {
  const email =
    req.nextUrl.searchParams.get("email")?.trim().toLowerCase() ?? "";

  if (!email) {
    return NextResponse.json({
      available: false,
      error: "이메일을 입력해주세요.",
    });
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({
      available: false,
      error: "이메일 형식이 올바르지 않습니다.",
    });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // recovery 링크 생성 시도: 유저가 존재하면 성공, 없으면 에러 반환 (이메일 발송 없음)
  const { error } = await supabaseAdmin.auth.admin.generateLink({
    type: "recovery",
    email,
  });

  // error → 유저 없음 → 사용 가능 / no error → 유저 존재 → 사용 불가
  return NextResponse.json({ available: !!error });
}
