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
