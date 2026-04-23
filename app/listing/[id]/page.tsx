import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { adminClient } from "@/utils/supabase/admin";
import type { Metadata } from "next";
import DescriptionCollapse from "./DescriptionCollapse";
import RichTextDisplay from "@/app/components/RichTextDisplay";
import ListingGallery from "./ListingGallery";
import ReviewSection from "./ReviewSection";
import FavoriteButton from "@/app/components/FavoriteButton";
import Navbar from "@/app/components/Navbar";
import ListingCard, { type Listing } from "@/app/components/ListingCard";
import ClaimButton from "./ClaimButton";
import ViewTracker from "./ViewTracker";
import LiveViewers from "./LiveViewers";
import QRCodeButton from "./QRCodeButton";
import { getDynamicBadges } from "@/utils/getDynamicBadges";
import { formatEventDate } from "@/utils/dateUtils";

const CATEGORY_META: Record<string, { emoji: string; label: string; href: string; tagColor: string; gradientFrom: string; gradientTo: string }> = {
  "loc-de-joaca": { emoji: "🛝", label: "Loc de joacă",   href: "/locuri-de-joaca",   tagColor: "bg-orange-100 text-orange-700", gradientFrom: "from-orange-100", gradientTo: "to-orange-200" },
  "educatie":     { emoji: "🎓", label: "Educație",        href: "/educatie",           tagColor: "bg-green-100 text-green-700",   gradientFrom: "from-green-100",  gradientTo: "to-green-200"  },
  "curs-atelier": { emoji: "🎨", label: "Curs & Atelier", href: "/cursuri-ateliere",   tagColor: "bg-purple-100 text-purple-700", gradientFrom: "from-purple-100", gradientTo: "to-purple-200" },
  "sport":        { emoji: "⚽", label: "Sport",          href: "/sport",              tagColor: "bg-sky-100 text-sky-700",       gradientFrom: "from-sky-100",    gradientTo: "to-sky-200"    },
  "spectacol":    { emoji: "🎭", label: "Spectacol",       href: "/spectacole",         tagColor: "bg-rose-100 text-rose-700",     gradientFrom: "from-rose-100",   gradientTo: "to-rose-200"   },
  "eveniment":    { emoji: "🎪", label: "Eveniment",       href: "/evenimente",         tagColor: "bg-pink-100 text-pink-700",     gradientFrom: "from-pink-100",   gradientTo: "to-pink-200"   },
};
const DEFAULT_META = { emoji: "📍", label: "Activitate", href: "/", tagColor: "bg-gray-100 text-gray-700", gradientFrom: "from-gray-100", gradientTo: "to-gray-200" };

