// Vercel Cron: 매일 10:00 UTC — next_billing_at이 3일 후인 구독자에게 갱신 알림 발송
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail, renewalReminderEmail } from "@/lib/resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 플랜 만료 정리 ─────────────────────────────────────────
  // 취소된 구독의 plan_expires_at이 지났으면 free로 전환
  // (charge cron은 월 1회지만 remind는 매일 실행 → 만료 당일 처리 가능)
  const { data: expiredProfiles } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .neq("plan", "free")
    .not("plan_expires_at", "is", null)
    .lt("plan_expires_at", new Date().toISOString());

  if (expiredProfiles && expiredProfiles.length > 0) {
    await supabaseAdmin
      .from("profiles")
      .update({ plan: "free", plan_expires_at: null })
      .in("id", expiredProfiles.map((p: { id: string }) => p.id));
  }

  // 3일 후 갱신 예정 구독 조회 (±12시간 window → 하루 1회 실행 시 중복 없음)
  const now = new Date();
  const from = new Date(now.getTime() + (3 * 24 - 12) * 60 * 60 * 1000);
  const to   = new Date(now.getTime() + (3 * 24 + 12) * 60 * 60 * 1000);

  const { data: subscriptions, error } = await supabaseAdmin
    .from("subscriptions")
    .select("*, profiles(id, owner_id, name)")
    .eq("status", "active")
    .gte("next_billing_at", from.toISOString())
    .lte("next_billing_at", to.toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let sent = 0;
  for (const sub of subscriptions ?? []) {
    const profile = sub.profiles as { id: string; owner_id: string; name: string } | null;
    if (!profile) continue;

    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(profile.owner_id);
    const email = authUser?.user?.email;
    if (!email) continue;

    const billingDate = new Date(sub.next_billing_at!).toLocaleDateString("ko-KR");
    const tmpl = renewalReminderEmail(profile.name ?? "", sub.plan, sub.amount, billingDate);
    await sendEmail({ to: email, ...tmpl }).catch(() => {});
    sent++;
  }

  return NextResponse.json({ checked: subscriptions?.length ?? 0, sent });
}
