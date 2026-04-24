import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { adminClient } from "@/utils/supabase/admin";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Neautentificat" }, { status: 401 });
  }

  // Verify password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });

  if (signInError) {
    return NextResponse.json({ error: "Parolă incorectă" }, { status: 403 });
  }

  // Pause account
  await adminClient.from("profiles").update({
    account_status: "paused",
    paused_at: new Date().toISOString(),
  }).eq("id", user.id);

  // Hide reviews
  await adminClient.from("reviews").update({ hidden: true }).eq("user_id", user.id);

  return NextResponse.json({ success: true });
}
