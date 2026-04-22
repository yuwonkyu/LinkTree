"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase";
import { getSiteUrl } from "@/lib/site-url";

export async function resetPassword(formData: FormData) {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";

  if (!email) {
    redirect("/auth/reset-password?error=" + encodeURIComponent("이메일을 입력해주세요."));
  }

  const supabase = await getSupabaseServerClient();
  const siteUrl = getSiteUrl();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/update-password`,
  });

  if (error) {
    redirect(
      "/auth/reset-password?error=" +
        encodeURIComponent("이메일 발송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
    );
  }

  // 성공 — 이메일 존재 여부 노출 방지를 위해 항상 동일 메시지
  redirect(
    "/auth/reset-password?success=" +
      encodeURIComponent(
        "입력하신 이메일로 재설정 링크를 보냈습니다. 이메일을 확인해주세요. (스팸함도 확인해보세요)"
      )
  );
}
