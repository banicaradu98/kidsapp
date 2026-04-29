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

  if (!rateLimit(`upload-update:${user.id}`, 20, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Prea multe upload-uri. Încearcă mai târziu." }, { status: 429 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const listingId = formData.get("listing_id") as string | null;
  const index = formData.get("index") as string | null;

  if (!file || !listingId) return NextResponse.json({ error: "Lipsesc parametri" }, { status: 400 });
  if (!isUuid(listingId)) return NextResponse.json({ error: "ID invalid" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Fișierul depășește 5MB" }, { status: 400 });
  if (!ALLOWED_MIME.includes(file.type)) return NextResponse.json({ error: "Tip invalid" }, { status: 400 });

  const buffer = new Uint8Array(await file.arrayBuffer());
  if (!isValidImageBuffer(buffer, file.type)) {
    return NextResponse.json({ error: "Fișierul nu este o imagine validă." }, { status: 400 });
  }

  const { data: claim } = await adminClient
    .from("claims")
    .select("id")
    .eq("user_id", user.id)
    .eq("listing_id", listingId)
    .eq("status", "approved")
    .maybeSingle();
  if (!claim) return NextResponse.json({ error: "Acces interzis" }, { status: 403 });

  const safeName = sanitizeFilename(file.name);
  const ext = safeName.split(".").pop() ?? "jpg";
  const ts = Date.now();
  const idx = index ?? "0";
  const path = `updates/${listingId}/${ts}-${idx}.${ext}`;

  const { error: uploadError } = await adminClient.storage
    .from("listings-images")
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: { publicUrl } } = adminClient.storage.from("listings-images").getPublicUrl(path);
  return NextResponse.json({ url: publicUrl });
}
