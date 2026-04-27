import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Navbar from "@/app/components/Navbar";
import { adminClient } from "@/utils/supabase/admin";
import CalendarClient, { type CalEvent } from "./CalendarClient";

export const metadata = {
  title: "Calendar Evenimente Sibiu",
  description: "Calendar complet cu spectacole, evenimente și activități pentru copii din Sibiu. Filtrează pe categorii și planifică ieșirile cu familia.",
  alternates: { canonical: "/calendar" },
  openGraph: {
    title: "Calendar Evenimente Copii Sibiu — Moosey",
    description: "Toate spectacolele, evenimentele și activitățile pentru familii din Sibiu.",
    url: "/calendar",
  },
};

function toUTCKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export default async function CalendarPage() {
  const supabase = createClient(await cookies());
  const now = new Date();

  // Spectacole — fără limită temporală, doar viitoare
  const { data: spectacole } = await supabase
    .from("listings")
    .select("id, name, images, category, event_date, event_end_date, start_time, price")
    .eq("category", "spectacol")
    .gte("event_date", now.toISOString())
    .order("event_date", { ascending: true })
    .limit(200);

  // Evenimente one-time — fără limită temporală, doar viitoare
  const { data: evenimente } = await supabase
    .from("listings")
    .select("id, name, images, category, event_date, event_end_date, start_time, price")
    .eq("category", "eveniment")
    .gte("event_date", now.toISOString())
    .order("event_date", { ascending: true })
    .limit(200);

  // Evenimente din tabela events (adăugate de organizatori din dashboard)
  const { data: orgEvents } = await adminClient
    .from("events")
    .select(`
      id,
      title,
      event_date,
      start_time,
      price,
      thumbnail_url,
      listing_id,
      listings(id, name, category)
    `)
    .gte("event_date", now.toISOString())
    .order("event_date", { ascending: true })
    .limit(200);

  const allEvents: CalEvent[] = [
    ...(spectacole ?? []).map((l) => ({
      id: `l-${l.id}`,
      title: l.name,
      date: toUTCKey(new Date(l.event_date!)),
      endDate: l.event_end_date ? toUTCKey(new Date(l.event_end_date)) : null,
      time: l.start_time ?? null,
      image: l.images?.[0] ?? null,
      href: `/listing/${l.id}`,
      category: "spectacol",
      locationName: null,
      price: l.price ?? null,
    })),
    ...(evenimente ?? []).map((l) => ({
      id: `l-${l.id}`,
      title: l.name,
      date: toUTCKey(new Date(l.event_date!)),
      endDate: l.event_end_date ? toUTCKey(new Date(l.event_end_date)) : null,
      time: l.start_time ?? null,
      image: l.images?.[0] ?? null,
      href: `/listing/${l.id}`,
      category: "eveniment",
      locationName: null,
      price: l.price ?? null,
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(orgEvents ?? []).map((e: any) => ({
      id: `o-${e.id}`,
      title: e.title,
      date: toUTCKey(new Date(e.event_date)),
      endDate: null,
      time: e.start_time ?? null,
      image: e.thumbnail_url ?? null,
      href: `/listing/${e.listing_id}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      category: (e.listings as any)?.category ?? null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      locationName: (e.listings as any)?.name ?? null,
      price: e.price != null ? `${e.price} lei` : null,
    })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1a1a2e]">
            Ce se întâmplă în Sibiu?
          </h1>
          <p className="text-gray-500 mt-1 text-base">
            Toate spectacolele, evenimentele și activitățile pentru familii
          </p>
        </div>
        <CalendarClient allEvents={allEvents} />
      </main>
    </div>
  );
}