const UPDATE_TYPE_META: Record<string, { emoji: string; bg: string; text: string; border: string }> = {
  noutate:            { emoji: "ℹ️",  bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-100"    },
  reducere:           { emoji: "🔥", bg: "bg-red-50",     text: "text-red-700",     border: "border-red-100"     },
  grupa_noua:         { emoji: "👥", bg: "bg-green-50",   text: "text-green-700",   border: "border-green-100"   },
  schimbare:          { emoji: "📍", bg: "bg-purple-50",  text: "text-purple-700",  border: "border-purple-100"  },
  eveniment_special:  { emoji: "🎉", bg: "bg-yellow-50",  text: "text-yellow-700",  border: "border-yellow-100"  },
  inchis_temporar:    { emoji: "🔒", bg: "bg-gray-50",    text: "text-gray-600",    border: "border-gray-200"    },
  lansare_noua:       { emoji: "🆕", bg: "bg-teal-50",    text: "text-teal-700",    border: "border-teal-100"    },
  inscrieri_deschise: { emoji: "🎓", bg: "bg-indigo-50",  text: "text-indigo-700",  border: "border-indigo-100"  },
  rezultate_premii:   { emoji: "🏆", bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-100"   },
  oferta_speciala:    { emoji: "🌟", bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-100"  },
  anunt_important:    { emoji: "📢", bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-100"    },
  none:               { emoji: "",   bg: "bg-gray-50",    text: "text-gray-700",    border: "border-gray-200"    },
};

function updateRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `acum ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `acum ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "ieri";
  if (days < 30) return `acum ${days} zile`;
  const months = Math.floor(days / 30);
  return `acum ${months} ${months === 1 ? "lună" : "luni"}`;
}

function updateDaysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function formatAge(min: number | null, max: number | null) {
  if (min == null && max == null) return null;
  if (min == null) return `până la ${max} ani`;
  if (max == null) return `${min}+ ani`;
  return `${min}–${max} ani`;
}

function whatsappLink(phone: string | null) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? "4" + digits : digits;
  return `https://wa.me/${intl}`;
}

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const { data: listing } = await adminClient
    .from("listings")
    .select("name, description, images, address, category")
    .eq("id", params.id)
    .single();

  if (!listing) return { title: "Locație negăsită" };

  const title = listing.name;
  const description = listing.description
    ? listing.description.slice(0, 160)
    : `${listing.name} — activitate pentru copii în Sibiu.`;
  const coverImg = listing.images?.[0] ?? null;

  return {
    title,
    description,
    alternates: { canonical: `/listing/${params.id}` },
    openGraph: {
      title: `${title} — Moosey`,
      description,
      url: `/listing/${params.id}`,
      type: "website",
      ...(coverImg
        ? { images: [{ url: coverImg, width: 1200, height: 630, alt: listing.name }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Moosey`,
      description,
      ...(coverImg ? { images: [coverImg] } : {}),
    },
  };
}

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!listing) notFound();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, user_name, rating, text, created_at")
    .eq("listing_id", params.id)
    .order("created_at", { ascending: false });

  const reviewList = reviews ?? [];
  const avgRating =
    reviewList.length > 0
      ? reviewList.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / reviewList.length
      : null;

  const meta = CATEGORY_META[listing.category ?? ""] ?? DEFAULT_META;
  const age = formatAge(listing.age_min, listing.age_max);
  const isFree = listing.price?.toLowerCase() === "gratuit";
  const eventDateDisplay = (listing.category === "spectacol" || listing.category === "eveniment")
    ? formatEventDate(listing.event_date, listing.event_end_date, listing.start_time)
    : null;
  const wa = whatsappLink(listing.phone);

  const photos: string[] = listing.images ?? [];

  // Fetch upcoming events for this listing (adminClient bypasses RLS on events table)
  const today = new Date().toISOString().split("T")[0];
  const { data: upcomingEventsRaw } = await adminClient
    .from("events")
    .select("id, title, description, event_date, start_time, end_time, price, thumbnail_url")
    .eq("listing_id", params.id)
    .gte("event_date", today)
    .order("event_date", { ascending: true })
    .limit(5);

  const upcomingEvents = upcomingEventsRaw ?? [];

  // Dynamic badges for this listing
  const { allBadges: dynBadgesMap } = await getDynamicBadges([
    { id: listing.id, created_at: listing.created_at, claimed_by: listing.claimed_by },
  ]);
  const dynBadges = dynBadgesMap[listing.id] ?? [];

  // Urgency: views today (server-side initial value; client refreshes every 30s)
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const { count: todayViews } = await adminClient
    .from("listing_views")
    .select("id", { count: "exact", head: true })
    .eq("listing_id", listing.id)
    .gte("viewed_at", todayStart.toISOString());

  // Fetch active listing updates (public RLS allows anon read)
  const nowIso = new Date().toISOString();
  const { data: listingUpdatesRaw } = await supabase
    .from("listing_updates")
    .select("id, type, title, message, expires_at, created_at")
    .eq("listing_id", params.id)
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .order("created_at", { ascending: false })
    .limit(10);

  const listingUpdates = listingUpdatesRaw ?? [];

  // Similar listings — same category, verified, excluding current
  const { data: similarRaw } = await adminClient
    .from("listings")
    .select("id, name, category, subcategory, images, is_verified, is_featured, address, price, age_min, age_max, schedule, phone, website, description, city, package")
    .eq("category", listing.category)
    .eq("is_verified", true)
    .neq("id", listing.id)
    .limit(4);
  const similarListings = (similarRaw ?? []) as Listing[];

  // JSON-LD structured data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.moosey.ro";
  const schemaType =
    listing.category === "educatie" ? "ChildCare" :
    listing.category === "spectacol" ? "PerformingArtsTheater" :
    "LocalBusiness";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: listing.name,
    description: listing.description ?? undefined,
    url: `${siteUrl}/listing/${listing.id}`,
    ...(listing.address
      ? { address: { "@type": "PostalAddress", streetAddress: listing.address, addressLocality: listing.city ?? "Sibiu", addressCountry: "RO" } }
      : {}),
    ...(listing.phone ? { telephone: listing.phone } : {}),
    ...(listing.website ? { sameAs: [listing.website] } : {}),
    ...(listing.images?.[0] ? { image: listing.images[0] } : {}),
    ...(listing.price ? { priceRange: listing.price } : {}),
    ...(avgRating !== null
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: avgRating.toFixed(1), reviewCount: reviewList.length, bestRating: 5, worstRating: 1 } }
      : {}),
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewTracker listingId={listing.id} />
      <Navbar />

      {/* ── GALLERY ── */}
      <ListingGallery
        images={photos}
        emoji={meta.emoji}
        gradientFrom={meta.gradientFrom}
        gradientTo={meta.gradientTo}
        title={listing.name}
        listingId={listing.id}
        isVerified={listing.is_verified ?? false}
        categoryLabel={meta.label}
        categoryEmoji={meta.emoji}
        categoryTagColor={meta.tagColor}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6">


        <div className="flex flex-col lg:flex-row gap-8 pb-32 lg:pb-16">

          {/* ── MAIN COLUMN ── */}
          <div className="flex-1 min-w-0 pt-4 lg:pt-0">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-4 flex-wrap">
              <a href="/" className="hover:text-[#ff5a2e] transition-colors">Acasă</a>
              <span>›</span>
              <a href={meta.href} className="hover:text-[#ff5a2e] transition-colors">{meta.label}</a>
              <span>›</span>
              <span className="text-gray-600 truncate max-w-[160px]">{listing.name}</span>
            </div>

            {/* Dynamic badges */}
            {dynBadges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {dynBadges.map((b) => (
                  <span key={b.type} className={`${b.bg} ${b.text} text-xs font-bold px-3 py-1.5 rounded-full`}>
                    {b.emoji} {b.label}
                  </span>
                ))}
              </div>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2 flex-wrap">
              {avgRating !== null ? (
                <>
                  <span className="text-yellow-400">{"★".repeat(Math.round(avgRating))}</span>
                  <span className="text-gray-800 font-bold">{avgRating.toFixed(1)}</span>
                  <span className="text-gray-400">
                    ({reviewList.length} {reviewList.length === 1 ? "recenzie" : "recenzii"})
                  </span>
                </>
              ) : (
                <span className="text-gray-400">Fără recenzii încă</span>
              )}
              {listing.city && <span>· 📍 {listing.city}</span>}
            </div>

            {/* Urgency signals — views today + live viewers */}
            <LiveViewers listingId={listing.id} initialToday={todayViews ?? 0} />

            {/* Info chips — horizontal scroll on mobile */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 mb-6">
              {listing.price && (
                <div className="flex-none bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 min-w-[110px]">
                  <p className="text-xs text-gray-400 font-semibold mb-0.5">Preț</p>
                  <p className={`text-base font-black ${isFree ? "text-green-600" : "text-[#ff5a2e]"}`}>{listing.price}</p>
                </div>
              )}
              {age && (
                <div className="flex-none bg-sky-50 border border-sky-100 rounded-2xl px-4 py-3 min-w-[110px]">
                  <p className="text-xs text-gray-400 font-semibold mb-0.5">Vârstă</p>
                  <p className="text-base font-black text-sky-600">{age}</p>
                </div>
              )}
              {listing.schedule && (
                <div className="flex-none bg-green-50 border border-green-100 rounded-2xl px-4 py-3 min-w-[200px]">
                  <p className="text-xs text-gray-400 font-semibold mb-0.5">Program</p>
                  <p className="text-sm font-bold text-green-700 whitespace-pre-line">{listing.schedule}</p>
                </div>
              )}
              {eventDateDisplay && (
                <div className="flex-none bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3 min-w-[160px]">
                  <p className="text-xs text-gray-400 font-semibold mb-0.5">Data</p>
                  <p className="text-sm font-black text-rose-700 leading-snug">{eventDateDisplay.primary}</p>
                  {eventDateDisplay.secondary && (
                    <p className="text-xs font-bold text-rose-500 mt-0.5">{eventDateDisplay.secondary}</p>
                  )}
                </div>
              )}
            </div>

            {/* Description with collapse */}
            {listing.description && (
              <section className="mb-6">
                <h3 className="text-lg font-black text-[#1a1a2e] mb-2">Despre loc</h3>
                <DescriptionCollapse text={listing.description} />
              </section>
            )}

            {/* Price details */}
            {listing.price_details && (
              <section className="mb-6">
                <h3 className="text-lg font-black text-[#1a1a2e] mb-3">💰 Prețuri</h3>
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
                  <div className="text-sm font-semibold text-gray-700 leading-relaxed">
                    <RichTextDisplay html={listing.price_details} />
                  </div>
                </div>
              </section>
            )}

            {/* Noutăți & Statusuri */}
            {listingUpdates.length > 0 && (
              <section className="mb-6">
                <h3 className="text-lg font-black text-[#1a1a2e] mb-3">📢 Noutăți & Statusuri</h3>
                <div className="flex flex-col gap-3">
                  {listingUpdates.map((upd) => {
                    const tm = UPDATE_TYPE_META[upd.type] ?? UPDATE_TYPE_META["noutate"];
                    const daysLeft = upd.expires_at ? updateDaysUntil(upd.expires_at) : null;
                    const isNone = upd.type === "none";
                    return (
                      <div key={upd.id} className={`${tm.bg} border ${tm.border} rounded-2xl p-4`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            {!isNone && tm.emoji && (
                              <span className="text-xl mt-0.5 shrink-0">{tm.emoji}</span>
                            )}
                            <div className="min-w-0">
                              {upd.title && (
                                <p className={`font-black text-sm leading-snug ${tm.text} mb-1`}>{upd.title}</p>
                              )}
                              {upd.message && (
                                <div className="text-sm font-medium text-gray-600 leading-relaxed">
                                  <RichTextDisplay html={upd.message} />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">
                              {updateRelativeTime(upd.created_at)}
                            </span>
                            {daysLeft !== null && daysLeft <= 7 && (
                              <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                                Expiră în {daysLeft}z
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Address + map */}
            {listing.address && (
              <section className="mb-6">
                <h3 className="text-lg font-black text-[#1a1a2e] mb-2">Locație</h3>
                <div className="flex items-start gap-2 text-sm font-semibold text-gray-600 mb-3">
                  <span className="mt-0.5">📍</span>
                  <span>{listing.address}{listing.city ? `, ${listing.city}` : ""}</span>
                </div>
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent((listing.address ?? "") + ", Sibiu, Romania")}&output=embed&z=16`}
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: 12 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hartă locație"
                  className="w-full rounded-2xl"
                />
                <a
                  href={`https://maps.google.com/maps?q=${encodeURIComponent((listing.address ?? "") + ", Sibiu, Romania")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs font-bold text-[#ff5a2e] hover:underline"
                >
                  Deschide în Google Maps →
                </a>
              </section>
            )}

            {/* Upcoming events */}
            {upcomingEvents.length > 0 && (
              <section className="mb-6">
                <h3 className="text-lg font-black text-[#1a1a2e] mb-3">📅 Evenimente viitoare</h3>
                <div className="flex flex-col gap-3">
                  {upcomingEvents.map((ev) => {
                    const dateObj = ev.event_date ? new Date(ev.event_date) : null;
                    const isValid = dateObj && !isNaN(dateObj.getTime());
                    const dateLabel = isValid
                      ? dateObj!.toLocaleDateString("ro-RO", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" })
                      : "Dată nespecificată";
                    const dayNum   = isValid ? dateObj!.getUTCDate() : "?";
                    const monthStr = isValid ? dateObj!.toLocaleDateString("ro-RO", { month: "short", timeZone: "UTC" }) : "";
                    const start = ev.start_time?.slice(0, 5) ?? null;
                    const end   = ev.end_time?.slice(0, 5)   ?? null;
                    const timeStr = start && end ? `${start}–${end}` : start ?? null;

                    return (
                      <div key={ev.id} className="flex items-start gap-4 bg-orange-50 border border-orange-100 rounded-2xl p-4">
                        {ev.thumbnail_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={ev.thumbnail_url}
                            alt=""
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-orange-100 flex flex-col items-center justify-center shrink-0">
                            <span className="text-lg font-black text-[#ff5a2e] leading-none">{dayNum}</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase">
                              {monthStr}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-[#1a1a2e] text-base leading-snug">{ev.title}</p>
                          <p className="text-xs font-bold text-[#ff5a2e] mt-0.5">
                            {dateLabel}{timeStr ? ` · ${timeStr}` : ""}
                          </p>
                          {ev.description && (
                            <div className="text-sm text-gray-500 font-medium mt-1 line-clamp-2">
                              <RichTextDisplay html={ev.description} />
                            </div>
                          )}
                          {ev.price != null && (
                            <p className="text-sm font-black text-[#ff5a2e] mt-1">{ev.price} lei</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Reviews */}
            <ReviewSection listingId={listing.id} initialReviews={reviewList} />

            {/* Similar listings */}
            {similarListings.length > 0 && (
              <section className="mt-10 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-[#1a1a2e]">
                    Alte locuri din {meta.label}
                  </h3>
                  <a
                    href={meta.href}
                    className="text-sm font-bold text-[#ff5a2e] hover:underline"
                  >
                    Vezi toate →
                  </a>
                </div>
                <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
                  {similarListings.map((l) => (
                    <ListingCard key={l.id} listing={l} />
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* ── DESKTOP SIDEBAR ── */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden">

                {listing.price && (
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 border-b border-orange-100">
                    <p className="text-xs font-bold text-gray-400 mb-1">Preț de intrare</p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-black ${isFree ? "text-green-600" : "text-[#ff5a2e]"}`}>{listing.price}</span>
                    </div>
                    {!isFree && <p className="text-xs text-gray-400 font-medium mt-1">Părinții intră gratuit</p>}
                  </div>
                )}

                {listing.schedule && (
                  <div className="p-5 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-400 mb-2">Program</p>
                    <p className="text-sm font-semibold text-green-700 whitespace-pre-line">{listing.schedule}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                      <span className="text-xs font-bold text-green-600">Deschis acum</span>
                    </div>
                  </div>
                )}

                <div className="p-5 flex flex-col gap-3">
                  {listing.phone && (
                    <a
                      href={`tel:${listing.phone}`}
                      className="w-full bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black text-sm py-4 rounded-xl text-center transition-colors shadow-sm"
                    >
                      📞 Sună acum: {listing.phone}
                    </a>
                  )}
                  {wa && (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-sm py-4 rounded-xl text-center transition-colors"
                    >
                      💬 WhatsApp
                    </a>
                  )}
                  <FavoriteButton listingId={listing.id} variant="detail" />
                  <QRCodeButton
                    url={`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.moosey.ro"}/listing/${listing.id}`}
                    name={listing.name}
                  />
                </div>
              </div>

              <div className="mt-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 mb-3">Informații rapide</p>
                <div className="flex flex-col gap-2 text-sm font-semibold text-gray-600">
                  {age      && <div className="flex items-center gap-2"><span>👶</span> Vârstă: {age}</div>}
                  {listing.address && <div className="flex items-center gap-2"><span>📍</span> {listing.address}</div>}
                </div>
              </div>

              <div className="mt-4 text-center">
                <ClaimButton listingId={listing.id} listingName={listing.name} />
              </div>
            </div>
          </aside>

        </div>
      </main>

      {/* ── STICKY BOTTOM BUTTONS (mobile only) ── */}
      {listing.phone && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 flex gap-3 safe-area-bottom">
          <a
            href={`tel:${listing.phone}`}
            className="flex-1 bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black text-base rounded-2xl flex items-center justify-center gap-2 transition-colors"
            style={{ minHeight: 52 }}
          >
            📞 Sună acum
          </a>
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-base rounded-2xl flex items-center justify-center gap-2 transition-colors"
              style={{ minHeight: 52 }}
            >
              💬 WhatsApp
            </a>
          ) : (
            <button
              className="flex-1 border-2 border-[#ff5a2e] text-[#ff5a2e] font-black text-base rounded-2xl flex items-center justify-center gap-2"
              style={{ minHeight: 52 }}
            >
              💬 Mesaj
            </button>
          )}
        </div>
      )}

    </div>
  );
}
