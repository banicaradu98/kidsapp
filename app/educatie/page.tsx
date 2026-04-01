import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import CategoryShell from "@/app/components/CategoryShell";
import FilteredEducatie from "./FilteredEducatie";

export const metadata = { title: "Educație pentru Copii în Sibiu — KidsApp" };

export default async function EducatiePage() {
  const supabase = createClient(await cookies());
  const { data: listings } = await supabase
    .from("listings")
    .select("id, name, category, subcategory, description, address, price, age_min, age_max, schedule, is_verified")
    .eq("category", "educatie")
    .order("is_verified", { ascending: false })
    .order("name");

  const items = listings ?? [];

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
