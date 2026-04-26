"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { Service, Review, Theme, CustomLink, GalleryImage } from "@/lib/types";

// ──────────────────────────────────────────────
// 슬러그 커스텀 (Pro 전용)
// ──────────────────────────────────────────────
const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9]|[a-z0-9]{0,1})$/;

export async function updateSlug(newSlug: string) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, slug, plan")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!profile) throw new Error("프로필을 찾을 수 없습니다.");
  if (profile.plan !== "pro") throw new Error("Pro 플랜 전용 기능입니다.");

  const slug = newSlug.trim().toLowerCase();
  if (!slug) throw new Error("슬러그를 입력해주세요.");
  if (slug.length < 3) throw new Error("3자 이상 입력해주세요.");
  if (slug.length > 30) throw new Error("30자 이하로 입력해주세요.");
  if (!SLUG_REGEX.test(slug)) {
    throw new Error("소문자, 숫자, 하이픈(-)만 사용 가능합니다. 앞뒤·연속 하이픈 불가.");
  }

  const { data: existing } = await supabase
    .from("profiles")
    .select("slug")
    .eq("slug", slug)
    .neq("id", profile.id)
    .maybeSingle();

  if (existing) throw new Error("이미 사용 중인 주소입니다.");

  const { error } = await supabase
    .from("profiles")
    .update({ slug })
    .eq("id", profile.id);

  if (error) throw new Error(error.message);

  revalidatePath(`/${profile.slug}`);
  revalidatePath(`/${slug}`);
  revalidatePath("/dashboard");
}

export type SaveProfilePayload = {
  name: string;
  shop_name: string;
  tagline: string;
  description: string;
  kakao_url: string;
  kakao_booking_url?: string;
  naver_booking_url?: string;
  phone_url?: string;
  instagram_dm_url?: string;
  kakao_channel_url?: string;
  instagram_id: string;
  location: string;
  hours: string;
  image_url: string;
  theme: Theme;
  services: Service[];
  reviews: Review[];
  custom_links: CustomLink[];
  gallery: GalleryImage[];
  parking_info?: string;
  section_order?: string[];
  button_color?: string;
};

export async function saveProfile(payload: SaveProfilePayload) {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      name: payload.name.trim(),
      shop_name: payload.shop_name.trim(),
      tagline: payload.tagline.trim(),
      description: payload.description.trim(),
      kakao_url: payload.kakao_url.trim(),
      kakao_booking_url: payload.kakao_booking_url?.trim() || null,
      naver_booking_url: payload.naver_booking_url?.trim() || null,
      phone_url: payload.phone_url?.trim() || null,
      instagram_dm_url: payload.instagram_dm_url?.trim() || null,
      kakao_channel_url: payload.kakao_channel_url?.trim() || null,
      instagram_id: payload.instagram_id.trim(),
      location: payload.location.trim(),
      hours: payload.hours.trim(),
      image_url: payload.image_url.trim(),
      theme: payload.theme,
      services: payload.services,
      reviews: payload.reviews,
      custom_links: payload.custom_links,
      gallery: payload.gallery,
      parking_info: payload.parking_info?.trim() || null,
      section_order: payload.section_order?.length ? payload.section_order : null,
      button_color: payload.button_color?.trim() || null,
      is_active: true, // 저장하면 페이지 공개
    })
    .eq("owner_id", user.id);

  if (error) {
    // 서버 액션에서 에러를 클라이언트로 전달하기 위해 throw
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/edit");
  // 공개 페이지 캐시도 무효화 (slug는 DB에서 읽어야 하지만 전체 revalidate로 대응)
  revalidatePath("/[slug]", "page");
  // redirect("/dashboard") 는 호출하지 않음 — 클라이언트(EditForm)에서 모달 표시 후 이동
}
