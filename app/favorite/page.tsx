import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ListingCard, { type Listing } from "@/app/components/ListingCard";
import CategoryShell from "@/app/components/CategoryShell";

export default async function FavoritePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: favorites } = await supabase
    .from("user_favorites")
    .select("listing_id, listings(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listings = ((favorites ?? []).map((f: any) => f.listings).filter(Boolean)) as Listing[];

  return (
    <CategoryShell
      title="Favorite"
      subtitle="Locurile tale salvate din Sibiu"
      emoji="❤️"
      count={listings.length}
    >
      {listings.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🤍</div>
          <p className="text-gray-700 font-black text-xl mb-1">Nicio locație salvată</p>
          <p className="text-gray-400 font-medium mt-1 mb-6">
            Explorează și apasă ❤️ pe locurile care îți plac
          </p>
          <a
            href="/"
            className="inline-block bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black px-6 py-3 rounded-xl transition-colors"
          >
            Explorează locuri
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {listings.map((listing) => (
            <div key={listing.id} className="relative">
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      )}
    </CategoryShell>
  );
}
