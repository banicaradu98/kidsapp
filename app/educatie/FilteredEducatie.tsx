"use client";

import { useState } from "react";
import { Listing, formatAge } from "@/app/components/ListingCard";
import EmptyState from "@/app/components/EmptyState";

type ListingWithSub = Listing & { subcategory?: string | null };

const FILTER_BTN = "px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors";
const ACTIVE = "bg-[#ff5a2e] text-white border-[#ff5a2e]";
const INACTIVE = "bg-white text-gray-600 border-gray-200 hover:border-[#ff5a2e] hover:text-[#ff5a2e]";

const SUBCATS = [
  { value: "toate",        label: "📋 Toate" },
  { value: "gradinita",    label: "🌱 Grădinițe" },
  { value: "after-school", label: "📚 After-school" },
  { value: "cresa",        label: "🍼 Creșe" },
];

export default function FilteredEducatie({ listings }: { listings: ListingWithSub[] }) {
  const [subcat, setSubcat] = useState("toate");

  const filtered = listings.filter((l) => {
    if (subcat === "toate") return true;
    return l.subcategory?.trim().toLowerCase() === subcat;
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
            <a
              key={l.id}
              href={`/listing/${l.id}`}
              className="flex flex-col bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.07)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden transition-all duration-200 active:scale-[.99]"
            >
              <div className="h-32 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                <span className="text-5xl">🎓</span>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">🎓 Educație</span>
                  {l.subcategory && (
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full capitalize">{l.subcategory}</span>
                  )}
                  {formatAge(l.age_min, l.age_max) && (
                    <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full">
                      👶 {formatAge(l.age_min, l.age_max)}
                    </span>
                  )}
                  {l.is_verified && (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">✓ Autorizat</span>
                  )}
                </div>
                <h3 className="text-base font-black text-[#1a1a2e] leading-snug mb-1">{l.name}</h3>
                {l.description && (
                  <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2 mb-3">{l.description}</p>
                )}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex flex-col gap-0.5">
                    {l.schedule && <span className="text-xs text-gray-400 font-semibold">🕐 {l.schedule}</span>}
                    {l.address  && <span className="text-xs text-gray-400 font-semibold">📍 {l.address}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {l.price && (
                      <span className={`text-base font-black ${l.price.toLowerCase() === "gratuit" ? "text-green-600" : "text-[#ff5a2e]"}`}>
                        {l.price}
                      </span>
                    )}
                    <span className="text-sm font-bold text-[#ff5a2e] border border-[#ff5a2e] px-3 py-1.5 rounded-xl">
                      Detalii →
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
