"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
  { key: "", label: "Toate" },
  { key: "loc-de-joaca", label: "🛝 Locuri de joacă" },
  { key: "educatie", label: "🎓 Educație" },
  { key: "curs-atelier", label: "🎨 Cursuri" },
  { key: "sport", label: "⚽ Sport" },
  { key: "spectacol", label: "🎭 Spectacole" },
  { key: "eveniment", label: "🎪 Evenimente" },
];

const SORTS = [
  { key: "relevanta", label: "Relevanță" },
  { key: "alfabetic", label: "Alfabetic" },
  { key: "nou", label: "Cele mai noi" },
];

export default function SearchFilters() {
  const router = useRouter();
  const sp = useSearchParams();
  const q = sp.get("q") ?? "";
  const cat = sp.get("cat") ?? "";
  const sort = sp.get("sort") ?? "relevanta";

  function navigate(newCat: string, newSort: string) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (newCat) params.set("cat", newCat);
    if (newSort && newSort !== "relevanta") params.set("sort", newSort);
    router.push(`/cauta?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => navigate(c.key, sort)}
            className={`text-xs font-bold px-3.5 py-2 rounded-full transition-all ${
              cat === c.key
                ? "bg-[#ff5a2e] text-white shadow-sm"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-gray-400">Sortare:</span>
        {SORTS.map((s) => (
          <button
            key={s.key}
            onClick={() => navigate(cat, s.key)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
              sort === s.key || (s.key === "relevanta" && !sort)
                ? "bg-[#1a1a2e] text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
