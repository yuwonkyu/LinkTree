
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
  imageSrc: string;
  services: { name: string; price: string; vat?: boolean }[];
  reviews: { author: string; content: string }[];
  instagramHandle: string;
  options?: {
    showReviews?: boolean;
    showLocation?: boolean;
    theme?: "light" | "dark";
    highlightColor?: string;
    showEditableFrame?: boolean;
    serviceFooterLabel?: string | false;
  };
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
    imageSrc: "https://res.cloudinary.com/diicetn0t/image/upload/v1776168782/pt_trainer_bchy7b.png",
    services: [
      { name: "PT 1회", price: "50,000원" },
      { name: "PT 10회", price: "450,000원" }
    ],
    reviews: [
      { author: "30대 여성 회원", content: "운동이 처음이었는데 자세를 정말 꼼꼼하게 봐주셔서 부담 없이 시작할 수 있었어요." },
      { author: "직장인 회원", content: "퇴근 후에도 일정 조율이 편했고, 짧은 기간에도 몸이 가벼워진 게 느껴졌습니다." }
    ],
    instagramHandle: "@kku._.ui",
    options: {
      showReviews: true,
      showLocation: true,
      theme: "light",
      highlightColor: "#FEE500",
      showEditableFrame: true, // sample만 true, 다른 페이지는 사용 안함
      serviceFooterLabel: false,
    },
  },
  {
    username: "sample2",
    name: "뀨뀨 필라테스 쌤",
    brandName: "Kku Pilates Center",
    role: "1:1필라테스수업 · 다이어트 · 자세교정",
    intro: "전문 필라테스 수업을 통한 자세 교정 및 신체능력 강화\n 성인 맞춤 교육",
    location: "서울 목2동 00필라테스센터",
    availability: "15:00~22:00",
    ctaLabel: "무료 상담 가능(카카오톡 오픈채팅)",
    instagramUrl: "https://instagram.com/kku._.ui",
    imageSrc: "https://res.cloudinary.com/diicetn0t/image/upload/v1776169513/Pilates_woman_ayigqf.png",
    services: [
      { name: "1달(10회)", price: "50,000원", vat: true },
      { name: "일일체험", price: "10,000원", vat: true }
    ],
    reviews: [
      { author: "직장인 회원", content: "퇴근 후에도 일정 조율이 편했고, 짧은 기간에도 몸이 가벼워진 게 느껴졌습니다." }
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
];
