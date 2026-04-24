import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Listing } from "@/app/components/ListingCard";
import SignOutButton from "./SignOutButton";
import Navbar from "@/app/components/Navbar";
import { getReviewLevel } from "@/utils/reviewLevel";
import ContulMeuTabs from "./ContulMeuTabs";
import ProfileCard from "./ProfileCard";
import AccountManagement from "./AccountManagement";

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
  const memberSince = new Date(user.created_at).toLocaleDateString("ro-RO", {
    month: "long",
    year: "numeric",
  });

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
        <ProfileCard
          userId={user.id}
          displayName={displayName}
          email={user.email ?? ""}
          avatarUrl={user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null}
          initials={initials}
          totalFavorites={totalFavorites}
          reviewCount={reviews.length}
          reviewLevel={reviewLevel}
          memberSince={memberSince}
        />

        {/* ── TABS: Favorite / Recenzii / Marketplace ── */}
        <ContulMeuTabs
          favListings={favListings}
          totalFavorites={totalFavorites}
          reviews={reviews}
          userId={user.id}
        />

        {/* ── DECONECTARE ── */}
        <section className="pb-2">
          <SignOutButton />
        </section>

        {/* ── GESTIONARE CONT ── */}
        <AccountManagement userId={user.id} />

      </main>
    </div>
  );
}
