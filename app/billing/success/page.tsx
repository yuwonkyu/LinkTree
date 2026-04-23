import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { Plan, BillingPeriod } from "@/lib/types";
import { sendEmail, paymentSuccessEmail } from "@/lib/resend";

type Props = {
  searchParams: Promise<{ authKey?: string; customerKey?: string; plan?: string; period?: string }>;
};

const PLAN_AMOUNTS: Record<string, { monthly: number; annual: number }> = {
  basic: { monthly: 29000, annual: 290000 },
  pro:   { monthly: 49000, annual: 490000 },
};

function tossAuth() {
  const key = process.env.TOSSPAYMENTS_SECRET_KEY ?? "";
  return `Basic ${Buffer.from(`${key}:`).toString("base64")}`;
}

export default async function BillingSuccessPage({ searchParams }: Props) {
  const { authKey, customerKey, plan, period } = await searchParams;
  const billingPeriod: BillingPeriod = period === "annual" ? "annual" : "monthly";

  if (!authKey || !customerKey || !plan || !PLAN_AMOUNTS[plan]) {
    redirect("/billing?error=잘못된 접근입니다.");
  }

  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // customerKey는 반드시 로그인한 유저의 ID여야 함 (타인 명의 결제 방지)
  if (customerKey !== user.id) {
    redirect("/billing?error=잘못된 접근입니다.");
  }

  // 1. authKey → billingKey 교환
  const issueRes = await fetch("https://api.tosspayments.com/v1/billing/authorizations/issue", {
    method: "POST",
    headers: { Authorization: tossAuth(), "Content-Type": "application/json" },
    body: JSON.stringify({ authKey, customerKey }),
  });

  if (!issueRes.ok) {
    const err = await issueRes.json().catch(() => ({}));
    redirect(`/billing/fail?message=${encodeURIComponent(err.message ?? "카드 등록 실패")}`);
  }

  const { billingKey } = await issueRes.json();

  // 2. 즉시 첫 결제
  const amount = PLAN_AMOUNTS[plan]![billingPeriod];
  const orderId = `order-${user.id.slice(0, 8)}-${Date.now()}`;
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!profile) redirect("/dashboard");

  const chargeRes = await fetch(`https://api.tosspayments.com/v1/billing/${billingKey}`, {
    method: "POST",
    headers: { Authorization: tossAuth(), "Content-Type": "application/json" },
    body: JSON.stringify({
      customerKey,
      amount,
      orderId,
      orderName: `InstaLink ${plan === "basic" ? "Basic" : "Pro"} 구독`,
      customerEmail: user.email,
      customerName: profile.name || user.email,
    }),
  });

  if (!chargeRes.ok) {
    const err = await chargeRes.json().catch(() => ({}));
    redirect(`/billing/fail?message=${encodeURIComponent(err.message ?? "결제 실패")}`);
  }

  // 3. DB 업데이트
  const now = new Date();
  const expiresAt = new Date(now);
  if (billingPeriod === "annual") {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  } else {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  }

  await Promise.all([
    supabase.from("profiles").update({
      billing_key: billingKey,
      plan: plan as Plan,
      plan_expires_at: expiresAt.toISOString(),
    }).eq("owner_id", user.id),

    supabase.from("subscriptions").insert({
      profile_id: profile.id,
      plan,
      billing_period: billingPeriod,
      amount,
      status: "active",
      toss_order_id: orderId,
      started_at: now.toISOString(),
      next_billing_at: expiresAt.toISOString(),
    }),
  ]);

  // 결제 완료 이메일
  const tmpl = paymentSuccessEmail(profile.name ?? "", plan, amount);
  sendEmail({ to: user.email!, ...tmpl }).catch(() => {});

  redirect("/dashboard?upgraded=1");
}
