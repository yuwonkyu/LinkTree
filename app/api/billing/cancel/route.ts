import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { sendEmail, cancellationEmail } from "@/lib/resend";

export async function POST() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1. 본인 profile 조회
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, plan")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const now = new Date().toISOString();

  // 2. 구독 취소 (순차 처리)
  //    billing_key만 제거해 자동 갱신을 차단하고,
  //    plan·plan_expires_at은 유지 → 결제 기간 만료까지 서비스 계속 이용 가능
  await supabase
    .from("subscriptions")
    .update({ status: "cancelled", cancelled_at: now })
    .eq("profile_id", profile.id)
    .eq("status", "active");

  await supabase
    .from("profiles")
    .update({ billing_key: null })
    .eq("owner_id", user.id);

  if (user.email && profile.name && profile.plan) {
    const tmpl = cancellationEmail(profile.name, profile.plan);
    sendEmail({ to: user.email, ...tmpl }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
