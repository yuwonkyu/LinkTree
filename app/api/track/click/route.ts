import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type ClickBody = {
  profileId: string;
  linkType: "kakao" | "instagram" | "phone";
};

const VALID_LINK_TYPES = ["kakao", "instagram", "phone"];

export async function POST(req: NextRequest) {
  let body: ClickBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { profileId, linkType } = body;
  if (!profileId || !VALID_LINK_TYPES.includes(linkType)) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  // 실제 존재하는 활성 프로필인지 검증 (통계 조작 방지)
  const { count } = await supabaseAdmin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("id", profileId)
    .eq("is_active", true);

  if (!count) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { error } = await supabaseAdmin
    .from("link_clicks")
    .insert({ profile_id: profileId, link_type: linkType });

  if (error) {
    console.error("[track/click]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
