import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import CategoryShell from "@/app/components/CategoryShell";
import FilteredLocuri from "./FilteredLocuri";

export const metadata = { title: "Locuri de Joacă în Sibiu — KidsApp" };

export default async function LocuriDeJoacaPage() {
  const supabase = createClient(await cookies());
  const { data: listings } = await supabase
    .from("listings")
    .select("id, name, category, description, address, price, age_min, age_max, schedule, is_verified, images")
    .eq("category", "loc-de-joaca")
    .order("is_featured", { ascending: false })
    .order("name");

  const items = listings ?? [];

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
