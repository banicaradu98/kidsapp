interface Props {
  totalViews: number;
  recentViews: { viewed_at: string }[];
  thisWeekViews: number;
  lastWeekViews: number;
  reviewCount: number;
  avgRating: number | null;
  favCount: number;
  activeEventsCount: number;
}

export default function StatsPanel({
  totalViews, recentViews, thisWeekViews, lastWeekViews,
  reviewCount, avgRating, favCount, activeEventsCount,
}: Props) {
  // Build daily counts for last 30 days
  const today = new Date();
  const days: { label: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = recentViews.filter((v) => v.viewed_at.slice(0, 10) === key).length;
    days.push({
      label: i === 0 ? "azi" : i === 1 ? "ieri" : `${d.getDate()}/${d.getMonth() + 1}`,
      count,
    });
  }
  const maxCount = Math.max(...days.map((d) => d.count), 1);

  // Week comparison
  const weekDiff = thisWeekViews - lastWeekViews;
  const weekPct = lastWeekViews > 0
    ? Math.round(Math.abs((weekDiff / lastWeekViews) * 100))
    : thisWeekViews > 0 ? 100 : 0;
  const weekUp = weekDiff >= 0;

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-base font-black text-[#1a1a2e] mb-4">📊 Statistici</h2>

      {/* Top stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        <div className="bg-orange-50 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-[#ff5a2e]">{totalViews}</p>
          <p className="text-xs font-bold text-gray-400 mt-1">Vizualizări total</p>
        </div>

        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-blue-600">{recentViews.length}</p>
          <p className="text-xs font-bold text-gray-400 mt-1">Vizualizări 30 zile</p>
        </div>

        <div className="bg-yellow-50 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-yellow-600">
            {avgRating !== null ? avgRating.toFixed(1) : "—"}
          </p>
          <p className="text-xs font-bold text-gray-400 mt-1">
            Rating ({reviewCount} {reviewCount === 1 ? "recenzie" : "recenzii"})
          </p>
        </div>

        <div className="bg-red-50 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-red-500">{favCount}</p>
          <p className="text-xs font-bold text-gray-400 mt-1">Adăugat la favorite</p>
        </div>

        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-green-600">{activeEventsCount}</p>
          <p className="text-xs font-bold text-gray-400 mt-1">Evenimente active</p>
        </div>

        {/* Week comparison */}
        <div className="bg-purple-50 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <p className="text-3xl font-black text-purple-600">{thisWeekViews}</p>
            {(weekPct > 0 || weekDiff !== 0) && (
              <span className={`text-sm font-black ${weekUp ? "text-green-600" : "text-red-500"}`}>
                {weekUp ? "↑" : "↓"}{weekPct}%
              </span>
            )}
          </div>
          <p className="text-xs font-bold text-gray-400 mt-1">
            Vizualizări săpt. curentă
            {lastWeekViews > 0 && (
              <span className="block text-gray-300 text-[10px]">{lastWeekViews} săpt. trecută</span>
            )}
          </p>
        </div>
      </div>

      {/* Bar chart — last 30 days */}
      <p className="text-xs font-bold text-gray-400 mb-2">Vizualizări ultimele 30 zile</p>
      <div className="flex items-end gap-0.5 h-16">
        {days.map((d, i) => (
          <div
            key={i}
            className="flex-1 bg-[#ff5a2e]/20 hover:bg-[#ff5a2e]/50 rounded-sm transition-colors relative group cursor-default"
            style={{ height: `${Math.max(4, Math.round((d.count / maxCount) * 100))}%` }}
          >
            {d.count > 0 && (
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-[9px] font-bold text-[#ff5a2e] opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none bg-white px-1 rounded shadow-sm z-10">
                {d.label}: {d.count}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-gray-300 font-medium">
        <span>{days[0]?.label}</span>
        <span>{days[14]?.label}</span>
        <span>{days[29]?.label}</span>
      </div>
    </section>
  );
}
