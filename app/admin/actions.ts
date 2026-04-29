"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { adminClient } from "@/utils/supabase/admin";
import { rateLimit, getIp } from "@/utils/rateLimiter";
import { emailTemplate, sendBrevoEmail } from "@/utils/brevo";
import { generateSlug } from "@/utils/slug";

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let attempt = 0;
  while (true) {
    const { data } = await adminClient
      .from("listings")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) return slug;
    attempt++;
    slug = `${base}-${attempt + 1}`;
  }
}

// ── AUTH ──────────────────────────────────────────────────────────
export async function loginAction(
  _prevState: { error: string },
  formData: FormData
): Promise<{ error: string }> {
  // Rate limit: max 5 attempts per IP per 15 minutes
  const ip = getIp(await headers());
  if (!rateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000)) {
    return { error: "Prea multe încercări. Așteaptă 15 minute." };
  }

  const password = formData.get("password") as string;
  if (password && password === process.env.ADMIN_PASSWORD) {
    (await cookies()).set("admin_session", process.env.ADMIN_PASSWORD!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8, // 8 hours (down from 7 days)
      path: "/",
    });
    redirect("/admin");
  }
  return { error: "Parolă incorectă. Încearcă din nou." };
}

export async function logoutAction() {
  (await cookies()).delete("admin_session");
  redirect("/admin/login");
}

// ── LISTINGS ──────────────────────────────────────────────────────
function normalizeUrl(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function extractData(formData: FormData) {
  const imagesJson = formData.get("images_json") as string | null;
  let images: string[] = [];
  try { images = imagesJson ? JSON.parse(imagesJson) : []; } catch { images = []; }

  return {
    name:        (formData.get("name")        as string) || "",
    category:    (formData.get("category")    as string) || "",
    description: (formData.get("description") as string) || null,
    address:     (formData.get("address")     as string) || null,
    city:        (formData.get("city")        as string) || "Sibiu",
    price:         (formData.get("price")         as string) || null,
    price_details: (formData.get("price_details") as string) || null,
    age_min:     formData.get("age_min")  ? Number(formData.get("age_min"))  : null,
    age_max:     formData.get("age_max")  ? Number(formData.get("age_max"))  : null,
    schedule:    (formData.get("schedule")    as string) || null,
    phone:       (formData.get("phone")       as string) || null,
    website:     normalizeUrl(formData.get("website") as string),
    is_verified: formData.get("is_verified") === "on",
    is_featured: formData.get("is_featured") === "on",
    images,
    // Event-specific (only set when category is spectacol/eveniment)
    event_date:     (formData.get("event_date")     as string) || null,
    event_end_date: (formData.get("event_end_date") as string) || null,
    start_time:     (formData.get("start_time")     as string) || null,
    end_time:       (formData.get("end_time")       as string) || null,
  };
}

export async function createListing(formData: FormData) {
  const data = extractData(formData);
  const slug = await uniqueSlug(generateSlug(data.name));
  const { error } = await adminClient.from("listings").insert({ ...data, slug });
  if (error) throw new Error(error.message);
  redirect("/admin");
}

export async function updateListing(id: string, formData: FormData) {
  const { error } = await adminClient
    .from("listings")
    .update(extractData(formData))
    .eq("id", id);
  if (error) throw new Error(error.message);
  redirect("/admin");
}

export async function deleteListing(id: string) {
  await adminClient.from("listings").delete().eq("id", id);
  redirect("/admin");
}

export async function approveListing(id: string) {
  const { error } = await adminClient
    .from("listings")
    .update({ is_verified: true })
    .eq("id", id);
  if (error) throw new Error(error.message);
  redirect("/admin/aprobare");
}


export async function rejectListing(id: string) {
  await adminClient.from("listings").delete().eq("id", id);
  redirect("/admin/aprobare");
}

// ── CLAIMS ────────────────────────────────────────────────────────
export async function approveClaim(claimId: string, listingId: string, userId: string) {
  // Fetch claim email + listing name before updating
  const [{ data: claim }, { data: listing }] = await Promise.all([
    adminClient.from("claims").select("email").eq("id", claimId).single(),
    adminClient.from("listings").select("name").eq("id", listingId).single(),
  ]);

  await adminClient
    .from("claims")
    .update({ status: "approved" })
    .eq("id", claimId);

  await adminClient
    .from("listings")
    .update({ claimed_by: userId, claimed_at: new Date().toISOString(), is_verified: true, package: "free" })
    .eq("id", listingId);

  // Email confirmare către utilizator
  if (claim?.email && listing?.name && process.env.BREVO_API_KEY) {
    const listingName = listing.name;
    const html = emailTemplate(
      "Revendicare aprobata! 🎉",
      `<p style="color:#5F5E5A;line-height:1.6;margin:0 0 16px 0;">
        Felicitari! Locatia <strong>${listingName}</strong> este acum asociata
        contului tau pe Moosey.
      </p>
      <p style="color:#5F5E5A;line-height:1.6;margin:0 0 8px 0;">
        Din dashboard poti:
      </p>
      <ul style="color:#5F5E5A;line-height:1.8;margin:0 0 16px 0;padding-left:20px;">
        <li>Edita informatiile locatiei</li>
        <li>Adauga evenimente si noutati</li>
        <li>Vedea statistici si recenzii</li>
      </ul>`,
      "Acceseaza Dashboard-ul →",
      "https://www.moosey.ro/dashboard"
    );
    sendBrevoEmail(
      claim.email,
      `Revendicare aprobată! Accesează dashboard-ul tău Moosey 🎉`,
      html
    ).catch((err) => console.error("[approveClaim] email error:", err));
  }

  revalidatePath("/admin/revendicari");
}

export async function rejectClaim(claimId: string, listingId: string) {
  // Fetch claim email + listing name for the rejection email
  const [{ data: claim }, { data: listing }] = await Promise.all([
    adminClient.from("claims").select("email").eq("id", claimId).single(),
    adminClient.from("listings").select("name").eq("id", listingId).single(),
  ]);

  await adminClient
    .from("claims")
    .update({ status: "rejected", rejected_at: new Date().toISOString() })
    .eq("id", claimId);

  // Email notificare respingere
  if (claim?.email && listing?.name && process.env.BREVO_API_KEY) {
    const listingName = listing.name;
    const html = emailTemplate(
      "Cererea ta de revendicare",
      `<p style="color:#5F5E5A;line-height:1.6;margin:0 0 12px 0;">
        Ne pare rău, cererea ta de revendicare pentru locația
        <strong>${listingName}</strong> nu a putut fi aprobată momentan.
      </p>
      <p style="color:#5F5E5A;line-height:1.6;margin:0 0 12px 0;">
        Pentru mai multe detalii sau pentru a clarifica situația,
        te rugăm să ne contactezi direct la:
      </p>
      <p style="text-align:center;margin:24px 0;">
        <a href="mailto:hello@moosey.ro"
           style="color:#ff5a2e;font-size:16px;font-weight:bold;">
          hello@moosey.ro
        </a>
      </p>`
    );
    sendBrevoEmail(
      claim.email,
      "Cerere de revendicare — răspuns Moosey",
      html
    ).catch((err) => console.error("[rejectClaim] email error:", err));
  }

  revalidatePath("/admin/revendicari");
}
