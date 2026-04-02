import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { adminClient } from "@/utils/supabase/admin";

export async function GET() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ claims: [] });
  }

  const { data: claims } = await adminClient
    .from("claims")
    .select("id, listing_id")
    .eq("user_id", user.id)
    .eq("status", "approved");

  return NextResponse.json({ claims: claims ?? [] });
}
