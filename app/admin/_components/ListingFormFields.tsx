"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import RichTextEditor from "@/app/components/RichTextEditor";

const CATEGORIES = [
  { value: "loc-de-joaca", label: "🛝 Loc de joacă" },
  { value: "educatie",     label: "🎓 Educație" },
  { value: "curs-atelier", label: "🎨 Curs & Atelier" },
  { value: "sport",        label: "⚽ Sport" },
  { value: "spectacol",    label: "🎭 Spectacol" },
  { value: "eveniment",    label: "🎪 Eveniment" },
];

const EVENT_CATEGORIES = ["spectacol", "eveniment"];

interface DefaultValues {
  name?: string;
  category?: string;
  subcategory?: string;
  description?: string;
  address?: string;
  city?: string;
  price?: string;
  price_details?: string;
  age_min?: number | null;
  age_max?: number | null;
  schedule?: string;
  phone?: string;
  website?: string;
  is_verified?: boolean;
  is_featured?: boolean;
  images?: string[];
  // Event-specific
  event_date?: string | null;
  event_end_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
}

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#ff5a2e] focus:ring-2 focus:ring-[#ff5a2e]/20 transition-all bg-white";
const labelCls = "block text-sm font-bold text-gray-700 mb-1";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="sm:col-span-2 pt-2 pb-1 border-b border-gray-100">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
    </div>
  );
}

/** Convert a timestamptz string to YYYY-MM-DD for <input type="date"> */
function toInputDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

/** Truncate Postgres time "HH:MM:SS" to "HH:MM" for <input type="time"> */
function toInputTime(t: string | null | undefined): string {
  return t ? t.slice(0, 5) : "";
}

export default function ListingFormFields({ d = {} }: { d?: DefaultValues }) {
  const [category, setCategory] = useState(d.category ?? "");
  const isEvent = EVENT_CATEGORIES.includes(category);
  const [startDateVal, setStartDateVal] = useState(toInputDate(d.event_date));
  const [dateError, setDateError] = useState(false);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

      {/* ── Informații de bază ── */}
      <SectionHeader title="Informații de bază" />

      <div className="sm:col-span-2">
        <Field label="Nume listing" required>
          <input name="name" type="text" required defaultValue={d.name} placeholder="ex: Sala de Joacă Dumbrava" className={inputCls} />
        </Field>
      </div>

      <Field label="Categorie" required>
        <select
          name="category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputCls}
        >
          <option value="" disabled>Alege categoria...</option>
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </Field>

      <Field label="Subcategorie (opțional)">
        <input name="subcategory" type="text" defaultValue={d.subcategory} placeholder="ex: fotbal, balet, înot" className={inputCls} />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Descriere">
          <RichTextEditor name="description" defaultValue={d.description ?? ""} placeholder="Descriere detaliată a locului..." minHeight={100} />
        </Field>
      </div>

      {/* ── Data & Ora — doar pentru Spectacol / Eveniment ── */}
      {isEvent && (
        <>
          <SectionHeader title="Data & Ora evenimentului" />

          <Field label="Data început" required>
            <input
              name="event_date"
              id="event_date"
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              value={startDateVal}
              onChange={(e) => {
                setStartDateVal(e.target.value);
                if (e.target.value) setDateError(false);
              }}
              onInvalid={(e) => {
                e.preventDefault();
                setDateError(true);
                (e.target as HTMLInputElement).scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className={`${inputCls} ${dateError ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
            />
            {dateError && (
              <p className="text-xs text-red-500 mt-1 font-semibold">⚠️ Data este obligatorie</p>
            )}
          </Field>

          <Field label="Data sfârșit (opțional, pentru evenimente multi-zi)">
            <input
              name="event_end_date"
              type="date"
              defaultValue={toInputDate(d.event_end_date)}
              min={startDateVal || undefined}
              className={inputCls}
            />
          </Field>

          <Field label="Ora început">
            <input
              name="start_time"
              type="time"
              defaultValue={toInputTime(d.start_time)}
              className={inputCls}
            />
          </Field>

          <Field label="Ora sfârșit (opțional)">
            <input
              name="end_time"
              type="time"
              defaultValue={toInputTime(d.end_time)}
              className={inputCls}
            />
          </Field>
        </>
      )}

      {/* ── Detalii ── */}
      <SectionHeader title="Detalii" />

      <Field label="Adresă">
        <input name="address" type="text" defaultValue={d.address ?? ""} placeholder="ex: Strada Parcului 1" className={inputCls} />
      </Field>

      <Field label="Oraș">
        <input name="city" type="text" defaultValue={d.city ?? "Sibiu"} placeholder="Sibiu" className={inputCls} />
      </Field>

      <Field label="Preț">
        <input name="price" type="text" defaultValue={d.price ?? ""} placeholder='ex: "25 lei/copil" sau "Gratuit"' className={inputCls} />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Detalii preț (pachete, abonamente etc.)">
          <RichTextEditor name="price_details" defaultValue={d.price_details ?? ""} placeholder={"ex: Abonament lunar: 150 lei · Zi: 25 lei/copil · Părinții intră gratuit"} minHeight={80} />
        </Field>
      </div>

      <Field label="Program">
        <input name="schedule" type="text" defaultValue={d.schedule ?? ""} placeholder="ex: Luni-Vineri 10:00-20:00" className={inputCls} />
      </Field>

      {/* ── Vârstă & Contact ── */}
      <SectionHeader title="Vârstă & Contact" />

      <Field label="Vârstă minimă (ani)">
        <input name="age_min" type="number" min={0} max={18} defaultValue={d.age_min ?? ""} placeholder="ex: 2" className={inputCls} />
      </Field>

      <Field label="Vârstă maximă (ani)">
        <input name="age_max" type="number" min={0} max={18} defaultValue={d.age_max ?? ""} placeholder="ex: 10" className={inputCls} />
      </Field>

      <Field label="Telefon">
        <input name="phone" type="tel" defaultValue={d.phone ?? ""} placeholder="ex: 0722 123 456" className={inputCls} />
      </Field>

      <Field label="Website (opțional)">
        <input name="website" type="text" defaultValue={d.website} placeholder="ex: www.teatrulgong.ro" className={inputCls} />
      </Field>

      {/* ── Fotografii ── */}
      <SectionHeader title="Fotografii" />

      <div className="sm:col-span-2">
        <ImageUploader defaultImages={d.images ?? []} />
      </div>

      {/* ── Setări ── */}
      <SectionHeader title="Setări" />

      <div className="sm:col-span-2 flex flex-wrap gap-6 py-1">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="is_verified"
            defaultChecked={d.is_verified}
            className="w-5 h-5 accent-[#ff5a2e] cursor-pointer"
          />
          <span className="text-sm font-bold text-gray-700">Verificat</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={d.is_featured}
            className="w-5 h-5 accent-[#ff5a2e] cursor-pointer"
          />
          <span className="text-sm font-bold text-gray-700">Recomandat (featured)</span>
        </label>
      </div>

    </div>
  );
}
