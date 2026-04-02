"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Listing {
  id: string;
  name: string;
  description: string | null;
  schedule: string | null;
  price: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
}

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#ff5a2e] focus:ring-2 focus:ring-[#ff5a2e]/20 transition-all bg-white";

export default function ListingEditor({ listing }: { listing: Listing }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    description: listing.description ?? "",
    schedule:    listing.schedule    ?? "",
    price:       listing.price       ?? "",
    phone:       listing.phone       ?? "",
    website:     listing.website     ?? "",
    address:     listing.address     ?? "",
  });

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("listings")
      .update({
        description: form.description || null,
        schedule:    form.schedule    || null,
        price:       form.price       || null,
        phone:       form.phone       || null,
        website:     form.website     || null,
        address:     form.address     || null,
      })
      .eq("id", listing.id);

    if (err) { setError("Eroare la salvare."); }
    else { setSaved(true); setEditing(false); }
    setSaving(false);
  }

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-black text-[#1a1a2e]">📋 Datele locației</h2>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="text-sm font-bold text-[#ff5a2e] hover:underline">
            Editează
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => { setEditing(false); setError(null); }} className="text-sm font-bold text-gray-400 hover:text-gray-600">
              Anulează
            </button>
            <button onClick={handleSave} disabled={saving} className="text-sm font-bold text-[#ff5a2e] hover:underline disabled:opacity-50">
              {saving ? "Salvare..." : "Salvează"}
            </button>
          </div>
        )}
      </div>

      {saved && <p className="text-sm font-bold text-green-600 mb-3">✓ Salvat cu succes!</p>}
      {error && <p className="text-sm font-bold text-red-500 mb-3">⚠️ {error}</p>}

      {!editing ? (
        <div className="flex flex-col gap-3 text-sm">
          <Row label="Locație" value={listing.address} />
          <Row label="Program" value={listing.schedule} />
          <Row label="Preț" value={listing.price} />
          <Row label="Telefon" value={listing.phone} />
          <Row label="Website" value={listing.website} />
          {listing.description && (
            <div>
              <p className="text-xs font-bold text-gray-400 mb-1">Descriere</p>
              <p className="text-gray-600 font-medium leading-relaxed line-clamp-3">{listing.description}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Field label="Descriere" value={form.description} onChange={(v) => set("description", v)} multiline />
          <Field label="Program" value={form.schedule} onChange={(v) => set("schedule", v)} placeholder="Ex: Luni-Vineri 09:00-18:00" />
          <Field label="Preț" value={form.price} onChange={(v) => set("price", v)} placeholder="Ex: 30 lei/copil" />
          <Field label="Telefon" value={form.phone} onChange={(v) => set("phone", v)} placeholder="+40 xxx xxx xxx" />
          <Field label="Website" value={form.website} onChange={(v) => set("website", v)} placeholder="https://..." />
          <Field label="Adresă" value={form.address} onChange={(v) => set("address", v)} />
        </div>
      )}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex gap-3">
      <p className="text-xs font-bold text-gray-400 w-20 shrink-0 pt-0.5">{label}</p>
      <p className="text-gray-700 font-medium flex-1">{value}</p>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} placeholder={placeholder} className={inputCls + " resize-none"} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
      )}
    </div>
  );
}
