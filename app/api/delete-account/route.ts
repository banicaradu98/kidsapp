import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { adminClient } from "@/utils/supabase/admin";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { password, deleteMarketplace } = await req.json();

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

  const userId = user.id;

  try {
    // Marketplace data
    await adminClient.from("marketplace_favorites").delete().eq("user_id", userId);
    await adminClient.from("marketplace_messages").delete().or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    if (deleteMarketplace) {
      await adminClient.from("marketplace_listings").delete().eq("user_id", userId);
    }

    // Reviews and user favorites
    await adminClient.from("reviews").delete().eq("user_id", userId);
    await adminClient.from("user_favorites").delete().eq("user_id", userId);

    // Unclaim listings
    await adminClient.from("listings").update({
      claimed_by: null,
      claimed_at: null,
      package: "free",
    }).eq("claimed_by", userId);

    // Delete profile row
    await adminClient.from("profiles").delete().eq("id", userId);

    // Delete user from auth — requires service role
    await adminClient.auth.admin.deleteUser(userId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete account error:", err);
    return NextResponse.json({ error: "Eroare la ștergerea datelor" }, { status: 500 });
  }
}
