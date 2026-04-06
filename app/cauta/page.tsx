import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { adminClient } from "@/utils/supabase/admin";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import SearchBar from "@/app/components/SearchBar";
import ListingCard, { CATEGORY_META } from "@/app/components/ListingCard";
import { getListingBadges } from "@/utils/getListingBadges";
import SearchFilters from "./SearchFilters";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  const title = q ? `Rezultate pentru „${q}"` : "Caută activități";
  return {
    title,
    description: q
      ? `Rezultatele căutării pentru „${q}" pe KidsApp Sibiu — activități, locuri și cursuri pentru copii.`
      : "Caută activități pentru copii în Sibiu pe KidsApp.",
    robots: "noindex",
  };
}

function sanitize(q: string): string {
  return q
    .replace(/[\\%_]/g, "\\$&")
    .replace(/[(),]/g, "");
}

const CATEGORY_SUGGESTIONS = [
  { emoji: "🛝", label: "Locuri de joacă", href: "/locuri-de-joaca" },
  { emoji: "🎓", label: "Educație",         href: "/educatie" },
  { emoji: "🎨", label: "Cursuri",          href: "/cursuri-ateliere" },
  { emoji: "⚽", label: "Sport",            href: "/sport" },
  { emoji: "🎭", label: "Spectacole",       href: "/spectacole" },
  { emoji: "🎪", label: "Evenimente",       href: "/evenimente" },
];

