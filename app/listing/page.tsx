export default function ListingPage() {
  const facilities = [
    { icon: "🅿️", label: "Parcare" },
    { icon: "🚽", label: "Toaletă copii" },
    { icon: "☕", label: "Cafeteria" },
    { icon: "📶", label: "WiFi" },
    { icon: "🏠", label: "Indoor" },
  ];

  const reviews = [
    {
      name: "Maria P.",
      rating: 5,
      date: "Martie 2025",
      text: "Copiii s-au distrat extraordinar! Spațiu curat, personal amabil și prețuri corecte. Revenim cu siguranță în fiecare weekend.",
    },
    {
      name: "Andrei T.",
      rating: 5,
      date: "Februarie 2025",
      text: "Locul ideal pentru o după-amiază ploioasă. Fetița mea de 4 ani nu a vrut să plece. Cafeteria pentru părinți este un bonus excelent.",
    },
    {
      name: "Elena M.",
      rating: 4,
      date: "Ianuarie 2025",
      text: "Foarte ok, dar weekendurile sunt cam aglomerate. Recomand să mergeți în cursul săptămânii pentru mai mult spațiu.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center">
              <img src="/images/logo-moosey.png" alt="Moosey" className="h-10 w-auto object-contain" />
            </a>
          </div>
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <a href="/" className="hover:text-[#ff5a2e] transition-colors font-semibold hidden sm:block">← Înapoi la listă</a>
          </nav>
          <button className="bg-[#ff5a2e] hover:bg-[#f03d12] text-white text-sm font-bold px-4 py-2 rounded-full transition-colors shadow-sm whitespace-nowrap">
            + Adaugă locația ta
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── BREADCRUMB ── */}
        <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mb-5">
          <a href="/" className="hover:text-[#ff5a2e] transition-colors">Acasă</a>
          <span>›</span>
          <a href="/" className="hover:text-[#ff5a2e] transition-colors">Locuri de joacă</a>
          <span>›</span>
          <span className="text-gray-600">Sala de Joacă Dumbrava</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── MAIN COLUMN ── */}
          <div className="flex-1 min-w-0">

            {/* ── GALLERY ── */}
            <div className="grid grid-cols-3 gap-2 rounded-3xl overflow-hidden mb-6 h-64 sm:h-80">
              <div className="col-span-2 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center relative">
                <span className="text-7xl">🛝</span>
                <span className="absolute bottom-3 left-3 bg-black/40 text-white text-xs font-bold px-3 py-1 rounded-full">
                  1 / 3
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex-1 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center rounded-none">
                  <span className="text-4xl">🎠</span>
                </div>
                <div className="flex-1 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center relative">
                  <span className="text-4xl">🏊</span>
                  <button className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors">
                    <span className="text-white text-xs font-bold bg-black/40 px-3 py-1.5 rounded-full">+3 poze</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── TITLE BLOCK ── */}
            <div className="mb-6">
              <div className="flex flex-wrap items-start gap-3 mb-2">
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full">🛝 Loc de joacă</span>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">✓ Verificat</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#1a1a2e] leading-tight mb-3">
                Sala de Joacă Dumbrava
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-500">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="text-gray-800 font-bold">4.8</span>
                  <span className="text-gray-400">(24 recenzii)</span>
                </div>
                <span>👶 2–10 ani</span>
                <span>📍 Sibiu</span>
              </div>
            </div>

            {/* ── INFO CARDS ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
                <p className="text-xs text-gray-400 font-semibold mb-1">Preț</p>
                <p className="text-lg font-black text-[#ff5a2e]">25 lei</p>
                <p className="text-xs text-gray-500 font-medium">/copil</p>
              </div>
              <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4">
                <p className="text-xs text-gray-400 font-semibold mb-1">Vârstă</p>
                <p className="text-lg font-black text-sky-600">2–10 ani</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4 col-span-2 sm:col-span-2">
                <p className="text-xs text-gray-400 font-semibold mb-1">Program</p>
                <p className="text-sm font-bold text-green-700">Luni–Vineri: 10:00–20:00</p>
                <p className="text-sm font-bold text-green-700">Weekend: 10:00–18:00</p>
              </div>
            </div>

            {/* ── DESCRIPTION ── */}
            <section className="mb-8">
              <h2 className="text-xl font-black text-[#1a1a2e] mb-3">Despre loc</h2>
              <p className="text-gray-600 font-medium leading-relaxed mb-3">
                Sala de Joacă Dumbrava este un spațiu indoor modern de aproape 800 mp, dedicat copiilor cu vârste între 2 și 10 ani. Situat în apropierea Pădurii Dumbrava din Sibiu, oferă un mediu sigur și stimulativ unde cei mici pot explora, alerga și socializa.
              </p>
              <p className="text-gray-600 font-medium leading-relaxed mb-3">
                Spațiul include zone tematice diferite: un labirint cu tobogane, o zonă de tramboline, un colț creativ cu Lego și seturi de construcție, precum și o zonă moale pentru bebeluși. Toate echipamentele sunt certificate CE și igienizate zilnic.
              </p>
              <p className="text-gray-600 font-medium leading-relaxed">
                Părinții se pot relaxa la cafeteria noastră cu vedere spre zona de joacă, bucurându-se de o cafea caldă în timp ce copiii se distrează. Organizăm și petreceri aniversare personalizate — contactați-ne pentru detalii și pachete speciale.
              </p>
            </section>

            {/* ── FACILITIES ── */}
            <section className="mb-8">
              <h2 className="text-xl font-black text-[#1a1a2e] mb-4">Facilități</h2>
              <div className="flex flex-wrap gap-3">
                {facilities.map((f) => (
                  <div key={f.label} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
                    <span className="text-lg">{f.icon}</span>
                    <span className="text-sm font-bold text-gray-700">{f.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── LOCATION ── */}
            <section className="mb-8">
              <h2 className="text-xl font-black text-[#1a1a2e] mb-3">Locație</h2>
              <div className="flex items-center gap-2 text-gray-600 font-semibold mb-3">
                <span>📍</span>
                <span>Strada Școala de Înot 2, Sibiu 550176</span>
              </div>
              {/* Maps placeholder */}
              <div className="w-full h-56 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border border-green-200 flex flex-col items-center justify-center gap-2">
                <span className="text-4xl">🗺️</span>
                <p className="text-sm font-bold text-gray-500">Hartă Google Maps</p>
                <a
                  href="https://maps.google.com/?q=Strada+Scoala+de+Inot+2+Sibiu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#ff5a2e] hover:underline"
                >
                  Deschide în Google Maps →
                </a>
              </div>
            </section>

            {/* ── REVIEWS ── */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-[#1a1a2e]">Recenzii</h2>
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-400 text-lg">★</span>
                  <span className="font-black text-gray-800">4.8</span>
                  <span className="text-gray-400 text-sm font-medium">(24 recenzii)</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {reviews.map((r) => (
                  <div key={r.name} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#ff5a2e]/10 flex items-center justify-center font-black text-[#ff5a2e] text-sm">
                          {r.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{r.name}</p>
                          <p className="text-xs text-gray-400 font-medium">{r.date}</p>
                        </div>
                      </div>
                      <div className="flex text-yellow-400 text-sm">
                        {"★".repeat(r.rating)}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm font-medium leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA mobile (visible only below lg) */}
            <div className="lg:hidden flex flex-col gap-3 pb-4">
              <a
                href="tel:0722123456"
                className="w-full bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black text-base py-4 rounded-2xl text-center transition-colors shadow-sm"
              >
                📞 Sună acum: 0722 123 456
              </a>
              <button className="w-full border-2 border-[#ff5a2e] text-[#ff5a2e] font-black text-base py-4 rounded-2xl text-center hover:bg-orange-50 transition-colors">
                ✉️ Trimite mesaj
              </button>
            </div>

          </div>

          {/* ── SIDEBAR ── */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 border-b border-orange-100">
                  <p className="text-xs font-bold text-gray-400 mb-1">Preț de intrare</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[#ff5a2e]">25 lei</span>
                    <span className="text-sm font-semibold text-gray-500">/ copil</span>
                  </div>
                  <p className="text-xs text-gray-400 font-medium mt-1">Părinții intră gratuit</p>
                </div>

                <div className="p-5 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-400 mb-2">Program de funcționare</p>
                  <div className="flex flex-col gap-1.5 text-sm font-semibold">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Luni – Vineri</span>
                      <span className="text-green-600">10:00 – 20:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sâmbătă – Duminică</span>
                      <span className="text-green-600">10:00 – 18:00</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                    <span className="text-xs font-bold text-green-600">Deschis acum</span>
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-3">
                  <a
                    href="tel:0722123456"
                    className="w-full bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black text-sm py-3.5 rounded-xl text-center transition-colors shadow-sm"
                  >
                    📞 Sună acum: 0722 123 456
                  </a>
                  <button className="w-full border-2 border-[#ff5a2e] text-[#ff5a2e] font-black text-sm py-3.5 rounded-xl hover:bg-orange-50 transition-colors">
                    ✉️ Trimite mesaj
                  </button>
                  <button className="w-full text-gray-400 hover:text-gray-600 font-semibold text-xs py-2 transition-colors">
                    🔖 Salvează locul
                  </button>
                </div>
              </div>

              {/* Quick info */}
              <div className="mt-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 mb-3">Informații rapide</p>
                <div className="flex flex-col gap-2 text-sm font-semibold text-gray-600">
                  <div className="flex items-center gap-2"><span>👶</span> Vârstă: 2–10 ani</div>
                  <div className="flex items-center gap-2"><span>🏠</span> Indoor</div>
                  <div className="flex items-center gap-2"><span>🅿️</span> Parcare disponibilă</div>
                  <div className="flex items-center gap-2"><span>📍</span> Str. Școala de Înot 2</div>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 bg-gray-50 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <img src="/images/logo-moosey.png" alt="Moosey" className="h-8 w-auto object-contain" />
            </div>
            <nav className="flex flex-wrap justify-center gap-5 text-sm font-semibold text-gray-500">
              <a href="#" className="hover:text-[#ff5a2e] transition-colors">Despre noi</a>
              <a href="#" className="hover:text-[#ff5a2e] transition-colors">Contact</a>
              <a href="#" className="hover:text-[#ff5a2e] transition-colors">Adaugă locația</a>
              <a href="#" className="hover:text-[#ff5a2e] transition-colors">Confidențialitate</a>
            </nav>
          </div>
          <p className="text-center text-xs text-gray-400 font-medium mt-6">
            © 2025 Moosey. Făcut cu 🧡 pentru familiile din Sibiu.
          </p>
        </div>
      </footer>

    </div>
  );
}
