import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/utils/supabase/admin";
import { rateLimit, getIp } from "@/utils/rateLimiter";
import { sanitizeFilename } from "@/utils/sanitize";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  // Rate limit: max 10 uploads per IP per hour
  const ip = getIp(req.headers);
  if (!rateLimit(`upload-public:${ip}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Prea multe upload-uri. Încearcă mai târziu." }, { status: 429 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Fișierul depășește 5MB" }, { status: 400 });
  }

  // Validate MIME type from Content-Type (not just extension)
  if (!ALLOWED_MIME.includes(file.type)) {
    return NextResponse.json({ error: "Tip invalid. Acceptăm JPG, PNG, WebP" }, { status: 400 });
  }

  // Verify magic bytes: JPEG=FF D8, PNG=89 50 4E 47, WebP=52 49 46 46
  const buffer = new Uint8Array(await file.arrayBuffer());
  if (!isValidImageBuffer(buffer, file.type)) {
    return NextResponse.json({ error: "Fișierul nu este o imagine validă." }, { status: 400 });
  }

  const safeName = sanitizeFilename(file.name);
  const filename = `pending/${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`;

  const { error } = await adminClient.storage
    .from("listings-images")
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: { publicUrl } } = adminClient.storage
    .from("listings-images")
    .getPublicUrl(filename);

  return NextResponse.json({ url: publicUrl });
}

/** Check first bytes (magic numbers) to verify actual image type. */
function isValidImageBuffer(buf: Uint8Array, mime: string): boolean {
  if (buf.length < 4) return false;
  if (mime === "image/jpeg") return buf[0] === 0xff && buf[1] === 0xd8;
  if (mime === "image/png")  return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  if (mime === "image/webp") return buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46;
  return false;
}
