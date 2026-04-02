"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Reply { id: string; text: string; created_at: string; }
interface Review {
  id: string;
  rating: number;
  text: string | null;
  created_at: string;
  user_name: string | null;
  review_replies: Reply[] | Reply | null;
}

interface Props {
  reviews: Review[];
  listingId: string;
  organizerId: string;
}

export default function ReviewsPanel({ reviews, organizerId }: Props) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [saving, setSaving] = useState(false);
  const [localReplies, setLocalReplies] = useState<Record<string, string>>({});

  // Normalize reply: Supabase returns single object or array depending on query
  function getReply(r: Review): Reply | null {
    if (!r.review_replies) return null;
    if (Array.isArray(r.review_replies)) return r.review_replies[0] ?? null;
    return r.review_replies as Reply;
  }

  async function handleReply(reviewId: string) {
    if (!replyText.trim()) return;
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("review_replies")
      .upsert({ review_id: reviewId, organizer_id: organizerId, text: replyText.trim() }, { onConflict: "review_id" })
      .select()
      .single();
    if (!error && data) {
      setLocalReplies((prev) => ({ ...prev, [reviewId]: data.text }));
    }
    setReplyingTo(null);
    setReplyText("");
    setSaving(false);
  }

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-base font-black text-[#1a1a2e] mb-4">⭐ Recenzii primite ({reviews.length})</h2>

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-400 font-medium text-center py-6">Nicio recenzie încă.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((r) => {
            const existingReply = getReply(r);
            const localReply = localReplies[r.id];
            const replyContent = localReply ?? existingReply?.text;

            return (
              <div key={r.id} className="border border-gray-100 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-bold text-gray-700 text-sm">{r.user_name ?? "Utilizator"}</p>
                    <p className="text-xs text-gray-400 font-medium">{new Date(r.created_at).toLocaleDateString("ro-RO", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    {[1,2,3,4,5].map((n) => (
                      <span key={n} className={n <= r.rating ? "text-yellow-400 text-sm" : "text-gray-200 text-sm"}>★</span>
                    ))}
                  </div>
                </div>
                {r.text && <p className="text-sm text-gray-600 font-medium leading-relaxed mb-3">{r.text}</p>}

                {/* Reply */}
                {replyContent ? (
                  <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
                    <p className="text-xs font-black text-[#ff5a2e] mb-1">Răspunsul tău:</p>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">{replyContent}</p>
                    <button
                      onClick={() => { setReplyingTo(r.id); setReplyText(replyContent); }}
                      className="text-xs font-bold text-gray-400 hover:text-[#ff5a2e] mt-1 transition-colors"
                    >
                      Editează răspunsul
                    </button>
                  </div>
                ) : replyingTo === r.id ? (
                  <div className="flex flex-col gap-2 mt-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={2}
                      placeholder="Scrie răspunsul tău..."
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#ff5a2e] resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => { setReplyingTo(null); setReplyText(""); }} className="text-xs font-bold text-gray-400">Anulează</button>
                      <button onClick={() => handleReply(r.id)} disabled={saving} className="bg-[#ff5a2e] text-white font-black text-xs px-3 py-1.5 rounded-lg disabled:opacity-50">
                        {saving ? "..." : "Trimite"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setReplyingTo(r.id); setReplyText(""); }}
                    className="text-xs font-bold text-gray-400 hover:text-[#ff5a2e] transition-colors mt-1"
                  >
                    + Răspunde
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
