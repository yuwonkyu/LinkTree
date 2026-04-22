/**
 * 토스페이먼츠 웹훅 수신 엔드포인트
 *
 * 역할:
 *  - 결제 성공(DONE): subscriptions.next_billing_at + profiles.plan_expires_at 갱신
 *  - 결제 실패(ABORTED/EXPIRED/CANCELED): plan → free, subscription → failed
 *
 * 보안:
 *  - 요청 본문의 secret 필드가 TOSS_WEBHOOK_SECRET 환경변수와 일치해야 처리
 *
 * 멱등성:
 *  - orderId로 subscriptions 테이블 조회 → 이미 처리된 주문은 무시 (중복 처리 방지)
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail, paymentSuccessEmail, paymentFailEmail } from "@/lib/resend";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type TossWebhookPayload = {
  eventType: string;
  createdAt: string;
  secret: string;
  data: {
    paymentKey?: string;
    orderId: string;
    status: "DONE" | "CANCELED" | "PARTIAL_CANCELED" | "ABORTED" | "EXPIRED" | "WAITING_FOR_DEPOSIT";
    totalAmount?: number;
  };
};

export async function POST(req: NextRequest) {
  // ── 1. 페이로드 파싱 ──────────────────────────────
  let payload: TossWebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ── 2. 웹훅 시크릿 검증 ──────────────────────────
  const webhookSecret = process.env.TOSS_WEBHOOK_SECRET;
  if (webhookSecret && payload.secret !== webhookSecret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const { eventType, data } = payload;

  // PAYMENT_STATUS_CHANGED 이외 이벤트는 무시
  if (eventType !== "PAYMENT_STATUS_CHANGED") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const { orderId, status } = data;

  // ── 3. orderId로 구독 조회 ─────────────────────────
  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("*, profiles(id, owner_id, name, plan, billing_period)")
    .eq("toss_order_id", orderId)
    .maybeSingle();

  if (!subscription) {
    // 알 수 없는 orderId — 토스 대시보드 테스트 웹훅 등 무시
    return NextResponse.json({ ok: true, skipped: true });
  }

  const profile = subscription.profiles as {
    id: string;
    owner_id: string;
    name: string;
    plan: string;
    billing_period: string;
  } | null;

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // ── 4. 상태별 처리 ────────────────────────────────
  if (status === "DONE") {
    // 이미 DONE 처리된 구독이면 멱등성 보장 (success page에서 이미 처리했을 수 있음)
    if (subscription.status === "active") {
      return NextResponse.json({ ok: true, skipped: "already_active" });
    }

    const now = new Date();
    const nextBillingAt = new Date(now);
    if (subscription.billing_period === "annual") {
      nextBillingAt.setFullYear(nextBillingAt.getFullYear() + 1);
    } else {
      nextBillingAt.setMonth(nextBillingAt.getMonth() + 1);
    }

    await Promise.all([
      supabaseAdmin
        .from("subscriptions")
        .update({
          status: "active",
          next_billing_at: nextBillingAt.toISOString(),
        })
        .eq("id", subscription.id),

      supabaseAdmin
        .from("profiles")
        .update({
          plan: subscription.plan,
          plan_expires_at: nextBillingAt.toISOString(),
        })
        .eq("id", profile.id),
    ]);

    // 결제 완료 이메일
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(profile.owner_id);
    if (authUser?.user?.email) {
      const tmpl = paymentSuccessEmail(profile.name ?? "", subscription.plan, subscription.amount);
      sendEmail({ to: authUser.user.email, ...tmpl }).catch(() => {});
    }
  } else if (["ABORTED", "EXPIRED", "CANCELED"].includes(status)) {
    // 결제 실패/취소 → Free 플랜으로 강등
    await Promise.all([
      supabaseAdmin
        .from("subscriptions")
        .update({ status: "failed" })
        .eq("id", subscription.id),

      supabaseAdmin
        .from("profiles")
        .update({ plan: "free", plan_expires_at: null })
        .eq("id", profile.id),
    ]);

    // 결제 실패 이메일
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(profile.owner_id);
    if (authUser?.user?.email) {
      const tmpl = paymentFailEmail(profile.name ?? "", subscription.plan, SITE_URL);
      sendEmail({ to: authUser.user.email, ...tmpl }).catch(() => {});
    }
  }

  return NextResponse.json({ ok: true, status });
}
