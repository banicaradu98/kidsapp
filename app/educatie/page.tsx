import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import CategoryShell from "@/app/components/CategoryShell";
import FilteredEducatie from "./FilteredEducatie";
import { getListingBadges } from "@/utils/getListingBadges";

export const metadata = {
  title: "Grădinițe și Educație în Sibiu",
  description: "Grădinițe, after-school, creșe și centre educaționale pentru copii din Sibiu. Găsește locul potrivit pentru copilul tău.",
  alternates: { canonical: "/educatie" },
  openGraph: { title: "Grădinițe și Educație în Sibiu — KidsApp", description: "Grădinițe, after-school, creșe și centre educaționale în Sibiu.", url: "/educatie" },
};

export default async function EducatiePage() {
  const supabase = createClient(await cookies());
  const { data: listings } = await supabase
    .from("listings")
    .select("id, name, category, subcategory, description, address, price, age_min, age_max, schedule, is_verified, images")
    .eq("category", "educatie")
    .order("is_verified", { ascending: false })
    .order("name");

  const raw = listings ?? [];
  const badges = await getListingBadges(raw.map((l) => l.id));
  const items = raw.map((l) => ({ ...l, hot_badge: badges[l.id] ?? null }));

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
