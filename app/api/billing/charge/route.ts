// Vercel Cron: 매월 1일 자동 결제
// vercel.json에서 호출됨. CRON_SECRET으로 무단 호출 방지.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail, paymentFailEmail, paymentSuccessEmail } from "@/lib/resend";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function tossAuth() {
  const key = process.env.TOSSPAYMENTS_SECRET_KEY ?? "";
  return `Basic ${Buffer.from(`${key}:`).toString("base64")}`;
}

export async function POST(req: NextRequest) {
  // Cron 인증 (CRON_SECRET 미설정 시 무조건 차단)
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 오늘 결제일이 도래한 active 구독만 조회 (monthly: 매월 1일, annual: 1년마다)
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const { data: subscriptions, error } = await supabaseAdmin
    .from("subscriptions")
    .select("*, profiles(id, owner_id, billing_key, name)")
    .eq("status", "active")
    .lte("next_billing_at", today.toISOString())
    .not("profiles.billing_key", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = await Promise.allSettled(
    (subscriptions ?? []).map(async (sub) => {
      const profile = sub.profiles as {
        id: string;
        owner_id: string;
        billing_key: string;
        name: string;
      };
      if (!profile?.billing_key) return;

      const orderId = `cron-${sub.id.slice(0, 8)}-${Date.now()}`;

      const res = await fetch(
        `https://api.tosspayments.com/v1/billing/${profile.billing_key}`,
        {
          method: "POST",
          headers: {
            Authorization: tossAuth(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerKey: profile.owner_id,
            amount: sub.amount,
            orderId,
            orderName: `InstaLink ${sub.plan === "basic" ? "Basic" : "Pro"} 구독`,
          }),
        },
      );

      const now = new Date();
      const nextBillingAt = new Date(now);
      const isAnnual = sub.billing_period === "annual";
      if (isAnnual) {
        nextBillingAt.setFullYear(nextBillingAt.getFullYear() + 1);
      } else {
        nextBillingAt.setMonth(nextBillingAt.getMonth() + 1);
      }

      if (res.ok) {
        // 결제 성공: 다음 결제일 갱신
        await Promise.all([
          supabaseAdmin
            .from("subscriptions")
            .update({
              next_billing_at: nextBillingAt.toISOString(),
              toss_order_id: orderId,
            })
            .eq("id", sub.id),
          supabaseAdmin
            .from("profiles")
            .update({
              plan_expires_at: nextBillingAt.toISOString(),
            })
            .eq("id", profile.id),
        ]);
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(
          profile.owner_id,
        );
        if (authUser?.user?.email) {
          const tmpl = paymentSuccessEmail(
            profile.name ?? "",
            sub.plan,
            sub.amount,
          );
          sendEmail({ to: authUser.user.email, ...tmpl }).catch(() => {});
        }
      } else {
        // 결제 실패: status → failed, plan → free
        await Promise.all([
          supabaseAdmin
            .from("subscriptions")
            .update({ status: "failed" })
            .eq("id", sub.id),
          supabaseAdmin
            .from("profiles")
            .update({ plan: "free", plan_expires_at: null })
            .eq("id", profile.id),
        ]);
        // 결제 실패 알림 이메일
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(
          profile.owner_id,
        );
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
