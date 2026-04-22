"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { signInWithGoogle, signInWithEmail, signUp } from "@/utils/supabase/auth";

interface Props {
  onClose: () => void;
}

const inputCls =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#ff5a2e] focus:ring-2 focus:ring-[#ff5a2e]/20 transition-all bg-white placeholder-gray-400";

export default function AuthModal({ onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");

  useEffect(() => { setMounted(true); }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function switchTab(t: "login" | "register") {
    setTab(t);
    setError(null);
    setSuccess(null);
  }

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    const returnTo = window.location.pathname + window.location.search;
    const { error } = await signInWithGoogle(returnTo);
    if (error) {
      setError("Nu s-a putut conecta cu Google. Încearcă din nou.");
      setLoading(false);
    }
    // On success the browser redirects to Google — no need to reset loading
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (tab === "login") {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setError("Email sau parolă incorectă.");
        setLoading(false);
      } else {
        onClose();
        window.location.reload();
      }
      return;
    }

    // Register
    if (password !== confirmPassword) {
      setError("Parolele nu se potrivesc.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Parola trebuie să aibă cel puțin 6 caractere.");
      setLoading(false);
      return;
    }
    const { data, error } = await signUp(email, password, name);
    if (error) {
      setError(
        error.message.includes("already registered")
          ? "Există deja un cont cu acest email."
          : "A apărut o eroare. Încearcă din nou."
      );
      setLoading(false);
    } else if (data.session) {
      // Email confirmation disabled — user is logged in immediately
      onClose();
      window.location.reload();
    } else {
      setSuccess("Cont creat! Verifică emailul pentru a confirma contul.");
      setLoading(false);
    }
  }

  if (!mounted) return null;

  const modal = (
    /* Overlay — fixed, acoperă tot viewport-ul, blur pe background */
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999 }}
      className="flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Card modal — stopPropagation ca click-ul din interior să nu închidă */}
      <div
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-0">
          <div>
            <span className="text-3xl">🧡</span>
            <h2 className="text-xl font-black text-[#1a1a2e] mt-2">Bun venit pe Moosey!</h2>
            <p className="text-sm text-gray-500 font-medium mt-0.5">
              Salvează locuri preferate și lasă recenzii
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold transition-colors shrink-0 mt-1"
            aria-label="Închide"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pt-5 pb-6 flex flex-col gap-0">
          {/* TODO: adaugă buton Facebook când e gata business verification */}
          {/* Buton Google — mereu vizibil, deasupra tab-urilor */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-[#ff5a2e]/40 hover:bg-orange-50/40 rounded-2xl px-4 py-3.5 font-bold text-gray-700 text-sm transition-all disabled:opacity-60"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuă cu Google
          </button>

          {/* Separator */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-semibold text-gray-400">sau continuă cu email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
            <button
              onClick={() => switchTab("login")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                tab === "login"
                  ? "bg-white text-[#1a1a2e] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Intră în cont
            </button>
            <button
              onClick={() => switchTab("register")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                tab === "register"
                  ? "bg-white text-[#1a1a2e] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Înregistrează-te
            </button>
          </div>

          {success ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">📬</div>
              <p className="font-bold text-gray-800 mb-1">Verifică emailul</p>
              <p className="text-sm text-gray-500 font-medium">{success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {tab === "register" && (
                <input
                  type="text"
                  placeholder="Numele tău"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={inputCls}
                />
              )}
              <input
                type="email"
                placeholder="adresa@email.ro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputCls}
              />
              <input
                type="password"
                placeholder="Parola"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputCls}
              />
              {tab === "register" && (
                <input
                  type="password"
                  placeholder="Confirmă parola"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={inputCls}
                />
              )}

              {error && (
                <p className="text-sm font-bold text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  ⚠️ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff5a2e] hover:bg-[#f03d12] disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-xl text-sm transition-colors mt-1"
              >
                {loading
                  ? "Se procesează..."
                  : tab === "login"
                  ? "Intră în cont"
                  : "Creează cont"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
