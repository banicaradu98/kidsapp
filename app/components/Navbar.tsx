import MobileMenu from "@/app/MobileMenu";
import NavbarAuth from "./NavbarAuth";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#f0f0f0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl">🧡</span>
          <span className="font-display text-xl font-bold text-[#ff5a2e]">KidsApp</span>
          <span className="hidden sm:inline text-sm font-medium text-gray-400 ml-0.5">Sibiu</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5 text-sm font-medium text-[#374151]">
          <a href="/locuri-de-joaca"  className="px-3 py-2 rounded-lg hover:text-[#ff5a2e] transition-colors duration-200">🛝 Joacă</a>
          <a href="/educatie"         className="px-3 py-2 rounded-lg hover:text-[#ff5a2e] transition-colors duration-200">🎓 Educație</a>
          <a href="/cursuri-ateliere" className="px-3 py-2 rounded-lg hover:text-[#ff5a2e] transition-colors duration-200">🎨 Cursuri</a>
          <a href="/sport"            className="px-3 py-2 rounded-lg hover:text-[#ff5a2e] transition-colors duration-200">⚽ Sport</a>
          <a href="/spectacole"       className="px-3 py-2 rounded-lg hover:text-[#ff5a2e] transition-colors duration-200">🎭 Spectacole</a>
          <a href="/evenimente"       className="px-3 py-2 rounded-lg hover:text-[#ff5a2e] transition-colors duration-200">🎪 Evenimente</a>
        </nav>

        <NavbarAuth />

        <a
          href="/adauga-locatia-ta"
          className="hidden md:block border border-[#ff5a2e] text-[#ff5a2e] hover:bg-[#ff5a2e] hover:text-white text-sm font-semibold px-5 py-2 rounded-full transition-all duration-200 whitespace-nowrap"
        >
          + Adaugă locația ta
        </a>

        {/* Mobile hamburger */}
        <MobileMenu />
      </div>
    </header>
  );
}
