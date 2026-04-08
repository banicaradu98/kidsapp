"use client";

import { useRef, useState } from "react";
import { addEvent, updateEvent, deleteEvent, updateEventImages } from "./eventActions";
import RichTextEditor from "@/app/components/RichTextEditor";

interface Event {
  id: string;
  listing_id: string;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  price: number | null;
  thumbnail_url: string | null;
  gallery_urls: string[];
  created_at: string;
}

interface Props {
  listingId: string;
  initialEvents: Event[];
}

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#ff5a2e] focus:ring-2 focus:ring-[#ff5a2e]/20 transition-all bg-white";

const emptyForm = {
  title: "", description: "", event_date: "",
  start_time: "", end_time: "", price: "",
};

function formatTime(t: string | null) {
  return t ? t.slice(0, 5) : null;
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function toInputDate(dateStr: string): string {
  const d = parseDate(dateStr);
  if (!d) return "";
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Upload a single image; supports both new events (listing_id only) and existing events (event_id)
async function uploadImage(
  file: File,
  opts: { eventId: string; type: "thumbnail" | "gallery"; galleryIndex?: number } |
        { listingId: string; type: "thumbnail" | "gallery"; galleryIndex?: number }
): Promise<string | null> {
  const fd = new FormData();
  fd.append("file", file);
  if ("eventId" in opts) {
    fd.append("event_id", opts.eventId);
  } else {
    fd.append("listing_id", opts.listingId);
  }
  fd.append("type", opts.type);
  if (opts.type === "gallery" && opts.galleryIndex !== undefined) {
    fd.append("gallery_index", String(opts.galleryIndex));
  }
  const res = await fetch("/api/upload-event", { method: "POST", body: fd });
  const json = await res.json();
  if (json.error) console.error("[upload-event]", json.error);
  return json.url ?? null;
}

export default function EventsManager({ listingId, initialEvents }: Props) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image state
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  function set(k: keyof typeof emptyForm, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function resetImageState() {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setExistingThumbnail(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setExistingGallery([]);
  }

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    resetImageState();
    setShowForm(true);
    setError(null);
  }

  function openEdit(ev: Event) {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      description: ev.description ?? "",
      event_date: toInputDate(ev.event_date),
      start_time: formatTime(ev.start_time) ?? "",
      end_time: formatTime(ev.end_time) ?? "",
      price: ev.price != null ? String(ev.price) : "",
    });
    resetImageState();
    setExistingThumbnail(ev.thumbnail_url ?? null);
    setExistingGallery(ev.gallery_urls ?? []);
    setShowForm(true);
    setError(null);
  }

  function onThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    e.target.value = "";
  }

  function onGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const remaining = 3 - existingGallery.length - galleryFiles.length;
    const toAdd = files.slice(0, remaining);
    setGalleryFiles((prev) => [...prev, ...toAdd]);
    setGalleryPreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  }

  function removeExistingGallery(idx: number) {
    setExistingGallery((prev) => prev.filter((_, i) => i !== idx));
  }

  function removeNewGallery(idx: number) {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    if (!form.title.trim() || !form.event_date) {
      setError("Titlu și data sunt obligatorii.");
      return;
    }
    setSaving(true);
    setError(null);

    const basePayload = {
      listing_id: listingId,
      title: form.title.trim(),
      description: form.description.trim() || null,
      event_date: form.event_date,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      price: form.price !== "" ? Number(form.price) : null,
    };

    if (!editingId) {
      // ── NEW EVENT: upload photos first, then insert with URLs ──
      let thumbUrl: string | null = null;
      const newGalleryUrls: string[] = [];

      if (thumbnailFile) {
        thumbUrl = await uploadImage(thumbnailFile, { listingId, type: "thumbnail" });
      }
      for (let i = 0; i < galleryFiles.length; i++) {
        const url = await uploadImage(galleryFiles[i], { listingId, type: "gallery", galleryIndex: i });
        if (url) newGalleryUrls.push(url);
      }

      const result = await addEvent({
        ...basePayload,
        thumbnail_url: thumbUrl,
        gallery_urls: newGalleryUrls,
      });

      if (result.error || !result.data) {
        setError(result.error ?? "Eroare la salvare.");
        setSaving(false);
        return;
      }

      const newEvent: Event = {
        ...result.data,
        thumbnail_url: thumbUrl,
        gallery_urls: newGalleryUrls,
      };
      setEvents((prev) => [...prev, newEvent].sort((a, b) => a.event_date.localeCompare(b.event_date)));

    } else {
      // ── EDIT: update event, then upload new images with event_id ──
      const result = await updateEvent(editingId, basePayload);

      if (result.error || !result.data) {
        setError(result.error ?? "Eroare la salvare.");
        setSaving(false);
        return;
      }

      const savedId = result.data.id;
      let finalThumbnail: string | null = existingThumbnail;
      let finalGallery: string[] = [...existingGallery];

      if (thumbnailFile) {
        const url = await uploadImage(thumbnailFile, { eventId: savedId, type: "thumbnail" });
        if (url) finalThumbnail = url;
      }
      for (let i = 0; i < galleryFiles.length; i++) {
        const url = await uploadImage(galleryFiles[i], { eventId: savedId, type: "gallery", galleryIndex: existingGallery.length + i });
        if (url) finalGallery = [...finalGallery, url];
      }

      // Always sync images when editing (covers removal of existing images too)
      await updateEventImages(savedId, listingId, finalThumbnail, finalGallery);

      const updatedEvent: Event = {
        ...result.data,
        thumbnail_url: finalThumbnail,
        gallery_urls: finalGallery,
      };
      setEvents((prev) =>
        prev.map((e) => e.id === editingId ? updatedEvent : e)
            .sort((a, b) => a.event_date.localeCompare(b.event_date))
      );
    }

    setShowForm(false);
    setSaving(false);
    resetImageState();
  }

  async function handleDelete(id: string) {
    if (!confirm("Ștergi evenimentul?")) return;
    const { error: err } = await deleteEvent(id, listingId);
    if (!err) setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  const totalGallery = existingGallery.length + galleryFiles.length;

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-black text-[#1a1a2e]">📅 Evenimentele mele</h2>
        <button
          onClick={openAdd}
          className="text-sm font-black text-[#ff5a2e] border border-[#ff5a2e] px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors"
        >
          + Adaugă eveniment
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-2xl p-4 mb-4 flex flex-col gap-3">
          <h3 className="text-sm font-black text-[#1a1a2e]">
            {editingId ? "Editează eveniment" : "Eveniment nou"}
          </h3>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Titlu *</label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className={inputCls}
              placeholder="Titlul evenimentului"
            />
          </div>

          {/* Date + Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Data *</label>
              <input
                type="date"
                value={form.event_date}
                onChange={(e) => set("event_date", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Preț (lei)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className={inputCls}
                placeholder="Ex: 30"
              />
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Oră start</label>
              <input
                type="time"
                value={form.start_time}
                onChange={(e) => set("start_time", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Oră sfârșit</label>
              <input
                type="time"
                value={form.end_time}
                onChange={(e) => set("end_time", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Descriere</label>
            <RichTextEditor
              key={editingId ?? "new-event"}
              value={form.description}
              onChange={(v) => set("description", v)}
              placeholder="Scurtă descriere..."
              minHeight={80}
            />
          </div>

          {/* ── FOTOGRAFII ── */}
          <div className="border-t border-gray-200 pt-3">
            <p className="text-xs font-black text-gray-500 mb-3">Fotografii eveniment</p>

            {/* Thumbnail */}
            <div className="mb-3">
              <label className="block text-xs font-bold text-gray-400 mb-1.5">Imagine principală</label>
              <div className="flex items-center gap-3">
                {(thumbnailPreview || existingThumbnail) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnailPreview ?? existingThumbnail!}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl border border-dashed border-gray-300 shrink-0">
                    📅
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => thumbInputRef.current?.click()}
                    className="text-xs font-bold text-[#ff5a2e] hover:underline text-left"
                  >
                    {thumbnailPreview || existingThumbnail ? "Schimbă imaginea" : "Adaugă imagine"}
                  </button>
                  {(thumbnailPreview || existingThumbnail) && (
                    <button
                      type="button"
                      onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); setExistingThumbnail(null); }}
                      className="text-xs font-bold text-red-400 hover:underline text-left"
                    >
                      Șterge
                    </button>
                  )}
                  <p className="text-[10px] text-gray-400">JPG, PNG, WebP · max 5MB</p>
                </div>
              </div>
              <input
                ref={thumbInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onThumbnailChange}
              />
            </div>

            {/* Gallery */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">
                Galerie ({totalGallery}/3 poze)
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {existingGallery.map((url, i) => (
                  <div key={`eg${i}`} className="relative w-16 h-16">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => removeExistingGallery(i)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {galleryPreviews.map((url, i) => (
                  <div key={`ng${i}`} className="relative w-16 h-16">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-16 h-16 rounded-xl object-cover border border-orange-200" />
                    <button
                      type="button"
                      onClick={() => removeNewGallery(i)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {totalGallery < 3 && (
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-[#ff5a2e] hover:text-[#ff5a2e] transition-colors text-xl"
                  >
                    +
                  </button>
                )}
              </div>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={onGalleryChange}
              />
            </div>
          </div>

          {error && <p className="text-sm font-bold text-red-500">⚠️ {error}</p>}

          <div className="flex gap-3 justify-end pt-1">
            <button
              onClick={() => { setShowForm(false); setError(null); resetImageState(); }}
              className="text-sm font-bold text-gray-400 hover:text-gray-600"
            >
              Anulează
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#ff5a2e] hover:bg-[#f03d12] disabled:opacity-60 text-white font-black text-sm px-4 py-2 rounded-xl transition-colors"
            >
              {saving ? "Salvare..." : "Salvează"}
            </button>
          </div>
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-3xl mb-2">📭</p>
          <p className="font-bold">Niciun eveniment adăugat încă</p>
          <p className="text-sm font-medium mt-1">
            Evenimentele viitoare apar și pe pagina publică a locației.
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-50">
          {events.map((ev) => {
            const d = parseDate(ev.event_date);
            const isPast = d ? d < new Date() : false;
            const start = formatTime(ev.start_time);
            const end = formatTime(ev.end_time);
            const timeStr = start && end ? `${start}–${end}` : start ? `de la ${start}` : null;
            const dayNum = d ? d.getUTCDate() : "?";
            const monthStr = d
              ? d.toLocaleDateString("ro-RO", { month: "short", timeZone: "UTC" })
              : "";

            return (
              <div key={ev.id} className={`py-3 flex items-start gap-3 ${isPast ? "opacity-40" : ""}`}>
                {ev.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ev.thumbnail_url}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex flex-col items-center justify-center shrink-0 text-center">
                    <span className="text-sm font-black text-[#ff5a2e] leading-none">{dayNum}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">{monthStr}</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-black text-[#1a1a2e] text-sm">{ev.title}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {d
                      ? d.toLocaleDateString("ro-RO", { day: "numeric", month: "short", timeZone: "UTC" })
                      : "Dată invalidă"}
                    {timeStr ? ` · ${timeStr}` : ""}
                    {ev.price != null ? ` · ${ev.price} lei` : ""}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(ev)}
                    className="text-xs font-bold text-gray-400 hover:text-[#ff5a2e] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Șterge
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
