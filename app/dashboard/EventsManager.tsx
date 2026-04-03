"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Event {
  id: string;
  listing_id: string;
  title: string;
  description: string | null;
  date: string;
  start_time: string | null;
  end_time: string | null;
  price: number | null;
  created_at: string;
}

interface Props {
  listingId: string;
  initialEvents: Event[];
}

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#ff5a2e] focus:ring-2 focus:ring-[#ff5a2e]/20 transition-all bg-white";

const emptyForm = { title: "", description: "", date: "", start_time: "", end_time: "", price: "" };

function formatTime(t: string | null) {
  if (!t) return null;
  return t.slice(0, 5); // "10:00:00" → "10:00"
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("ro-RO", { day: "numeric", month: "short" });
}

export default function EventsManager({ listingId, initialEvents }: Props) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(k: keyof typeof emptyForm, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError(null);
  }

  function openEdit(ev: Event) {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      description: ev.description ?? "",
      date: ev.date,
      start_time: formatTime(ev.start_time) ?? "",
      end_time: formatTime(ev.end_time) ?? "",
      price: ev.price != null ? String(ev.price) : "",
    });
    setShowForm(true);
    setError(null);
  }

  async function handleSave() {
    if (!form.title.trim() || !form.date) {
      setError("Titlu și data sunt obligatorii.");
      return;
    }
    setSaving(true);
    setError(null);
    const supabase = createClient();

    const payload = {
      listing_id: listingId,
      title: form.title.trim(),
      description: form.description.trim() || null,
      date: form.date,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      price: form.price !== "" ? Number(form.price) : null,
    };

    if (editingId) {
      const { data, error: err } = await supabase
        .from("events")
        .update(payload)
        .eq("id", editingId)
        .select()
        .single();
      if (err) { setError("Eroare la salvare. Verifică că ești autentificat."); setSaving(false); return; }
      setEvents((prev) =>
        prev.map((e) => (e.id === editingId ? data : e))
            .sort((a, b) => a.date.localeCompare(b.date))
      );
    } else {
      const { data, error: err } = await supabase
        .from("events")
        .insert(payload)
        .select()
        .single();
      if (err) { setError("Eroare la salvare. Verifică că ești autentificat."); setSaving(false); return; }
      setEvents((prev) => [...prev, data].sort((a, b) => a.date.localeCompare(b.date)));
    }

    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Ștergi evenimentul?")) return;
    const supabase = createClient();
    const { error: err } = await supabase.from("events").delete().eq("id", id);
    if (!err) setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  const today = new Date().toISOString().split("T")[0];

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

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Titlu *</label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className={inputCls}
              placeholder="Titlul evenimentului"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Data *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
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

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Descriere</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              className={inputCls + " resize-none"}
              placeholder="Scurtă descriere..."
            />
          </div>

          {error && <p className="text-sm font-bold text-red-500">⚠️ {error}</p>}

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => { setShowForm(false); setError(null); }}
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
            const isPast = ev.date < today;
            const start = formatTime(ev.start_time);
            const end = formatTime(ev.end_time);
            const timeStr = start && end ? `${start}–${end}` : start ? `de la ${start}` : null;

            return (
              <div key={ev.id} className={`py-3 flex items-start gap-4 ${isPast ? "opacity-40" : ""}`}>
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex flex-col items-center justify-center shrink-0 text-center">
                  <span className="text-sm font-black text-[#ff5a2e] leading-none">
                    {ev.date.split("-")[2]}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">
                    {formatDate(ev.date).split(" ")[1]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-[#1a1a2e] text-sm">{ev.title}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {timeStr}
                    {timeStr && ev.price != null && " · "}
                    {ev.price != null ? `${ev.price} lei` : null}
                    {!timeStr && ev.price == null ? formatDate(ev.date) : null}
                  </p>
                  {ev.description && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{ev.description}</p>
                  )}
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
