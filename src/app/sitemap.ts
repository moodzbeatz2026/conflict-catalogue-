import type { MetadataRoute } from "next";
import { createServerClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient();

  const { data: incidents } = await supabase
    .from("incidents")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("date", { ascending: false });

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://conflict-catalogue.vercel.app";

  const incidentEntries: MetadataRoute.Sitemap = (incidents || []).map(
    (incident) => ({
      url: `${baseUrl}/incidents/${incident.slug}`,
      lastModified: new Date(incident.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/timeline`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...incidentEntries,
  ];
}
