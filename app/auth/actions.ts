"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase";

// ──────────────────────────────────────────────
// 회원가입
// ──────────────────────────────────────────────
export async function signUp(formData: FormData) {
  const email = (formData.get("email") as string).trim();
  const password = formData.get("password") as string;
  const name = (formData.get("name") as string).trim();

  if (!email || !password || !name) {
    redirect("/auth/signup?error=모든 항목을 입력해주세요.");
  }

  if (password.length < 8) {
    redirect("/auth/signup?error=비밀번호는 8자 이상이어야 합니다.");
  }

  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`);
  }

  // 이메일 확인이 필요 없는 경우(Supabase 설정에 따라) 바로 대시보드로
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
