"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { adminClient } from "@/utils/supabase/admin";

interface EventPayload {
  listing_id: string;
  title: string;
  description: string | null;
  date: string;
  start_time: string | null;
  end_time: string | null;
  price: number | null;
}

async function getVerifiedUser(listingId: string) {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();

  console.log("[eventActions] user.id:", user?.id ?? "null");

  if (!user) return { user: null, error: "Sesiune expirată. Reautentifică-te." };

  // Verify ownership via adminClient (bypasses RLS — same pattern as dashboard/page.tsx)
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
  const { error: authError } = await getVerifiedUser(payload.listing_id);
  if (authError) return { data: null, error: authError };

  console.log("[eventActions] inserting event for listing:", payload.listing_id);

  const { data, error } = await adminClient
    .from("events")
    .insert(payload)
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
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
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
