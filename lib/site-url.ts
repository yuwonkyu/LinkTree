const DEFAULT_SITE_URL = "https://instalink.vercel.app";

function normalizeRawSiteUrl(raw: string | undefined): string {
  if (!raw) {
    return DEFAULT_SITE_URL;
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return DEFAULT_SITE_URL;
  }

  // Some deployments accidentally store "KEY=value" as the env value.
  const normalized = trimmed.replace(/^NEXT_PUBLIC_SITE_URL=/i, "");

  return normalized || DEFAULT_SITE_URL;
}

export function getSiteUrl(): string {
  const normalized = normalizeRawSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

  try {
    return new URL(normalized).origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}
