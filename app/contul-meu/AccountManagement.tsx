"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
  email: string;
  userId: string;
}

const inputCls =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#ff5a2e] focus:ring-2 focus:ring-[#ff5a2e]/20 transition-all bg-white placeholder-gray-400";

export default function AccountManagement({ email, userId }: Props) {
  const [pauseModal, setPauseModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteMarketplace, setDeleteMarketplace] = useState<boolean | null>(null);
  const [marketplaceCount, setMarketplaceCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("marketplace_listings")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "activ")
      .then(({ count }) => setMarketplaceCount(count ?? 0));
  }, [userId]);

  function closeModals() {
    setPauseModal(false);
    setDeleteModal(false);
    setConfirmPassword("");
    setError(null);
    setDeleteMarketplace(null);
  }

  async function handlePause() {
    if (!confirmPassword) {
      setError("Introduceți parola pentru confirmare.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: confirmPassword });
    if (signInError) {
      setError("Parolă incorectă.");
      setLoading(false);
      return;
    }

    await supabase.from("profiles").update({
      account_status: "paused",
      paused_at: new Date().toISOString(),
    }).eq("id", userId);

    await supabase.auth.signOut();
    router.push("/?mesaj=cont-dezactivat");
  }

  async function handleDelete() {
    if (!confirmPassword) {
      setError("Introduceți parola pentru confirmare.");
      return;
    }
    if (marketplaceCount > 0 && deleteMarketplace === null) {
      setError("Selectați ce doriți să faceți cu anunțurile din marketplace.");
      return;
    }
    setLoading(true);
    setError(null);

    const res = await fetch("/api/delete-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: confirmPassword,
        deleteMarketplace: deleteMarketplace !== false,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Eroare la ștergerea contului.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/?mesaj=cont-sters");
  }

  return (
    <>
      <section className="border-t border-gray-200 pt-8 pb-4">
        <h2 className="text-lg font-black text-[#1a1a2e] mb-1">Gestionare cont</h2>
        <p className="text-sm text-gray-400 mb-6">
          Opțiuni pentru dezactivarea sau ștergerea contului tău.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => { setError(null); setPauseModal(true); }}
            className="flex-1 border-2 border-amber-400 text-amber-600 hover:bg-amber-50 font-bold py-3 px-4 rounded-xl text-sm transition-all"
          >
            ⏸ Ia o pauză
          </button>
          <button
            onClick={() => { setError(null); setDeleteModal(true); }}
            className="flex-1 border-2 border-red-400 text-red-600 hover:bg-red-50 font-bold py-3 px-4 rounded-xl text-sm transition-all"
          >
            🗑 Șterge contul definitiv
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Autentificat cu Google? Contactează-ne la hello@moosey.ro pentru ștergerea contului.
        </p>
      </section>

      {/* Pause Modal */}
      {pauseModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeModals}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-black text-[#1a1a2e] mb-3">⏸ Ia o pauză</h3>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-amber-800 space-y-1">
              <p>• Contul tău va fi dezactivat temporar.</p>
              <p>• Datele tale rămân salvate.</p>
              <p>• Listingurile revendicate rămân în baza de date.</p>
              <p>• Recenziile tale vor fi ascunse temporar.</p>
            </div>
            <input
              type="password"
              placeholder="Parola ta pentru confirmare"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputCls + " mb-3"}
            />
            {error && (
              <p className="text-sm font-bold text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-3">
                ⚠️ {error}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={closeModals}
                className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl text-sm hover:bg-gray-50 transition-all"
              >
                Anulează
              </button>
              <button
                onClick={handlePause}
                disabled={loading}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-black py-3 rounded-xl text-sm transition-all"
              >
                {loading ? "Se procesează..." : "Dezactivează contul"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeModals}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-black text-red-600 mb-3">🗑 Șterge contul definitiv</h3>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="font-black text-red-700 text-sm mb-2">⚠️ Această acțiune este ireversibilă!</p>
              <ul className="text-sm text-red-600 space-y-1">
                <li>✗ Contul tău va fi șters definitiv</li>
                <li>✗ Recenziile tale vor fi șterse</li>
                <li>✗ Anunțurile din marketplace vor fi șterse</li>
                <li>✗ Listingurile revendicate devin disponibile</li>
                <li>✗ Vei fi eliminat din newsletter</li>
              </ul>
            </div>

            {marketplaceCount > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4 text-sm">
                <p className="font-bold text-orange-800 mb-2">
                  Ai {marketplaceCount} {marketplaceCount === 1 ? "anunț activ" : "anunțuri active"} în marketplace. Ce facem cu ele?
                </p>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deleteOption"
                      onChange={() => setDeleteMarketplace(true)}
                      className="accent-red-500"
                    />
                    <span className="text-orange-700">Da, șterge tot</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deleteOption"
                      onChange={() => setDeleteMarketplace(false)}
                      className="accent-orange-500"
                    />
                    <span className="text-orange-700">Păstrează-le anonime</span>
                  </label>
                </div>
              </div>
            )}

            <input
              type="password"
              placeholder="Parola ta pentru confirmare"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputCls + " mb-3"}
            />
            {error && (
              <p className="text-sm font-bold text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-3">
                ⚠️ {error}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={closeModals}
                className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl text-sm hover:bg-gray-50 transition-all"
              >
                Anulează
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-black py-3 rounded-xl text-sm transition-all"
              >
                {loading ? "Se procesează..." : "Șterge definitiv"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
