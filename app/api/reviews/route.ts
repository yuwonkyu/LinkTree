import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  let body: { slug: string; text: string; author: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { slug, text, author } = body;

  if (!slug || !text?.trim() || !author?.trim()) {
    return NextResponse.json({ error: "slug, text, author는 필수입니다." }, { status: 400 });
  }
  if (text.trim().length > 300) {
    return NextResponse.json({ error: "후기는 300자 이내로 작성해주세요." }, { status: 400 });
  }
  if (author.trim().length > 30) {
    return NextResponse.json({ error: "이름은 30자 이내로 작성해주세요." }, { status: 400 });
  }

  // 프로필 조회
  const { data: profile, error: fetchError } = await admin
    .from("profiles")
    .select("id, reviews, plan")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (fetchError || !profile) {
    return NextResponse.json({ error: "페이지를 찾을 수 없습니다." }, { status: 404 });
  }

  const existing: { text: string; author: string }[] = Array.isArray(profile.reviews)
    ? profile.reviews
    : [];

  // 스팸 방지 1: 프로필당 최대 후기 수 제한
  if (existing.length >= 50) {
    return NextResponse.json({ error: "후기가 최대 개수에 도달했습니다." }, { status: 429 });
  }

  // 스팸 방지 2: 동일 작성자 중복 제한 (같은 author 최대 1개)
  const alreadyExists = existing.some(
    (r) => r.author.trim().toLowerCase() === author.trim().toLowerCase(),
  );
  if (alreadyExists) {
    return NextResponse.json(
      { error: "이미 후기를 작성하셨습니다." },
      { status: 409 },
    );
  }

  // 스팸 방지 3: 동일 내용 중복 차단
  const isDuplicateText = existing.some(
    (r) => r.text.trim() === text.trim(),
  );
  if (isDuplicateText) {
    return NextResponse.json(
      { error: "동일한 내용의 후기가 이미 존재합니다." },
      { status: 409 },
    );
  }

  const newReview = { text: text.trim(), author: author.trim() };
  const updated = [...existing, newReview];

  const { error: updateError } = await admin
    .from("profiles")
    .update({ reviews: updated })
    .eq("id", profile.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
