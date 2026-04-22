export type Service = {
  name: string;
  price: string;
  note?: string;
};

export type CustomLink = {
  label: string;
  url: string;
};

export type Review = {
  text: string;
  author: string;
};

export type Theme =
  | "light"
  | "dark"
  | "ucc"
  | "softsage"
  | "warmlinen"
  | "energysteel";

export type Plan = "free" | "basic" | "pro";
export type BillingPeriod = "monthly" | "annual";

export type Profile = {
  id: string;
  slug: string;
  owner_id: string;
  name: string;
  shop_name: string;
  tagline: string;
  description?: string;
  kakao_url: string;
  kakao_booking_url?: string | null;
  naver_booking_url?: string | null;
  instagram_id: string;
  location: string;
  hours: string;
  image_url: string;
  theme: Theme;
  plan: Plan;
  plan_expires_at?: string | null;
  billing_key?: string | null;
  services: Service[];
  reviews: Review[];
  is_active: boolean;
  created_at: string;
  referral_code?: string | null;
  referred_by?: string | null;
  custom_links?: CustomLink[] | null;
  view_count?: number;
  is_available?: boolean;
  phone_url?: string | null;
  instagram_dm_url?: string | null;
  kakao_channel_url?: string | null;
};

export type Subscription = {
  id: string;
  profile_id: string;
  plan: Plan;
  billing_period: BillingPeriod;
  amount: number;
  status: "active" | "cancelled" | "failed";
  toss_order_id?: string | null;
  started_at: string;
  next_billing_at?: string | null;
  cancelled_at?: string | null;
};

// ── 플랜 메타데이터 ──────────────────────────────
export const PLAN_META: Record<
  Plan,
  { label: string; price: number; annualPrice: number; features: string[] }
> = {
  free: {
    label: "Free",
    price: 0,
    annualPrice: 0,
    features: ["기본 프로필 페이지", "라이트 테마 1종", "서비스 3개까지", "후기 3개까지"],
  },
  basic: {
    label: "Basic",
    price: 19900,
    annualPrice: 199000,  // 월 19,900 × 10개월 (2개월 무료)
    features: ["모든 테마 6종", "서비스 무제한", "후기 무제한", "카카오 문의 버튼"],
  },
  pro: {
    label: "Pro",
    price: 29900,
    annualPrice: 299000,  // 월 29,900 × 10개월 (2개월 무료)
    features: ["Basic 모든 기능", "방문자 통계", "멀티 링크 (예정)", "우선 지원"],
  },
};
