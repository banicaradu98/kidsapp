import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import CategoryShell from "@/app/components/CategoryShell";
import FilteredCursuri from "./FilteredCursuri";
import { getListingBadges } from "@/utils/getListingBadges";
import { getDynamicBadges } from "@/utils/getDynamicBadges";

export const metadata = {
  title: "Cursuri și Ateliere pentru Copii în Sibiu",
  description: "Cursuri de desen, muzică, robotică, dans, limbi străine și ateliere creative pentru copii din Sibiu. Descoperă activitățile potrivite pentru copilul tău.",
  alternates: { canonical: "https://www.moosey.ro/cursuri-ateliere" },
  openGraph: { title: "Cursuri și Ateliere pentru Copii în Sibiu — Moosey", description: "Desen, muzică, robotică, dans și ateliere creative pentru copii în Sibiu.", url: "/cursuri-ateliere" },
};

export default async function CursuriAtelierePage() {
  const supabase = createClient(await cookies());
  const { data: listings } = await supabase
    .from("listings")
    .select("id, name, category, subcategory, description, address, price, age_min, age_max, schedule, is_verified, images, created_at, claimed_by")
    .eq("category", "curs-atelier")
    .eq("is_verified", true)
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
      title="Cursuri & Ateliere"
      subtitle="Activități educative și creative pentru copii din Sibiu"
      emoji="🎨"
      count={items.length}
    >
      <FilteredCursuri listings={items} />
    </CategoryShell>
  );
}
