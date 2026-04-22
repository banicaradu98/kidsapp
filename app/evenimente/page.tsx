import { adminClient } from "@/utils/supabase/admin";
import CategoryShell from "@/app/components/CategoryShell";
import FilteredEvenimente from "./FilteredEvenimente";

export const metadata = {
  title: "Evenimente pentru Copii în Sibiu",
  description: "Evenimente, festivaluri și activități de weekend pentru copii și familii din Sibiu. Descoperă ce se întâmplă în Sibiu această săptămână.",
  alternates: { canonical: "/evenimente" },
  openGraph: { title: "Evenimente pentru Copii în Sibiu — KidsApp", description: "Evenimente, festivaluri și activități de weekend pentru familii din Sibiu.", url: "/evenimente" },
};

export default async function EvenimentePage() {
  const { data: listings } = await adminClient
    .from("listings")
    .select("id, name, category, description, address, price, age_min, age_max, schedule, is_verified, images, event_date, event_end_date, start_time")
    .eq("category", "eveniment")
    .order("event_date", { ascending: true, nullsFirst: false });

  const items = listings ?? [];

  return (
    <CategoryShell
      title="Evenimente"
      subtitle="Evenimente și activități de weekend pentru familii în Sibiu"
      emoji="🎉"
      count={items.length}
    >
      <FilteredEvenimente listings={items} />
    </CategoryShell>
  );
}
