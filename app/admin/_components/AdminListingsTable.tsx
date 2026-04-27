"use client";

import { useState } from "react";
import DeleteButton from "./DeleteButton";
import { deleteListing } from "../actions";

const CATEGORY_LABELS: Record<string, string> = {
  "loc-de-joaca":  "🛝 Loc de joacă",
  "educatie":      "🎓 Educație",
  "curs-atelier":  "🎨 Cursuri & Ateliere",
  "sport":         "⚽ Sport",
  "spectacol":     "🎭 Spectacol",
  "eveniment":     "🎉 Eveniment",
};

const CATEGORIES = [
  { slug: "toate",        name: "Toate" },
  { slug: "loc-de-joaca", name: "🛝 Playground" },
  { slug: "educatie",     name: "🎓 Educație" },
  { slug: "curs-atelier", name: "🎨 Cursuri & Ateliere" },
  { slug: "sport",        name: "⚽ Sport" },
  { slug: "spectacol",    name: "🎭 Spectacole" },
  { slug: "eveniment",    name: "🎉 Evenimente" },
];

type Listing = {
  id: string;
  name: string;
  category: string | null;
  city: string | null;
  is_verified: boolean;
  is_featured: boolean;
  created_at: string;
};

export default function AdminListingsTable({ items }: { items: Listing[] }) {
  const [selectedCategory, setSelectedCategory] = useState("toate");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = items
    .filter((l) => selectedCategory === "toate" || l.category === selectedCategory)
    .filter((l) => !searchQuery || l.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-gray-800">Toate listingurile</h2>
          <span className="text-sm text-gray-400 font-medium">{filtered.length} / {items.length}</span>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Caută după nume..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#ff5a2e] focus:ring-2 focus:ring-[#ff5a2e]/20 transition-all"
        />

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(({ slug, name }) => (
            <button
              key={slug}
              onClick={() => setSelectedCategory(slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                selectedCategory === slug
                  ? "bg-[#ff5a2e] text-white border-[#ff5a2e]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#ff5a2e] hover:text-[#ff5a2e]"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-2xl mb-2">🔍</p>
          <p className="font-bold text-gray-500">Niciun listing găsit.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 font-bold text-gray-500">Nume</th>
                <th className="text-left px-4 py-3 font-bold text-gray-500">Categorie</th>
                <th className="text-left px-4 py-3 font-bold text-gray-500">Oraș</th>
                <th className="text-center px-4 py-3 font-bold text-gray-500">Verificat</th>
                <th className="text-center px-4 py-3 font-bold text-gray-500">Featured</th>
                <th className="text-right px-5 py-3 font-bold text-gray-500">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => {
                const deleteWithId = deleteListing.bind(null, l.id);
                return (
                  <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-gray-800 max-w-[200px] truncate">
                      {l.name}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500">
                      {CATEGORY_LABELS[l.category ?? ""] ?? l.category ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500">{l.city ?? "—"}</td>
                    <td className="px-4 py-3.5 text-center">
                      {l.is_verified
                        ? <span className="text-green-500 font-bold">✓</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {l.is_featured
                        ? <span className="text-purple-500 font-bold">⭐</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <a
                        href={`/admin/edit/${l.id}`}
                        className="text-sm font-bold text-[#ff5a2e] hover:underline mr-2"
                      >
                        Edit
                      </a>
                      <DeleteButton action={deleteWithId} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
