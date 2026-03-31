import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import CategoryShell from "@/app/components/CategoryShell";
import FilteredCursuri from "./FilteredCursuri";

export const metadata = { title: "Cursuri & Ateliere pentru Copii în Sibiu — KidsApp" };

export default async function CursuriAtelierePage() {
  const supabase = createClient(await cookies());
  const { data: listings } = await supabase
    .from("listings")
    .select("id, name, category, description, address, price, age_min, age_max, schedule, is_verified")
    .in("category", ["curs", "atelier", "sport", "limbi-straine"])
    .order("is_featured", { ascending: false })
    .order("name");

  const items = listings ?? [];

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
