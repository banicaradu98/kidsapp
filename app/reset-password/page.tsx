"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";

const inputCls =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#ff5a2e] focus:ring-2 focus:ring-[#ff5a2e]/20 transition-all bg-white placeholder-gray-400";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const supabase = createClient();
    const code = searchParams.get("code");

    async function init() {
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setError("Link invalid sau expirat. Solicită un nou email de resetare.");
          return;
        }
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSessionReady(true);
      } else {
        setError("Link invalid sau expirat. Solicită un nou email de resetare.");
      }
    }

    init();
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Parolele nu se potrivesc.");
      return;
    }
    if (password.length < 6) {
      setError("Parola trebuie să aibă cel puțin 6 caractere.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError("Eroare la actualizarea parolei. Încearcă din nou.");
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/contul-meu"), 2000);
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">
      <div className="text-center mb-6">
        <img
          src="/images/moosey_transparent.png"
          alt="Moosey"
          className="h-16 w-auto mx-auto mb-4 object-contain"
        />
        <h1 className="text-2xl font-black text-[#1a1a2e]">Resetează parola</h1>
        <p className="text-gray-500 text-sm mt-1">Alege o parolă nouă pentru contul tău</p>
      </div>

      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">✅</div>
          <p className="font-bold text-green-800">Parolă actualizată cu succes!</p>
          <p className="text-green-600 text-sm mt-1">Ești redirecționat spre contul tău...</p>
        </div>
      ) : error && !sessionReady ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="font-bold text-red-800 mb-3">{error}</p>
          <a
            href="/"
            className="text-[#ff5a2e] text-sm hover:underline"
          >
            Înapoi la homepage
          </a>
        </div>
      ) : sessionReady ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Parolă nouă"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputCls}
          />
          <input
            type="password"
            placeholder="Confirmă parola nouă"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={inputCls}
          />
          {error && (
            <p className="text-sm font-bold text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              ⚠️ {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff5a2e] hover:bg-[#f03d12] disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-xl text-sm transition-colors"
          >
            {loading ? "Se salvează..." : "Salvează parola nouă"}
          </button>
        </form>
      ) : (
        <div className="text-center py-8">
          <span className="inline-block w-8 h-8 border-2 border-gray-200 border-t-[#ff5a2e] rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-16">
        <Suspense fallback={
          <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
            <span className="inline-block w-8 h-8 border-2 border-gray-200 border-t-[#ff5a2e] rounded-full animate-spin" />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </main>
    </div>
  );
}
