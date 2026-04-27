import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import CategoryShell from "@/app/components/CategoryShell";
import FilteredLocuri from "./FilteredLocuri";
import { getListingBadges } from "@/utils/getListingBadges";
import { getDynamicBadges } from "@/utils/getDynamicBadges";

export const metadata = {
  title: "Locuri de Joacă în Sibiu",
  description: "Descoperă cele mai bune locuri de joacă pentru copii din Sibiu: parcuri, săli de joacă indoor, locuri de joacă în aer liber și centre de distracție.",
  alternates: { canonical: "https://www.moosey.ro/locuri-de-joaca" },
  openGraph: { title: "Locuri de Joacă în Sibiu — Moosey", description: "Parcuri, săli indoor și locuri de joacă pentru copii în Sibiu.", url: "/locuri-de-joaca" },
};

export default async function LocuriDeJoacaPage() {
  const supabase = createClient(await cookies());
  const { data: listings } = await supabase
    .from("listings")
    .select("id, name, category, description, address, price, age_min, age_max, schedule, is_verified, images, created_at, claimed_by")
    .eq("category", "loc-de-joaca")
    .order("is_featured", { ascending: false })
    .order("name");

  const raw = listings ?? [];
  const [orgBadges, { cardBadge: dynBadge }] = await Promise.all([
    getListingBadges(raw.map((l) => l.id)),
    getDynamicBadges(raw.map((l) => ({ id: l.id, created_at: l.created_at, claimed_by: l.claimed_by }))),
  ]);
  const items = raw.map((l) => ({ ...l, hot_badge: orgBadges[l.id] ?? dynBadge[l.id] ?? null }));

  return (
    <CategoryShell
      title="Locuri de Joacă"
      subtitle="Cele mai bune locuri de joacă pentru copii în Sibiu"
      emoji="🛝"
      count={items.length}
    >
      <FilteredLocuri listings={items} />
    </CategoryShell>
  );
}
