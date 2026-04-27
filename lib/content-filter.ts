/**
 * 후기 콘텐츠 필터
 * 욕설·비방·성적 표현을 서버 사이드에서 차단합니다.
 * 패턴을 추가/제거하려면 각 배열에 항목을 넣으세요.
 */

// ── 욕설 ──────────────────────────────────────────────────────
const PROFANITY = [
  /씨\s*발/,
  /씨\s*팔/,
  /시\s*발/,
  /시\s*팔/,
  /ㅅ\s*ㅂ/,
  /개\s*새\s*끼/,
  /개\s*년/,
  /개\s*놈/,
  /개\s*같/,
  /병\s*신/,
  /ㅂ\s*ㅅ/,
  /미\s*친\s*놈/,
  /미\s*친\s*년/,
  /미\s*친\s*새\s*끼/,
  /지\s*랄/,
  /ㅈ\s*랄/,
  /꺼\s*져/,
  /꺼\s*지\s*세/,
  /존\s*나/,
  /ㅈ\s*나/,
  /좆/,
  /보\s*지/,
  /보\s*짓/,
  /창\s*녀/,
  /창\s*놈/,
  /걸\s*레/,
  /찐\s*따/,
  /찐\s*찐\s*따/,
  /멍\s*청\s*이/,
  /바\s*보\s*같/,
  /썅/,
  /ㅆ\s*발/,
  /ㅆ\s*ㅂ/,
  /개\s*소\s*리/,
  /헛\s*소\s*리/,
  /닥\s*쳐/,
  /닥\s*치/,
  /뒤\s*져/,
  /뒤\s*지\s*세/,
  /죽\s*어/,
  /죽\s*여/,
  /자\s*살/,
];

// ── 성적 표현 ──────────────────────────────────────────────────
const SEXUAL = [
  /섹\s*스/,
  /섹\s*시/,
  /야\s*동/,
  /야\s*설/,
  /포\s*르\s*노/,
  /porn/i,
  /sex(?:ual)?/i,
  /fuck/i,
  /pussy/i,
  /cock/i,
  /dick/i,
  /성\s*기/,
  /음\s*란/,
  /음\s*부/,
  /자\s*위/,
  /삽\s*입/,
  /강\s*간/,
  /성\s*폭/,
  /성\s*추\s*행/,
  /성\s*희\s*롱/,
  /원\s*조\s*교\s*제/,
];

// ── 심각한 비방 ────────────────────────────────────────────────
const DEFAMATION = [
  /사\s*기\s*꾼/,
  /사\s*기\s*치/,
  /도\s*둑/,
  /사\s*기\s*당/,
  /협\s*박/,
  /범\s*죄/,
  /살\s*인/,
  /죽\s*이\s*겠/,
  /죽\s*여\s*버/,
  /테\s*러/,
  /폭\s*탄/,
];

const ALL_PATTERNS: { patterns: RegExp[]; label: string }[] = [
  { patterns: PROFANITY,   label: "욕설" },
  { patterns: SEXUAL,      label: "성적 표현" },
  { patterns: DEFAMATION,  label: "비방·위협" },
];

export function checkContent(text: string): { ok: true } | { ok: false; reason: string } {
  const normalized = text.replace(/\s+/g, " ").trim();

  for (const { patterns, label } of ALL_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(normalized)) {
        return { ok: false, reason: `${label}이 포함된 내용은 등록할 수 없습니다.` };
      }
    }
  }

  return { ok: true };
}
