import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import DescriptionCollapse from "./DescriptionCollapse";
import ListingGallery from "./ListingGallery";

const CATEGORY_META: Record<string, { emoji: string; label: string; tagColor: string; gradientFrom: string; gradientTo: string }> = {
  "loc-de-joaca": { emoji: "🛝", label: "Loc de joacă",   tagColor: "bg-orange-100 text-orange-700", gradientFrom: "from-orange-100", gradientTo: "to-orange-200" },
  "educatie":     { emoji: "🎓", label: "Educație",        tagColor: "bg-green-100 text-green-700",   gradientFrom: "from-green-100",  gradientTo: "to-green-200"  },
  "curs-atelier": { emoji: "🎨", label: "Curs & Atelier", tagColor: "bg-purple-100 text-purple-700", gradientFrom: "from-purple-100", gradientTo: "to-purple-200" },
  "sport":        { emoji: "⚽", label: "Sport",          tagColor: "bg-sky-100 text-sky-700",       gradientFrom: "from-sky-100",    gradientTo: "to-sky-200"    },
  "spectacol":    { emoji: "🎭", label: "Spectacol",       tagColor: "bg-rose-100 text-rose-700",     gradientFrom: "from-rose-100",   gradientTo: "to-rose-200"   },
  "eveniment":    { emoji: "🎪", label: "Eveniment",       tagColor: "bg-pink-100 text-pink-700",     gradientFrom: "from-pink-100",   gradientTo: "to-pink-200"   },
};
const DEFAULT_META = { emoji: "📍", label: "Activitate", tagColor: "bg-gray-100 text-gray-700", gradientFrom: "from-gray-100", gradientTo: "to-gray-200" };

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

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!listing) notFound();

  const meta = CATEGORY_META[listing.category ?? ""] ?? DEFAULT_META;
  const age = formatAge(listing.age_min, listing.age_max);
  const isFree = listing.price?.toLowerCase() === "gratuit";
  const wa = whatsappLink(listing.phone);

  const photos: string[] = listing.images ?? [];

  return (
    <div className="min-h-screen bg-white">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <a
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors text-gray-600 shrink-0"
            aria-label="Înapoi"
          >
            ←
          </a>
          <h1 className="text-base font-bold text-[#1a1a2e] truncate">{listing.name}</h1>
        </div>
      </header>

      {/* ── GALLERY ── */}
      <ListingGallery
        images={photos}
        emoji={meta.emoji}
        gradientFrom={meta.gradientFrom}
        gradientTo={meta.gradientTo}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6">


        <div className="flex flex-col lg:flex-row gap-8 pb-32 lg:pb-16">

          {/* ── MAIN COLUMN ── */}
          <div className="flex-1 min-w-0 pt-4 lg:pt-0">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-4 flex-wrap">
              <a href="/" className="hover:text-[#ff5a2e] transition-colors">Acasă</a>
              <span>›</span>
              <a href="/" className="hover:text-[#ff5a2e] transition-colors">{meta.label}</a>
              <span>›</span>
              <span className="text-gray-600 truncate max-w-[160px]">{listing.name}</span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`${meta.tagColor} text-xs font-bold px-3 py-1.5 rounded-full`}>
                {meta.emoji} {meta.label}
              </span>
              {listing.is_verified && (
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
                  ✓ Verificat
                </span>
              )}
            </div>

            {/* Title + rating */}
            <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a2e] leading-tight mb-2">
              {listing.name}
            </h2>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-5">
              <span className="text-yellow-400">★★★★★</span>
              <span className="text-gray-800 font-bold">4.8</span>
              <span className="text-gray-400">(24 recenzii)</span>
              {listing.city && <span>· 📍 {listing.city}</span>}
            </div>

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
                  <p className="text-sm font-semibold text-gray-700 whitespace-pre-line leading-relaxed">
                    {listing.price_details}
                  </p>
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

            {/* Reviews */}
            <section className="mb-6">
              <h3 className="text-lg font-black text-[#1a1a2e] mb-3">Recenzii</h3>
              {[
                { name: "Maria P.", date: "Martie 2025", text: "Copiii s-au distrat extraordinar! Spațiu curat, personal amabil. Revenim cu siguranță.", stars: 5 },
                { name: "Andrei T.", date: "Februarie 2025", text: "Locul ideal pentru o după-amiază ploioasă. Cafeteria pentru părinți este un bonus excelent.", stars: 5 },
                { name: "Elena M.", date: "Ianuarie 2025", text: "Foarte ok, dar weekendurile sunt cam aglomerate. Recomand în cursul săptămânii.", stars: 4 },
              ].map((r) => (
                <div key={r.name} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#ff5a2e]/10 flex items-center justify-center font-black text-[#ff5a2e] text-sm shrink-0">
                        {r.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm leading-none">{r.name}</p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{r.date}</p>
                      </div>
                    </div>
                    <span className="text-yellow-400 text-sm">{"★".repeat(r.stars)}</span>
                  </div>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed">{r.text}</p>
                </div>
              ))}
            </section>

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
                  <button className="w-full text-gray-400 hover:text-gray-600 font-semibold text-xs py-2 transition-colors">
                    🔖 Salvează locul
                  </button>
                </div>
              </div>

              <div className="mt-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 mb-3">Informații rapide</p>
                <div className="flex flex-col gap-2 text-sm font-semibold text-gray-600">
                  {age      && <div className="flex items-center gap-2"><span>👶</span> Vârstă: {age}</div>}
                  {listing.address && <div className="flex items-center gap-2"><span>📍</span> {listing.address}</div>}
                </div>
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
