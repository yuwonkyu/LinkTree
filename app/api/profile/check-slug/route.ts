import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9]|[a-z0-9]{0,1})$/;

// GET /api/profile/check-slug?slug=xxx&current=yyy
export async function GET(req: NextRequest) {
  const slug    = req.nextUrl.searchParams.get("slug")?.trim().toLowerCase() ?? "";
  const current = req.nextUrl.searchParams.get("current")?.trim().toLowerCase() ?? "";

  if (!slug) {
    return NextResponse.json({ available: false, error: "슬러그를 입력해주세요." });
  }
  if (slug.length < 3) {
    return NextResponse.json({ available: false, error: "3자 이상 입력해주세요." });
  }
  if (slug.length > 30) {
    return NextResponse.json({ available: false, error: "30자 이하로 입력해주세요." });
  }
  if (!SLUG_REGEX.test(slug)) {
    return NextResponse.json({
      available: false,
      error: "소문자, 숫자, 하이픈(-)만 사용 가능합니다. 앞뒤·연속 하이픈 불가.",
    });
  }

  // 본인 슬러그와 같으면 바로 available
  if (slug === current) {
    return NextResponse.json({ available: true });
  }

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ available: false, error: "확인 중 오류가 발생했습니다." });
  }

  return NextResponse.json({ available: !data });
}
