import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

type SitemapProfile = {
  slug: string;
  created_at: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://instalink.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return staticRoutes;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: profiles } = await supabase
    .from("profiles")
    .select("slug, created_at")
    .eq("is_active", true);

  return [
    ...staticRoutes,
    ...((profiles as SitemapProfile[] | null) ?? []).map((profile) => ({
      url: `${SITE}/${profile.slug}`,
      lastModified: new Date(profile.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
