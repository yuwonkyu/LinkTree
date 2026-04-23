/**
 * 플랜별 수량 제한 상수 — 편집 UI와 공개 페이지에서 공유합니다.
 * 수정 시 이 파일 하나만 변경하면 됩니다.
 *
 * [다운그레이드 정책]
 * - DB 데이터는 절대 삭제하지 않음 (재구독 시 즉시 복원)
 * - 편집기: 현재 개수가 한도를 초과해도 기존 항목은 표시, 새 추가만 차단
 * - 공개 페이지: 플랜 한도 내 개수만 노출, 초과분은 숨김 처리
 * - 테마: 다운그레이드 후에도 기존 선택 테마 유지 (편집기에서 재선택만 차단)
 */

export const PLAN_LIMITS = {
  free: {
    services: 3,    // 편집 & 공개 3개
    reviews:  3,    // 편집 & 공개 3개
    gallery:  0,    // 갤러리 전체 숨김 (공개 & 편집 신규 추가 불가)
    themes:   ["light"] as const,
  },
  basic: {
    services: 6,    // 편집 & 공개 6개
    reviews:  6,    // 편집 & 공개 6개
    gallery:  6,    // 편집 & 공개 6장
    themes:   ["light", "dark", "ucc"] as const,
  },
  pro: {
    services: Infinity, // 무제한
    reviews:  Infinity, // 무제한
    gallery:  15,       // 최대 15장 (무제한 남용 방지)
    themes:   "all" as const,
  },
} as const;

export type PlanKey = keyof typeof PLAN_LIMITS;

/** plan 문자열을 PLAN_LIMITS 키로 정규화 */
export function toPlanKey(plan?: string | null): PlanKey {
  if (plan === "basic" || plan === "pro") return plan;
  return "free";
}
