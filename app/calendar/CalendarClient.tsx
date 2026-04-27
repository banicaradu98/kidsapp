"use client";

import { useState, useMemo } from "react";

const DAYS_SHORT = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"];
const MONTHS_RO = [
  "ianuarie", "februarie", "martie", "aprilie", "mai", "iunie",
  "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie",
];

export type CalEvent = {
  id: string;
  title: string;
  date: string;       // "YYYY-MM-DD" UTC
  endDate: string | null;
  time: string | null;
  image: string | null;
  href: string;
  category: string | null;
  locationName: string | null;
  price: string | null;
};

const TABS = [
  { slug: "toate",        label: "Toate" },
  { slug: "spectacol",    label: "🎭 Spectacole" },
  { slug: "eveniment",    label: "🎉 Evenimente" },
  { slug: "curs-atelier", label: "🎨 Ateliere" },
  { slug: "sport",        label: "⚽ Sport" },
  { slug: "educatie",     label: "📚 Educație" },
];

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

function toUTCKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}
function toLocalKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function CalendarClient({ allEvents }: { allEvents: CalEvent[] }) {
  const today = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);
  const todayKey = useMemo(() => toLocalKey(today), [today]);

  const [activeTab, setActiveTab] = useState("toate");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const filteredEvents = useMemo(() => {
    if (activeTab === "toate") return allEvents;
    return allEvents.filter((ev) => ev.category === activeTab);
  }, [allEvents, activeTab]);

  const eventDayKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const ev of filteredEvents) {
      const start = new Date(ev.date + "T00:00:00Z");
      const end = ev.endDate ? new Date(ev.endDate + "T00:00:00Z") : start;
      let cur = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      const endUTC = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));
      while (cur <= endUTC) {
        keys.add(toUTCKey(cur));
        cur = new Date(cur.getTime() + 86_400_000);
      }
    }
    return keys;
  }, [filteredEvents]);

  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month]);

  // 0 = Monday
  const firstDayOfWeek = useMemo(() => (new Date(year, month, 1).getDay() + 6) % 7, [year, month]);

  function prevMonth() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
    setSelectedDay(null);
  }

  const monthStart = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const monthLastDay = new Date(year, month + 1, 0).getDate();
  const monthEnd = `${year}-${String(month + 1).padStart(2, "0")}-${String(monthLastDay).padStart(2, "0")}`;

  const displayEvents = useMemo(() => {
    if (selectedDay) {
      return filteredEvents.filter((ev) => {
        const startKey = ev.date;
        const endKey = ev.endDate ?? startKey;
        return startKey <= selectedDay && selectedDay <= endKey;
      });
    }
    return filteredEvents.filter((ev) => {
      const startKey = ev.date;
      const endKey = ev.endDate ?? startKey;
      return startKey <= monthEnd && endKey >= monthStart;
    });
  }, [filteredEvents, selectedDay, monthStart, monthEnd]);

  const groupedDays = useMemo(() => {
    if (selectedDay) return null;
    const g: Record<string, CalEvent[]> = {};
    for (const ev of displayEvents) {
      const key = ev.date;
      if (!g[key]) g[key] = [];
      g[key].push(ev);
    }
    return Object.keys(g).sort().map((day) => ({ day, events: g[day] }));
  }, [displayEvents, selectedDay]);

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.slug}
            onClick={() => { setActiveTab(tab.slug); setSelectedDay(null); }}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              activeTab === tab.slug
                ? "bg-[#ff5a2e] text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#ff5a2e] hover:text-[#ff5a2e]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Monthly calendar */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 text-xl font-bold transition-colors"
            aria-label="Luna anterioară"
          >‹</button>
          <h2 className="text-base font-black text-[#1a1a2e] capitalize">
            {MONTHS_RO[month]} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 text-xl font-bold transition-colors"
            aria-label="Luna următoare"
          >›</button>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAYS_SHORT.map((d) => (
            <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const dayNum = i + 1;
            const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
            const isSelected = key === selectedDay;
            const isToday = key === todayKey;
            const hasEvents = eventDayKeys.has(key);

            return (
              <button
                key={key}
                onClick={() => setSelectedDay(isSelected ? null : key)}
                className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all leading-none gap-0.5 ${
                  isSelected
                    ? "bg-[#ff5a2e] text-white"
                    : isToday
                    ? "bg-orange-50 text-[#ff5a2e] ring-1 ring-[#ff5a2e]/30"
                    : hasEvents
                    ? "hover:bg-orange-50 text-gray-800 cursor-pointer"
                    : "text-gray-400 hover:bg-gray-50"
                }`}
              >
                <span className="text-sm font-black">{dayNum}</span>
                <span className={`w-1.5 h-1.5 rounded-full mt-0.5 transition-colors ${
                  hasEvents
                    ? isSelected ? "bg-white/70" : "bg-[#ff5a2e]"
                    : "opacity-0"
                }`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day header */}
      {selectedDay && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-[#1a1a2e] capitalize text-lg">
            {new Date(selectedDay + "T00:00:00Z").toLocaleDateString("ro-RO", {
              weekday: "long", day: "numeric", month: "long", timeZone: "UTC",
            })}
          </h3>
          <button
            onClick={() => setSelectedDay(null)}
            className="text-xs text-gray-400 hover:text-gray-600 font-semibold flex items-center gap-1"
          >
            ✕ Toate zilele
          </button>
        </div>
      )}

      {/* Events */}
      {selectedDay ? (
        displayEvents.length === 0 ? (
          <div className="text-center py-14">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/moosey_transparent.png" alt="" className="h-16 mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-gray-500">Niciun eveniment în această zi</p>
            <p className="text-sm text-gray-400 mt-1">Încearcă o altă zi din calendar</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {displayEvents.map((ev) => <EventCard key={ev.id} ev={ev} />)}
          </div>
        )
      ) : displayEvents.length === 0 ? (
        <div className="text-center py-14">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/moosey_transparent.png" alt="" className="h-16 mx-auto mb-3 opacity-40" />
          <p className="font-semibold text-gray-500">
            {activeTab === "toate"
              ? "Niciun eveniment programat în această lună"
              : "Niciun eveniment din această categorie în această lună"}
          </p>
          <button
            onClick={nextMonth}
            className="mt-3 text-sm font-bold text-[#ff5a2e] hover:underline"
          >
            Luna următoare →
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {groupedDays!.map(({ day, events }) => (
            <section key={day}>
              <h3 className="font-black text-[#1a1a2e] capitalize mb-3">
                {new Date(day + "T00:00:00Z").toLocaleDateString("ro-RO", {
                  weekday: "long", day: "numeric", month: "long", timeZone: "UTC",
                })}
              </h3>
              <div className="flex flex-col gap-3">
                {events.map((ev) => <EventCard key={ev.id} ev={ev} />)}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function EventCard({ ev }: { ev: CalEvent }) {
  const badge = BADGE[ev.category ?? ""] ?? "📅 Activitate";
  const badgeColor = BADGE_COLOR[ev.category ?? ""] ?? "text-gray-500";
  const fallbackEmoji = FALLBACK_EMOJI[ev.category ?? ""] ?? "📅";
  const endLabel = ev.endDate
    ? new Date(ev.endDate + "T00:00:00Z").toLocaleDateString("ro-RO", {
        day: "numeric", month: "short", timeZone: "UTC",
      })
    : null;

  return (
    <a
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
        <h4 className="font-bold text-[#1a1a2e] leading-snug line-clamp-2 mt-0.5 text-sm sm:text-base">
          {ev.title}
        </h4>
        <p className="text-xs text-gray-400 mt-1 flex flex-wrap gap-x-2">
          {ev.time && <span>⏰ {ev.time.slice(0, 5)}</span>}
          {ev.locationName && <span>📍 {ev.locationName}</span>}
          {endLabel && <span>· până pe {endLabel}</span>}
          {ev.price && <span className="text-[#ff5a2e] font-bold">{ev.price}</span>}
        </p>
      </div>
      <div className="text-gray-300 self-center text-lg shrink-0 group-hover:text-[#ff5a2e] transition-colors">→</div>
    </a>
  );
}
