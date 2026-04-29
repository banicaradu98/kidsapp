"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { adminClient } from "@/utils/supabase/admin";

interface EventPayload {
  listing_id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_end_date?: string | null;
  start_time: string | null;
  end_time: string | null;
  price: number | null;
  event_type?: string | null;
  age_recommendation?: string | null;
  location_override?: string | null;
  registration_url?: string | null;
  thumbnail_url?: string | null;
  gallery_urls?: string[];
}

async function getVerifiedUser(listingId: string) {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { user: null, error: "Sesiune expirată. Reautentifică-te." };

  const { data: claim } = await adminClient
    .from("claims")
    .select("id")
    .eq("user_id", user.id)
    .eq("listing_id", listingId)
    .eq("status", "approved")
    .maybeSingle();

  if (!claim) return { user: null, error: "Nu ai dreptul să modifici această locație." };

  return { user, error: null };
}

export async function addEvent(payload: EventPayload) {
  const { user, error: authError } = await getVerifiedUser(payload.listing_id);
  if (authError || !user) return { data: null, error: authError ?? "Sesiune expirată." };

  const dateObj = new Date(payload.event_date);
  if (isNaN(dateObj.getTime())) {
    return { data: null, error: "Data evenimentului nu este validă." };
  }

  const { data, error } = await adminClient
    .from("events")
    .insert({
      listing_id: payload.listing_id,
      title: payload.title,
      description: payload.description,
      event_date: dateObj.toISOString(),
      event_end_date: payload.event_end_date || null,
      start_time: payload.start_time,
      end_time: payload.end_time,
      price: payload.price,
      event_type: payload.event_type || null,
      age_recommendation: payload.age_recommendation || null,
      location_override: payload.location_override || null,
      registration_url: payload.registration_url || null,
      user_id: user.id,
      thumbnail_url: payload.thumbnail_url ?? null,
      gallery_urls: payload.gallery_urls ?? [],
    })
    .select()
    .single();

  if (error) {
    console.log("[eventActions] insert error:", error.message);
    return { data: null, error: error.message };
  }
  return { data, error: null };
}

export async function updateEvent(id: string, payload: EventPayload) {
  const { error: authError } = await getVerifiedUser(payload.listing_id);
  if (authError) return { data: null, error: authError };

  const { data, error } = await adminClient
    .from("events")
    .update({
      listing_id: payload.listing_id,
      title: payload.title,
      description: payload.description,
      event_date: payload.event_date,
      event_end_date: payload.event_end_date || null,
      start_time: payload.start_time,
      end_time: payload.end_time,
      price: payload.price,
      event_type: payload.event_type || null,
      age_recommendation: payload.age_recommendation || null,
      location_override: payload.location_override || null,
      registration_url: payload.registration_url || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function updateEventImages(
  eventId: string,
  listingId: string,
  thumbnailUrl: string | null,
  galleryUrls: string[]
) {
  const { error: authError } = await getVerifiedUser(listingId);
  if (authError) return { error: authError };

  const { error } = await adminClient
    .from("events")
    .update({ thumbnail_url: thumbnailUrl, gallery_urls: galleryUrls })
    .eq("id", eventId);

  if (error) return { error: error.message };
  return { error: null };
}

export async function deleteEvent(id: string, listingId: string) {
  const { error: authError } = await getVerifiedUser(listingId);
  if (authError) return { error: authError };

  const { error } = await adminClient
    .from("events")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  return { error: null };
}
