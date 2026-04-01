import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import CategoryShell from "@/app/components/CategoryShell";
import FilteredSpectacole from "./FilteredSpectacole";

export const metadata = { title: "Spectacole pentru Copii în Sibiu — KidsApp" };

export default async function SpectacolePage() {
  const supabase = createClient(await cookies());
  const { data: listings } = await supabase
    .from("listings")
    .select("id, name, category, description, address, price, age_min, age_max, schedule, is_verified, images, event_date")
    .eq("category", "spectacol")
    .order("event_date", { ascending: true, nullsFirst: false });

  const items = listings ?? [];

  return (
    <CategoryShell
      title="Spectacole"
      subtitle="Spectacole de teatru, muzică și animație pentru copii din Sibiu"
      emoji="🎭"
      count={items.length}
    >
      <FilteredSpectacole listings={items} />
    </CategoryShell>
  );
}
