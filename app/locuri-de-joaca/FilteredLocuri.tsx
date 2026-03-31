"use client";

import { useState } from "react";
import ListingCard, { Listing } from "@/app/components/ListingCard";
import EmptyState from "@/app/components/EmptyState";

const FILTER_BTN = "px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors";
const ACTIVE = "bg-[#ff5a2e] text-white border-[#ff5a2e]";
const INACTIVE = "bg-white text-gray-600 border-gray-200 hover:border-[#ff5a2e] hover:text-[#ff5a2e]";

export default function FilteredLocuri({ listings }: { listings: Listing[] }) {
  const [space, setSpace] = useState<"toate" | "indoor" | "outdoor">("toate");
  const [price, setPrice] = useState<"toate" | "gratuit" | "platit">("toate");

  const filtered = listings.filter((l) => {
    const isFree = l.price?.toLowerCase() === "gratuit";
    if (price === "gratuit" && !isFree) return false;
    if (price === "platit" && isFree) return false;
    // indoor/outdoor: aplică pe descriere/adresă ca euristică
    if (space === "indoor" && !l.description?.toLowerCase().includes("indoor")) return false;
    if (space === "outdoor" && !l.description?.toLowerCase().includes("parc") && !l.description?.toLowerCase().includes("aer liber") && !l.description?.toLowerCase().includes("outdoor")) return false;
    return true;
  });

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-2 flex-wrap">
          {(["toate", "indoor", "outdoor"] as const).map((v) => (
            <button key={v} onClick={() => setSpace(v)} className={`${FILTER_BTN} ${space === v ? ACTIVE : INACTIVE}`}>
              {v === "toate" ? "🏠 Toate" : v === "indoor" ? "🏠 Indoor" : "☀️ Outdoor"}
            </button>
          ))}
        </div>
        <div className="w-px bg-gray-200 hidden sm:block self-stretch" />
        <div className="flex gap-2 flex-wrap">
          {(["toate", "gratuit", "platit"] as const).map((v) => (
            <button key={v} onClick={() => setPrice(v)} className={`${FILTER_BTN} ${price === v ? ACTIVE : INACTIVE}`}>
              {v === "toate" ? "💰 Toate prețurile" : v === "gratuit" ? "🎁 Gratuit" : "💳 Cu plată"}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-sm font-semibold text-gray-400 mb-4">
        {filtered.length} {filtered.length === 1 ? "rezultat" : "rezultate"} afișate
      </p>

      {/* Cards */}
      {filtered.length === 0 ? (
        <EmptyState title="Niciun loc de joacă găsit" subtitle="Încearcă să schimbi filtrele de mai sus." />
      ) : (
        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
          {filtered.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </>
  );
}
