"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CATEGORY_META } from "./ListingCard";

type SuggListing = { id: string; name: string; category: string | null; address: string | null };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SuggEvent = { id: string; title: string; event_date: string; listing_id: string; listings: any };

export default function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [listings, setListings] = useState<SuggListing[]>([]);
  const [events, setEvents] = useState<SuggEvent[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setListings([]); setEvents([]); setOpen(false);
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setListings(data.listings ?? []);
        setEvents(data.events ?? []);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query]);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/cauta?q=${encodeURIComponent(query.trim())}`);
  }

  const hasSugg = listings.length > 0 || events.length > 0;

  return (
    <div ref={containerRef} className="relative max-w-xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl shadow-[0_8px_32px_rgba(255,90,46,0.12)] border-2 border-transparent focus-within:border-[#ff5a2e] transition-all duration-200 overflow-visible">
          <div className="flex items-center flex-1 px-4 py-1">
            <span className="text-gray-400 text-xl mr-3 shrink-0 select-none">
              {loading ? "⏳" : "🔍"}
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
              onFocus={() => hasSugg && setOpen(true)}
              placeholder="Caută activități, locuri, cursuri..."
              autoComplete="off"
              className="flex-1 py-4 text-base font-medium text-gray-700 placeholder-gray-400 outline-none bg-transparent"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); setOpen(false); }}
                className="ml-1 text-gray-300 hover:text-gray-500 text-lg transition-colors shrink-0"
                aria-label="Șterge"
              >
                ×
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#ff5a2e] hover:bg-[#f03d12] active:scale-[0.98] text-white font-bold px-6 py-4 text-base transition-all sm:m-2 sm:rounded-xl sm:py-3 whitespace-nowrap rounded-b-2xl sm:rounded-b-xl"
          >
            Caută
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {open && hasSugg && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.14)] border border-gray-100 overflow-hidden z-50">
          {listings.map((l, i) => {
            const meta = CATEGORY_META[l.category ?? ""];
            return (
              <a
                key={l.id}
                href={`/listing/${l.id}`}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors ${i < listings.length - 1 || events.length > 0 ? "border-b border-gray-50" : ""}`}
              >
                <span className="text-xl shrink-0">{meta?.emoji ?? "📍"}</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#1a1a2e] truncate">{l.name}</p>
                  <p className="text-xs text-gray-400 font-semibold truncate">
                    {meta?.label ?? "Activitate"}{l.address ? ` · ${l.address}` : ""}
                  </p>
                </div>
              </a>
            );
          })}
          {events.map((ev, i) => {
            const dateObj = ev.event_date ? new Date(ev.event_date) : null;
            const dateLabel = dateObj
              ? dateObj.toLocaleDateString("ro-RO", { day: "numeric", month: "short", timeZone: "UTC" })
              : "";
            return (
              <a
                key={ev.id}
                href={`/listing/${ev.listing_id}`}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors ${i < events.length - 1 ? "border-b border-gray-50" : ""}`}
              >
                <span className="text-xl shrink-0">📅</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#1a1a2e] truncate">{ev.title}</p>
                  <p className="text-xs text-gray-400 font-semibold truncate">
                    Eveniment · {dateLabel}
                    {ev.listings?.name ? ` · ${ev.listings.name}` : ""}
                  </p>
                </div>
              </a>
            );
          })}
          {/* Search all */}
          <button
            type="button"
            onClick={() => { setOpen(false); router.push(`/cauta?q=${encodeURIComponent(query.trim())}`); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 hover:bg-orange-100 text-[#ff5a2e] text-sm font-bold transition-colors border-t border-orange-100"
          >
            🔍 Vezi toate rezultatele pentru &bdquo;{query.trim()}&rdquo;
          </button>
        </div>
      )}
    </div>
  );
}
