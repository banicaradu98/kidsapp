import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/utils/supabase/admin";

export async function POST(req: NextRequest) {
  const { userId, consent } = await req.json();

  if (!userId || typeof consent !== "boolean") {
    return NextResponse.json({ error: "Parametri invalizi" }, { status: 400 });
  }

  const { error } = await adminClient.from("profiles").upsert({
    id: userId,
    newsletter_consent: consent,
    newsletter_consent_date: consent ? new Date().toISOString() : null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
