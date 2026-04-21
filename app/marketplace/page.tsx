"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/app/components/Navbar";
import MarketplaceCard, { type MarketplaceListing } from "./_components/MarketplaceCard";

// ── Constants ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Toate",
  "Cărucioare & scaune auto",
  "Îmbrăcăminte",
  "Jucării",
  "Cărți & educație",
  "Mobilier copii",
  "Accesorii bebeluș",
  "Echipament sport",
  "Altele",
];

const TYPES = ["Toate", "Vând", "Donez", "Închiriez"];

const TYPE_VALUES: Record<string, string> = {
  "Vând":     "vand",
  "Donez":    "donez",
  "Închiriez": "inchiriez",
};

const SORTS = [
  { label: "Cele mai noi",       value: "newest"    },
  { label: "Preț crescător",     value: "price_asc" },
  { label: "Preț descrescător",  value: "price_desc"},
];

// ── Skeleton ───────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[4/3] bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-100 rounded-lg w-full" />
        <div className="h-4 bg-gray-100 rounded-lg w-2/3" />
        <div className="h-6 bg-gray-100 rounded-lg w-1/3" />
        <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
          <div className="w-6 h-6 bg-gray-100 rounded-full" />
          <div className="h-3 bg-gray-100 rounded-lg w-24" />
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toate");
  const [type, setType] = useState("Toate");
  const [sort, setSort] = useState("newest");

  // ── Fetch ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const supabase = createClient();

    async function fetchListings() {
      setLoading(true);
      const { data } = await supabase
        .from("marketplace_listings")
        .select("*, profiles(full_name, avatar_url)")
        .eq("status", "activ")
        .order("created_at", { ascending: false });

      setListings((data as MarketplaceListing[]) ?? []);
      setLoading(false);
    }

    fetchListings();
  }, []);

  // ── Client-side filtering + sorting ───────────────────────────────────

  const filtered = useMemo(() => {
    let result = [...listings];

    // Text search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          (l.description ?? "").toLowerCase().includes(q)
      );
    }

    // Category
    if (category !== "Toate") {
      result = result.filter((l) => l.category === category);
    }

    // Type
    if (type !== "Toate") {
      result = result.filter((l) => l.type === TYPE_VALUES[type]);
    }

    // Sort
    if (sort === "price_asc") {
      result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sort === "price_desc") {
      result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }
    // "newest" stays in DB order (created_at DESC)

    return result;
  }, [listings, search, category, type, sort]);

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      {/* ── HERO ── */}
      <section className="bg-gradient-to-b from-white to-[#fff5f3] pt-14 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-orange-100 text-[#ff5a2e] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-7 shadow-sm">
            <span>🛍️</span> Sibiu
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#1a1a2e] mb-4 leading-[1.1]">
            Marketplace pentru copii
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            Cumpără, vinde sau donează obiecte pentru copii din Sibiu
          </p>
          <a
            href="/marketplace/adauga"
            className="inline-flex items-center gap-2 bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-semibold px-7 py-3.5 rounded-full transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <span>+</span> Adaugă anunț
          </a>
        </div>
      </section>

      {/* ── FILTERS (sticky sub navbar) ── */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 space-y-2.5">

          {/* Row 1: Search */}
          <div className="relative max-w-sm">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Caută anunțuri..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:border-[#ff5a2e] focus:outline-none text-sm font-medium text-gray-700 placeholder-gray-400 transition-colors bg-white"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg transition-colors"
              >
                ×
              </button>
            )}
          </div>

          {/* Row 2: Category pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-none text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all duration-150 whitespace-nowrap ${
                  category === cat
                    ? "bg-[#ff5a2e] text-white border-[#ff5a2e]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#ff5a2e] hover:text-[#ff5a2e]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Row 3: Type pills + Sort */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Type pills */}
            <div className="flex gap-1.5">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-150 ${
                    type === t
                      ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Sort — pushed right */}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-gray-400 hidden sm:inline">Sortează:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-xs font-medium text-gray-600 border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#ff5a2e] bg-white cursor-pointer"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── GRID ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          /* Skeleton */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-semibold text-gray-700 mb-1">Niciun anunț găsit</p>
            <p className="text-sm text-gray-400 mb-7">
              {search || category !== "Toate" || type !== "Toate"
                ? "Încearcă alte filtre sau resetează căutarea."
                : "Fii primul care adaugă un anunț!"}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {(search || category !== "Toate" || type !== "Toate") && (
                <button
                  onClick={() => { setSearch(""); setCategory("Toate"); setType("Toate"); }}
                  className="text-sm font-semibold text-gray-500 border border-gray-200 px-5 py-2.5 rounded-full hover:border-gray-400 transition-colors"
                >
                  Resetează filtrele
                </button>
              )}
              <a
                href="/marketplace/adauga"
                className="inline-block bg-[#ff5a2e] text-white font-semibold px-6 py-2.5 rounded-full hover:bg-[#f03d12] transition-colors text-sm"
              >
                + Adaugă anunț
              </a>
            </div>
          </div>
        ) : (
          /* Results */
          <>
            <p className="text-xs text-gray-400 mb-5 font-medium">
              {filtered.length} {filtered.length === 1 ? "anunț" : "anunțuri"} găsite
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((listing) => (
                <MarketplaceCard key={listing.id} listing={listing} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
