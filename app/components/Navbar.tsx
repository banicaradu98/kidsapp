import MobileMenu from "@/app/MobileMenu";
import NavbarAuth from "./NavbarAuth";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🧡</span>
          <span className="text-xl font-black text-[#ff5a2e] tracking-tight">KidsApp</span>
          <span className="hidden sm:inline text-base font-semibold text-gray-400 ml-0.5">Sibiu</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-3 text-sm font-semibold text-gray-500">
          <a href="/locuri-de-joaca"  className="hover:text-[#ff5a2e] transition-colors">🛝 Joacă</a>
          <a href="/educatie"         className="hover:text-[#ff5a2e] transition-colors">🎓 Educație</a>
          <a href="/cursuri-ateliere" className="hover:text-[#ff5a2e] transition-colors">🎨 Cursuri</a>
          <a href="/sport"            className="hover:text-[#ff5a2e] transition-colors">⚽ Sport</a>
          <a href="/spectacole"       className="hover:text-[#ff5a2e] transition-colors">🎭 Spectacole</a>
          <a href="/evenimente"       className="hover:text-[#ff5a2e] transition-colors">🎪 Evenimente</a>
        </nav>

        <NavbarAuth />

        <a
          href="/adauga-locatia-ta"
          className="hidden md:block bg-[#ff5a2e] hover:bg-[#f03d12] text-white text-base font-bold px-5 py-2.5 rounded-full transition-colors shadow-sm whitespace-nowrap"
        >
          + Adaugă locația ta
        </a>

        {/* Mobile hamburger */}
        <MobileMenu />
      </div>
    </header>
  );
}
