import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import CategoryShell from "@/app/components/CategoryShell";
import FilteredSport from "./FilteredSport";
import { getListingBadges } from "@/utils/getListingBadges";

export const metadata = {
  title: "Sport pentru Copii în Sibiu",
  description: "Fotbal, înot, tenis, gimnastică, arte marțiale și alte activități sportive pentru copii din Sibiu. Înscrie-ți copilul la sport.",
  alternates: { canonical: "/sport" },
  openGraph: { title: "Sport pentru Copii în Sibiu — KidsApp", description: "Fotbal, înot, tenis, gimnastică și sport pentru copii în Sibiu.", url: "/sport" },
};

export default async function SportPage() {
  const supabase = createClient(await cookies());
  const { data: listings } = await supabase
    .from("listings")
    .select("id, name, category, subcategory, description, address, price, age_min, age_max, schedule, is_verified, images")
    .eq("category", "sport")
    .order("is_featured", { ascending: false })
    .order("name");

  const raw = listings ?? [];
  const badges = await getListingBadges(raw.map((l) => l.id));
  const items = raw.map((l) => ({ ...l, hot_badge: badges[l.id] ?? null }));

  return (
    <CategoryShell
      title="Sport"
      subtitle="Activități sportive și cluburi pentru copii din Sibiu"
      emoji="⚽"
      count={items.length}
    >
      <FilteredSport listings={items} />
    </CategoryShell>
  );
}
