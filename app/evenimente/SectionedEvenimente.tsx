"use client";

import ListingCard, { Listing } from "@/app/components/ListingCard";
import EmptyState from "@/app/components/EmptyState";

// Since our listings table doesn't have a dedicated event_date column,
// we use created_at order as a proxy and split into visual sections.
// When an event_date column is added, replace the logic below.

function Section({ title, items }: { title: string; items: Listing[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-8">
      <h2 className="text-lg font-black text-[#1a1a2e] mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#ff5a2e] rounded-full inline-block" />
        {title}
        <span className="text-sm font-semibold text-gray-400 ml-1">({items.length})</span>
      </h2>
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
        {items.map((l) => <ListingCard key={l.id} listing={l} variant="event" />)}
      </div>
    </div>
  );
}

export default function SectionedEvenimente({ listings }: { listings: Listing[] }) {
  if (listings.length === 0) {
    return <EmptyState title="Niciun eveniment programat" subtitle="Urmărește această pagină — actualizăm constant evenimentele din Sibiu." />;
  }

  // Split into thirds visually (replace with real date logic when available)
  const third = Math.ceil(listings.length / 3);
  const thisWeek   = listings.slice(0, Math.min(third, 2));
  const thisMonth  = listings.slice(thisWeek.length, thisWeek.length + third);
  const upcoming   = listings.slice(thisWeek.length + thisMonth.length);

  return (
    <>
      <Section title="🗓️ Această săptămână" items={thisWeek} />
      <Section title="📅 Luna aceasta"       items={thisMonth} />
      <Section title="🔜 Urmează"            items={upcoming} />
    </>
  );
}
