import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import CategoryShell from "@/app/components/CategoryShell";
import ListingCard from "@/app/components/ListingCard";
import EmptyState from "@/app/components/EmptyState";

export const metadata = { title: "Spectacole pentru Copii în Sibiu — KidsApp" };

export default async function SpectacolePage() {
  const supabase = createClient(await cookies());
  const { data: listings } = await supabase
    .from("listings")
    .select("id, name, category, description, address, price, age_min, age_max, schedule, is_verified, images")
    .eq("category", "spectacol")
    .order("is_featured", { ascending: false })
    .order("name");

  const items = listings ?? [];

  return (
    <CategoryShell
      title="Spectacole"
      subtitle="Spectacole de teatru, muzică și animație pentru copii din Sibiu"
      emoji="🎭"
      count={items.length}
    >
      {items.length === 0 ? (
        <EmptyState
          title="Niciun spectacol momentan"
          subtitle="Urmărește această pagină — actualizăm constant spectacolele din Sibiu."
        />
      ) : (
        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
          {items.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </CategoryShell>
  );
}
