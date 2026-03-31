import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import CategoryShell from "@/app/components/CategoryShell";
import SectionedEvenimente from "./SectionedEvenimente";

export const metadata = { title: "Evenimente pentru Copii în Sibiu — KidsApp" };

export default async function EvenimentePage() {
  const supabase = createClient(await cookies());
  const { data: listings } = await supabase
    .from("listings")
    .select("id, name, category, description, address, price, age_min, age_max, schedule, is_verified")
    .eq("category", "eveniment")
    .order("created_at", { ascending: true });

  const items = listings ?? [];

  return (
    <CategoryShell
      title="Evenimente"
      subtitle="Evenimente și activități de weekend pentru familii în Sibiu"
      emoji="🎉"
      count={items.length}
    >
      <SectionedEvenimente listings={items} />
    </CategoryShell>
  );
}
