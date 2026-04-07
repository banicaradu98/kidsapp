import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { adminClient } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { expandQuery, buildOrFilter } from "@/utils/searchUtils";
import { rateLimit, getIp } from "@/utils/rateLimiter";

export async function GET(req: NextRequest) {
  // Rate limit: max 60 requests per IP per minute
  const ip = getIp(req.headers);
  if (!rateLimit(`search:${ip}`, 60, 60 * 1000)) {
    return NextResponse.json({ listings: [], events: [] }, { status: 429 });
  }

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
