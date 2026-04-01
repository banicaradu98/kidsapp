import SubmitForm from "./SubmitForm";

export const metadata = { title: "Adaugă locația ta — KidsApp Sibiu" };

export default function AdaugaLocatiaPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <a
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors text-gray-500 shrink-0 text-lg"
            aria-label="Înapoi acasă"
          >
            ←
          </a>
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl">🧡</span>
            <span className="text-lg font-black text-[#ff5a2e]">KidsApp</span>
            <span className="hidden sm:inline text-sm font-semibold text-gray-400">Sibiu</span>
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-[#fff4f0] via-[#fff8f5] to-white pt-10 pb-8 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-bold px-4 py-2 rounded-full mb-5">
            <span>📍</span> Sibiu, România
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a1a2e] leading-tight mb-4">
            Adaugă locația ta<br />
            <span className="text-[#ff5a2e]">pe KidsApp</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium max-w-lg mx-auto leading-relaxed">
            Ajută părinții din Sibiu să îți descopere locul. Listare gratuită, publicare în maxim 48 de ore.
          </p>

          {/* Beneficii */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm font-semibold text-gray-500">
            <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Gratuit</span>
            <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Publicare rapidă</span>
            <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Vizibil pe hartă</span>
            <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Fără cont necesar</span>
          </div>
        </div>
      </section>

      {/* ── FORM ── */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_32px_rgba(0,0,0,0.06)] p-6 sm:p-8">
          <h2 className="text-lg font-black text-[#1a1a2e] mb-6">Completează detaliile locației</h2>
          <SubmitForm />
        </div>

        {/* Trust indicators */}
        <div className="mt-8 text-center text-xs text-gray-400 font-medium">
          Datele tale de contact sunt private și nu vor fi afișate public.
          Echipa KidsApp verifică fiecare listing înainte de publicare.
        </div>
      </main>

    </div>
  );
}
