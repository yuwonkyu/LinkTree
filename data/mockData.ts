// 서비스 항목(PT, 체험 등)
export type ServiceItem = {
  name: string; // 서비스명
  price: string; // 가격 (예: "50,000원")
  vat?: boolean; // 부가세 포함 여부
};

// 후기 항목
export type ReviewItem = {
  author: string; // 작성자
  content: string; // 후기 내용
};

/**
 * ProfileOptions - UI 커스터마이징 옵션
 * 모든 필드는 선택적이며, 설정하지 않으면 기본값이 적용됩니다.
 * 
 * 기본값:
 * - showReviews: true (후기 섹션 표시)
 * - showLocation: true (위치/운영시간 표시)
 * - customCTA: profile.ctaLabel 사용
 * - theme: "light" (라이트 모드)
 * - highlightColor: "#FEE500" (CTA 버튼 배경색)
 * - showEditableFrame: true (반짝이는 테두리 표시)
 * - serviceFooterLabel: false (서비스 푸터 미표시)
 */
// 프로필 UI 커스터마이징 옵션
export type ProfileOptions = {
  showReviews?: boolean; // 후기 섹션 표시 여부
  showLocation?: boolean; // 위치/운영시간 표시 여부
  customCTA?: string; // CTA(상담 버튼) 문구 커스텀
  theme?: "light" | "dark"; // 테마(라이트/다크)
  highlightColor?: string; // CTA 버튼 배경색
  showEditableFrame?: boolean; // 반짝이는 테두리 표시
  serviceFooterLabel?: string | false; // 서비스 푸터 라벨(문구/미표시)
};

// 트레이너(고객) 프로필 전체 타입
export type TrainerProfile = {
  username: string; // URL용 유저명
  name: string; // 트레이너 이름
  brandName: string; // 브랜드/센터명
  role: string; // 주요 역할/설명
  intro: string; // 한줄 소개/설명
  location: string; // 위치 정보
  availability: string; // 운영시간
  ctaLabel: string; // 상담 버튼 문구
  instagramUrl: string; // 인스타그램 링크
  imageSrc: string; // 프로필 이미지 경로
  services: ServiceItem[]; // 제공 서비스 목록
  instagramHandle: string; // 인스타그램 핸들(@포함)
  reviews: ReviewItem[]; // 후기 목록
  options?: ProfileOptions; // UI 커스터마이징 옵션
};


