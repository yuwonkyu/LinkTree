import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? "";

type SuggestRequest = {
  type: "tagline" | "description" | "services";
  shopName: string;
  category: string; // PT, 필라테스, 미용실, 카페 등
  existing?: string;
};

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // AI 기능은 유료 플랜(basic/pro)만 사용 가능
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!profile || profile.plan === "free") {
    return NextResponse.json({ error: "유료 플랜 전용 기능입니다." }, { status: 403 });
  }

  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY 없음" }, { status: 500 });
  }

  const body: SuggestRequest = await req.json();
  const { type, shopName, category, existing } = body;

  const prompts: Record<SuggestRequest["type"], string> = {
    tagline: `소상공인 링크 페이지용 한 줄 소개(태그라인)를 3가지 추천해줘.
업종: ${category}, 상호명: ${shopName}
- 각 20자 이내
- 고객 혜택 중심
- 번호 없이 줄바꿈으로 구분
- 한국어만 사용`,

    description: `소상공인 링크 페이지 상세 소개글을 작성해줘.
업종: ${category}, 상호명: ${shopName}
기존 내용: ${existing || "없음"}
- 3~5줄
- ✔ 체크마크로 시작하는 bullet
- 친근하고 신뢰감 있는 톤
- 한국어만 사용`,

    services: `${category} 업종의 대표 서비스 목록을 JSON 배열로 추천해줘.
상호명: ${shopName}
- 3~5개
- 형식: [{"name":"서비스명","price":"가격"}]
- 가격은 한국 시장 기준 현실적으로
- JSON만 출력, 설명 없이`,
  };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [{ role: "user", content: prompts[type] }],
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "AI 요청 실패" }, { status: 500 });
  }

  const data = await res.json();
  const text = data.content?.[0]?.text ?? "";

  // services 타입이면 JSON 파싱 시도
  if (type === "services") {
    try {
      const parsed = JSON.parse(text.match(/\[[\s\S]*\]/)?.[0] ?? "[]");
      return NextResponse.json({ result: parsed });
    } catch {
      return NextResponse.json({ result: text });
    }
  }

  return NextResponse.json({ result: text });
}
