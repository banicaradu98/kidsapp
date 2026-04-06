import { adminClient } from "@/utils/supabase/admin";

export const BADGE_META: Record<string, { label: string; emoji: string; bg: string; text: string }> = {
  reducere:   { label: "Reducere",   emoji: "🔥", bg: "bg-red-100",   text: "text-red-700"   },
  grupa_noua: { label: "Grupă nouă", emoji: "👥", bg: "bg-green-100", text: "text-green-700" },
};

export type ListingBadge = { type: string; label: string; emoji: string; bg: string; text: string };

/**
 * Returns a map of listing_id → badge for active 'reducere' / 'grupa_noua' updates.
 * Uses adminClient since there may not be a public RLS SELECT policy yet.
 */
export async function getListingBadges(
  listingIds: string[]
): Promise<Record<string, ListingBadge>> {
  if (listingIds.length === 0) return {};

  const now = new Date().toISOString();
  const { data } = await adminClient
    .from("listing_updates")
    .select("listing_id, type")
    .in("listing_id", listingIds)
    .in("type", ["reducere", "grupa_noua"])
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order("created_at", { ascending: false });

  const map: Record<string, ListingBadge> = {};
  for (const row of data ?? []) {
    if (!map[row.listing_id] && BADGE_META[row.type]) {
      map[row.listing_id] = { type: row.type, ...BADGE_META[row.type] };
    }
  }
  return map;
}
