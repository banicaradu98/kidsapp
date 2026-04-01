"use server";

import { adminClient } from "@/utils/supabase/admin";

export async function submitListingRequest(
  _prevState: { success: boolean; error: string | null },
  formData: FormData
): Promise<{ success: boolean; error: string | null }> {
  const name        = (formData.get("name")         as string)?.trim();
  const category    = (formData.get("category")     as string) || null;
  const description = (formData.get("description")  as string)?.trim() || null;
  const address     = (formData.get("address")      as string)?.trim() || null;
  const phone       = (formData.get("phone")        as string)?.trim() || null;
  const contactName = (formData.get("contact_name") as string)?.trim() || null;
  const contactEmail= (formData.get("contact_email")as string)?.trim() || null;

  if (!name || !category || !description || !address || !phone || !contactName || !contactEmail) {
    return { success: false, error: "Te rugăm completează toate câmpurile obligatorii." };
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(contactEmail)) {
    return { success: false, error: "Adresa de email nu este validă." };
  }

  const website = formData.get("website") as string | null;
  const normalizedWebsite = website?.trim()
    ? /^https?:\/\//i.test(website.trim()) ? website.trim() : `https://${website.trim()}`
    : null;

  const imagesJson = formData.get("images_json") as string | null;
  let images: string[] = [];
  try { images = imagesJson ? JSON.parse(imagesJson) : []; } catch { images = []; }

  const { error } = await adminClient.from("listings").insert({
    name,
    category,
    subcategory:   (formData.get("subcategory")  as string)?.trim() || null,
    description,
    address,
    city:          "Sibiu",
    price:         (formData.get("price")        as string)?.trim() || null,
    price_details: (formData.get("price_details") as string)?.trim() || null,
    age_min:       formData.get("age_min")  ? Number(formData.get("age_min"))  : null,
    age_max:       formData.get("age_max")  ? Number(formData.get("age_max"))  : null,
    schedule:      (formData.get("schedule")     as string)?.trim() || null,
    phone,
    website:       normalizedWebsite,
    contact_name:  contactName,
    contact_email: contactEmail,
    images,
    is_verified:   false,
    is_featured:   false,
  });

  if (error) {
    console.error("Submit listing error:", error.message);
    return { success: false, error: "A apărut o eroare. Te rugăm încearcă din nou." };
  }

  return { success: true, error: null };
}
