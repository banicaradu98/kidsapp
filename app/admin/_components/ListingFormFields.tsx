import ImageUploader from "./ImageUploader";

const CATEGORIES = [
  { value: "loc-de-joaca", label: "🛝 Loc de joacă" },
  { value: "educatie",     label: "🎓 Educație" },
  { value: "curs-atelier", label: "🎨 Curs & Atelier" },
  { value: "sport",        label: "⚽ Sport" },
  { value: "spectacol",    label: "🎭 Spectacol" },
  { value: "eveniment",    label: "🎪 Eveniment" },
];

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

export default function ListingFormFields({ d = {} }: { d?: DefaultValues }) {
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
        <select name="category" required defaultValue={d.category ?? ""} className={inputCls}>
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
          <textarea name="description" rows={4} defaultValue={d.description ?? ""} placeholder="Descriere detaliată a locului..." className={`${inputCls} resize-none`} />
        </Field>
      </div>

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
          <textarea name="price_details" rows={4} defaultValue={d.price_details ?? ""} placeholder={"ex:\nAbonament lunar: 150 lei\nZi: 25 lei/copil\nPărinții intră gratuit"} className={`${inputCls} resize-none`} />
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
