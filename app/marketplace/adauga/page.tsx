"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import imageCompression from "browser-image-compression";
import Navbar from "@/app/components/Navbar";
import { triggerCelebration } from "@/app/components/MascotCelebration";

// ── Constants ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Cărucioare & scaune auto",
  "Îmbrăcăminte",
  "Jucării",
  "Cărți & educație",
  "Mobilier copii",
  "Accesorii bebeluș",
  "Echipament sport",
  "Altele",
];

const CONDITIONS = ["Nou", "Ca nou", "Bună", "Acceptabilă"];

const AGE_OPTIONS = [
  "", "0-6 luni", "6-12 luni", "1-3 ani", "3-6 ani", "6+ ani",
];

// ── Types ──────────────────────────────────────────────────────────────────

type ListingType = "vand" | "donez" | "inchiriez";
type ContactPref = "phone" | "message" | "both";

type FormState = {
  title: string;
  category: string;
  type: ListingType;
  price: string;
  condition: string;
  age_recommendation: string;
  description: string;
  contact_preference: ContactPref;
  phone: string;
};

type FormErrors = Partial<Record<keyof FormState | "images" | "general", string>>;

// ── Helpers ────────────────────────────────────────────────────────────────

const INITIAL_FORM: FormState = {
  title: "",
  category: "",
  type: "vand",
  price: "",
  condition: "",
  age_recommendation: "",
  description: "",
  contact_preference: "both",
  phone: "",
};

// ── Component ──────────────────────────────────────────────────────────────

