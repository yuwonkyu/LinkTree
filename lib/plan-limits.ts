/**
 * 플랜별 수량 제한 상수 — 편집 UI와 공개 페이지에서 공유합니다.
 * 수정 시 이 파일 하나만 변경하면 됩니다.
 */

export const PLAN_LIMITS = {
  free: {
    services: 3,
    reviews:  3,
    gallery:  0,
    themes:   ["light"] as const,
  },
  basic: {
    services: 6,
    reviews:  6,
    gallery:  6,
    themes:   ["light", "dark", "ucc"] as const,
  },
  pro: {
    services: Infinity,
    reviews:  Infinity,
    gallery:  Infinity,
    themes:   "all" as const,
  },
} as const;

export type PlanKey = keyof typeof PLAN_LIMITS;

/** plan 문자열을 PLAN_LIMITS 키로 정규화 */
export function toPlanKey(plan?: string | null): PlanKey {
  if (plan === "basic" || plan === "pro") return plan;
  return "free";
}
