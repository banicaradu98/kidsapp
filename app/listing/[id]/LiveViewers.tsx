"use client";

import { useEffect, useState } from "react";

export default function LiveViewers({ listingId, initialToday }: { listingId: string; initialToday: number }) {
  const [today, setToday] = useState(initialToday);
  const [live, setLive] = useState(0);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await window.fetch(`/api/live-viewers?id=${listingId}`);
        if (!res.ok) return;
        const data = await res.json();
        setToday(data.today ?? 0);
        setLive(data.live ?? 0);
      } catch { /* silent */ }
    }

    fetch(); // immediate on mount
    const interval = setInterval(fetch, 30_000);
    return () => clearInterval(interval);
  }, [listingId]);

  if (today < 5 && live < 2) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-400 mb-4">
      {today >= 5 && (
        <span className="flex items-center gap-1">
          <span className="text-[#ff5a2e]">👁</span>
          {today} {today === 1 ? "părinte a văzut" : "de părinți au văzut"} această pagină azi
        </span>
      )}
      {live >= 2 && (
        <span className="flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          {live} {live === 1 ? "persoană se uită" : "persoane se uită"} acum
        </span>
      )}
    </div>
  );
}
