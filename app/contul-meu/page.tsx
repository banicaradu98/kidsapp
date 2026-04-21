import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Listing } from "@/app/components/ListingCard";
import SignOutButton from "./SignOutButton";
import AvatarUpload from "./AvatarUpload";
import Navbar from "@/app/components/Navbar";
import { getReviewLevel } from "@/utils/reviewLevel";
import ContulMeuTabs from "./ContulMeuTabs";

export default async function ContulMeuPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/?login=1");

  const displayName: string =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Utilizator";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // First 3 favorites
  const { data: favData } = await supabase
    .from("user_favorites")
    .select("listing_id, listings(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const favListings = ((favData ?? []).map((f: any) => f.listings).filter(Boolean)) as Listing[];

  const { data: favCountData } = await supabase
    .from("user_favorites")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);
  const totalFavorites = (favCountData as unknown as { count: number } | null)?.count ?? favListings.length;

  // Reviews with listing name
  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("id, rating, text, created_at, listing_id, listings(id, name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  type ReviewRow = {
    id: string;
    rating: number;
    text: string | null;
    created_at: string;
    listing_id: string;
    listings: { id: string; name: string } | null;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reviews = (reviewsData ?? []) as unknown as ReviewRow[];

  const reviewLevel = getReviewLevel(reviews.length);

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">

        {/* ── PROFIL ── */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
          <AvatarUpload
            userId={user.id}
            initialAvatarUrl={user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null}
            initials={initials}
          />
          <div className="min-w-0">
            <h1 className="text-xl font-black text-[#1a1a2e] leading-tight truncate">{displayName}</h1>
            <p className="text-sm text-gray-400 font-medium mt-0.5 truncate">{user.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <span className="text-red-400">❤️</span> {totalFavorites} favorite
              </span>
              <span className="text-gray-200 text-xs">·</span>
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <span className="text-yellow-400">⭐</span> {reviews.length} recenzii
              </span>
              {reviewLevel && (
                <>
                  <span className="text-gray-200 text-xs">·</span>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full ${reviewLevel.bg} ${reviewLevel.text}`}>
                    {reviewLevel.emoji} {reviewLevel.label}
                  </span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── TABS: Favorite / Recenzii / Marketplace ── */}
        <ContulMeuTabs
          favListings={favListings}
          totalFavorites={totalFavorites}
          reviews={reviews}
          userId={user.id}
        />

        {/* ── DECONECTARE ── */}
        <section className="pb-8">
          <SignOutButton />
        </section>

      </main>
    </div>
  );
}
