"use client";

import { useRef, useState } from "react";
import { addUpdate, deleteUpdate } from "./updateActions";
import RichTextEditor from "@/app/components/RichTextEditor";
import RichTextDisplay from "@/app/components/RichTextDisplay";
import imageCompression from "browser-image-compression";

async function compressAndUpload(file: File, listingId: string, index: number): Promise<string | null> {
  try {
    const compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true });
    const fd = new FormData();
    fd.append("file", compressed);
    fd.append("listing_id", listingId);
    fd.append("index", String(index));
    const res = await fetch("/api/upload-update", { method: "POST", body: fd });
    const json = await res.json();
    return json.url ?? null;
  } catch {
    return null;
  }
}

type UpdateType =
  | "noutate"
  | "reducere"
  | "grupa_noua"
  | "schimbare"
  | "eveniment_special"
  | "inchis_temporar"
  | "lansare_noua"
  | "inscrieri_deschise"
  | "rezultate_premii"
  | "oferta_speciala"
  | "anunt_important"
  | "none";

interface ListingUpdate {
  id: string;
  listing_id: string;
  type: UpdateType;
  title: string;
  message: string;
  expires_at: string | null;
  images?: string[];
  created_at: string;
}

interface Props {
  listingId: string;
  initialUpdates: ListingUpdate[];
}

const TYPE_META: Record<UpdateType, { emoji: string; label: string; bg: string; text: string }> = {
  noutate:            { emoji: "ℹ️",  label: "Noutate generală",      bg: "bg-blue-50",    text: "text-blue-700"   },
  reducere:           { emoji: "🔥", label: "Reducere flash",         bg: "bg-red-50",     text: "text-red-700"    },
  grupa_noua:         { emoji: "👥", label: "Formăm grupă nouă",      bg: "bg-green-50",   text: "text-green-700"  },
  schimbare:          { emoji: "📍", label: "Schimbare sediu",        bg: "bg-purple-50",  text: "text-purple-700" },
  eveniment_special:  { emoji: "🎉", label: "Eveniment special",      bg: "bg-yellow-50",  text: "text-yellow-700" },
  inchis_temporar:    { emoji: "🔒", label: "Închis temporar",        bg: "bg-gray-50",    text: "text-gray-600"   },
  lansare_noua:       { emoji: "🆕", label: "Lansare nouă",           bg: "bg-teal-50",    text: "text-teal-700"   },
  inscrieri_deschise: { emoji: "🎓", label: "Înscrieri deschise",     bg: "bg-indigo-50",  text: "text-indigo-700" },
  rezultate_premii:   { emoji: "🏆", label: "Rezultate & Premii",     bg: "bg-amber-50",   text: "text-amber-700"  },
  oferta_speciala:    { emoji: "🌟", label: "Ofertă specială",        bg: "bg-orange-50",  text: "text-orange-700" },
  anunt_important:    { emoji: "📢", label: "Anunț important",        bg: "bg-rose-50",    text: "text-rose-700"   },
  none:               { emoji: "",   label: "Fără etichetă",          bg: "bg-gray-50",    text: "text-gray-700"   },
};

const TYPE_OPTIONS = Object.entries(TYPE_META) as [UpdateType, (typeof TYPE_META)[UpdateType]][];

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#ff5a2e] focus:ring-2 focus:ring-[#ff5a2e]/20 transition-all bg-white";

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days >= 1) return `acum ${days} ${days === 1 ? "zi" : "zile"}`;
  if (hours >= 1) return `acum ${hours} ${hours === 1 ? "oră" : "ore"}`;
  if (mins >= 1) return `acum ${mins} min`;
  return "chiar acum";
}

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function isEmptyHtml(html: string): boolean {
  if (!html) return true;
  return html.replace(/<[^>]*>/g, "").trim() === "";
}

const emptyForm = { type: "noutate" as UpdateType, title: "", message: "", expires_at: "" };

