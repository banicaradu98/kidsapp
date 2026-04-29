"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { adminClient } from "@/utils/supabase/admin";

type UpdateType =
  | "noutate"
  | "reducere"
  | "grupa_noua"
  | "schimbare"
  | "eveniment_special"
  | "inchis_temporar"
  | "lansare_noua"
  | "inscrieri_deschise"
  | "rezultate_premii"
  | "oferta_speciala"
  | "anunt_important"
  | "none";

interface UpdatePayload {
  listing_id: string;
  type: UpdateType;
  title: string;
  message: string;
  expires_at: string | null;
  images?: string[];
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

export async function addUpdate(payload: UpdatePayload) {
  const { user, error: authError } = await getVerifiedUser(payload.listing_id);
  if (authError || !user) return { data: null, error: authError ?? "Sesiune expirată." };

  const { data, error } = await adminClient
    .from("listing_updates")
    .insert({
      listing_id: payload.listing_id,
      user_id: user.id,
      type: payload.type,
      title: payload.title.trim(),
      message: payload.message,
      expires_at: payload.expires_at || null,
      images: payload.images ?? [],
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function deleteUpdate(id: string, listingId: string) {
  const { error: authError } = await getVerifiedUser(listingId);
  if (authError) return { error: authError };

  const { error } = await adminClient
    .from("listing_updates")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  return { error: null };
}