export default function AdaugaPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Form
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Images
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [dragging, setDragging] = useState(false);

  // ── Auth check ─────────────────────────────────────────────────────────

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/?login=1");
      } else {
        setUserId(user.id);
        setAuthChecked(true);
      }
    });
  }, [router]);

  // ── Image handling ─────────────────────────────────────────────────────

  const addImages = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files);
    const remaining = 3 - images.length;
    if (remaining <= 0) return;
    const toAdd = arr.slice(0, remaining);

    const compressed: File[] = [];
    const newPreviews: string[] = [];

    for (const file of toAdd) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const comp = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
        compressed.push(comp as File);
        newPreviews.push(URL.createObjectURL(comp));
      } catch {
        // skip failed compressions
      }
    }

    setImages((prev) => [...prev, ...compressed]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    setErrors((prev) => ({ ...prev, images: undefined }));
  }, [images.length]);

  function removeImage(index: number) {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Form helpers ───────────────────────────────────────────────────────

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  // ── Validation ─────────────────────────────────────────────────────────

  function validate(): boolean {
    const e: FormErrors = {};

    if (!form.title.trim())
      e.title = "Titlul este obligatoriu.";
    else if (form.title.length > 100)
      e.title = "Titlul poate avea maximum 100 de caractere.";

    if (!form.category)
      e.category = "Alege o categorie.";

    if (form.type !== "donez") {
      if (!form.price)
        e.price = "Prețul este obligatoriu.";
      else if (isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0)
        e.price = "Introdu un preț valid (număr pozitiv).";
    }

    if (!form.condition)
      e.condition = "Starea produsului este obligatorie.";

    if (!form.description.trim())
      e.description = "Descrierea este obligatorie.";
    else if (form.description.trim().length < 20)
      e.description = "Descrierea trebuie să aibă minim 20 de caractere.";

    if (form.contact_preference === "phone" || form.contact_preference === "both") {
      if (!form.phone.trim())
        e.phone = "Numărul de telefon este obligatoriu.";
      else if (!/^\+?\d[\d\s\-()]{7,}$/.test(form.phone.trim()))
        e.phone = "Introdu un număr de telefon valid.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Submit ─────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (!userId) return;

    setSubmitting(true);
    setErrors({});

    const supabase = createClient();

    // Upload images
    const imageUrls: string[] = [];
    for (let i = 0; i < images.length; i++) {
      setUploadProgress(Math.round(((i) / images.length) * 80));
      const file = images[i];
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("marketplace-images")
        .upload(path, file, { contentType: file.type || "image/jpeg" });
      if (!uploadErr) {
        const { data } = supabase.storage.from("marketplace-images").getPublicUrl(path);
        imageUrls.push(data.publicUrl);
      }
    }
    setUploadProgress(90);

    // Insert listing
    const payload = {
      user_id: userId,
      title: form.title.trim(),
      category: form.category,
      type: form.type,
      price: form.type === "donez" ? null : (parseFloat(form.price) || null),
      condition: form.condition,
      age_recommendation: form.age_recommendation || null,
      description: form.description.trim(),
      contact_preference: form.contact_preference,
      phone: (form.contact_preference === "phone" || form.contact_preference === "both")
        ? form.phone.trim()
        : null,
      images: imageUrls,
      status: "activ",
    };

    const { data: newListing, error } = await supabase
      .from("marketplace_listings")
      .insert(payload)
      .select("id")
      .single();

    setUploadProgress(100);

    if (error || !newListing) {
      setErrors({ general: "A apărut o eroare la salvarea anunțului. Încearcă din nou." });
      setSubmitting(false);
      setUploadProgress(0);
      return;
    }

    triggerCelebration();
    router.push(`/marketplace/${newListing.id}`);
  }

  // ── Loading / auth ─────────────────────────────────────────────────────

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#f7f7f7]">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-[#ff5a2e] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────

  const needsPhone = form.contact_preference === "phone" || form.contact_preference === "both";
  const needsPrice = form.type !== "donez";

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-[#fff5f3] pt-12 pb-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1a1a2e] mb-2">
            Adaugă anunț
          </h1>
          <p className="text-gray-500 text-base">
            Vinde, donează sau închiriază obiecte pentru copii din Sibiu
          </p>
        </div>
      </section>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">

          {/* General error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl">
              {errors.general}
            </div>
          )}

          {/* ── 1. Titlu ── */}
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label className="text-sm font-semibold text-[#1a1a2e]">
                Titlu <span className="text-[#ff5a2e]">*</span>
              </label>
              <span className={`text-xs ${form.title.length > 90 ? "text-[#ff5a2e]" : "text-gray-400"}`}>
                {form.title.length}/100
              </span>
            </div>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="ex: Cărucior Cybex în stare excelentă"
              maxLength={100}
              className={`w-full px-4 py-3 text-sm text-gray-700 bg-white border rounded-xl focus:outline-none transition-colors placeholder-gray-400 ${
                errors.title ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-[#ff5a2e]"
              }`}
            />
            {errors.title && <p className="mt-1.5 text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* ── 2. Categorie ── */}
          <div>
            <label className="block text-sm font-semibold text-[#1a1a2e] mb-1.5">
              Categorie <span className="text-[#ff5a2e]">*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className={`w-full px-4 py-3 text-sm text-gray-700 bg-white border rounded-xl focus:outline-none transition-colors appearance-none cursor-pointer ${
                errors.category ? "border-red-400" : "border-gray-200 focus:border-[#ff5a2e]"
              }`}
            >
              <option value="">Alege o categorie</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1.5 text-xs text-red-500">{errors.category}</p>}
          </div>

          {/* ── 3. Tip anunț ── */}
          <div>
            <label className="block text-sm font-semibold text-[#1a1a2e] mb-2">
              Tip anunț <span className="text-[#ff5a2e]">*</span>
            </label>
            <div className="flex gap-2">
              {(["vand", "donez", "inchiriez"] as ListingType[]).map((t) => {
                const labels: Record<ListingType, string> = { vand: "Vând", donez: "Donez", inchiriez: "Închiriez" };
                const active = form.type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("type", t)}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-150 ${
                      active
                        ? "bg-[#ff5a2e] text-white border-[#ff5a2e]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#ff5a2e] hover:text-[#ff5a2e]"
                    }`}
                  >
                    {labels[t]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 4. Preț ── */}
          {needsPrice && (
            <div>
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-1.5">
                {form.type === "inchiriez" ? "Preț pe zi (lei)" : "Preț (lei)"}
                <span className="text-[#ff5a2e]"> *</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="0"
                  min="0"
                  step="1"
                  className={`w-full pl-4 pr-14 py-3 text-sm text-gray-700 bg-white border rounded-xl focus:outline-none transition-colors ${
                    errors.price ? "border-red-400" : "border-gray-200 focus:border-[#ff5a2e]"
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                  lei{form.type === "inchiriez" ? "/zi" : ""}
                </span>
              </div>
              {errors.price && <p className="mt-1.5 text-xs text-red-500">{errors.price}</p>}
            </div>
          )}

          {/* ── 5. Stare produs ── */}
          <div>
            <label className="block text-sm font-semibold text-[#1a1a2e] mb-1.5">
              Stare produs <span className="text-[#ff5a2e]">*</span>
            </label>
            <select
              value={form.condition}
              onChange={(e) => set("condition", e.target.value)}
              className={`w-full px-4 py-3 text-sm text-gray-700 bg-white border rounded-xl focus:outline-none transition-colors appearance-none cursor-pointer ${
                errors.condition ? "border-red-400" : "border-gray-200 focus:border-[#ff5a2e]"
              }`}
            >
              <option value="">Alege starea</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.condition && <p className="mt-1.5 text-xs text-red-500">{errors.condition}</p>}
          </div>

          {/* ── 6. Vârstă recomandată ── */}
          <div>
            <label className="block text-sm font-semibold text-[#1a1a2e] mb-1.5">
              Vârstă recomandată
              <span className="text-gray-400 font-normal ml-1">(opțional)</span>
            </label>
            <select
              value={form.age_recommendation}
              onChange={(e) => set("age_recommendation", e.target.value)}
              className="w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#ff5a2e] transition-colors appearance-none cursor-pointer"
            >
              <option value="">Nicio restricție de vârstă</option>
              {AGE_OPTIONS.filter(Boolean).map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* ── 7. Descriere ── */}
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label className="text-sm font-semibold text-[#1a1a2e]">
                Descriere <span className="text-[#ff5a2e]">*</span>
              </label>
              <span className={`text-xs ${form.description.length < 20 && form.description.length > 0 ? "text-[#ff5a2e]" : "text-gray-400"}`}>
                {form.description.length} / min. 20 caractere
              </span>
            </div>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Descrie produsul: stare, marca, dimensiuni, motive vânzare..."
              rows={5}
              className={`w-full px-4 py-3 text-sm text-gray-700 bg-white border rounded-xl focus:outline-none transition-colors resize-none placeholder-gray-400 ${
                errors.description ? "border-red-400" : "border-gray-200 focus:border-[#ff5a2e]"
              }`}
            />
            {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description}</p>}
          </div>

          {/* ── 8. Poze ── */}
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label className="text-sm font-semibold text-[#1a1a2e]">Poze</label>
              <span className="text-xs text-gray-400">{images.length}/3</span>
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="flex gap-2 mb-3 flex-wrap">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-black/80 transition-colors leading-none"
                    >
                      ×
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Drop zone */}
            {images.length < 3 && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  addImages(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                  dragging
                    ? "border-[#ff5a2e] bg-[#fff5f3]"
                    : "border-gray-200 bg-white hover:border-[#ff5a2e] hover:bg-[#fff5f3]"
                }`}
              >
                <span className="text-3xl">🖼️</span>
                <p className="text-sm font-semibold text-gray-600">
                  Trage pozele aici sau <span className="text-[#ff5a2e]">alege fișiere</span>
                </p>
                <p className="text-xs text-gray-400">Max. {3 - images.length} {3 - images.length === 1 ? "poză" : "poze"} · JPG, PNG, WebP</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && addImages(e.target.files)}
                />
              </div>
            )}
            {errors.images && <p className="mt-1.5 text-xs text-red-500">{errors.images}</p>}
          </div>

          {/* ── 9. Contact preference ── */}
          <div>
            <label className="block text-sm font-semibold text-[#1a1a2e] mb-2">
              Cum dorești să fii contactat? <span className="text-[#ff5a2e]">*</span>
            </label>
            <div className="flex gap-2">
              {(["phone", "message", "both"] as ContactPref[]).map((pref) => {
                const labels: Record<ContactPref, string> = {
                  phone: "Telefon",
                  message: "Mesaje",
                  both: "Ambele",
                };
                const active = form.contact_preference === pref;
                return (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => set("contact_preference", pref)}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-150 ${
                      active
                        ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {labels[pref]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 10. Telefon ── */}
          {needsPhone && (
            <div>
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-1.5">
                Număr de telefon <span className="text-[#ff5a2e]">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="ex: 0722 123 456"
                className={`w-full px-4 py-3 text-sm text-gray-700 bg-white border rounded-xl focus:outline-none transition-colors placeholder-gray-400 ${
                  errors.phone ? "border-red-400" : "border-gray-200 focus:border-[#ff5a2e]"
                }`}
              />
              <p className="mt-1 text-xs text-gray-400">Vizibil doar cumpărătorilor interesați</p>
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>
          )}

          {/* ── Submit ── */}
          <div className="pt-2">
            {submitting && uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Se publică anunțul...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ff5a2e] rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#ff5a2e] hover:bg-[#f03d12] disabled:opacity-60 text-white font-semibold py-4 rounded-full text-base transition-colors duration-200 shadow-sm"
            >
              {submitting ? "Se publică..." : "Publică anunțul"}
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              Prin publicare confirmi că ești proprietarul obiectului.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
