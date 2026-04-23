"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { triggerCelebration } from "@/app/components/MascotCelebration";
import { submitContactMessage } from "./contactActions";

const SUBJECTS = [
  "Întrebare generală",
  "Listez o locație / activitate",
  "Parteneriat",
  "Problemă tehnică",
  "Sugestie",
  "Altceva",
];

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await submitContactMessage(form);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      triggerCelebration();
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-b from-white to-[#fff5f3] pt-16 pb-16 px-4 sm:pt-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #ff5a2e 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-orange-100 text-[#ff5a2e] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6 shadow-sm">
            <span>✉️</span> Contact
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#1a1a2e] leading-tight mb-4">
            Hai să vorbim
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Întrebări, sugestii sau parteneriate — suntem aici.
          </p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

            {/* ── FORM ── */}
            <div className="lg:col-span-3">
              {success ? (
                <div className="bg-green-50 border border-green-200 rounded-3xl p-10 text-center">
                  <div className="text-5xl mb-4">🎉</div>
                  <h2 className="font-display text-2xl font-bold text-[#1a1a2e] mb-3">
                    Mesaj trimis cu succes!
                  </h2>
                  <p className="text-gray-500 text-base leading-relaxed mb-6">
                    Îți mulțumim că ne-ai scris. Revenim în cel mai scurt timp.
                  </p>
                  <button
                    onClick={() => { setSuccess(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black px-6 py-3 rounded-xl transition-colors"
                  >
                    Trimite alt mesaj
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-[#1a1a2e] mb-2">
                        Nume <span className="text-[#ff5a2e]">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Numele tău"
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5a2e]/30 focus:border-[#ff5a2e] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#1a1a2e] mb-2">
                        Email <span className="text-[#ff5a2e]">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="email@exemplu.ro"
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5a2e]/30 focus:border-[#ff5a2e] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#1a1a2e] mb-2">
                      Subiect <span className="text-[#ff5a2e]">*</span>
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => set("subject", e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#ff5a2e]/30 focus:border-[#ff5a2e] transition-all bg-white"
                    >
                      <option value="">Alege un subiect...</option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#1a1a2e] mb-2">
                      Mesaj <span className="text-[#ff5a2e]">*</span>
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder="Scrie mesajul tău..."
                      required
                      rows={6}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5a2e]/30 focus:border-[#ff5a2e] transition-all resize-none"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-semibold text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#ff5a2e] hover:bg-[#f03d12] disabled:opacity-60 text-white font-black text-base py-4 rounded-2xl transition-all shadow-[0_4px_16px_rgba(255,90,46,0.25)] active:scale-[0.98]"
                  >
                    {loading ? "Se trimite..." : "Trimite mesajul →"}
                  </button>
                </form>
              )}
            </div>

            {/* ── INFO COLUMN ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              <div className="bg-[#fff5f3] rounded-3xl p-7 border border-orange-100">
                <div className="text-3xl mb-3">📧</div>
                <h3 className="font-display text-lg font-bold text-[#1a1a2e] mb-2">Email</h3>
                <a
                  href="mailto:hello@moosey.ro"
                  className="text-[#ff5a2e] font-bold text-base hover:underline"
                >
                  hello@moosey.ro
                </a>
                <p className="text-gray-400 text-sm font-medium mt-1">
                  Răspundem în 1–2 zile lucrătoare.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm">
                <div className="text-3xl mb-3">📍</div>
                <h3 className="font-display text-lg font-bold text-[#1a1a2e] mb-2">Locație</h3>
                <p className="text-gray-500 font-semibold">Sibiu, România</p>
                <p className="text-gray-400 text-sm font-medium mt-1">
                  Platformă 100% dedicată familiilor din Sibiu.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm">
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="font-display text-lg font-bold text-[#1a1a2e] mb-2">
                  Ești organizator?
                </h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed mb-4">
                  Listează-ți activitatea gratuit și fii descoperit de sute de familii.
                </p>
                <a
                  href="/adauga-locatia-ta"
                  className="inline-block bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black text-sm px-5 py-2.5 rounded-xl transition-colors"
                >
                  + Adaugă locația ta
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
