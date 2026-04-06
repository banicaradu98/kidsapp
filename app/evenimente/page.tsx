import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import CategoryShell from "@/app/components/CategoryShell";
import SectionedEvenimente from "./SectionedEvenimente";

export const metadata = {
  title: "Evenimente pentru Copii în Sibiu",
  description: "Evenimente, festivaluri și activități de weekend pentru copii și familii din Sibiu. Descoperă ce se întâmplă în Sibiu această săptămână.",
  alternates: { canonical: "/evenimente" },
  openGraph: { title: "Evenimente pentru Copii în Sibiu — KidsApp", description: "Evenimente, festivaluri și activități de weekend pentru familii din Sibiu.", url: "/evenimente" },
};

export default async function EvenimentePage() {
  const supabase = createClient(await cookies());
  const { data: listings } = await supabase
    .from("listings")
    .select("id, name, category, description, address, price, age_min, age_max, schedule, is_verified, images")
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
