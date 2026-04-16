import type { ProfileOptions, ServiceItem, ReviewItem } from "@/data/mockData";

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
    username: "sample",
    name: "뀨 PT",
    brandName: "Sample gym",
    role: "체형교정 · 다이어트 · 1:1 PT",
    intro: "✔ 체형교정 + 다이어트 전문 \n✔ 초보자도 부담 없이 시작 가능",
    location: "서울 성수동 샘플빌딩 Sample gym",
    availability: "평일 06:00 ~ 22:00",
    ctaLabel: "무료 상담 받기 (카카오톡)",
    instagramUrl: "https://instagram.com/kku._.ui",
    kakaoUrl: "https://open.kakao.com/o/sample",
    imageSrc:
      "https://res.cloudinary.com/diicetn0t/image/upload/v1776168782/pt_trainer_bchy7b.png",
    services: [
      { name: "PT 1회", price: "50,000원" },
      { name: "PT 10회", price: "450,000원" },
    ],
    reviews: [
      {
        author: "30대 여성 회원",
        content:
          "운동이 처음이었는데 자세를 정말 꼼꼼하게 봐주셔서 부담 없이 시작할 수 있었어요.",
      },
      {
        author: "직장인 회원",
        content:
          "퇴근 후에도 일정 조율이 편했고, 짧은 기간에도 몸이 가벼워진 게 느껴졌습니다.",
      },
    ],
    instagramHandle: "@kku._.ui",
    options: {
      showReviews: true,
      showLocation: true,
      theme: "light",
      highlightColor: "#FEE500",
      showEditableFrame: true, // sample만 true, 다른 페이지는 사용 안함
      serviceFooterLabel: "VAT포함",
    },
  },
  {
    username: "sample2",
    name: "큐 쌤",
    brandName: "Q Pilates Center",
    role: "1:1필라테스수업 · 다이어트 · 자세교정",
    intro:
      "전문 필라테스 수업을 통한 자세 교정 및 신체능력 강화\n 성인 맞춤 교육",
    location: "서울 목2동 00필라테스센터",
    availability: "15:00~22:00",
    ctaLabel: "무료 상담 가능(카카오톡 오픈채팅)",
    instagramUrl: "https://instagram.com/kku._.ui",
    kakaoUrl: "https://open.kakao.com/o/sample2",
    imageSrc:
      "https://res.cloudinary.com/diicetn0t/image/upload/v1776169513/Pilates_woman_ayigqf.png",
    services: [
      { name: "한달 - 10회", price: "50,000원", vat: true },
      { name: "일일체험", price: "10,000원", vat: true },
    ],
    reviews: [
      {
        author: "직장인 회원",
        content:
          "퇴근 후에도 일정 조율이 편했고, 짧은 기간에도 몸이 가벼워진 게 느껴졌습니다.",
      },
    ],
    instagramHandle: "@kku._.ui",
    options: {
      showReviews: true,
      showEditableFrame: false, // sample2 등은 항상 false
      serviceFooterLabel: "VAT포함",
      theme: "dark",
      highlightColor: "#FEE500",
    },
  },
  {
    username: "sample3",
    name: "큐 쌤",
    brandName: "Q Pilates Center",
    role: "1:1필라테스수업 · 다이어트 · 자세교정",
    intro:
      "전문 필라테스 수업을 통한 자세 교정 및 신체능력 강화\n 성인 맞춤 교육",
    location: "서울 목2동 00필라테스센터",
    availability: "15:00~22:00",
    ctaLabel: "무료 상담 가능(카카오톡 오픈채팅)",
    instagramUrl: "https://instagram.com/kku._.ui",
    kakaoUrl: "https://open.kakao.com/o/sample2",
    imageSrc:
      "https://res.cloudinary.com/diicetn0t/image/upload/v1776169513/Pilates_woman_ayigqf.png",
    services: [
      { name: "한달 - 10회", price: "50,000원", vat: true },
      { name: "일일체험", price: "10,000원", vat: true },
    ],
    reviews: [
      {
        author: "직장인 회원",
        content:
          "퇴근 후에도 일정 조율이 편했고, 짧은 기간에도 몸이 가벼워진 게 느껴졌습니다.",
      },
    ],
    instagramHandle: "@kku._.ui",
    options: {
      showReviews: true,
      showEditableFrame: false, // sample2 등은 항상 false
      serviceFooterLabel: "VAT포함",
      theme: "softsage",
      highlightColor: "#FEE500",
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
];
