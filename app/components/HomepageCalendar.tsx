"use client";

import { useState, useMemo } from "react";

const DAYS_SHORT = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"];

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function addDays(d: Date, n: number): Date {
  const r = new Date(d); r.setDate(r.getDate() + n); return r;
}
function localDayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export type HomepageEvent = {
  id: string;
  title: string;
  date: string;
  endDate: string | null;
  time: string | null;
  image: string | null;
  href: string;
  category: string | null;
  locationName: string | null;
  price: string | null;
};

const BADGE: Record<string, string> = {
  spectacol:      "🎭 Spectacol",
  eveniment:      "🎉 Eveniment",
  "loc-de-joaca": "🛝 Loc de joacă",
  educatie:       "📚 Educație",
  "curs-atelier": "🎨 Atelier",
  sport:          "⚽ Sport",
};
const BADGE_COLOR: Record<string, string> = {
  spectacol:      "text-rose-600",
  eveniment:      "text-pink-600",
  "loc-de-joaca": "text-orange-600",
  educatie:       "text-green-600",
  "curs-atelier": "text-purple-600",
  sport:          "text-sky-600",
};
const FALLBACK_EMOJI: Record<string, string> = {
  spectacol: "🎭", eveniment: "🎉", "loc-de-joaca": "🛝",
  educatie: "🎓", "curs-atelier": "🎨", sport: "⚽",
};

