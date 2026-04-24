"use client";

import { useState } from "react";
import type { Listing } from "@/app/components/ListingCard";
import ListingCard from "@/app/components/ListingCard";
import EmptyState from "@/app/components/EmptyState";

type ListingWithSub = Listing & { subcategory?: string | null };

const FILTER_BTN = "px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors";
const ACTIVE = "bg-[#ff5a2e] text-white border-[#ff5a2e]";
const INACTIVE = "bg-white text-gray-600 border-gray-200 hover:border-[#ff5a2e] hover:text-[#ff5a2e]";

const SUBCATS = [
  { value: "toate",        label: "📋 Toate" },
  { value: "gradinita",    label: "🌱 Grădiniță" },
  { value: "scoala",       label: "🏫 Școală" },
  { value: "after-school", label: "📚 After School" },
];

export default function FilteredEducatie({ listings }: { listings: ListingWithSub[] }) {
  const [subcat, setSubcat] = useState("toate");

  const filtered = listings.filter((l) => {
    if (subcat === "toate") return true;
    const sub = l.subcategory?.trim().toLowerCase() ?? "";
    // ilike equivalent — partial, case-insensitive match
    return sub.includes(subcat.toLowerCase());
  });

  return (
    <>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-6">
        {SUBCATS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSubcat(value)}
            className={`flex-none ${FILTER_BTN} ${subcat === value ? ACTIVE : INACTIVE}`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="text-sm font-semibold text-gray-400 mb-4">
        {filtered.length} {filtered.length === 1 ? "locație găsită" : "locații găsite"}
      </p>

      {filtered.length === 0 ? (
        <EmptyState title="Nicio locație găsită" subtitle="Încearcă alt filtru de subcategorie." />
      ) : (
        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
          {filtered.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </>
  );
}
