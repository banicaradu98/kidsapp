import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import ScrollReveal from "@/app/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Despre Moosey",
  description: "Povestea și misiunea Moosey — platforma care aduce familiile din Sibiu mai aproape de tot ce contează pentru copiii lor.",
  alternates: { canonical: "https://www.moosey.ro/despre" },
  openGraph: {
    title: "Despre Moosey",
    description: "Platforma care aduce familiile din Sibiu mai aproape de tot ce contează pentru copiii lor.",
    url: "/despre",
  },
};

const CATEGORIES = [
  { emoji: "🛝", label: "Locuri de joacă", href: "/locuri-de-joaca" },
  { emoji: "🎓", label: "Educație",         href: "/educatie" },
  { emoji: "🎨", label: "Cursuri & Ateliere", href: "/cursuri-ateliere" },
  { emoji: "⚽", label: "Sport",            href: "/sport" },
  { emoji: "🎭", label: "Spectacole",        href: "/spectacole" },
  { emoji: "🎪", label: "Evenimente",        href: "/evenimente" },
];

const VALUES = [
  {
    icon: "🌟",
    title: "Comunitate",
    desc: "Susținem micii organizatori și antreprenorii locali care creează pentru copii și familii din Sibiu.",
  },
  {
    icon: "🗺️",
    title: "Descoperire",
    desc: "Ajutăm familiile să găsească activități, locuri și evenimente pe care altfel le-ar rata.",
  },
  {
    icon: "🤝",
    title: "Conexiune",
    desc: "Construim puntea dintre părinți și cei care fac lucruri frumoase pentru comunitate.",
  },
];

