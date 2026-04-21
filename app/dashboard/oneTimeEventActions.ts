"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { adminClient } from "@/utils/supabase/admin";

export interface OneTimeEventPayload {
  title: string;
  category: string;
  description: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  price: string | null;
  age_min: number | null;
  age_max: number | null;
  address: string | null;
  phone: string | null;
  images: string[];
}

export async function addOneTimeEvent(
  payload: OneTimeEventPayload
): Promise<{ error?: string; success?: true }> {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Neautentificat. Conectează-te și încearcă din nou." };

  const { error } = await adminClient.from("listings").insert({
    name:        payload.title,
    category:    payload.category,
    description: payload.description || null,
    event_date:  payload.event_date,
    start_time:  payload.start_time || null,
    end_time:    payload.end_time || null,
    price:       payload.price || null,
    age_min:     payload.age_min,
    age_max:     payload.age_max,
    address:     payload.address || null,
    phone:       payload.phone || null,
    images:      payload.images,
    is_verified: false,
    city:        "Sibiu",
    claimed_by:  user.id,
    claimed_at:  new Date().toISOString(),
    package:     "free",
  });

  if (error) return { error: error.message };
  return { success: true };
}
