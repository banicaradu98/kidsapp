"use client";

import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { addOneTimeEvent } from "./oneTimeEventActions";

const CATEGORIES = [
  { value: "eveniment",    label: "🎪 Eveniment" },
  { value: "spectacol",    label: "🎭 Spectacol" },
  { value: "curs-atelier", label: "🎨 Atelier one-time" },
];

const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#ff5a2e] focus:ring-2 focus:ring-[#ff5a2e]/20 transition-all bg-white";
const labelCls = "block text-xs font-bold text-gray-500 mb-1.5";

const emptyForm = {
  title:      "",
  category:   "eveniment",
  description:"",
  event_date: "",
  start_time: "",
  end_time:   "",
  price:      "",
  age_min:    "",
  age_max:    "",
  address:    "",
  phone:      "",
};

export default function OneTimeEventForm() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Images
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  function set(k: keyof typeof emptyForm, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function reset() {
    setForm(emptyForm);
    setImageFiles([]);
    setImagePreviews([]);
    setUploadProgress(0);
    setError(null);
    setSuccess(false);
  }

  function addFiles(files: FileList | null) {
    if (!files) return;
    const remaining = 5 - imageFiles.length;
    const toAdd = Array.from(files).slice(0, remaining);
    setImageFiles((p) => [...p, ...toAdd]);
    setImagePreviews((p) => [...p, ...toAdd.map((f) => URL.createObjectURL(f))]);
  }

  function removeImage(i: number) {
    setImageFiles((p) => p.filter((_, idx) => idx !== i));
    setImagePreviews((p) => p.filter((_, idx) => idx !== i));
  }

  async function uploadFile(file: File, idx: number, total: number): Promise<string | null> {
    try {
      const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
      const fd = new FormData();
      fd.append("file", compressed);
      const res = await fetch("/api/upload-public", { method: "POST", body: fd });
      const json = await res.json();
      setUploadProgress(Math.round(((idx + 1) / total) * 80));
      return json.url ?? null;
    } catch {
      return null;
    }
  }

  async function handleSubmit() {
    if (!form.title.trim())     { setError("Titlul este obligatoriu."); return; }
    if (!form.event_date)       { setError("Data evenimentului este obligatorie."); return; }
    if (!form.start_time)       { setError("Ora de început este obligatorie."); return; }

    setSaving(true);
    setError(null);
    setUploadProgress(10);

    // Upload images sequentially
    const uploadedUrls: string[] = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const url = await uploadFile(imageFiles[i], i, Math.max(imageFiles.length, 1));
      if (url) uploadedUrls.push(url);
    }
    setUploadProgress(90);

    const result = await addOneTimeEvent({
      title:       form.title.trim(),
      category:    form.category,
      description: form.description.trim() || null,
      event_date:  form.event_date,
      start_time:  form.start_time || null,
      end_time:    form.end_time || null,
      price:       form.price || null,
      age_min:     form.age_min ? Number(form.age_min) : null,
      age_max:     form.age_max ? Number(form.age_max) : null,
      address:     form.address.trim() || null,
      phone:       form.phone.trim() || null,
      images:      uploadedUrls,
    });

    setUploadProgress(100);

    if (result.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    setSuccess(true);
    setSaving(false);
  }

  if (success) {
    return (
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <div className="text-center py-6">
          <p className="text-4xl mb-3">✅</p>
          <h3 className="text-lg font-black text-[#1a1a2e] mb-2">Eveniment trimis spre aprobare!</h3>
          <p className="text-sm text-gray-400 font-medium mb-6">
            Adminul va verifica și publica evenimentul în curând.
          </p>
          <button
            onClick={() => { reset(); setOpen(false); }}
            className="bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            Adaugă alt eveniment
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-black text-[#1a1a2e]">🎪 Adaugă eveniment one-time</h2>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Eveniment, spectacol sau atelier punctual — trimis spre aprobare admin
          </p>
        </div>
        <button
          onClick={() => { setOpen((v) => !v); setError(null); }}
          className="text-sm font-black text-[#ff5a2e] border border-[#ff5a2e] px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors"
        >
          {open ? "Închide" : "+ Adaugă"}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-4 pt-2 border-t border-gray-100">

          {/* Row 1: Titlu + Categorie */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Titlu eveniment *</label>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className={inputCls}
                placeholder="ex: Spectacol de Paște pentru copii"
              />
            </div>
            <div>
              <label className={labelCls}>Categorie *</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className={inputCls}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Data + Orar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Data evenimentului *</label>
              <input
                type="date"
                value={form.event_date}
                onChange={(e) => set("event_date", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Oră început *</label>
              <input
                type="time"
                value={form.start_time}
                onChange={(e) => set("start_time", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Oră sfârșit (opțional)</label>
              <input
                type="time"
                value={form.end_time}
                onChange={(e) => set("end_time", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          {/* Row 3: Preț + Vârstă */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Preț (lei, gol = gratuit)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className={inputCls}
                placeholder="ex: 30"
              />
            </div>
            <div>
              <label className={labelCls}>Vârstă min (ani)</label>
              <input
                type="number"
                min="0"
                max="18"
                value={form.age_min}
                onChange={(e) => set("age_min", e.target.value)}
                className={inputCls}
                placeholder="ex: 3"
              />
            </div>
            <div>
              <label className={labelCls}>Vârstă max (ani)</label>
              <input
                type="number"
                min="0"
                max="18"
                value={form.age_max}
                onChange={(e) => set("age_max", e.target.value)}
                className={inputCls}
                placeholder="ex: 12"
              />
            </div>
          </div>

          {/* Row 4: Adresă + Telefon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Adresă / Locație</label>
              <input
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                className={inputCls}
                placeholder="ex: Str. Victoriei 1, Sibiu"
              />
            </div>
            <div>
              <label className={labelCls}>Telefon contact</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className={inputCls}
                placeholder="ex: 0722 123 456"
              />
            </div>
          </div>

          {/* Descriere */}
          <div>
            <label className={labelCls}>Descriere</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className={inputCls}
              placeholder="Scurtă descriere a evenimentului..."
            />
          </div>

          {/* Poze */}
          <div>
            <label className={labelCls}>Poze eveniment (max 5)</label>
            {/* Drop zone */}
            <div
              ref={dropRef}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
              className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#ff5a2e] transition-colors mb-3"
            >
              <p className="text-sm text-gray-400 font-medium">
                {imageFiles.length === 0
                  ? "Trage pozele aici sau click pentru a selecta"
                  : `${imageFiles.length}/5 poze selectate — click pentru a adăuga mai multe`}
              </p>
              <p className="text-xs text-gray-300 mt-1">JPG, PNG, WebP · max 5 MB/poză · compresie automată</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
            {imagePreviews.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative w-16 h-16">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-16 h-16 object-cover rounded-xl border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress bar */}
          {saving && (
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#ff5a2e] h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {error && (
            <p className="text-sm font-bold text-red-500">⚠️ {error}</p>
          )}

          <div className="flex gap-3 justify-end pt-1">
            <button
              type="button"
              onClick={() => { setOpen(false); reset(); }}
              className="text-sm font-bold text-gray-400 hover:text-gray-600"
            >
              Anulează
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="bg-[#ff5a2e] hover:bg-[#f03d12] disabled:opacity-60 text-white font-black text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              {saving ? "Se trimite..." : "Trimite spre aprobare"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
