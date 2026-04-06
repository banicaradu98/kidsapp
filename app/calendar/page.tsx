import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Navbar from "@/app/components/Navbar";
import { adminClient } from "@/utils/supabase/admin";

function formatDayHeader(iso: string) {
  return new Date(iso).toLocaleDateString("ro-RO", {
    weekday: "long", day: "numeric", month: "long", timeZone: "UTC",
  });
}

export const metadata = {
  title: "Calendar Evenimente Sibiu",
  description: "Calendar complet cu spectacole, evenimente și activități pentru copii din Sibiu — următoarele 2 luni. Planifică ieșirile cu familia.",
  alternates: { canonical: "/calendar" },
  openGraph: { title: "Calendar Evenimente Copii Sibiu — KidsApp", description: "Spectacole, evenimente și activități pentru copii din Sibiu — calendar complet.", url: "/calendar" },
};

export default async function CalendarPage() {
  const supabase = createClient(await cookies());
  const now = new Date();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0);

  const { data: listings } = await supabase
    .from("listings")
    .select("id, name, address, price, images, event_date, category")
    .in("category", ["spectacol", "eveniment"])
    .gte("event_date", now.toISOString())
    .lte("event_date", monthEnd.toISOString())
    .order("event_date", { ascending: true });

  // Organizer events from the new events table (adminClient bypasses RLS)
  const { data: orgEvents } = await adminClient
    .from("events")
    .select("id, title, event_date, start_time, price, thumbnail_url, listing_id, listings(id, name, address)")
    .gte("event_date", now.toISOString())
    .lte("event_date", monthEnd.toISOString())
    .order("event_date", { ascending: true });

  type CalEvent = {
    id: string; title: string; event_date: string; start_time: string | null;
    price: string | null; image_url: string | null;
    href: string; address: string | null;
    listing_name: string | null; type: "listing" | "org";
  };

  const all: CalEvent[] = [
    ...(listings ?? []).map((l) => ({
      id: l.id, title: l.name, event_date: l.event_date!,
      start_time: null,
      price: l.price, image_url: l.images?.[0] ?? null,
      href: `/listing/${l.id}`, address: l.address,
      listing_name: null, type: "listing" as const,
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(orgEvents ?? []).map((e: any) => ({
      id: `o-${e.id}`, title: e.title, event_date: e.event_date,
      start_time: e.start_time ?? null,
      price: e.price != null ? `${e.price} lei` : null,
      image_url: e.thumbnail_url ?? null,
      href: `/listing/${e.listing_id}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      address: (e.listings as any)?.address ?? null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      listing_name: (e.listings as any)?.name ?? null,
      type: "org" as const,
    })),
  ].sort((a, b) => a.event_date.localeCompare(b.event_date));

  // Group by UTC day
  const grouped: Record<string, CalEvent[]> = {};
  for (const ev of all) {
    const d = new Date(ev.event_date);
    const day = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(ev);
  }
  const days = Object.keys(grouped).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#1a1a2e]">📅 Calendar evenimente</h1>
          <p className="text-gray-500 font-medium mt-1">Spectacole și evenimente pentru copii în Sibiu — următoarele 2 luni</p>
        </div>

        {days.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-bold text-gray-600">Niciun eveniment programat momentan.</p>
            <p className="text-sm text-gray-400 font-medium mt-1">Revino curând!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {days.map((day) => (
              <section key={day}>
                <h2 className="text-base font-black text-[#1a1a2e] mb-3 capitalize">
                  {formatDayHeader(day + "T00:00:00Z")}
                </h2>
                <div className="flex flex-col gap-3">
                  {grouped[day].map((ev) => {
                    const timeLabel = ev.start_time
                      ? ev.start_time.slice(0, 5)
                      : null;
                    return (
                      <a key={ev.id} href={ev.href}
                        className="flex gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4 group"
                      >
                        {ev.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={ev.image_url} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-200" />
                        ) : (
                          <div className="w-20 h-20 rounded-xl bg-rose-50 flex items-center justify-center text-3xl shrink-0">🎭</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-[#1a1a2e] text-base leading-snug">{ev.title}</p>
                          {ev.listing_name && (
                            <p className="text-xs font-bold text-gray-500 mt-0.5 truncate">
                              📍 {ev.listing_name}
                            </p>
                          )}
                          {timeLabel && (
                            <p className="text-sm font-bold text-[#ff5a2e] mt-0.5">{timeLabel}</p>
                          )}
                          {!timeLabel && ev.address && (
                            <p className="text-xs text-gray-400 font-semibold mt-1">📍 {ev.address}</p>
                          )}
                          {timeLabel && ev.address && (
                            <p className="text-xs text-gray-400 font-semibold mt-0.5">📍 {ev.address}</p>
                          )}
                          {ev.price && <p className="text-sm font-black text-[#ff5a2e] mt-1">{ev.price}</p>}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
