import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { adminClient } from "@/utils/supabase/admin";
import { rateLimit } from "@/utils/rateLimiter";
import { sanitizeFilename, isUuid } from "@/utils/sanitize";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

function isValidImageBuffer(buf: Uint8Array, mime: string): boolean {
  if (buf.length < 4) return false;
  if (mime === "image/jpeg") return buf[0] === 0xff && buf[1] === 0xd8;
  if (mime === "image/png")  return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  if (mime === "image/webp") return buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46;
  return false;
}

export async function POST(req: NextRequest) {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const eventId = formData.get("event_id") as string | null;
  const listingId = formData.get("listing_id") as string | null;
  const uploadType = (formData.get("type") as string) || "thumbnail";
  const galleryIndex = formData.get("gallery_index") as string | null;

  // Rate limit: max 20 uploads per user per hour
  if (!rateLimit(`upload-event:${user.id}`, 20, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Prea multe upload-uri. Încearcă mai târziu." }, { status: 429 });
  }

  // Validate IDs are proper UUIDs
  if (eventId && !isUuid(eventId)) return NextResponse.json({ error: "ID invalid" }, { status: 400 });
  if (listingId && !isUuid(listingId)) return NextResponse.json({ error: "ID invalid" }, { status: 400 });

  if (!file || (!eventId && !listingId)) {
    return NextResponse.json({ error: "Lipsesc fișierul sau identificatorul" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Fișierul depășește 5MB" }, { status: 400 });
  }
  if (!ALLOWED_MIME.includes(file.type)) {
    return NextResponse.json({ error: "Tip invalid. Acceptăm JPG, PNG, WebP" }, { status: 400 });
  }

  // Verify magic bytes
  const buffer = new Uint8Array(await file.arrayBuffer());
  if (!isValidImageBuffer(buffer, file.type)) {
    return NextResponse.json({ error: "Fișierul nu este o imagine validă." }, { status: 400 });
  }

  // Resolve which listing_id to use for ownership check
  let verifiedListingId: string;

  if (eventId) {
    // Editing existing event — look it up to get listing_id
    const { data: event } = await adminClient
      .from("events")
      .select("listing_id")
      .eq("id", eventId)
      .single();
    if (!event) return NextResponse.json({ error: "Eveniment negăsit" }, { status: 404 });
    verifiedListingId = event.listing_id;
  } else {
    // New event — listing_id provided directly
    verifiedListingId = listingId!;
  }

  // Verify user owns this listing
  const { data: claim } = await adminClient
    .from("claims")
    .select("id")
    .eq("user_id", user.id)
    .eq("listing_id", verifiedListingId)
    .eq("status", "approved")
    .maybeSingle();
  if (!claim) return NextResponse.json({ error: "Acces interzis" }, { status: 403 });

  const safeName = sanitizeFilename(file.name);
  const ext = safeName.split(".").pop() ?? "jpg";
  const ts = Date.now();

  let path: string;
  if (eventId) {
    // Existing event — deterministic path (upsert safe)
    path = uploadType === "gallery" && galleryIndex != null
      ? `events/${eventId}/gallery_${galleryIndex}.${ext}`
      : `events/${eventId}/thumbnail.${ext}`;
  } else {
    // New event — timestamp-based path under listing folder
    path = uploadType === "gallery" && galleryIndex != null
      ? `events/${verifiedListingId}/${ts}-gallery_${galleryIndex}.${ext}`
      : `events/${verifiedListingId}/${ts}-thumbnail.${ext}`;
  }

  const { error: uploadError } = await adminClient.storage
    .from("listings-images")
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: { publicUrl } } = adminClient.storage
    .from("listings-images")
    .getPublicUrl(path);

  return NextResponse.json({ url: publicUrl });
}
