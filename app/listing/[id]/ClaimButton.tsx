"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AuthModal from "@/app/components/AuthModal";

interface Props {
  listingId: string;
  listingName: string;
  claimedBy?: string | null;
}

type ClaimStatus = "none" | "pending" | "approved" | "rejected" | "loading";

export default function ClaimButton({ listingId, listingName, claimedBy }: Props) {
  // Already claimed by someone else — hide the button entirely
  if (claimedBy) return null;
  const [status, setStatus] = useState<ClaimStatus>("loading");
  const [userId, setUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) { setStatus("none"); return; }
      setUserId(session.user.id);
      setContactEmail(session.user.email ?? "");

      const { data } = await supabase
        .from("claims")
        .select("status")
        .eq("listing_id", listingId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      setStatus((data?.status as ClaimStatus) ?? "none");
    });
  }, [listingId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const payload = {
      listing_id: listingId,
      user_id: userId,
      email: contactEmail,
      phone: phone || null,
      message: message || null,
    };
    const { error: err } = await supabase.from("claims").insert(payload);

    if (err) {
      setError(err.message.includes("unique") ? "Ai trimis deja o cerere pentru acest listing." : "Eroare. Încearcă din nou.");
      setSubmitting(false);
    } else {
      setSuccess(true);
      setStatus("pending");
      setSubmitting(false);
    }
  }

  // Don't render anything during loading
  if (status === "loading") return null;

  if (status === "approved") {
    return (
      <p className="text-xs font-bold text-green-600 text-center py-2">
        ✓ Locație revendicată — <a href="/dashboard" className="underline hover:text-green-700">Mergi la Dashboard →</a>
      </p>
    );
  }

  if (status === "pending") {
    return (
      <p className="text-xs font-semibold text-amber-600 text-center py-2">
        ⏳ Cerere de revendicare în așteptare — te contactăm în maxim 48 ore.
      </p>
    );
  }

  return (
    <>
      <button
        onClick={() => {
          if (!userId) { setShowAuthModal(true); return; }
          setShowModal(true);
        }}
        className="text-xs font-semibold text-gray-400 hover:text-[#ff5a2e] transition-colors py-2"
      >
        Ești proprietarul acestui loc? <span className="underline">Revendică pagina →</span>
      </button>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {showModal && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 9999 }}
          className="flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => !submitting && setShowModal(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {success ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-lg font-black text-[#1a1a2e] mb-2">Cerere trimisă!</h3>
                <p className="text-sm text-gray-500 font-medium">Te contactăm la <strong>{contactEmail}</strong> în maxim 48 de ore.</p>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-5 w-full bg-[#ff5a2e] text-white font-black py-3 rounded-xl text-sm"
                >
                  Închide
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-black text-[#1a1a2e] leading-snug">
                      Revendică &bdquo;{listingName}&rdquo;
                    </h3>
                    <p className="text-sm text-gray-400 font-medium mt-1">
                      Confirmăm că ești proprietarul sau administratorul acestui loc.
                    </p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm shrink-0 ml-3">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Email de contact al locației *</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                      placeholder="contact@locatia-ta.ro"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#ff5a2e] focus:ring-2 focus:ring-[#ff5a2e]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Număr de telefon de contact *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+40 7xx xxx xxx"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#ff5a2e] focus:ring-2 focus:ring-[#ff5a2e]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Mesaj pentru admin (opțional)</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Descrie pe scurt relația ta cu această locație..."
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#ff5a2e] focus:ring-2 focus:ring-[#ff5a2e]/20 resize-none"
                    />
                  </div>

                  {error && <p className="text-sm font-bold text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">⚠️ {error}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#ff5a2e] hover:bg-[#f03d12] disabled:opacity-60 text-white font-black py-3.5 rounded-xl text-sm transition-colors"
                  >
                    {submitting ? "Se trimite..." : "Trimite cererea"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
