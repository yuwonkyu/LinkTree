const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const FROM = "InstaLink <onboarding@resend.dev>";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: EmailPayload) {
  if (!RESEND_API_KEY) {
    console.warn("[resend] RESEND_API_KEY 없음 — 이메일 스킵");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("[resend] 이메일 발송 실패:", err);
  }
}

// ── 이메일 템플릿 ─────────────────────────────────

export function welcomeEmail(name: string, slug: string, siteUrl: string) {
  return {
    subject: "InstaLink에 오신 걸 환영합니다! 🎉",
    html: `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#111827">
  <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">안녕하세요, ${name}님! 👋</h1>
  <p style="font-size:15px;color:#6b7280;margin:0 0 24px">InstaLink 가입을 환영합니다.<br>지금 바로 내 링크 페이지를 꾸며보세요.</p>
  <a href="${siteUrl}/dashboard/edit"
     style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:600">
    프로필 편집하러 가기 →
  </a>
  <hr style="border:none;border-top:1px solid #f3f4f6;margin:32px 0">
  <p style="font-size:12px;color:#9ca3af">내 페이지 주소: <a href="${siteUrl}/${slug}" style="color:#111827">${siteUrl}/${slug}</a></p>
</div>`,
  };
}

export function paymentFailEmail(name: string, plan: string, siteUrl: string) {
  return {
    subject: "[InstaLink] 결제에 실패했습니다",
    html: `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#111827">
  <h1 style="font-size:20px;font-weight:700;margin:0 0 8px">결제 실패 안내</h1>
  <p style="font-size:15px;color:#6b7280;margin:0 0 16px">
    ${name}님, <strong>${plan}</strong> 플랜 정기 결제가 실패했습니다.<br>
    플랜이 <strong>Free</strong>로 변경되었습니다.
  </p>
  <a href="${siteUrl}/billing"
     style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:600">
    결제 수단 업데이트하기 →
  </a>
</div>`,
  };
}

export function cancellationEmail(name: string, plan: string) {
  return {
    subject: "[InstaLink] 구독이 취소되었습니다",
    html: `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#111827">
  <h1 style="font-size:20px;font-weight:700;margin:0 0 8px">구독 취소 안내</h1>
  <p style="font-size:15px;color:#6b7280;margin:0 0 16px">
    ${name}님, <strong>${plan}</strong> 플랜 구독이 취소되었습니다.<br>
    현재 결제 기간이 끝나면 <strong>Free</strong> 플랜으로 전환됩니다.
  </p>
  <p style="font-size:13px;color:#9ca3af">다시 이용하고 싶으시면 언제든 업그레이드하세요.</p>
</div>`,
  };
}

export function paymentSuccessEmail(name: string, plan: string, amount: number) {
  return {
    subject: "[InstaLink] 결제가 완료되었습니다",
    html: `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#111827">
  <h1 style="font-size:20px;font-weight:700;margin:0 0 8px">결제 완료 ✓</h1>
  <p style="font-size:15px;color:#6b7280;margin:0 0 8px">${name}님, ${plan} 플랜 결제가 완료되었습니다.</p>
  <p style="font-size:15px;font-weight:600;color:#111827">결제 금액: ${amount.toLocaleString()}원</p>
</div>`,
  };
}

export function renewalReminderEmail(name: string, plan: string, amount: number, billingDate: string) {
  return {
    subject: "[InstaLink] 3일 후 구독이 갱신됩니다",
    html: `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#111827">
  <h1 style="font-size:20px;font-weight:700;margin:0 0 8px">구독 갱신 예정 안내</h1>
  <p style="font-size:15px;color:#6b7280;margin:0 0 20px">
    ${name}님, <strong>${plan}</strong> 플랜이 3일 후 자동 갱신됩니다.
  </p>
  <div style="background:#f9fafb;border-radius:12px;padding:16px 20px;margin-bottom:24px">
    <p style="margin:0 0 6px;font-size:13px;color:#9ca3af">갱신일</p>
    <p style="margin:0 0 12px;font-size:15px;font-weight:600;color:#111827">${billingDate}</p>
    <p style="margin:0 0 6px;font-size:13px;color:#9ca3af">결제 예정액</p>
    <p style="margin:0;font-size:15px;font-weight:600;color:#111827">${amount.toLocaleString()}원</p>
  </div>
  <p style="font-size:13px;color:#9ca3af;margin:0">구독을 취소하려면 대시보드 → 플랜 변경에서 취소해 주세요.</p>
</div>`,
  };
}
