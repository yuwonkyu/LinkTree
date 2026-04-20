// Vercel Cron: 매월 1일 자동 결제
// vercel.json에서 호출됨. CRON_SECRET으로 무단 호출 방지.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail, paymentFailEmail } from "@/lib/resend";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://instalink.vercel.app";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function tossAuth() {
  const key = process.env.TOSSPAYMENTS_SECRET_KEY ?? "";
  return `Basic ${Buffer.from(`${key}:`).toString("base64")}`;
}

export async function POST(req: NextRequest) {
  // Cron 인증
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // active 구독 전체 조회
  const { data: subscriptions, error } = await supabaseAdmin
    .from("subscriptions")
    .select("*, profiles(id, owner_id, billing_key, name)")
    .eq("status", "active")
    .not("profiles.billing_key", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = await Promise.allSettled(
    (subscriptions ?? []).map(async (sub) => {
      const profile = sub.profiles as { id: string; owner_id: string; billing_key: string; name: string };
      if (!profile?.billing_key) return;

      const orderId = `cron-${sub.id.slice(0, 8)}-${Date.now()}`;

      const res = await fetch(`https://api.tosspayments.com/v1/billing/${profile.billing_key}`, {
        method: "POST",
        headers: { Authorization: tossAuth(), "Content-Type": "application/json" },
        body: JSON.stringify({
          customerKey: profile.owner_id,
          amount: sub.amount,
          orderId,
          orderName: `InstaLink ${sub.plan === "basic" ? "Basic" : "Pro"} 구독`,
        }),
      });

      const now = new Date();
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      if (res.ok) {
        // 결제 성공: 다음 결제일 갱신
        await Promise.all([
          supabaseAdmin.from("subscriptions").update({
            next_billing_at: nextMonth.toISOString(),
            toss_order_id: orderId,
          }).eq("id", sub.id),
          supabaseAdmin.from("profiles").update({
            plan_expires_at: nextMonth.toISOString(),
          }).eq("id", profile.id),
        ]);
      } else {
        // 결제 실패: status → failed, plan → free
        await Promise.all([
          supabaseAdmin.from("subscriptions").update({ status: "failed" }).eq("id", sub.id),
          supabaseAdmin.from("profiles").update({ plan: "free", plan_expires_at: null }).eq("id", profile.id),
        ]);
        // 결제 실패 알림 이메일
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(profile.owner_id);
        if (authUser?.user?.email) {
          const tmpl = paymentFailEmail(profile.name ?? "", sub.plan, SITE_URL);
          sendEmail({ to: authUser.user.email, ...tmpl }).catch(() => {});
        }
      }
    }),
  );

  const failed = results.filter((r) => r.status === "rejected").length;
  return NextResponse.json({ total: results.length, failed });
}
