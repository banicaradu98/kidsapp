import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import ListingEditor from "./ListingEditor";
import EventsManager from "./EventsManager";
import EventCalendar from "./EventCalendar";
import UpdatesManager from "./UpdatesManager";
import ReviewsPanel from "./ReviewsPanel";
import StatsPanel from "./StatsPanel";
import PromoSection from "./PromoSection";
import OneTimeEventForm from "./OneTimeEventForm";
import { adminClient } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ listing?: string }>;
}) {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/?login=1");

  const params = await searchParams;

  // Use adminClient to bypass RLS — JWT propagation can be unreliable for
  // Google OAuth users on server components. We filter explicitly by user.id.
  const { data: claims } = await adminClient
    .from("claims")
    .select("listing_id, listings(id, name)")
    .eq("user_id", user.id)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (!claims || claims.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <p className="text-5xl mb-5">🔒</p>
          <h1 className="text-2xl font-black text-[#1a1a2e] mb-3">Nu ai nicio locație revendicată</h1>
          <p className="text-gray-500 font-medium mb-6 leading-relaxed">
            Găsește locația ta pe Moosey și apasă &bdquo;Revendică pagina&rdquo; pentru a obține acces la dashboard.
          </p>
          <a href="/" className="inline-block bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black px-6 py-3 rounded-xl transition-colors">
            Caută locația mea →
          </a>
        </div>
      </div>
    );
  }

  // Pick the requested listing, or fall back to the first one
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeClaim = (claims as any[]).find((c) => c.listing_id === params.listing) ?? claims[0] as any;
  const activeListingId: string = activeClaim.listing_id;

  // Fetch listing
  const { data: listing } = await adminClient
    .from("listings")
    .select("*")
    .eq("id", activeListingId)
    .single();

  if (!listing) redirect("/");

  // Fetch events
  const { data: events } = await adminClient
    .from("events")
    .select("*")
    .eq("listing_id", activeListingId)
    .order("event_date", { ascending: true });

  // Fetch updates (all, including expired — dashboard shows full history)
  const { data: updates } = await adminClient
    .from("listing_updates")
    .select("*")
    .eq("listing_id", activeListingId)
    .order("created_at", { ascending: false });

  // Fetch reviews
  const { data: reviews } = await adminClient
    .from("reviews")
    .select("id, rating, text, created_at, user_name, review_replies(id, text, created_at)")
    .eq("listing_id", activeListingId)
    .order("created_at", { ascending: false });

  // Stats: total views + last 90 days (filtered per tier in StatsPanel) + week comparison
  const ninetyDaysAgo   = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const sevenDaysAgo    = new Date(Date.now() -  7 * 24 * 60 * 60 * 1000).toISOString();
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalViews },
    { data: allRecentViews },
    { count: thisWeekViews },
    { count: lastWeekViews },
    { count: favCount },
    { count: activeEventsCount },
  ] = await Promise.all([
    adminClient.from("listing_views").select("id", { count: "exact", head: true }).eq("listing_id", activeListingId),
    adminClient.from("listing_views").select("viewed_at").eq("listing_id", activeListingId).gte("viewed_at", ninetyDaysAgo),
    adminClient.from("listing_views").select("id", { count: "exact", head: true }).eq("listing_id", activeListingId).gte("viewed_at", sevenDaysAgo),
    adminClient.from("listing_views").select("id", { count: "exact", head: true }).eq("listing_id", activeListingId).gte("viewed_at", fourteenDaysAgo).lt("viewed_at", sevenDaysAgo),
    adminClient.from("user_favorites").select("id", { count: "exact", head: true }).eq("listing_id", activeListingId),
    adminClient.from("events").select("id", { count: "exact", head: true }).eq("listing_id", activeListingId).gte("event_date", new Date().toISOString().split("T")[0]),
  ]);

  // Fetch profile for package tier checks
  const { data: profile } = await adminClient
    .from("profiles")
    .select("package, package_expires_at")
    .eq("id", user.id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reviewList = (reviews ?? []) as any[];
  const avgRating = reviewList.length > 0
    ? reviewList.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / reviewList.length
    : null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.moosey.ro";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allListings = (claims as any[]).map((c) => ({ id: c.listing_id, name: c.listings?.name ?? c.listing_id }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-black text-[#1a1a2e]">Dashboard organizator</h1>

            {allListings.length > 1 ? (
              /* Multi-location selector */
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {allListings.map((l) => (
                  <a
                    key={l.id}
                    href={`/dashboard?listing=${l.id}`}
                    className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                      l.id === activeListingId
                        ? "bg-[#ff5a2e] text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {l.name}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 font-medium mt-0.5">{listing.name}</p>
            )}
          </div>

          <a
            href={`/listing/${listing.id}`}
            target="_blank"
            className="text-sm font-bold text-[#ff5a2e] hover:underline whitespace-nowrap shrink-0"
          >
            Vezi pagina publică →
          </a>
        </div>

        <StatsPanel
          totalViews={totalViews ?? 0}
          allRecentViews={allRecentViews ?? []}
          thisWeekViews={thisWeekViews ?? 0}
          lastWeekViews={lastWeekViews ?? 0}
          reviewCount={reviewList.length}
          avgRating={avgRating}
          favCount={favCount ?? 0}
          activeEventsCount={activeEventsCount ?? 0}
          profile={profile}
        />

        <PromoSection listingId={listing.id} listingName={listing.name} siteUrl={siteUrl} />

        <ListingEditor listing={listing} />

        <EventsManager listingId={listing.id} initialEvents={events ?? []} />

        <OneTimeEventForm />

        <EventCalendar events={events ?? []} />

        <UpdatesManager listingId={listing.id} initialUpdates={updates ?? []} />

        <ReviewsPanel reviews={reviewList} listingId={listing.id} organizerId={user.id} />

      </main>
    </div>
  );
}
