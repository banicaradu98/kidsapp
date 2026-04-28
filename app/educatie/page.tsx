import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import CategoryShell from "@/app/components/CategoryShell";
import FilteredEducatie from "./FilteredEducatie";
import { getListingBadges } from "@/utils/getListingBadges";
import { getDynamicBadges } from "@/utils/getDynamicBadges";

export const metadata = {
  title: "Grădinițe și Educație în Sibiu",
  description: "Grădinițe, after-school, creșe și centre educaționale pentru copii din Sibiu. Găsește locul potrivit pentru copilul tău.",
  alternates: { canonical: "https://www.moosey.ro/educatie" },
  openGraph: { title: "Grădinițe și Educație în Sibiu — Moosey", description: "Grădinițe, after-school, creșe și centre educaționale în Sibiu.", url: "/educatie" },
};

export default async function EducatiePage() {
  const supabase = createClient(await cookies());
  const { data: listings } = await supabase
    .from("listings")
    .select("id, name, category, subcategory, description, address, price, age_min, age_max, schedule, is_verified, images, created_at, claimed_by")
    .eq("category", "educatie")
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
      title="Educație"
      subtitle="Grădinițe, after-school și programe educative pentru copii din Sibiu"
      emoji="🎓"
      count={items.length}
    >
      <FilteredEducatie listings={items} />
    </CategoryShell>
  );
}
