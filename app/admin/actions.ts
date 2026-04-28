"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { adminClient } from "@/utils/supabase/admin";
import { rateLimit, getIp } from "@/utils/rateLimiter";

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
  const { error } = await adminClient.from("listings").insert(extractData(formData));
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
  // Fetch listing details before updating (needed for email)
  const { data: listing } = await adminClient
    .from("listings")
    .select("name, contact_email")
    .eq("id", id)
    .single();

  const { error } = await adminClient
    .from("listings")
    .update({ is_verified: true })
    .eq("id", id);
  if (error) throw new Error(error.message);

  // Send approval emails via Brevo (non-blocking — don't fail if email fails)
  if (listing?.contact_email && process.env.BREVO_API_KEY) {
    sendApprovalEmails(id, listing.name ?? "Locația ta", listing.contact_email).catch(
      (err) => console.error("[approveListing] email error:", err)
    );
  }

  redirect("/admin/aprobare");
}

async function sendApprovalEmails(listingId: string, listingName: string, contactEmail: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.moosey.ro";
  const listingUrl = `${siteUrl}/listing/${listingId}`;

  const sendBrevo = (to: string, subject: string, htmlContent: string) =>
    fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Moosey", email: "hello@moosey.ro" },
        to: [{ email: to }],
        subject,
        htmlContent,
      }),
    });

  const ownerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#ff5a2e;padding:32px;text-align:center;border-radius:12px 12px 0 0;">
        <img src="https://www.moosey.ro/images/logo-moosey.png" alt="Moosey" style="height:50px;" />
      </div>
      <div style="padding:32px;background:#fff;">
        <h2 style="color:#1a1a2e;margin-top:0;">Locația ta este acum live! 🎉</h2>
        <p style="color:#5F5E5A;line-height:1.6;">
          <strong>${listingName}</strong> a fost verificată și este acum vizibilă
          pentru familiile din Sibiu pe Moosey.
        </p>
        <p style="color:#5F5E5A;line-height:1.6;">
          Vrei să o gestionezi direct? Creează un cont cu această adresă de email,
          apoi apasă butonul <em>"Revendică această locație"</em> de pe pagina locației.
        </p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${listingUrl}"
             style="background:#ff5a2e;color:#fff;padding:14px 28px;border-radius:50px;
                    text-decoration:none;font-weight:bold;">
            Vezi locația pe Moosey →
          </a>
        </div>
      </div>
      <div style="background:#fff5f3;padding:20px;text-align:center;
                  border-radius:0 0 12px 12px;border-top:1px solid #ffe4dc;">
        <p style="color:#9ca3af;font-size:12px;margin:0;">
          Moosey ·
          <a href="https://www.moosey.ro" style="color:#ff5a2e;">www.moosey.ro</a>
          · hello@moosey.ro
        </p>
      </div>
    </div>`;

  const adminHtml = `
    <p>Locația <strong>${listingName}</strong> a fost aprobată.</p>
    <p>Email contact: <a href="mailto:${contactEmail}">${contactEmail}</a></p>
    <p>Link: <a href="${listingUrl}">${listingUrl}</a></p>
    <p>Verifică dacă utilizatorul a creat cont și a revendicat locația.</p>`;

  await Promise.allSettled([
    sendBrevo(
      contactEmail,
      `Locația ta "${listingName}" este acum live pe Moosey! 🎉`,
      ownerHtml
    ),
    sendBrevo(
      "hello@moosey.ro",
      `[Moosey Admin] Listing aprobat: ${listingName}`,
      adminHtml
    ),
  ]);
}

export async function rejectListing(id: string) {
  await adminClient.from("listings").delete().eq("id", id);
  redirect("/admin/aprobare");
}

// ── CLAIMS ────────────────────────────────────────────────────────
export async function approveClaim(claimId: string, listingId: string, userId: string) {
  await adminClient
    .from("claims")
    .update({ status: "approved" })
    .eq("id", claimId);

  await adminClient
    .from("listings")
    .update({ claimed_by: userId, claimed_at: new Date().toISOString(), is_verified: true, package: "free" })
    .eq("id", listingId);

  revalidatePath("/admin/revendicari");
}

export async function rejectClaim(claimId: string) {
  await adminClient
    .from("claims")
    .update({ status: "rejected" })
    .eq("id", claimId);
  revalidatePath("/admin/revendicari");
}
