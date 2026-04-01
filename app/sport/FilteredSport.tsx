"use client";

import { useState } from "react";
import ListingCard, { Listing } from "@/app/components/ListingCard";
import EmptyState from "@/app/components/EmptyState";

const FILTER_BTN = "px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors";
const ACTIVE = "bg-[#ff5a2e] text-white border-[#ff5a2e]";
const INACTIVE = "bg-white text-gray-600 border-gray-200 hover:border-[#ff5a2e] hover:text-[#ff5a2e]";

const FILTERS = [
  { value: "toate",         label: "✨ Toate" },
  { value: "fotbal",        label: "⚽ Fotbal" },
  { value: "baschet",       label: "🏀 Baschet" },
  { value: "inot",          label: "🏊 Înot" },
  { value: "dans-balet",    label: "💃 Dans & Balet" },
  { value: "arte-martiale", label: "🥋 Arte Marțiale" },
];

// Mapare din valorile din DB → grupul de filtre
const SUBCAT_TO_GROUP: Record<string, string> = {
  "Fotbal":        "fotbal",
  "Baschet":       "baschet",
  "Înot":          "inot",
  "Dans+Balet":    "dans-balet",
  "Balet":         "dans-balet",
  "Taekwon-Do":    "arte-martiale",
  "Arte Marțiale": "arte-martiale",
};

export default function FilteredSport({ listings }: { listings: Listing[] }) {
  const [filter, setFilter] = useState("toate");

  const filtered = listings.filter((l) => {
    if (filter === "toate") return true;
    const group = SUBCAT_TO_GROUP[l.subcategory?.trim() ?? ""];
    return group === filter;
  });

  return (
    <>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-6">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`flex-none ${FILTER_BTN} ${filter === value ? ACTIVE : INACTIVE}`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="text-sm font-semibold text-gray-400 mb-4">
        {filtered.length} {filtered.length === 1 ? "club găsit" : "cluburi găsite"}
      </p>

      {filtered.length === 0 ? (
        <EmptyState title="Niciun club găsit" subtitle="Încearcă altă disciplină sportivă." />
      ) : (
        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
          {filtered.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </>
  );
}
