import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import CategoryShell from "@/app/components/CategoryShell";
import FilteredGradinite from "./FilteredGradinite";

export const metadata = { title: "Grădinițe în Sibiu — KidsApp" };

export default async function GradinitePage() {
  const supabase = createClient(await cookies());
  const { data: listings } = await supabase
    .from("listings")
    .select("id, name, category, description, address, price, age_min, age_max, schedule, is_verified")
    .eq("category", "gradinita")
    .order("is_verified", { ascending: false })
    .order("name");

  const items = listings ?? [];

  return (
    <CategoryShell
      title="Grădinițe"
      subtitle="Grădinițe de stat și private din Sibiu"
      emoji="🌱"
      count={items.length}
    >
      <FilteredGradinite listings={items} />
    </CategoryShell>
  );
}
