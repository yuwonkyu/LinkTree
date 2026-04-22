"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { Service } from "@/lib/types";

export type OnboardingPayload = {
  name: string;
  shop_name: string;
  tagline: string;
  description: string;
  kakao_url: string;
  services: Service[];
};

export async function saveOnboarding(payload: OnboardingPayload) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { error } = await supabase
    .from("profiles")
    .update({
      name: payload.name.trim(),
      shop_name: payload.shop_name.trim(),
      tagline: payload.tagline.trim(),
      description: payload.description.trim(),
      kakao_url: payload.kakao_url.trim(),
      services: payload.services,
      is_active: true,
    })
    .eq("owner_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/[slug]", "page");
  redirect("/dashboard?onboarded=1");
}
