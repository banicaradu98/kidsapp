import { logoutAction } from "./actions";

export const metadata = { title: "Admin — KidsApp Sibiu" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-1.5">
            <span className="text-lg">🧡</span>
            <span className="font-black text-[#ff5a2e]">KidsApp</span>
          </a>
          <span className="text-gray-300">|</span>
          <a href="/admin" className="text-sm font-bold text-gray-700 hover:text-[#ff5a2e]">Dashboard</a>
          <a href="/admin/nou" className="text-sm font-bold text-gray-700 hover:text-[#ff5a2e]">+ Listing nou</a>
        </div>
        <form action={logoutAction}>
          <button className="text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors">
            Deconectare →
          </button>
        </form>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
