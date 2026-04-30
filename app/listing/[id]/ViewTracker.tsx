"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ViewTracker({ listingId }: { listingId: string }) {
  useEffect(() => {
    if (!listingId) return;

    const key = `viewed_${listingId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    const timer = setTimeout(async () => {
      const supabase = createClient();
      await supabase.from("listing_views").insert({
        listing_id: listingId,
        viewed_at: new Date().toISOString(),
        user_agent: navigator.userAgent.slice(0, 200),
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [listingId]);

  return null;
}
