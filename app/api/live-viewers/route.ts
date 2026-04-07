import { adminClient } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getIp } from "@/utils/rateLimiter";
import { isUuid } from "@/utils/sanitize";

export async function GET(req: NextRequest) {
  // Rate limit: max 120 requests per IP per minute (30s polling × 2)
  const ip = getIp(req.headers);
  if (!rateLimit(`live-viewers:${ip}`, 120, 60 * 1000)) {
    return NextResponse.json({ today: 0, live: 0 }, { status: 429 });
  }

  const listingId = req.nextUrl.searchParams.get("id") ?? "";
  if (!isUuid(listingId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);
  const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);

  const [{ count: todayCount }, { count: liveCount }] = await Promise.all([
    adminClient
      .from("listing_views")
      .select("id", { count: "exact", head: true })
      .eq("listing_id", listingId)
      .gte("viewed_at", todayStart.toISOString()),

    adminClient
      .from("listing_views")
      .select("id", { count: "exact", head: true })
      .eq("listing_id", listingId)
      .gte("viewed_at", fiveMinAgo.toISOString()),
  ]);

  return NextResponse.json(
    { today: todayCount ?? 0, live: liveCount ?? 0 },
    { headers: { "Cache-Control": "no-store" } }
  );
}
