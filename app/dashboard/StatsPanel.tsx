interface Props {
  totalViews: number;
  recentViews: { viewed_at: string }[];
  reviewCount: number;
  avgRating: number | null;
}

export default function StatsPanel({ totalViews, recentViews, reviewCount, avgRating }: Props) {
  // Build daily counts for last 30 days
  const today = new Date();
  const days: { label: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = recentViews.filter((v) => v.viewed_at.slice(0, 10) === key).length;
    days.push({ label: i === 0 ? "azi" : i === 1 ? "ieri" : `${d.getDate()}/${d.getMonth() + 1}`, count });
  }
  const maxCount = Math.max(...days.map((d) => d.count), 1);

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-base font-black text-[#1a1a2e] mb-4">📊 Statistici</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
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
          <p className="text-xs font-bold text-gray-400 mt-1">Rating mediu ({reviewCount} recenzii)</p>
        </div>
      </div>

      {/* Simple bar chart — last 30 days */}
      <p className="text-xs font-bold text-gray-400 mb-2">Vizualizări ultimele 30 zile</p>
      <div className="flex items-end gap-0.5 h-16">
        {days.map((d, i) => (
          <div
            key={i}
            className="flex-1 bg-[#ff5a2e]/20 hover:bg-[#ff5a2e]/40 rounded-sm transition-colors relative group"
            style={{ height: `${Math.max(4, Math.round((d.count / maxCount) * 100))}%` }}
            title={`${d.label}: ${d.count} vizualizări`}
          >
            {d.count > 0 && (
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-[9px] font-bold text-[#ff5a2e] opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                {d.count}
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
