import { MetadataRoute } from "next";
import { adminClient } from "@/utils/supabase/admin";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kidsapp.ro";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all public verified listings
  const { data: listings } = await adminClient
    .from("listings")
    .select("id, created_at, updated_at")
    .eq("is_verified", true);

  const listingUrls: MetadataRoute.Sitemap = (listings ?? []).map((l) => ({
    url: `${siteUrl}/listing/${l.id}`,
    lastModified: new Date(l.updated_at ?? l.created_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const now = new Date();

  return [
    // Homepage
    { url: siteUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },

    // Category pages
    { url: `${siteUrl}/locuri-de-joaca`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/educatie`,        lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/cursuri-ateliere`,lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/sport`,           lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/spectacole`,      lastModified: now, changeFrequency: "daily",  priority: 0.9 },
    { url: `${siteUrl}/evenimente`,      lastModified: now, changeFrequency: "daily",  priority: 0.9 },

    // Other static pages
    { url: `${siteUrl}/calendar`,            lastModified: now, changeFrequency: "daily",  priority: 0.8 },
    { url: `${siteUrl}/adauga-locatia-ta`,   lastModified: now, changeFrequency: "monthly",priority: 0.6 },

    // Individual listing pages
    ...listingUrls,
  ];
}
