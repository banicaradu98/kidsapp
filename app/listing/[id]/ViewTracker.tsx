"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ViewTracker({ listingId }: { listingId: string }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const supabase = createClient();
      supabase.from("listing_views").insert({
        listing_id: listingId,
        viewed_at: new Date().toISOString(),
        user_agent: navigator.userAgent.slice(0, 200),
      }).then(() => {});
    }, 2000);
    return () => clearTimeout(timer);
  }, [listingId]);

  return null;
}
