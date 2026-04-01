import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import MobileMenu from "./MobileMenu";

const CATEGORY_META: Record<string, { emoji: string; label: string; tagColor: string; gradientFrom: string; gradientTo: string }> = {
  "loc-de-joaca": { emoji: "🛝", label: "Loc de joacă",   tagColor: "bg-orange-100 text-orange-700", gradientFrom: "from-orange-50", gradientTo: "to-orange-100" },
  "educatie":     { emoji: "🎓", label: "Educație",        tagColor: "bg-green-100 text-green-700",   gradientFrom: "from-green-50",  gradientTo: "to-green-100"  },
  "curs-atelier": { emoji: "🎨", label: "Curs & Atelier", tagColor: "bg-purple-100 text-purple-700", gradientFrom: "from-purple-50", gradientTo: "to-purple-100" },
  "sport":        { emoji: "⚽", label: "Sport",          tagColor: "bg-sky-100 text-sky-700",       gradientFrom: "from-sky-50",    gradientTo: "to-sky-100"    },
  "spectacol":    { emoji: "🎭", label: "Spectacol",       tagColor: "bg-rose-100 text-rose-700",     gradientFrom: "from-rose-50",   gradientTo: "to-rose-100"   },
  "eveniment":    { emoji: "🎪", label: "Eveniment",       tagColor: "bg-pink-100 text-pink-700",     gradientFrom: "from-pink-50",   gradientTo: "to-pink-100"   },
};
const DEFAULT_META = { emoji: "📍", label: "Activitate", tagColor: "bg-gray-100 text-gray-700", gradientFrom: "from-gray-50", gradientTo: "to-gray-100" };

function formatAge(min: number | null, max: number | null) {
  if (min == null && max == null) return null;
  if (min == null) return `până la ${max} ani`;
  if (max == null) return `${min}+ ani`;
  return `${min}–${max} ani`;
}

