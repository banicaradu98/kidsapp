import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { adminClient } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { expandQuery, buildOrFilter } from "@/utils/searchUtils";

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (raw.length < 2) return NextResponse.json({ listings: [], events: [] });

  const terms = expandQuery(raw);
  const listingFilter = buildOrFilter(terms, ["name", "description", "subcategory"]);
  const eventFilter = buildOrFilter(terms, ["title", "description"]);

  const supabase = createClient(await cookies());

  const [{ data: listings }, { data: events }] = await Promise.all([
    supabase
      .from("listings")
      .select("id, name, category, address")
      .or(listingFilter)
      .eq("is_verified", true)
      .limit(3),

    adminClient
      .from("events")
      .select("id, title, event_date, listing_id, listings(name)")
      .or(eventFilter)
      .gte("event_date", new Date().toISOString().split("T")[0])
      .order("event_date", { ascending: true })
      .limit(2),
  ]);

  return NextResponse.json({ listings: listings ?? [], events: events ?? [] });
}
