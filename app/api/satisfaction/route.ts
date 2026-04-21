// Vercel Cron: 매일 실행 — 가입 30일 된 유저에게 만족도 이메일 발송
// vercel.json에서 호출됨. CRON_SECRET으로 무단 호출 방지.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/resend";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function satisfactionEmail(name: string, slug: string, siteUrl: string) {
  return {
    subject: `${name}님, InstaLink 사용은 어떠셨나요? 💬`,
    html: `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#111827">
  <h2 style="margin:0 0 8px">안녕하세요, ${name}님! 👋</h2>
  <p style="color:#6b7280;margin:0 0 24px">InstaLink를 사용한 지 30일이 됐어요.<br>서비스는 어떠셨나요?</p>

  <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:24px">
    <p style="margin:0 0 12px;font-weight:600">한 가지만 여쭤볼게요 😊</p>
    <p style="margin:0;color:#374151">인스타 프로필 링크 페이지가 영업에 도움이 됐나요?</p>
  </div>

  <div style="display:flex;gap:12px;margin-bottom:24px">
    <a href="${siteUrl}/feedback?slug=${slug}&rating=good"
       style="flex:1;text-align:center;background:#111827;color:#fff;text-decoration:none;padding:12px;border-radius:8px;font-weight:600">
      👍 도움됐어요
    </a>
    <a href="${siteUrl}/feedback?slug=${slug}&rating=bad"
       style="flex:1;text-align:center;background:#f3f4f6;color:#111827;text-decoration:none;padding:12px;border-radius:8px;font-weight:600">
      👎 별로였어요
    </a>
  </div>

  <p style="color:#9ca3af;font-size:13px;margin:0">
    피드백을 주시면 서비스 개선에 큰 도움이 됩니다.<br>
    내 링크 페이지: <a href="${siteUrl}/${slug}" style="color:#111827">${siteUrl}/${slug}</a>
  </p>

  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
  <p style="color:#d1d5db;font-size:12px;margin:0">InstaLink · 소상공인을 위한 링크 페이지</p>
</div>`,
  };
}

export async function POST(req: NextRequest) {
  // Cron 인증
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 가입 30일 된 유저 (오늘 기준 ±12시간 window)
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - 30);
  from.setHours(from.getHours() - 12);
  const to = new Date(now);
  to.setDate(to.getDate() - 30);
  to.setHours(to.getHours() + 12);

  const { data: profiles, error } = await supabaseAdmin
    .from("profiles")
    .select("owner_id, name, shop_name, slug")
    .gte("created_at", from.toISOString())
    .lte("created_at", to.toISOString())
    .eq("is_active", true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let sent = 0;
  for (const profile of profiles ?? []) {
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(
      profile.owner_id,
    );
    const email = authUser?.user?.email;
    if (!email) continue;

    const displayName = profile.name || profile.shop_name || profile.slug;
    const tmpl = satisfactionEmail(displayName, profile.slug, SITE_URL);
    await sendEmail({ to: email, ...tmpl }).catch(() => {});
    sent++;
  }

  return NextResponse.json({ checked: profiles?.length ?? 0, sent });
}