const categories = [
  { icon: "🛝", label: "Locuri de joacă",   href: "/locuri-de-joaca",  bg: "bg-orange-50", border: "border-orange-200" },
  { icon: "🎓", label: "Educație",           href: "/educatie",         bg: "bg-green-50",  border: "border-green-200"  },
  { icon: "🎨", label: "Cursuri & Ateliere", href: "/cursuri-ateliere", bg: "bg-purple-50", border: "border-purple-200" },
  { icon: "⚽", label: "Sport",             href: "/sport",            bg: "bg-sky-50",    border: "border-sky-200"    },
  { icon: "🎭", label: "Spectacole",         href: "/spectacole",       bg: "bg-rose-50",   border: "border-rose-200"   },
  { icon: "🎪", label: "Evenimente",         href: "/evenimente",       bg: "bg-pink-50",   border: "border-pink-200"   },
];

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: featured } = await supabase
    .from("listings")
    .select("id, name, category, description, address, price, age_min, age_max")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <div className="min-h-screen bg-white">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🧡</span>
            <span className="text-xl font-black text-[#ff5a2e] tracking-tight">KidsApp</span>
            <span className="hidden sm:inline text-base font-semibold text-gray-400 ml-0.5">Sibiu</span>
          </a>

          {/* Desktop: newsletter pill + nav + CTA */}
          <a
            href="#newsletter"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#ff5a2e] transition-colors border border-gray-200 hover:border-[#ff5a2e]/30 rounded-full px-3 py-1.5"
          >
            <span>📩</span> Newsletter
          </a>
          <nav className="hidden md:flex items-center gap-3 text-sm font-semibold text-gray-500">
            <a href="/locuri-de-joaca"  className="hover:text-[#ff5a2e] transition-colors">🛝 Joacă</a>
            <a href="/educatie"         className="hover:text-[#ff5a2e] transition-colors">🎓 Educație</a>
            <a href="/cursuri-ateliere" className="hover:text-[#ff5a2e] transition-colors">🎨 Cursuri</a>
            <a href="/sport"            className="hover:text-[#ff5a2e] transition-colors">⚽ Sport</a>
            <a href="/spectacole"       className="hover:text-[#ff5a2e] transition-colors">🎭 Spectacole</a>
            <a href="/evenimente"       className="hover:text-[#ff5a2e] transition-colors">🎪 Evenimente</a>
          </nav>
          <button className="hidden md:block bg-[#ff5a2e] hover:bg-[#f03d12] text-white text-base font-bold px-5 py-2.5 rounded-full transition-colors shadow-sm whitespace-nowrap">
            + Adaugă locația ta
          </button>

          {/* Mobile: hamburger only */}
          <MobileMenu />
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-[#fff4f0] via-[#fff8f5] to-white pt-10 pb-12 px-4 sm:pt-14 sm:pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-bold px-4 py-2 rounded-full mb-6">
            <span>📍</span> Sibiu, România
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#1a1a2e] leading-tight mb-4 text-balance">
            Ce facem cu copilul<br />
            <span className="text-[#ff5a2e]">în Sibiu?</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium mb-8 max-w-xl mx-auto leading-relaxed">
            Descoperă sute de activități, locuri de joacă și evenimente pentru copii de toate vârstele.
          </p>

          {/* Search bar — stacked on mobile, inline on sm+ */}
          <div className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.10)] border border-gray-100 overflow-hidden">
              <div className="flex items-center flex-1 px-4 py-1">
                <span className="text-gray-400 text-xl mr-3">🔍</span>
                <input
                  type="text"
                  placeholder="Caută activități, locuri, cursuri..."
                  className="flex-1 py-4 text-base font-medium text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                />
              </div>
              <button className="bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-bold px-6 py-4 text-base transition-colors sm:m-2 sm:rounded-xl sm:py-3 whitespace-nowrap">
                Caută
              </button>
            </div>
          </div>

          <p className="mt-5 text-base text-gray-400 font-medium">
            Popular:{" "}
            <span className="text-gray-600 cursor-pointer hover:text-[#ff5a2e] transition-colors">Loc de joacă</span>
            {" · "}
            <span className="text-gray-600 cursor-pointer hover:text-[#ff5a2e] transition-colors">Piscină</span>
            {" · "}
            <span className="text-gray-600 cursor-pointer hover:text-[#ff5a2e] transition-colors">Ateliere weekend</span>
          </p>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-10 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black text-[#1a1a2e] mb-5 px-4 sm:px-6">Explorează după categorie</h2>

          {/* Mobile: horizontal scroll */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 pb-2 md:hidden">
            {categories.map((cat) => (
              <a
                key={cat.label}
                href={cat.href}
                className={`flex-none ${cat.bg} border ${cat.border} rounded-2xl px-5 py-4 flex flex-col items-center gap-2 min-w-[100px] active:scale-95 transition-transform`}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-bold text-gray-700 text-center leading-tight whitespace-nowrap">{cat.label}</span>
              </a>
            ))}
          </div>

          {/* Desktop: grid */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-3 px-6">
            {categories.map((cat) => (
              <a
                key={cat.label}
                href={cat.href}
                className={`${cat.bg} border ${cat.border} rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group`}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
                <span className="text-sm font-bold text-gray-700 text-center leading-tight">{cat.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECOMMENDED ── */}
      <section className="pb-14 sm:pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-5 px-4 sm:px-6">
            <h2 className="text-2xl font-black text-[#1a1a2e]">Recomandate această săptămână</h2>
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
                {featured.map((listing) => {
                  const meta = CATEGORY_META[listing.category ?? ""] ?? DEFAULT_META;
                  const age = formatAge(listing.age_min, listing.age_max);
                  const isFree = listing.price?.toLowerCase() === "gratuit";
                  return (
                    <a
                      key={listing.id}
                      href={`/listing/${listing.id}`}
                      className="flex-none w-72 snap-start bg-white rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden block active:scale-[.98] transition-transform"
                    >
                      <div className={`h-40 bg-gradient-to-br ${meta.gradientFrom} ${meta.gradientTo} flex items-center justify-center relative`}>
                        <span className="text-6xl">{meta.emoji}</span>
                        <span className={`absolute top-3 left-3 ${meta.tagColor} text-xs font-bold px-3 py-1 rounded-full`}>
                          {meta.label}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-black text-[#1a1a2e] text-lg leading-snug mb-2">{listing.name}</h3>
                        {listing.description && (
                          <p className="text-gray-500 text-base font-medium leading-relaxed mb-3 line-clamp-2">
                            {listing.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            {listing.address && <span className="text-sm text-gray-400 font-semibold">📍 {listing.address}</span>}
                            {age && <span className="text-sm text-gray-400 font-semibold">👶 {age}</span>}
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

              {/* Desktop: grid */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-5 px-6">
                {featured.map((listing) => {
                  const meta = CATEGORY_META[listing.category ?? ""] ?? DEFAULT_META;
                  const age = formatAge(listing.age_min, listing.age_max);
                  const isFree = listing.price?.toLowerCase() === "gratuit";
                  return (
                    <a
                      key={listing.id}
                      href={`/listing/${listing.id}`}
                      className="bg-white rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.13)] border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 group block"
                    >
                      <div className={`h-44 bg-gradient-to-br ${meta.gradientFrom} ${meta.gradientTo} flex items-center justify-center relative`}>
                        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{meta.emoji}</span>
                        <span className={`absolute top-3 left-3 ${meta.tagColor} text-xs font-bold px-3 py-1 rounded-full`}>
                          {meta.label}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-black text-[#1a1a2e] text-lg leading-snug mb-3">{listing.name}</h3>
                        {listing.description && (
                          <p className="text-gray-500 text-base font-medium leading-relaxed mb-4 line-clamp-2">
                            {listing.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            {listing.address && <span className="text-sm text-gray-400 font-semibold">📍 {listing.address}</span>}
                            {age && <span className="text-sm text-gray-400 font-semibold">👶 {age}</span>}
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

          <div className="mt-6 text-center md:hidden px-4">
            <a href="#" className="inline-block w-full bg-orange-50 text-[#ff5a2e] font-black text-base py-4 rounded-2xl">
              Vezi toate activitățile →
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-[#ff5a2e] mx-4 sm:mx-6 lg:mx-auto lg:max-w-6xl rounded-3xl p-8 sm:p-12 mb-14 text-center text-white">
        <div className="text-4xl mb-3">🏫</div>
        <h2 className="text-2xl sm:text-3xl font-black mb-3">Ai un loc special pentru copii?</h2>
        <p className="text-orange-100 text-base font-medium mb-6 max-w-md mx-auto leading-relaxed">
          Adaugă grădinița, centrul de activități sau locul de joacă și ajunge la mii de părinți din Sibiu.
        </p>
        <button className="bg-white text-[#ff5a2e] font-black text-base px-8 py-4 rounded-full hover:bg-orange-50 transition-colors shadow-md">
          Înregistrează-te gratuit
        </button>
      </section>

      {/* ── NEWSLETTER ── */}
      <section id="newsletter" className="bg-[#ff5a2e] py-10 px-4">
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
            <button className="bg-white text-[#ff5a2e] font-black px-6 py-4 rounded-xl hover:bg-orange-50 transition-colors text-base whitespace-nowrap">
              Abonează-mă
            </button>
          </div>
          <p className="mt-4 text-orange-200 text-sm font-medium">
            Fără spam. Dezabonare oricând. 💌
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧡</span>
              <span className="font-black text-[#ff5a2e] text-lg">KidsApp</span>
              <span className="text-gray-400 font-medium text-base">— Sibiu</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-5 text-base font-semibold text-gray-500">
              <a href="#" className="hover:text-[#ff5a2e] transition-colors">Despre noi</a>
              <a href="#" className="hover:text-[#ff5a2e] transition-colors">Contact</a>
              <a href="#" className="hover:text-[#ff5a2e] transition-colors">Adaugă locația</a>
              <a href="#" className="hover:text-[#ff5a2e] transition-colors">Confidențialitate</a>
            </nav>
          </div>
          <p className="text-center text-sm text-gray-400 font-medium mt-6">
            © 2025 KidsApp Sibiu. Făcut cu 🧡 pentru familiile din Sibiu.
          </p>
        </div>
      </footer>

    </div>
  );
}
