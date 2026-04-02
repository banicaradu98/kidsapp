import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ListingCard, { type Listing } from "@/app/components/ListingCard";
import SignOutButton from "./SignOutButton";
import AvatarUpload from "./AvatarUpload";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ro-RO", { month: "long", year: "numeric" });
}

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

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <a
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors text-gray-600 text-lg shrink-0"
            aria-label="Înapoi"
          >
            ←
          </a>
          <a href="/" className="flex items-center gap-1.5 shrink-0">
            <span className="text-xl">🧡</span>
            <span className="text-lg font-black text-[#ff5a2e]">KidsApp</span>
          </a>
          <span className="text-gray-300 hidden sm:block">|</span>
          <span className="text-base font-bold text-gray-600 hidden sm:block">Contul meu</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">

        {/* ── PROFIL ── */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
          <AvatarUpload
            userId={user.id}
            initialAvatarUrl={user.user_metadata?.avatar_url ?? null}
            initials={initials}
          />
          <div className="min-w-0">
            <h1 className="text-xl font-black text-[#1a1a2e] leading-tight truncate">{displayName}</h1>
            <p className="text-sm text-gray-400 font-medium mt-0.5 truncate">{user.email}</p>
            <div className="flex items-center gap-3 mt-2 text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1">
                <span className="text-red-400">❤️</span> {totalFavorites} favorite
              </span>
              <span className="text-gray-200">·</span>
              <span className="flex items-center gap-1">
                <span className="text-yellow-400">⭐</span> {reviews.length} recenzii
              </span>
            </div>
          </div>
        </section>

        {/* ── FAVORITE ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-[#1a1a2e]">❤️ Locații favorite</h2>
            {totalFavorites > 0 && (
              <a
                href="/favorite"
                className="text-sm font-bold text-[#ff5a2e] hover:underline"
              >
                Vezi toate ({totalFavorites}) →
              </a>
            )}
          </div>

          {favListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <p className="text-3xl mb-3">🤍</p>
              <p className="font-bold text-gray-600 mb-1">Nicio locație salvată</p>
              <p className="text-sm text-gray-400 font-medium mb-4">
                Explorează și apasă ❤️ pe locurile care îți plac
              </p>
              <a
                href="/"
                className="inline-block bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                Explorează locuri
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {favListings.map((listing) => (
                <div key={listing.id} className="relative">
                  <ListingCard listing={listing} />
                </div>
              ))}
              {totalFavorites > 3 && (
                <a
                  href="/favorite"
                  className="block text-center bg-orange-50 hover:bg-orange-100 text-[#ff5a2e] font-black text-sm py-4 rounded-2xl transition-colors"
                >
                  Vezi toate {totalFavorites} locațiile favorite →
                </a>
              )}
            </div>
          )}
        </section>

        {/* ── REVIEWS ── */}
        <section>
          <h2 className="text-lg font-black text-[#1a1a2e] mb-4">⭐ Review-urile mele</h2>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <p className="text-3xl mb-3">⭐</p>
              <p className="font-bold text-gray-600 mb-1">Nu ai lăsat niciun review</p>
              <p className="text-sm text-gray-400 font-medium">
                Vizitează o locație și împărtășește experiența ta cu alți părinți.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {reviews.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      {r.listings ? (
                        <a
                          href={`/listing/${r.listings.id}`}
                          className="font-black text-[#1a1a2e] text-base hover:text-[#ff5a2e] transition-colors leading-snug"
                        >
                          {r.listings.name}
                        </a>
                      ) : (
                        <p className="font-black text-gray-400 text-base">Locație ștearsă</p>
                      )}
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{formatDate(r.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span key={n} className={n <= r.rating ? "text-yellow-400" : "text-gray-200"}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {r.text && (
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">{r.text}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── DECONECTARE ── */}
        <section className="pb-8">
          <SignOutButton />
        </section>

      </main>
    </div>
  );
}
