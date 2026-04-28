"use server";

import { headers } from "next/headers";
import { adminClient } from "@/utils/supabase/admin";
import { rateLimit, getIp } from "@/utils/rateLimiter";
import { sanitizeText, sanitizeRichText, isValidEmail, isAllowedValue } from "@/utils/sanitize";

const ALLOWED_CATEGORIES = [
  "loc-de-joaca",
  "educatie",
  "curs-atelier",
  "sport",
  "spectacol",
  "eveniment",
] as const;

export async function submitListingRequest(
  _prevState: { success: boolean; error: string | null },
  formData: FormData
): Promise<{ success: boolean; error: string | null }> {
  // ── Rate limiting: max 3 submissions per IP per hour ──────────────
  const ip = getIp(await headers());
  if (!rateLimit(`submit:${ip}`, 3, 60 * 60 * 1000)) {
    return { success: false, error: "Prea multe cereri. Încearcă din nou mai târziu." };
  }

  // ── Honeypot: bots fill this hidden field, humans don't ───────────
  const honeypot = (formData.get("website_url") as string) ?? "";
  if (honeypot.trim()) {
    // Silently succeed to confuse bots
    return { success: true, error: null };
  }

  // ── Timestamp check: submission in < 3s = likely bot ─────────────
  const tsRaw = formData.get("_ts") as string | null;
  if (tsRaw) {
    const elapsed = Date.now() - parseInt(tsRaw, 10);
    if (!isNaN(elapsed) && elapsed < 3000) {
      return { success: false, error: "Formular trimis prea rapid. Te rugăm completează cu atenție." };
    }
  }

  // ── Sanitize & validate all fields ───────────────────────────────
  const name        = sanitizeText(formData.get("name") as string, 100);
  const category    = (formData.get("category") as string)?.trim() ?? "";
  const description = sanitizeRichText(formData.get("description") as string, 5000);
  const address     = sanitizeText(formData.get("address") as string, 200);
  const phone       = sanitizeText(formData.get("phone") as string, 20);
  const contactName = sanitizeText(formData.get("contact_name") as string, 100);
  const contactEmail= sanitizeText(formData.get("contact_email") as string, 254);

  if (!name || !category || !description || !address || !phone || !contactName || !contactEmail) {
    return { success: false, error: "Te rugăm completează toate câmpurile obligatorii." };
  }

  if (!isAllowedValue(category, [...ALLOWED_CATEGORIES])) {
    return { success: false, error: "Categorie invalidă." };
  }

  if (!isValidEmail(contactEmail)) {
    return { success: false, error: "Adresa de email nu este validă." };
  }

  // ── Optional fields ───────────────────────────────────────────────
  const subcategory  = sanitizeText(formData.get("subcategory") as string, 100) || null;
  const price        = sanitizeText(formData.get("price") as string, 100) || null;
  const priceDetails = sanitizeRichText(formData.get("price_details") as string, 1000) || null;
  const schedule     = sanitizeText(formData.get("schedule") as string, 200) || null;
  const notes        = sanitizeRichText(formData.get("notes") as string, 1000) || null;

  const ageMinRaw = formData.get("age_min");
  const ageMaxRaw = formData.get("age_max");
  const ageMin = ageMinRaw ? Math.min(18, Math.max(0, parseInt(ageMinRaw as string, 10))) : null;
  const ageMax = ageMaxRaw ? Math.min(18, Math.max(0, parseInt(ageMaxRaw as string, 10))) : null;

  const websiteRaw = sanitizeText(formData.get("website") as string, 500);
  const website = websiteRaw
    ? /^https?:\/\//i.test(websiteRaw) ? websiteRaw : `https://${websiteRaw}`
    : null;

  // Images: only accept valid https URLs from our Supabase bucket
  const imagesJson = formData.get("images_json") as string | null;
  let images: string[] = [];
  try {
    const parsed = imagesJson ? JSON.parse(imagesJson) : [];
    if (Array.isArray(parsed)) {
      const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
        ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
        : null;
      images = parsed
        .filter((u: unknown): u is string => typeof u === "string")
        .filter((u) => {
          try {
            const url = new URL(u);
            return url.protocol === "https:" && (!supabaseHost || url.host === supabaseHost);
          } catch { return false; }
        })
        .slice(0, 5);
    }
  } catch { images = []; }

  // notes: coloana nu există în schema listings — adăugată în description
  const descriptionWithNotes = notes
    ? `${description}\n\n<hr/><p><strong>Mesaj intern:</strong> ${notes}</p>`
    : description;

  const { error } = await adminClient.from("listings").insert({
    name,
    category,
    subcategory,
    description: descriptionWithNotes,
    address,
    city:          "Sibiu",
    price,
    price_details: priceDetails,
    age_min:       isNaN(ageMin as number) ? null : ageMin,
    age_max:       isNaN(ageMax as number) ? null : ageMax,
    schedule,
    phone,
    website,
    contact_name:  contactName,
    contact_email: contactEmail,
    images,
    is_verified:   false,
    is_featured:   false,
  });

  if (error) {
    console.error("[submitListingRequest] DB error:", error.code, error.message, error.details);
    return { success: false, error: `Eroare la salvare: ${error.message}` };
  }

  // Email de confirmare — non-blocking
  if (process.env.BREVO_API_KEY) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.moosey.ro";
    fetch(`${siteUrl}/api/send-confirmation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: contactEmail, name }),
    }).catch((err) => console.error("[submitListingRequest] confirmation email error:", err));
  }

  return { success: true, error: null };
}
