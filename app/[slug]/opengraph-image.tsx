import { ImageResponse } from "next/og";
import { getSupabaseServerClient } from "@/lib/supabase";

export const runtime = "edge";
export const alt = "InstaLink 프로필";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const THEME_COLORS: Record<string, { bg: string; fg: string; accent: string; card: string }> = {
  light:       { bg: "#f5f5f5", fg: "#111827", accent: "#111827", card: "#ffffff" },
  dark:        { bg: "#121212", fg: "#f3f4f6", accent: "#f3f4f6", card: "#1e1e1e" },
  ucc:         { bg: "#0d0221", fg: "#f8f7ff", accent: "#ffd60a", card: "#15082e" },
  softsage:    { bg: "#edf4ef", fg: "#23352d", accent: "#6f9680", card: "#f8fcf9" },
  warmlinen:   { bg: "#f2e7d8", fg: "#3a2c22", accent: "#b58458", card: "#fff9f0" },
  energysteel: { bg: "#111b31", fg: "#e2e8f0", accent: "#a3e635", card: "#1e2941" },
};

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const supabase = await getSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, shop_name, tagline, image_url, theme")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  const c = THEME_COLORS[profile?.theme ?? "light"] ?? THEME_COLORS.light;
  const name = profile?.name ?? slug;
  const shopName = profile?.shop_name ?? "InstaLink";
  const tagline = profile?.tagline ?? "인스타 프로필 링크 페이지";

  return new ImageResponse(
    <div
      style={{
        width: "100%", height: "100%",
        backgroundColor: c.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "60px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: c.card,
          borderRadius: "24px",
          padding: "56px 64px",
          display: "flex",
          alignItems: "center",
          gap: "48px",
          width: "100%",
          boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        }}
      >
        {/* 프로필 이미지 */}
        {profile?.image_url ? (
          <img
            src={profile.image_url}
            alt="사무실 책상위에 바이오링크 관련된 요소모음"
            style={{ width: 160, height: 160, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
          />
        ) : (
          <div style={{
            width: 160, height: 160, borderRadius: "50%", flexShrink: 0,
            backgroundColor: c.accent + "22",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 64, color: c.accent,
          }}>
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* 텍스트 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
          <div style={{
            fontSize: 18, fontWeight: 600, color: c.accent,
            backgroundColor: c.accent + "18",
            padding: "4px 16px", borderRadius: "999px", alignSelf: "flex-start",
          }}>
            {shopName}
          </div>
          <div style={{ fontSize: 52, fontWeight: 700, color: c.fg, lineHeight: 1.1 }}>
            {name}
          </div>
          <div style={{ fontSize: 26, color: c.fg, opacity: 0.6 }}>
            {tagline}
          </div>
        </div>

        {/* InstaLink 워터마크 */}
        <div style={{
          position: "absolute", bottom: 36, right: 60,
          fontSize: 16, color: c.fg, opacity: 0.3, fontWeight: 600,
        }}>
          InstaLink
        </div>
      </div>
    </div>,
    { ...size },
  );
}
