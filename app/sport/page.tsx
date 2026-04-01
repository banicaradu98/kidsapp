import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import CategoryShell from "@/app/components/CategoryShell";
import FilteredSport from "./FilteredSport";

export const metadata = { title: "Sport pentru Copii în Sibiu — KidsApp" };

export default async function SportPage() {
  const supabase = createClient(await cookies());
  const { data: listings } = await supabase
    .from("listings")
    .select("id, name, category, subcategory, description, address, price, age_min, age_max, schedule, is_verified")
    .eq("category", "sport")
    .order("is_featured", { ascending: false })
    .order("name");

  const items = listings ?? [];

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
