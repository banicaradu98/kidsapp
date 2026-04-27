import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Navbar from "./components/Navbar";
import AutoOpenAuth from "./components/AutoOpenAuth";
import PageToast from "./components/PageToast";
import ScrollReveal from "./components/ScrollReveal";
import SearchBar from "./components/SearchBar";
import HomepageCalendar, { type HomepageEvent } from "./components/HomepageCalendar";
import { adminClient } from "@/utils/supabase/admin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ce facem cu copilul în Sibiu? — Moosey",
  description:
    "Sute de activități, locuri de joacă și evenimente pentru copii din Sibiu. Găsește grădinițe, cursuri, ateliere, spectacole și locuri de joacă — gratuit pentru părinți.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Moosey — Ce facem cu copilul în Sibiu?",
    description:
      "Sute de activități, locuri de joacă și evenimente pentru copii din Sibiu. Gratuit pentru părinți.",
    url: "/",
  },
};

const CATEGORY_META: Record<string, { emoji: string; label: string; shortLabel: string; tagColor: string; gradientFrom: string; gradientTo: string; iconBg: string }> = {
  "loc-de-joaca": { emoji: "🛝", label: "Locuri de joacă",   shortLabel: "Loc de joacă",   tagColor: "bg-orange-100 text-orange-700", gradientFrom: "from-orange-50", gradientTo: "to-orange-100", iconBg: "bg-orange-100" },
  "educatie":     { emoji: "🎓", label: "Educație",           shortLabel: "Educație",         tagColor: "bg-green-100 text-green-700",   gradientFrom: "from-green-50",  gradientTo: "to-green-100",  iconBg: "bg-green-100"  },
  "curs-atelier": { emoji: "🎨", label: "Cursuri & Ateliere", shortLabel: "Cursuri",          tagColor: "bg-purple-100 text-purple-700", gradientFrom: "from-purple-50", gradientTo: "to-purple-100", iconBg: "bg-purple-100" },
  "sport":        { emoji: "⚽", label: "Sport",             shortLabel: "Sport",            tagColor: "bg-sky-100 text-sky-700",       gradientFrom: "from-sky-50",    gradientTo: "to-sky-100",    iconBg: "bg-sky-100"    },
  "spectacol":    { emoji: "🎭", label: "Spectacole",         shortLabel: "Spectacole",       tagColor: "bg-rose-100 text-rose-700",     gradientFrom: "from-rose-50",   gradientTo: "to-rose-100",   iconBg: "bg-rose-100"   },
  "eveniment":    { emoji: "🎪", label: "Evenimente",         shortLabel: "Evenimente",       tagColor: "bg-pink-100 text-pink-700",     gradientFrom: "from-pink-50",   gradientTo: "to-pink-100",   iconBg: "bg-pink-100"   },
};
const DEFAULT_META = { emoji: "📍", label: "Activitate", shortLabel: "Activitate", tagColor: "bg-gray-100 text-gray-700", gradientFrom: "from-gray-50", gradientTo: "to-gray-100", iconBg: "bg-gray-100" };

function formatAge(min: number | null, max: number | null) {
  if (min == null && max == null) return null;
  if (min == null) return `până la ${max} ani`;
  if (max == null) return `${min}+ ani`;
  return `${min}–${max} ani`;
}

const CATEGORIES = [
  { key: "loc-de-joaca", href: "/locuri-de-joaca" },
  { key: "educatie",     href: "/educatie" },
  { key: "curs-atelier", href: "/cursuri-ateliere" },
  { key: "sport",        href: "/sport" },
  { key: "spectacol",    href: "/spectacole" },
  { key: "eveniment",    href: "/evenimente" },
];

