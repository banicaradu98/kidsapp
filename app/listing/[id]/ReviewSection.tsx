"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AuthModal from "@/app/components/AuthModal";

interface Review {
  id: string;
  user_name: string;
  rating: number;
  text: string | null;
  created_at: string;
}

interface Props {
  listingId: string;
  initialReviews: Review[];
}

function Stars({
  value,
  onChange,
}: {
  value: number;
  onChange?: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const interactive = !!onChange;
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type={interactive ? "button" : undefined}
          onClick={interactive ? () => onChange!(n) : undefined}
          onMouseEnter={interactive ? () => setHovered(n) : undefined}
          onMouseLeave={interactive ? () => setHovered(0) : undefined}
          className={interactive ? "text-2xl transition-transform hover:scale-110" : "text-base"}
          style={{ cursor: interactive ? "pointer" : "default", background: "none", border: "none", padding: 0 }}
          aria-label={interactive ? `${n} stele` : undefined}
        >
          <span className={n <= (hovered || value) ? "text-yellow-400" : "text-gray-200"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ro-RO", {
    month: "long",
    year: "numeric",
  });
}

export default function ReviewSection({ listingId, initialReviews }: Props) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userReviewId, setUserReviewId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      const name =
        user.user_metadata?.full_name || user.email?.split("@")[0] || "Utilizator";
      setUserName(name);
      // Check if user already has a review
      supabase
        .from("reviews")
        .select("id")
        .eq("listing_id", listingId)
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setUserReviewId(data.id);
        });
    });
  }, [listingId, initialReviews]);

  async function refreshReviews() {
    const supabase = createClient();
    const { data } = await supabase
      .from("reviews")
      .select("id, user_name, rating, text, created_at")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false });
    setReviews(data ?? []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    if (rating === 0) {
      setFormError("Alege un număr de stele.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    const supabase = createClient();
    const { error } = await supabase.from("reviews").insert({
      listing_id: listingId,
      user_id: userId,
      user_name: userName,
      rating,
      text: text.trim() || null,
    });
    if (error) {
      setFormError(
        error.code === "23505"
          ? "Ai lăsat deja un review pentru această locație."
          : "A apărut o eroare. Încearcă din nou."
      );
      setSubmitting(false);
      return;
    }
    await refreshReviews();
    setShowForm(false);
    setRating(0);
    setText("");
    setSubmitting(false);
    // Re-check userReviewId
    const { data } = await supabase
      .from("reviews")
      .select("id")
      .eq("listing_id", listingId)
      .eq("user_id", userId)
      .maybeSingle();
    if (data) setUserReviewId(data.id);
  }

  async function handleDelete() {
    if (!userReviewId || !userId) return;
    const supabase = createClient();
    await supabase.from("reviews").delete().eq("id", userReviewId).eq("user_id", userId);
    setUserReviewId(null);
    await refreshReviews();
  }

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-black text-[#1a1a2e]">Recenzii</h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-yellow-400 text-sm">{"★".repeat(Math.round(avgRating))}</span>
              <span className="text-sm font-bold text-gray-700">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-gray-400 font-medium">
                ({reviews.length} {reviews.length === 1 ? "recenzie" : "recenzii"})
              </span>
            </div>
          )}
        </div>
        {!showForm && (
          userReviewId ? (
            <button
              onClick={handleDelete}
              className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors"
            >
              Șterge recenzia mea
            </button>
          ) : (
            <button
              onClick={() => {
                if (!userId) { setShowModal(true); return; }
                setShowForm(true);
              }}
              className="text-sm font-bold text-[#ff5a2e] hover:underline transition-colors"
            >
              + Lasă un review
            </button>
          )
        )}
      </div>

      {/* Review form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-4"
        >
          <p className="text-sm font-bold text-gray-700 mb-3">Evaluează această locație</p>
          <div className="mb-3">
            <Stars value={rating} onChange={setRating} />
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Împărtășește experiența ta (opțional)..."
            rows={3}
            className="w-full border border-orange-200 bg-white rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#ff5a2e] focus:ring-2 focus:ring-[#ff5a2e]/20 transition-all resize-none placeholder-gray-400"
          />
          {formError && (
            <p className="text-xs font-bold text-red-500 mt-2">⚠️ {formError}</p>
          )}
          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#ff5a2e] hover:bg-[#f03d12] disabled:opacity-60 text-white font-black text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              {submitting ? "Se trimite..." : "Trimite recenzia"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setFormError(null); }}
              className="text-sm font-bold text-gray-400 hover:text-gray-600 px-3 py-2.5 transition-colors"
            >
              Anulează
            </button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center">
          <p className="text-3xl mb-3">⭐</p>
          <p className="font-bold text-gray-700 mb-1">Fii primul care lasă un review</p>
          <p className="text-sm text-gray-400 font-medium mb-4">
            Ajută alți părinți să afle mai multe despre acest loc.
          </p>
          <button
            onClick={() => {
              if (!userId) { setShowModal(true); return; }
              setShowForm(true);
            }}
            className="inline-block bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            Lasă un review
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#ff5a2e]/10 flex items-center justify-center font-black text-[#ff5a2e] text-sm shrink-0">
                    {r.user_name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm leading-none">{r.user_name}</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{formatDate(r.created_at)}</p>
                  </div>
                </div>
                <Stars value={r.rating} />
              </div>
              {r.text && (
                <p className="text-gray-600 text-sm font-medium leading-relaxed">{r.text}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </section>
  );
}
