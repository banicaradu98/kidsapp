import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { adminClient } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

function sanitize(q: string): string {
  return q
    .replace(/[\\%_]/g, "\\$&") // escape LIKE wildcards
    .replace(/[(),]/g, "");      // remove PostgREST filter special chars
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (raw.length < 2) return NextResponse.json({ listings: [], events: [] });

  const q = sanitize(raw);
  const supabase = createClient(await cookies());

  const [{ data: listings }, { data: events }] = await Promise.all([
    supabase
      .from("listings")
      .select("id, name, category, address")
      .or(`name.ilike.%${q}%,description.ilike.%${q}%,subcategory.ilike.%${q}%`)
      .eq("is_verified", true)
      .limit(3),

    adminClient
      .from("events")
      .select("id, title, event_date, listing_id, listings(name)")
      .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
      .gte("event_date", new Date().toISOString().split("T")[0])
      .order("event_date", { ascending: true })
      .limit(2),
  ]);

  return NextResponse.json({ listings: listings ?? [], events: events ?? [] });
}