const POPULAR_TAGS = [
  { icon: "🛝", label: "Loc de joacă", href: "/cauta?q=loc+de+joaca" },
  { icon: "🎨", label: "Atelier",       href: "/cauta?q=atelier" },
  { icon: "🏊", label: "Înot",          href: "/cauta?q=inot" },
  { icon: "🎭", label: "Teatru",        href: "/cauta?q=teatru" },
  { icon: "⚽", label: "Fotbal",        href: "/cauta?q=fotbal" },
  { icon: "🤖", label: "Robotică",      href: "/cauta?q=robotica" },
];

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Category counts — toate listingurile, indiferent de status verificare
  const { data: allListingsForCount } = await supabase
    .from("listings")
    .select("category");

  const catCounts: Record<string, number> = {};
  for (const l of allListingsForCount ?? []) {
    if (l.category) catCounts[l.category] = (catCounts[l.category] ?? 0) + 1;
  }

  // Latest marketplace listings for homepage preview
  const { data: marketplacePreview } = await adminClient
    .from("marketplace_listings")
    .select("id, title, price, type, images, category, created_at, profiles(full_name)")
    .eq("status", "activ")
    .order("created_at", { ascending: false })
    .limit(4);

  // Featured listings with images + reviews for rating
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: featuredRaw } = await supabase
    .from("listings")
    .select("id, name, category, description, address, price, age_min, age_max, images, reviews(rating)")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const featured = (featuredRaw ?? []).map((l: any) => {
    const reviews = (l.reviews as { rating: number }[]) ?? [];
    return {
      ...l,
      avgRating: reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null,
      reviewCount: reviews.length,
    };
  });

  // Events for homepage calendar (next 4 weeks)
  const calStart = new Date();
  calStart.setHours(0, 0, 0, 0);
  const calEnd = new Date(calStart);
  calEnd.setDate(calEnd.getDate() + 28);

  const { data: calListings } = await supabase
    .from("listings")
    .select("id, name, category, address, price, images, event_date, event_end_date, start_time")
    .in("category", ["spectacol", "eveniment"])
    .gte("event_date", calStart.toISOString())
    .order("event_date", { ascending: true })
    .limit(60);

  const { data: calOrgEvents } = await adminClient
    .from("events")
    .select("id, title, event_date, start_time, price, thumbnail_url, listing_id, listings(id, name, address, category)")
    .gte("event_date", calStart.toISOString())
    .order("event_date", { ascending: true })
    .limit(60);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allCalendarEvents: HomepageEvent[] = [
    ...(calListings ?? []).map((l) => ({
      id: `l-${l.id}`,
      title: l.name,
      date: l.event_date!,
      endDate: l.event_end_date ?? null,
      time: l.start_time ?? null,
      image: l.images?.[0] ?? null,
      href: `/listing/${l.id}`,
      category: l.category ?? null,
      locationName: null,
      price: l.price ?? null,
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(calOrgEvents ?? []).map((e: any) => ({
      id: `o-${e.id}`,
      title: e.title,
      date: e.event_date,
      endDate: null,
      time: e.start_time ?? null,
      image: e.thumbnail_url ?? null,
      href: `/listing/${e.listing_id}`,
      category: e.listings?.category ?? null,
      locationName: e.listings?.name ?? null,
      price: e.price != null ? `${e.price} lei` : null,
    })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="min-h-screen bg-white">
      <Suspense><AutoOpenAuth /></Suspense>
      <Suspense><PageToast /></Suspense>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-b from-white to-[#fff5f3] pt-14 pb-16 px-4 sm:pt-24 sm:pb-28 overflow-hidden">
        {/* Subtle decorative blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ff5a2e] rounded-full opacity-[0.04] pointer-events-none translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff5a2e] rounded-full opacity-[0.03] pointer-events-none -translate-x-1/3 translate-y-1/4" />

        <div className="relative max-w-4xl mx-auto text-center overflow-visible">
          <div className="inline-flex items-center gap-2 bg-white border border-orange-100 text-[#ff5a2e] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-8 shadow-sm">
            <span>📍</span> Sibiu, România
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1a1a2e] leading-[1.06] mb-6 text-balance animate-entrance animate-entrance-delay-1">
            Ce facem cu copilul<br />
            <span className="text-[#ff5a2e]">în Sibiu?</span>
          </h1>
          <p className="text-gray-500 text-xl leading-relaxed mb-10 max-w-xl mx-auto animate-entrance animate-entrance-delay-2">
            Descoperă sute de activități, locuri de joacă și evenimente pentru copii de toate vârstele.
          </p>

          {/* Search bar */}
          <div className="animate-entrance animate-entrance-delay-3">
            <SearchBar />
          </div>

          {/* Popular tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider self-center mr-1">Popular:</span>
            {POPULAR_TAGS.map((tag) => (
              <a
                key={tag.label}
                href={tag.href}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-[#fff5f3] border border-gray-200 hover:border-[#ff5a2e] text-gray-600 hover:text-[#ff5a2e] text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200 shadow-sm"
              >
                <span>{tag.icon}</span> {tag.label}
              </a>
            ))}
          </div>

          {/* Mascot — colțul dreapta-jos, nu blochează conținutul */}
          <div className="absolute -bottom-8 right-2 md:-bottom-10 md:right-4 pointer-events-none z-10">
            <img
              src="/images/moosey_transparent.png"
              alt="Moosey"
              className="h-20 md:h-28 w-auto object-contain mascot-enter"
            />
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <ScrollReveal>
        <section className="py-14 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8 px-4 sm:px-6">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a2e]">Explorează după categorie</h2>
                <p className="text-sm text-gray-400 mt-1">Alege ce se potrivește copilului tău</p>
              </div>
            </div>

            {/* Mobile: horizontal scroll */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 pb-2 sm:hidden snap-x snap-mandatory">
              {CATEGORIES.map((cat) => {
                const meta = CATEGORY_META[cat.key];
                const count = catCounts[cat.key] ?? 0;
                return (
                  <a
                    key={cat.key}
                    href={cat.href}
                    className="flex-none snap-start bg-[#f9f9f9] hover:bg-white rounded-2xl p-4 flex flex-col items-center gap-2 min-w-[110px] active:scale-95 transition-all duration-200 border border-transparent hover:border-[#ff5a2e]/30 hover:shadow-sm"
                  >
                    <span className="text-4xl">{meta.emoji}</span>
                    <span className="text-sm font-semibold text-gray-700 text-center leading-tight group-hover:text-[#ff5a2e]">{meta.shortLabel}</span>
                    {count > 0 && <span className="text-xs text-gray-400">{count} locuri</span>}
                  </a>
                );
              })}
            </div>

            {/* sm+: 2-col grid → lg: 3-col grid */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-6">
              {CATEGORIES.map((cat) => {
                const meta = CATEGORY_META[cat.key];
                const count = catCounts[cat.key] ?? 0;
                return (
                  <a
                    key={cat.key}
                    href={cat.href}
                    className="group bg-[#f9f9f9] hover:bg-white rounded-2xl p-7 flex flex-col items-center gap-3 hover:shadow-md border border-transparent hover:border-[#ff5a2e]/20 transition-all duration-300 hover:-translate-y-1"
                  >
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{meta.emoji}</span>
                    <div className="text-center">
                      <p className="font-semibold text-[#1a1a2e] text-base group-hover:text-[#ff5a2e] transition-colors duration-200">{meta.label}</p>
                      {count > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5">{count} {count === 1 ? "loc" : "locuri"}</p>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── MARKETPLACE PREVIEW ── */}
      {marketplacePreview && marketplacePreview.length > 0 && (
        <ScrollReveal>
          <section className="py-14 sm:py-20 bg-[#f7f7f7]">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8 px-4 sm:px-6">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a2e]">Marketplace părinți</h2>
                  <p className="text-sm text-gray-400 mt-1">Cumpără, vinde sau donează obiecte pentru copii</p>
                </div>
                <a href="/marketplace" className="text-base font-bold text-[#ff5a2e] hover:underline hidden sm:block shrink-0 ml-4">
                  Vezi toate anunțurile →
                </a>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-4 sm:px-6">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(marketplacePreview as any[]).map((item) => {
                  const TYPE_LABELS: Record<string, { label: string; color: string }> = {
                    vand:      { label: "VÂND",      color: "bg-[#ff5a2e] text-white" },
                    donez:     { label: "DONEZ",     color: "bg-emerald-500 text-white" },
                    inchiriez: { label: "ÎNCHIRIEZ", color: "bg-sky-500 text-white" },
                  };
                  const typeMeta = TYPE_LABELS[item.type] ?? { label: item.type?.toUpperCase(), color: "bg-gray-200 text-gray-700" };
                  const coverImg = item.images?.[0] ?? null;
                  return (
                    <a
                      key={item.id}
                      href={`/marketplace/${item.id}`}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group block"
                    >
                      <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                        {coverImg ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={coverImg} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">🛍️</div>
                        )}
                        <span className={`absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-full ${typeMeta.color}`}>
                          {typeMeta.label}
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="font-bold text-[#1a1a2e] text-sm leading-snug line-clamp-2 mb-1">{item.title}</p>
                        {item.price != null && item.type !== "donez" ? (
                          <p className="font-display text-base font-bold text-[#ff5a2e]">{item.price} lei</p>
                        ) : item.type === "donez" ? (
                          <p className="text-sm font-bold text-emerald-600">Gratuit</p>
                        ) : null}
                      </div>
                    </a>
                  );
                })}
              </div>

              <div className="mt-5 text-center sm:hidden px-4">
                <a href="/marketplace" className="inline-block w-full bg-orange-50 text-[#ff5a2e] font-black text-base py-4 rounded-2xl">
                  Toate anunțurile →
                </a>
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* ── FEATURED ── */}
      <ScrollReveal>
        <section className="pb-14 sm:pb-16 bg-[#f7f7f7]">
          <div className="max-w-6xl mx-auto pt-14 sm:pt-20">
            <div className="flex items-center justify-between mb-8 px-4 sm:px-6">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a2e]">Recomandate de părinți</h2>
                <p className="text-sm text-gray-400 mt-1">Locuri iubite de familiile din Sibiu</p>
              </div>
              <a href="#" className="text-base font-bold text-[#ff5a2e] hover:underline hidden sm:block shrink-0 ml-4">
                Vezi toate →
              </a>
            </div>

            {!featured || featured.length === 0 ? (
              <p className="text-gray-400 font-medium text-center py-12 text-lg px-4">
                Nicio activitate recomandată momentan. Revino curând!
              </p>
            ) : (
              <>
                {/* Mobile: horizontal scroll */}
                <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-3 md:hidden snap-x snap-mandatory">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {featured.map((listing: any) => {
                    const meta = CATEGORY_META[listing.category ?? ""] ?? DEFAULT_META;
                    const age = formatAge(listing.age_min, listing.age_max);
                    const isFree = listing.price?.toLowerCase() === "gratuit";
                    const coverImg = listing.images?.[0] ?? null;
                    return (
                      <a
                        key={listing.id}
                        href={`/listing/${listing.id}`}
                        className="flex-none w-72 snap-start bg-white rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden block active:scale-[.98] transition-transform"
                      >
                        <div className={`h-44 bg-gradient-to-br ${meta.gradientFrom} ${meta.gradientTo} overflow-hidden relative`}>
                          {coverImg ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={coverImg} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-6xl">{meta.emoji}</span>
                            </div>
                          )}
                          <span className={`absolute top-3 left-3 ${meta.tagColor} text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm`}>
                            {meta.emoji} {meta.shortLabel}
                          </span>
                          <span className="absolute top-3 right-3 bg-[#ff5a2e] text-white text-xs font-black px-2.5 py-1 rounded-full">
                            ❤️ Top
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-black text-[#1a1a2e] text-lg leading-snug mb-1">{listing.name}</h3>
                          {listing.avgRating !== null && (
                            <div className="flex items-center gap-1 mb-2">
                              <span className="text-yellow-400 text-sm">{"★".repeat(Math.round(listing.avgRating))}</span>
                              <span className="text-xs font-bold text-gray-600">{listing.avgRating.toFixed(1)}</span>
                              <span className="text-xs text-gray-400">({listing.reviewCount})</span>
                            </div>
                          )}
                          {listing.description && (
                            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-3 line-clamp-2">
                              {listing.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                              {listing.address && <span className="text-xs text-gray-400 font-semibold">📍 {listing.address}</span>}
                              {age && <span className="text-xs text-gray-400 font-semibold">👶 {age}</span>}
                            </div>
                            {listing.price && (
                              <span className={`text-base font-black ${isFree ? "text-green-600" : "text-[#ff5a2e]"}`}>
                                {listing.price}
                              </span>
                            )}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>

                {/* Desktop: grid */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-5 px-6">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {featured.map((listing: any) => {
                    const meta = CATEGORY_META[listing.category ?? ""] ?? DEFAULT_META;
                    const age = formatAge(listing.age_min, listing.age_max);
                    const isFree = listing.price?.toLowerCase() === "gratuit";
                    const coverImg = listing.images?.[0] ?? null;
                    return (
                      <a
                        key={listing.id}
                        href={`/listing/${listing.id}`}
                        className="bg-white rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 group block"
                      >
                        <div className={`h-48 bg-gradient-to-br ${meta.gradientFrom} ${meta.gradientTo} overflow-hidden relative`}>
                          {coverImg ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={coverImg} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-7xl group-hover:scale-110 transition-transform duration-300">{meta.emoji}</span>
                            </div>
                          )}
                          <span className={`absolute top-3 left-3 ${meta.tagColor} text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm`}>
                            {meta.emoji} {meta.shortLabel}
                          </span>
                          <span className="absolute top-3 right-3 bg-[#ff5a2e] text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
                            ❤️ Recomandat
                          </span>
                        </div>
                        <div className="p-5">
                          <h3 className="font-black text-[#1a1a2e] text-lg leading-snug mb-1">{listing.name}</h3>
                          {listing.avgRating !== null && (
                            <div className="flex items-center gap-1.5 mb-2">
                              <span className="text-yellow-400">{"★".repeat(Math.round(listing.avgRating))}</span>
                              <span className="text-sm font-bold text-gray-700">{listing.avgRating.toFixed(1)}</span>
                              <span className="text-xs text-gray-400">({listing.reviewCount} recenzii)</span>
                            </div>
                          )}
                          {listing.description && (
                            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-4 line-clamp-2">
                              {listing.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                              {listing.address && <span className="text-xs text-gray-400 font-semibold">📍 {listing.address}</span>}
                              {age && <span className="text-xs text-gray-400 font-semibold">👶 {age}</span>}
                            </div>
                            {listing.price && (
                              <span className={`text-lg font-black ${isFree ? "text-green-600" : "text-[#ff5a2e]"}`}>
                                {listing.price}
                              </span>
                            )}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </>
            )}

          </div>
        </section>
      </ScrollReveal>

      {/* ── HOMEPAGE CALENDAR ── */}
      <ScrollReveal>
        <HomepageCalendar allEvents={allCalendarEvents} />
      </ScrollReveal>

      {/* ── CTA ORGANIZATORI ── */}
      <ScrollReveal>
        <section className="py-14 px-4 bg-gradient-to-br from-[#fff4f0] to-white">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-[0_4px_32px_rgba(255,90,46,0.10)] border border-orange-100 overflow-hidden">
              <div className="flex flex-col lg:flex-row items-center gap-0">
                {/* Text side */}
                <div className="flex-1 p-8 sm:p-12 text-center lg:text-left">
                  <p className="text-4xl mb-4">🏠</p>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a2e] mb-3 leading-snug">
                    Ai o locație pentru copii<br className="hidden sm:block" /> în Sibiu?
                  </h2>
                  <p className="text-gray-500 font-medium text-base mb-7 max-w-md leading-relaxed">
                    Adaugă grădinița, centrul de activități, locul de joacă sau atelierul tău și ajungi la mii de părinți din Sibiu.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <a
                      href="/adauga-locatia-ta"
                      className="inline-block bg-[#ff5a2e] hover:bg-[#f03d12] active:scale-[0.98] text-white font-black px-8 py-4 rounded-2xl text-base transition-all shadow-[0_4px_16px_rgba(255,90,46,0.3)]"
                    >
                      + Adaugă locația ta gratuit
                    </a>
                    <a
                      href="/cum-functioneaza"
                      className="inline-block bg-orange-50 hover:bg-orange-100 text-[#ff5a2e] font-black px-6 py-4 rounded-2xl text-base transition-colors"
                    >
                      Cum funcționează?
                    </a>
                  </div>
                  <p className="mt-4 text-sm text-gray-400 font-medium">
                    Fără cont. Publicare în maxim 48 ore.
                  </p>
                </div>

                {/* Illustration side */}
                <div className="w-full lg:w-72 h-48 lg:h-auto lg:self-stretch bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-8 shrink-0">
                  <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[200px]">
                    {/* Background circles */}
                    <circle cx="180" cy="40" r="55" fill="#ff5a2e" opacity="0.08"/>
                    <circle cx="50" cy="170" r="45" fill="#ff5a2e" opacity="0.06"/>
                    {/* Main building */}
                    <rect x="75" y="95" width="90" height="95" rx="6" fill="#ff5a2e" opacity="0.22"/>
                    {/* Roof */}
                    <polygon points="65,100 120,52 175,100" fill="#ff5a2e" opacity="0.38"/>
                    {/* Door */}
                    <rect x="108" y="140" width="24" height="50" rx="4" fill="white" opacity="0.85"/>
                    <circle cx="129" cy="165" r="2.5" fill="#ff5a2e" opacity="0.5"/>
                    {/* Windows */}
                    <rect x="83" y="110" width="24" height="20" rx="3" fill="white" opacity="0.75"/>
                    <rect x="133" y="110" width="24" height="20" rx="3" fill="white" opacity="0.75"/>
                    {/* Cross on windows */}
                    <line x1="95" y1="110" x2="95" y2="130" stroke="#ff5a2e" strokeWidth="1" opacity="0.3"/>
                    <line x1="83" y1="120" x2="107" y2="120" stroke="#ff5a2e" strokeWidth="1" opacity="0.3"/>
                    <line x1="145" y1="110" x2="145" y2="130" stroke="#ff5a2e" strokeWidth="1" opacity="0.3"/>
                    <line x1="133" y1="120" x2="157" y2="120" stroke="#ff5a2e" strokeWidth="1" opacity="0.3"/>
                    {/* Small side building */}
                    <rect x="175" y="120" width="45" height="70" rx="4" fill="#ff5a2e" opacity="0.14"/>
                    <polygon points="170,124 197,102 224,124" fill="#ff5a2e" opacity="0.22"/>
                    {/* Tree trunk */}
                    <rect x="35" y="155" width="8" height="35" rx="3" fill="#ff5a2e" opacity="0.25"/>
                    {/* Tree top */}
                    <circle cx="39" cy="145" r="22" fill="#ff5a2e" opacity="0.18"/>
                    {/* Ground */}
                    <rect x="10" y="188" width="220" height="8" rx="4" fill="#ff5a2e" opacity="0.08"/>
                    {/* Balloons */}
                    <circle cx="198" cy="55" r="14" fill="#ff5a2e" opacity="0.28"/>
                    <line x1="198" y1="69" x2="193" y2="90" stroke="#ff5a2e" strokeWidth="1.5" opacity="0.28"/>
                    <circle cx="216" cy="38" r="10" fill="#ff5a2e" opacity="0.20"/>
                    <line x1="216" y1="48" x2="211" y2="68" stroke="#ff5a2e" strokeWidth="1.5" opacity="0.20"/>
                    {/* Stars */}
                    <text x="18" y="45" fontSize="16" opacity="0.35">⭐</text>
                    <text x="195" y="155" fontSize="12" opacity="0.25">✨</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── NEWSLETTER ── */}
      <section id="newsletter" className="bg-[#ff5a2e] py-12 px-4">
        <div className="max-w-xl mx-auto text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-black mb-3 leading-snug">
            Primești vineri ce e nou în Sibiu 🎉
          </h2>
          <p className="text-orange-100 text-base font-medium mb-6 leading-relaxed">
            Activități, locuri de joacă și evenimente pentru copilul tău — direct în inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="adresa@email.ro"
              className="flex-1 bg-white text-gray-700 placeholder-gray-400 font-semibold rounded-xl px-5 py-4 outline-none text-base"
            />
            <button className="bg-white text-[#ff5a2e] font-black px-6 py-4 rounded-xl hover:bg-orange-50 active:scale-[0.98] transition-all text-base whitespace-nowrap">
              Abonează-mă
            </button>
          </div>
          <p className="mt-4 text-orange-200 text-sm font-medium">
            Fără spam. Dezabonare oricând. 💌
          </p>
        </div>
      </section>

    </div>
  );
}
