// Vercel Cron: 매월 4일 02:00 UTC — 결제 실패 건 1회 재시도
// 월 1일 자동결제가 실패한 구독을 3일 후 한 번 더 시도한다.
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
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 실패 상태 구독 전체 조회 (billing_key 있는 것만)
  const { data: failed, error } = await supabaseAdmin
    .from("subscriptions")
    .select("*, profiles(id, owner_id, billing_key, name)")
    .eq("status", "failed")
    .not("profiles.billing_key", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = await Promise.allSettled(
    (failed ?? []).map(async (sub) => {
      const profile = sub.profiles as {
        id: string;
        owner_id: string;
        billing_key: string;
        name: string;
      };
      if (!profile?.billing_key) return;

      const orderId = `retry-${sub.id.slice(0, 8)}-${Date.now()}`;
      const now = new Date();
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

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
            orderName: `InstaLink ${sub.plan === "basic" ? "Basic" : "Pro"} 구독 (재시도)`,
          }),
        },
      );

      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(
        profile.owner_id,
      );
      const email = authUser?.user?.email;

      if (res.ok) {
        // 재시도 성공: active 복구
        await Promise.all([
          supabaseAdmin
            .from("subscriptions")
            .update({
              status: "active",
              next_billing_at: nextMonth.toISOString(),
              toss_order_id: orderId,
            })
            .eq("id", sub.id),
          supabaseAdmin
            .from("profiles")
            .update({
              plan: sub.plan,
              plan_expires_at: nextMonth.toISOString(),
            })
            .eq("id", profile.id),
        ]);
        if (email) {
          const tmpl = paymentSuccessEmail(
            profile.name ?? "",
            sub.plan,
            sub.amount,
          );
          sendEmail({ to: email, ...tmpl }).catch(() => {});
        }
      } else {
        // 재시도도 실패: 이메일만 재발송
        if (email) {
          const tmpl = paymentFailEmail(profile.name ?? "", sub.plan, SITE_URL);
          sendEmail({ to: email, ...tmpl }).catch(() => {});
        }
      }
    }),
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  return NextResponse.json({ total: results.length, succeeded });
}
