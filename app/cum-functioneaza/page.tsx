import Navbar from "@/app/components/Navbar";
import FaqAccordion from "./FaqAccordion";

export const metadata = {
  title: "Cum funcționează Moosey?",
  description:
    "Află cum funcționează Moosey — platforma care conectează părinții cu locurile și activitățile pentru copii. Simplu, rapid, gratuit.",
  alternates: { canonical: "/cum-functioneaza" },
  openGraph: {
    title: "Cum funcționează Moosey? — Moosey",
    description: "Desoperă cum să găsești sau să adaugi activități pentru copii în Sibiu.",
    url: "/cum-functioneaza",
  },
};

const PARENT_STEPS = [
  {
    num: "1",
    emoji: "🔍",
    title: "Caută",
    desc: "Explorează sute de locuri de joacă, cursuri, ateliere și spectacole pentru copii din Sibiu.",
  },
  {
    num: "2",
    emoji: "📋",
    title: "Descoperă",
    desc: "Vezi detalii complete: program, prețuri, vârste, poze și reviews de la alți părinți.",
  },
  {
    num: "3",
    emoji: "📞",
    title: "Mergi",
    desc: "Sună direct sau salvează locul la favorite pentru mai târziu.",
  },
];

const ORGANIZER_STEPS = [
  {
    num: "1",
    emoji: "📝",
    title: "Adaugă locația",
    desc: "Completează un formular simplu cu datele locației tale — gratuit și rapid.",
  },
  {
    num: "2",
    emoji: "🔑",
    title: "Revendică pagina",
    desc: "Dacă locația ta e deja pe platformă, revendic-o și preia controlul.",
  },
  {
    num: "3",
    emoji: "🛠️",
    title: "Gestionează",
    desc: "Adaugă poze, evenimente, noutăți și răspunde la reviews din dashboard-ul tău.",
  },
  {
    num: "4",
    emoji: "📈",
    title: "Crești",
    desc: "Fii descoperit de mii de părinți din Sibiu care caută exact ce oferi tu.",
  },
];

export default function CumFunctioneazaPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative bg-[#1a1a2e] text-white overflow-hidden">
        {/* dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #ff5a2e 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <p className="text-4xl mb-4">🧡</p>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-4">
            Cum funcționează Moosey?
          </h1>
          <p className="text-base sm:text-xl text-gray-300 font-medium leading-relaxed max-w-xl mx-auto">
            Platforma care conectează părinții din Sibiu cu cele mai frumoase locuri și activități pentru copii.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* ── PENTRU PĂRINȚI ── */}
        <section className="py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a2e] mb-2">
              Pentru părinți 👨‍👩‍👧
            </h2>
            <p className="text-gray-500 font-medium">
              Găsește rapid activitatea perfectă pentru copilul tău
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {PARENT_STEPS.map((step) => (
              <div key={step.num} className="relative bg-orange-50 border border-orange-100 rounded-3xl p-6 text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#ff5a2e] text-white rounded-full flex items-center justify-center text-sm font-black shadow-md">
                  {step.num}
                </div>
                <p className="text-4xl mb-3 mt-2">{step.emoji}</p>
                <h3 className="text-lg font-black text-[#1a1a2e] mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="/"
              className="inline-block bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black px-8 py-4 rounded-2xl text-base transition-colors shadow-[0_4px_16px_rgba(255,90,46,0.25)]"
            >
              Explorează locurile →
            </a>
          </div>
        </section>

        {/* divider */}
        <div className="border-t border-gray-100" />

        {/* ── PENTRU ORGANIZATORI ── */}
        <section className="py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a2e] mb-2">
              Pentru organizatori 🏫
            </h2>
            <p className="text-gray-500 font-medium">
              Adaugă-ți locația și fii descoperit de mii de familii din Sibiu
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {ORGANIZER_STEPS.map((step) => (
              <div key={step.num} className="relative bg-gray-50 border border-gray-100 rounded-3xl p-6 text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#1a1a2e] text-white rounded-full flex items-center justify-center text-sm font-black shadow-md">
                  {step.num}
                </div>
                <p className="text-4xl mb-3 mt-2">{step.emoji}</p>
                <h3 className="text-base font-black text-[#1a1a2e] mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="/adauga-locatia-ta"
              className="inline-block bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black px-8 py-4 rounded-2xl text-base transition-colors shadow-[0_4px_16px_rgba(255,90,46,0.25)]"
            >
              Adaugă locația ta gratuit →
            </a>
          </div>
        </section>

        {/* divider */}
        <div className="border-t border-gray-100" />

        {/* ── FAQ ── */}
        <section className="py-16 sm:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a2e] mb-2">
              Întrebări frecvente
            </h2>
            <p className="text-gray-500 font-medium">Ai o întrebare? Răspunsul e probabil aici.</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <FaqAccordion />
          </div>
        </section>

      </main>

      {/* ── CTA FINAL ── */}
      <section className="bg-[#ff5a2e] text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <p className="text-3xl mb-4">🧡</p>
          <h2 className="text-2xl sm:text-3xl font-black mb-3 leading-tight">
            Gata să descoperi Sibiul cu copilul tău?
          </h2>
          <p className="text-orange-100 font-medium mb-8 leading-relaxed">
            Sute de locuri, cursuri și activități te așteaptă.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="inline-block bg-white text-[#ff5a2e] font-black px-7 py-4 rounded-2xl text-base transition-all hover:bg-orange-50 shadow-sm"
            >
              Explorează locurile
            </a>
            <a
              href="/adauga-locatia-ta"
              className="inline-block border-2 border-white text-white font-black px-7 py-4 rounded-2xl text-base transition-all hover:bg-white/10"
            >
              Adaugă locația ta
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
