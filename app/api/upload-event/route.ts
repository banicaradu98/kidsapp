import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { adminClient } from "@/utils/supabase/admin";

export async function POST(req: NextRequest) {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const eventId = formData.get("event_id") as string | null;
  const uploadType = (formData.get("type") as string) || "thumbnail";
  const galleryIndex = formData.get("gallery_index") as string | null;

  if (!file || !eventId) {
    return NextResponse.json({ error: "Lipsesc fișierul sau event_id" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Fișierul depășește 5MB" }, { status: 400 });
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return NextResponse.json({ error: "Tip invalid. Acceptăm JPG, PNG, WebP" }, { status: 400 });
  }

  // Verify user owns this event's listing
  const { data: event } = await adminClient
    .from("events")
    .select("listing_id")
    .eq("id", eventId)
    .single();
  if (!event) return NextResponse.json({ error: "Eveniment negăsit" }, { status: 404 });

  const { data: claim } = await adminClient
    .from("claims")
    .select("id")
    .eq("user_id", user.id)
    .eq("listing_id", event.listing_id)
    .eq("status", "approved")
    .maybeSingle();
  if (!claim) return NextResponse.json({ error: "Acces interzis" }, { status: 403 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = uploadType === "gallery" && galleryIndex != null
    ? `events/${eventId}/gallery_${galleryIndex}.${ext}`
    : `events/${eventId}/thumbnail.${ext}`;

  const buffer = new Uint8Array(await file.arrayBuffer());
  const { error: uploadError } = await adminClient.storage
    .from("listings-images")
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: { publicUrl } } = adminClient.storage
    .from("listings-images")
    .getPublicUrl(path);

  return NextResponse.json({ url: publicUrl });
}
