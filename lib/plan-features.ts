/**
 * 플랜 기능 비교 데이터 — 랜딩페이지와 결제 페이지에서 공유
 * 변경 시 이 파일만 수정하면 양쪽에 자동 반영됩니다.
 */
export type PlanFeatureRow = {
  label: string;
  free: string | boolean;
  basic: string | boolean;
  pro: string | boolean;
};

export const PLAN_FEATURE_ROWS: PlanFeatureRow[] = [
  { label: "프로필 페이지",       free: true,       basic: true,       pro: true      },
  { label: "카카오 문의 버튼",    free: true,       basic: true,       pro: true      },
  { label: "테마",                free: "1종",      basic: "3종",      pro: "6종"     },
  { label: "서비스 등록",         free: "3개",      basic: "6개",      pro: "무제한"  },
  { label: "후기 등록",           free: "3개",      basic: "6개",      pro: "무제한"  },
  { label: "갤러리",              free: false,      basic: "6장",      pro: "15장"    },
  { label: "방문자 통계",         free: false,      basic: false,      pro: true      },
  { label: "주간 리포트 이메일",  free: false,      basic: false,      pro: true      },
  { label: "AI 문구 추천",        free: false,      basic: false,      pro: true      },
  { label: "섹션 순서 변경",      free: false,      basic: false,      pro: true      },
  { label: "버튼 컬러 커스텀",    free: false,      basic: false,      pro: true      },
];
