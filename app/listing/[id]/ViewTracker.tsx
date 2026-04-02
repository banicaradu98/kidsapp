"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ViewTracker({ listingId }: { listingId: string }) {
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      supabase.from("listing_views").insert({
        listing_id: listingId,
        user_id: session?.user?.id ?? null,
      });
    });
  }, [listingId]);

  return null;
}