export default async function CautaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string; sort?: string }>;
}) {
  const { q: rawQ = "", cat = "", sort = "relevanta" } = await searchParams;
  const q = rawQ.trim();
  const safeQ = sanitize(q);

  const supabase = createClient(await cookies());

  let listings: ReturnType<typeof Array<object>> = [];
  let orgEvents: ReturnType<typeof Array<object>> = [];

  if (q.length >= 2) {
    // Build listing query
    let listingQuery = supabase
      .from("listings")
      .select("id, name, category, subcategory, description, address, price, age_min, age_max, schedule, is_verified, images")
      .or(`name.ilike.%${safeQ}%,description.ilike.%${safeQ}%,subcategory.ilike.%${safeQ}%,address.ilike.%${safeQ}%`)
      .eq("is_verified", true);

    if (cat) listingQuery = listingQuery.eq("category", cat);

    if (sort === "alfabetic") {
      listingQuery = listingQuery.order("name", { ascending: true });
    } else if (sort === "nou") {
      listingQuery = listingQuery.order("created_at", { ascending: false });
    } else {
      listingQuery = listingQuery.order("is_featured", { ascending: false }).order("name");
    }

    const { data: rawListings } = await listingQuery;

    const ids = (rawListings ?? []).map((l: { id: string }) => l.id);
    const badges = ids.length > 0 ? await getListingBadges(ids) : {};
    listings = (rawListings ?? []).map((l: { id: string }) => ({
      ...l,
      hot_badge: badges[(l as { id: string }).id] ?? null,
    }));

    // Events search (adminClient — no public RLS)
    if (!cat || cat === "eveniment" || cat === "spectacol") {
      let evQuery = adminClient
        .from("events")
        .select("id, title, description, event_date, start_time, price, thumbnail_url, listing_id, listings(id, name, category, address)")
        .or(`title.ilike.%${safeQ}%,description.ilike.%${safeQ}%`)
        .gte("event_date", new Date().toISOString().split("T")[0])
        .order("event_date", { ascending: true })
        .limit(10);

      if (sort === "nou") {
        evQuery = adminClient
          .from("events")
          .select("id, title, description, event_date, start_time, price, thumbnail_url, listing_id, listings(id, name, category, address)")
          .or(`title.ilike.%${safeQ}%,description.ilike.%${safeQ}%`)
          .gte("event_date", new Date().toISOString().split("T")[0])
          .order("created_at", { ascending: false })
          .limit(10);
      }

      const { data: evData } = await evQuery;
      orgEvents = evData ?? [];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typedListings = listings as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typedEvents = orgEvents as any[];

  const totalCount = typedListings.length + typedEvents.length;
  const hasQuery = q.length >= 2;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Search header */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <SearchBar initialQuery={q} />
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {!hasQuery ? (
          /* No query yet */
          <div className="text-center py-12">
            <p className="text-5xl mb-4">🔍</p>
            <h1 className="text-2xl font-black text-[#1a1a2e] mb-2">Caută pe KidsApp</h1>
            <p className="text-gray-500 font-medium mb-8">
              Scrie cel puțin 2 caractere pentru a căuta activități, locuri sau cursuri pentru copii.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORY_SUGGESTIONS.map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  className="flex items-center gap-2 bg-white border border-gray-200 hover:border-[#ff5a2e] hover:text-[#ff5a2e] text-gray-600 font-bold text-sm px-4 py-2 rounded-full transition-all shadow-sm"
                >
                  {c.emoji} {c.label}
                </a>
              ))}
            </div>
          </div>
        ) : totalCount === 0 ? (
          /* No results */
          <div>
            <h1 className="text-xl font-black text-[#1a1a2e] mb-1">
              Nu am găsit nimic pentru „{q}"
            </h1>
            <p className="text-gray-400 font-medium mb-8">
              Încearcă: robotică, balet, înot, teatru, fotbal…
            </p>
            <div className="mb-6">
              <Suspense><SearchFilters /></Suspense>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
              <p className="text-3xl mb-3">🤷</p>
              <p className="font-bold text-[#1a1a2e] mb-2">Niciun rezultat</p>
              <p className="text-sm text-gray-500 font-medium mb-5">
                Verifică ortografia sau explorează categoriile de mai jos.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {CATEGORY_SUGGESTIONS.map((c) => (
                  <a
                    key={c.href}
                    href={c.href}
                    className="flex items-center gap-2 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-[#ff5a2e] hover:text-[#ff5a2e] text-gray-600 font-bold text-sm px-4 py-2 rounded-full transition-all"
                  >
                    {c.emoji} {c.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Results */
          <div>
            <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
              <h1 className="text-xl font-black text-[#1a1a2e]">
                <span className="text-[#ff5a2e]">{totalCount}</span>{" "}
                {totalCount === 1 ? "rezultat" : "rezultate"} pentru „{q}"
              </h1>
            </div>

            <div className="mb-6">
              <Suspense><SearchFilters /></Suspense>
            </div>

            <div className="flex flex-col gap-4">
              {/* Listing results */}
              {typedListings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}

              {/* Event results */}
              {typedEvents.length > 0 && (
                <>
                  {typedListings.length > 0 && (
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide pt-2">
                      Evenimente viitoare
                    </p>
                  )}
                  {typedEvents.map((ev) => {
                    const dateObj = ev.event_date ? new Date(ev.event_date) : null;
                    const dateLabel = dateObj
                      ? dateObj.toLocaleDateString("ro-RO", {
                          weekday: "short", day: "numeric", month: "short", timeZone: "UTC",
                        })
                      : "Dată TBD";
                    const catMeta = CATEGORY_META[ev.listings?.category ?? ""];
                    const start = ev.start_time?.slice(0, 5) ?? null;
                    const end = ev.end_time?.slice(0, 5) ?? null;
                    const timeStr = start && end ? `${start}–${end}` : start ?? null;

                    return (
                      <a
                        key={ev.id}
                        href={`/listing/${ev.listing_id}`}
                        className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.10)] transition-all group"
                      >
                        {ev.thumbnail_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={ev.thumbnail_url}
                            alt=""
                            className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-orange-50 flex flex-col items-center justify-center shrink-0 border border-orange-100">
                            <span className="text-xl font-black text-[#ff5a2e] leading-none">
                              {dateObj ? dateObj.getUTCDate() : "?"}
                            </span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase">
                              {dateObj ? dateObj.toLocaleDateString("ro-RO", { month: "short", timeZone: "UTC" }) : ""}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap gap-2 mb-1">
                            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">
                              📅 Eveniment
                            </span>
                            {catMeta && (
                              <span className={`${catMeta.tagColor ?? "bg-gray-100 text-gray-600"} text-xs font-bold px-2.5 py-1 rounded-full`}>
                                {catMeta.emoji} {catMeta.label}
                              </span>
                            )}
                          </div>
                          <p className="font-black text-[#1a1a2e] text-base leading-snug group-hover:text-[#ff5a2e] transition-colors">
                            {ev.title}
                          </p>
                          <p className="text-xs font-bold text-[#ff5a2e] mt-0.5">
                            {dateLabel}{timeStr ? ` · ${timeStr}` : ""}
                          </p>
                          {ev.listings?.name && (
                            <p className="text-xs text-gray-400 font-semibold mt-0.5">
                              📍 {ev.listings.name}
                              {ev.listings?.address ? ` · ${ev.listings.address}` : ""}
                            </p>
                          )}
                          {ev.description && (
                            <p className="text-sm text-gray-500 font-medium mt-1 line-clamp-2">{ev.description}</p>
                          )}
                        </div>
                        {ev.price != null && (
                          <p className="text-base font-black text-[#ff5a2e] shrink-0">{ev.price} lei</p>
                        )}
                      </a>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
