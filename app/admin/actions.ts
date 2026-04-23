"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { Plan } from "@/lib/types";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "duck01777@gmail.com";

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function changePlan(profileId: string, plan: Plan) {
  // ── 관리자 인증 검증 ──────────────────────────────
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    throw new Error("Unauthorized: 관리자만 플랜을 변경할 수 있습니다.");
  }

  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  await adminClient
    .from("profiles")
    .update({
      plan,
      plan_expires_at: plan === "free" ? null : nextMonth.toISOString(),
    })
    .eq("id", profileId);

  revalidatePath("/admin");
}
