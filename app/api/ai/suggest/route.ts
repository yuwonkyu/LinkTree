import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? "";

type SuggestRequest = {
  type: "tagline" | "description" | "services";
  shopName: string;
  category: string;
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
    console.error("[AI] ANTHROPIC_API_KEY가 설정되지 않았습니다.");
    return NextResponse.json({ error: "API 키 미설정 — 관리자에게 문의하세요." }, { status: 500 });
  }

  const body = await req.json();
  const { type, shopName, category, existing } = body as SuggestRequest;

  // 허용된 type만 처리 (undefined 프롬프트로 Anthropic API 호출 방지)
  const VALID_TYPES: SuggestRequest["type"][] = ["tagline", "description", "services"];
  if (!type || !VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "유효하지 않은 type입니다." }, { status: 400 });
  }
  if (!shopName?.trim() || !category?.trim()) {
    return NextResponse.json({ error: "shopName과 category는 필수입니다." }, { status: 400 });
  }

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
- 가격 형식: 반드시 "50,000원" 처럼 천단위 쉼표와 원화 단위 포함 (예: "30,000원", "1,200,000원", "무료")
- 가격은 한국 시장 기준 현실적으로
- JSON만 출력, 설명 없이`,
  };

  let res: Response;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
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
  } catch (fetchErr) {
    console.error("[AI] Anthropic fetch 실패:", fetchErr);
    return NextResponse.json({ error: "AI 서버 연결 실패. 잠시 후 다시 시도해주세요." }, { status: 500 });
  }

  if (!res.ok) {
    let errBody = "";
    try { errBody = await res.text(); } catch { /* ignore */ }
    console.error(`[AI] Anthropic API 오류 ${res.status}:`, errBody);
    return NextResponse.json(
      { error: `AI 요청 실패 (${res.status}): ${errBody.slice(0, 200)}` },
      { status: 500 }
    );
  }

  const data = await res.json();
  const text: string = data.content?.[0]?.text ?? "";

  if (!text) {
    console.error("[AI] Anthropic 응답에 텍스트 없음:", data);
    return NextResponse.json({ error: "AI 응답이 비어있습니다. 다시 시도해주세요." }, { status: 500 });
  }

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
