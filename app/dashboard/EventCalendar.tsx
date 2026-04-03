"use client";

import { useState } from "react";

interface CalEvent {
  id: string;
  title: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  price: number | null;
  thumbnail_url: string | null;
}

const DAY_LABELS = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"];

export default function EventCalendar({ events }: { events: CalEvent[] }) {
  const now = new Date();
  const [viewDate, setViewDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Monday-first offset (0=Mon … 6=Sun)
  const rawFirst = new Date(year, month, 1).getDay();
  const startOffset = rawFirst === 0 ? 6 : rawFirst - 1;

  // Group events by UTC day within the viewed month
  const byDay = new Map<number, CalEvent[]>();
  for (const ev of events) {
    if (!ev.event_date) continue;
    const d = new Date(ev.event_date);
    if (isNaN(d.getTime())) continue;
    if (d.getUTCFullYear() === year && d.getUTCMonth() === month) {
      const day = d.getUTCDate();
      if (!byDay.has(day)) byDay.set(day, []);
      byDay.get(day)!.push(ev);
    }
  }

  const todayDay =
    now.getFullYear() === year && now.getMonth() === month ? now.getDate() : null;

  const monthLabel = new Date(year, month, 1).toLocaleDateString("ro-RO", {
    month: "long", year: "numeric",
  });

  function prev() { setViewDate(new Date(year, month - 1, 1)); setSelectedDay(null); }
  function next() { setViewDate(new Date(year, month + 1, 1)); setSelectedDay(null); }

  const selectedEvents = selectedDay ? (byDay.get(selectedDay) ?? []) : [];

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-base font-black text-[#1a1a2e] mb-4">🗓 Calendar</h2>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prev}
          className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 text-lg transition-colors"
        >
          ‹
        </button>
        <p className="text-sm font-black text-[#1a1a2e] capitalize">{monthLabel}</p>
        <button
          onClick={next}
          className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 text-lg transition-colors"
        >
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((l) => (
          <div key={l} className="text-center text-[10px] font-bold text-gray-400 py-1">
            {l}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`b${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const hasEvents = byDay.has(day);
          const isToday = day === todayDay;
          const isSelected = day === selectedDay;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(isSelected ? null : day)}
              className={`relative flex flex-col items-center justify-center h-9 w-full rounded-lg text-sm font-bold transition-colors
                ${isSelected
                  ? "bg-[#ff5a2e] text-white"
                  : isToday
                  ? "bg-orange-50 text-[#ff5a2e]"
                  : "hover:bg-gray-50 text-gray-700"}`}
            >
              {day}
              {hasEvents && (
                <span
                  className={`absolute bottom-1 w-1 h-1 rounded-full ${
                    isSelected ? "bg-white" : "bg-[#ff5a2e]"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day events */}
      {selectedDay !== null && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          {selectedEvents.length === 0 ? (
            <p className="text-sm font-medium text-gray-400 text-center py-2">
              Niciun eveniment în această zi
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedEvents.map((ev) => {
                const start = ev.start_time?.slice(0, 5) ?? null;
                const end = ev.end_time?.slice(0, 5) ?? null;
                const timeStr = start && end ? `${start}–${end}` : start ?? null;
                return (
                  <div key={ev.id} className="flex items-center gap-3 bg-orange-50 rounded-xl p-3">
                    {ev.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={ev.thumbnail_url}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-lg shrink-0">
                        📅
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-[#1a1a2e] truncate">{ev.title}</p>
                      <p className="text-xs font-medium text-gray-500">
                        {timeStr}
                        {timeStr && ev.price != null ? " · " : ""}
                        {ev.price != null ? `${ev.price} lei` : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