export default function HomepageCalendar({ allEvents }: { allEvents: HomepageEvent[] }) {
  const today = useMemo(() => startOfDay(new Date()), []);

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(today, weekOffset * 7 + i)),
    [today, weekOffset],
  );

  function handleDayClick(day: Date) {
    if (selectedDay?.toDateString() === day.toDateString()) {
      setSelectedDay(null);
    } else {
      setSelectedDay(day);
    }
    setShowAll(false);
  }

  function handlePrevWeek() {
    setWeekOffset((o) => o - 1);
    setSelectedDay(null);
    setShowAll(false);
  }

  function handleNextWeek() {
    setWeekOffset((o) => o + 1);
    setSelectedDay(null);
    setShowAll(false);
  }

  // Zile care au cel puțin un eveniment
  const daysWithEvents = useMemo(() => {
    const keys = new Set<string>();
    for (const ev of allEvents) {
      const start = startOfDay(new Date(ev.date));
      const end = ev.endDate ? startOfDay(new Date(ev.endDate)) : start;
      let cur = new Date(start);
      while (cur <= end) {
        keys.add(localDayKey(cur));
        cur = addDays(cur, 1);
      }
    }
    return keys;
  }, [allEvents]);

  function hasEventOnDay(day: Date): boolean {
    return daysWithEvents.has(localDayKey(day));
  }

  const eventsToShow = useMemo(() => {
    if (selectedDay) {
      return allEvents.filter((e) => {
        const start = new Date(e.date);
        start.setHours(0, 0, 0, 0);
        const end = e.endDate ? new Date(e.endDate) : new Date(e.date);
        end.setHours(23, 59, 59, 999);
        const sel = new Date(selectedDay);
        sel.setHours(12, 0, 0, 0);
        return sel >= start && sel <= end;
      });
    }
    return allEvents.filter((e) => {
      const d = new Date(e.date);
      d.setHours(0, 0, 0, 0);
      const weekStart = new Date(weekDays[0]);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekDays[6]);
      weekEnd.setHours(23, 59, 59, 999);
      return d >= weekStart && d <= weekEnd;
    });
  }, [allEvents, selectedDay, weekDays]);

  const visibleEvents = showAll ? eventsToShow : eventsToShow.slice(0, 5);

  const eventsLabel = selectedDay
    ? `Evenimente pe ${selectedDay.toLocaleDateString("ro-RO", { weekday: "long", day: "numeric", month: "long" })}`
    : `Evenimente ${weekDays[0].toLocaleDateString("ro-RO", { day: "numeric", month: "short" })} – ${weekDays[6].toLocaleDateString("ro-RO", { day: "numeric", month: "short" })}`;

  return (
    <section className="py-14 sm:py-20 bg-[#fff5f3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a2e]">
              Ce se întâmplă în Sibiu?
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Spectacole, evenimente și activități pentru toată familia
            </p>
          </div>
          <a href="/calendar" className="text-base font-bold text-[#ff5a2e] hover:underline hidden sm:block shrink-0 ml-4">
            Tot calendarul →
          </a>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-5">
          {/* Week navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handlePrevWeek}
              disabled={weekOffset === 0}
              className="w-8 h-8 rounded-full hover:bg-gray-100 disabled:opacity-25 flex items-center justify-center text-gray-500 text-lg font-bold transition-colors"
              aria-label="Săptămâna anterioară"
            >‹</button>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {weekDays[0].toLocaleDateString("ro-RO", { day: "numeric", month: "short" })}
              {" – "}
              {weekDays[6].toLocaleDateString("ro-RO", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <button
              onClick={handleNextWeek}
              disabled={weekOffset >= 12}
              className="w-8 h-8 rounded-full hover:bg-gray-100 disabled:opacity-25 flex items-center justify-center text-gray-500 text-lg font-bold transition-colors"
              aria-label="Săptămâna următoare"
            >›</button>
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => {
              const isSelected = selectedDay?.toDateString() === day.toDateString();
              const isToday = day.toDateString() === today.toDateString();
              const hasEvents = hasEventOnDay(day);
              const dayShort = DAYS_SHORT[(day.getDay() + 6) % 7];

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDayClick(day)}
                  className={`flex flex-col items-center py-2 rounded-xl transition-all leading-none gap-0.5 ${
                    isSelected
                      ? "bg-[#ff5a2e] text-white"
                      : isToday
                      ? "ring-2 ring-[#ff5a2e] text-[#ff5a2e] hover:bg-orange-50"
                      : "hover:bg-orange-50 text-gray-600"
                  }`}
                >
                  <span className={`text-[10px] font-semibold ${isSelected ? "text-white/75" : isToday ? "text-[#ff5a2e]" : "text-gray-400"}`}>
                    {dayShort}
                  </span>
                  <span className="text-sm font-black">{day.getDate()}</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                      hasEvents
                        ? isSelected ? "bg-white/70" : "bg-[#ff5a2e]"
                        : "opacity-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Titlu dinamic */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 capitalize">
          {eventsLabel}
        </p>

        {/* Events */}
        {eventsToShow.length === 0 ? (
          <div className="text-center py-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/moosey_transparent.png" alt="" className="h-16 mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-gray-500">
              {selectedDay ? "Niciun eveniment în această zi" : "Niciun eveniment săptămâna aceasta"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {selectedDay ? "Încearcă o altă zi din calendar" : "Încearcă săptămâna următoare →"}
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 mb-4">
              {visibleEvents.map((ev) => {
                const badge = BADGE[ev.category ?? ""] ?? "📅 Activitate";
                const badgeColor = BADGE_COLOR[ev.category ?? ""] ?? "text-gray-500";
                const fallbackEmoji = FALLBACK_EMOJI[ev.category ?? ""] ?? "📅";
                const endLabel = ev.endDate
                  ? new Date(ev.endDate).toLocaleDateString("ro-RO", { day: "numeric", month: "short", timeZone: "UTC" })
                  : null;

                return (
                  <a
                    key={ev.id}
                    href={ev.href}
                    className="flex gap-3 sm:gap-4 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border border-gray-100 group"
                  >
                    <div className="w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      {ev.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ev.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300 bg-gray-50">
                          {fallbackEmoji}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 self-center">
                      <span className={`text-xs font-semibold ${badgeColor}`}>{badge}</span>
                      <h3 className="font-bold text-[#1a1a2e] leading-snug line-clamp-2 mt-0.5 text-sm sm:text-base">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 flex flex-wrap gap-x-2">
                        {ev.time && <span>⏰ {ev.time.slice(0, 5)}</span>}
                        {ev.locationName && <span>📍 {ev.locationName}</span>}
                        {endLabel && <span>· până pe {endLabel}</span>}
                        {ev.price && <span className="text-[#ff5a2e] font-bold">{ev.price}</span>}
                      </p>
                    </div>

                    <div className="text-gray-300 self-center text-lg shrink-0 group-hover:text-[#ff5a2e] transition-colors">
                      →
                    </div>
                  </a>
                );
              })}
            </div>

            {eventsToShow.length > 5 && !showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:border-[#ff5a2e] hover:text-[#ff5a2e] transition-colors mb-4"
              >
                + {eventsToShow.length - 5} evenimente în plus
              </button>
            )}
          </>
        )}

        {/* Footer links */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <a href="/evenimente" className="flex-1 text-center py-3.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-600 hover:border-[#ff5a2e] hover:text-[#ff5a2e] transition-colors">
            📅 Toate evenimentele
          </a>
          <a href="/spectacole" className="flex-1 text-center py-3.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-600 hover:border-[#ff5a2e] hover:text-[#ff5a2e] transition-colors">
            🎭 Toate spectacolele
          </a>
        </div>

        <div className="mt-4 text-center sm:hidden">
          <a href="/calendar" className="text-sm font-bold text-[#ff5a2e] hover:underline">
            Tot calendarul →
          </a>
        </div>

      </div>
    </section>
  );
}
