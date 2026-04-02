import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import ListingEditor from "./ListingEditor";
import EventsManager from "./EventsManager";
import ReviewsPanel from "./ReviewsPanel";
import StatsPanel from "./StatsPanel";

export default async function DashboardPage() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/?login=1");

  // Check approved claim
  const { data: claim } = await supabase
    .from("claims")
    .select("listing_id")
    .eq("user_id", user.id)
    .eq("status", "approved")
    .maybeSingle();

  if (!claim) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <p className="text-5xl mb-5">🔒</p>
          <h1 className="text-2xl font-black text-[#1a1a2e] mb-3">Nu ai nicio locație revendicată</h1>
          <p className="text-gray-500 font-medium mb-6 leading-relaxed">
            Găsește locația ta pe KidsApp și apasă &bdquo;Revendică pagina&rdquo; pentru a obține acces la dashboard.
          </p>
          <a href="/" className="inline-block bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black px-6 py-3 rounded-xl transition-colors">
            Caută locația mea →
          </a>
        </div>
      </div>
    );
  }

  // Fetch listing
  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", claim.listing_id)
    .single();

  if (!listing) redirect("/");

  // Fetch upcoming events
  const { data: events } = await supabase
    .from("organizer_events")
    .select("*")
    .eq("listing_id", claim.listing_id)
    .order("event_date", { ascending: true });

  // Fetch reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, text, created_at, user_name, review_replies(id, text, created_at)")
    .eq("listing_id", claim.listing_id)
    .order("created_at", { ascending: false });

  // Stats: total views + last 30 days
  const { count: totalViews } = await supabase
    .from("listing_views")
    .select("id", { count: "exact", head: true })
    .eq("listing_id", claim.listing_id);

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: recentViews } = await supabase
    .from("listing_views")
    .select("viewed_at")
    .eq("listing_id", claim.listing_id)
    .gte("viewed_at", thirtyDaysAgo);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reviewList = (reviews ?? []) as any[];
  const avgRating = reviewList.length > 0
    ? reviewList.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / reviewList.length
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#1a1a2e]">Dashboard organizator</h1>
            <p className="text-sm text-gray-400 font-medium mt-0.5">{listing.name}</p>
          </div>
          <a
            href={`/listing/${listing.id}`}
            target="_blank"
            className="text-sm font-bold text-[#ff5a2e] hover:underline"
          >
            Vezi pagina publică →
          </a>
        </div>

        <StatsPanel
          totalViews={totalViews ?? 0}
          recentViews={recentViews ?? []}
          reviewCount={reviewList.length}
          avgRating={avgRating}
        />

        <ListingEditor listing={listing} />

        <EventsManager listingId={listing.id} initialEvents={events ?? []} />

        <ReviewsPanel reviews={reviewList} listingId={listing.id} organizerId={user.id} />

      </main>
    </div>
  );
}
