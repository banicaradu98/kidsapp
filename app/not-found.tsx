import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <span className="text-7xl mb-6">🔍</span>
      <h1 className="text-3xl font-black text-[#1a1a2e] mb-2">Locul nu a fost găsit</h1>
      <p className="text-gray-500 font-medium mb-8 max-w-sm">
        Locul pe care îl cauți nu mai există sau a fost mutat. Explorează celelalte activități din Sibiu!
      </p>
      <Link
        href="/"
        className="bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black px-8 py-4 rounded-2xl transition-colors text-base"
      >
        ← Înapoi la activități
      </Link>
    </div>
  );
}
