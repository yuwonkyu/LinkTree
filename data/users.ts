// ── 로컬 폴백 전용 타입 (Supabase 미연결 시 사용) ──────────────────
export type ServiceItem = {
  name: string;
  price: string;
  note?: string;
};

export type ReviewItem = {
  author: string;
  content: string;
};

export type ProfileOptions = {
  showReviews?: boolean;
  showServices?: boolean;
  showCTA?: boolean;
  showInstagram?: boolean;
  showExternalLinks?: boolean;
  showLocation?: boolean;
  theme?: "light" | "dark" | "ucc" | "softsage" | "warmlinen" | "energysteel";
  highlightColor?: string;
  showEditableFrame?: boolean;
  serviceFooterLabel?: string | false;
};
// ──────────────────────────────────────────────────────────────────

export type User = {
  username: string;
  name: string;
  brandName: string;
  role: string;
  intro: string;
  location: string;
  availability: string;
  ctaLabel: string;
  instagramUrl: string;
  instagramUrls?: string[];
  links?: Array<{ label: string; url: string }>;
  kakaoUrl?: string;
  imageSrc: string;
  ogImageSrc?: string;
  services: ServiceItem[];
  reviews: ReviewItem[];
  instagramHandle: string;
  options?: ProfileOptions;
};

// ProfileOptions 기본값
export const defaultOptions: ProfileOptions = {
  showReviews: true,
  showServices: true,
  showCTA: true,
  showInstagram: true,
  showExternalLinks: true,
  showLocation: true,
  theme: "light",
  highlightColor: "#FEE500",
  showEditableFrame: true,
  serviceFooterLabel: false,
};

// user.options와 defaultOptions를 병합
export function getProfileOptions(user: User): ProfileOptions {
  return { ...defaultOptions, ...user.options };
}

export function getUserByUsername(username: string): User | undefined {
  return users.find((user) => user.username === username);
}

