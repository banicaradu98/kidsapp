import { adminClient } from "@/utils/supabase/admin";

export interface DynamicBadge {
  type: "trending" | "new" | "top_rated" | "claimed";
  emoji: string;
  label: string;
  bg: string;
  text: string;
}

const BADGE_DEFS: Record<DynamicBadge["type"], Omit<DynamicBadge, "type">> = {
  trending:  { emoji: "🔥", label: "Trending",            bg: "bg-red-100",    text: "text-red-700"    },
  new:       { emoji: "🆕", label: "Nou pe platformă",    bg: "bg-sky-100",    text: "text-sky-700"    },
  top_rated: { emoji: "⭐", label: "Top cotat",            bg: "bg-yellow-100", text: "text-yellow-700" },
  claimed:   { emoji: "✅", label: "Verificat de proprietar", bg: "bg-green-100", text: "text-green-700" },
};

interface ListingMeta {
  id: string;
  created_at?: string | null;
  claimed_by?: string | null;
}

/**
 * Compute auto-generated dynamic badges for a set of listings.
 * Priority order per card: trending > top_rated > new (claimed is shown separately on listing page)
 * Returns a map of listing_id → single highest-priority badge (for cards)
 * and listing_id → all badges (for listing page)
 */
export async function getDynamicBadges(listings: ListingMeta[]): Promise<{
  cardBadge: Record<string, DynamicBadge | null>;
  allBadges: Record<string, DynamicBadge[]>;
}> {
  if (listings.length === 0) return { cardBadge: {}, allBadges: {} };

  const ids = listings.map((l) => l.id);
  const now = new Date();

  // 1. Trending: top 10 by view count in last 7 days
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: trendingData } = await adminClient
    .from("listing_views")
    .select("listing_id")
    .in("listing_id", ids)
    .gte("viewed_at", sevenDaysAgo);

  const viewCounts: Record<string, number> = {};
  for (const row of trendingData ?? []) {
    viewCounts[row.listing_id] = (viewCounts[row.listing_id] ?? 0) + 1;
  }
  const topIds = new Set(
    Object.entries(viewCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id]) => id)
  );

  // 2. Top rated: avg >= 4.5 with >= 3 reviews
  const { data: reviewData } = await adminClient
    .from("reviews")
    .select("listing_id, rating")
    .in("listing_id", ids);

  const reviewMap: Record<string, number[]> = {};
  for (const row of reviewData ?? []) {
    if (!reviewMap[row.listing_id]) reviewMap[row.listing_id] = [];
    reviewMap[row.listing_id].push(row.rating);
  }
  const topRatedIds = new Set(
    ids.filter((id) => {
      const ratings = reviewMap[id] ?? [];
      if (ratings.length < 3) return false;
      const avg = ratings.reduce((s, r) => s + r, 0) / ratings.length;
      return avg >= 4.5;
    })
  );

  // 3. New: created_at within last 30 days (from listing metadata passed in)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const newIds = new Set(
    listings
      .filter((l) => l.created_at && new Date(l.created_at) > thirtyDaysAgo)
      .map((l) => l.id)
  );

  // 4. Claimed: claimed_by IS NOT NULL (from listing metadata)
  const claimedIds = new Set(
    listings.filter((l) => l.claimed_by != null).map((l) => l.id)
  );

  const cardBadge: Record<string, DynamicBadge | null> = {};
  const allBadges: Record<string, DynamicBadge[]> = {};

  for (const id of ids) {
    const badges: DynamicBadge[] = [];
    if (topIds.has(id))      badges.push({ type: "trending",  ...BADGE_DEFS.trending  });
    if (topRatedIds.has(id)) badges.push({ type: "top_rated", ...BADGE_DEFS.top_rated });
    if (newIds.has(id))      badges.push({ type: "new",       ...BADGE_DEFS.new       });
    if (claimedIds.has(id))  badges.push({ type: "claimed",   ...BADGE_DEFS.claimed   });

    allBadges[id] = badges;
    // Card badge: first non-claimed badge (trending > top_rated > new)
    cardBadge[id] = badges.find((b) => b.type !== "claimed") ?? null;
  }

  return { cardBadge, allBadges };
}
