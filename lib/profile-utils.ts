import type { BusinessHours } from "@/lib/types";

export function toInstagramUrl(instagramId: string): string {
  return `https://instagram.com/${instagramId.replace(/^@/, "").trim()}`;
}

export function normalizeExternalHref(raw?: string | null): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export function trackClick(
  profileId: string,
  linkType: "kakao" | "instagram" | "phone",
): void {
  if (!profileId) return;
  fetch("/api/track/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileId, linkType }),
  }).catch(() => {});
}

export function getAutoTextColor(hex: string): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "#ffffff";
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const lin = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return luminance > 0.179 ? "#111827" : "#ffffff";
}

export const DAYS_KR = [
  { key: "mon", short: "월" },
  { key: "tue", short: "화" },
  { key: "wed", short: "수" },
  { key: "thu", short: "목" },
  { key: "fri", short: "금" },
  { key: "sat", short: "토" },
  { key: "sun", short: "일" },
] as const;

export function groupBusinessHours(bh: BusinessHours): { days: string; hours: string }[] {
  const result: { days: string; hours: string }[] = [];
  let i = 0;
  while (i < DAYS_KR.length) {
    const h = bh[DAYS_KR[i].key as keyof BusinessHours];
    if (!h?.trim()) { i++; continue; }
    let j = i + 1;
    while (j < DAYS_KR.length && bh[DAYS_KR[j].key as keyof BusinessHours] === h) j++;
    const dayStr =
      j - i === 1
        ? DAYS_KR[i].short
        : `${DAYS_KR[i].short}~${DAYS_KR[j - 1].short}`;
    result.push({ days: dayStr, hours: h! });
    i = j;
  }
  return result;
}

export function formatReviewDate(d: string): string {
  const [y, m] = d.split("-");
  if (!y || !m) return d;
  return `${y}년 ${parseInt(m)}월`;
}
