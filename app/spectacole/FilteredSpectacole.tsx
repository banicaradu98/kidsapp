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

function toUTCDateKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
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
  const todayKey = useMemo(() => toDateKey(today), [today]);

  const [filter, setFilter] = useState<TemporalFilter>("this-week");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [calMonth, setCalMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const endOfWeekKey = useMemo(() => {
    const dow = today.getDay();
    return toDateKey(addDays(today, dow === 0 ? 0 : 7 - dow));
  }, [today]);

  const endOfMonthKey = useMemo(() => {
    return toDateKey(new Date(today.getFullYear(), today.getMonth() + 1, 0));
  }, [today]);

  // Only upcoming events (end date >= today)
  const activeListings = useMemo(() => {
    return listings.filter((l) => {
      if (!l.event_date) return false;
      const endKey = l.event_end_date
        ? toUTCDateKey(new Date(l.event_end_date))
        : toUTCDateKey(new Date(l.event_date));
      return endKey >= todayKey;
    });
  }, [listings, todayKey]);

  // Past events — sorted descending
  const pastListings = useMemo(() => {
    return listings
      .filter((l) => {
        if (!l.event_date) return false;
        const endKey = l.event_end_date
          ? toUTCDateKey(new Date(l.event_end_date))
          : toUTCDateKey(new Date(l.event_date));
        return endKey < todayKey;
      })
      .sort((a, b) => (b.event_date ?? "").localeCompare(a.event_date ?? ""));
  }, [listings, todayKey]);

  // Calendar dots: only upcoming event days
  const eventDayKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const l of activeListings) {
      if (!l.event_date) continue;
      const start = new Date(l.event_date);
      const end = l.event_end_date ? new Date(l.event_end_date) : start;
      let cur = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      const endUTC = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));
      while (cur <= endUTC) {
        keys.add(`${cur.getUTCFullYear()}-${String(cur.getUTCMonth() + 1).padStart(2, "0")}-${String(cur.getUTCDate()).padStart(2, "0")}`);
        cur = new Date(cur.getTime() + 86_400_000);
      }
    }
    return keys;
  }, [activeListings]);

  const filtered = useMemo(() => {
    if (selectedDay) {
      return activeListings
        .filter((l) => {
          if (!l.event_date) return false;
          const startKey = toUTCDateKey(new Date(l.event_date));
          const endKey = l.event_end_date
            ? toUTCDateKey(new Date(l.event_end_date))
            : startKey;
          return startKey <= selectedDay && selectedDay <= endKey;
        })
        .sort((a, b) => (a.event_date ?? "").localeCompare(b.event_date ?? ""));
    }

    return activeListings
      .filter((l) => {
        if (!l.event_date) return filter === "all";
        const startKey = toUTCDateKey(new Date(l.event_date));
        switch (filter) {
          case "this-week":  return startKey >= todayKey && startKey <= endOfWeekKey;
          case "this-month": return startKey > endOfWeekKey && startKey <= endOfMonthKey;
          case "upcoming":   return startKey > endOfMonthKey;
          case "all":        return true;
        }
      })
      .sort((a, b) => (a.event_date ?? "").localeCompare(b.event_date ?? ""));
  }, [activeListings, filter, selectedDay, todayKey, endOfWeekKey, endOfMonthKey]);

  const calDays = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 0).getDate();
  const calFirstDow = (new Date(calMonth.getFullYear(), calMonth.getMonth(), 1).getDay() + 6) % 7;

  function handleDayClick(day: number) {
    const key = toDateKey(new Date(calMonth.getFullYear(), calMonth.getMonth(), day));
    if (selectedDay === key) {
      setSelectedDay(null);
      setFilter("this-week");
    } else {
      setSelectedDay(key);
      setFilter("all");
    }
  }

  function handleFilterClick(f: TemporalFilter) {
    setFilter(f);
    setSelectedDay(null);
  }

  return (
    <>
      {/* ── MINI CALENDAR ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
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

        <div className="grid grid-cols-7 mb-1">
          {DAYS_SHORT.map((d) => (
            <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-0.5">{d}</div>
          ))}
        </div>

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
            const isPast = key < todayKey;

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

      <p className="text-sm font-semibold text-gray-400 mb-4">
        {filtered.length} {filtered.length === 1 ? "spectacol găsit" : "spectacole găsite"}
      </p>

      {filtered.length === 0 ? (
        activeListings.length === 0 && !selectedDay ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <img src="/images/moosey_transparent.png" alt="" className="h-28 opacity-60" />
            <p className="text-center text-gray-500 font-semibold">Momentan nu sunt spectacole planificate.</p>
            <p className="text-center text-gray-400 text-sm">Revin în curând!</p>
          </div>
        ) : (
          <EmptyState
            title="Niciun spectacol în această perioadă"
            subtitle="Încearcă alt filtru sau navighează luna viitoare în calendar."
          />
        )
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((l) => (
            <SpectacolCard key={l.id} listing={l} />
          ))}
        </div>
      )}

      {/* ── SPECTACOLE TRECUTE ── */}
      {pastListings.length > 0 && !selectedDay && (
        <section className="mt-16 pt-8 border-t border-gray-100">
          <h2 className="text-xl font-semibold text-gray-400 mb-6">Spectacole trecute</h2>
          <div className="flex flex-col gap-4 opacity-70">
            {pastListings.map((l) => (
              <SpectacolCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
