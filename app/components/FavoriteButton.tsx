"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AuthModal from "./AuthModal";

interface Props {
  listingId: string;
  variant?: "card" | "detail" | "hero";
}

export default function FavoriteButton({ listingId, variant = "card" }: Props) {
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      const { data } = await supabase
        .from("user_favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("listing_id", listingId)
        .maybeSingle();
      setIsFav(!!data);
    });
  }, [listingId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      setShowModal(true);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    if (isFav) {
      await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", userId)
        .eq("listing_id", listingId);
      setIsFav(false);
    } else {
      await supabase
        .from("user_favorites")
        .insert({ user_id: userId, listing_id: listingId });
      setIsFav(true);
    }
    setLoading(false);
  }

  if (variant === "hero") {
    return (
      <>
        <button
          onClick={toggle}
          disabled={loading}
          aria-label={isFav ? "Elimină din favorite" : "Salvează la favorite"}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all shadow-md backdrop-blur-sm ${
            isFav
              ? "bg-red-500 text-white scale-110"
              : "bg-white/80 text-gray-400 hover:text-red-400 hover:bg-white hover:scale-110"
          }`}
        >
          {isFav ? "❤️" : "🤍"}
        </button>
        {showModal && <AuthModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  if (variant === "detail") {
    return (
      <>
        <button
          onClick={toggle}
          disabled={loading}
          className={`w-full font-bold text-sm py-3 rounded-xl text-center transition-all border-2 ${
            isFav
              ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
              : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400 hover:bg-red-50"
          }`}
        >
          {isFav ? "❤️ Salvat la favorite" : "🤍 Salvează locul"}
        </button>
        {showModal && <AuthModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  return (
    <>
      <button
        onClick={toggle}
        disabled={loading}
        aria-label={isFav ? "Elimină din favorite" : "Salvează la favorite"}
        className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all shadow-sm ${
          isFav
            ? "bg-red-500 text-white scale-110"
            : "bg-white/90 text-gray-400 hover:text-red-400 hover:bg-white hover:scale-110"
        }`}
      >
        {isFav ? "❤️" : "🤍"}
      </button>
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  );
}
