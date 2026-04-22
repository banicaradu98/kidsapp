"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Este gratuit pentru părinți?",
    a: "Da, complet gratuit. Moosey e gratuit pentru toți părinții care vor să descopere activități pentru copii.",
  },
  {
    q: "Cât costă să adaug locația mea?",
    a: "Listarea de bază e gratuită. Oferim și pachete premium cu vizibilitate sporită, apariție pe homepage și funcționalități extra.",
  },
  {
    q: "Cât durează până apare locația mea?",
    a: "Verificăm fiecare locație înainte de publicare. De obicei durează maxim 48 de ore.",
  },
  {
    q: "Pot să editez datele după publicare?",
    a: "Da. După ce revendici pagina ai acces la dashboard-ul tău unde poți modifica descrierea, programul, prețurile, poza de cover și poți adăuga evenimente sau noutăți.",
  },
  {
    q: "Ce fac dacă locația mea nu e pe platformă?",
    a: 'Folosește formularul "Adaugă locația ta" și o publicăm în maxim 48 de ore. E gratuit și durează doar câteva minute.',
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {FAQS.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`rounded-2xl border transition-all ${
              isOpen ? "border-[#ff5a2e] bg-orange-50" : "border-gray-200 bg-white"
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className={`font-bold text-sm sm:text-base ${isOpen ? "text-[#ff5a2e]" : "text-[#1a1a2e]"}`}>
                {faq.q}
              </span>
              <span
                className={`text-xl font-black shrink-0 transition-transform ${
                  isOpen ? "rotate-45 text-[#ff5a2e]" : "text-gray-400"
                }`}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5">
                <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
