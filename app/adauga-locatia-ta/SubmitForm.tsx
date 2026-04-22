"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { submitListingRequest } from "./actions";
import ImageUploader from "@/app/admin/_components/ImageUploader";
import RichTextEditor from "@/app/components/RichTextEditor";

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#ff5a2e] focus:ring-2 focus:ring-[#ff5a2e]/20 transition-all bg-white placeholder-gray-400";
const labelCls = "block text-sm font-bold text-gray-700 mb-1.5";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>
        {label} {required && <span className="text-[#ff5a2e]">*</span>}
      </label>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-2 pt-2 pb-1 border-b border-gray-100">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{children}</p>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto bg-[#ff5a2e] hover:bg-[#f03d12] disabled:opacity-60 disabled:cursor-not-allowed text-white font-black px-8 py-4 rounded-2xl text-base transition-colors shadow-sm"
    >
      {pending ? "Se trimite..." : "Trimite cererea →"}
    </button>
  );
}

function SuccessState() {
  return (
    <div className="text-center py-16 px-6">
      <div className="text-6xl mb-6">🎉</div>
      <h2 className="text-2xl font-black text-[#1a1a2e] mb-3">Mulțumim!</h2>
      <p className="text-gray-500 font-medium text-lg mb-2 max-w-md mx-auto">
        Am primit cererea ta. Vom verifica și publica locația în maxim <strong className="text-[#ff5a2e]">48 de ore</strong>.
      </p>
      <p className="text-gray-400 text-sm mb-8">
        Vei fi contactat pe email imediat ce locația este aprobată.
      </p>
      <a
        href="/"
        className="inline-block bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black px-6 py-3 rounded-xl transition-colors"
      >
        ← Înapoi la Moosey
      </a>
    </div>
  );
}

export default function SubmitForm() {
  const [state, formAction] = useFormState(submitListingRequest, { success: false, error: null });
  const tsRef = useRef<HTMLInputElement>(null);

  // Set timestamp when form mounts — used server-side to detect bots (< 3s)
  useEffect(() => {
    if (tsRef.current) tsRef.current.value = String(Date.now());
  }, []);

  if (state.success) return <SuccessState />;

  return (
    <form action={formAction} noValidate>
      {/* Anti-spam: honeypot field — hidden from users, bots fill it */}
      <div style={{ position: "absolute", left: "-9999px", top: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
        <input type="text" name="website_url" tabIndex={-1} autoComplete="off" />
      </div>
      {/* Anti-spam: timestamp — server checks elapsed time */}
      <input type="hidden" name="_ts" ref={tsRef} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* ── Informații despre locație ── */}
        <SectionTitle>Informații despre locație</SectionTitle>

        <div className="sm:col-span-2">
          <Field label="Numele locației" required>
            <input name="name" type="text" required placeholder="ex: Sala de Joacă Dumbrava" className={inputCls} />
          </Field>
        </div>

        <Field label="Categoria" required>
          <select name="category" required defaultValue="" className={inputCls}>
            <option value="" disabled>Alege categoria...</option>
            <option value="loc-de-joaca">🛝 Loc de joacă</option>
            <option value="educatie">🎓 Educație</option>
            <option value="curs-atelier">🎨 Cursuri &amp; Ateliere</option>
            <option value="sport">⚽ Sport</option>
            <option value="spectacol">🎭 Spectacole</option>
          </select>
        </Field>

        <Field label="Subcategorie (opțional)">
          <input name="subcategory" type="text" placeholder="ex: Fotbal, Balet, Grădiniță..." className={inputCls} />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Descriere" required>
            <RichTextEditor name="description" placeholder="Descrie pe scurt locul tău — ce oferi, ce face special, pentru ce vârste..." minHeight={100} />
          </Field>
        </div>

        {/* ── Detalii ── */}
        <SectionTitle>Detalii</SectionTitle>

        <div className="sm:col-span-2">
          <Field label="Adresă" required>
            <input name="address" type="text" required placeholder="ex: Str. Parcului 1, Sibiu" className={inputCls} />
          </Field>
        </div>

        <Field label="Preț (opțional)">
          <input name="price" type="text" placeholder='ex: "25 lei/oră" sau "Gratuit"' className={inputCls} />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Detalii preț (opțional)">
            <RichTextEditor name="price_details" placeholder="Pachete, abonamente, reduceri etc." minHeight={80} />
          </Field>
        </div>

        <Field label="Program (opțional)">
          <input name="schedule" type="text" placeholder="ex: Luni–Vineri 10:00–20:00" className={inputCls} />
        </Field>

        <Field label="Vârstă minimă (ani)">
          <input name="age_min" type="number" min={0} max={18} placeholder="ex: 2" className={inputCls} />
        </Field>

        <Field label="Vârstă maximă (ani)">
          <input name="age_max" type="number" min={0} max={18} placeholder="ex: 12" className={inputCls} />
        </Field>

        {/* ── Contact ── */}
        <SectionTitle>Contact public</SectionTitle>

        <Field label="Telefon" required>
          <input name="phone" type="tel" required placeholder="ex: 0722 123 456" className={inputCls} />
        </Field>

        <Field label="Website (opțional)">
          <input name="website" type="text" placeholder="ex: www.loculmeu.ro" className={inputCls} />
        </Field>

        {/* ── Fotografii ── */}
        <SectionTitle>Fotografii (opțional)</SectionTitle>

        <div className="sm:col-span-2">
          <ImageUploader
            endpoint="/api/upload-public"
            maxFiles={5}
          />
        </div>

        {/* ── Date persoană de contact (private) ── */}
        <SectionTitle>Persoană de contact (nu se afișează public)</SectionTitle>

        <Field label="Numele tău" required>
          <input name="contact_name" type="text" required placeholder="ex: Ion Popescu" className={inputCls} />
        </Field>

        <Field label="Email contact" required>
          <input name="contact_email" type="email" required placeholder="ex: contact@loculmeu.ro" className={inputCls} />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Mesaj pentru echipa Moosey (opțional)">
            <RichTextEditor name="notes" placeholder="Orice informație suplimentară care ne-ar ajuta să verificăm mai rapid locația..." minHeight={80} />
          </Field>
        </div>

      </div>

      {state.error && (
        <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm font-bold text-red-600">
          ⚠️ {state.error}
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4 flex-wrap">
        <SubmitButton />
        <p className="text-xs text-gray-400 font-medium">
          Câmpurile marcate cu <span className="text-[#ff5a2e]">*</span> sunt obligatorii
        </p>
      </div>
    </form>
  );
}