export const users: User[] = [
  {
    // ── 라이트 테마 예시: 여성 PT 트레이너 ──────────────────────────
    username: "sample",
    name: "김지수 트레이너",
    brandName: "FIT WITH JI",
    role: "다이어트 · 체형교정 · 여성 전문 PT",
    intro:
      "✔ 여성 특화 1:1 퍼스널 트레이닝\n✔ 식단 + 운동 통합 관리\n✔ 수강생 누적 200명+ · 재등록률 90%",
    location: "서울 서초구 방배동 FIT WITH JI",
    availability: "평일 07:00 ~ 21:00 / 토 09:00 ~ 17:00",
    ctaLabel: "무료 상담 받기 (카카오톡)",
    instagramUrl: "https://instagram.com/kku._.ui",
    kakaoUrl: "https://open.kakao.com/o/sample",
    imageSrc:
      "https://res.cloudinary.com/diicetn0t/image/upload/v1776169513/Pilates_woman_ayigqf.png",
    services: [
      { name: "체험 PT (1회)", price: "50,000원" },
      { name: "PT 10회권", price: "450,000원", note: "45,000원/회" },
      { name: "PT 20회권", price: "800,000원", note: "40,000원/회" },
      { name: "식단 관리 (1개월)", price: "150,000원", note: "PT 등록 시 50% 할인" },
    ],
    reviews: [
      {
        author: "30대 여성 직장인",
        content:
          "다른 센터에서 1년 해도 안 되던 게 3개월 만에 달라졌어요. 식단까지 꼼꼼하게 잡아주셔서 -8kg 성공했습니다.",
      },
      {
        author: "20대 여성 회원",
        content:
          "여성 전문이라 편하게 물어볼 수 있어요. 눈바디 변화가 확실하게 느껴지고 재등록은 당연한 수순이었어요.",
      },
      {
        author: "40대 여성 회원",
        content:
          "가격 대비 관리가 너무 꼼꼼해서 친구들한테 다 소문냈어요. 결과 보장받고 싶은 분께 강력 추천합니다.",
      },
    ],
    instagramHandle: "@fitwithji",
    options: {
      showReviews: true,
      showLocation: true,
      theme: "light",
      highlightColor: "#FEE500",
      showEditableFrame: true,
      serviceFooterLabel: false,
    },
  },
  {
    // ── 다크 테마 예시: 필라테스 강사 ──────────────────────────
    username: "sample2",
    name: "박서연 강사",
    brandName: "MOVE PILATES",
    role: "1:1 레슨 · 소도구 · 재활 필라테스",
    intro:
      "스트레스와 통증으로 굳어버린 몸,\n움직임에서 다시 살아납니다.\n\n✔ 재활 필라테스 & 자세교정 전문\n✔ 여성 전용 프라이빗 공간",
    location: "서울 마포구 연남동 MOVE PILATES",
    availability: "화~토 10:00 ~ 20:00 (일·월 휴무)",
    ctaLabel: "무료 상담 가능 (카카오 오픈채팅)",
    instagramUrl: "https://instagram.com/kku._.ui",
    kakaoUrl: "https://open.kakao.com/o/sample2",
    imageSrc:
      "https://res.cloudinary.com/diicetn0t/image/upload/v1776169513/Pilates_woman_ayigqf.png",
    services: [
      { name: "체험 레슨 (1회)", price: "30,000원" },
      { name: "월정기 8회", price: "220,000원", note: "27,500원/회" },
      { name: "월정기 12회", price: "300,000원", note: "25,000원/회" },
      { name: "듀엣 레슨 (2인)", price: "20,000원/인", note: "월정기 8회 기준" },
    ],
    reviews: [
      {
        author: "30대 여성 직장인",
        content:
          "6개월째 다니고 있어요. 처음엔 허리 통증 때문에 시작했는데 지금은 자세도 잡히고 코어가 생겼어요.",
      },
      {
        author: "산후 회원 (30대)",
        content:
          "출산 후 체형 회복을 위해 왔는데, 몸 상태에 맞게 프로그램을 짜주셔서 부담 없이 시작할 수 있었어요.",
      },
      {
        author: "20대 여성 회원",
        content:
          "1:1 레슨이라 집중 케어가 달라요. 자세 하나하나 봐주셔서 그룹 수업보다 효과가 두 배예요.",
      },
    ],
    instagramHandle: "@move.pilates",
    options: {
      showReviews: true,
      showLocation: true,
      showEditableFrame: false,
      serviceFooterLabel: false,
      theme: "dark",
      highlightColor: "#FEE500",
    },
  },
  {
    // ── 웜리넨 테마 예시: 헤어 디자이너 ──────────────────────────
    username: "sample3",
    name: "최지안 디자이너",
    brandName: "JIAN HAIR",
    role: "컬러 · 펌 · 케어트리트먼트 전문",
    intro:
      "자연스러운 컬러와 손상 없는 시술을 추구합니다.\n\n✔ 경력 8년 프리랜서 헤어디자이너\n✔ 오가닉 저자극 약제 사용\n✔ 시술 전 두피·모발 진단 무료 제공",
    location: "서울 마포구 합정동 (예약 후 위치 안내)",
    availability: "화~토 10:00 ~ 19:00 (일·월 휴무)",
    ctaLabel: "예약 문의 (카카오톡)",
    instagramUrl: "https://instagram.com/kku._.ui",
    kakaoUrl: "https://open.kakao.com/o/sample3",
    imageSrc:
      "https://res.cloudinary.com/diicetn0t/image/upload/v1776169513/Pilates_woman_ayigqf.png",
    services: [
      { name: "컬러 (기본)", price: "80,000원~", note: "길이·손상도에 따라 조정" },
      { name: "탈색 + 컬러", price: "150,000원~" },
      { name: "매직 · 세팅펌", price: "120,000원~" },
      { name: "케어트리트먼트", price: "50,000원", note: "시술 시 30,000원" },
    ],
    reviews: [
      {
        author: "30대 여성",
        content:
          "염색 알레르기가 있어서 늘 걱정했는데, 저자극 약제로 패치 테스트까지 꼼꼼하게 해주셨어요. 이제 여기밖에 못 가요.",
      },
      {
        author: "20대 여성",
        content:
          "인스타 사진 보고 갔는데 실물이 더 예뻐요. 원하는 색감 설명하기 어려웠는데 딱 맞게 잡아주셨어요.",
      },
      {
        author: "40대 여성",
        content:
          "탈색 후 머리가 너무 상해서 포기하고 있었는데, 케어 시술 받고 나서 완전히 다른 머리가 됐어요.",
      },
    ],
    instagramHandle: "@jian.hair",
    options: {
      showReviews: true,
      showLocation: true,
      showEditableFrame: false,
      serviceFooterLabel: false,
      theme: "warmlinen",
      highlightColor: "#b58458",
    },
  },
  {
    username: "jhj",
    name: "조형진",
    brandName: "OMGN",
    role: "Film · Brand · AD · Event · AI",
    intro: "Work that makes clients say, \u201cOh my goodness!\u201d",
    location: "제주특별자치도 제주시 구좌읍 월정1길 70-1",
    availability: "",
    ctaLabel: "",
    instagramUrl: "https://www.instagram.com/whdkd2/",
    instagramUrls: [
      "https://www.instagram.com/whdkd2/",
      "https://www.instagram.com/_studiomgn/",
      "https://www.instagram.com/yoonseul.house",
    ],
    imageSrc:
      "https://res.cloudinary.com/diicetn0t/image/upload/v1776317609/JHJ_scrgqn.png",
    ogImageSrc:
      "https://res.cloudinary.com/diicetn0t/image/upload/v1776317475/JHJ-OP_ejmccq.jpg",
    services: [],
    reviews: [
      {
        author: "30대 남자",
        content: "사람이 좋아요, 자칭 테토남",
      },
    ],
    instagramHandle: "@whdkd2",
    options: {
      theme: "warmlinen",
      showReviews: true,
      showLocation: true,
      showEditableFrame: false,
      highlightColor: "#0012ab",
      serviceFooterLabel: false,
    },
  },
  {
    username: "kku",
    name: "원뀨",
    brandName: "Kku UI Studio",
    role: "고객 문의를 만드는 1페이지 사이트 제작",
    intro: `링크트리 대신
서비스 소개 + 후기 + 문의까지 한 번에 정리되는
프로필 랜딩페이지를 제작합니다.`,
    location: "서울 양천구",
    availability: "10:00~18:00",
    ctaLabel: "무료 샘플 받아보기",
    instagramUrl: "https://www.instagram.com/kku._.ui/",
    instagramUrls: [
      "https://www.instagram.com/kku._.ui/",
      "https://www.threads.com/@kku._.ui",
    ],
    links: [
      {
        label: "샘플페이지 보러가기 (기본형)",
        url: "https://kku-ui.vercel.app/sample",
      },
      {
        label: "샘플페이지 보러가기 (다크테마)",
        url: "https://kku-ui.vercel.app/sample2",
      },
    ],
    imageSrc:
      "https://res.cloudinary.com/diicetn0t/image/upload/v1776352551/%EB%80%A8_vtat3u.png",
    ogImageSrc:
      "https://res.cloudinary.com/diicetn0t/image/upload/v1776352588/%EB%80%A83D_x4iaii.png",
    services: [
      {
        name: "브랜드 사이트(1페이지)",
        price: "50,000원",
        note: "수정 2회 / 3주 내",
      },
      {
        name: "커스텀사이트(1페이지)",
        price: "100,000원~",
        note: "추가 페이지 별도",
      },
    ],
    kakaoUrl: "https://open.kakao.com/o/sU3EIJqi",
    reviews: [],
    instagramHandle: "@kku._.ui",
    options: {
      showCTA: true,
      showReviews: true,
      showEditableFrame: false,
      serviceFooterLabel: false,
      theme: "softsage",
      highlightColor: "#FEE500",
    },
  },
  {
    // ── InstaLink 서비스 홍보 샘플 ──────────────────────────
    username: "sample4",
    name: "InstaLink",
    brandName: "InstaLink",
    role: "인스타 바이오 링크를 나만의 가게 홍보 페이지로",
    intro:
      "링크트리는 그냥 링크 목록이에요.\n\nInstaLink는 서비스 소개 + 가격표 + 포트폴리오 + 실제 후기 + 카카오 상담까지 한 페이지에 담아 팔로워를 진짜 고객으로 만드는 프로필 페이지입니다.\n\n✔ 1분 만에 개설\n✔ 카드 등록 없이 무료 시작\n✔ 소상공인 2,000명+ 사용 중",
    location: "대한민국 어디서나 · 100% 온라인",
    availability: "365일 24시간 언제든지",
    ctaLabel: "지금 무료로 시작하기 →",
    instagramUrl: "https://instagram.com/instalink.kr",
    instagramUrls: ["https://instagram.com/instalink.kr"],
    kakaoUrl: "https://open.kakao.com/o/instalink",
    imageSrc:
      "https://res.cloudinary.com/diicetn0t/image/upload/v1776352551/%EB%80%A8_vtat3u.png",
    links: [
      {
        label: "🌟 PT 트레이너 샘플 페이지 보기",
        url: "/sample",
      },
      {
        label: "🌙 필라테스 강사 샘플 페이지 보기",
        url: "/sample2",
      },
      {
        label: "✂️ 헤어 디자이너 샘플 페이지 보기",
        url: "/sample3",
      },
    ],
    services: [
      {
        name: "Free 플랜",
        price: "₩0 / 영원히 무료",
        note: "기본 프로필 · 서비스·후기 3개 · 카카오 버튼",
      },
      {
        name: "Basic 플랜",
        price: "₩19,900 / 월",
        note: "테마 3종 · 갤러리 6장 · 서비스·후기 6개",
      },
      {
        name: "Pro 플랜",
        price: "₩29,900 / 월",
        note: "테마 6종 · 방문자 통계 · AI 문구 추천 · 모든 기능",
      },
    ],
    reviews: [
      {
        author: "박○○ PT 트레이너 · 강남",
        content:
          "링크트리는 그냥 링크 모음인데, InstaLink는 진짜 내 가게 소개 페이지예요. 고객들이 \"홈페이지 있어요?\" 하면 이거 보내줘요.",
      },
      {
        author: "이○○ 헤어 디자이너 · 홍대",
        content:
          "카카오 버튼 달고 나서 DM으로 가격 묻는 사람이 확 줄었어요. 다들 페이지 보고 바로 상담 신청해요.",
      },
      {
        author: "김○○ 필라테스 원장 · 성수",
        content:
          "설정 5분이면 끝나요. 사진 올리고 가격 입력하면 끝. 이걸 왜 이제 알았지 싶어요.",
      },
    ],
    instagramHandle: "@instalink.kr",
    options: {
      showCTA: true,
      showReviews: true,
      showLocation: true,
      showExternalLinks: true,
      showEditableFrame: false,
      serviceFooterLabel: false,
      theme: "dark",
      highlightColor: "#FFD600",
    },
  },
];
