"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface OrgEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  price: string | null;
  image_url: string | null;
}

interface Props {
  listingId: string;
  initialEvents: OrgEvent[];
}

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#ff5a2e] focus:ring-2 focus:ring-[#ff5a2e]/20 transition-all bg-white";

const emptyForm = { title: "", description: "", event_date: "", price: "" };

export default function EventsManager({ listingId, initialEvents }: Props) {
  const [events, setEvents] = useState<OrgEvent[]>(initialEvents);
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

  function openEdit(ev: OrgEvent) {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      description: ev.description ?? "",
      event_date: ev.event_date.slice(0, 16), // datetime-local format
      price: ev.price ?? "",
    });
    setShowForm(true);
    setError(null);
  }

  async function handleSave() {
    if (!form.title || !form.event_date) { setError("Titlu și data sunt obligatorii."); return; }
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setError("Sesiune expirată."); setSaving(false); return; }

    const payload = {
      listing_id: listingId,
      organizer_id: session.user.id,
      title: form.title,
      description: form.description || null,
      event_date: form.event_date,
      price: form.price || null,
    };

    if (editingId) {
      const { data, error: err } = await supabase
        .from("organizer_events")
        .update(payload)
        .eq("id", editingId)
        .select()
        .single();
      if (err) { setError("Eroare la salvare."); setSaving(false); return; }
      setEvents((prev) => prev.map((e) => e.id === editingId ? data : e));
    } else {
      const { data, error: err } = await supabase
        .from("organizer_events")
        .insert(payload)
        .select()
        .single();
      if (err) { setError("Eroare la salvare."); setSaving(false); return; }
      setEvents((prev) => [...prev, data].sort((a, b) => a.event_date.localeCompare(b.event_date)));
    }

    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Ștergi evenimentul?")) return;
    const supabase = createClient();
    await supabase.from("organizer_events").delete().eq("id", id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-black text-[#1a1a2e]">📅 Evenimentele mele</h2>
        <button onClick={openAdd} className="text-sm font-black text-[#ff5a2e] border border-[#ff5a2e] px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors">
          + Adaugă eveniment
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-2xl p-4 mb-4 flex flex-col gap-3">
          <h3 className="text-sm font-black text-[#1a1a2e]">{editingId ? "Editează eveniment" : "Eveniment nou"}</h3>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Titlu *</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} placeholder="Titlul evenimentului" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Descriere</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} className={inputCls + " resize-none"} placeholder="Scurtă descriere..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Data și ora *</label>
              <input type="datetime-local" value={form.event_date} onChange={(e) => set("event_date", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Preț</label>
              <input value={form.price} onChange={(e) => set("price", e.target.value)} className={inputCls} placeholder="Ex: 30 lei" />
            </div>
          </div>
          {error && <p className="text-sm font-bold text-red-500">⚠️ {error}</p>}
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowForm(false)} className="text-sm font-bold text-gray-400 hover:text-gray-600">Anulează</button>
            <button onClick={handleSave} disabled={saving} className="bg-[#ff5a2e] hover:bg-[#f03d12] disabled:opacity-60 text-white font-black text-sm px-4 py-2 rounded-xl transition-colors">
              {saving ? "Salvare..." : "Salvează"}
            </button>
          </div>
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-3xl mb-2">📭</p>
          <p className="font-bold">Niciun eveniment adăugat încă</p>
          <p className="text-sm font-medium mt-1">Evenimentele apar și pe pagina publică și în calendarul site-ului.</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-50">
          {events.map((ev) => {
            const d = new Date(ev.event_date);
            const isPast = d < new Date();
            return (
              <div key={ev.id} className={`py-3 flex items-start gap-4 ${isPast ? "opacity-50" : ""}`}>
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex flex-col items-center justify-center shrink-0 text-center">
                  <span className="text-xs font-black text-[#ff5a2e] leading-none">{d.getDate()}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">{d.toLocaleDateString("ro-RO", { month: "short" })}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-[#1a1a2e] text-sm">{ev.title}</p>
                  <p className="text-xs text-gray-400 font-medium">
                    {d.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}
                    {ev.price && ` · ${ev.price}`}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(ev)} className="text-xs font-bold text-gray-400 hover:text-[#ff5a2e] transition-colors">Edit</button>
                  <button onClick={() => handleDelete(ev.id)} className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">Șterge</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
