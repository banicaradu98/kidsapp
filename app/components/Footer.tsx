export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-3">
              <img
                src="/images/logo-moosey.png"
                alt="Moosey"
                style={{ height: "80px", width: "auto", objectFit: "contain" }}
              />
            </div>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              Descoperă cele mai frumoase locuri pentru copiii din Sibiu. Activități, spectacole, locuri de joacă.
            </p>
          </div>

          {/* Categorii */}
          <div>
            <p className="font-black text-white text-sm mb-4 uppercase tracking-wide">Categorii</p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Locuri de joacă", href: "/locuri-de-joaca" },
                { label: "Educație", href: "/educatie" },
                { label: "Cursuri & Ateliere", href: "/cursuri-ateliere" },
                { label: "Sport", href: "/sport" },
                { label: "Spectacole", href: "/spectacole" },
                { label: "Evenimente", href: "/evenimente" },
              ].map((link) => (
                <a key={link.label} href={link.href} className="text-gray-400 hover:text-[#ff5a2e] text-sm font-semibold transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Utile */}
          <div>
            <p className="font-black text-white text-sm mb-4 uppercase tracking-wide">Utile</p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "📅 Calendar evenimente", href: "/calendar" },
                { label: "+ Adaugă locația ta", href: "/adauga-locatia-ta" },
                { label: "❤️ Favorite", href: "/favorite" },
                { label: "Dashboard organizator", href: "/dashboard" },
                { label: "Despre Moosey", href: "#" },
                { label: "Contact", href: "#" },
              ].map((link) => (
                <a key={link.label} href={link.href} className="text-gray-400 hover:text-[#ff5a2e] text-sm font-semibold transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="font-black text-white text-sm mb-4 uppercase tracking-wide">Info</p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Politica de confidențialitate", href: "/politica-de-confidentialitate" },
                { label: "Termeni și condiții", href: "/termeni-si-conditii" },
                { label: "GDPR", href: "/gdpr" },
              ].map((link) => (
                <a key={link.label} href={link.href} className="text-gray-400 hover:text-[#ff5a2e] text-sm font-semibold transition-colors">
                  {link.label}
                </a>
              ))}
              <div className="mt-4 bg-white/5 rounded-xl p-3">
                <p className="text-xs text-gray-500 font-semibold mb-1">📍 Sibiu, România</p>
                <p className="text-xs text-gray-500 font-medium">hello@moosey.ro</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500 font-medium">
            © 2026 Moosey. Făcut cu 🧡 pentru familiile din Sibiu.
          </p>
          <p className="text-xs text-gray-600 font-medium">
            Toate drepturile rezervate
          </p>
        </div>
      </div>
    </footer>
  );
}
