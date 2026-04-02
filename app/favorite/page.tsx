import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ListingCard, { type Listing, CATEGORY_META } from "@/app/components/ListingCard";
import CategoryShell from "@/app/components/CategoryShell";

const CATEGORY_ORDER = ["loc-de-joaca", "educatie", "curs-atelier", "sport", "spectacol", "eveniment"];

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

  // Group by category, preserving saved order within each group
  const grouped = listings.reduce<Record<string, Listing[]>>((acc, listing) => {
    const cat = listing.category ?? "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(listing);
    return acc;
  }, {});

  const activeCategories = CATEGORY_ORDER.filter((cat) => (grouped[cat]?.length ?? 0) > 0);

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
          <p className="text-gray-700 font-black text-xl mb-1">Nu ai salvat nimic încă</p>
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
        <div className="flex flex-col gap-8">
          {activeCategories.map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <section key={cat}>
                <h2 className="text-base font-black text-[#1a1a2e] mb-3 flex items-center gap-2">
                  <span>{meta.emoji}</span>
                  <span>{meta.label}</span>
                  <span className="text-sm font-bold text-gray-400">({grouped[cat].length})</span>
                </h2>
                <div className="flex flex-col gap-4">
                  {grouped[cat].map((listing) => (
                    <div key={listing.id} className="relative">
                      <ListingCard listing={listing} />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </CategoryShell>
  );
}
