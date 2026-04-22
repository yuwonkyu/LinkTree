"use server";

import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase";
import { sendEmail, welcomeEmail } from "@/lib/resend";
import { applyReferral } from "@/lib/referral";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// ──────────────────────────────────────────────
// 회원가입
// ──────────────────────────────────────────────
export async function signUp(formData: FormData) {
  const email = (formData.get("email") as string).trim().toLowerCase();
  const password = formData.get("password") as string;
  const name = (formData.get("name") as string).trim();
  const ref = ((formData.get("ref") as string | null) ?? "").trim();

  // ── 기본 유효성 검사 ──
  if (!email || !password || !name) {
    redirect("/auth/signup?error=모든 항목을 입력해주세요.");
  }
  if (!EMAIL_REGEX.test(email)) {
    redirect("/auth/signup?error=이메일 형식이 올바르지 않습니다.");
  }
  if (password.length < 8) {
    redirect("/auth/signup?error=비밀번호는 8자 이상이어야 합니다.");
  }

  // ── 서버사이드 이메일 중복 확인 (클라이언트 검사 우회 방어) ──
  const admin = adminClient();
  const { error: linkError } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
  });
  if (!linkError) {
    // 에러 없음 → 유저 존재 → 중복 이메일
    redirect("/auth/signup?error=이미 사용 중인 이메일입니다.");
  }

  // ── 가입 처리 ──
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${SITE_URL}/auth/callback?next=/dashboard/onboarding`,
    },
  });

  if (error) {
    redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`);
  }

  // ── 추천 코드 자동 적용 ──
  if (ref && data.user) {
    applyReferral(data.user.id, ref).catch(() => {});
  }

  // ── 환영 이메일 ──
  const slugBase = email.split("@")[0];
  const tmpl = welcomeEmail(name, slugBase, SITE_URL);
  sendEmail({ to: email, ...tmpl }).catch(() => {});

  redirect("/auth/signup?success=1");
}

// ──────────────────────────────────────────────
// 로그인
// ──────────────────────────────────────────────
export async function signIn(formData: FormData) {
  const email = (formData.get("email") as string).trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect("/auth/login?error=이메일과 비밀번호를 입력해주세요.");
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

// ──────────────────────────────────────────────
// 로그아웃
// ──────────────────────────────────────────────
export async function signOut() {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