export default function DesprePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── 1. HERO ── */}
      <section className="relative bg-gradient-to-b from-white to-[#fff5f3] pt-16 pb-20 px-4 sm:pt-24 sm:pb-28 overflow-hidden">
        {/* Decorative dots pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #ff5a2e 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff5a2e] rounded-full opacity-[0.05] pointer-events-none translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ff5a2e] rounded-full opacity-[0.04] pointer-events-none -translate-x-1/3 translate-y-1/4" />

        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white border border-orange-100 text-[#ff5a2e] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-8 shadow-sm">
                <span>📍</span> Sibiu, România
              </div>
              <h1 className="font-display text-5xl sm:text-6xl font-bold text-[#1a1a2e] leading-[1.08] mb-6">
                Bine ai venit<br />
                <span className="text-[#ff5a2e]">în lumea Moosey</span>
              </h1>
              <p className="text-gray-500 text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
                Platforma care aduce familiile din Sibiu mai aproape de tot ce contează pentru copiii lor.
              </p>
            </div>

            {/* Mascot */}
            <div className="shrink-0 flex items-end justify-center lg:justify-end">
              <img
                src="/images/moosey_transparent.png"
                alt="Moosey"
                className="h-48 md:h-64 w-auto object-contain mascot-enter drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. POVESTEA NOASTRĂ ── */}
      <ScrollReveal>
        <section className="py-20 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Text */}
              <div>
                <p className="text-xs font-bold text-[#ff5a2e] uppercase tracking-widest mb-4">Povestea noastră</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1a1a2e] leading-tight mb-6">
                  De ce am creat Moosey?
                </h2>
                <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                  <p>
                    Sibiul este un oraș viu, plin de oameni care fac lucruri frumoase pentru comunitate —
                    ateliere creative, cursuri de robotică, spectacole pentru copii, locuri de joacă ascunse
                    și evenimente care merită descoperite.
                  </p>
                  <p className="font-semibold text-[#1a1a2e]">
                    Problema? Mulți părinți nu știu că există.
                  </p>
                  <p>
                    Moosey s-a născut din dorința de a aduce mai aproape de familii toate aceste opțiuni —
                    de a da vizibilitate micilor oameni care construiesc ceva pentru comunitate și de a face
                    mai ușor răspunsul la întrebarea eternă a oricărui părinte.
                  </p>
                </div>
              </div>

              {/* Quote card */}
              <div className="flex items-center justify-center">
                <div className="relative bg-gradient-to-br from-[#fff4f0] to-[#fff0e8] rounded-3xl p-10 max-w-sm w-full shadow-sm border border-orange-100">
                  <div className="absolute -top-5 -left-3 text-[#ff5a2e] opacity-20 select-none" style={{ fontSize: "100px", lineHeight: 1, fontFamily: "serif" }}>&ldquo;</div>
                  <p className="relative font-display text-3xl font-bold text-[#ff5a2e] leading-tight text-center z-10">
                    Ce facem azi cu copiii?
                  </p>
                  <div className="absolute -bottom-4 -right-2 text-[#ff5a2e] opacity-20 rotate-180 select-none" style={{ fontSize: "100px", lineHeight: 1, fontFamily: "serif" }}>&ldquo;</div>
                  <p className="text-center text-gray-400 text-sm font-semibold mt-6 relative z-10">
                    — Întrebarea la care Moosey răspunde în fiecare zi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── 3. MISIUNEA NOASTRĂ ── */}
      <ScrollReveal>
        <section className="py-20 md:py-24 px-4 bg-[#fff5f3]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-bold text-[#ff5a2e] uppercase tracking-widest mb-4">Ce ne ghidează</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1a1a2e] leading-tight mb-6">
                Misiunea noastră
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                Credem că fiecare copil din Sibiu merită să crească într-un oraș care îi oferă oportunități
                de a explora, învăța și se bucura. Moosey există pentru a conecta familiile cu experiențele
                care contează — și pentru a susține comunitatea locală care le face posibile.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border border-orange-50"
                >
                  <span className="text-4xl block mb-4">{v.icon}</span>
                  <h3 className="font-display text-xl font-bold text-[#1a1a2e] mb-3">{v.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── 4. CE GĂSEȘTI PE MOOSEY ── */}
      <ScrollReveal>
        <section className="py-20 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-[#ff5a2e] uppercase tracking-widest mb-4">Explorează</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1a1a2e] leading-tight">
                Tot ce ai nevoie,<br className="hidden sm:block" /> într-un singur loc
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat.href}
                  href={cat.href}
                  className="group bg-[#f9f9f9] hover:bg-white rounded-2xl p-6 flex flex-col items-center gap-3 text-center hover:shadow-md border border-transparent hover:border-[#ff5a2e]/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{cat.emoji}</span>
                  <span className="font-semibold text-[#1a1a2e] text-sm group-hover:text-[#ff5a2e] transition-colors">{cat.label}</span>
                </a>
              ))}
            </div>

            <p className="text-center text-gray-400 text-base font-medium mt-10 max-w-xl mx-auto leading-relaxed">
              Și în curând — mult mai mult. Suntem în continuă dezvoltare și căutăm activ parteneri
              care împărtășesc pasiunea pentru comunitate.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* ── 5. MARKETPLACE ── */}
      <ScrollReveal>
        <section className="py-20 md:py-24 px-4 bg-[#f7f7f7]">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Text */}
                <div className="p-8 sm:p-12 flex flex-col justify-center">
                  <p className="text-xs font-bold text-[#ff5a2e] uppercase tracking-widest mb-4">Marketplace</p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1a1a2e] leading-tight mb-5">
                    Marketplace pentru familii
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    Pe lângă activități și evenimente, Moosey găzduiește și un marketplace dedicat familiilor
                    din Sibiu — un spațiu unde poți vinde, dona sau închiria obiecte pentru copii.
                    De la cărucioare la jucării, de la hăinuțe la cărți — totul rămâne în comunitate.
                  </p>
                  <div>
                    <a
                      href="/marketplace"
                      className="inline-block bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black px-7 py-4 rounded-2xl text-base transition-all shadow-[0_4px_16px_rgba(255,90,46,0.25)] active:scale-[0.98]"
                    >
                      Explorează marketplace-ul →
                    </a>
                  </div>
                </div>

                {/* Illustration */}
                <div className="bg-gradient-to-br from-orange-50 to-[#fff4f0] p-10 flex items-center justify-center min-h-[260px]">
                  <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                    {[
                      { emoji: "🛒", label: "VÂND", color: "bg-[#ff5a2e] text-white" },
                      { emoji: "🎁", label: "DONEZ", color: "bg-emerald-500 text-white" },
                      { emoji: "🔄", label: "ÎNCHIRIEZ", color: "bg-sky-500 text-white" },
                      { emoji: "👶", label: "COPII", color: "bg-purple-400 text-white" },
                    ].map((item) => (
                      <div key={item.label} className="bg-white rounded-2xl p-5 shadow-sm flex flex-col items-center gap-2 border border-gray-100">
                        <span className="text-3xl">{item.emoji}</span>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${item.color}`}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── 6. DEVINO PARTENER ── */}
      <ScrollReveal>
        <section className="py-20 md:py-24 px-4 bg-[#ff5a2e]">
          <div className="max-w-3xl mx-auto text-center text-white">
            <p className="text-orange-200 text-xs font-bold uppercase tracking-widest mb-4">Parteneriate</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-6">
              Ai ceva de oferit comunității?
            </h2>
            <p className="text-orange-100 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              Dacă organizezi cursuri, ateliere, spectacole sau orice altceva pentru copii și familii
              din Sibiu, Moosey este locul potrivit pentru tine. Listează-te gratuit și fii descoperit
              de sute de familii din oraș.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/adauga-locatia-ta"
                className="inline-block bg-white text-[#ff5a2e] font-black px-8 py-4 rounded-2xl text-base hover:bg-orange-50 active:scale-[0.98] transition-all shadow-lg"
              >
                + Adaugă locația ta gratuit
              </a>
              <a
                href="mailto:hello@moosey.ro"
                className="inline-block bg-white/15 hover:bg-white/25 text-white font-black px-8 py-4 rounded-2xl text-base transition-all border border-white/30"
              >
                Contactează-ne
              </a>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── 7. MINI FOOTER ── */}
      <section className="py-14 px-4 text-center bg-white border-t border-gray-100">
        <img
          src="/images/moosey_transparent.png"
          alt="Moosey"
          className="h-16 w-auto object-contain mx-auto mb-4 opacity-80"
        />
        <p className="text-sm font-semibold text-gray-400">Moosey — Sibiu, 2026</p>
        <p className="text-sm text-gray-400 mt-1">Făcut cu ❤️ pentru familiile din Sibiu</p>
      </section>
    </div>
  );
}
