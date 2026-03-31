"use client";

import { useState } from "react";
import ListingCard, { Listing } from "@/app/components/ListingCard";
import EmptyState from "@/app/components/EmptyState";

const FILTER_BTN = "px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors";
const ACTIVE = "bg-[#ff5a2e] text-white border-[#ff5a2e]";
const INACTIVE = "bg-white text-gray-600 border-gray-200 hover:border-[#ff5a2e] hover:text-[#ff5a2e]";

const TYPES = [
  { value: "toate",        label: "✨ Toate" },
  { value: "sport",        label: "⚽ Sport" },
  { value: "atelier",      label: "🖌️ Arte" },
  { value: "curs",         label: "🎨 Cursuri" },
  { value: "limbi-straine",label: "🌍 Limbi străine" },
];

export default function FilteredCursuri({ listings }: { listings: Listing[] }) {
  const [type, setType]   = useState("toate");
  const [price, setPrice] = useState<"toate" | "gratuit" | "platit">("toate");

  const filtered = listings.filter((l) => {
    if (type !== "toate" && l.category !== type) return false;
    const isFree = l.price?.toLowerCase() === "gratuit";
    if (price === "gratuit" && !isFree) return false;
    if (price === "platit" && isFree) return false;
    return true;
  });

  return (
    <>
      {/* Type filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-3">
        {TYPES.map(({ value, label }) => (
          <button key={value} onClick={() => setType(value)} className={`flex-none ${FILTER_BTN} ${type === value ? ACTIVE : INACTIVE}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Price filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(["toate", "gratuit", "platit"] as const).map((v) => (
          <button key={v} onClick={() => setPrice(v)} className={`${FILTER_BTN} ${price === v ? ACTIVE : INACTIVE}`}>
            {v === "toate" ? "💰 Toate prețurile" : v === "gratuit" ? "🎁 Gratuit" : "💳 Cu plată"}
          </button>
        ))}
      </div>

      <p className="text-sm font-semibold text-gray-400 mb-4">
        {filtered.length} {filtered.length === 1 ? "curs găsit" : "cursuri găsite"}
      </p>

      {filtered.length === 0 ? (
        <EmptyState title="Niciun curs găsit" subtitle="Încearcă alt tip de activitate sau preț." />
      ) : (
        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
          {filtered.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </>
  );
}
