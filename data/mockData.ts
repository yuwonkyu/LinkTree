export type ServiceItem = {
  name: string;
  price: string;
  note?: string;
  vat?: boolean;
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
  customCTA?: string;
  theme?:
    | "light"
    | "dark"
    | "ucc"
    | "softsage"
    | "warmlinen"
    | "energysteel";
  highlightColor?: string;
  showEditableFrame?: boolean;
  serviceFooterLabel?: string | false;
};

export type TrainerProfile = {
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
  services: ServiceItem[];
  instagramHandle: string;
  reviews: ReviewItem[];
  options?: ProfileOptions;
};
