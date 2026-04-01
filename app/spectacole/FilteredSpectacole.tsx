"use client";

import { useState, useMemo } from "react";
import { Listing } from "@/app/components/ListingCard";
import SpectacolCard from "./SpectacolCard";
import EmptyState from "@/app/components/EmptyState";

const MONTHS_RO = [
  "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
  "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie",
];
const DAYS_SHORT = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"];

type TemporalFilter = "this-week" | "this-month" | "upcoming" | "all";

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

const FILTERS: { value: TemporalFilter; label: string }[] = [
  { value: "this-week",  label: "📅 Această săptămână" },
  { value: "this-month", label: "📆 Luna aceasta" },
  { value: "upcoming",   label: "🔜 Urmează" },
  { value: "all",        label: "✨ Toate" },
];

export default function FilteredSpectacole({ listings }: { listings: Listing[] }) {
  const today = useMemo(() => startOfDay(new Date()), []);

  // Filter state — calendar day selection + temporal filter are MUTUALLY EXCLUSIVE:
  // - click calendar day → selectedDay set, filter = "all" (pill "Toate" highlighted)
  // - click filter pill  → selectedDay cleared, filter = selected pill
  const [filter, setFilter] = useState<TemporalFilter>("this-week");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [calMonth, setCalMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  // Days that have at least one event
  const eventDayKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const l of listings) {
      if (l.event_date) keys.add(toDateKey(new Date(l.event_date)));
    }
    return keys;
  }, [listings]);

  // Filtered listings
  const filtered = useMemo(() => {
    // Day selected in calendar → show only that day's events
    if (selectedDay) {
      return listings
        .filter((l) => l.event_date && toDateKey(new Date(l.event_date)) === selectedDay)
        .sort((a, b) => (a.event_date ?? "").localeCompare(b.event_date ?? ""));
    }

    const weekEnd = addDays(today, 7);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
    const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    return listings
      .filter((l) => {
        if (!l.event_date) return filter === "all";
        const d = new Date(l.event_date);
        switch (filter) {
          case "this-week":  return d >= today && d <= weekEnd;
          case "this-month": return d >= monthStart && d <= monthEnd;
          case "upcoming":   return d >= nextMonthStart;
          case "all":        return d >= today;
        }
      })
      .sort((a, b) => (a.event_date ?? "").localeCompare(b.event_date ?? ""));
  }, [listings, filter, selectedDay, today]);

  // Calendar helpers
  const calDays = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 0).getDate();
  const calFirstDow = (new Date(calMonth.getFullYear(), calMonth.getMonth(), 1).getDay() + 6) % 7; // Mon=0
  const todayKey = toDateKey(today);

  // Click a calendar day: set selectedDay + force filter = "all" so "Toate" pill is highlighted
  function handleDayClick(day: number) {
    const key = toDateKey(new Date(calMonth.getFullYear(), calMonth.getMonth(), day));
    if (selectedDay === key) {
      // deselect → restore default filter
      setSelectedDay(null);
      setFilter("this-week");
    } else {
      setSelectedDay(key);
      setFilter("all"); // Toate pill becomes active
    }
  }

  // Click a filter pill: clear selectedDay
  function handleFilterClick(f: TemporalFilter) {
    setFilter(f);
    setSelectedDay(null); // calendar day selection is cleared
  }

  return (
    <>
      {/* ── MINI CALENDAR ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setCalMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 text-lg font-bold transition-colors"
            aria-label="Luna anterioară"
          >‹</button>
          <span className="text-sm font-black text-[#1a1a2e]">
            {MONTHS_RO[calMonth.getMonth()]} {calMonth.getFullYear()}
          </span>
          <button
            onClick={() => setCalMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 text-lg font-bold transition-colors"
            aria-label="Luna următoare"
          >›</button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS_SHORT.map((d) => (
            <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-0.5">{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-y-0.5">
          {Array.from({ length: calFirstDow }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {Array.from({ length: calDays }).map((_, i) => {
            const day = i + 1;
            const key = toDateKey(new Date(calMonth.getFullYear(), calMonth.getMonth(), day));
            const hasEvents = eventDayKeys.has(key);
            const isToday = key === todayKey;
            const isSelected = selectedDay === key;
            const isPast = new Date(calMonth.getFullYear(), calMonth.getMonth(), day) < today;

            return (
              <button
                key={day}
                disabled={!hasEvents}
                onClick={() => hasEvents && handleDayClick(day)}
                className={`relative flex flex-col items-center justify-center py-1 rounded-xl text-xs font-bold transition-all leading-none ${
                  isSelected
                    ? "bg-[#ff5a2e] text-white"
                    : isToday && hasEvents
                    ? "bg-orange-50 text-[#ff5a2e] ring-1 ring-[#ff5a2e]/40"
                    : isToday
                    ? "text-[#ff5a2e] font-black"
                    : hasEvents
                    ? "hover:bg-orange-50 text-gray-800 cursor-pointer"
                    : isPast
                    ? "text-gray-200 cursor-default"
                    : "text-gray-300 cursor-default"
                }`}
              >
                <span>{day}</span>
                {hasEvents && (
                  <span className={`w-1 h-1 rounded-full mt-0.5 ${isSelected ? "bg-white/80" : "bg-[#ff5a2e]"}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TEMPORAL FILTERS ── */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-5">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleFilterClick(value)}
            className={`flex-none px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
              filter === value
                ? "bg-[#ff5a2e] text-white border-[#ff5a2e]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#ff5a2e] hover:text-[#ff5a2e]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Selected day indicator */}
      {selectedDay && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-bold text-[#ff5a2e] bg-orange-50 border border-orange-200 rounded-xl px-3 py-1.5">
            📅 {new Date(selectedDay + "T00:00:00").toLocaleDateString("ro-RO", {
              weekday: "long", day: "numeric", month: "long",
            })}
          </span>
          <button
            onClick={() => { setSelectedDay(null); setFilter("this-week"); }}
            className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
          >
            × Resetează
          </button>
        </div>
      )}

      {/* Count */}
      <p className="text-sm font-semibold text-gray-400 mb-4">
        {filtered.length} {filtered.length === 1 ? "spectacol găsit" : "spectacole găsite"}
      </p>

      {/* Cards */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Niciun spectacol în această perioadă"
          subtitle="Încearcă alt filtru sau navighează luna viitoare în calendar."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((l) => (
            <SpectacolCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </>
  );
}
