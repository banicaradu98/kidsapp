import Link from "next/link";

export default function CategoryShell({
  title,
  subtitle,
  emoji,
  count,
  children,
}: {
  title: string;
  subtitle: string;
  emoji: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors text-gray-600 text-lg shrink-0">
            ←
          </Link>
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <span className="text-xl">🧡</span>
            <span className="text-lg font-black text-[#ff5a2e]">KidsApp</span>
          </Link>
          <span className="text-gray-300 hidden sm:block">|</span>
          <span className="text-base font-bold text-gray-600 truncate hidden sm:block">{title}</span>
        </div>
      </header>

      {/* Page title */}
      <div className="bg-white border-b border-gray-100 px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">{emoji}</span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a2e]">{title}</h1>
          </div>
          <p className="text-base text-gray-500 font-medium mt-1">{subtitle}</p>
          <p className="text-base font-bold text-[#ff5a2e] mt-2">
            {count} {count === 1 ? "loc găsit" : "locuri găsite"} în Sibiu
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-8 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span>🧡</span>
          <span className="font-black text-[#ff5a2e]">KidsApp Sibiu</span>
        </div>
        <p className="text-sm text-gray-400 font-medium">© 2025 · Făcut cu drag pentru familiile din Sibiu</p>
      </footer>

    </div>
  );
}
