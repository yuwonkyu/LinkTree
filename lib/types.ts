export type Service = {
  name: string;
  price: string;
  note?: string;
};

export type Review = {
  text: string;
  author: string;
};

export type Profile = {
  id: string;
  slug: string;
  owner_id: string;
  name: string;
  shop_name: string;
  tagline: string;
  description?: string;
  kakao_url: string;
  instagram_id: string;
  location: string;
  hours: string;
  image_url: string;
  services: Service[];
  reviews: Review[];
  is_active: boolean;
  created_at: string;
};