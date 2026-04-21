"use client";

import { useState } from "react";
import ListingCard, { type Listing } from "@/app/components/ListingCard";
import MarketplaceDashboard from "./MarketplaceDashboard";

type ReviewRow = {
  id: string;
  rating: number;
  text: string | null;
  created_at: string;
  listing_id: string;
  listings: { id: string; name: string } | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ro-RO", { month: "long", year: "numeric" });
}

type Tab = "favorite" | "recenzii" | "marketplace";

export default function ContulMeuTabs({
  favListings,
  totalFavorites,
  reviews,
  userId,
}: {
  favListings: Listing[];
  totalFavorites: number;
  reviews: ReviewRow[];
  userId: string;
}) {
  const [tab, setTab] = useState<Tab>("favorite");

  return (
    <div>
      {/* ── TAB BAR ── */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-6">
        {(
          [
            { key: "favorite" as Tab,    label: "❤️ Favorite" },
            { key: "recenzii" as Tab,    label: "⭐ Recenzii" },
            { key: "marketplace" as Tab, label: "🛍️ Marketplace" },
          ] as { key: Tab; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              tab === key
                ? "bg-white text-[#1a1a2e] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── FAVORITE ── */}
      {tab === "favorite" && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-[#1a1a2e]">❤️ Locații favorite</h2>
            {totalFavorites > 0 && (
              <a href="/favorite" className="text-sm font-bold text-[#ff5a2e] hover:underline">
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
      )}

      {/* ── REVIEWS ── */}
      {tab === "recenzii" && (
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
                        <span key={n} className={n <= r.rating ? "text-yellow-400" : "text-gray-200"}>★</span>
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
      )}

      {/* ── MARKETPLACE ── */}
      {tab === "marketplace" && (
        <MarketplaceDashboard userId={userId} />
      )}
    </div>
  );
}