export default function UpdatesManager({ listingId, initialUpdates }: Props) {
  const [updates, setUpdates] = useState<ListingUpdate[]>(initialUpdates);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [imgPreviews, setImgPreviews] = useState<string[]>([]);
  const imgInputRef = useRef<HTMLInputElement>(null);

  function onImgChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const toAdd = files.slice(0, 3 - imgFiles.length);
    setImgFiles((p) => [...p, ...toAdd]);
    setImgPreviews((p) => [...p, ...toAdd.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  }

  function removeImg(i: number) {
    setImgFiles((p) => p.filter((_, idx) => idx !== i));
    setImgPreviews((p) => p.filter((_, idx) => idx !== i));
  }

  function set<K extends keyof typeof emptyForm>(k: K, v: (typeof emptyForm)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSave() {
    if (!form.title.trim() || isEmptyHtml(form.message)) {
      setError("Titlul și mesajul sunt obligatorii.");
      return;
    }
    setSaving(true);
    setError(null);

    // Upload images first
    const uploadedUrls: string[] = [];
    for (let i = 0; i < imgFiles.length; i++) {
      const url = await compressAndUpload(imgFiles[i], listingId, i);
      if (url) uploadedUrls.push(url);
    }

    const result = await addUpdate({
      listing_id: listingId,
      type: form.type,
      title: form.title,
      message: form.message,
      expires_at: form.expires_at || null,
      images: uploadedUrls,
    });

    if (result.error || !result.data) {
      setError(result.error ?? "Eroare la salvare.");
      setSaving(false);
      return;
    }

    setUpdates((prev) => [result.data as ListingUpdate, ...prev]);
    setForm(emptyForm);
    setFormKey((k) => k + 1);
    setImgFiles([]);
    setImgPreviews([]);
    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Ștergi această noutate?")) return;
    setDeleting(id);
    const { error: err } = await deleteUpdate(id, listingId);
    if (!err) setUpdates((prev) => prev.filter((u) => u.id !== id));
    setDeleting(null);
  }

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-black text-[#1a1a2e]">📣 Noutăți & Statusuri</h2>
          <p className="text-xs font-medium text-gray-400 mt-0.5">Informații afișate pe pagina ta publică</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setError(null); }}
          className="text-sm font-black text-[#ff5a2e] border border-[#ff5a2e] px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors"
        >
          + Adaugă noutate
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-2xl p-4 mb-4 flex flex-col gap-3">
          <h3 className="text-sm font-black text-[#1a1a2e]">Noutate nouă</h3>

          {/* Type select */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">
              Etichetă <span className="text-gray-400 font-medium">(opțional)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TYPE_OPTIONS.map(([key, meta]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set("type", key)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                    form.type === key
                      ? "border-[#ff5a2e] bg-orange-50 text-[#ff5a2e]"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {meta.emoji && <span>{meta.emoji}</span>}
                  <span className="leading-tight text-xs">{meta.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">
              Titlu scurt * <span className="text-gray-400 font-medium">({form.title.length}/60)</span>
            </label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value.slice(0, 60))}
              className={inputCls}
              placeholder={
                form.type !== "none"
                  ? `ex: ${TYPE_META[form.type].emoji} ${TYPE_META[form.type].label}`
                  : "ex: Informație importantă"
              }
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Mesaj *</label>
            <RichTextEditor
              key={formKey}
              value={form.message}
              onChange={(v) => set("message", v)}
              placeholder="Detalii pentru părinți..."
              minHeight={80}
            />
          </div>

          {/* Expires at */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">
              Expiră la <span className="text-gray-400 font-medium">(opțional — lasă gol pentru permanent)</span>
            </label>
            <input
              type="date"
              value={form.expires_at}
              onChange={(e) => set("expires_at", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className={inputCls}
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">
              Poze <span className="text-gray-400 font-medium">(opțional, max 3)</span>
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {imgPreviews.map((url, i) => (
                <div key={i} className="relative w-16 h-16">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                  <button
                    type="button"
                    onClick={() => removeImg(i)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none"
                  >×</button>
                </div>
              ))}
              {imgFiles.length < 3 && (
                <button
                  type="button"
                  onClick={() => imgInputRef.current?.click()}
                  className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-[#ff5a2e] hover:text-[#ff5a2e] transition-colors text-xl"
                >+</button>
              )}
            </div>
            <input
              ref={imgInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={onImgChange}
            />
          </div>

          {error && <p className="text-sm font-bold text-red-500">⚠️ {error}</p>}

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => { setShowForm(false); setError(null); setForm(emptyForm); setFormKey((k) => k + 1); setImgFiles([]); setImgPreviews([]); }}
              className="text-sm font-bold text-gray-400 hover:text-gray-600"
            >
              Anulează
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#ff5a2e] hover:bg-[#f03d12] disabled:opacity-60 text-white font-black text-sm px-4 py-2 rounded-xl transition-colors"
            >
              {saving ? "Salvare..." : "Publică noutatea"}
            </button>
          </div>
        </div>
      )}

      {updates.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-3xl mb-2">📭</p>
          <p className="font-bold">Nicio noutate publicată</p>
          <p className="text-sm font-medium mt-1">
            Anunță reduceri, grupe noi sau schimbări — părinții le văd instant pe pagina ta.
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-50">
          {updates.map((u) => {
            const meta = TYPE_META[u.type] ?? TYPE_META["noutate"];
            const expiryDays = u.expires_at ? daysUntil(u.expires_at) : null;
            const isExpired = expiryDays !== null && expiryDays <= 0;
            return (
              <div key={u.id} className={`py-3 flex items-start gap-3 ${isExpired ? "opacity-40" : ""}`}>
                {u.type !== "none" && meta.emoji && (
                  <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center text-lg shrink-0`}>
                    {meta.emoji}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-black text-[#1a1a2e]">{u.title}</p>
                    {u.type !== "none" && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${meta.bg} ${meta.text}`}>
                        {meta.label}
                      </span>
                    )}
                    {isExpired && (
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                        Expirat
                      </span>
                    )}
                    {!isExpired && expiryDays !== null && expiryDays <= 7 && (
                      <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                        Expiră în {expiryDays}z
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5 line-clamp-2">
                    <RichTextDisplay html={u.message} />
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">{relativeTime(u.created_at)}</p>
                </div>
                <button
                  onClick={() => handleDelete(u.id)}
                  disabled={deleting === u.id}
                  className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors shrink-0 disabled:opacity-50"
                >
                  {deleting === u.id ? "..." : "Șterge"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
